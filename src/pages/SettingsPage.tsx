import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { useTheme } from '../App';
export const SettingsPage = () => {
  const { user, logout } = useAuthStore();
  const { toggleTheme } = useTheme();
  const navigate = useNavigate();
  const handleLogout = () => { logout(); navigate('/login'); };
  return (<><h1 className="text-title-large mb-4">Settings</h1><div className="card mb-2"><div className="flex-between"><span className="text-body">Email</span><span className="text-label">{user?.email}</span></div></div><div className="card mb-2"><div className="flex-between"><span className="text-body">Dark Mode</span><button onClick={toggleTheme} className="btn-primary" style={{ width: 'auto', padding: '8px 16px' }}>Toggle</button></div></div><div className="card"><button onClick={handleLogout} className="btn-primary" style={{ background: 'var(--md-error)' }}>Logout</button></div></>);
};
