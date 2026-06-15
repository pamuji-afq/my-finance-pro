import React, { useState } from 'react';
import { useBudgetStore } from '../stores/budgetStore';
import { useTransactionStore } from '../stores/transactionStore';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { EmptyState } from '../components/EmptyState';

export const BudgetsPage = () => {
  const { budgets, addBudget, updateBudget, deleteBudget } = useBudgetStore();
  const { transactions } = useTransactionStore();
  const [showForm, setShowForm] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [form, setForm] = useState({ category: '', amount: 0 });
  const currentMonth = new Date().toISOString().slice(0,7);

  const getSpent = (cat) => transactions.filter(t => t.type === 'expense' && t.category === cat && t.date.startsWith(currentMonth)).reduce((s, t) => s + t.amount, 0);
  const monthlyBudgets = budgets.filter(b => b.month === currentMonth);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingBudget) {
      updateBudget(editingBudget.id, { amount: form.amount });
      setEditingBudget(null);
    } else {
      addBudget({ ...form, month: currentMonth });
    }
    setForm({ category: '', amount: 0 });
    setShowForm(false);
  };

  const openEdit = (budget) => {
    setEditingBudget(budget);
    setForm({ category: budget.category, amount: budget.amount });
    setShowForm(true);
  };

  if (monthlyBudgets.length === 0 && !showForm) {
    return <EmptyState title="Belum Ada Budget" message="Buat budget untuk mengontrol pengeluaran Anda" actionLabel="+ Buat Budget" onAction={() => setShowForm(true)} />;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Budgets - {currentMonth}</h1>
        <button onClick={() => setShowForm(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg">+ New Budget</button>
      </div>

      <div className="grid gap-4">
        {monthlyBudgets.map(b => {
          const spent = getSpent(b.category);
          const pct = Math.min(100, (spent / b.amount) * 100);
          const remaining = b.amount - spent;
          return (
            <div key={b.id} className="bg-white rounded-xl shadow p-4">
              <div className="flex justify-between items-start mb-2">
                <div><h3 className="font-bold text-lg">{b.category}</h3><p className="text-sm text-gray-500">Budget: Rp {b.amount.toLocaleString()}</p></div>
                <div className="text-right"><p className="text-sm">Spent: Rp {spent.toLocaleString()}</p><p className={`text-sm ${remaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>Remaining: Rp {remaining.toLocaleString()}</p></div>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden"><div className={`h-full rounded-full ${pct >= 100 ? 'bg-red-500' : pct >= 80 ? 'bg-yellow-500' : 'bg-green-500'}`} style={{ width: `${pct}%` }}></div></div>
              <div className="flex justify-end gap-2 mt-3">
                <button onClick={() => openEdit(b)} className="text-blue-500 text-sm">Edit</button>
                <button onClick={() => setDeleteTarget(b)} className="text-red-500 text-sm">Delete</button>
              </div>
            </div>
          );
        })}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <h2 className="text-xl font-bold mb-4">{editingBudget ? 'Edit Budget' : 'New Budget'}</h2>
            <form onSubmit={handleSubmit}>
              <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="w-full p-3 border rounded-lg mb-3" required disabled={!!editingBudget}>
                <option value="">Select category</option><option value="Food">Food</option><option value="Transport">Transport</option><option value="Shopping">Shopping</option><option value="Bills">Bills</option><option value="Entertainment">Entertainment</option>
              </select>
              <input type="number" placeholder="Budget Amount" value={form.amount} onChange={e => setForm({ ...form, amount: parseFloat(e.target.value) || 0 })} className="w-full p-3 border rounded-lg mb-4" required />
              <div className="flex gap-3">
                <button type="button" onClick={() => { setShowForm(false); setEditingBudget(null); setForm({ category: '', amount: 0 }); }} className="flex-1 border rounded-lg p-2">Cancel</button>
                <button type="submit" className="flex-1 bg-blue-600 text-white rounded-lg p-2">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmDialog isOpen={!!deleteTarget} title="Hapus Budget" message={`Apakah Anda yakin ingin menghapus budget untuk kategori "${deleteTarget?.category}"?`} onConfirm={() => { deleteBudget(deleteTarget.id); setDeleteTarget(null); }} onCancel={() => setDeleteTarget(null)} />
    </div>
  );
};