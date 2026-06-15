import React from 'react';
import { useWalletStore } from '../stores/walletStore';
import { useTransactionStore } from '../stores/transactionStore';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const DashboardPage = () => {
  const { wallets } = useWalletStore();
  const { transactions } = useTransactionStore();
  const total = wallets.reduce((s,w)=>s+w.balance,0);
  const monthlyTx = transactions.filter(t => t.date.startsWith('2026-06'));
  const income = monthlyTx.filter(t=>t.type==='income').reduce((s,t)=>s+t.amount,0);
  const expense = monthlyTx.filter(t=>t.type==='expense').reduce((s,t)=>s+t.amount,0);
  const savingRate = income > 0 ? ((income - expense) / income * 100).toFixed(0) : 0;
  const chartData = [['Jan',4500],['Feb',5200],['Mar',4800],['Apr',6100],['May',5800],['Jun',6300]].map(([n,v])=>({name:n,value:v}));

  return (
    <>
      {/* Hero Card */}
      <div className="hero-card">
        <div className="text-label" style={{ opacity: 0.8 }}>Total Balance</div>
        <div className="text-headline">Rp {total.toLocaleString()}</div>
        <div className="text-label" style={{ opacity: 0.7, marginTop: 4 }}>{wallets.length} wallets</div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="text-label">Income</div>
          <div className="text-headline text-success">+Rp {income.toLocaleString()}</div>
          <div className="text-label">This month</div>
        </div>
        <div className="stat-card">
          <div className="text-label">Expense</div>
          <div className="text-headline text-error">-Rp {expense.toLocaleString()}</div>
          <div className="text-label">This month</div>
        </div>
        <div className="stat-card">
          <div className="text-label">Saving Rate</div>
          <div className="text-headline text-primary">{savingRate}%</div>
          <div className="text-label">of income</div>
        </div>
        <div className="stat-card">
          <div className="text-label">Transactions</div>
          <div className="text-headline text-primary">{transactions.length}</div>
          <div className="text-label">Total records</div>
        </div>
      </div>

      {/* Cashflow Chart */}
      <div className="card">
        <h2 className="text-title-medium mb-3">Cashflow Trend</h2>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={chartData}>
            <CartesianGrid stroke="var(--md-outline-variant)" strokeDasharray="3 3" />
            <XAxis dataKey="name" stroke="var(--md-outline)" fontSize={11} />
            <YAxis stroke="var(--md-outline)" fontSize={11} />
            <Tooltip 
              contentStyle={{ 
                background: 'var(--md-surface-container)', 
                border: 'none', 
                borderRadius: 12,
                boxShadow: 'var(--md-elevation-2)'
              }} 
            />
            <Line type="monotone" dataKey="value" stroke="var(--md-primary)" strokeWidth={2} dot={{ fill: 'var(--md-primary)' }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Recent Transactions */}
      <div className="card">
        <h2 className="text-title-medium mb-3">Recent Transactions</h2>
        {transactions.slice(0, 3).map(tx => (
          <div key={tx.id} className="flex-between py-2" style={{ borderBottom: '1px solid var(--md-outline-variant)' }}>
            <div>
              <div className="text-body" style={{ fontWeight: 500 }}>{tx.desc}</div>
              <div className="text-label">{tx.category} • {tx.date}</div>
            </div>
            <div className={`text-title-medium ${tx.type === 'income' ? 'text-success' : 'text-error'}`}>
              {tx.type === 'income' ? '+' : '-'}Rp {tx.amount.toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};
