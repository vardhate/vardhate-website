import React, { useState } from 'react';
import { Download, Printer, Play, Pause, FileText, Music, ChevronRight, Briefcase } from 'lucide-react';

const Viewer = ({ db, onExit }) => {
  const projects = db.clientScripts || [];
  const [selectedProjectId, setSelectedProjectId] = useState(projects[0]?.id || '');
  const activeProject = projects.find(p => p.id === selectedProjectId) || projects[0];

  // Active playing audio track reference ID
  const [activePlayingId, setActivePlayingId] = useState(null);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100vh', 
      width: '100vw', 
      background: '#f8fafc', 
      color: '#1e293b', 
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      overflow: 'hidden'
    }}>
      
      {/* CRM Corporate Header */}
      <header style={{ 
        background: '#ffffff', 
        borderBottom: '1px solid #e2e8f0', 
        padding: '0.85rem 2rem', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }} onClick={onExit}>
          <div style={{ 
            background: '#2450a4', 
            color: 'white', 
            width: '32px', 
            height: '32px', 
            borderRadius: '8px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            fontWeight: 800,
            fontSize: '1.1rem'
          }}>
            V
          </div>
          <div>
            <span style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>VARDHATE</span>
            <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block', marginTop: '-2px', fontWeight: 600 }}>CORPORATE SCRIPT PANEL</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ 
            fontSize: '0.78rem', 
            fontWeight: 700, 
            background: '#eff6ff', 
            color: '#2450a4', 
            padding: '0.35rem 0.75rem', 
            borderRadius: '6px',
            border: '1px solid #dbeafe'
          }}>
            💼 EMPLOYEE LOG: ACTIVE
          </span>
          <button onClick={onExit} style={{
            background: '#eff6ff',
            border: '1px solid #dbeafe',
            color: '#2450a4',
            padding: '0.5rem 1rem',
            borderRadius: '6px',
            fontSize: '0.85rem',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}>
            Exit Portal
          </button>
        </div>
      </header>

      {/* CRM Split Workspace */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        
        {/* Left Project Sidebar List */}
        <aside style={{ 
          width: '280px', 
          background: '#ffffff', 
          borderRight: '1px solid #e2e8f0', 
          display: 'flex', 
          flexDirection: 'column' 
        }}>
          <div style={{ padding: '1.25rem', borderBottom: '1px solid #e2e8f0' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Active Client Projects
            </span>
          </div>

          <div style={{ padding: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.35rem', overflowY: 'auto', flex: 1 }}>
            {projects.length === 0 ? (
              <div style={{ color: '#94a3b8', fontSize: '0.85rem', padding: '1rem', textAlign: 'center', fontStyle: 'italic' }}>
                No active projects found.
              </div>
            ) : (
              projects.map(p => (
                <button 
                  key={p.id}
                  onClick={() => setSelectedProjectId(p.id)}
                  style={{
                    width: '100%',
                    padding: '0.85rem 1rem',
                    borderRadius: '8px',
                    border: 'none',
                    background: selectedProjectId === p.id ? '#f1f5f9' : 'transparent',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    gap: '0.25rem',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'background 0.2s'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', width: '100%' }}>
                    <Briefcase size={14} style={{ color: selectedProjectId === p.id ? '#2450a4' : '#64748b' }} />
                    <span style={{ 
                      fontWeight: selectedProjectId === p.id ? 700 : 600, 
                      color: selectedProjectId === p.id ? '#0f172a' : '#334155',
                      fontSize: '0.9rem',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      flex: 1
                    }}>
                      {p.clientName}
                    </span>
                  </div>
                  <span style={{ 
                    fontSize: '0.75rem', 
                    color: '#64748b',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    width: '100%'
                  }}>
                    {p.projectName}
                  </span>
                </button>
              ))
            )}
          </div>
          
          {/* Quick Actions Footer inside sidebar */}
          <div style={{ padding: '1.25rem', borderTop: '1px solid #e2e8f0', background: '#f8fafc' }}>
            <button 
              onClick={handlePrint} 
              style={{
                width: '100%',
                background: '#ffffff',
                border: '1px solid #cbd5e1',
                borderRadius: '6px',
                padding: '0.5rem',
                fontSize: '0.8rem',
                fontWeight: 600,
                color: '#334155',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                cursor: 'pointer'
              }}
            >
              <Printer size={14} />
              Print Script Logs
            </button>
          </div>
        </aside>

        {/* Central Workspace Panel */}
        <main style={{ 
          flex: 1, 
          padding: '2rem 3rem', 
          overflowY: 'auto', 
          background: '#f8fafc' 
        }}>
          {activeProject ? (
            <div style={{ maxWidth: '900px', margin: '0 auto' }}>
              
              {/* Project Meta Details Card */}
              <div style={{ 
                background: '#ffffff', 
                border: '1px solid #e2e8f0', 
                borderRadius: '12px', 
                padding: '1.5rem 2rem', 
                marginBottom: '2rem',
                boxShadow: '0 1px 2px rgba(0,0,0,0.02)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#2450a4', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05rem' }}>
                  <span>Client Campaign File</span>
                  <ChevronRight size={12} />
                  <span>{activeProject.clientName}</span>
                </div>
                <h1 style={{ fontSize: '1.65rem', fontWeight: 800, color: '#0f172a', marginTop: '0.5rem', marginBottom: '0.25rem' }}>
                  {activeProject.projectName}
                </h1>
                <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>
                  Select or play the chapters below to review copy directions and dynamic voiceover voice outputs.
                </p>
              </div>

              {/* Script Chapters List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                {activeProject.chapters && activeProject.chapters.length > 0 ? (
                  activeProject.chapters.map((ch, idx) => (
                    <section 
                      key={ch.id} 
                      style={{ 
                        background: '#ffffff', 
                        border: '1px solid #e2e8f0', 
                        borderRadius: '12px', 
                        padding: '2rem', 
                        boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                        borderLeft: activePlayingId === ch.id ? '4px solid #2450a4' : '4px solid #cbd5e1',
                        transition: 'border-color 0.2s'
                      }}
                    >
                      {/* Chapter Title Row */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.75rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <span style={{ 
                            fontSize: '0.75rem', 
                            fontWeight: 700, 
                            background: '#f1f5f9', 
                            color: '#475569', 
                            padding: '0.25rem 0.5rem', 
                            borderRadius: '4px',
                            fontFamily: 'monospace'
                          }}>
                            CH-{idx + 1}
                          </span>
                          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                            {ch.title}
                          </h3>
                        </div>
                        {ch.duration && (
                          <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>
                            Duration: {ch.duration}
                          </span>
                        )}
                      </div>

                      {/* Voicetime Text */}
                      <div style={{ marginBottom: '1.5rem' }}>
                        <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                          <FileText size={12} />
                          <span>{ch.speaker || "Speaker"}</span>
                        </div>
                        <p style={{ 
                          fontSize: '1rem', 
                          lineHeight: '1.65', 
                          color: '#334155', 
                          margin: 0,
                          background: '#fafafa',
                          padding: '1rem',
                          borderRadius: '8px',
                          border: '1px solid #f1f5f9'
                        }}>
                          {ch.text}
                        </p>
                      </div>

                      {/* Director's Insight Box */}
                      {ch.insight && (
                        <div style={{ 
                          background: '#f8fafc', 
                          padding: '1rem 1.25rem', 
                          borderRadius: '8px', 
                          border: '1px solid #e2e8f0', 
                          marginBottom: '1.5rem',
                          fontSize: '0.85rem'
                        }}>
                          <strong style={{ color: '#0f172a', display: 'block', marginBottom: '0.25rem' }}>💡 Director's Insight:</strong>
                          <span style={{ color: '#475569' }}>{ch.insight}</span>
                        </div>
                      )}

                      {/* Custom Audio Player Row */}
                      {ch.audioSrc ? (
                        <div style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '1rem', 
                          background: '#f1f5f9', 
                          padding: '0.75rem 1.25rem', 
                          borderRadius: '8px',
                          border: '1px solid #e2e8f0'
                        }}>
                          <Music size={16} style={{ color: '#2450a4' }} />
                          <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                            <audio 
                              controls 
                              src={ch.audioSrc} 
                              onPlay={() => setActivePlayingId(ch.id)}
                              onPause={() => {
                                if (activePlayingId === ch.id) setActivePlayingId(null);
                              }}
                              onEnded={() => {
                                if (activePlayingId === ch.id) setActivePlayingId(null);
                              }}
                              style={{ width: '100%', height: '36px' }}
                            />
                          </div>
                        </div>
                      ) : (
                        <div style={{ 
                          fontSize: '0.8rem', 
                          color: '#94a3b8', 
                          fontStyle: 'italic',
                          background: '#fafafa',
                          padding: '0.75rem 1.25rem',
                          borderRadius: '8px',
                          border: '1px dashed #e2e8f0',
                          textAlign: 'center'
                        }}>
                          Awaiting dynamic voice synthesis recording upload...
                        </div>
                      )}

                    </section>
                  ))
                ) : (
                  <div style={{ color: '#64748b', fontStyle: 'italic', textAlign: 'center', padding: '3rem' }}>
                    No chapters defined for this script.
                  </div>
                )}
              </div>

            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#94a3b8' }}>
              <Briefcase size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
              <span>Select a client project to begin review</span>
            </div>
          )}
        </main>

      </div>

    </div>
  );
};

export default Viewer;
