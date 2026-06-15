import React from 'react';
import { useTransactionStore } from '../stores/transactionStore';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
export const ReportsPage = () => {
  const { transactions } = useTransactionStore();
  const expenseByCategory = transactions.filter(t=>t.type==='expense').reduce((acc, t) => { acc[t.category] = (acc[t.category] || 0) + t.amount; return acc; }, {});
  const pieData = Object.entries(expenseByCategory).map(([name, value]) => ({ name, value }));
  const COLORS = ['#0B57D0', '#34A853', '#FB8C00', '#EA4335'];
  const monthlyData = [['Jan',5000,4200],['Feb',5200,4400],['Mar',4800,4100],['Apr',6100,5000],['May',5800,4800],['Jun',6300,5200]].map(([n,i,e])=>({name:n,income:i,expense:e}));
  return (<><h1 className="text-title-large mb-4">Laporan</h1><div className="card mb-4"><h2 className="text-title-medium mb-3">Pengeluaran per Kategori</h2>{pieData.length > 0 ? <ResponsiveContainer width="100%" height={250}><PieChart><Pie data={pieData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({name,percent}) => `${name} ${(percent*100).toFixed(0)}%`}>{pieData.map((_,i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip formatter={(v) => `Rp ${v.toLocaleString()}`} /></PieChart></ResponsiveContainer> : <p className="text-center text-label">Belum ada data</p>}</div><div className="card"><h2 className="text-title-medium mb-3">Tren Bulanan</h2><ResponsiveContainer width="100%" height={250}><BarChart data={monthlyData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" /><YAxis /><Tooltip formatter={(v) => `Rp ${v.toLocaleString()}`} /><Bar dataKey="income" fill="#0B57D0" name="Pemasukan" /><Bar dataKey="expense" fill="#C62828" name="Pengeluaran" /></BarChart></ResponsiveContainer></div></>);
};
