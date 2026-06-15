import React, { useState, useEffect } from 'react';
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
