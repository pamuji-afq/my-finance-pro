import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const login = useAuthStore(s => s.login);
  const navigate = useNavigate();
  const handleSubmit = async (e: React.FormEvent) => { e.preventDefault(); const success = await login(email, password); if (success) navigate('/dashboard'); else setError('Invalid credentials'); };
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--md-sys-color-surface)', padding: '16px' }}>
      <div className="m3-card-elevated" style={{ maxWidth: 400, width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div className="m3-headline-medium" style={{ color: 'var(--md-sys-color-primary)' }}>My Finance Pro</div>
          <div className="m3-body-medium" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>Kelola keuangan dengan mudah</div>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="m3-text-field" style={{ marginBottom: 16 }}><label>Email</label><input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required /></div>
          <div className="m3-text-field" style={{ marginBottom: 24 }}><label>Password</label><input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" required /></div>
          {error && <div className="m3-body-small" style={{ color: 'var(--md-sys-color-error)', marginBottom: 16 }}>{error}</div>}
          <button type="submit" className="m3-button m3-button-filled" style={{ width: '100%' }}>Login</button>
        </form>
        <div className="m3-divider" /><div className="m3-body-small" style={{ textAlign: 'center', color: 'var(--md-sys-color-on-surface-variant)' }}>Demo: email & password apa saja</div>
      </div>
    </div>
  );
};