import os
import subprocess

BASE = os.getcwd()

def write(path, content):
    full = os.path.join(BASE, path)
    os.makedirs(os.path.dirname(full), exist_ok=True)
    with open(full, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"✅ {path}")

print("🚀 MENERAPKAN MATERIAL DESIGN 3 LENGKAP...")

# ========== 1. UPDATE index.html dengan Tabler Icons ==========
write("index.html", '''<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>My Finance Pro</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/dist/tabler-icons.min.css" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>''')

# ========== 2. UPDATE index.css dengan M3 lengkap ==========
write("src/index.css", '''@import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700;9..40,800&display=swap');
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --md-sys-color-primary: #0B57D0;
  --md-sys-color-on-primary: #FFFFFF;
  --md-sys-color-primary-container: #D3E3FD;
  --md-sys-color-on-primary-container: #001D35;
  --md-sys-color-secondary: #006A6A;
  --md-sys-color-on-secondary: #FFFFFF;
  --md-sys-color-secondary-container: #9CF1F1;
  --md-sys-color-on-secondary-container: #002020;
  --md-sys-color-error: #C62828;
  --md-sys-color-on-error: #FFFFFF;
  --md-sys-color-error-container: #FFEBEE;
  --md-sys-color-on-error-container: #410002;
  --md-sys-color-surface: #F4FBFA;
  --md-sys-color-on-surface: #161D1D;
  --md-sys-color-surface-container: #E8F2F1;
  --md-sys-color-surface-container-high: #E2ECEB;
  --md-sys-color-outline: #6F7979;
  --md-sys-color-outline-variant: #BEC9C8;
  --md-sys-color-success: #1B5E20;
  --md-sys-color-success-container: #E8F5E9;
  --md-shape-corner-small: 8px;
  --md-shape-corner-medium: 12px;
  --md-shape-corner-large: 16px;
  --md-shape-corner-extra-large: 28px;
  --md-shape-corner-full: 9999px;
  --md-elevation-level1: 0 1px 2px 0 rgba(0,0,0,0.05), 0 1px 3px 1px rgba(0,0,0,0.05);
  --md-elevation-level2: 0 1px 2px 0 rgba(0,0,0,0.08), 0 2px 6px 2px rgba(0,0,0,0.05);
}
.dark {
  --md-sys-color-primary: #A8C7FA;
  --md-sys-color-on-primary: #002E6E;
  --md-sys-color-primary-container: #0B57D044;
  --md-sys-color-secondary: #80D4D4;
  --md-sys-color-on-secondary: #003737;
  --md-sys-color-secondary-container: #004F4F;
  --md-sys-color-error: #F2B8B5;
  --md-sys-color-on-error: #8C1D18;
  --md-sys-color-error-container: #8C1D18;
  --md-sys-color-surface: #0E1515;
  --md-sys-color-on-surface: #DCE7E6;
  --md-sys-color-surface-container: #1A2121;
  --md-sys-color-surface-container-high: #242B2B;
  --md-sys-color-outline: #8E9099;
  --md-sys-color-outline-variant: #44474E;
  --md-sys-color-success: #A5D6A7;
  --md-sys-color-success-container: #1B5E2044;
}
* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: 'DM Sans', sans-serif; background-color: var(--md-sys-color-surface); color: var(--md-sys-color-on-surface); transition: all 0.3s; }
.m3-card { background-color: var(--md-sys-color-surface-container); border-radius: var(--md-shape-corner-large); padding: 16px; box-shadow: var(--md-elevation-level1); }
.m3-card-elevated { background-color: var(--md-sys-color-surface); border-radius: var(--md-shape-corner-large); padding: 20px; box-shadow: var(--md-elevation-level2); }
.m3-button { display: inline-flex; align-items: center; justify-content: center; gap: 8px; padding: 10px 24px; border-radius: var(--md-shape-corner-full); font-weight: 500; cursor: pointer; border: none; transition: all 0.2s; }
.m3-button-filled { background-color: var(--md-sys-color-primary); color: var(--md-sys-color-on-primary); }
.m3-button-outlined { background-color: transparent; color: var(--md-sys-color-primary); border: 1px solid var(--md-sys-color-outline); }
.m3-text-field { display: flex; flex-direction: column; gap: 4px; }
.m3-text-field input { background-color: var(--md-sys-color-surface-container); border: 1px solid var(--md-sys-color-outline); border-radius: var(--md-shape-corner-small); padding: 12px 16px; font-family: 'DM Sans', sans-serif; font-size: 16px; color: var(--md-sys-color-on-surface); }
.m3-text-field input:focus { outline: none; border-color: var(--md-sys-color-primary); }
.m3-text-field label { font-size: 12px; font-weight: 500; color: var(--md-sys-color-on-surface-variant); }
.m3-nav-rail { position: fixed; left: 0; top: 0; bottom: 0; width: 80px; background-color: var(--md-sys-color-surface); border-right: 1px solid var(--md-sys-color-outline-variant); display: flex; flex-direction: column; align-items: center; padding: 16px 0; z-index: 40; }
.m3-nav-rail-item { display: flex; flex-direction: column; align-items: center; gap: 4px; padding: 12px 0; width: 100%; cursor: pointer; color: var(--md-sys-color-on-surface-variant); }
.m3-nav-rail-item-active { color: var(--md-sys-color-primary); }
.m3-bottom-nav { position: fixed; bottom: 0; left: 0; right: 0; background-color: var(--md-sys-color-surface); border-top: 1px solid var(--md-sys-color-outline-variant); display: flex; justify-content: space-around; padding: 8px 0 16px; z-index: 40; }
.m3-bottom-nav-item { display: flex; flex-direction: column; align-items: center; gap: 4px; padding: 4px 12px; cursor: pointer; color: var(--md-sys-color-on-surface-variant); font-size: 12px; }
.m3-bottom-nav-item-active { color: var(--md-sys-color-primary); }
.m3-main-content { max-width: 1200px; margin: 0 auto; padding: 80px 24px 80px 24px; }
.m3-icon-button { width: 40px; height: 40px; border-radius: var(--md-shape-corner-full); display: flex; align-items: center; justify-content: center; cursor: pointer; background: transparent; border: none; color: var(--md-sys-color-on-surface-variant); font-size: 20px; }
.m3-fab { position: fixed; bottom: 80px; right: 16px; width: 56px; height: 56px; border-radius: var(--md-shape-corner-large); background-color: var(--md-sys-color-primary); color: var(--md-sys-color-on-primary); display: flex; align-items: center; justify-content: center; cursor: pointer; border: none; box-shadow: var(--md-elevation-level2); z-index: 30; }
.m3-fab i { font-size: 24px; }
.m3-dialog-overlay { position: fixed; inset: 0; background-color: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 100; }
.m3-dialog { background-color: var(--md-sys-color-surface-container); border-radius: var(--md-shape-corner-extra-large); padding: 24px; max-width: 280px; width: 100%; }
.m3-dialog-title { font-size: 18px; font-weight: 500; margin-bottom: 8px; }
.m3-dialog-content { font-size: 14px; color: var(--md-sys-color-on-surface-variant); margin-bottom: 24px; }
.m3-dialog-actions { display: flex; justify-content: flex-end; gap: 8px; }
.m3-grid { display: grid; gap: 16px; }
.m3-grid-cols-1 { grid-template-columns: 1fr; }
.m3-grid-cols-2 { grid-template-columns: repeat(2, 1fr); }
.m3-grid-cols-4 { grid-template-columns: repeat(4, 1fr); }
.m3-divider { height: 1px; background-color: var(--md-sys-color-outline-variant); margin: 16px 0; }
.m3-title-medium { font-size: 16px; font-weight: 500; }
.m3-title-small { font-size: 14px; font-weight: 500; }
.m3-headline-medium { font-size: 28px; font-weight: 400; }
.m3-label-small { font-size: 11px; font-weight: 500; }
.m3-body-medium { font-size: 14px; font-weight: 400; }
@media (max-width: 768px) { .m3-grid-cols-2, .m3-grid-cols-4 { grid-template-columns: 1fr; } .m3-main-content { padding: 72px 16px 80px 16px; } }
@media (min-width: 769px) { .m3-main-content { padding: 80px 24px 80px 104px; } }''')

# ========== 3. UPDATE THEMEPROVIDER ==========
write("src/theme/ThemeProvider.tsx", '''import React, { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType { theme: Theme; toggleTheme: () => void; }

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>('light');
  useEffect(() => {
    const saved = localStorage.getItem('theme') as Theme | null;
    if (saved === 'dark' || saved === 'light') setTheme(saved);
    else if (window.matchMedia('(prefers-color-scheme: dark)').matches) setTheme('dark');
  }, []);
  useEffect(() => {
    if (theme === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
    localStorage.setItem('theme', theme);
  }, [theme]);
  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');
  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => { const ctx = useContext(ThemeContext); if (!ctx) throw new Error('useTheme must be inside ThemeProvider'); return ctx; };''')

# ========== 4. UPDATE LOGIN PAGE ==========
write("src/pages/LoginPage.tsx", '''import React, { useState } from 'react';
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
};''')

# ========== 5. UPDATE DASHBOARD PAGE ==========
write("src/pages/DashboardPage.tsx", '''import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useWalletStore } from '../stores/walletStore';
import { useTransactionStore } from '../stores/transactionStore';
import { useBudgetStore } from '../stores/budgetStore';
import { useGoalStore } from '../stores/goalStore';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useTheme } from '../theme/ThemeProvider';

export const DashboardPage = () => {
  const { wallets, activeWalletId, setActiveWallet } = useWalletStore();
  const { transactions } = useTransactionStore();
  const { budgets } = useBudgetStore();
  const { goals } = useGoalStore();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const total = wallets.reduce((s,w)=>s+w.balance,0);
  const currentMonth = new Date().toISOString().slice(0,7);
  const monthlyTx = transactions.filter(t => t.date.startsWith(currentMonth));
  const income = monthlyTx.filter(t=>t.type==='income').reduce((s,t)=>s+t.amount,0);
  const expense = monthlyTx.filter(t=>t.type==='expense').reduce((s,t)=>s+t.amount,0);
  const savingRate = income > 0 ? ((income - expense) / income * 100).toFixed(0) : 0;
  const totalBudget = budgets.reduce((s,b)=>s+b.amount,0);
  const totalSpent = budgets.reduce((s,b)=>s+b.spent,0);
  const budgetPct = totalBudget > 0 ? (totalSpent/totalBudget*100).toFixed(0) : 0;
  const totalGoal = goals.reduce((s,g)=>s+g.target,0);
  const totalCurrent = goals.reduce((s,g)=>s+g.current,0);
  const goalPct = totalGoal > 0 ? (totalCurrent/totalGoal*100).toFixed(0) : 0;
  const chartData = [['Jan',4500],['Feb',5200],['Mar',4800],['Apr',6100],['May',5800],['Jun',6300]].map(([n,v])=>({name:n,value:v}));
  const navItems = [{ path: '/dashboard', label: 'Dashboard', icon: '🏠' },{ path: '/wallets', label: 'Wallets', icon: '👛' },{ path: '/transactions', label: 'Transactions', icon: '💰' },{ path: '/budgets', label: 'Budgets', icon: '📊' },{ path: '/goals', label: 'Goals', icon: '🎯' },{ path: '/reports', label: 'Reports', icon: '📈' },{ path: '/ai-advisor', label: 'AI', icon: '🤖' },{ path: '/settings', label: 'Settings', icon: '⚙️' }];
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  useEffect(() => { const handleResize = () => setIsMobile(window.innerWidth <= 768); window.addEventListener('resize', handleResize); return () => window.removeEventListener('resize', handleResize); }, []);
  const NavRail = () => (<div className="m3-nav-rail" style={{ display: isMobile ? 'none' : 'flex' }}><div style={{ marginBottom: 24 }}><div className="m3-nav-rail-item" onClick={toggleTheme}><span style={{ fontSize: 24 }}>{theme === 'dark' ? '☀️' : '🌙'}</span><span className="m3-label-small">Theme</span></div></div><div style={{ flex: 1 }}>{navItems.map(item => (<div key={item.path} className={`m3-nav-rail-item ${window.location.pathname === item.path ? 'm3-nav-rail-item-active' : ''}`} onClick={() => navigate(item.path)}><span style={{ fontSize: 24 }}>{item.icon}</span><span className="m3-label-small">{item.label}</span></div>))}</div></div>);
  const BottomNav = () => (<div className="m3-bottom-nav" style={{ display: isMobile ? 'flex' : 'none' }}>{navItems.slice(0,4).map(item => (<div key={item.path} className={`m3-bottom-nav-item ${window.location.pathname === item.path ? 'm3-bottom-nav-item-active' : ''}`} onClick={() => navigate(item.path)}><i className={`ti ti-${item.label === 'Dashboard' ? 'layout-dashboard' : item.label === 'Wallets' ? 'wallet' : item.label === 'Transactions' ? 'receipt' : 'chart-pie'}`} style={{ fontSize: 24 }}></i><span className="m3-label-small">{item.label}</span></div>))}<div className="m3-bottom-nav-item" onClick={toggleTheme}><i className={`ti ${theme === 'dark' ? 'ti-sun' : 'ti-moon'}`} style={{ fontSize: 24 }}></i><span className="m3-label-small">Theme</span></div></div>);
  return (<><NavRail /><BottomNav /><div className="m3-main-content"><div className="m3-grid m3-grid-cols-4" style={{ marginBottom: 24 }}><div className="m3-card-elevated" style={{ background: 'var(--md-sys-color-primary-container)', color: 'var(--md-sys-color-on-primary-container)' }}><span className="m3-title-small">Total Balance</span><div className="m3-headline-medium">Rp {total.toLocaleString()}</div><span className="m3-label-small">{wallets.length} wallets</span></div><div className="m3-card-elevated" style={{ background: 'var(--md-sys-color-success-container)', color: 'var(--md-sys-color-success)' }}><span className="m3-title-small">Income</span><div className="m3-headline-medium">+Rp {income.toLocaleString()}</div><span className="m3-label-small">This month</span></div><div className="m3-card-elevated" style={{ background: 'var(--md-sys-color-error-container)', color: 'var(--md-sys-color-error)' }}><span className="m3-title-small">Expense</span><div className="m3-headline-medium">-Rp {expense.toLocaleString()}</div><span className="m3-label-small">This month</span></div><div className="m3-card-elevated" style={{ background: 'var(--md-sys-color-secondary-container)', color: 'var(--md-sys-color-secondary)' }}><span className="m3-title-small">Saving Rate</span><div className="m3-headline-medium">{savingRate}%</div><span className="m3-label-small">of income</span></div></div><div className="m3-grid m3-grid-cols-2" style={{ marginBottom: 24 }}><div className="m3-card"><div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}><span className="m3-title-medium">Budget Progress</span><Link to="/budgets" className="m3-label-medium" style={{ color: 'var(--md-sys-color-primary)' }}>Manage</Link></div><div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}><span>Total: Rp {totalBudget.toLocaleString()}</span><span>Spent: Rp {totalSpent.toLocaleString()}</span></div><div className="m3-divider" /><div style={{ marginTop: 12 }}><div className="m3-label-medium">{budgetPct}% used</div><div style={{ height: 8, background: 'var(--md-sys-color-surface-container)', borderRadius: 'var(--md-shape-corner-full)', marginTop: 8 }}><div style={{ width: `${budgetPct}%`, height: '100%', background: 'var(--md-sys-color-primary)', borderRadius: 'var(--md-shape-corner-full)' }} /></div></div></div><div className="m3-card"><div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}><span className="m3-title-medium">Goals Progress</span><Link to="/goals" className="m3-label-medium" style={{ color: 'var(--md-sys-color-primary)' }}>View All</Link></div><div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}><span>Target: Rp {totalGoal.toLocaleString()}</span><span>Saved: Rp {totalCurrent.toLocaleString()}</span></div><div className="m3-divider" /><div style={{ marginTop: 12 }}><div className="m3-label-medium">{goalPct}% achieved</div><div style={{ height: 8, background: 'var(--md-sys-color-surface-container)', borderRadius: 'var(--md-shape-corner-full)', marginTop: 8 }}><div style={{ width: `${goalPct}%`, height: '100%', background: 'var(--md-sys-color-success)', borderRadius: 'var(--md-shape-corner-full)' }} /></div></div></div></div><div className="m3-card" style={{ marginBottom: 24 }}><span className="m3-title-medium" style={{ marginBottom: 16, display: 'block' }}>Cashflow Trend</span><ResponsiveContainer width="100%" height={280}><LineChart data={chartData}><CartesianGrid strokeDasharray="3 3" stroke="var(--md-sys-color-outline-variant)" /><XAxis dataKey="name" stroke="var(--md-sys-color-on-surface-variant)" /><YAxis stroke="var(--md-sys-color-on-surface-variant)" /><Tooltip contentStyle={{ background: 'var(--md-sys-color-surface-container)', border: 'none', borderRadius: 'var(--md-shape-corner-medium)' }} /><Line type="monotone" dataKey="value" stroke="var(--md-sys-color-primary)" strokeWidth={2} /></LineChart></ResponsiveContainer></div><div className="m3-grid m3-grid-cols-4">{wallets.map(w => (<div key={w.id} className={`m3-card ${activeWalletId === w.id ? 'm3-card-elevated' : ''}`} onClick={() => setActiveWallet(w.id)} style={{ cursor: 'pointer' }}><span className="m3-title-small">{w.name}</span><div className="m3-title-medium" style={{ color: 'var(--md-sys-color-primary)' }}>Rp {w.balance.toLocaleString()}</div></div>))}</div></div></>);
};''')

# ========== 6. GIT COMMIT & PUSH ==========
print("\n📤 Push ke GitHub...")
subprocess.run(["git", "add", "."], capture_output=True)
subprocess.run(["git", "commit", "-m", "feat: full Material Design 3 with Tabler icons, responsive layout, dark mode, proper navigation"], capture_output=True)
subprocess.run(["git", "push", "origin", "main"], capture_output=True)

print("\n" + "="*60)
print("🎉 MATERIAL DESIGN 3 LENGKAP TELAH DITERAPKAN!")
print("="*60)
print("✅ Tabler Icons terintegrasi")
print("✅ Dark mode toggle di navigation rail & bottom nav")
print("✅ Responsive layout: Desktop, Tablet, Mobile")
print("✅ M3 Cards, Buttons, Text Fields, Dialogs")
print("✅ Bottom Navigation (mobile) + Navigation Rail (tablet/desktop)")
print("\n🚀 Vercel auto-deploy dalam 2-3 menit")
print("="*60)
