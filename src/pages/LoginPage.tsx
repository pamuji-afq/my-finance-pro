import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [pwd, setPwd] = useState('');
  const login = useAuthStore(s => s.login);
  const nav = useNavigate();
  const submit = async (e) => { e.preventDefault(); if (await login(email, pwd)) nav('/dashboard'); };
  return <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4"><div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md"><h1 className="text-3xl font-bold text-center text-blue-600 mb-6">My Finance Pro</h1><form onSubmit={submit}><input type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} className="w-full p-3 border rounded-lg mb-3" /><input type="password" placeholder="Password" value={pwd} onChange={e=>setPwd(e.target.value)} className="w-full p-3 border rounded-lg mb-4" /><button type="submit" className="w-full bg-blue-600 text-white p-3 rounded-lg">Login</button></form><p className="text-center text-gray-500 mt-4">Demo: email & password apa saja</p></div></div>;
};