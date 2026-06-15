import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../stores/authStore';
import { useNavigate } from 'react-router-dom';
import { useNotification } from '../components/Notification';

export const SettingsPage = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark');
    setDark(isDark);
  }, []);

  const toggleDark = () => {
    setDark(!dark);
    if (!dark) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
    showNotification(`Dark mode ${!dark ? 'activated' : 'deactivated'}`, 'success');
  };

  const handleLogout = () => {
    logout();
    showNotification('Logged out successfully', 'success');
    navigate('/login');
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6" style={{color: 'var(--on-surface)'}}>Settings</h1>
      <div className="card divide-y" style={{overflow: 'hidden'}}>
        <div className="p-4"><h2 className="font-semibold mb-3" style={{color: 'var(--on-surface)'}}>Profile</h2><p><span className="text-on-surface-variant">Email:</span> {user?.email}</p></div>
        <div className="p-4 flex justify-between items-center"><span className="font-semibold" style={{color: 'var(--on-surface)'}}>Dark Mode</span><button onClick={toggleDark} className={`w-12 h-6 rounded-full transition ${dark ? 'bg-primary' : 'bg-outline'}`}><div className={`w-5 h-5 rounded-full bg-surface transition-transform ${dark ? 'translate-x-6' : 'translate-x-0.5'}`}></div></button></div>
        <div className="p-4"><button onClick={handleLogout} className="w-full py-2 rounded-md transition" style={{background: 'var(--error-container)', color: 'var(--error)'}}>Logout</button></div>
        <div className="p-4 text-center text-sm" style={{color: 'var(--on-surface-variant)'}}><p>My Finance Pro v1.0.0</p></div>
      </div>
    </div>
  );
};