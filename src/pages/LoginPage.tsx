import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [pwd, setPwd] = useState('');
  const login = useAuthStore(s => s.login);
  const nav = useNavigate();
  const submit = async (e) => { e.preventDefault(); if (await login(email, pwd)) nav('/dashboard'); };
  return (
    <div className="app-container" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
      <div className="card" style={{ width: '100%', maxWidth: '400px' }}>
        <div className="text-center mb-6"><h1 className="text-title-large text-primary">My Finance Pro</h1><p className="text-body text-on-surface-variant mt-2">Kelola keuangan dengan mudah</p></div>
        <form onSubmit={submit}>
          <input type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} className="input-field w-full mb-3" required />
          <input type="password" placeholder="Password" value={pwd} onChange={e=>setPwd(e.target.value)} className="input-field w-full mb-4" required />
          <button type="submit" className="btn-primary">Login</button>
        </form>
        <div className="text-center text-label text-on-surface-variant mt-4">Demo: email & password apa saja</div>
      </div>
    </div>
  );
};