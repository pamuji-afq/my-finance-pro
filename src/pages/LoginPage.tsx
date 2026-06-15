import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [pwd, setPwd] = useState('');
  const login = useAuthStore(s => s.login);
  const nav = useNavigate();
  const submit = async (e) => { e.preventDefault(); if (await login(email, pwd)) nav('/dashboard'); };
  return (<div className="app" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}><div className="card" style={{ width: '100%', margin: 16 }}><div className="text-center mb-6"><h1 className="text-title-large text-primary">My Finance Pro</h1><p className="text-label mt-2">Kelola keuangan dengan mudah</p></div><form onSubmit={submit}><input type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} className="input w-full mb-3" required /><input type="password" placeholder="Password" value={pwd} onChange={e=>setPwd(e.target.value)} className="input w-full mb-4" required /><button type="submit" className="btn-primary">Login</button></form><p className="text-label text-center mt-4" style={{ color: 'var(--md-outline)' }}>Demo: email & password apa saja</p></div></div>);
};