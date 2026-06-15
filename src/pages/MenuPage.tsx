import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../App';

export const MenuPage = () => {
  const { toggleTheme } = useTheme();
  const menuItems = [
    { path: '/budgets', icon: 'ti-chart-bar', label: 'Budget', color: 'var(--md-primary)' },
    { path: '/goals', icon: 'ti-target', label: 'Goals', color: 'var(--md-success)' },
    { path: '/reports', icon: 'ti-report', label: 'Laporan', color: 'var(--md-secondary)' },
    { path: '/ai-advisor', icon: 'ti-robot', label: 'AI Advisor', color: 'var(--md-warning)' },
    { path: '/recurring', icon: 'ti-refresh', label: 'Recurring', color: 'var(--md-primary)' },
    { path: '/bills', icon: 'ti-receipt', label: 'Bills', color: 'var(--md-error)' },
    { path: '/networth', icon: 'ti-chart-pie', label: 'Net Worth', color: 'var(--md-success)' },
    { path: '/settings', icon: 'ti-settings', label: 'Settings', color: 'var(--md-outline)' },
  ];
  return (
    <>
      <h1 className="text-title-large text-on-surface mb-4">Menu</h1>
      <div className="flex-col">
        {menuItems.map(item => (
          <Link key={item.path} to={item.path} className="card flex-between" style={{ textDecoration: 'none' }}>
            <div className="flex gap-2"><i className={item.icon} style={{ fontSize: 24, color: item.color }}></i><span className="text-body text-on-surface">{item.label}</span></div>
            <i className="ti ti-chevron-right" style={{ color: 'var(--md-outline)' }}></i>
          </Link>
        ))}
        <button onClick={toggleTheme} className="card flex-between w-full" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
          <div className="flex gap-2"><i className="ti ti-moon" style={{ fontSize: 24 }}></i><span className="text-body text-on-surface">Dark Mode</span></div>
          <i className="ti ti-chevron-right" style={{ color: 'var(--md-outline)' }}></i>
        </button>
      </div>
    </>
  );
};
