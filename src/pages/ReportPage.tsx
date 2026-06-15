import React, { useState } from 'react';
import { useTransactionStore } from '../stores/transactionStore';
import { useWalletStore } from '../stores/walletStore';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { exportToCSV } from '../utils/exportData';

export const ReportPage = () => {
  const { transactions } = useTransactionStore();
  const { wallets } = useWalletStore();
  const [period, setPeriod] = useState('month');
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0,7));

  const getFilteredTransactions = () => {
    if (period === 'month') {
      return transactions.filter(t => t.date.startsWith(selectedMonth));
    }
    return transactions;
  };

  const filtered = getFilteredTransactions();
  const income = filtered.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const expense = filtered.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const profit = income - expense;

  // Category breakdown
  const categoryData = filtered.filter(t => t.type === 'expense').reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + t.amount;
    return acc;
  }, {} as Record<string, number>);

  const pieData = Object.entries(categoryData).map(([name, value]) => ({ name, value }));
  const COLORS = ['#0B57D0', '#34A853', '#FB8C00', '#EA4335', '#9334E6', '#00BCD4'];

  // Monthly trend
  const months = ['2026-01', '2026-02', '2026-03', '2026-04', '2026-05', '2026-06'];
  const trendData = months.map(m => ({
    month: m.slice(5),
    income: transactions.filter(t => t.type === 'income' && t.date.startsWith(m)).reduce((s, t) => s + t.amount, 0),
    expense: transactions.filter(t => t.type === 'expense' && t.date.startsWith(m)).reduce((s, t) => s + t.amount, 0),
  }));

  const handleExport = () => {
    const exportData = filtered.map(t => ({
      Date: t.date, Description: t.desc, Category: t.category,
      Amount: t.type === 'income' ? t.amount : -t.amount,
      Wallet: wallets.find(w => w.id === t.walletId)?.name
    }));
    exportToCSV(exportData, `report_${selectedMonth}`);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6 flex-wrap gap-2">
        <h1 className="text-2xl font-bold" style={{color: 'var(--on-surface)'}}>Laporan Keuangan</h1>
        <div className="flex gap-3">
          <select value={period} onChange={e => setPeriod(e.target.value)} className="input-m3">
            <option value="month">Bulan Ini</option>
            <option value="all">Semua</option>
          </select>
          {period === 'month' && (
            <input type="month" value={selectedMonth} onChange={e => setSelectedMonth(e.target.value)} className="input-m3" />
          )}
          <button onClick={handleExport} className="btn-primary">📥 Export CSV</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card">
          <div className="text-sm" style={{color: 'var(--on-surface-variant)'}}>Total Pemasukan</div>
          <div className="text-2xl font-bold" style={{color: 'var(--success)'}}>+Rp {income.toLocaleString()}</div>
        </div>
        <div className="card">
          <div className="text-sm" style={{color: 'var(--on-surface-variant)'}}>Total Pengeluaran</div>
          <div className="text-2xl font-bold" style={{color: 'var(--error)'}}>-Rp {expense.toLocaleString()}</div>
        </div>
        <div className="card">
          <div className="text-sm" style={{color: 'var(--on-surface-variant)'}}>Selisih (Profit/Loss)</div>
          <div className={`text-2xl font-bold ${profit >= 0 ? 'text-success' : 'text-error'}`}>
            {profit >= 0 ? '+' : ''}Rp {profit.toLocaleString()}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="card">
          <h2 className="font-semibold mb-4" style={{color: 'var(--on-surface)'}}>Pengeluaran per Kategori</h2>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" labelLine={false} label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`} outerRadius={80} fill="#8884d8" dataKey="value">
                  {pieData.map((_, idx) => <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(v) => `Rp ${v.toLocaleString()}`} />
              </PieChart>
            </ResponsiveContainer>
          ) : <div className="text-center py-8" style={{color: 'var(--on-surface-variant)'}}>Belum ada data transaksi</div>}
        </div>

        <div className="card">
          <h2 className="font-semibold mb-4" style={{color: 'var(--on-surface)'}}>Tren Bulanan</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--outline-variant)" />
              <XAxis dataKey="month" stroke="var(--on-surface-variant)" />
              <YAxis stroke="var(--on-surface-variant)" />
              <Tooltip formatter={(v) => `Rp ${v.toLocaleString()}`} />
              <Legend />
              <Bar dataKey="income" fill="var(--success)" name="Pemasukan" />
              <Bar dataKey="expense" fill="var(--error)" name="Pengeluaran" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card">
        <h2 className="font-semibold mb-4" style={{color: 'var(--on-surface)'}}>Detail Transaksi</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="border-b" style={{borderColor: 'var(--outline-variant)'}}>
              <tr style={{color: 'var(--on-surface-variant)'}}><th className="py-2">Tanggal</th><th>Deskripsi</th><th>Kategori</th><th className="text-right">Jumlah</th></tr>
            </thead>
            <tbody>
              {filtered.slice(0, 20).map(t => (
                <tr key={t.id} className="border-b" style={{borderColor: 'var(--outline-variant)'}}>
                  <td className="py-2">{t.date}</td><td>{t.desc}</td><td>{t.category}</td>
                  <td className={`text-right font-semibold ${t.type === 'income' ? 'text-success' : 'text-error'}`}>
                    {t.type === 'income' ? '+' : '-'}Rp {t.amount.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};