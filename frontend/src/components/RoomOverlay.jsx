import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft } from 'lucide-react';
import { TRANSLATIONS } from '../utils/translations';

// Unified Service Overlay & Custom Interactive Sandboxes
const RoomOverlay = ({ portal, db, lang = 'en', onBack, apiBase = '/backend/api.php' }) => {
  const [activeService, setActiveService] = useState(null);

  return (
    <div 
      className={`room-stage-viewport room-${portal.id}`} 
      style={{ 
        position: 'absolute', 
        inset: 0, 
        zIndex: 10, 
        padding: '3rem 1.5rem 6rem', 
        overflowY: 'auto', 
        background: 'rgba(5, 5, 5, 0.95)', 
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)'
      }}
    >
      
      {/* Top Navigation */}
      <div className="room-nav-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1200px', margin: '0 auto 3rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '1.5rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.75rem', color: 'var(--accent)', letterSpacing: '0.2em' }}>
            SECTOR 0{portal.code} // {lang === 'hi' ? 'सक्रिय' : 'ONLINE'}
          </span>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 900, color: 'white', marginTop: '0.25rem', textTransform: 'uppercase' }}>
            {TRANSLATIONS[lang]?.[portal.id] || portal.label}
          </h2>
        </div>
        <button className="btn-room-back" onClick={onBack}>
          <ArrowLeft size={18} className="nav-arrow-icon" />
          <span>{TRANSLATIONS[lang]?.dockReturn || "RETURN TO DOCK"}</span>
        </button>
      </div>

      {/* Main Panel Content depending on Sector Router */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
        {portal.id === 'brand-lab' && <SectorBrandLab db={db} lang={lang} />}
        {portal.id === 'growth-engine' && <SectorGrowthEngine db={db} />}
        {portal.id === 'trust-wall' && <SectorTrustWall db={db} />}
        {portal.id === 'creative-studio' && <SectorCreativeStudio db={db} />}
        {portal.id === 'ai-systems' && <SectorAISystems db={db} />}
        {portal.id === 'insights' && <SectorInsights db={db} lang={lang} />}
        {portal.id === 'contact' && <SectorContact db={db} />}
        {portal.id === 'services' && (
          <SectorServices 
            db={db} 
            lang={lang}
            activeService={activeService} 
            setActiveService={setActiveService} 
          />
        )}
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// SECTOR COMPONENTS
// -------------------------------------------------------------

// 1. BRAND LAB (Founder Quote & Statistics)
const SectorBrandLab = ({ db, lang }) => {
  const stats = db.sections?.stats || { items: [] };
  const founder = db.sections?.founder || {};

  // Interactive Neuromorphic simulation state
  const [activeHooks, setActiveHooks] = useState({
    decoy: false,
    anchor: false,
    scarcity: false
  });

  const toggleHook = (key) => {
    setActiveHooks(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Calculate simulated attention rate
  let attentionRate = 38; // baseline
  if (activeHooks.decoy) attentionRate += 22;
  if (activeHooks.anchor) attentionRate += 18;
  if (activeHooks.scarcity) attentionRate += 16;

  // Texts translations
  const t = {
    en: {
      title: "Attention Engineering Simulator",
      subtitle: "Toggle psychological design triggers to optimize consumer choice pathways:",
      decoyBtn: "Decoy Plan Framing",
      anchorBtn: "Focal Point Anchor",
      scarcityBtn: "Subconscious Scarcity",
      attentionIndex: "Simulated Eye-tracking Index",
      activeText: "ACTIVE",
      inactiveText: "INACTIVE",
      visualMap: "Live Cognitive Attention Heatmap",
      desc: "By layering behavioral hooks, eye movement is directed straight to your highest margin bundle, making checkout intuitive."
    },
    hi: {
      title: "ध्यान इंजीनियरिंग सिम्युलेटर (Attention Simulator)",
      subtitle: "उपभोक्ता पसंद को अनुकूलित करने के लिए मनोवैज्ञानिक ट्रिगर्स सक्रिय करें:",
      decoyBtn: "डेकॉय योजना (Decoy Price)",
      anchorBtn: "ध्यान केन्द्रित एंकर (Focal Point)",
      scarcityBtn: "अवचेतन कमी (Subconscious Urgency)",
      attentionIndex: "अनुमानित ध्यान सूचकांक (Attention Index)",
      activeText: "सक्रिय",
      inactiveText: "निष्क्रिय",
      visualMap: "लाइव संज्ञानात्मक ध्यान हीटमैप (Live Heatmap)",
      desc: "मनोवैज्ञानिक हुक लगाने से ग्राहकों की नज़र सीधे आपके सबसे अधिक बिकने वाले कॉम्बो पैक पर जाती है।"
    }
  }[lang] || {
    en: {
      title: "Attention Engineering Simulator",
      subtitle: "Toggle psychological design triggers to optimize consumer choice pathways:",
      decoyBtn: "Decoy Plan Framing",
      anchorBtn: "Focal Point Anchor",
      scarcityBtn: "Subconscious Scarcity",
      attentionIndex: "Simulated Eye-tracking Index",
      activeText: "ACTIVE",
      inactiveText: "INACTIVE",
      visualMap: "Live Cognitive Attention Heatmap",
      desc: "By layering behavioral hooks, eye movement is directed straight to your highest margin bundle, making checkout intuitive."
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
      
      {/* Interactive Attention Map Simulator */}
      <div className="sector-panel" style={{ border: '1px solid rgba(36, 80, 164, 0.3)', background: 'rgba(36, 80, 164, 0.02)', padding: '2rem', borderRadius: '16px', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}>
        <h3 className="sector-panel-title" style={{ color: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span>👁 {t.title}</span>
          <span style={{ fontSize: '0.7rem', background: 'var(--accent)', color: 'white', padding: '0.2rem 0.5rem', borderRadius: '4px', fontFamily: 'monospace' }}>LAB EXPERIMENT // 01</span>
        </h3>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.92rem' }}>{t.subtitle}</p>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', alignItems: 'center' }}>
          {/* Controls */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <button 
              onClick={() => toggleHook('decoy')}
              style={{
                width: '100%',
                padding: '1rem',
                borderRadius: '8px',
                border: '1px solid',
                borderColor: activeHooks.decoy ? 'var(--accent)' : 'rgba(255,255,255,0.08)',
                background: activeHooks.decoy ? 'rgba(36, 80, 164, 0.15)' : 'rgba(255,255,255,0.01)',
                color: 'white',
                textAlign: 'left',
                display: 'flex',
                justifyContent: 'space-between',
                cursor: 'pointer',
                fontWeight: 600,
                transition: 'all 0.2s'
              }}
            >
              <span>{t.decoyBtn}</span>
              <span style={{ color: activeHooks.decoy ? 'var(--accent)' : 'rgba(255,255,255,0.2)' }}>
                {activeHooks.decoy ? `● ${t.activeText}` : `○ ${t.inactiveText}`}
              </span>
            </button>

            <button 
              onClick={() => toggleHook('anchor')}
              style={{
                width: '100%',
                padding: '1rem',
                borderRadius: '8px',
                border: '1px solid',
                borderColor: activeHooks.anchor ? 'var(--accent)' : 'rgba(255,255,255,0.08)',
                background: activeHooks.anchor ? 'rgba(36, 80, 164, 0.15)' : 'rgba(255,255,255,0.01)',
                color: 'white',
                textAlign: 'left',
                display: 'flex',
                justifyContent: 'space-between',
                cursor: 'pointer',
                fontWeight: 600,
                transition: 'all 0.2s'
              }}
            >
              <span>{t.anchorBtn}</span>
              <span style={{ color: activeHooks.anchor ? 'var(--accent)' : 'rgba(255,255,255,0.2)' }}>
                {activeHooks.anchor ? `● ${t.activeText}` : `○ ${t.inactiveText}`}
              </span>
            </button>

            <button 
              onClick={() => toggleHook('scarcity')}
              style={{
                width: '100%',
                padding: '1rem',
                borderRadius: '8px',
                border: '1px solid',
                borderColor: activeHooks.scarcity ? 'var(--accent)' : 'rgba(255,255,255,0.08)',
                background: activeHooks.scarcity ? 'rgba(36, 80, 164, 0.15)' : 'rgba(255,255,255,0.01)',
                color: 'white',
                textAlign: 'left',
                display: 'flex',
                justifyContent: 'space-between',
                cursor: 'pointer',
                fontWeight: 600,
                transition: 'all 0.2s'
              }}
            >
              <span>{t.scarcityBtn}</span>
              <span style={{ color: activeHooks.scarcity ? 'var(--accent)' : 'rgba(255,255,255,0.2)' }}>
                {activeHooks.scarcity ? `● ${t.activeText}` : `○ ${t.inactiveText}`}
              </span>
            </button>

            <div style={{ marginTop: '1.5rem', background: '#050505', padding: '1rem 1.5rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' }}>{t.attentionIndex}</div>
              <div style={{ fontSize: '2rem', fontWeight: 900, color: 'white', marginTop: '0.25rem', fontFamily: 'monospace' }}>{attentionRate}%</div>
            </div>
          </div>

          {/* Visual Grid Map */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t.visualMap}</div>
            <div style={{ width: '100%', height: '240px', background: '#050505', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              
              {/* Simulated Landing Page layout */}
              <div style={{ width: '80%', height: '70%', background: '#111827', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', position: 'relative' }}>
                <div style={{ width: '40%', height: '10px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px' }}></div>
                <div style={{ width: '70%', height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px' }}></div>
                
                {/* 3 tiers */}
                <div style={{ display: 'flex', gap: '0.5rem', flex: 1, marginTop: '0.5rem' }}>
                  <div style={{ flex: 1, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '6px', padding: '0.35rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    <div style={{ width: '60%', height: '6px', background: 'rgba(255,255,255,0.1)' }}></div>
                    <div style={{ width: '80%', height: '14px', background: 'rgba(255,255,255,0.05)' }}></div>
                  </div>
                  {/* Premium Tier (Middle decoy) */}
                  <div style={{ flex: 1, background: 'rgba(255,255,255,0.02)', border: activeHooks.decoy ? '1px solid var(--accent)' : '1px solid rgba(255,255,255,0.05)', borderRadius: '6px', padding: '0.35rem', display: 'flex', flexDirection: 'column', gap: '0.25rem', position: 'relative' }}>
                    <div style={{ width: '60%', height: '6px', background: activeHooks.decoy ? 'var(--accent)' : 'rgba(255,255,255,0.1)' }}></div>
                    <div style={{ width: '80%', height: '14px', background: 'rgba(255,255,255,0.05)' }}></div>
                    {activeHooks.scarcity && <div style={{ width: '50%', height: '4px', background: 'white', opacity: 0.8 }}></div>}
                  </div>
                  <div style={{ flex: 1, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '6px', padding: '0.35rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    <div style={{ width: '60%', height: '6px', background: 'rgba(255,255,255,0.1)' }}></div>
                    <div style={{ width: '80%', height: '14px', background: 'rgba(255,255,255,0.05)' }}></div>
                  </div>
                </div>

                {/* Checkout Button */}
                <div style={{ width: '100%', height: '24px', background: activeHooks.anchor ? 'var(--accent)' : 'rgba(255,255,255,0.1)', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ width: '20%', height: '6px', background: 'white', opacity: 0.6 }}></div>
                </div>

                {/* Heatmap overlay glows */}
                {activeHooks.decoy && (
                  <div style={{
                    position: 'absolute',
                    top: '40%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(36,80,164,0.6) 0%, rgba(36,80,164,0) 70%)',
                    filter: 'blur(8px)',
                    animation: 'pulse 1.8s infinite',
                    pointerEvents: 'none'
                  }} />
                )}

                {activeHooks.anchor && (
                  <div style={{
                    position: 'absolute',
                    bottom: '15px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '120px',
                    height: '40px',
                    borderRadius: '20px',
                    background: 'radial-gradient(circle, rgba(36,80,164,0.5) 0%, rgba(36,80,164,0) 70%)',
                    filter: 'blur(6px)',
                    animation: 'pulse 1.4s infinite',
                    pointerEvents: 'none'
                  }} />
                )}
              </div>

            </div>
            <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)', margin: 0 }}>{t.desc}</p>
          </div>
        </div>
      </div>

      {/* Founder Message Section */}
      <div className="sector-panel" style={{ borderLeft: '3px solid var(--accent)', paddingLeft: '1.5rem' }}>
        <h3 className="sector-panel-title">
          {lang === 'hi' ? 'हमारे संस्थापक का संदेश (Founder Message)' : (founder.title || "A Message from Our Founder")}
        </h3>
        <p style={{ lineHeight: 1.7, color: 'var(--text-secondary)', marginBottom: '1.5rem', fontStyle: 'italic', fontSize: '1.1rem' }}>
          "{lang === 'hi' ? 'हम ब्रांड्स के विकास को उपभोक्ताओं के निर्णय मनोविज्ञान से जोड़कर आसान बनाते हैं।' : founder.content}"
        </p>
        <p style={{ fontSize: '0.85rem', fontWeight: 700, color: 'white' }}>
          &mdash; {founder.founderName || "Vardhan Ate"}, {founder.founderTitle || "Founder & Chief Decision Officer"}
        </p>
      </div>

      {/* Science stats */}
      <div className="sector-panel">
        <h3 className="sector-panel-title">
          {lang === 'hi' ? 'वैज्ञानिक निर्णय लेने की ताकत (Our Stats)' : (stats.title || "The Science of Buying Behaviour")}
        </h3>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
          {lang === 'hi' ? 'हमारे प्रमाणित कार्य का विवरण:' : stats.subtitle}
        </p>
        <div className="content-grid">
          {stats.items.map((s, i) => (
            <div className="content-card" key={i} style={{ textAlign: 'center', padding: '2rem' }}>
              <div className="card-num" style={{ fontSize: '2.2rem', fontWeight: 900, marginBottom: '0.5rem', textShadow: '0 0 15px rgba(36, 80, 164, 0.3)', color: 'white' }}>
                {s.count}{s.suffix}
              </div>
              <div className="card-name" style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)' }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

// 2. GROWTH ENGINE
const SectorGrowthEngine = ({ db }) => {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      num: '01', phase: 'DISCOVERY & AUDIT',
      title: 'Deep Brand Diagnosis',
      example: 'Example: A D2C skincare brand spending ₹3L/month on Meta ads with ₹1.2 ROAS → We audit their creative, targeting, and funnel.',
      points: ['Complete competitor landscape mapping', 'Customer psychology profiling (ICP)', 'Ad account audit: what is bleeding money', 'Brand perception survey analysis'],
      color: '#2450a4',
      outcome: 'Clarity on what is broken & what to fix first'
    },
    {
      num: '02', phase: 'CHOICE ARCHITECTURE DESIGN',
      title: 'Engineering the Decision Path',
      example: 'Example: Restructuring offer presentation from flat pricing to 3-tier decoy model — middle tier purchase rate goes up 40%.',
      points: ['Decoy pricing architecture', 'Anchoring & framing of core offer', 'Trust hierarchy sequencing', 'Visual attention flow mapping'],
      color: '#1a3d8a',
      outcome: 'A buying environment that makes choosing you feel obvious'
    },
    {
      num: '03', phase: 'CREATIVE PRODUCTION',
      title: 'AI-Powered Content at Scale',
      example: 'Example: 12 UGC hooks + 4 product videos + 3 reels produced in 7 days using AI tools + studio shoots.',
      points: ['UGC creator coordination & scripting', 'AI-generated visual assets & mockups', 'Product video production', 'Platform-native format adaptation'],
      color: '#2450a4',
      outcome: '30+ content assets optimized for Meta, Reels & YouTube'
    },
    {
      num: '04', phase: 'PAID MEDIA DEPLOYMENT',
      title: 'Meta & Google Campaign Launch',
      example: 'Example: ₹50K test budget → split into 6 creative variants → top 2 performers scaled to ₹3L/month within 3 weeks.',
      points: ['Structured testing framework (ABO → CBO)', 'Retargeting funnel architecture', 'Lookalike audience stacking', 'Real-time bid optimization'],
      color: '#1a3d8a',
      outcome: 'Sustainable ROAS scale with predictable cost per acquisition'
    },
    {
      num: '05', phase: 'OPTIMIZE & SCALE',
      title: 'Compounding Growth Loop',
      example: 'Example: Brand moved from ₹8L/month to ₹34L/month revenue in 90 days — 4.2x ROAS sustained.',
      points: ['Weekly creative refresh cycles', 'Audience expansion & interest layering', 'Seasonal offer engineering', 'Full-funnel attribution reporting'],
      color: '#2450a4',
      outcome: 'Month-on-month growth with decreasing CAC'
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h3 className="sector-panel-title">How We Grow Your Brand</h3>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.95rem', marginTop: '-0.5rem' }}>A proven 5-phase growth system — from diagnosis to scale.</p>
      </div>

      {/* Step selector */}
      <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
        {steps.map((s, i) => (
          <button key={i} onClick={() => setActiveStep(i)}
            style={{ flexShrink: 0, padding: '0.5rem 1.2rem', borderRadius: '8px', border: `1px solid ${i === activeStep ? '#2450a4' : 'rgba(255,255,255,0.1)'}`, background: i === activeStep ? 'rgba(36,80,164,0.25)' : 'rgba(255,255,255,0.03)', color: i === activeStep ? 'white' : 'rgba(255,255,255,0.45)', fontWeight: 700, fontSize: '0.78rem', cursor: 'pointer', transition: 'all 0.2s', letterSpacing: '0.05em' }}
          >
            {s.num} {s.phase}
          </button>
        ))}
      </div>

      {/* Active step detail */}
      {(() => { const s = steps[activeStep]; return (
        <div style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid rgba(36,80,164,0.4)`, borderRadius: '16px', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(36,80,164,0.3)', border: '1px solid rgba(36,80,164,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, color: 'white', fontSize: '1rem', flexShrink: 0 }}>{s.num}</div>
            <div>
              <div style={{ fontSize: '0.7rem', letterSpacing: '0.12em', color: '#4a7fd4', fontWeight: 700 }}>{s.phase}</div>
              <h4 style={{ color: 'white', fontWeight: 900, fontSize: '1.3rem', margin: 0 }}>{s.title}</h4>
            </div>
          </div>
          <div style={{ background: 'rgba(36,80,164,0.1)', border: '1px solid rgba(36,80,164,0.25)', borderRadius: '10px', padding: '1rem 1.25rem', color: 'rgba(255,255,255,0.65)', fontSize: '0.88rem', lineHeight: 1.6, fontStyle: 'italic' }}>
            {s.example}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
            {s.points.map((pt, j) => (
              <div key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem' }}>
                <span style={{ color: '#2450a4', fontWeight: 900, flexShrink: 0 }}>→</span>{pt}
              </div>
            ))}
          </div>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '0.7rem', letterSpacing: '0.08em', color: 'rgba(255,255,255,0.35)', fontWeight: 700 }}>OUTCOME</span>
            <span style={{ color: 'white', fontWeight: 700, fontSize: '0.9rem' }}>{s.outcome}</span>
          </div>
        </div>
      ); })()}
    </div>
  );
};

// 3. TRUST WALL (Client Case Studies)
const SectorTrustWall = ({ db }) => {
  return (
    <div className="sector-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <h3 className="sector-panel-title">OUR TRUST WALL</h3>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem', fontSize: '1rem', lineHeight: '1.6' }}>
        We have partnered with <strong>100+ leading brands</strong> to engineer attention, drive engagement, and deliver high-impact choice-architecture campaigns. Below is a collection of clients we have worked with:
      </p>
      <div style={{ width: '100%', borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.06)', boxShadow: '0 20px 50px rgba(0,0,0,0.5), 0 0 30px rgba(36, 80, 164, 0.15)' }}>
        <img src="assets/trust_wall_extracted.png" alt="Vardhate Trust Wall - 100+ Clients" style={{ width: '100%', height: 'auto', display: 'block' }} />
      </div>
      <div style={{ maxWidth: '800px', margin: '0.5rem auto 0', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: '1.7', fontFamily: 'inherit' }}>
          Our campaigns span across multiple industries including D2C, E-commerce, SaaS, FinTech, and Entertainment. Through custom consumer psychology and direct-response creatives, we make buying from our partners inevitable.
        </p>
      </div>
    </div>
  );
};

// 4. CREATIVE STUDIO (Tabbed Video Carousel)
const SectorCreativeStudio = () => {
  const [activeTab, setActiveTab] = useState('tvc');
  const trackRef = useRef(null);

  // Mapped video lists — Google Drive iframe embed URLs
  const gdrive = (id) => `https://drive.google.com/file/d/${id}/preview`;
  const VIDEO_DB = {
    ugc: [
      { title: "Impulse Brand UGC Hooks",       desc: "A scroll-stopping direct-response UGC video utilizing natural lighting and real consumer voiceovers to drive quick trust decisions.",         src: gdrive("16-QvEOVcFZORIbpdRnZS_Yj8GTPX7yvy") },
      { title: "Social Validation UGC",          desc: "Peer-to-peer verification format displaying live product unboxings and visual demonstrations targeting Gen Z buying heuristics.",          src: gdrive("1F60MSLinJqcUmqqwGnQeofmQ25nUPTj_") },
      { title: "Decoy Product UGC Testimonial",  desc: "A creator-led testimonial focusing on comparative price-value relationships to make premium bundles feel obvious.",                         src: gdrive("1yU1INF8A-Sn3y9ZTdI0sk6zIDl8ms4co") }
    ],
    tvc: [
      { title: "Decoy Tier Product Video",        desc: "A product promotion highlighting tier differentials, engineered to steer buyers towards premium options.",                src: gdrive("1nPHMBqx3TpyfCDnJxPmFOJMa83UFtv04") },
      { title: "High-contrast Lifestyle Spot",    desc: "Dynamic lifestyle commercial emphasizing premium brand identity and visual aesthetic dominance.",                           src: gdrive("1E3NBEQGXT_gpRqQrOm9Tt6zxPgUAy5Dr") },
      { title: "Direct-Response Kinetic Spot",    desc: "Fast-cut product highlight with bold text animations, driving immediate call-to-action responses.",                          src: gdrive("1AaoRw9e_XO1Goal-StixdDIa50rHXgrp") },
      { title: "D2C Brand Release Cinematic",     desc: "A grand visual launch commercial with high-fidelity sound design and studio-grade coloring.",                               src: gdrive("1-jnfcGEp9E5otXZBiuHBE4qm0AZllOBt") },
      { title: "Impulse Product Close-up",        desc: "Detailed close-ups highlighting texture, build quality, and premium design features.",                                     src: gdrive("1oCs8ia5-TQS36y9uNbceXNNNylWvJol4") },
      { title: "Studio Light Commercial",         desc: "Studio-lit cinematic sequence displaying product reflection and sleek contours.",                                           src: gdrive("1Q4CSekwct73JMpdhKpEIhdl3ArsaHJq-") }
    ],
    smm: [
      { title: "AI Generated Concept Commercial", desc: "Futuristic concept video generated entirely using advanced diffusion models, visualizing cybernetic environments.",             src: gdrive("1iXfZ-zJrFBMfF9bJBszBfUkvekMFJJcc") },
      { title: "Neural Network Branding Spot",    desc: "AI-driven abstract visual sequence outlining cognitive decision architectures and brain mechanics.",                          src: gdrive("12ZDatfyiWtXZMOGwL3pTdS_loRaZv5vt") },
      { title: "Synthesized Direct Response Hook",desc: "A synthetic video sequence demonstrating rapid context switching, designed to capture short attention spans.",               src: gdrive("139IE0CU88-3tLuBfvZB2gdQexGmxCh9w") },
      { title: "Abstract Cognitive Flow Reel",    desc: "Generative abstract visualization mapping human decision points and visual attention heatmaps.",                             src: gdrive("1vCCPnP7zJLmyfoEgrEguFyYpullEFRBP") }
    ],
    prod: [
      { title: "Brand Identity Mini-Documentary", desc: "A high-fidelity mini-doc explaining the design history, manufacturing precision, and brand values of a market leader.",       src: gdrive("14ZSu0QH1F0RP7gWkW4tWoLXPC6BZCL-8") },
      { title: "Founder's Vision Story",          desc: "A documentary format highlighting the founder's journey, market entry barriers, and the science of choice.",                  src: gdrive("16nbTiBtnB5C02NDUVPPeU09JlqBCBt6d") },
      { title: "Decision Engineering Case Study", desc: "Documentary tracking the before-and-after conversion optimization journey of a scaling D2C client.",                         src: gdrive("1lVQDfIBOErOklTW80IrY16mV4QRwh-8u") }
    ],
    brand: [
      { title: "Executive Positioning Story",    desc: "A personal branding visual profile establishing authority, professional background, and thought leadership.",                   src: gdrive("1wUiD-uq3sFRgh7c6xwaDtIasX0VO8Xaz") },
      { title: "Corporate Leader Interview",     desc: "A polished studio interview sequence focusing on strategic industry insights and business growth mechanics.",                   src: gdrive("1q714Mkx9ZyDlmJKuyQoiSvm6AiAcYzax") },
      { title: "Founder Profile Documentary",    desc: "Personal branding story capturing daily routines, operational leadership, and brand legacy values.",                          src: gdrive("1Re7w0OMxxjAqLaazIMBRXyOTfF2c9alW") },
      { title: "Keynote Authority Highlight",    desc: "High-impact keynote presentation highlight sequence establishing market expertise and public speaking clout.",                  src: gdrive("1wP4-DlzKAce-iLWsDc6on_1-cV6KpkPt") }
    ]
  };

  const handleScroll = (dir) => {
    const track = trackRef.current;
    if (track) {
      track.scrollBy({ left: dir * 280, behavior: 'smooth' });
    }
  };

  const videos = VIDEO_DB[activeTab] || [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <h3 className="studio-main-title">OUR SERVICES</h3>

      {/* Tabs list */}
      <div className="studio-tabs-container">
        {[
          { id: 'tvc', label: 'Product Video' },
          { id: 'ugc', label: 'UGC Video' },
          { id: 'smm', label: 'AI Video' },
          { id: 'prod', label: 'Documentary Video' },
          { id: 'brand', label: 'Personal Branding' }
        ].map(t => (
          <button 
            key={t.id} 
            className={`studio-tab-btn ${activeTab === t.id ? 'active' : ''}`}
            onClick={() => setActiveTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Track wrapper */}
      <div className="studio-carousel-wrapper" style={{ position: 'relative' }}>
        <button className="studio-carousel-btn prev" onClick={() => handleScroll(-1)} id="studio-prev-btn">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"></polyline></svg>
        </button>

        <div className="studio-carousel-track" ref={trackRef} id="studio-carousel-track">
          {videos.length === 0 ? (
            <div style={{ color: 'var(--text-secondary)', padding: '2rem', fontStyle: 'italic' }}>
              Awaiting directive files for this segment...
            </div>
          ) : (
            videos.map((v, i) => <StudioVideoCard key={i} v={v} />)
          )}
        </div>

        <button className="studio-carousel-btn next" onClick={() => handleScroll(1)} id="studio-next-btn">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg>
        </button>
      </div>
    </div>
  );
};

// Sub-component: Video Card inside Studio Carousel — Google Drive iframe embed
const StudioVideoCard = ({ v }) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="studio-video-card">
      {/* Skeleton loader shown until iframe is ready */}
      {!loaded && (
        <div style={{
          width: '100%',
          aspectRatio: '9/16',
          background: 'linear-gradient(135deg, rgba(36,80,164,0.25) 0%, rgba(10,10,20,0.6) 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '12px',
          color: 'rgba(255,255,255,0.4)',
          fontSize: '0.75rem',
          letterSpacing: '0.1em'
        }}>
          <span style={{ animation: 'pulse 1.5s ease-in-out infinite' }}>▶ Loading...</span>
        </div>
      )}
      <iframe
        src={v.src}
        allow="autoplay; encrypted-media"
        allowFullScreen
        frameBorder="0"
        loading="lazy"
        onLoad={() => setLoaded(true)}
        style={{
          width: '100%',
          aspectRatio: '9/16',
          borderRadius: '12px',
          border: 'none',
          background: '#000',
          display: loaded ? 'block' : 'none'
        }}
        title={v.title}
      />
      <div className="studio-video-title" style={{ marginTop: '0.75rem', textAlign: 'left', fontSize: '0.9rem', fontWeight: 800, color: 'white' }}>{v.title}</div>
      <div className="studio-video-desc" style={{ marginTop: '0.25rem', textAlign: 'left', fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', lineHeight: '1.4' }}>{v.desc}</div>
    </div>
  );
};

// 5. AI SYSTEMS
const SectorAISystems = () => {
  const aiModules = [
    { id: '01', name: 'Generative Visual Engine', tag: 'IMAGE & VIDEO AI', desc: 'We deploy cutting-edge diffusion models (Stable Diffusion, Midjourney, RunwayML) to produce high-clarity campaign visuals, product renders, and concept art — in hours, not weeks.', icon: '🎨' },
    { id: '02', name: 'AI Scriptwriting & Copywriting', tag: 'NLP & LLM LAYER', desc: 'Our LLM-powered copywriting stack (GPT-4, Claude, Gemini) generates conversion-optimized scripts, ad copy, and email sequences trained on top-performing consumer psychology patterns.', icon: '✍️' },
    { id: '03', name: 'Predictive Audience Intelligence', tag: 'ML TARGETING', desc: 'Machine learning models trained on real purchase data identify your ideal buyer persona, predict LTV, and pre-qualify leads before a single rupee is spent on media.', icon: '🧠' },
    { id: '04', name: 'AI Video Synthesis', tag: 'GENERATIVE VIDEO', desc: 'From AI-generated spokesperson videos to synthetic product demos — we use Sora, D-ID, and HeyGen to produce human-quality video at a fraction of traditional production cost.', icon: '🎬' },
    { id: '05', name: 'Automated Funnel Optimization', tag: 'CONVERSION AI', desc: 'AI-driven A/B testing, heatmap analysis, and real-time landing page optimization using tools like VWO, Hotjar AI, and our proprietary choice-architecture scoring engine.', icon: '⚡' },
    { id: '06', name: 'Brand Voice Intelligence', tag: 'CONSISTENCY AI', desc: 'A dedicated brand voice model trained on your unique tone, style, and market position — ensuring every piece of content feels authentically yours at scale.', icon: '🎯' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ background: 'linear-gradient(135deg, rgba(36,80,164,0.2) 0%, rgba(36,80,164,0.05) 100%)', border: '1px solid rgba(36,80,164,0.4)', borderRadius: '16px', padding: '2.5rem', textAlign: 'center' }}>
        <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🤖</div>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 900, color: 'white', marginBottom: '0.75rem', letterSpacing: '-0.02em' }}>We Run on AI</h2>
        <p style={{ color: 'rgba(255,255,255,0.65)', maxWidth: '600px', margin: '0 auto', lineHeight: 1.7, fontSize: '1.05rem' }}>
          Vardhate integrates the world's most advanced AI systems into every campaign — from ideation to final delivery. We don't just use AI as a tool; we use it as a competitive weapon.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1.5rem', flexWrap: 'wrap' }}>
          {['GPT-4o', 'Gemini Pro', 'Claude 3.5', 'Midjourney', 'Runway ML', 'HeyGen'].map(tool => (
            <span key={tool} style={{ padding: '0.35rem 0.9rem', borderRadius: '999px', background: 'rgba(36,80,164,0.25)', border: '1px solid rgba(36,80,164,0.5)', color: '#7ba7f7', fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.05em' }}>{tool}</span>
          ))}
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
        {aiModules.map(mod => (
          <div key={mod.id} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', padding: '1.5rem', transition: 'all 0.3s', cursor: 'default' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(36,80,164,0.6)'; e.currentTarget.style.background = 'rgba(36,80,164,0.08)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}
          >
            <div style={{ fontSize: '1.8rem', marginBottom: '0.75rem' }}>{mod.icon}</div>
            <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#2450a4', letterSpacing: '0.1em', marginBottom: '0.4rem' }}>{mod.tag}</div>
            <div style={{ fontWeight: 800, color: 'white', fontSize: '1rem', marginBottom: '0.6rem' }}>{mod.name}</div>
            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.82rem', lineHeight: 1.6 }}>{mod.desc}</div>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: '1px', background: 'rgba(36,80,164,0.2)', borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(36,80,164,0.3)' }}>
        {[['10x', 'Faster Production'], ['80%', 'Cost Reduction'], ['3x', 'Higher ROAS'], ['100%', 'AI-Augmented']].map(([val, lbl]) => (
          <div key={lbl} style={{ flex: 1, padding: '1.25rem', textAlign: 'center', background: 'rgba(0,0,0,0.3)' }}>
            <div style={{ fontSize: '1.4rem', fontWeight: 900, color: 'white' }}>{val}</div>
            <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: '0.2rem' }}>{lbl}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

// 7. INSIGHTS
const SectorInsights = ({ db, lang }) => {
  const [activeTab, setActiveTab] = useState('about');
  const tabs = [
    { id: 'about', label: '🏢 About Us' },
    { id: 'why', label: '✅ Why Choose Us' },
    { id: 'values', label: '💎 Core Values' },
    { id: 'goals', label: '🚀 Our Goals' },
    { id: 'blogs', label: '📖 Research' },
  ];
  const coreValues = [
    { icon: '🧠', title: 'Psychology First', desc: 'Every campaign starts with understanding how your buyer thinks — not what they say they want, but what actually drives their purchase.' },
    { icon: '📊', title: 'Data Over Opinion', desc: 'We let real performance data — impressions, CPL, ROAS — guide every creative and media decision. No guesswork.' },
    { icon: '⚡', title: 'Speed with Quality', desc: 'AI-augmented workflows allow us to deliver premium creative outputs in days, not months. Fast does not mean cheap.' },
    { icon: '🤝', title: 'Client Obsession', desc: 'We treat every brand as if it were our own. Your growth metrics are our performance review.' },
    { icon: '🔬', title: 'Relentless Optimization', desc: 'We never settle on a version that works when there might be one that works 3x better. Continuous testing is not optional — it is culture.' },
    { icon: '🌟', title: 'Radical Transparency', desc: 'Full access to campaign data, clear reporting, and honest projections. We never hide results behind vanity metrics.' },
  ];
  const goals = [
    { horizon: 'SHORT TERM', title: "Become India's #1 Choice Architecture Agency", desc: 'We are building the most recognized consumer decision company in India — the agency brands call first when they need real growth.', kpi: 'Target: 500+ Brands by 2026' },
    { horizon: 'MEDIUM TERM', title: 'Launch Vardhate Growth OS Platform', desc: 'A SaaS platform that gives D2C brands access to our proprietary choice-architecture tools, AI creative generation, and real-time campaign intelligence.', kpi: 'Launch: Q3 2025' },
    { horizon: 'LONG TERM', title: "Global Consumer Decision Infrastructure", desc: "Expanding our decision engineering framework to Southeast Asia and the Middle East — making Vardhate's methodology the global standard for high-performance brand growth.", kpi: 'Vision: 2027–2030' },
  ];
  const whyUs = [
    { stat: '4.2x', label: 'Average ROAS', desc: 'Across all active client campaigns in FY 2024–25' },
    { stat: '100+', label: 'Brands Scaled', desc: 'Across D2C, SaaS, FinTech, F&B, and Entertainment' },
    { stat: '₹12Cr+', label: 'Media Managed', desc: 'Total ad spend managed with positive ROAS' },
    { stat: '3.8 Days', label: 'Avg. Delivery Time', desc: 'From brief to final campaign creative delivery' },
    { stat: '93%', label: 'Client Retention', desc: 'Of clients who completed one quarter stay for three more' },
    { stat: '0 Fluff', label: 'Guarantee', desc: "We don't pitch strategy decks. We show you results." },
  ];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)}
            style={{ padding: '0.5rem 1.1rem', borderRadius: '8px', border: `1px solid ${t.id === activeTab ? '#2450a4' : 'rgba(255,255,255,0.1)'}`, background: t.id === activeTab ? 'rgba(36,80,164,0.25)' : 'transparent', color: t.id === activeTab ? 'white' : 'rgba(255,255,255,0.45)', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer', transition: 'all 0.2s' }}>
            {t.label}
          </button>
        ))}
      </div>
      {activeTab === 'about' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ background: 'linear-gradient(135deg, rgba(36,80,164,0.15), rgba(0,0,0,0))', border: '1px solid rgba(36,80,164,0.3)', borderRadius: '16px', padding: '2rem' }}>
            <h3 style={{ color: 'white', fontWeight: 900, fontSize: '1.6rem', marginBottom: '1rem' }}>We Are Vardhate</h3>
            <p style={{ color: 'rgba(255,255,255,0.65)', lineHeight: 1.8, fontSize: '1rem' }}>Vardhate is India's premier <strong style={{ color: 'white' }}>Consumer Decision Engineering</strong> company. We architect the psychological conditions that make purchasing from our clients feel inevitable.</p>
            <p style={{ color: 'rgba(255,255,255,0.55)', lineHeight: 1.7, fontSize: '0.95rem', marginTop: '1rem' }}>Founded on the belief that buying is never purely rational, we combine behavioral economics, AI-powered creative production, and precision paid media to drive measurable, scalable revenue for brands across India.</p>
            <p style={{ color: 'rgba(255,255,255,0.55)', lineHeight: 1.7, fontSize: '0.95rem', marginTop: '1rem' }}>We don't just run ads — we design the entire choice environment around your product. From the first scroll to the final checkout, every element is engineered to reduce resistance and amplify desire.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
            {[['2020', 'Founded'], ['Pune, India', 'Headquarters'], ['100+', 'Clients Served']].map(([val, lbl]) => (
              <div key={lbl} style={{ textAlign: 'center', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px', padding: '1.25rem' }}>
                <div style={{ fontSize: '1.4rem', fontWeight: 900, color: 'white' }}>{val}</div>
                <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: '0.25rem' }}>{lbl}</div>
              </div>
            ))}
          </div>
        </div>
      )}
      {activeTab === 'why' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem' }}>
          {whyUs.map(w => (
            <div key={w.stat} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', padding: '1.5rem', transition: 'all 0.3s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(36,80,164,0.5)'; e.currentTarget.style.background = 'rgba(36,80,164,0.07)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}
            >
              <div style={{ fontSize: '2rem', fontWeight: 900, color: 'white', marginBottom: '0.25rem' }}>{w.stat}</div>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#4a7fd4', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.5rem' }}>{w.label}</div>
              <div style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.5 }}>{w.desc}</div>
            </div>
          ))}
        </div>
      )}
      {activeTab === 'values' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))', gap: '1rem' }}>
          {coreValues.map(v => (
            <div key={v.title} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', padding: '1.5rem' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(36,80,164,0.5)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; }}
            >
              <div style={{ fontSize: '1.8rem', marginBottom: '0.75rem' }}>{v.icon}</div>
              <div style={{ fontWeight: 800, color: 'white', fontSize: '1rem', marginBottom: '0.5rem' }}>{v.title}</div>
              <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.82rem', lineHeight: 1.6 }}>{v.desc}</div>
            </div>
          ))}
        </div>
      )}
      {activeTab === 'goals' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {goals.map((g, i) => (
            <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(36,80,164,0.25)', borderRadius: '14px', padding: '1.75rem', display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'rgba(36,80,164,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, color: '#4a7fd4', fontSize: '1.3rem', flexShrink: 0 }}>{i + 1}</div>
              <div>
                <div style={{ fontSize: '0.68rem', letterSpacing: '0.12em', color: '#2450a4', fontWeight: 700, marginBottom: '0.3rem' }}>{g.horizon}</div>
                <h4 style={{ color: 'white', fontWeight: 900, fontSize: '1.05rem', margin: '0 0 0.5rem 0' }}>{g.title}</h4>
                <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.85rem', lineHeight: 1.6, margin: '0 0 0.75rem 0' }}>{g.desc}</p>
                <span style={{ display: 'inline-block', padding: '0.25rem 0.8rem', borderRadius: '999px', background: 'rgba(36,80,164,0.2)', border: '1px solid rgba(36,80,164,0.4)', color: '#7ba7f7', fontSize: '0.75rem', fontWeight: 700 }}>{g.kpi}</span>
              </div>
            </div>
          ))}
        </div>
      )}
      {activeTab === 'blogs' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem' }}>
          {(db.blogs || []).map((b, i) => (
            <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', padding: '1.5rem' }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#4a7fd4', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>{b.readTime}</div>
              <div style={{ fontWeight: 800, color: 'white', fontSize: '0.95rem', marginBottom: '0.5rem' }}>{b.title}</div>
              <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.8rem', marginBottom: '0.75rem' }}>by {b.author}</div>
              <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.78rem', lineHeight: 1.5, fontStyle: 'italic' }}>'{b.excerpt}'</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// 7. CONTACT (Secure terminal window form)
const SectorContact = () => {
  const [terminalLines, setTerminalLines] = useState([
    { text: '[SYSTEM] SECURE VARDHATE OS TRANS-LINK SECURED.', isSystem: true },
    { text: '[SYSTEM] ENTER YOUR COORDINATES TO TRANSMIT DIRECTIVES.', isSystem: true },
    { text: ' ', isSystem: true }
  ]);
  
  const fields = [
    { key: 'name', prompt: 'enter caller identity (your name)', value: '' },
    { key: 'email', prompt: 'enter caller transmission address (email)', value: '' },
    { key: 'message', prompt: 'enter caller transmission directive (message)', value: '' }
  ];
  
  const [currentStep, setCurrentStep] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [formValues, setFormValues] = useState({});
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [currentStep]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      const val = inputValue.trim();
      if (!val) return;

      const activeField = fields[currentStep];
      setFormValues(prev => ({ ...prev, [activeField.key]: val }));
      
      // Append completed line
      setTerminalLines(prev => [
        ...prev, 
        { text: `guest@vardhate:~$ ${activeField.prompt}: ${val}`, isSystem: false }
      ]);
      setInputValue('');

      if (currentStep + 1 >= fields.length) {
        // Complete form transmission
        setTerminalLines(prev => [
          ...prev,
          { text: '[SYSTEM] TRANSMITTING DIRECTIVES... LINK OK.', isSystem: true }
        ]);
        
        setTimeout(() => {
          setTerminalLines(prev => [
            ...prev,
            { text: '[SUCCESS] TRANSMISSION RECORDED. WE WILL CONTACT YOU IN 24 HOURS.', isSuccess: true }
          ]);
        }, 900);
        setCurrentStep(fields.length); // complete
      } else {
        setCurrentStep(prev => prev + 1);
      }
    }
  };

  return (
    <div className="sector-panel">
      <h3 className="sector-panel-title">VARDHATE Communications Console</h3>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Secure interactive link. Type your coordinates to open a transmission line.</p>
      
      <div className="terminal-window" onClick={() => inputRef.current?.focus()}>
        <div className="terminal-header">
          <span className="terminal-dot"></span>
          <span class="terminal-dot"></span>
          <span class="terminal-dot"></span>
        </div>
        <div className="terminal-body" style={{ minHeight: '220px' }}>
          {terminalLines.map((line, idx) => (
            <div 
              key={idx} 
              className="terminal-line" 
              style={{
                color: line.isSuccess ? '#10B981' : (line.isSystem ? 'var(--text-secondary)' : '#ffffff'),
                marginBottom: '0.25rem'
              }}
            >
              {line.text}
            </div>
          ))}

          {currentStep < fields.length && (
            <div className="terminal-line">
              guest@vardhate:~$ {fields[currentStep].prompt}:&nbsp;
              <div className="terminal-input-wrapper" style={{ display: 'inline-flex', alignItems: 'center' }}>
                <span className="terminal-value">{inputValue}</span>
                <span className="terminal-cursor" style={{ background: 'white', width: '8px', height: '15px', display: 'inline-block', marginLeft: '2px' }}></span>
                <input 
                  ref={inputRef}
                  type="text" 
                  className="terminal-input" 
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  autoComplete="off" 
                  style={{ position: 'absolute', opacity: 0, pointerEvents: 'none' }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// 8. SERVICES (Interactive Planet orbits and sub-stage warp worlds)
const SectorServices = ({ db, activeService, setActiveService }) => {
  const SERVICES = [
    { id: "brand-strategy", title: "Brand Strategy", code: "BS-01", x: "7%", y: "20%", color: "#2450a4", desc: "Formulating deep psychographic buyer profiles, conversion axioms, and competitive decoy frameworks." },
    { id: "branding", title: "Branding / Identity", code: "BI-02", x: "15%", y: "55%", color: "#2450a4", desc: "Forging distinctive vector design monograms, responsive typography, and consistent brand style boards." },
    { id: "graphic-design", title: "Graphic Design", code: "GD-03", x: "27%", y: "72%", color: "#2450a4", desc: "Structuring conversions-oriented visual designs, promotional mockups, and high contrast layout palettes." },
    { id: "social-media", title: "Social Media Management", code: "SM-04", x: "42%", y: "30%", color: "#2450a4", desc: "Orchestrating daily feed schedules, audience retention graphs, and live pixel tracking analytics." },
    { id: "content-creation", title: "Content Creation", code: "CC-05", x: "54%", y: "62%", color: "#2450a4", desc: "Creating scroll-stopping photos, vertical scripts, and mood-driven creatives engineered for direct response conversions." },
    { id: "video-editing", title: "Video Editing", code: "VE-06", x: "65%", y: "48%", color: "#2450a4", desc: "High-precision video post-production incorporating audio wave filters, custom color grades, and speed ramps." },
    { id: "meta-ads", title: "Meta Ads", code: "MA-07", x: "74%", y: "28%", color: "#2450a4", desc: "Deploying high-efficiency paid acquisition models, budget multipliers, and pixel triggers to maximize ROAS." },
    { id: "web-dev", title: "Website Design & Dev", code: "WD-08", x: "84%", y: "38%", color: "#2450a4", desc: "Compiling responsive, GPU-accelerated codebases, custom interactions, and frictionless client checkout funnels." },
    { id: "ai-automation", title: "AI Automation", code: "AI-09", x: "93%", y: "70%", color: "#2450a4", desc: "Wiring neural workflows, automated CRM schedulers, and cognitive lead pre-qualification funnels." }
  ];

  return (
    <div style={{ position: 'relative', width: '100%', height: '500px', margin: '2rem 0' }}>
      
      {/* Cosmos Coordinates Map */}
      <div 
        className="services-cosmos-container" 
        style={{
          width: '100%',
          height: '100%',
          position: 'relative',
          background: 'rgba(0,0,0,0.3)',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: '16px',
          overflow: 'hidden'
        }}
      >
        {/* Starfield Path Line Orbits */}
        <svg style={{ position: 'absolute', width: '100%', height: '100%', top: 0, left: 0, pointerEvents: 'none' }}>
          <path 
            d="M 50 450 Q 300 100 600 400 T 1150 150" 
            fill="none" 
            stroke="rgba(255,255,255,0.04)" 
            strokeWidth="2" 
            strokeDasharray="6 6"
          />
        </svg>

        {SERVICES.map(s => (
          <div 
            key={s.id}
            className="services-planet-node"
            style={{ left: s.x, top: s.y, color: s.color, position: 'absolute', cursor: 'pointer' }}
            onClick={() => setActiveService(s)}
          >
            <div className="services-planet-pulse" style={{ borderColor: s.color }}></div>
            <div className="services-planet-orb" style={{ background: s.color }}></div>
            <div className="services-planet-label">{s.title}</div>
          </div>
        ))}
      </div>

      {/* Dynamic Sub-Stage Overlay Redesign */}
      {activeService && (
        <ServiceOverlayCard 
          service={activeService} 
          onClose={() => setActiveService(null)} 
        />
      )}
    </div>
  );
};

const SERVICE_DETAILS = {
  "brand-strategy": {
    focus: "Formulating deep psychographic buyer profiles, conversion axioms, and competitive decoy frameworks.",
    whyItMatters: "Most brands fail because they sell features instead of satisfying core psychological buying motivations. We structure the buying journey based on how the human brain actually makes decisions.",
    deliverables: [
      "Target Buyer Persona & Intent Matrix",
      "Decoy Tier Placement Strategy",
      "Value Loop Framing Copy Book",
      "Behavior Audit Checklist"
    ],
    proof: "+125% Conversion Rate bump in test D2C funnels.",
    pillars: [
      { title: "Psychographic Profiling", desc: "Understanding the exact emotional triggers, pain points, and cognitive shortcuts of your target audience." },
      { title: "Decoy Frameworks", desc: "Structuring product options in such a way that the middle or premium option becomes the most logical choice." },
      { title: "Relative Pricing", desc: "Framing prices in comparison to higher alternatives to reduce purchase hesitation." }
    ]
  },
  "branding": {
    focus: "Forging distinctive vector design monograms, responsive typography, and consistent brand style boards.",
    whyItMatters: "A brand's identity is the first filter through which consumers assess value. We build clean, high-contrast, premium assets that command authority and justify higher pricing tiers.",
    deliverables: [
      "Responsive Vector Logo System",
      "Digital Branding Style Guidelines",
      "Typography & Color Hierarchy Maps",
      "High-Conversion Landing Page Assets"
    ],
    proof: "+45% increase in brand authority metrics.",
    pillars: [
      { title: "Visual Authority", desc: "Using deep color palettes (black, white, blue) to evoke trust, precision, and modernity." },
      { title: "High-contrast Typography", desc: "Clean, responsive typography pairings that make product copy readable in under 2 seconds." },
      { title: "Style Boards", desc: "Cohesive brand rules that keep UGC ads, emails, and landing pages aligned." }
    ]
  },
  "graphic-design": {
    focus: "Structuring conversions-oriented visual designs, promotional mockups, and high contrast layout palettes.",
    whyItMatters: "Visuals are processed 60,000 times faster than text. Our designs are engineered to direct user attention to the call-to-action button, ensuring maximum checkout velocity.",
    deliverables: [
      "Direct-Response Ad Creatives",
      "Interactive Product Mockups",
      "High-Performance Banner Templates",
      "Conversion Path Visual Guides"
    ],
    proof: "+38% increase in ad click-through rate (CTR).",
    pillars: [
      { title: "Attention Anchoring", desc: "Placing visual focal points exactly where they trigger buying decisions." },
      { title: "Impulse Framing", desc: "Designing banners that leverage urgency, scarcity, and instant rewards visually." },
      { title: "Visual Consistency", desc: "Standardizing layout elements to decrease cognitive fatigue and build credibility." }
    ]
  },
  "social-media": {
    focus: "Orchestrating daily feed schedules, audience retention graphs, and live pixel tracking analytics.",
    whyItMatters: "Social media is the trust foundation. We build an interactive, high-retention social ecosystem that acts as passive social proof, making potential clients feel secure before buying.",
    deliverables: [
      "Organic Content Matrix Planner",
      "Audience Retention Flow Audits",
      "Community Building Playbooks",
      "Direct Message Hook Funnels"
    ],
    proof: "+180% organic engagement growth over 90 days.",
    pillars: [
      { title: "Algorithm Calibration", desc: "Engineering the first 3 seconds of all content to bypass feed filters." },
      { title: "Social Proof Stacking", desc: "Continuously highlighting client success stories and reviews dynamically." },
      { title: "Direct Funnel Routing", desc: "Converting passive video views into direct message queries and website traffic." }
    ]
  },
  "content-creation": {
    focus: "Creating scroll-stopping photos, vertical scripts, and mood-driven creatives engineered for direct response conversions.",
    whyItMatters: "Stock photos and corporate videos do not sell. We shoot and write authentic, creator-style UGC (User Generated Content) and high-impact vertical video ads that feel real and drive immediate checkout decisions.",
    deliverables: [
      "Direct-Response UGC Ad Videos",
      "High-Fidelity Product Photos",
      "Vertical Script Frameworks",
      "Emotional Hook Creative Variations"
    ],
    proof: "Average ROAS increased from 1.5x to 3.8x for active clients.",
    pillars: [
      { title: "Real Creator Casting", desc: "Using relatable, skilled creators who mirror the buyer's aspirations." },
      { title: "Hook Engineering", desc: "Writing 5 different intro hook variations for every vertical video script." },
      { title: "Direct-Response Scripting", desc: "Pacing scripts to trigger immediate purchase action instead of simple likes." }
    ]
  },
  "video-editing": {
    focus: "High-precision video post-production incorporating audio wave filters, custom color grades, and speed ramps.",
    whyItMatters: "The average attention span is under 5 seconds. Our high-precision video editing uses speed ramps, kinetic typography, and audio ducking to lock eyes onto the product benefits.",
    deliverables: [
      "Kinetic Vertical Video Cuts",
      "Sound Design & Audio Track Balancing",
      "Studio Color Grading Templates",
      "GPU-Accelerated Subtitles Overlay"
    ],
    proof: "+55% Average Watch-Time Duration on Meta Reels.",
    pillars: [
      { title: "Kinetic Cut-points", desc: "Trimming dead space in audio to maintain high pace and visual tension." },
      { title: "Audio Wave Pacing", desc: "Using sound effects (crunch, swoosh, pop) to draw attention to value highlights." },
      { title: "Color Psychology", desc: "Color grading videos to look clean, high-end, and authentic." }
    ]
  },
  "meta-ads": {
    focus: "Deploying high-efficiency paid acquisition models, budget multipliers, and pixel triggers to maximize ROAS.",
    whyItMatters: "Randomly testing ads wastes budgets. We deploy direct paid campaigns built on behavioral heuristics, optimizing pixel triggers and targeting metrics to ensure a highly scalable Return on Ad Spend.",
    deliverables: [
      "Meta Ads Campaign Matrix",
      "ROAS Audit & Budget Allocators",
      "Pixel Integration & API Setup",
      "Retargeting Custom Funnels"
    ],
    proof: "Generated over ₹50,00,000 in tracked client D2C revenue.",
    pillars: [
      { title: "Testing Architectures", desc: "Isolating hooks and creatives dynamically to find winners without burning cash." },
      { title: "Lookalike Targeting", desc: "Feeding custom conversion signals to Meta's AI algorithms for high-value targets." },
      { title: "CBO Multipliers", desc: "Deploying Campaign Budget Optimization to automatically scale winning ads." }
    ]
  },
  "web-dev": {
    focus: "Compiling responsive, GPU-accelerated codebases, custom interactions, and frictionless client checkout funnels.",
    whyItMatters: "A 1-second delay in page load drops conversions by 7%. We build ultra-fast, responsive web landing pages using clean layouts, ensuring the checkout flow has zero friction and guides the customer to select high-value bundles.",
    deliverables: [
      "Responsive React Landers",
      "One-Page Frictionless Checkout Forms",
      "SEO Metadata Optimization",
      "GPU-Accelerated Visual Scripts"
    ],
    proof: "-42% Cart Abandonment drop rate for e-commerce checkouts.",
    pillars: [
      { title: "Speed Optimization", desc: "Minimizing bundle sizes and compressing assets for 99+ PageSpeed scores." },
      { title: "Frictionless Forms", desc: "Removing fields, introducing smart defaults, and adding autofills." },
      { title: "Mobile UI Excellence", desc: "Ensuring 100% responsive visual layouts that render cleanly on compact displays." }
    ]
  },
  "ai-automation": {
    focus: "Wiring neural workflows, automated CRM schedulers, and cognitive lead pre-qualification funnels.",
    whyItMatters: "Manual follow-ups lose leads. We wire automated AI CRM bots and schedulers that trigger instant responses to incoming customer inquiries, pre-qualifying leads and booking calls on autopilot.",
    deliverables: [
      "AI Automation Workflows Map",
      "Dynamic CRM Lead Handlers",
      "Automated WhatsApp Schedulers",
      "Lead Pre-qualification Funnels"
    ],
    proof: "Saved 20+ hours per week of manual administration tasks.",
    pillars: [
      { title: "Workflow Triggers", desc: "Instantly piping leads from Meta Ads to WhatsApp, booking calls under 60 seconds." },
      { title: "Automated Qualifiers", desc: "AI-driven filters that separate browsing visitors from high-intent buyers." },
      { title: "Database Syncing", desc: "Real-time updates to client CRM databases to keep sales reps calibrated." }
    ]
  }
};

// upgraded Split-screen Sub-world overlay component
const ServiceOverlayCard = ({ service, onClose }) => {
  const [active, setActive] = useState(false);

  useEffect(() => {
    // slide in transition trigger
    const t = setTimeout(() => setActive(true), 30);
    return () => clearTimeout(t);
  }, []);

  const handleClose = () => {
    setActive(false);
    setTimeout(onClose, 600);
  };

  const details = SERVICE_DETAILS[service.id] || {
    focus: service.desc,
    whyItMatters: "We structure customer journeys to maximize direct conversion outcomes.",
    deliverables: ["Strategy Outline", "Conversion Optimization audit", "Metrics monitoring"],
    proof: "Calibrated to 94.8% efficiency index.",
    pillars: [
      { title: "Analysis", desc: "Reviewing intent trends and checkout friction points." },
      { title: "Positioning", desc: "Structuring relative gains and decoy offers." },
      { title: "Verification", desc: "Auditing click funnels and direct checkout metrics." }
    ]
  };

  return (
    <div 
      className={`service-world-overlay ${active ? 'active' : ''}`} 
      style={{
        borderLeft: `5px solid var(--accent)`
      }}
    >
      {/* Overlay header */}
      <div className="service-world-header">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <span className="world-sub-badge" style={{ color: 'var(--accent)' }}>
            IMMERSIVE SUB-STAGE // {service.code}
          </span>
          <div className="service-world-title">{service.title}</div>
        </div>
        <button className="btn-room-back" onClick={handleClose}>
          <ArrowLeft size={16} className="nav-arrow-icon" />
          <span>RETURN TO COSMOS</span>
        </button>
      </div>

      {/* Split Layout Body */}
      <div className="service-world-content">
        <div className="world-split-layout">
          
          {/* Left panel: Info & Strategy logs */}
          <div className="world-left-info">
            <h4 style={{ fontSize: '1.45rem', color: 'white', fontWeight: 900, marginBottom: '0.5rem' }}>What We Do</h4>
            <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', lineHeight: '1.6', margin: 0 }}>
              {details.focus}
            </p>

            <h4 style={{ fontSize: '1.15rem', color: 'white', fontWeight: 800, marginTop: '1.5rem', marginBottom: '0.5rem' }}>Why It Matters for Your Brand</h4>
            <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.65)', lineHeight: '1.6', margin: 0 }}>
              {details.whyItMatters}
            </p>

            <h4 style={{ fontSize: '1.15rem', color: 'white', fontWeight: 800, marginTop: '1.5rem', marginBottom: '0.5rem' }}>Key Deliverables</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem', marginTop: '0.5rem' }}>
              {details.deliverables.map((d, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'white' }}>
                  <span style={{ color: 'var(--accent)', fontWeight: 'bold' }}>✔</span>
                  <span>{d}</span>
                </div>
              ))}
            </div>
            
            <div className="world-metric-log-box" style={{ borderColor: 'rgba(36, 80, 164, 0.25)', marginTop: '2rem' }}>
              <div className="world-metric-log-row">
                <span>METRIC CLASSIFICATION:</span>
                <span style={{ color: 'white', fontWeight: 700 }}>CONVERSION DRIVEN</span>
              </div>
              <div className="world-metric-log-row">
                <span>HEURISTIC DRIFT INDEX:</span>
                <span style={{ color: 'var(--accent)', fontWeight: 700 }}>94.8% CALIBRATED</span>
              </div>
              <div className="world-metric-log-row">
                <span>TRACKED RESULT METRIC:</span>
                <span style={{ color: 'white', fontWeight: 700 }}>{details.proof}</span>
              </div>
            </div>
          </div>

          {/* Right panel: Core pillars & interactive simulation workspace */}
          <div className="world-right-sandbox" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div>
              <h4 style={{ fontSize: '1.25rem', color: 'white', fontWeight: 800, marginBottom: '1rem' }}>How We Deliver Results (Strategic Pillars)</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {details.pillars.map((p, idx) => (
                  <div key={idx} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '8px' }}>
                    <div style={{ fontWeight: 700, color: 'var(--accent)', fontSize: '0.9rem', marginBottom: '0.25rem' }}>{idx + 1}. {p.title}</div>
                    <div style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.6)', lineHeight: '1.5' }}>{p.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1.5rem' }}>
              <InteractiveSandbox id={service.id} color={service.color} />
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// SERVICE SANDBOX WIDGETS
// -------------------------------------------------------------
const InteractiveSandbox = ({ id, color }) => {
  
  // A. Brand Strategy Axioms
  if (id === 'brand-strategy') {
    const [selectedAxiom, setSelectedAxiom] = useState(null);
    return (
      <div style={{ width: '100%' }}>
        <h5 style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '1.1rem', marginBottom: '1rem' }}>Interactive Cognitive Axioms</h5>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>Click coordinate keys to view strategic buyer heuristics:</p>
        <div className="chess-board-grid">
          {[
            { key: 'default', title: 'Default Choice Bias', text: 'Structuring layouts to make your brand the intuitive baseline option.' },
            { key: 'loss', title: 'Loss Aversion Hook', text: 'Positioning cart values around potential value leakage rather than gains.' },
            { key: 'social', title: 'Social Proof Multiplier', text: 'Deploying metrics to build authority and trigger herd mentality.' },
            { key: 'decoy', title: 'Decoy Pricing Model', text: 'Positioning tiered plans so the high-value option becomes the logical choose.' }
          ].map(x => (
            <div 
              key={x.key}
              className="chess-tile" 
              onClick={() => setSelectedAxiom(x.key)}
              style={{ borderColor: selectedAxiom === x.key ? color : '' }}
            >
              <div style={{ fontWeight: 700, color: color, marginBottom: '0.5rem' }}>{x.title}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{x.text}</div>
            </div>
          ))}
        </div>
        
        {selectedAxiom && (
          <div 
            id="axiom-detail-box" 
            style={{ 
              marginTop: '2rem', 
              padding: '1.5rem', 
              background: 'rgba(255,255,255,0.02)', 
              border: '1px solid rgba(255,255,255,0.05)', 
              borderRadius: '8px',
              borderLeft: `3px solid ${color}`,
              display: 'block' 
            }}
          >
            {selectedAxiom === 'default' && (
              <><strong>Axiom 01 // Default Selection:</strong> Consumers choose the path of least cognitive resistance. By framing your brand as the standard baseline option on landing pages, conversion probabilities increase by up to 210%.</>
            )}
            {selectedAxiom === 'loss' && (
              <><strong>Axiom 02 // Loss Aversion:</strong> The pain of losing is psychologically twice as powerful as the pleasure of gaining. We restructure USP statements to emphasize what clients stand to lose if they do not adopt your system.</>
            )}
            {selectedAxiom === 'social' && (
              <><strong>Axiom 03 // Herd Mentality:</strong> Buyers seek validation from peers. We design live transaction notifications and localized proof points to reduce purchasing friction.</>
            )}
            {selectedAxiom === 'decoy' && (
              <><strong>Axiom 04 // Decoy Placement:</strong> Introducing a third pricing model that is slightly less attractive than the premium tier makes the premium tier seem like an obvious, high-value deal.</>
            )}
          </div>
        )}
      </div>
    );
  }

  // B. Branding Morpher Slider
  if (id === 'branding') {
    const [sliderVal, setSliderVal] = useState(1);
    
    const getShapeStyle = () => {
      if (sliderVal === 1) return { borderRadius: '50%', transform: 'rotate(0deg) scale(1)' };
      if (sliderVal === 2) return { borderRadius: '12px', transform: 'rotate(45deg) scale(0.9)' };
      if (sliderVal === 3) return { borderRadius: '50% 0 50% 0', transform: 'rotate(15deg) scale(1)' };
      return { borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%', transform: 'rotate(-30deg) scale(1.05)' };
    };

    return (
      <div style={{ width: '100%' }}>
        <h5 style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '1.1rem', marginBottom: '1rem' }}>Visual Identity Morpher</h5>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '0.9rem' }}>Interact with geometry. Adjust the slider to transform brand shape styles:</p>
        <div className="morph-vector-container">
          <div 
            className="morph-shape-display" 
            id="brand-morph-shape" 
            style={{ 
              background: color, 
              boxShadow: `0 0 30px ${color}80`,
              ...getShapeStyle() 
            }}
          />
          <div style={{ width: '100%', maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <input 
              type="range" 
              min="1" 
              max="4" 
              value={sliderVal} 
              onChange={(e) => setSliderVal(parseInt(e.target.value))}
              style={{ width: '100%' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: "'Share Tech Mono', monospace", fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              <span>Minimal</span>
              <span>Geometric</span>
              <span>Organic</span>
              <span>Fluid</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // C. Graphic Design Color Swatches
  if (id === 'graphic-design') {
    const [palette, setPalette] = useState('cyber');

    const palettes = {
      cyber: { bg: '#0f172a', border: '#3b82f6', text: '#3b82f6', title: 'Cybernetic Minimalist', desc: 'High contrast layouts emphasizing neon links, tech styling, and vector indicators.' },
      sunset: { bg: '#7c2d12', border: '#f97316', text: '#f97316', title: 'Solar Heat Wave', desc: 'Vibrant warm gradients, fluid shadows, and rich organic typography for lifestyle brands.' },
      steel: { bg: '#334155', border: '#cbd5e1', text: '#cbd5e1', title: 'Corporate Titanium', desc: 'Industrial grey scale backings, razor-thin borders, and clean serif headings for financial assets.' },
      forest: { bg: '#064e3b', border: '#10b981', text: '#10b981', title: 'Verdant Organic', desc: 'Deep forest backdrops, soft mint overlays, and rounded shapes signaling sustainability.' }
    };

    const cur = palettes[palette];

    return (
      <div style={{ width: '100%' }}>
        <h5 style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '1.1rem', marginBottom: '1rem' }}>Dynamic Palette Architect</h5>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>Select a corporate mood palette and watch the UI atmosphere transform instantly:</p>
        <div style={{ display: 'flex', gap: '1.25rem', justifyContent: 'center', marginBottom: '2.5rem' }}>
          <div className={`liquid-color-swatch ${palette === 'cyber' ? 'active' : ''}`} onClick={() => setPalette('cyber')} style={{ background: '#0f172a', color: '#3b82f6' }}></div>
          <div className={`liquid-color-swatch ${palette === 'sunset' ? 'active' : ''}`} onClick={() => setPalette('sunset')} style={{ background: '#7c2d12', color: '#f97316' }}></div>
          <div className={`liquid-color-swatch ${palette === 'steel' ? 'active' : ''}`} onClick={() => setPalette('steel')} style={{ background: '#334155', color: '#cbd5e1' }}></div>
          <div className={`liquid-color-swatch ${palette === 'forest' ? 'active' : ''}`} onClick={() => setPalette('forest')} style={{ background: '#064e3b', color: '#10b981' }}></div>
        </div>
        <div 
          style={{ 
            border: '1px solid rgba(255,255,255,0.08)', 
            padding: '2rem', 
            borderRadius: '12px', 
            textAlign: 'center', 
            background: cur.bg, 
            borderTop: `4px solid ${cur.border}`, 
            transition: 'all 0.4s' 
          }}
        >
          <h6 style={{ fontSize: '1.2rem', fontWeight: 800, color: cur.text, marginBottom: '0.5rem' }}>{cur.title}</h6>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{cur.desc}</p>
        </div>
      </div>
    );
  }

  // D. Social Media impressions simulator
  if (id === 'social-media') {
    const [counterVal, setCounterVal] = useState(0);
    const timerRef = useRef(null);

    const handleMouseEnter = () => {
      clearInterval(timerRef.current);
      let currentVal = 0;
      timerRef.current = setInterval(() => {
        currentVal += Math.floor(Math.random() * 850) + 120;
        if (currentVal > 148520) currentVal = 148520;
        setCounterVal(currentVal);
      }, 35);
    };

    const handleMouseLeave = () => {
      clearInterval(timerRef.current);
    };

    useEffect(() => {
      return () => clearInterval(timerRef.current);
    }, []);

    return (
      <div style={{ width: '100%' }}>
        <h5 style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '1.1rem', marginBottom: '1rem' }}>Attention Velocity Simulator</h5>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>Hover or swipe the smartphone screen to witness audience engagement metrics multiply:</p>
        <div className="smartphone-frame" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} style={{ cursor: 'pointer' }}>
          <div style={{ padding: '2.2rem 1.5rem', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: 'linear-gradient(to bottom, #111827, #030712)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: "'Share Tech Mono', monospace", fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
              <span>LIVE CAMPAIGN</span>
              <span style={{ color: '#10b981' }}>● ONLINE</span>
            </div>
            
            <div style={{ textAlign: 'center', margin: '3rem 0' }}>
              <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>ENGAGED USER IMPRESSIONS</div>
              <div style={{ fontSize: '2.2rem', fontWeight: 900, color: 'white' }}>{counterVal.toLocaleString()}</div>
            </div>
            
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', padding: '0.85rem', borderRadius: '10px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.7rem', color: '#10B981', fontWeight: 700 }}>+482% CONVERSION ACCELERATION</div>
              <div style={{ fontSize: '0.6rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>Meta & Instagram Pixel Active</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // E. Content Creation 3D Cards
  if (id === 'content-creation') {
    const cardRefs = [useRef(null), useRef(null), useRef(null)];

    const handleMouseMove = (e, index) => {
      const card = cardRefs[index].current;
      if (!card) return;
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      card.style.transform = `scale(1.08) rotateX(${-y * 0.15}deg) rotateY(${x * 0.15}deg)`;
    };

    const handleMouseLeave = (index) => {
      const card = cardRefs[index].current;
      if (card) {
        card.style.transform = '';
      }
    };

    return (
      <div style={{ width: '100%' }}>
        <h5 style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '1.1rem', marginBottom: '1rem' }}>3D Perspective Asset Board</h5>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>Move your cursor over the Polaroid asset tiles to witness 3D perspective tilting:</p>
        <div className="mood-polaroid-grid">
          {[
            { id: 0, title: 'AUTHENTIC UGC HOOK', sub: 'Direct Response', bg: '#e2e8f0', dot: '#cbd5e1', rot: '-3deg' },
            { id: 1, title: 'SCROLL STOPPER ADS', sub: 'Attention Grabber', bg: '#fed7aa', dot: '#ffedd5', rot: '2deg' },
            { id: 2, title: 'PRODUCT CONVERSIONS', sub: 'Impulse Trigger', bg: '#d1fae5', dot: '#a7f3d0', rot: '-4deg' }
          ].map(c => (
            <div 
              key={c.id}
              ref={cardRefs[c.id]}
              className="mood-polaroid-card" 
              style={{ transform: `rotateZ(${c.rot})`, cursor: 'pointer' }}
              onMouseMove={(e) => handleMouseMove(e, c.id)}
              onMouseLeave={() => handleMouseLeave(c.id)}
            >
              <div style={{ height: '120px', background: c.bg, borderRadius: '2px', marginBottom: '0.75rem', backgroundImage: `radial-gradient(${c.dot} 20%, transparent 20%)`, backgroundSize: '8px 8px' }}></div>
              <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#0f172a' }}>{c.title}</div>
              <div style={{ fontSize: '0.65rem', color: '#64748b', marginTop: '0.25rem' }}>{c.sub}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // F. Video Editing Scrubber
  if (id === 'video-editing') {
    const [scrubVal, setScrubVal] = useState(0);

    const getPreviewStyle = () => {
      const hue = (scrubVal * 2) % 360;
      let filter = 'none';
      let text = 'STANDBY';
      
      if (scrubVal < 30) {
        filter = 'contrast(0.8) grayscale(0.5)';
        text = 'SCENE A // INTRO HOOK';
      } else if (scrubVal < 75) {
        filter = 'contrast(1.2) saturate(1.4)';
        text = 'SCENE B // PRODUCT DEMO (LUT APPLIED)';
      } else {
        filter = 'contrast(1.5) hue-rotate(60deg)';
        text = 'SCENE C // OUTRO CTA (GLOW APPLIED)';
      }

      return {
        background: `hsl(${hue}, 45%, 15%)`,
        filter,
        statusText: text
      };
    };

    const info = getPreviewStyle();

    return (
      <div style={{ width: '100%' }}>
        <h5 style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '1.1rem', marginBottom: '1rem' }}>Direct Post Scrubber & LUTs</h5>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>Slide the editing playhead scrubber to compile, slice, and color-grade visual assets dynamically:</p>
        <div className="video-timeline-scrub">
          <input 
            type="range" 
            min="0" 
            max="120" 
            value={scrubVal} 
            onChange={(e) => setScrubVal(parseInt(e.target.value))}
            style={{ width: '100%', marginBottom: '1.5rem' }} 
          />
          <div 
            id="edit-preview-display" 
            style={{ 
              height: '120px', 
              borderRadius: '8px', 
              border: '1px solid rgba(255,255,255,0.08)', 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center', 
              gap: '0.5rem', 
              transition: 'all 0.2s',
              background: info.background,
              filter: info.filter
            }}
          >
            <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{info.statusText}</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>Frame #{scrubVal.toString().padStart(3, '0')}</div>
          </div>
        </div>
      </div>
    );
  }

  // G. Meta Ads calculator
  if (id === 'meta-ads') {
    const [budget, setBudget] = useState(1000);

    return (
      <div style={{ width: '100%' }}>
        <h5 style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '1.1rem', marginBottom: '1rem' }}>Meta ROAS Forecast Calculator</h5>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>Slide the budget bar to view estimated lead volumes and target ROAS returns:</p>
        <div className="roas-slider-group">
          <label style={{ display: 'block', marginBottom: '0.5rem', fontFamily: "'Share Tech Mono', monospace", fontSize: '0.8rem', color: 'var(--text-secondary)' }}>DAILY AD BUDGET</label>
          <input 
            type="range" 
            min="100" 
            max="8000" 
            step="100"
            value={budget} 
            onChange={(e) => setBudget(parseInt(e.target.value))}
            style={{ width: '100%' }} 
          />
          
          <div style={{ marginTop: '2rem', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', textAlign: 'center' }}>
            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.04)' }}>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>DAILY SPEND</div>
              <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'white', marginTop: '0.25rem' }}>${budget.toLocaleString()}</div>
            </div>
            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.04)' }}>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>EST. REVENUE</div>
              <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#eab308', marginTop: '0.25rem' }}>${(budget * 4.5).toLocaleString()}</div>
            </div>
            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.04)' }}>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>TARGET ROAS</div>
              <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#10b981', marginTop: '0.25rem' }}>4.5x</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // H. Web Dev Compiler
  if (id === 'web-dev') {
    const [compiled, setCompiled] = useState(false);

    return (
      <div style={{ width: '100%' }}>
        <h5 style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '1.1rem', marginBottom: '1rem' }}>Dynamic Component Compiler</h5>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>Hover over raw code tags to compile and render design layout blocks dynamically:</p>
        <div 
          className="matrix-code-compiler" 
          onMouseEnter={() => setCompiled(true)}
          onMouseLeave={() => setCompiled(false)}
          style={{ cursor: 'pointer', lineHeight: 1.7 }}
        >
          <span style={{ color: '#f87171' }}>&lt;button</span> <span style={{ color: '#fb923c' }}>class=</span><span style={{ color: '#eab308' }}>"btn-glow"</span><span style={{ color: '#f87171' }}>&gt;</span><br />
          &nbsp;&nbsp;<span style={{ color: 'white' }}>Warp Connection</span><br />
          <span style={{ color: '#f87171' }}>&lt;/button&gt;</span>
        </div>
        <div 
          id="web-preview-box" 
          style={{ 
            marginTop: '1.5rem', 
            height: '100px', 
            background: compiled ? 'rgba(37,99,235,0.1)' : 'rgba(0,0,0,0.3)', 
            border: `1px solid ${compiled ? '#3b82f6' : 'rgba(255,255,255,0.08)'}`, 
            borderRadius: '8px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            transition: 'all 0.3s' 
          }}
        >
          {compiled ? (
            <button style={{ background: '#2563eb', color: 'white', fontFamily: "'Share Tech Mono', monospace", border: 'none', padding: '0.75rem 1.5rem', borderRadius: '4px', fontWeight: 700, cursor: 'pointer', boxShadow: '0 0 20px rgba(37,99,235,0.5)' }}>WARP CONNECTION</button>
          ) : (
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontStyle: 'italic' }}>[ Hover above code to compile ]</span>
          )}
        </div>
      </div>
    );
  }

  // I. AI Automation Network Flow
  if (id === 'ai-automation') {
    const [flowActive, setFlowActive] = useState(false);

    return (
      <div style={{ width: '100%' }}>
        <h5 style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '1.1rem', marginBottom: '1rem' }}>Neural Automation Network</h5>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>Move your cursor inside the map to establish neural links and automate operations:</p>
        <div 
          className="neural-flow-canvas" 
          onMouseEnter={() => setFlowActive(true)}
          onMouseLeave={() => setFlowActive(false)}
          style={{ overflow: 'hidden', cursor: 'crosshair' }}
        >
          <div style={{ position: 'absolute', top: '25px', left: '25px', padding: '0.5rem 1rem', background: 'rgba(239,68,68,0.1)', border: '1px solid #f87171', borderRadius: '6px', fontSize: '0.75rem', fontFamily: "'Share Tech Mono', monospace" }} className="ai-node">01 // Lead Opt-In</div>
          <div 
            style={{ 
              position: 'absolute', 
              top: '125px', 
              left: '180px', 
              padding: '0.5rem 1rem', 
              background: flowActive ? 'rgba(239,68,68,0.2)' : 'rgba(239,68,68,0.1)', 
              border: '1px solid #f87171', 
              borderRadius: '6px', 
              fontSize: '0.75rem', 
              fontFamily: "'Share Tech Mono', monospace", 
              opacity: flowActive ? 1 : 0.3, 
              transition: 'all 0.3s' 
            }} 
            className="ai-node"
          >
            02 // AI Qualify
          </div>
          <div 
            style={{ 
              position: 'absolute', 
              top: '225px', 
              left: '330px', 
              padding: '0.5rem 1rem', 
              background: flowActive ? 'rgba(239,68,68,0.2)' : 'rgba(239,68,68,0.1)', 
              border: '1px solid #f87171', 
              borderRadius: '6px', 
              fontSize: '0.75rem', 
              fontFamily: "'Share Tech Mono', monospace", 
              opacity: flowActive ? 1 : 0.3, 
              transition: 'all 0.5s' 
            }} 
            className="ai-node"
          >
            03 // CRM Schedule
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default RoomOverlay;
