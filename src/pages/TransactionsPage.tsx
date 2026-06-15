import React, { useState, useMemo } from 'react';
import { useTransactionStore } from '../stores/transactionStore';
import { useWalletStore } from '../stores/walletStore';
import { useBudgetStore } from '../stores/budgetStore';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { EmptyState } from '../components/EmptyState';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { exportToCSV } from '../utils/exportData';

export const TransactionsPage = () => {
  const { transactions, addTransaction, updateTransaction, deleteTransaction, getFilteredTransactions } = useTransactionStore();
  const { wallets, updateBalance } = useWalletStore();
  const { updateSpent } = useBudgetStore();
  const [showForm, setShowForm] = useState(false);
  const [editingTx, setEditingTx] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [filters, setFilters] = useState({ walletId: '', category: '', type: '', startDate: '', endDate: '', search: '' });
  const [form, setForm] = useState({ walletId: wallets[0]?.id || '', amount: 0, type: 'expense', category: '', desc: '', date: new Date().toISOString().slice(0,10), note: '' });

  const filtered = useMemo(() => getFilteredTransactions(filters), [transactions, filters]);
  const categories = { income: ['Salary', 'Freelance', 'Gift', 'Investment'], expense: ['Food', 'Transport', 'Shopping', 'Bills', 'Entertainment', 'Healthcare'] };

  const handleSubmit = (e) => {
    e.preventDefault();
    const amount = form.type === 'expense' ? -form.amount : form.amount;
    if (editingTx) {
      const oldTx = transactions.find(t => t.id === editingTx.id);
      const oldAmount = oldTx.type === 'income' ? oldTx.amount : -oldTx.amount;
      updateBalance(oldTx.walletId, -oldAmount);
      if (oldTx.type === 'expense') updateSpent(oldTx.category, -oldTx.amount);
      updateTransaction(editingTx.id, form);
      updateBalance(form.walletId, amount);
      if (form.type === 'expense') updateSpent(form.category, form.amount);
      setEditingTx(null);
    } else {
      addTransaction(form);
      updateBalance(form.walletId, amount);
      if (form.type === 'expense') updateSpent(form.category, form.amount);
    }
    setShowForm(false);
    setForm({ walletId: wallets[0]?.id, amount: 0, type: 'expense', category: '', desc: '', date: new Date().toISOString().slice(0,10), note: '' });
  };

  const handleExport = () => {
    const exportData = filtered.map(t => ({ ID: t.id, Description: t.desc, Category: t.category, Amount: t.type === 'income' ? t.amount : -t.amount, Date: t.date, Wallet: wallets.find(w => w.id === t.walletId)?.name, Note: t.note || '' }));
    exportToCSV(exportData, `transactions_${new Date().toISOString().slice(0,10)}`);
  };

  const getWalletName = (id) => wallets.find(w => w.id === id)?.name || 'Unknown';

  if (transactions.length === 0 && !showForm) {
    return <EmptyState title="Belum Ada Transaksi" message="Tambahkan transaksi pertama Anda" actionLabel="+ Tambah Transaksi" onAction={() => setShowForm(true)} />;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6 flex-wrap gap-2">
        <h1 className="text-2xl font-bold">Transactions</h1>
        <div className="flex gap-2">
          <button onClick={handleExport} className="bg-green-600 text-white px-4 py-2 rounded-lg">📥 Export CSV</button>
          <button onClick={() => setShowForm(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg">+ Add</button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <input type="text" placeholder="Search..." value={filters.search} onChange={e => setFilters({ ...filters, search: e.target.value })} className="p-2 border rounded-lg" />
          <select value={filters.walletId} onChange={e => setFilters({ ...filters, walletId: e.target.value })} className="p-2 border rounded-lg"><option value="">All Wallets</option>{wallets.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}</select>
          <select value={filters.category} onChange={e => setFilters({ ...filters, category: e.target.value })} className="p-2 border rounded-lg"><option value="">All Categories</option>{[...categories.income, ...categories.expense].map(c => <option key={c}>{c}</option>)}</select>
          <select value={filters.type} onChange={e => setFilters({ ...filters, type: e.target.value })} className="p-2 border rounded-lg"><option value="">All Types</option><option value="income">Income</option><option value="expense">Expense</option></select>
          <input type="date" placeholder="Start Date" value={filters.startDate} onChange={e => setFilters({ ...filters, startDate: e.target.value })} className="p-2 border rounded-lg" />
          <input type="date" placeholder="End Date" value={filters.endDate} onChange={e => setFilters({ ...filters, endDate: e.target.value })} className="p-2 border rounded-lg" />
        </div>
      </div>

      {/* Transactions List */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        {filtered.map(t => (
          <div key={t.id} className="p-4 border-b flex justify-between items-center hover:bg-gray-50">
            <div>
              <div className="font-medium">{t.desc}</div>
              <div className="text-sm text-gray-500">{t.category} • {getWalletName(t.walletId)} • {t.date}</div>
              {t.note && <div className="text-xs text-gray-400 mt-1">{t.note}</div>}
            </div>
            <div className="flex gap-3 items-center">
              <span className={`font-semibold ${t.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>{t.type === 'income' ? '+' : '-'}Rp {t.amount.toLocaleString()}</span>
              <button onClick={() => { setEditingTx(t); setForm({ ...t, amount: t.amount }); setShowForm(true); }} className="text-blue-500">✏️</button>
              <button onClick={() => setDeleteTarget(t)} className="text-red-500">🗑️</button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && <div className="p-8 text-center text-gray-500">No transactions match your filters</div>}
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">{editingTx ? 'Edit Transaction' : 'New Transaction'}</h2>
            <form onSubmit={handleSubmit}>
              <select value={form.walletId} onChange={e => setForm({ ...form, walletId: e.target.value })} className="w-full p-3 border rounded-lg mb-3" required>{wallets.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}</select>
              <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value, category: '' })} className="w-full p-3 border rounded-lg mb-3"><option value="expense">Expense</option><option value="income">Income</option></select>
              <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="w-full p-3 border rounded-lg mb-3" required><option value="">Select category</option>{categories[form.type].map(c => <option key={c}>{c}</option>)}</select>
              <input type="text" placeholder="Description" value={form.desc} onChange={e => setForm({ ...form, desc: e.target.value })} className="w-full p-3 border rounded-lg mb-3" required />
              <input type="number" placeholder="Amount" value={form.amount} onChange={e => setForm({ ...form, amount: parseFloat(e.target.value) || 0 })} className="w-full p-3 border rounded-lg mb-3" required />
              <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} className="w-full p-3 border rounded-lg mb-3" required />
              <input type="text" placeholder="Note (optional)" value={form.note} onChange={e => setForm({ ...form, note: e.target.value })} className="w-full p-3 border rounded-lg mb-4" />
              <div className="flex gap-3">
                <button type="button" onClick={() => { setShowForm(false); setEditingTx(null); }} className="flex-1 border rounded-lg p-2">Cancel</button>
                <button type="submit" className="flex-1 bg-blue-600 text-white rounded-lg p-2">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmDialog isOpen={!!deleteTarget} title="Hapus Transaksi" message={`Apakah Anda yakin ingin menghapus transaksi "${deleteTarget?.desc}"?`} onConfirm={() => { deleteTransaction(deleteTarget.id); setDeleteTarget(null); }} onCancel={() => setDeleteTarget(null)} />
    </div>
  );
};