import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../stores/authStore';
import { useNavigate } from 'react-router-dom';
export const SettingsPage = () => {
  const { user, logout } = useAuthStore();
  const nav = useNavigate();
  const [dark, setDark] = useState(false);
  useEffect(() => { const isDark = document.documentElement.classList.contains('dark'); setDark(isDark); }, []);
  const toggleDark = () => { setDark(!dark); if(!dark) document.documentElement.classList.add('dark'); else document.documentElement.classList.remove('dark'); };
  return <div className="p-6 max-w-4xl mx-auto"><h1 className="text-2xl font-bold mb-6">Settings</h1><div className="bg-white rounded-xl shadow divide-y"><div className="p-4"><h2 className="font-semibold mb-3">Profile</h2><p><span className="text-gray-500">Email:</span> {user?.email}</p></div><div className="p-4 flex justify-between items-center"><span className="font-semibold">Dark Mode</span><button onClick={toggleDark} className={`w-12 h-6 rounded-full transition ${dark?'bg-blue-600':'bg-gray-300'}`}><div className={`w-5 h-5 rounded-full bg-white transition-transform ${dark?'translate-x-6':'translate-x-0.5'}`}></div></button></div><div className="p-4"><button onClick={()=>{logout();nav('/login');}} className="w-full bg-red-600 text-white py-2 rounded-lg">Logout</button></div><div className="p-4 text-center text-gray-400 text-sm"><p>My Finance Pro v1.0.0</p></div></div></div>;
};