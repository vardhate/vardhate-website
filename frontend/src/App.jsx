import React, { useState, useEffect, useRef } from 'react';
import CanvasEngine from './components/CanvasEngine';
import AudioManager from './components/AudioManager';
import RoomOverlay from './components/RoomOverlay';
import AdminPanel from './components/AdminPanel';
import PasswordGate from './components/PasswordGate';
import Viewer from './components/Viewer';
import { fetchDatabase } from './utils/api';
import { VARDHATE_DEFAULT_DATA } from './utils/default-data';
import { TRANSLATIONS } from './utils/translations';
import { 
  Brain, 
  TrendingUp, 
  Briefcase, 
  Video, 
  Cpu, 
  Activity, 
  BookOpen, 
  Terminal,
  Shield
} from 'lucide-react';

const IconMap = {
  brain: Brain,
  "trending-up": TrendingUp,
  briefcase: Briefcase,
  video: Video,
  cpu: Cpu,
  activity: Activity,
  "book-open": BookOpen,
  terminal: Terminal,
  shield: Shield
};

const PORTALS = [
  { id: "brand-lab", label: "Brand Lab", code: "01", icon: "brain", angle: -90, layout: "editorial" },
  { id: "growth-engine", label: "Growth Engine", code: "02", icon: "trending-up", angle: -45, layout: "editorial" },
  { id: "trust-wall", label: "Trust Wall", code: "03", icon: "shield", angle: 0, layout: "cases" },
  { id: "creative-studio", label: "Creative Studio", code: "04", icon: "video", angle: 45, layout: "editorial" },
  { id: "ai-systems", label: "AI Systems", code: "05", icon: "cpu", angle: 90, layout: "about" },
  { id: "services", label: "Services", code: "06", icon: "activity", angle: 135, layout: "services" },
  { id: "insights", label: "Insights", code: "07", icon: "book-open", angle: 180, layout: "editorial" },
  { id: "contact", label: "Contact", code: "08", icon: "terminal", angle: 225, layout: "terminal" }
];

const App = () => {
  const [stage, setStage] = useState('boot'); // boot | warp | center | room | password | admin | viewer
  const [db, setDb] = useState(null);
  const [activePortal, setActivePortal] = useState(null);
  const [bootProgress, setBootProgress] = useState(0);

  const lang = 'en';

  const [showPartners, setShowPartners] = useState(false);
  const [particles, setParticles] = useState([]);
  const [locationOpen, setLocationOpen] = useState(false);

  const handleLogoDoubleClick = () => {
    setShowPartners(prev => !prev);
    
    // Generate 40 particles for the dissolve effect
    const newParticles = Array.from({ length: 40 }).map((_, i) => {
      const angle = Math.random() * Math.PI * 2;
      const distance = 40 + Math.random() * 120;
      const tx = Math.cos(angle) * distance;
      const ty = Math.sin(angle) * distance;
      const delay = Math.random() * 0.3;
      return { id: i, tx, ty, delay };
    });
    setParticles(newParticles);
    
    // Auto clear particles
    setTimeout(() => {
      setParticles([]);
    }, 1000);
  };
  const [bootReady, setBootReady] = useState(false);
  const [charged, setCharged] = useState(false);
  const [ripples, setRipples] = useState([]);
  
  // Authenticated state persistence for viewer / admin
  const [authRole, setAuthRole] = useState(null);

  // Keyboard hooks for environment shifts and Konami code
  const [envShift, setEnvShift] = useState(0);
  const [orbitOffset, setOrbitOffset] = useState(0);
  const konamiRef = useRef([]);

  const cursorDotRef = useRef(null);
  const cursorGlowRef = useRef(null);

  // Auto-rotating planetary orbits loop
  useEffect(() => {
    if (stage !== 'center') return;
    let animationFrame;
    const animate = () => {
      setOrbitOffset(prev => (prev + 0.08) % 360); // smooth, slow orbit velocity
      animationFrame = requestAnimationFrame(animate);
    };
    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [stage]);

  // Custom cursor mouse movement tracking
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (cursorDotRef.current) {
        cursorDotRef.current.style.left = `${e.clientX}px`;
        cursorDotRef.current.style.top = `${e.clientY}px`;
      }
      if (cursorGlowRef.current) {
        cursorGlowRef.current.style.left = `${e.clientX}px`;
        cursorGlowRef.current.style.top = `${e.clientY}px`;
      }
    };

    const handleMouseOver = (e) => {
      const isHoverable = e.target.closest('a, button, [role="button"], input, textarea, select, .orbit-portal-btn, .btn-room-back, .studio-carousel-btn');
      if (isHoverable) {
        cursorDotRef.current?.classList.add('custom-cursor-hover-dot');
        cursorGlowRef.current?.classList.add('custom-cursor-hover-glow');
      } else {
        cursorDotRef.current?.classList.remove('custom-cursor-hover-dot');
        cursorGlowRef.current?.classList.remove('custom-cursor-hover-glow');
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseover', handleMouseOver);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  // Fetch website configuration from PHP API
  useEffect(() => {
    const loadData = async () => {
      try {
        const config = await fetchDatabase();
        setDb(config);
      } catch (err) {
        console.warn("API load failed, falling back to local defaults.", err);
        setDb(VARDHATE_DEFAULT_DATA);
      }
    };
    loadData();
  }, []);

  // 1. Boot screen loading percentage ticker
  useEffect(() => {
    if (stage !== 'boot') return;
    const interval = setInterval(() => {
      setBootProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setBootReady(true);
          return 100;
        }
        const step = Math.floor(Math.random() * 8) + 2;
        return Math.min(100, prev + step);
      });
    }, 90);
    return () => clearInterval(interval);
  }, [stage]);

  // 2. Click shockwave ripple burst (on background only)
  const handleSingleClick = (e) => {
    // Avoid triggering ripple on interactive elements to prevent visual clutter
    if (e.target.closest('button, a, input, textarea, select')) return;
    
    const id = Date.now();
    const newRipple = { id, x: e.clientX, y: e.clientY };
    setRipples(prev => [...prev, newRipple]);
    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== id));
    }, 1500);
  };

  // 3. Environment orbits rotation (Spacebar shift)
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Space shifts orbit rotation angles
      if (e.code === 'Space' && (stage === 'center' || stage === 'room')) {
        e.preventDefault();
        setEnvShift(prev => prev + 45);
      }

      // Track Konami Code keys
      const konami = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];
      konamiRef.current.push(e.key);
      if (konamiRef.current.length > konami.length) {
        konamiRef.current.shift();
      }
      if (JSON.stringify(konamiRef.current) === JSON.stringify(konami)) {
        setCharged(true);
        alert("[SYSTEM] OS CHARGED - QUANTUM TUNNELING SECURED.");
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [stage]);

  // 4. Enter OS warp sequence
  const handleBootClick = () => {
    if (!bootReady) return;
    setStage('warp');
    
    // Play virtual entry shockwave burst
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight * 0.45;
    const id = Date.now();
    setRipples(prev => [...prev, { id, x: cx, y: cy, isBoot: true }]);

    setTimeout(() => {
      setStage('center');
    }, 850);
  };

  // 5. Navigate to a portal room (with URL hash)
  const enterRoom = (portal) => {
    setActivePortal(portal);
    setStage('room');
    window.history.pushState({ portal: portal.id }, '', `#${portal.id}`);
  };

  // 6. Navigation exit handler (with URL hash clear)
  const handleRoomBack = () => {
    setStage('center');
    setActivePortal(null);
    window.history.pushState({}, '', window.location.pathname);
  };

  // 7. Browser back/forward button support
  useEffect(() => {
    const handlePopState = (e) => {
      const hash = window.location.hash.replace('#', '');
      if (hash) {
        const found = PORTALS.find(p => p.id === hash);
        if (found && stage !== 'boot') {
          setActivePortal(found);
          setStage('room');
        }
      } else {
        // No hash = go back to center
        if (stage === 'room') {
          setStage('center');
          setActivePortal(null);
        }
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [stage]);

  // 8. Security Password handler
  const handleAuthSuccess = (role, redirect) => {
    setAuthRole(role);
    setStage(redirect);
  };

  if (!db) {
    return (
      <div className="loader-overlay" style={{ visibility: 'visible', opacity: 1, background: '#050505' }}>
        <div className="loader-spinner"></div>
        <p style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--text-secondary)' }}>Initializing VARDHATE OS...</p>
      </div>
    );
  }

  return (
    <div 
      onClick={handleSingleClick}
      onDoubleClick={handleLogoDoubleClick}
      style={{ width: '100vw', height: '100vh', overflow: 'hidden', position: 'relative', background: '#050505' }}
    >
      {/* Custom Cursor elements */}
      <div ref={cursorDotRef} className="custom-cursor-dot" />
      <div ref={cursorGlowRef} className="custom-cursor-glow" />
      
      {/* Background drifting stars */}
      <CanvasEngine stage={stage} />

      {/* Floating Shockwave ripples */}
      {ripples.map(r => (
        <span 
          key={r.id} 
          className="shockwave-burst ripple-animate" 
          style={{
            left: r.x,
            top: r.y,
            borderColor: r.isBoot ? '#facc15' : 'var(--accent)',
            boxShadow: r.isBoot ? '0 0 50px rgba(250,204,21,0.5)' : '0 0 35px rgba(37,99,235,0.4)',
            width: r.isBoot ? '1500px' : '400px',
            height: r.isBoot ? '1500px' : '400px'
          }}
        />
      ))}

      {/* Ambient background sound control */}
      <AudioManager visible={stage !== 'boot' && stage !== 'warp' && stage !== 'admin' && stage !== 'password'} />

      {/* ------------------------------------------------------------- */}
      {/* STAGE SWITCH ROUTER */}
      {/* ------------------------------------------------------------- */}

      {/* A. BOOT/STARTING STAGE */}
      {stage === 'boot' && (
        <section className="stage-section active" id="stage-boot" style={{ zIndex: 5 }}>
          <div 
            className="boot-click-overlay" 
            onClick={handleBootClick}
            style={{ 
              opacity: 1, 
              cursor: bootReady ? 'pointer' : 'default', 
              pointerEvents: 'auto',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%'
            }}
          >
            <div className="boot-manifesto-container" style={{ textAlign: 'center' }}>
              <div className="boot-logo-wrapper" style={{ marginBottom: '2rem' }}>
                <img 
                  src="/assets/vardhate-logo-white-full.png"
                  alt="VARDHATE Logo" 
                  className="boot-brand-logo" 
                  onError={(e) => { e.target.onerror = null; e.target.src = '/assets/vardhate-logo-white.png'; }}
                  style={{ maxWidth: '280px', width: '90%' }}
                />
              </div>
              <div className="boot-loading-text" style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.9rem', letterSpacing: '0.1em', color: 'white' }}>
                {bootReady ? (
                  <span style={{ color: '#ffffff', fontWeight: 900, textShadow: '0 0 10px rgba(255,255,255,0.4)', animation: 'pulse 1.5s infinite' }}>
                    [ CLICK LOGO TO ENTER ]
                  </span>
                ) : (
                  `INITIALIZING OS COGNITIVE ENGINES... [ ${bootProgress}% ]`
                )}
              </div>
            </div>
            
            {/* Boot stage socials */}
            <div className="boot-social-footer" style={{ pointerEvents: 'auto' }}>
              <a href="https://www.facebook.com/vardhate.in" target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
              </a>
              <a href="https://www.instagram.com/vardhate.in/reels/" target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
              <a href="https://youtube.com/@vardhate" target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
              </a>
              <a href="https://linkedin.com/company/vardhate" target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
              </a>
            </div>
          </div>
        </section>
      )}

      {/* B. WARP STAGE (Transition phase) */}
      {stage === 'warp' && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 6 }} />
      )}

      {/* C. MAIN COMMAND CENTER DASHBOARD STAGE */}
      {stage === 'center' && (
        <section className="stage-section active" id="stage-center" style={{ zIndex: 4 }}>
          {/* Logo center branding */}
          <div className="center-branding" style={{ pointerEvents: 'auto' }}>
            <div 
              className="living-logo-container" 
              onDoubleClick={handleLogoDoubleClick}
              style={{ 
                position: 'relative', 
                width: '320px', 
                height: '320px', 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center',
                cursor: 'pointer',
                pointerEvents: 'auto',
                margin: '0 auto 1.5rem'
              }}
            >
              {/* Logo image (disappears on showPartners) */}
              <img 
                src="/assets/vardhate-logo-white-full.png"
                alt="VARDHATE Logo" 
                className={`living-logo-img breathing ${showPartners ? 'logo-dissolve' : ''}`} 
                onError={(e) => { e.target.onerror = null; e.target.src = '/assets/vardhate-logo-white.png'; }}
                style={{
                  position: 'absolute',
                  maxWidth: '100%',
                  maxHeight: '100%',
                  opacity: showPartners ? 0 : 1,
                  transform: showPartners ? 'scale(0.3) rotate(180deg)' : 'scale(1)',
                  filter: showPartners ? 'blur(10px)' : 'drop-shadow(0 0 15px rgba(255, 255, 255, 0.25))',
                  transition: 'all 0.8s cubic-bezier(0.6, -0.28, 0.735, 0.045)',
                  pointerEvents: showPartners ? 'none' : 'auto'
                }}
              />

              {/* Partners image (appears on showPartners) */}
              <img 
                src="/assets/partner_image.png" 
                alt="Vardhate Partners" 
                className={`living-logo-img breathing ${showPartners ? 'partner-appear' : ''}`}
                onError={(e) => { e.target.onerror = null; }}
                style={{
                  position: 'absolute',
                  width: '90%',
                  height: '90%',
                  borderRadius: '50%',
                  border: '3px solid var(--accent)',
                  boxShadow: '0 0 25px rgba(36, 80, 164, 0.6)',
                  objectFit: 'cover',
                  objectPosition: 'center calc(100% + 30px)',
                  opacity: showPartners ? 1 : 0,
                  transform: showPartners ? 'scale(1) rotate(0deg)' : 'scale(0.3) rotate(-180deg)',
                  filter: showPartners ? 'drop-shadow(0 0 15px rgba(36, 80, 164, 0.5))' : 'blur(10px)',
                  transition: 'all 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                  pointerEvents: showPartners ? 'auto' : 'none'
                }}
              />

              {/* Particle Dots Burst Overlay */}
              {particles.map(p => (
                <span 
                  key={p.id}
                  className="dissolve-particle"
                  style={{
                    position: 'absolute',
                    width: '6px',
                    height: '6px',
                    background: 'var(--accent)',
                    borderRadius: '50%',
                    boxShadow: '0 0 8px var(--accent)',
                    pointerEvents: 'none',
                    left: '50%',
                    top: '50%',
                    '--tx': `${p.tx}px`,
                    '--ty': `${p.ty}px`,
                    animation: 'particle-disperse 1s forwards ease-out',
                    animationDelay: `${p.delay}s`
                  }}
                />
              ))}
            </div>
            <p className="center-subtext" style={{ textShadow: charged ? '0 0 15px #10b981' : '' }}>
              {charged ? 'QUANTUM SECURITY STRIKE' : (db.settings.tagline || 'NO 1 CONSUMER DECISION COMPANY')}
            </p>
          </div>

          {/* Elliptical Orbits (Desktop Orbits) */}
          <div className="orbit-paths-container" aria-hidden="true">
            <svg className="orbit-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
              <ellipse cx="50" cy="50" rx="42" ry="34" className="orbit-ellipse" style={{ stroke: charged ? '#10b98130' : '' }} />
              <ellipse cx="50" cy="50" rx="30" ry="24" className="orbit-ellipse-inner" style={{ stroke: charged ? '#10b98140' : '' }} />
            </svg>

            {PORTALS.map((portal) => {
              // Calculate angles + environment shifts + auto-orbit offset
              const angleRad = ((portal.angle + envShift + orbitOffset) * Math.PI) / 180;
              const x = 50 + Math.cos(angleRad) * 42;
              const y = 50 + Math.sin(angleRad) * 34;

              return (
                <button 
                  key={portal.id}
                  className="orbit-portal-btn"
                  onClick={() => enterRoom(portal)}
                  style={{
                    position: 'absolute',
                    left: `${x}%`,
                    top: `${y}%`,
                    transform: 'translate(-50%, -50%)',
                    borderColor: charged ? '#10b981' : ''
                  }}
                >
                  <div className="portal-button-circle" style={{ background: charged ? '#064e3b' : '' }}>
                    <span className="portal-button-code" style={{ color: charged ? '#10b981' : '' }}>{portal.code}</span>
                    <span className="portal-button-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {(() => {
                        const PortalIcon = IconMap[portal.icon] || Cpu;
                        return <PortalIcon size={28} strokeWidth={1.6} />;
                      })()}
                    </span>
                  </div>
                  <span className="portal-button-label" style={{ color: charged ? '#10b981' : 'white' }}>
                    {TRANSLATIONS[lang][portal.id] || portal.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Mobile Grid Layout Fallback (Mobile View Only) */}
          <div className="mobile-portals-grid">
            {PORTALS.map(portal => {
              const PortalIcon = IconMap[portal.icon] || Cpu;
              return (
                <button key={portal.id} className="portal-card-btn" onClick={() => enterRoom(portal)}>
                  <span className="portal-card-code">{portal.code}</span>
                  <span className="portal-card-icon" style={{ color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0.35rem 0' }}>
                    <PortalIcon size={26} strokeWidth={1.6} />
                  </span>
                  <span className="portal-card-label">
                    {TRANSLATIONS[lang][portal.id] || portal.label}
                  </span>
                </button>
              );
            })}
          </div>
        </section>
      )}

      {/* D. SECTOR ROOM STAGE */}
      {stage === 'room' && activePortal && (
        <RoomOverlay 
          portal={activePortal} 
          db={db} 
          lang={lang}
          onBack={handleRoomBack} 
        />
      )}

      {/* E. AUTHENTICATION PASSWORD GATE STAGE */}
      {stage === 'password' && (
        <PasswordGate onSuccess={handleAuthSuccess} />
      )}

      {/* F. SCRIPT READER WORKSPACE STAGE */}
      {stage === 'viewer' && (
        <Viewer db={db} onExit={() => setStage('center')} />
      )}

      {/* G. CMS CONTROL PANEL STAGE */}
      {stage === 'admin' && (
        <AdminPanel 
          db={db} 
          onUpdateDB={(newDB) => setDb(newDB)} 
          onExit={() => setStage('center')} 
        />
      )}

      {/* ------------------------------------------------------------- */}
      {/* GLOBAL HUD & FLOATING DOCK */}
      {/* ------------------------------------------------------------- */}
      
      {(stage === 'center' || stage === 'room') && (
        <>
          {/* Floating Social Media Dock */}
          <div className="social-dock" id="social-dock" style={{ opacity: 1, pointerEvents: 'auto' }}>
            <a href="https://www.facebook.com/vardhate.in" target="_blank" rel="noopener noreferrer" className="dock-item-btn" aria-label="Facebook">
              <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
            </a>
            <a href="https://www.instagram.com/vardhate.in/reels/" target="_blank" rel="noopener noreferrer" className="dock-item-btn" aria-label="Instagram Reels">
              <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
            </a>
            <a href="https://youtube.com/@vardhate" target="_blank" rel="noopener noreferrer" className="dock-item-btn" aria-label="YouTube">
              <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
            </a>
            <a href="https://linkedin.com/company/vardhate" target="_blank" rel="noopener noreferrer" className="dock-item-btn" aria-label="LinkedIn">
              <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
            </a>

            {/* Location pin button — blinking */}
            <button
              className="dock-item-btn location-blink-btn"
              onClick={() => setLocationOpen(true)}
              aria-label="Office Location"
              style={{ position: 'relative' }}
            >
              <span className="location-ping-dot" />
              <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
            </button>
          </div>

          {/* OS HUD controls instruction text */}
          <div className="os-footer-instructions" id="os-footer-info" style={{ opacity: 1, pointerEvents: 'none' }}>
            {TRANSLATIONS[lang].footerInstructions}
          </div>
        </>
      )}

      {/* Floating WhatsApp contact button */}
      <a 
        href="https://wa.me/919081105344?text=Hello%20Vardhate%20OS,%20I%20am%20interested%20in%20your%20choice%20engineering%20services."
        target="_blank" 
        rel="noopener noreferrer"
        className="whatsapp-float-btn"
        title={TRANSLATIONS[lang].whatsappTooltip}
        style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: '#2450a4',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 8px 30px rgba(36, 80, 164, 0.4)',
          zIndex: 9999,
          cursor: 'pointer',
          transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        <span className="whatsapp-pulse-ring"></span>
        {/* Official WhatsApp icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 175.216 175.552"
          width="28"
          height="28"
          style={{ zIndex: 2, position: 'relative' }}
        >
          <defs>
            <linearGradient id="wa-grad" x1="85.915" y1="175.552" x2="86.535" y2="0.174" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#fff"/>
              <stop offset="1" stopColor="#fff"/>
            </linearGradient>
          </defs>
          <path fill="url(#wa-grad)" d="M87.184 4.176C43.178 4.176 7.39 39.964 7.384 83.97c-.001 13.924 3.637 27.51 10.566 39.47L6.544 171.4l49.135-12.898a79.573 79.573 0 0 0 31.464 6.53h.04c44 0 79.788-35.789 79.796-79.795.003-21.315-8.294-41.355-23.368-56.44C128.534 12.48 108.497 4.178 87.184 4.176zm0 146.043h-.032a66.067 66.067 0 0 1-33.684-9.22l-2.42-1.436-25.078 6.582 6.698-24.464-1.575-2.506a65.907 65.907 0 0 1-10.113-35.205c.006-36.447 29.675-66.11 66.135-66.11 17.664.003 34.266 6.888 46.74 19.373 12.473 12.486 19.344 29.094 19.34 46.763-.006 36.45-29.676 66.123-66.011 66.123zm36.266-49.524c-1.987-1-11.754-5.804-13.576-6.46-1.822-.658-3.147-.986-4.471.993-1.325 1.98-5.129 6.46-6.289 7.786-1.16 1.328-2.319 1.493-4.306.498s-8.388-3.09-15.977-9.865c-5.908-5.273-9.895-11.783-11.056-13.763-1.16-1.983-.124-3.055.872-4.041.895-.886 1.985-2.31 2.978-3.464 1-1.152 1.325-1.979 1.99-3.302.66-1.326.33-2.484-.164-3.479-.495-.993-4.471-10.774-6.123-14.748-1.612-3.875-3.251-3.35-4.471-3.41-1.158-.059-2.484-.07-3.808-.07-1.326 0-3.48.497-5.3 2.478-1.822 1.98-6.953 6.793-6.953 16.573s7.118 19.23 8.11 20.556c.993 1.325 14.009 21.386 33.938 30.003 4.742 2.047 8.444 3.27 11.332 4.185 4.764 1.513 9.102 1.3 12.528.788 3.82-.569 11.758-4.813 13.41-9.46 1.66-4.646 1.66-8.625 1.162-9.457-.496-.832-1.82-1.328-3.81-2.326z"/>
        </svg>
      </a>

      {/* Location Dialog */}
      {locationOpen && (
        <div
          onClick={() => setLocationOpen(false)}
          style={{
            position: 'fixed', inset: 0, zIndex: 100000,
            background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '1rem'
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: '#0a0a0a', border: '1px solid rgba(36,80,164,0.5)',
              borderRadius: '20px', overflow: 'hidden',
              width: '100%', maxWidth: '600px',
              boxShadow: '0 30px 80px rgba(0,0,0,0.8), 0 0 40px rgba(36,80,164,0.2)'
            }}
          >
            {/* Dialog header */}
            <div style={{ padding: '1.5rem 1.75rem', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#2450a4', boxShadow: '0 0 10px #2450a4', animation: 'locationPing 1.8s infinite', display: 'inline-block' }} />
                  <span style={{ fontSize: '0.7rem', letterSpacing: '0.12em', color: '#4a7fd4', fontWeight: 700 }}>LIVE LOCATION</span>
                </div>
                <h3 style={{ color: 'white', fontWeight: 900, fontSize: '1.2rem', margin: '0.25rem 0 0' }}>Vardhate HQ — Pune, India</h3>
                <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.82rem', margin: '0.2rem 0 0' }}>📍 Office No. 101, Innovation Hub, Baner Road, Pune — 411045, Maharashtra</p>
              </div>
              <button onClick={() => setLocationOpen(false)} style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', width: '36px', height: '36px', borderRadius: '50%', cursor: 'pointer', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>✕</button>
            </div>

            {/* Map embed */}
            <div style={{ position: 'relative', height: '320px' }}>
              <iframe
                title="Vardhate Location Map"
                width="100%"
                height="100%"
                style={{ border: 0, display: 'block' }}
                loading="lazy"
                allowFullScreen
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3782.265588556298!2d73.78529231537845!3d18.559284087382587!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2bf22437ae091%3A0xc27a5bb4c00c9fe!2sBaner%2C%20Pune%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1637000000000!5m2!1sen!2sin"
              />
            </div>

            {/* Footer links */}
            <div style={{ padding: '1.25rem 1.75rem', borderTop: '1px solid rgba(255,255,255,0.07)', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <a href="https://maps.google.com/?q=Baner+Road+Pune+411045" target="_blank" rel="noopener noreferrer"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.6rem 1.2rem', borderRadius: '8px', background: '#2450a4', color: 'white', textDecoration: 'none', fontWeight: 700, fontSize: '0.82rem' }}>
                🗺️ Open in Google Maps
              </a>
              <a href="tel:+919081105344"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.6rem 1.2rem', borderRadius: '8px', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', textDecoration: 'none', fontWeight: 700, fontSize: '0.82rem' }}>
                📞 +91 90811 05344
              </a>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default App;
