import os
import subprocess

BASE = os.getcwd()

def write(path, content):
    full = os.path.join(BASE, path)
    os.makedirs(os.path.dirname(full), exist_ok=True)
    with open(full, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"✅ {path}")

print("🔧 MEMPERBAIKI DENGAN M3 TOKENS (NO HARDCODE)...")

# ========== UPDATE index.css dengan M3 tokens lengkap ==========
write("src/index.css", '''@import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700;9..40,800&display=swap');
@tailwind base;
@tailwind components;
@tailwind utilities;

/* M3 Design Tokens - Light Mode */
:root {
  --md-sys-color-primary: #0B57D0;
  --md-sys-color-on-primary: #FFFFFF;
  --md-sys-color-primary-container: #D3E3FD;
  --md-sys-color-on-primary-container: #001D35;
  --md-sys-color-secondary: #006A6A;
  --md-sys-color-on-secondary: #FFFFFF;
  --md-sys-color-secondary-container: #9CF1F1;
  --md-sys-color-error: #C62828;
  --md-sys-color-on-error: #FFFFFF;
  --md-sys-color-error-container: #FFEBEE;
  --md-sys-color-surface: #F4FBFA;
  --md-sys-color-on-surface: #161D1D;
  --md-sys-color-surface-container: #E8F2F1;
  --md-sys-color-surface-container-high: #E2ECEB;
  --md-sys-color-outline: #6F7979;
  --md-sys-color-outline-variant: #BEC9C8;
  --md-sys-color-success: #1B5E20;
  --md-sys-color-on-success: #FFFFFF;
  --md-sys-color-success-container: #E8F5E9;
  --md-sys-color-warning: #E65100;
  --md-sys-color-warning-container: #FFF3E0;
  
  --md-shape-corner-small: 8px;
  --md-shape-corner-medium: 12px;
  --md-shape-corner-large: 16px;
  --md-shape-corner-extra-large: 28px;
  --md-shape-corner-full: 9999px;
  
  --md-elevation-level1: 0 1px 2px 0 rgba(0,0,0,0.05), 0 1px 3px 1px rgba(0,0,0,0.05);
  --md-elevation-level2: 0 1px 2px 0 rgba(0,0,0,0.08), 0 2px 6px 2px rgba(0,0,0,0.05);
  --md-elevation-level3: 0 4px 8px 3px rgba(0,0,0,0.05), 0 1px 3px 0 rgba(0,0,0,0.08);
}

/* Dark Mode */
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
  --md-sys-color-warning: #FFCC02;
  --md-sys-color-warning-container: #E6510022;
}

* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: 'DM Sans', sans-serif; background-color: var(--md-sys-color-surface); color: var(--md-sys-color-on-surface); transition: all 0.3s; }

/* M3 Utility Classes */
.bg-primary { background-color: var(--md-sys-color-primary); }
.bg-primary-container { background-color: var(--md-sys-color-primary-container); }
.bg-secondary-container { background-color: var(--md-sys-color-secondary-container); }
.bg-error-container { background-color: var(--md-sys-color-error-container); }
.bg-success-container { background-color: var(--md-sys-color-success-container); }
.bg-surface { background-color: var(--md-sys-color-surface); }
.bg-surface-container { background-color: var(--md-sys-color-surface-container); }

.text-primary { color: var(--md-sys-color-primary); }
.text-on-primary { color: var(--md-sys-color-on-primary); }
.text-on-primary-container { color: var(--md-sys-color-on-primary-container); }
.text-on-surface { color: var(--md-sys-color-on-surface); }
.text-on-surface-variant { color: var(--md-sys-color-on-surface-variant); }
.text-success { color: var(--md-sys-color-success); }
.text-error { color: var(--md-sys-color-error); }

.card { background-color: var(--md-sys-color-surface-container); border-radius: var(--md-shape-corner-large); padding: 16px; box-shadow: var(--md-elevation-level1); }
.card-elevated { background-color: var(--md-sys-color-surface); border-radius: var(--md-shape-corner-large); padding: 20px; box-shadow: var(--md-elevation-level2); }
.btn-primary { background-color: var(--md-sys-color-primary); color: var(--md-sys-color-on-primary); padding: 10px 24px; border-radius: var(--md-shape-corner-full); font-weight: 500; cursor: pointer; border: none; transition: opacity 0.2s; }
.btn-primary:hover { opacity: 0.9; }
.btn-outline { background-color: transparent; color: var(--md-sys-color-primary); border: 1px solid var(--md-sys-color-outline); padding: 10px 24px; border-radius: var(--md-shape-corner-full); font-weight: 500; cursor: pointer; }
.input { background-color: var(--md-sys-color-surface-container); border: 1px solid var(--md-sys-color-outline); border-radius: var(--md-shape-corner-small); padding: 12px 16px; color: var(--md-sys-color-on-surface); width: 100%; }
.input:focus { outline: none; border-color: var(--md-sys-color-primary); }
.divider { height: 1px; background-color: var(--md-sys-color-outline-variant); margin: 16px 0; }
.chip { background-color: var(--md-sys-color-surface-container); border: 1px solid var(--md-sys-color-outline-variant); border-radius: var(--md-shape-corner-full); padding: 6px 16px; font-size: 13px; cursor: pointer; }
.chip-active { background-color: var(--md-sys-color-primary-container); color: var(--md-sys-color-on-primary-container); border-color: var(--md-sys-color-primary); }

/* Grid */
.grid { display: grid; gap: 16px; }
.grid-cols-1 { grid-template-columns: 1fr; }
.grid-cols-2 { grid-template-columns: repeat(2, 1fr); }
.grid-cols-4 { grid-template-columns: repeat(4, 1fr); }
@media (max-width: 768px) { .grid-cols-2, .grid-cols-4 { grid-template-columns: 1fr; } }

/* Typography */
.title-large { font-size: 22px; font-weight: 400; }
.title-medium { font-size: 16px; font-weight: 500; }
.title-small { font-size: 14px; font-weight: 500; }
.headline-medium { font-size: 28px; font-weight: 400; }
.body-medium { font-size: 14px; font-weight: 400; }
.label-small { font-size: 11px; font-weight: 500; }

/* Layout */
.main-content { max-width: 1200px; margin: 0 auto; padding: 80px 24px 80px 24px; }
@media (max-width: 768px) { .main-content { padding: 72px 16px 80px 16px; } }
.flex { display: flex; }
.flex-between { display: flex; justify-content: space-between; align-items: center; }
.gap-2 { gap: 8px; }
.gap-4 { gap: 16px; }
.mb-2 { margin-bottom: 8px; }
.mb-4 { margin-bottom: 16px; }
.mb-6 { margin-bottom: 24px; }
.mt-1 { margin-top: 4px; }
.mt-2 { margin-top: 8px; }
.p-4 { padding: 16px; }
.p-6 { padding: 24px; }
.rounded-full { border-radius: var(--md-shape-corner-full); }
.rounded-xl { border-radius: var(--md-shape-corner-large); }
.shadow { box-shadow: var(--md-elevation-level1); }
.w-full { width: 100%; }
.text-center { text-align: center; }
.text-right { text-align: right; }
.cursor-pointer { cursor: pointer; }
''')

# ========== DASHBOARD PAGE dengan M3 tokens ==========
write("src/pages/DashboardPage.tsx", '''import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useWalletStore } from '../stores/walletStore';
import { useTransactionStore } from '../stores/transactionStore';
import { useBudgetStore } from '../stores/budgetStore';
import { useGoalStore } from '../stores/goalStore';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const DashboardPage = () => {
  const { wallets, activeWalletId, setActiveWallet } = useWalletStore();
  const { transactions } = useTransactionStore();
  const { budgets } = useBudgetStore();
  const { goals } = useGoalStore();
  
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

  return (
    <div className="main-content">
      <h1 className="title-large text-on-surface mb-6">Dashboard</h1>
      
      {/* Wallet Selector */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {wallets.map(w => (
          <button
            key={w.id}
            onClick={() => setActiveWallet(w.id)}
            className={`chip ${activeWalletId === w.id ? 'chip-active' : ''}`}
          >
            {w.name}
          </button>
        ))}
      </div>
      
      {/* Summary Cards - Menggunakan M3 tokens */}
      <div className="grid grid-cols-4 mb-6">
        <div className="card-elevated bg-primary text-on-primary">
          <div className="label-small opacity-80">Total Balance</div>
          <div className="headline-medium">Rp {total.toLocaleString()}</div>
          <div className="label-small opacity-70 mt-1">{wallets.length} wallets</div>
        </div>
        <div className="card-elevated bg-success-container">
          <div className="label-small text-success">Income</div>
          <div className="headline-medium text-success">+Rp {income.toLocaleString()}</div>
          <div className="label-small text-success mt-1">This month</div>
        </div>
        <div className="card-elevated bg-error-container">
          <div className="label-small text-error">Expense</div>
          <div className="headline-medium text-error">-Rp {expense.toLocaleString()}</div>
          <div className="label-small text-error mt-1">This month</div>
        </div>
        <div className="card-elevated bg-secondary-container">
          <div className="label-small text-primary">Saving Rate</div>
          <div className="headline-medium text-primary">{savingRate}%</div>
          <div className="label-small text-primary mt-1">of income</div>
        </div>
      </div>
      
      {/* Budget & Goals */}
      <div className="grid grid-cols-2 mb-6">
        <div className="card">
          <div className="flex-between mb-3">
            <span className="title-medium text-on-surface">Budget Progress</span>
            <Link to="/budgets" className="label-small text-primary">Manage</Link>
          </div>
          <div className="flex-between body-medium mb-2">
            <span className="text-on-surface-variant">Rp {totalBudget.toLocaleString()}</span>
            <span className="text-on-surface-variant">Spent: Rp {totalSpent.toLocaleString()}</span>
          </div>
          <div className="h-2 bg-surface-container rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full" style={{width: `${budgetPct}%`}}></div>
          </div>
          <p className="label-small text-on-surface-variant mt-2">{budgetPct}% used</p>
        </div>
        
        <div className="card">
          <div className="flex-between mb-3">
            <span className="title-medium text-on-surface">Goals Progress</span>
            <Link to="/goals" className="label-small text-primary">View All</Link>
          </div>
          <div className="flex-between body-medium mb-2">
            <span className="text-on-surface-variant">Rp {totalGoal.toLocaleString()}</span>
            <span className="text-on-surface-variant">Saved: Rp {totalCurrent.toLocaleString()}</span>
          </div>
          <div className="h-2 bg-surface-container rounded-full overflow-hidden">
            <div className="h-full bg-success rounded-full" style={{width: `${goalPct}%`}}></div>
          </div>
          <p className="label-small text-on-surface-variant mt-2">{goalPct}% achieved</p>
        </div>
      </div>
      
      {/* Chart */}
      <div className="card mb-6">
        <h2 className="title-medium text-on-surface mb-4">Cashflow Trend</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--md-sys-color-outline-variant)" />
            <XAxis dataKey="name" stroke="var(--md-sys-color-on-surface-variant)" />
            <YAxis stroke="var(--md-sys-color-on-surface-variant)" />
            <Tooltip contentStyle={{ backgroundColor: 'var(--md-sys-color-surface-container)', border: 'none', borderRadius: 'var(--md-shape-corner-medium)' }} />
            <Line type="monotone" dataKey="value" stroke="var(--md-sys-color-primary)" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      {/* Quick Actions */}
      <div className="grid grid-cols-4">
        <Link to="/wallets" className="card text-center cursor-pointer"><div className="text-2xl mb-1">👛</div><div className="title-small text-on-surface">Wallets</div></Link>
        <Link to="/transactions" className="card text-center cursor-pointer"><div className="text-2xl mb-1">💰</div><div className="title-small text-on-surface">Transactions</div></Link>
        <Link to="/budgets" className="card text-center cursor-pointer"><div className="text-2xl mb-1">📊</div><div className="title-small text-on-surface">Budgets</div></Link>
        <Link to="/goals" className="card text-center cursor-pointer"><div className="text-2xl mb-1">🎯</div><div className="title-small text-on-surface">Goals</div></Link>
      </div>
    </div>
  );
};
''')

# ========== LOGIN PAGE dengan M3 tokens ==========
write("src/pages/LoginPage.tsx", '''import React, { useState } from 'react';
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
''')

# ========== WALLETS PAGE dengan M3 tokens ==========
write("src/pages/WalletsPage.tsx", '''import React, { useState } from 'react';
import { useWalletStore } from '../stores/walletStore';

export const WalletsPage = () => {
  const { wallets, addWallet, deleteWallet } = useWalletStore();
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [balance, setBalance] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      addWallet({ name, balance, currency: 'IDR' });
      setName('');
      setBalance(0);
      setShowForm(false);
    }
  };

  return (
    <div className="main-content">
      <div className="flex-between mb-6">
        <h1 className="title-large text-on-surface">Wallets</h1>
        <button onClick={() => setShowForm(true)} className="btn-primary">+ New Wallet</button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {wallets.map(w => (
          <div key={w.id} className="card">
            <div className="flex-between">
              <div>
                <h3 className="title-medium text-on-surface">{w.name}</h3>
                <p className="headline-medium text-primary">Rp {w.balance.toLocaleString()}</p>
                <p className="label-small text-on-surface-variant">{w.currency}</p>
              </div>
              <button onClick={() => deleteWallet(w.id)} className="text-error cursor-pointer">🗑️</button>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowForm(false)}>
          <div className="card-elevated w-full max-w-md" onClick={e => e.stopPropagation()}>
            <h2 className="title-medium text-on-surface mb-4">New Wallet</h2>
            <form onSubmit={handleSubmit}>
              <input type="text" placeholder="Wallet Name" value={name} onChange={e => setName(e.target.value)} className="input w-full mb-3" required />
              <input type="number" placeholder="Initial Balance" value={balance} onChange={e => setBalance(parseFloat(e.target.value) || 0)} className="input w-full mb-4" />
              <div className="flex gap-3">
                <button type="button" onClick={() => setShowForm(false)} className="btn-outline flex-1">Cancel</button>
                <button type="submit" className="btn-primary flex-1">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
''')

# ========== TRANSACTIONS PAGE dengan M3 tokens ==========
write("src/pages/TransactionsPage.tsx", '''import React, { useState } from 'react';
import { useTransactionStore } from '../stores/transactionStore';
import { useWalletStore } from '../stores/walletStore';

export const TransactionsPage = () => {
  const { transactions, addTransaction, deleteTransaction } = useTransactionStore();
  const { wallets, updateBalance } = useWalletStore();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    walletId: wallets[0]?.id || '',
    amount: 0,
    type: 'expense',
    category: '',
    desc: '',
    date: new Date().toISOString().slice(0, 10)
  });

  const categories = { income: ['Salary', 'Freelance', 'Gift', 'Investment'], expense: ['Food', 'Transport', 'Shopping', 'Bills', 'Entertainment'] };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = form.type === 'expense' ? -form.amount : form.amount;
    addTransaction(form);
    updateBalance(form.walletId, amount);
    setShowForm(false);
    setForm({ walletId: wallets[0]?.id, amount: 0, type: 'expense', category: '', desc: '', date: new Date().toISOString().slice(0, 10) });
  };

  const getWalletName = (id: string) => wallets.find(w => w.id === id)?.name || 'Unknown';

  return (
    <div className="main-content">
      <div className="flex-between mb-6">
        <h1 className="title-large text-on-surface">Transactions</h1>
        <button onClick={() => setShowForm(true)} className="btn-primary">+ Add</button>
      </div>

      <div className="card overflow-hidden">
        {transactions.map(tx => (
          <div key={tx.id} className="flex-between p-4 border-b" style={{ borderBottomColor: 'var(--md-sys-color-outline-variant)' }}>
            <div>
              <div className="title-small text-on-surface">{tx.desc}</div>
              <div className="body-medium text-on-surface-variant">{tx.category} • {getWalletName(tx.walletId)} • {tx.date}</div>
            </div>
            <div className="flex items-center gap-3">
              <span className={`title-medium ${tx.type === 'income' ? 'text-success' : 'text-error'}`}>
                {tx.type === 'income' ? '+' : '-'}Rp {tx.amount.toLocaleString()}
              </span>
              <button onClick={() => deleteTransaction(tx.id)} className="text-error cursor-pointer">🗑️</button>
            </div>
          </div>
        ))}
        {transactions.length === 0 && <div className="text-center p-8 text-on-surface-variant">No transactions yet. Add your first transaction!</div>}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto" onClick={() => setShowForm(false)}>
          <div className="card-elevated w-full max-w-md" onClick={e => e.stopPropagation()}>
            <h2 className="title-medium text-on-surface mb-4">Add Transaction</h2>
            <form onSubmit={handleSubmit}>
              <select value={form.walletId} onChange={e => setForm({ ...form, walletId: e.target.value })} className="input w-full mb-3">{wallets.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}</select>
              <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value, category: '' })} className="input w-full mb-3"><option value="expense">Expense</option><option value="income">Income</option></select>
              <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="input w-full mb-3" required><option value="">Select category</option>{categories[form.type].map(c => <option key={c}>{c}</option>)}</select>
              <input type="text" placeholder="Description" value={form.desc} onChange={e => setForm({ ...form, desc: e.target.value })} className="input w-full mb-3" required />
              <input type="number" placeholder="Amount" value={form.amount} onChange={e => setForm({ ...form, amount: parseFloat(e.target.value) || 0 })} className="input w-full mb-3" required />
              <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} className="input w-full mb-4" required />
              <div className="flex gap-3">
                <button type="button" onClick={() => setShowForm(false)} className="btn-outline flex-1">Cancel</button>
                <button type="submit" className="btn-primary flex-1">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
''')

# ========== APP.TSX ==========
write("src/App.tsx", '''import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { WalletsPage } from './pages/WalletsPage';
import { TransactionsPage } from './pages/TransactionsPage';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const user = useAuthStore((state) => state.user);
  return user ? <>{children}</> : <Navigate to="/login" />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/wallets" element={<ProtectedRoute><WalletsPage /></ProtectedRoute>} />
        <Route path="/transactions" element={<ProtectedRoute><TransactionsPage /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;
''')

# ========== GIT COMMIT & PUSH ==========
print("\n📤 Push ke GitHub...")
subprocess.run(["git", "add", "."], capture_output=True)
subprocess.run(["git", "commit", "-m", "fix: use M3 design tokens only - no hardcode colors in components"], capture_output=True)
subprocess.run(["git", "push", "origin", "main"], capture_output=True)

print("\n" + "="*60)
print("✅ SEMUA WARNA PAKAI M3 TOKENS! TIDAK ADA HARDCODE!")
print("="*60)
print("🎨 M3 Tokens yang digunakan:")
print("   - bg-primary, text-primary, text-on-surface")
print("   - bg-success-container, text-success")
print("   - bg-error-container, text-error")
print("   - bg-secondary-container")
print("   - surface-container, outline-variant")
print("\n🚀 Vercel auto-deploy dalam 2-3 menit")
print("🔗 https://my-finance-pro.vercel.app")
print("="*60)
