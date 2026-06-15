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
  const totalBudget = budgets.reduce((s,b)=>s+b.amount,0);
  const totalSpent = budgets.reduce((s,b)=>s+b.spent,0);
  const budgetPct = totalBudget > 0 ? (totalSpent/totalBudget*100).toFixed(0) : 0;
  const totalGoal = goals.reduce((s,g)=>s+g.target,0);
  const totalCurrent = goals.reduce((s,g)=>s+g.current,0);
  const goalPct = totalGoal > 0 ? (totalCurrent/totalGoal*100).toFixed(0) : 0;
  const chartData = [['Jan',4500],['Feb',5200],['Mar',4800],['Apr',6100],['May',5800],['Jun',6300]].map(([n,v])=>({name:n,value:v}));

  return <div className="p-6 max-w-7xl mx-auto"><div className="flex justify-between items-center mb-6"><h1 className="text-2xl font-bold">Dashboard</h1><div className="flex gap-2">{wallets.map(w=><button key={w.id} onClick={()=>setActiveWallet(w.id)} className={`px-3 py-1 rounded-full text-sm ${activeWalletId===w.id?'bg-blue-600 text-white':'bg-gray-200'}`}>{w.name}</button>)}</div></div><div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"><div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl p-4"><div className="text-sm opacity-80">Total Balance</div><div className="text-2xl font-bold">Rp {total.toLocaleString()}</div></div><div className="bg-green-50 rounded-xl p-4"><div className="text-sm text-green-600">Income</div><div className="text-xl font-bold text-green-700">+Rp {income.toLocaleString()}</div></div><div className="bg-red-50 rounded-xl p-4"><div className="text-sm text-red-600">Expense</div><div className="text-xl font-bold text-red-700">-Rp {expense.toLocaleString()}</div></div><div className="bg-purple-50 rounded-xl p-4"><div className="text-sm text-purple-600">Saving Rate</div><div className="text-xl font-bold text-purple-700">{income>0?((income-expense)/income*100).toFixed(0):0}%</div></div></div><div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"><div className="bg-white rounded-xl shadow p-4"><div className="flex justify-between mb-4"><h2 className="font-semibold">Budget</h2><Link to="/budgets" className="text-blue-600 text-sm">Manage</Link></div><div className="mb-2 flex justify-between text-sm"><span>Rp {totalBudget.toLocaleString()}</span><span>Spent: Rp {totalSpent.toLocaleString()}</span></div><div className="h-2 bg-gray-200 rounded-full overflow-hidden"><div className="h-full bg-blue-600 rounded-full" style={{width:`${budgetPct}%`}}></div></div><p className="text-xs text-gray-500 mt-2">{budgetPct}% used</p></div><div className="bg-white rounded-xl shadow p-4"><div className="flex justify-between mb-4"><h2 className="font-semibold">Goals</h2><Link to="/goals" className="text-blue-600 text-sm">Manage</Link></div><div className="mb-2 flex justify-between text-sm"><span>Rp {totalGoal.toLocaleString()}</span><span>Saved: Rp {totalCurrent.toLocaleString()}</span></div><div className="h-2 bg-gray-200 rounded-full overflow-hidden"><div className="h-full bg-green-500 rounded-full" style={{width:`${goalPct}%`}}></div></div><p className="text-xs text-gray-500 mt-2">{goalPct}% achieved</p></div></div><div className="bg-white rounded-xl shadow p-4 mb-8"><h2 className="font-semibold mb-4">Cashflow Trend</h2><ResponsiveContainer width="100%" height={250}><LineChart data={chartData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" /><YAxis /><Tooltip /><Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} /></LineChart></ResponsiveContainer></div><div className="grid grid-cols-2 md:grid-cols-4 gap-4"><Link to="/wallets" className="bg-white rounded-xl shadow p-4 text-center hover:shadow-lg"><div className="text-2xl mb-1">👛</div><div>Wallets</div></Link><Link to="/transactions" className="bg-white rounded-xl shadow p-4 text-center hover:shadow-lg"><div className="text-2xl mb-1">💰</div><div>Transactions</div></Link><Link to="/budgets" className="bg-white rounded-xl shadow p-4 text-center hover:shadow-lg"><div className="text-2xl mb-1">📊</div><div>Budgets</div></Link><Link to="/goals" className="bg-white rounded-xl shadow p-4 text-center hover:shadow-lg"><div className="text-2xl mb-1">🎯</div><div>Goals</div></Link></div></div>;
};