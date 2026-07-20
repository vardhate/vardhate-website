import React, { useState } from 'react';
import { updateDatabase, uploadAsset } from '../utils/api';

const AdminPanel = ({ db, onUpdateDB, onExit }) => {
  const [activeTab, setActiveTab] = useState('settings');
  const [localDB, setLocalDB] = useState(JSON.parse(JSON.stringify(db)));
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState('');
  const [activeProjectTab, setActiveProjectTab] = useState(localDB.clientScripts?.[0]?.id || '');

  const handleSave = async (updatedDB) => {
    try {
      const data = updatedDB || localDB;
      await updateDatabase(data);
      onUpdateDB(data);
      alert('Settings saved successfully!');
    } catch (err) {
      alert(`Save failed: ${err.message}`);
    }
  };

  // 1. Settings Submit handler
  const handleSettingsSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const updated = { ...localDB };
    
    updated.settings.companyName = formData.get('companyName');
    updated.settings.tagline = formData.get('tagline');
    updated.settings.primaryColor = formData.get('primaryColor');
    updated.settings.accentColor = formData.get('accentColor');
    updated.settings.email = formData.get('email');
    updated.settings.phone = formData.get('phone');
    updated.settings.whatsapp = formData.get('whatsapp');
    updated.settings.address = formData.get('address');
    updated.settings.googleMap = formData.get('googleMap');

    setLocalDB(updated);
    handleSave(updated);
  };

  // 2. Section Builder toggle
  const toggleSection = (key) => {
    const updated = { ...localDB };
    updated.sections[key].enabled = !updated.sections[key].enabled;
    setLocalDB(updated);
    handleSave(updated);
  };

  // 3. Section Move handler
  const moveSection = (key, dir) => {
    const updated = { ...localDB };
    const idx = updated.sectionOrder.indexOf(key);
    if (idx === -1) return;
    const targetIdx = idx + dir;
    if (targetIdx < 0 || targetIdx >= updated.sectionOrder.length) return;

    // Swap
    const temp = updated.sectionOrder[idx];
    updated.sectionOrder[idx] = updated.sectionOrder[targetIdx];
    updated.sectionOrder[targetIdx] = temp;

    setLocalDB(updated);
    handleSave(updated);
  };

  // 4. Hero Content submit
  const handleHeroSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const updated = { ...localDB };

    updated.sections.hero.badge = formData.get('badge');
    updated.sections.hero.title = formData.get('title');
    updated.sections.hero.subtitle = formData.get('subtitle');

    setLocalDB(updated);
    handleSave(updated);
  };

  // 5. Add Service handler
  const handleAddService = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const updated = { ...localDB };

    const newService = {
      id: `S${updated.services.length + 1}`,
      title: formData.get('title'),
      desc: formData.get('desc'),
      icon: formData.get('icon') || 'activity'
    };

    updated.services.push(newService);
    setLocalDB(updated);
    handleSave(updated);
    e.target.reset();
  };

  // 6. Delete Service handler
  const handleDeleteService = (idx) => {
    if (!window.confirm('Delete this service?')) return;
    const updated = { ...localDB };
    updated.services.splice(idx, 1);
    setLocalDB(updated);
    handleSave(updated);
  };

  // 7. Config export / import
  const handleExport = () => {
    const blob = new Blob([JSON.stringify(localDB, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vardhate-cms-backup-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const parsed = JSON.parse(evt.target.result);
        if (!parsed.settings || !parsed.sections) {
          throw new Error('Config missing settings/sections properties.');
        }
        setLocalDB(parsed);
        handleSave(parsed);
        alert('Config imported successfully!');
      } catch (err) {
        alert(`Import failed: ${err.message}`);
      }
    };
    reader.readAsText(file);
  };

  // 8. CRM: Add Project
  const handleAddProject = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const updated = { ...localDB };
    if (!updated.clientScripts) updated.clientScripts = [];

    const newProj = {
      id: `proj-${Date.now()}`,
      clientName: formData.get('clientName'),
      projectName: formData.get('projectName'),
      chapters: []
    };

    updated.clientScripts.push(newProj);
    setLocalDB(updated);
    handleSave(updated);
    setActiveProjectTab(newProj.id);
    e.target.reset();
  };

  // 9. CRM: Delete Project
  const handleDeleteProject = (projId) => {
    if (!window.confirm('Delete this client campaign project and all its script chapters?')) return;
    const updated = { ...localDB };
    updated.clientScripts = updated.clientScripts.filter(p => p.id !== projId);
    setLocalDB(updated);
    handleSave(updated);
    if (activeProjectTab === projId) {
      setActiveProjectTab(updated.clientScripts[0]?.id || '');
    }
  };

  // 10. CRM: Add Chapter
  const handleAddChapter = (e, projId) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const updated = { ...localDB };
    const project = updated.clientScripts.find(p => p.id === projId);
    if (!project) return;

    const newChapter = {
      id: `ch-${Date.now()}`,
      title: formData.get('title'),
      speaker: formData.get('speaker') || 'VOICEOVER SPEAKER',
      text: formData.get('text'),
      insight: formData.get('insight'),
      audioSrc: formData.get('audioSrc'),
      duration: formData.get('duration') || '00:30',
      seconds: parseInt(formData.get('seconds')) || 30
    };

    if (!project.chapters) project.chapters = [];
    project.chapters.push(newChapter);
    setLocalDB(updated);
    handleSave(updated);
    e.target.reset();
  };

  // 11. CRM: Delete Chapter
  const handleDeleteChapter = (projId, chId) => {
    if (!window.confirm('Delete this chapter?')) return;
    const updated = { ...localDB };
    const project = updated.clientScripts.find(p => p.id === projId);
    if (!project) return;

    project.chapters = project.chapters.filter(ch => ch.id !== chId);
    setLocalDB(updated);
    handleSave(updated);
  };

  // 12. Asset Uploader
  const handleAssetUpload = async (e) => {
    e.preventDefault();
    if (!uploadFile) return;

    setUploadProgress('Uploading file to server...');
    try {
      const response = await uploadAsset(uploadFile);
      setUploadProgress(`Upload finished: ${response.filename}`);
      alert(`Asset saved at: ${response.url}. You can now configure this filename in the CMS.`);
      setUploadFile(null);
    } catch (err) {
      setUploadProgress(`Upload failed: ${err.message}`);
    }
  };

  const selectedProj = localDB.clientScripts?.find(p => p.id === activeProjectTab);

  return (
    <div className="admin-layout" style={{ display: 'flex', minHeight: '100vh', background: '#0b0f19', color: '#e2e8f0', fontFamily: "'Inter', sans-serif" }}>
      
      {/* Sidebar navigation */}
      <aside className="admin-sidebar" style={{ width: '260px', background: '#0f172a', borderRight: '1px solid #1e293b', padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column' }}>
        <div style={{ paddingBottom: '1.5rem', borderBottom: '1px solid #1e293b', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 900, letterSpacing: '-0.05em', color: 'white' }}>
            VARDHATE <span style={{ color: '#2450a4' }}>CMS</span>
          </h1>
          <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>Dynamic Client Portal Admin</p>
        </div>

        <nav className="admin-nav" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <button className={`admin-nav-btn ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')}>⚙ Global Settings</button>
          <button className={`admin-nav-btn ${activeTab === 'builder' ? 'active' : ''}`} onClick={() => setActiveTab('builder')}>🗂 Homepage Builder</button>
          <button className={`admin-nav-btn ${activeTab === 'services' ? 'active' : ''}`} onClick={() => setActiveTab('services')}>⚒ Services Module</button>
          <button className={`admin-nav-btn ${activeTab === 'crm' ? 'active' : ''}`} onClick={() => setActiveTab('crm')}>💼 Corporate CRM Scripts</button>
          <button className={`admin-nav-btn ${activeTab === 'assets' ? 'active' : ''}`} onClick={() => setActiveTab('assets')}>🎬 Video Asset uploader</button>
          <button className={`admin-nav-btn ${activeTab === 'backup' ? 'active' : ''}`} onClick={() => setActiveTab('backup')}>🗀 Backup & Import</button>
        </nav>

        <div style={{ marginTop: 'auto', borderTop: '1px solid #1e293b', paddingTop: '1.5rem' }}>
          <button onClick={onExit} className="admin-btn" style={{ width: '100%', background: '#334155' }}>
            Exit CMS View
          </button>
        </div>
      </aside>

      {/* Workspace panel */}
      <main className="admin-main" style={{ flex: 1, padding: '3rem', overflowY: 'auto' }}>
        
        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="admin-card">
            <h2 className="admin-title">Global Website Settings</h2>
            <form onSubmit={handleSettingsSubmit}>
              <label className="admin-label">Company Name</label>
              <input type="text" className="admin-input" name="companyName" defaultValue={localDB.settings.companyName} />
              
              <label className="admin-label">Brand Tagline / Position</label>
              <input type="text" className="admin-input" name="tagline" defaultValue={localDB.settings.tagline} />
              
              <label className="admin-label">Primary Color Code</label>
              <input type="text" className="admin-input" name="primaryColor" defaultValue={localDB.settings.primaryColor} />
              
              <label className="admin-label">Accent Color Code</label>
              <input type="text" className="admin-input" name="accentColor" defaultValue={localDB.settings.accentColor} />
              
              <label className="admin-label">Contact Email</label>
              <input type="email" className="admin-input" name="email" defaultValue={localDB.settings.email} />
              
              <label className="admin-label">Contact Phone</label>
              <input type="text" className="admin-input" name="phone" defaultValue={localDB.settings.phone} />
              
              <label className="admin-label">WhatsApp Contact</label>
              <input type="text" className="admin-input" name="whatsapp" defaultValue={localDB.settings.whatsapp} />

              <label className="admin-label">Office Address</label>
              <input type="text" className="admin-input" name="address" defaultValue={localDB.settings.address} />

              <label className="admin-label">Google Map Embed Link</label>
              <input type="text" className="admin-input" name="googleMap" defaultValue={localDB.settings.googleMap} />
              
              <button type="submit" className="admin-btn" style={{ marginTop: '1.5rem' }}>Save Settings</button>
            </form>
          </div>
        )}

        {/* Builder Tab */}
        {activeTab === 'builder' && (
          <div className="admin-card">
            <h2 className="admin-title">Homepage Section Builder</h2>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Enable, disable, or reorder the modules rendered on the VARDHATE landing page.</p>
            
            <div className="drag-list" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '3rem' }}>
              {localDB.sectionOrder.map((sectionKey, index) => {
                const section = localDB.sections[sectionKey];
                if (!section) return null;
                return (
                  <div className="drag-item" key={sectionKey} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#1e293b', padding: '1rem', borderRadius: '8px' }}>
                    <div className="drag-item-left" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span className="drag-handle" style={{ cursor: 'grab', opacity: 0.5 }}>☰</span>
                      <span style={{ fontWeight: 600, color: 'white' }}>{sectionKey.toUpperCase()}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <input 
                        type="checkbox" 
                        id={`enable-${sectionKey}`} 
                        checked={!!section.enabled} 
                        onChange={() => toggleSection(sectionKey)} 
                      />
                      <label htmlFor={`enable-${sectionKey}`} style={{ fontSize: '0.8rem', cursor: 'pointer', color: '#94a3b8', marginRight: '1rem' }}>Enabled</label>
                      <button className="admin-btn" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', background: '#475569' }} onClick={() => moveSection(sectionKey, -1)}>▲</button>
                      <button className="admin-btn" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', background: '#475569' }} onClick={() => moveSection(sectionKey, 1)}>▼</button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ borderTop: '1px solid #1e293b', paddingTop: '2rem' }}>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'white' }}>Edit Hero Banner Content</h3>
              <form onSubmit={handleHeroSubmit}>
                <label className="admin-label">Hero Badge Text</label>
                <input type="text" className="admin-input" name="badge" defaultValue={localDB.sections?.hero?.badge} />
                
                <label className="admin-label">Hero Heading Title</label>
                <input type="text" className="admin-input" name="title" defaultValue={localDB.sections?.hero?.title} />
                
                <label className="admin-label">Hero Subtitle / Description</label>
                <textarea className="admin-input" name="subtitle" defaultValue={localDB.sections?.hero?.subtitle} style={{ height: '80px', resize: 'vertical' }} />

                <button type="submit" className="admin-btn" style={{ marginTop: '1.5rem' }}>Update Hero Section</button>
              </form>
            </div>
          </div>
        )}

        {/* Services Tab */}
        {activeTab === 'services' && (
          <div className="admin-card">
            <h2 className="admin-title">Services Module CMS</h2>
            
            <div style={{ marginBottom: '3rem' }}>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: 'white' }}>Add New Choice Engineering Service</h3>
              <form onSubmit={handleAddService}>
                <label className="admin-label">Service Title</label>
                <input type="text" className="admin-input" name="title" required placeholder="e.g. Behavioral Brand Strategy" />
                
                <label className="admin-label">Description / Psychological Impact</label>
                <textarea className="admin-input" name="desc" required placeholder="Describe the service details..." style={{ height: '80px', resize: 'vertical' }} />

                <label className="admin-label">Dashboard Icon Identifier</label>
                <input type="text" className="admin-input" name="icon" placeholder="e.g. brain, trending-up, cpu" />
                
                <button type="submit" className="admin-btn" style={{ marginTop: '1.5rem' }}>Add Service Node</button>
              </form>
            </div>

            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: 'white' }}>Active Services List</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #334155', textAlign: 'left' }}>
                  <th style={{ paddingBottom: '0.75rem', color: 'white' }}>Title</th>
                  <th style={{ paddingBottom: '0.75rem', color: 'white' }}>Description</th>
                  <th style={{ paddingBottom: '0.75rem', color: 'white', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {localDB.services.map((s, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #1e293b' }}>
                    <td style={{ padding: '1rem 0', fontWeight: 600, color: 'white' }}>{s.title}</td>
                    <td style={{ padding: '1rem 0', color: '#94a3b8', fontSize: '0.9rem' }}>{s.desc}</td>
                    <td style={{ padding: '1rem 0', textAlign: 'right' }}>
                      <button className="admin-btn" style={{ background: '#ef4444' }} onClick={() => handleDeleteService(idx)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Corporate CRM Tab */}
        {activeTab === 'crm' && (
          <div className="admin-card">
            <h2 className="admin-title">Corporate CRM Script Manager</h2>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '2rem' }}>
              Manage script copies, voiceover tracks, and client projects rendered inside the Viewer CRM portal.
            </p>

            {/* Add Project Form */}
            <div style={{ background: '#1e293b', padding: '1.5rem', borderRadius: '8px', marginBottom: '3rem' }}>
              <h3 style={{ fontSize: '1.1rem', color: 'white', marginBottom: '1rem' }}>Create New Client Campaign Project</h3>
              <form onSubmit={handleAddProject} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
                <div style={{ flex: 1, minWidth: '200px' }}>
                  <label className="admin-label" style={{ marginTop: 0 }}>Client Brand Name</label>
                  <input type="text" name="clientName" className="admin-input" required placeholder="e.g. Coca-Cola" />
                </div>
                <div style={{ flex: 1, minWidth: '200px' }}>
                  <label className="admin-label" style={{ marginTop: 0 }}>Project/Campaign Name</label>
                  <input type="text" name="projectName" className="admin-input" required placeholder="e.g. Refresh commercial v3" />
                </div>
                <button type="submit" className="admin-btn" style={{ height: '40px' }}>Create Project</button>
              </form>
            </div>

            {/* Main CRM Editor Interface */}
            {localDB.clientScripts && localDB.clientScripts.length > 0 ? (
              <div>
                {/* Project Tabs Selector */}
                <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid #1e293b', paddingBottom: '1rem', marginBottom: '2rem', overflowX: 'auto' }}>
                  {localDB.clientScripts.map(p => (
                    <button 
                      key={p.id}
                      onClick={() => setActiveProjectTab(p.id)}
                      className={`admin-nav-btn ${activeProjectTab === p.id ? 'active' : ''}`}
                      style={{ whiteSpace: 'nowrap' }}
                    >
                      💼 {p.clientName}
                    </button>
                  ))}
                </div>

                {selectedProj && (
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                      <div>
                        <h3 style={{ fontSize: '1.25rem', color: 'white', margin: 0 }}>{selectedProj.clientName} &mdash; {selectedProj.projectName}</h3>
                        <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>ID: {selectedProj.id}</span>
                      </div>
                      <button 
                        className="admin-btn" 
                        style={{ background: '#ef4444' }} 
                        onClick={() => handleDeleteProject(selectedProj.id)}
                      >
                        Delete Entire Project
                      </button>
                    </div>

                    {/* Add Chapter Form */}
                    <div style={{ background: '#111827', padding: '1.5rem', borderRadius: '8px', border: '1px solid #1e293b', marginBottom: '3rem' }}>
                      <h4 style={{ color: 'white', marginBottom: '1rem', marginTop: 0 }}>Add Script Chapter to Project</h4>
                      <form onSubmit={(e) => handleAddChapter(e, selectedProj.id)}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                          <div>
                            <label className="admin-label" style={{ marginTop: 0 }}>Chapter Title</label>
                            <input type="text" name="title" className="admin-input" required placeholder="e.g. Introduction Dialogue" />
                          </div>
                          <div>
                            <label className="admin-label" style={{ marginTop: 0 }}>Speaker Role</label>
                            <input type="text" name="speaker" className="admin-input" placeholder="e.g. VOICEOVER SPEAKER" />
                          </div>
                          <div>
                            <label className="admin-label" style={{ marginTop: 0 }}>Audio MP3 File Path / Link</label>
                            <input type="text" name="audioSrc" className="admin-input" placeholder="e.g. assets/music.mp3" />
                          </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                          <div>
                            <label className="admin-label" style={{ marginTop: 0 }}>Duration label</label>
                            <input type="text" name="duration" className="admin-input" placeholder="e.g. 00:30" />
                          </div>
                          <div>
                            <label className="admin-label" style={{ marginTop: 0 }}>Seconds duration (integer)</label>
                            <input type="number" name="seconds" className="admin-input" placeholder="e.g. 30" />
                          </div>
                        </div>

                        <label className="admin-label">Script Text Content</label>
                        <textarea name="text" className="admin-input" required placeholder="Type the script dialogue here..." style={{ height: '80px', resize: 'vertical' }} />

                        <label className="admin-label">Director's Production Cues / Insights</label>
                        <input type="text" name="insight" className="admin-input" placeholder="e.g. Backed by soft piano. Transition volume down by 4dB." />

                        <button type="submit" className="admin-btn" style={{ marginTop: '1.5rem' }}>Append Chapter</button>
                      </form>
                    </div>

                    {/* Active Chapters Table */}
                    <h4 style={{ color: 'white', marginBottom: '1rem' }}>Active Script Chapters ({selectedProj.chapters?.length || 0})</h4>
                    {selectedProj.chapters && selectedProj.chapters.length > 0 ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {selectedProj.chapters.map((ch, idx) => (
                          <div key={ch.id} style={{ background: '#1e293b', padding: '1.25rem', borderRadius: '8px', border: '1px solid #334155', position: 'relative' }}>
                            <button 
                              style={{ position: 'absolute', top: '1rem', right: '1rem', background: '#ef4444', border: 'none', color: 'white', padding: '0.25rem 0.5rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.75rem' }}
                              onClick={() => handleDeleteChapter(selectedProj.id, ch.id)}
                            >
                              Delete Chapter
                            </button>
                            <div style={{ fontWeight: 700, color: 'white', marginBottom: '0.5rem' }}>
                              CH-{idx + 1}: {ch.title} <span style={{ fontWeight: 400, color: '#94a3b8', fontSize: '0.8rem' }}>({ch.speaker} &bull; {ch.duration})</span>
                            </div>
                            <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', color: '#cbd5e1' }}>"{ch.text}"</p>
                            {ch.audioSrc && (
                              <div style={{ fontSize: '0.8rem', color: '#38bdf8', fontFamily: 'monospace' }}>
                                Audio Source: {ch.audioSrc}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div style={{ color: '#94a3b8', fontStyle: 'italic', padding: '1rem', textAlign: 'center' }}>
                        No chapters added to this project script yet.
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div style={{ color: '#94a3b8', fontStyle: 'italic', textAlign: 'center', padding: '2rem' }}>
                No corporate campaigns defined. Create one above!
              </div>
            )}

          </div>
        )}

        {/* Video Asset Uploader Tab */}
        {activeTab === 'assets' && (
          <div className="admin-card">
            <h2 className="admin-title">Upload Video/Media Reels</h2>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Directly transmit new vertical 9:16 reels or graphics to the server's assets folder.</p>
            
            <form onSubmit={handleAssetUpload}>
              <label className="admin-label">Choose Video File (.mp4, .mov, etc.)</label>
              <input 
                type="file" 
                onChange={(e) => setUploadFile(e.target.files[0])}
                required
                style={{ display: 'block', margin: '1rem 0' }}
              />
              
              <button type="submit" className="admin-btn" style={{ marginTop: '1rem' }} disabled={!uploadFile}>
                Upload Asset
              </button>
            </form>
            
            {uploadProgress && (
              <div style={{ marginTop: '2rem', padding: '1rem', background: '#1e293b', borderRadius: '8px', color: '#2450a4', fontFamily: "'Share Tech Mono', monospace" }}>
                {uploadProgress}
              </div>
            )}
          </div>
        )}

        {/* Backup Tab */}
        {activeTab === 'backup' && (
          <div className="admin-card">
            <h2 className="admin-title">Backup & Restore Configuration</h2>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '2rem' }}>Export the active CMS config into a local JSON backup file, or upload a backup file to restore website settings.</p>
            
            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
              <button className="admin-btn" onClick={handleExport}>
                Export Active JSON Config
              </button>
              
              <div style={{ position: 'relative' }}>
                <input 
                  type="file" 
                  accept=".json"
                  onChange={handleImport}
                  style={{ display: 'block' }}
                />
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};

export default AdminPanel;
