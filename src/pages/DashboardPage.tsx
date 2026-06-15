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
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6 flex-wrap gap-2">
        <h1 className="text-3xl font-bold" style={{color: 'var(--on-surface)'}}>Dashboard</h1>
        <div className="flex gap-2">
          {wallets.map(w => (
            <button
              key={w.id}
              onClick={() => setActiveWallet(w.id)}
              className={`px-3 py-1 rounded-full text-sm transition ${
                activeWalletId === w.id 
                  ? 'bg-primary text-on-primary' 
                  : 'bg-surface-container text-on-surface-variant'
              }`}
            >
              {w.name}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="rounded-xl p-4 text-white" style={{background: 'linear-gradient(135deg, var(--primary), #0842A0)'}}>
          <div className="text-sm opacity-80">Total Balance</div>
          <div className="text-2xl font-bold">Rp {total.toLocaleString()}</div>
          <div className="text-xs opacity-70 mt-1">{wallets.length} wallets</div>
        </div>
        <div className="rounded-xl p-4" style={{background: 'var(--success-container)', color: 'var(--success)'}}>
          <div className="text-sm opacity-80">Income</div>
          <div className="text-xl font-bold">+Rp {income.toLocaleString()}</div>
          <div className="text-xs opacity-70 mt-1">This month</div>
        </div>
        <div className="rounded-xl p-4" style={{background: 'var(--error-container)', color: 'var(--error)'}}>
          <div className="text-sm opacity-80">Expense</div>
          <div className="text-xl font-bold">-Rp {expense.toLocaleString()}</div>
          <div className="text-xs opacity-70 mt-1">This month</div>
        </div>
        <div className="rounded-xl p-4" style={{background: 'var(--primary-container)', color: 'var(--primary)'}}>
          <div className="text-sm opacity-80">Saving Rate</div>
          <div className="text-xl font-bold">{savingRate}%</div>
          <div className="text-xs opacity-70 mt-1">of income</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold" style={{color: 'var(--on-surface)'}}>Budget Progress</h2>
            <Link to="/budgets" className="text-sm" style={{color: 'var(--primary)'}}>Manage</Link>
          </div>
          <div className="mb-2 flex justify-between text-sm">
            <span>Total Budget: Rp {totalBudget.toLocaleString()}</span>
            <span>Spent: Rp {totalSpent.toLocaleString()}</span>
          </div>
          <div className="h-2 rounded-full overflow-hidden" style={{background: 'var(--surface-container-high)'}}>
            <div className="h-full rounded-full transition-all" style={{width: `${budgetPct}%`, background: 'var(--primary)'}}></div>
          </div>
          <p className="text-xs mt-2" style={{color: 'var(--on-surface-variant)'}}>{budgetPct}% used</p>
        </div>

        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold" style={{color: 'var(--on-surface)'}}>Goals Progress</h2>
            <Link to="/goals" className="text-sm" style={{color: 'var(--primary)'}}>View All</Link>
          </div>
          <div className="mb-2 flex justify-between text-sm">
            <span>Target: Rp {totalGoal.toLocaleString()}</span>
            <span>Saved: Rp {totalCurrent.toLocaleString()}</span>
          </div>
          <div className="h-2 rounded-full overflow-hidden" style={{background: 'var(--surface-container-high)'}}>
            <div className="h-full rounded-full transition-all" style={{width: `${goalPct}%`, background: 'var(--success)'}}></div>
          </div>
          <p className="text-xs mt-2" style={{color: 'var(--on-surface-variant)'}}>{goalPct}% achieved</p>
        </div>
      </div>

      <div className="card mb-8">
        <h2 className="font-semibold mb-4" style={{color: 'var(--on-surface)'}}>Cashflow Trend</h2>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--outline-variant)" />
            <XAxis dataKey="name" stroke="var(--on-surface-variant)" />
            <YAxis stroke="var(--on-surface-variant)" />
            <Tooltip contentStyle={{background: 'var(--surface-container)', border: 'none', borderRadius: 'var(--shape-medium)'}} />
            <Line type="monotone" dataKey="value" stroke="var(--primary)" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

            <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mt-6">
        <Link to="/wallets" className="card text-center hover:opacity-80 transition"><div className="text-2xl mb-1">👛</div><div style={{color: 'var(--on-surface)'}}>Wallets</div></Link>
        <Link to="/transactions" className="card text-center hover:opacity-80 transition"><div className="text-2xl mb-1">💰</div><div style={{color: 'var(--on-surface)'}}>Transactions</div></Link>
        <Link to="/budgets" className="card text-center hover:opacity-80 transition"><div className="text-2xl mb-1">📊</div><div style={{color: 'var(--on-surface)'}}>Budgets</div></Link>
        <Link to="/goals" className="card text-center hover:opacity-80 transition"><div className="text-2xl mb-1">🎯</div><div style={{color: 'var(--on-surface)'}}>Goals</div></Link>
        <Link to="/reports" className="card text-center hover:opacity-80 transition"><div className="text-2xl mb-1">📈</div><div style={{color: 'var(--on-surface)'}}>Reports</div></Link>
        <Link to="/ai-advisor" className="card text-center hover:opacity-80 transition"><div className="text-2xl mb-1">🤖</div><div style={{color: 'var(--on-surface)'}}>AI Advisor</div></Link>
        <Link to="/recurring" className="card text-center hover:opacity-80 transition"><div className="text-2xl mb-1">🔄</div><div style={{color: 'var(--on-surface)'}}>Recurring</div></Link>
        <Link to="/bills" className="card text-center hover:opacity-80 transition"><div className="text-2xl mb-1">🧾</div><div style={{color: 'var(--on-surface)'}}>Bills</div></Link>
        <Link to="/networth" className="card text-center hover:opacity-80 transition"><div className="text-2xl mb-1">📊</div><div style={{color: 'var(--on-surface)'}}>Net Worth</div></Link>
        <Link to="/settings" className="card text-center hover:opacity-80 transition"><div className="text-2xl mb-1">⚙️</div><div style={{color: 'var(--on-surface)'}}>Settings</div></Link>
      </div>
          <div style={{color: 'var(--on-surface)'}}>Wallets</div>
        </Link>
        <Link to="/transactions" className="card text-center hover:opacity-80 transition">
          <div className="text-2xl mb-1">💰</div>
          <div style={{color: 'var(--on-surface)'}}>Transactions</div>
        </Link>
        <Link to="/budgets" className="card text-center hover:opacity-80 transition">
          <div className="text-2xl mb-1">📊</div>
          <div style={{color: 'var(--on-surface)'}}>Budgets</div>
        </Link>
        <Link to="/goals" className="card text-center hover:opacity-80 transition">
          <div className="text-2xl mb-1">🎯</div>
          <div style={{color: 'var(--on-surface)'}}>Goals</div>
        </Link>
      </div>
    </div>
  );
};