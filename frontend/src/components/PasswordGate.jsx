import React, { useState } from 'react';
import { login } from '../utils/api';

const PasswordGate = ({ onSuccess }) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [shake, setShake] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);
    
    try {
      const response = await login(password.trim());
      onSuccess(response.role, response.redirect);
    } catch (err) {
      setShake(true);
      setErrorMsg(err.message || 'Incorrect access password.');
      setTimeout(() => setShake(false), 500);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper" style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#050505' }}>
      
      {loading && (
        <div className="loader-overlay" id="page-loader" style={{ visibility: 'visible', opacity: 1 }}>
          <div className="loader-spinner"></div>
          <p style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--text-secondary)' }}>Securing Connection...</p>
        </div>
      )}

      <div className={`glass-card auth-card ${shake ? 'shake' : ''}`} style={{ maxWidth: '420px', width: '90%', padding: '2.5rem', borderRadius: '16px', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.06)', backdropFilter: 'blur(20px)', boxShadow: '0 25px 50px rgba(0,0,0,0.5)', textAlign: 'center' }}>
        <div className="auth-logo" style={{ marginBottom: '1.5rem', color: 'var(--accent)' }}>
          <svg style={{ width: '2.75rem', height: '2.75rem' }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path>
            <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
            <line x1="12" y1="19" x2="12" y2="22"></line>
          </svg>
        </div>

        <div className="client-meta" style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.75rem', color: 'var(--accent)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
          Secure Authentication Gate
        </div>
        <h2 className="auth-title" style={{ fontSize: '1.5rem', fontWeight: 900, color: 'white', marginBottom: '0.75rem' }}>Corporate Portal</h2>
        <p className="auth-subtitle" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '2rem' }}>
          Please enter the security password provided by your agency to preview scripts, recordings, or access CMS.
        </p>

        <form onSubmit={handleSubmit} style={{ textAlign: 'left' }}>
          <div className="input-group" style={{ marginBottom: '1.5rem' }}>
            <label htmlFor="script-password" className="input-label" style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Project Password
            </label>
            <div className="input-wrapper" style={{ position: 'relative' }}>
              <input 
                type={showPassword ? 'text' : 'password'} 
                id="script-password" 
                className="form-input" 
                placeholder="Enter password (e.g. demo)" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
                autoFocus
                style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '0.8rem 1rem', paddingRight: '2.5rem', borderRadius: '8px', fontSize: '0.9rem', outline: 'none' }}
              />
              <button 
                type="button" 
                className="input-toggle" 
                onClick={() => setShowPassword(p => !p)}
                style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', fontSize: '1.1rem' }}
                aria-label="Toggle Password Visibility"
              >
                {showPassword ? '🔒' : '👁️'}
              </button>
            </div>
          </div>

          {errorMsg && (
            <div style={{ color: '#ef4444', fontSize: '0.8rem', fontWeight: 600, marginBottom: '1rem', textAlign: 'center' }}>
              {errorMsg}
            </div>
          )}

          <button 
            type="submit" 
            className="btn btn-primary auth-btn" 
            style={{ width: '100%', padding: '0.85rem', background: 'var(--accent)', border: 'none', color: 'white', fontWeight: 700, borderRadius: '8px', cursor: 'pointer', transition: 'all 0.25s', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
          >
            Continue to Workspace <span style={{ marginLeft: '0.5rem' }}>→</span>
          </button>
        </form>

        <p style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)', marginTop: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}>
          <svg style={{ width: '12px', height: '12px' }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
          <span>End-to-End Encrypted Session</span>
        </p>
      </div>
    </div>
  );
};

export default PasswordGate;
