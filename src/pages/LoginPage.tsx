import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const login = useAuthStore(s => s.login);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login(email, password);
    if (success) navigate('/dashboard');
    else setError('Invalid credentials');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: 'var(--md-sys-color-surface)' }}>
      <div className="card-elevated w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="title-large text-primary">My Finance Pro</h1>
          <p className="body-medium text-on-surface-variant mt-2">Kelola keuangan dengan mudah</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="label-small text-on-surface-variant mb-1 block">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="input w-full" placeholder="Email" required />
          </div>
          <div className="mb-6">
            <label className="label-small text-on-surface-variant mb-1 block">Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="input w-full" placeholder="Password" required />
          </div>
          {error && <div className="body-small text-error mb-4">{error}</div>}
          <button type="submit" className="btn-primary w-full">Login</button>
        </form>
        <div className="divider my-4" />
        <div className="body-small text-center text-on-surface-variant">Demo: email & password apa saja</div>
      </div>
    </div>
  );
};
