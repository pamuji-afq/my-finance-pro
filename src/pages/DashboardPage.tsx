import React from 'react';
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
    <>
      <div className="flex-between mb-4"><h1 className="text-title-large text-on-surface">Dashboard</h1><div className="flex gap-2">{wallets.map(w=><button key={w.id} onClick={()=>setActiveWallet(w.id)} className={`chip ${activeWalletId===w.id?'chip-active':''}`}>{w.name}</button>)}</div></div>
      <div className="grid-2 mb-4"><div className="card" style={{background: 'var(--md-primary)', color: 'var(--md-on-primary)'}}><div className="text-label opacity-80">Total Balance</div><div className="text-headline">Rp {total.toLocaleString()}</div><div className="text-label opacity-70">{wallets.length} wallets</div></div><div className="card" style={{background: 'var(--md-success-container)', color: 'var(--md-success)'}}><div className="text-label">Income</div><div className="text-headline">+Rp {income.toLocaleString()}</div><div className="text-label">This month</div></div><div className="card" style={{background: 'var(--md-error-container)', color: 'var(--md-error)'}}><div className="text-label">Expense</div><div className="text-headline">-Rp {expense.toLocaleString()}</div><div className="text-label">This month</div></div><div className="card" style={{background: 'var(--md-secondary-container)', color: 'var(--md-secondary)'}}><div className="text-label">Saving Rate</div><div className="text-headline">{savingRate}%</div><div className="text-label">of income</div></div></div>
      <div className="card mb-4"><div className="flex-between mb-2"><span className="text-title-medium">Budget Progress</span><Link to="/budgets" className="text-primary text-label">Manage</Link></div><div className="flex-between text-label mb-1"><span>Rp {totalBudget.toLocaleString()}</span><span>Spent: Rp {totalSpent.toLocaleString()}</span></div><div className="progress-bar"><div className="progress-fill progress-fill-primary" style={{width: `${budgetPct}%`}}></div></div><div className="text-label text-on-surface-variant mt-1">{budgetPct}% used</div></div>
      <div className="card mb-4"><div className="flex-between mb-2"><span className="text-title-medium">Goals Progress</span><Link to="/goals" className="text-primary text-label">View All</Link></div><div className="flex-between text-label mb-1"><span>Rp {totalGoal.toLocaleString()}</span><span>Saved: Rp {totalCurrent.toLocaleString()}</span></div><div className="progress-bar"><div className="progress-fill progress-fill-success" style={{width: `${goalPct}%`}}></div></div><div className="text-label text-on-surface-variant mt-1">{goalPct}% achieved</div></div>
      <div className="card mb-4"><h2 className="text-title-medium mb-3">Cashflow Trend</h2><ResponsiveContainer width="100%" height={200}><LineChart data={chartData}><CartesianGrid stroke="var(--md-outline-variant)" /><XAxis dataKey="name" stroke="var(--md-on-surface-variant)" /><YAxis stroke="var(--md-on-surface-variant)" /><Tooltip contentStyle={{background: 'var(--md-surface-container)', border: 'none'}} /><Line type="monotone" dataKey="value" stroke="var(--md-primary)" strokeWidth={2} /></LineChart></ResponsiveContainer></div>
      <div className="grid-2"><Link to="/wallets" className="card text-center"><i className="ti ti-wallet" style={{fontSize: 28}}></i><div className="text-label mt-1">Wallets</div></Link><Link to="/transactions" className="card text-center"><i className="ti ti-file-text" style={{fontSize: 28}}></i><div className="text-label mt-1">Transactions</div></Link><Link to="/budgets" className="card text-center"><i className="ti ti-chart-bar" style={{fontSize: 28}}></i><div className="text-label mt-1">Budgets</div></Link><Link to="/goals" className="card text-center"><i className="ti ti-target" style={{fontSize: 28}}></i><div className="text-label mt-1">Goals</div></Link></div>
    </>
  );
};