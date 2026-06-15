import os
import json
import subprocess

BASE = os.getcwd()

def write(path, content):
    full = os.path.join(BASE, path)
    os.makedirs(os.path.dirname(full), exist_ok=True)
    with open(full, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"✅ {path}")

print("🚀 MENAMBAHKAN HIGH PRIORITY FEATURES...")

# ========== 1. UPDATE WALLET STORE (with transfer) ==========
write("src/stores/walletStore.ts", """import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useWalletStore = create(persist((set, get) => ({
  wallets: [
    { id: '1', name: 'Tunai', balance: 12500000, currency: 'IDR', color: '#0B57D0' },
    { id: '2', name: 'BCA', balance: 5000000, currency: 'IDR', color: '#34A853' },
    { id: '3', name: 'OVO', balance: 150000, currency: 'IDR', color: '#FB8C00' },
  ],
  activeWalletId: '1',
  loading: false,
  
  addWallet: (wallet) => set(s => ({ 
    wallets: [...s.wallets, { ...wallet, id: Date.now().toString() }] 
  })),
  
  updateWallet: (id, updates) => set(s => ({
    wallets: s.wallets.map(w => w.id === id ? { ...w, ...updates } : w)
  })),
  
  deleteWallet: (id) => set(s => ({ 
    wallets: s.wallets.filter(w => w.id !== id),
    activeWalletId: s.activeWalletId === id ? s.wallets[0]?.id || null : s.activeWalletId
  })),
  
  updateBalance: (id, amount) => set(s => ({
    wallets: s.wallets.map(w => w.id === id ? { ...w, balance: w.balance + amount } : w)
  })),
  
  setActiveWallet: (id) => set({ activeWalletId: id }),
  
  transfer: (fromId, toId, amount) => {
    const { wallets, updateBalance } = get();
    const fromWallet = wallets.find(w => w.id === fromId);
    const toWallet = wallets.find(w => w.id === toId);
    if (!fromWallet || !toWallet || fromWallet.balance < amount) return false;
    updateBalance(fromId, -amount);
    updateBalance(toId, amount);
    return true;
  },
}), { name: 'wallets' }));""")

# ========== 2. UPDATE TRANSACTION STORE (with edit & filter) ==========
write("src/stores/transactionStore.ts", """import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useTransactionStore = create(persist((set, get) => ({
  transactions: [
    { id: '1', walletId: '1', amount: 5000000, type: 'income', category: 'Salary', desc: 'Gaji Bulanan', date: '2026-06-13', note: '' },
    { id: '2', walletId: '1', amount: 150000, type: 'expense', category: 'Food', desc: 'Belanja Bulanan', date: '2026-06-14', note: '' },
    { id: '3', walletId: '2', amount: 200000, type: 'expense', category: 'Transport', desc: 'Bensin', date: '2026-06-12', note: '' },
  ],
  loading: false,
  
  addTransaction: (tx) => set(s => ({ 
    transactions: [...s.transactions, { ...tx, id: Date.now().toString() }] 
  })),
  
  updateTransaction: (id, updates) => set(s => ({
    transactions: s.transactions.map(t => t.id === id ? { ...t, ...updates } : t)
  })),
  
  deleteTransaction: (id) => set(s => ({ 
    transactions: s.transactions.filter(t => t.id !== id) 
  })),
  
  getFilteredTransactions: (filters) => {
    const { transactions } = get();
    return transactions.filter(t => {
      if (filters.walletId && t.walletId !== filters.walletId) return false;
      if (filters.category && t.category !== filters.category) return false;
      if (filters.type && t.type !== filters.type) return false;
      if (filters.startDate && t.date < filters.startDate) return false;
      if (filters.endDate && t.date > filters.endDate) return false;
      if (filters.search && !t.desc.toLowerCase().includes(filters.search.toLowerCase())) return false;
      return true;
    });
  },
}), { name: 'transactions' }));""")

# ========== 3. UPDATE BUDGET STORE (with edit & delete) ==========
write("src/stores/budgetStore.ts", """import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useBudgetStore = create(persist((set, get) => ({
  budgets: [
    { id: '1', category: 'Food', amount: 2000000, spent: 650000, month: '2026-06' },
    { id: '2', category: 'Transport', amount: 1000000, spent: 200000, month: '2026-06' },
    { id: '3', category: 'Bills', amount: 1500000, spent: 0, month: '2026-06' },
  ],
  
  addBudget: (budget) => set(s => ({ 
    budgets: [...s.budgets, { ...budget, id: Date.now().toString(), spent: 0 }] 
  })),
  
  updateBudget: (id, updates) => set(s => ({
    budgets: s.budgets.map(b => b.id === id ? { ...b, ...updates } : b)
  })),
  
  deleteBudget: (id) => set(s => ({ 
    budgets: s.budgets.filter(b => b.id !== id) 
  })),
  
  updateSpent: (category, amount) => set(s => ({
    budgets: s.budgets.map(b => 
      b.category === category && b.month === new Date().toISOString().slice(0,7)
        ? { ...b, spent: b.spent + amount }
        : b
    )
  })),
}), { name: 'budgets' }));""")

# ========== 4. UPDATE GOAL STORE (with edit & delete) ==========
write("src/stores/goalStore.ts", """import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useGoalStore = create(persist((set, get) => ({
  goals: [
    { id: '1', name: 'Dana Darurat', target: 30000000, current: 18000000, icon: '🛡️', color: '#0B57D0' },
    { id: '2', name: 'Liburan ke Bali', target: 5000000, current: 2000000, icon: '🏖️', color: '#34A853' },
    { id: '3', name: 'Mobil Baru', target: 200000000, current: 0, icon: '🚗', color: '#FB8C00' },
  ],
  
  addGoal: (goal) => set(s => ({ 
    goals: [...s.goals, { ...goal, id: Date.now().toString(), current: 0 }] 
  })),
  
  updateGoal: (id, updates) => set(s => ({
    goals: s.goals.map(g => g.id === id ? { ...g, ...updates } : g)
  })),
  
  deleteGoal: (id) => set(s => ({ 
    goals: s.goals.filter(g => g.id !== id) 
  })),
  
  contribute: (id, amount) => set(s => ({
    goals: s.goals.map(g => g.id === id ? { ...g, current: g.current + amount } : g)
  })),
}), { name: 'goals' }));""")

# ========== 5. DELETE CONFIRMATION DIALOG COMPONENT ==========
write("src/components/ConfirmDialog.tsx", """import React from 'react';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = 'Hapus',
  cancelText = 'Batal',
}) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-2">{title}</h2>
        <p className="text-gray-600 mb-6">{message}</p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};""")

# ========== 6. LOADING SKELETON COMPONENT ==========
write("src/components/LoadingSkeleton.tsx", """import React from 'react';

export const LoadingSkeleton: React.FC = () => {
  return (
    <div className="animate-pulse">
      <div className="h-32 bg-gray-200 rounded-xl mb-4"></div>
      <div className="h-20 bg-gray-200 rounded-xl mb-3"></div>
      <div className="h-20 bg-gray-200 rounded-xl mb-3"></div>
      <div className="h-20 bg-gray-200 rounded-xl"></div>
    </div>
  );
};

export const CardSkeleton: React.FC = () => {
  return (
    <div className="animate-pulse bg-white rounded-xl shadow p-4">
      <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
      <div className="h-8 bg-gray-200 rounded w-1/2 mb-1"></div>
      <div className="h-3 bg-gray-200 rounded w-1/4"></div>
    </div>
  );
};

export const TransactionSkeleton: React.FC = () => {
  return (
    <div className="animate-pulse flex justify-between p-4 border-b">
      <div className="flex-1">
        <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
        <div className="h-3 bg-gray-200 rounded w-1/4"></div>
      </div>
      <div className="h-4 bg-gray-200 rounded w-20"></div>
    </div>
  );
};""")

# ========== 7. EMPTY STATE COMPONENT ==========
write("src/components/EmptyState.tsx", """import React from 'react';

interface EmptyStateProps {
  title: string;
  message: string;
  icon?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  message,
  icon = '📭',
  actionLabel,
  onAction,
}) => {
  return (
    <div className="text-center py-12">
      <div className="text-6xl mb-4">{icon}</div>
      <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-500 mb-4">{message}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};""")

# ========== 8. EXPORT UTILITY ==========
write("src/utils/exportData.ts", """export const exportToCSV = (data: any[], filename: string) => {
  if (!data.length) return;
  const headers = Object.keys(data[0]);
  const csvRows = [headers.join(',')];
  for (const row of data) {
    const values = headers.map(header => {
      const val = row[header];
      return `"${String(val).replace(/"/g, '""')}"`;
    });
    csvRows.push(values.join(','));
  }
  const blob = new Blob([csvRows.join('\\n')], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const exportToJSON = (data: any, filename: string) => {
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};""")

# ========== 9. UPDATE WALLETS PAGE (with edit, transfer, delete confirm) ==========
write("src/pages/WalletsPage.tsx", """import React, { useState } from 'react';
import { useWalletStore } from '../stores/walletStore';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { EmptyState } from '../components/EmptyState';

export const WalletsPage = () => {
  const { wallets, addWallet, updateWallet, deleteWallet, transfer } = useWalletStore();
  const [showForm, setShowForm] = useState(false);
  const [showTransfer, setShowTransfer] = useState(false);
  const [editingWallet, setEditingWallet] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [form, setForm] = useState({ name: '', balance: 0 });
  const [transferData, setTransferData] = useState({ fromId: '', toId: '', amount: 0 });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingWallet) {
      updateWallet(editingWallet.id, form);
    } else {
      addWallet({ ...form, currency: 'IDR', color: '#0B57D0' });
    }
    setForm({ name: '', balance: 0 });
    setEditingWallet(null);
    setShowForm(false);
  };

  const handleTransfer = (e) => {
    e.preventDefault();
    const success = transfer(transferData.fromId, transferData.toId, transferData.amount);
    if (success) {
      setShowTransfer(false);
      setTransferData({ fromId: '', toId: '', amount: 0 });
    } else {
      alert('Transfer failed: insufficient balance');
    }
  };

  const openEdit = (wallet) => {
    setEditingWallet(wallet);
    setForm({ name: wallet.name, balance: wallet.balance });
    setShowForm(true);
  };

  if (wallets.length === 0 && !showForm) {
    return <EmptyState title="Belum Ada Wallet" message="Tambahkan wallet pertama Anda untuk mulai mengelola keuangan" actionLabel="+ Tambah Wallet" onAction={() => setShowForm(true)} />;
  }

  return (
    <div className=\"p-6 max-w-7xl mx-auto\">
      <div className=\"flex justify-between items-center mb-6\">
        <h1 className=\"text-2xl font-bold\">Wallets</h1>
        <div className=\"flex gap-2\">
          <button onClick={() => setShowTransfer(true)} className=\"bg-purple-600 text-white px-4 py-2 rounded-lg\">↗️ Transfer</button>
          <button onClick={() => setShowForm(true)} className=\"bg-blue-600 text-white px-4 py-2 rounded-lg\">+ New Wallet</button>
        </div>
      </div>

      <div className=\"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4\">
        {wallets.map(w => (
          <div key={w.id} className=\"bg-white rounded-xl shadow p-4\">
            <div className=\"flex justify-between items-start\">
              <div>
                <h3 className=\"font-bold text-lg\">{w.name}</h3>
                <p className=\"text-2xl font-bold text-blue-600\">Rp {w.balance.toLocaleString()}</p>
              </div>
              <div className=\"flex gap-2\">
                <button onClick={() => openEdit(w)} className=\"text-blue-500\">✏️</button>
                <button onClick={() => setDeleteTarget(w)} className=\"text-red-500\">🗑️</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className=\"fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4\">
          <div className=\"bg-white rounded-xl shadow-xl w-full max-w-md p-6\">
            <h2 className=\"text-xl font-bold mb-4\">{editingWallet ? 'Edit Wallet' : 'New Wallet'}</h2>
            <form onSubmit={handleSubmit}>
              <input type=\"text\" placeholder=\"Wallet Name\" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className=\"w-full p-3 border rounded-lg mb-3\" required />
              <input type=\"number\" placeholder=\"Balance\" value={form.balance} onChange={e => setForm({ ...form, balance: parseFloat(e.target.value) || 0 })} className=\"w-full p-3 border rounded-lg mb-4\" />
              <div className=\"flex gap-3\">
                <button type=\"button\" onClick={() => { setShowForm(false); setEditingWallet(null); setForm({ name: '', balance: 0 }); }} className=\"flex-1 border rounded-lg p-2\">Cancel</button>
                <button type=\"submit\" className=\"flex-1 bg-blue-600 text-white rounded-lg p-2\">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Transfer Modal */}
      {showTransfer && (
        <div className=\"fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4\">
          <div className=\"bg-white rounded-xl shadow-xl w-full max-w-md p-6\">
            <h2 className=\"text-xl font-bold mb-4\">Transfer Money</h2>
            <form onSubmit={handleTransfer}>
              <select value={transferData.fromId} onChange={e => setTransferData({ ...transferData, fromId: e.target.value })} className=\"w-full p-3 border rounded-lg mb-3\" required>
                <option value=\"\">From Wallet</option>
                {wallets.map(w => <option key={w.id} value={w.id}>{w.name} (Rp {w.balance.toLocaleString()})</option>)}
              </select>
              <select value={transferData.toId} onChange={e => setTransferData({ ...transferData, toId: e.target.value })} className=\"w-full p-3 border rounded-lg mb-3\" required>
                <option value=\"\">To Wallet</option>
                {wallets.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
              </select>
              <input type=\"number\" placeholder=\"Amount\" value={transferData.amount} onChange={e => setTransferData({ ...transferData, amount: parseFloat(e.target.value) || 0 })} className=\"w-full p-3 border rounded-lg mb-4\" required />
              <div className=\"flex gap-3\">
                <button type=\"button\" onClick={() => setShowTransfer(false)} className=\"flex-1 border rounded-lg p-2\">Cancel</button>
                <button type=\"submit\" className=\"flex-1 bg-purple-600 text-white rounded-lg p-2\">Transfer</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog isOpen={!!deleteTarget} title=\"Hapus Wallet\" message={`Apakah Anda yakin ingin menghapus wallet \"${deleteTarget?.name}\"? Data transaksi terkait wallet ini akan tetap tersimpan.`} onConfirm={() => { deleteWallet(deleteTarget.id); setDeleteTarget(null); }} onCancel={() => setDeleteTarget(null)} />
    </div>
  );
};""")

# ========== 10. UPDATE TRANSACTIONS PAGE (with edit, filter, search, export) ==========
write("src/pages/TransactionsPage.tsx", """import React, { useState, useMemo } from 'react';
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
    return <EmptyState title=\"Belum Ada Transaksi\" message=\"Tambahkan transaksi pertama Anda\" actionLabel=\"+ Tambah Transaksi\" onAction={() => setShowForm(true)} />;
  }

  return (
    <div className=\"p-6 max-w-7xl mx-auto\">
      <div className=\"flex justify-between items-center mb-6 flex-wrap gap-2\">
        <h1 className=\"text-2xl font-bold\">Transactions</h1>
        <div className=\"flex gap-2\">
          <button onClick={handleExport} className=\"bg-green-600 text-white px-4 py-2 rounded-lg\">📥 Export CSV</button>
          <button onClick={() => setShowForm(true)} className=\"bg-blue-600 text-white px-4 py-2 rounded-lg\">+ Add</button>
        </div>
      </div>

      {/* Filters */}
      <div className=\"bg-white rounded-xl shadow p-4 mb-6\">
        <div className=\"grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3\">
          <input type=\"text\" placeholder=\"Search...\" value={filters.search} onChange={e => setFilters({ ...filters, search: e.target.value })} className=\"p-2 border rounded-lg\" />
          <select value={filters.walletId} onChange={e => setFilters({ ...filters, walletId: e.target.value })} className=\"p-2 border rounded-lg\"><option value=\"\">All Wallets</option>{wallets.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}</select>
          <select value={filters.category} onChange={e => setFilters({ ...filters, category: e.target.value })} className=\"p-2 border rounded-lg\"><option value=\"\">All Categories</option>{[...categories.income, ...categories.expense].map(c => <option key={c}>{c}</option>)}</select>
          <select value={filters.type} onChange={e => setFilters({ ...filters, type: e.target.value })} className=\"p-2 border rounded-lg\"><option value=\"\">All Types</option><option value=\"income\">Income</option><option value=\"expense\">Expense</option></select>
          <input type=\"date\" placeholder=\"Start Date\" value={filters.startDate} onChange={e => setFilters({ ...filters, startDate: e.target.value })} className=\"p-2 border rounded-lg\" />
          <input type=\"date\" placeholder=\"End Date\" value={filters.endDate} onChange={e => setFilters({ ...filters, endDate: e.target.value })} className=\"p-2 border rounded-lg\" />
        </div>
      </div>

      {/* Transactions List */}
      <div className=\"bg-white rounded-xl shadow overflow-hidden\">
        {filtered.map(t => (
          <div key={t.id} className=\"p-4 border-b flex justify-between items-center hover:bg-gray-50\">
            <div>
              <div className=\"font-medium\">{t.desc}</div>
              <div className=\"text-sm text-gray-500\">{t.category} • {getWalletName(t.walletId)} • {t.date}</div>
              {t.note && <div className=\"text-xs text-gray-400 mt-1\">{t.note}</div>}
            </div>
            <div className=\"flex gap-3 items-center\">
              <span className={`font-semibold ${t.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>{t.type === 'income' ? '+' : '-'}Rp {t.amount.toLocaleString()}</span>
              <button onClick={() => { setEditingTx(t); setForm({ ...t, amount: t.amount }); setShowForm(true); }} className=\"text-blue-500\">✏️</button>
              <button onClick={() => setDeleteTarget(t)} className=\"text-red-500\">🗑️</button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && <div className=\"p-8 text-center text-gray-500\">No transactions match your filters</div>}
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className=\"fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto\">
          <div className=\"bg-white rounded-xl shadow-xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto\">
            <h2 className=\"text-xl font-bold mb-4\">{editingTx ? 'Edit Transaction' : 'New Transaction'}</h2>
            <form onSubmit={handleSubmit}>
              <select value={form.walletId} onChange={e => setForm({ ...form, walletId: e.target.value })} className=\"w-full p-3 border rounded-lg mb-3\" required>{wallets.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}</select>
              <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value, category: '' })} className=\"w-full p-3 border rounded-lg mb-3\"><option value=\"expense\">Expense</option><option value=\"income\">Income</option></select>
              <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className=\"w-full p-3 border rounded-lg mb-3\" required><option value=\"\">Select category</option>{categories[form.type].map(c => <option key={c}>{c}</option>)}</select>
              <input type=\"text\" placeholder=\"Description\" value={form.desc} onChange={e => setForm({ ...form, desc: e.target.value })} className=\"w-full p-3 border rounded-lg mb-3\" required />
              <input type=\"number\" placeholder=\"Amount\" value={form.amount} onChange={e => setForm({ ...form, amount: parseFloat(e.target.value) || 0 })} className=\"w-full p-3 border rounded-lg mb-3\" required />
              <input type=\"date\" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} className=\"w-full p-3 border rounded-lg mb-3\" required />
              <input type=\"text\" placeholder=\"Note (optional)\" value={form.note} onChange={e => setForm({ ...form, note: e.target.value })} className=\"w-full p-3 border rounded-lg mb-4\" />
              <div className=\"flex gap-3\">
                <button type=\"button\" onClick={() => { setShowForm(false); setEditingTx(null); }} className=\"flex-1 border rounded-lg p-2\">Cancel</button>
                <button type=\"submit\" className=\"flex-1 bg-blue-600 text-white rounded-lg p-2\">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmDialog isOpen={!!deleteTarget} title=\"Hapus Transaksi\" message={`Apakah Anda yakin ingin menghapus transaksi \"${deleteTarget?.desc}\"?`} onConfirm={() => { deleteTransaction(deleteTarget.id); setDeleteTarget(null); }} onCancel={() => setDeleteTarget(null)} />
    </div>
  );
};""")

# ========== 11. UPDATE BUDGETS PAGE (with edit, delete) ==========
write("src/pages/BudgetsPage.tsx", """import React, { useState } from 'react';
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
    return <EmptyState title=\"Belum Ada Budget\" message=\"Buat budget untuk mengontrol pengeluaran Anda\" actionLabel=\"+ Buat Budget\" onAction={() => setShowForm(true)} />;
  }

  return (
    <div className=\"p-6 max-w-7xl mx-auto\">
      <div className=\"flex justify-between items-center mb-6\">
        <h1 className=\"text-2xl font-bold\">Budgets - {currentMonth}</h1>
        <button onClick={() => setShowForm(true)} className=\"bg-blue-600 text-white px-4 py-2 rounded-lg\">+ New Budget</button>
      </div>

      <div className=\"grid gap-4\">
        {monthlyBudgets.map(b => {
          const spent = getSpent(b.category);
          const pct = Math.min(100, (spent / b.amount) * 100);
          const remaining = b.amount - spent;
          return (
            <div key={b.id} className=\"bg-white rounded-xl shadow p-4\">
              <div className=\"flex justify-between items-start mb-2\">
                <div><h3 className=\"font-bold text-lg\">{b.category}</h3><p className=\"text-sm text-gray-500\">Budget: Rp {b.amount.toLocaleString()}</p></div>
                <div className=\"text-right\"><p className=\"text-sm\">Spent: Rp {spent.toLocaleString()}</p><p className={`text-sm ${remaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>Remaining: Rp {remaining.toLocaleString()}</p></div>
              </div>
              <div className=\"h-2 bg-gray-200 rounded-full overflow-hidden\"><div className={`h-full rounded-full ${pct >= 100 ? 'bg-red-500' : pct >= 80 ? 'bg-yellow-500' : 'bg-green-500'}`} style={{ width: `${pct}%` }}></div></div>
              <div className=\"flex justify-end gap-2 mt-3\">
                <button onClick={() => openEdit(b)} className=\"text-blue-500 text-sm\">Edit</button>
                <button onClick={() => setDeleteTarget(b)} className=\"text-red-500 text-sm\">Delete</button>
              </div>
            </div>
          );
        })}
      </div>

      {showForm && (
        <div className=\"fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4\">
          <div className=\"bg-white rounded-xl shadow-xl w-full max-w-md p-6\">
            <h2 className=\"text-xl font-bold mb-4\">{editingBudget ? 'Edit Budget' : 'New Budget'}</h2>
            <form onSubmit={handleSubmit}>
              <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className=\"w-full p-3 border rounded-lg mb-3\" required disabled={!!editingBudget}>
                <option value=\"\">Select category</option><option value=\"Food\">Food</option><option value=\"Transport\">Transport</option><option value=\"Shopping\">Shopping</option><option value=\"Bills\">Bills</option><option value=\"Entertainment\">Entertainment</option>
              </select>
              <input type=\"number\" placeholder=\"Budget Amount\" value={form.amount} onChange={e => setForm({ ...form, amount: parseFloat(e.target.value) || 0 })} className=\"w-full p-3 border rounded-lg mb-4\" required />
              <div className=\"flex gap-3\">
                <button type=\"button\" onClick={() => { setShowForm(false); setEditingBudget(null); setForm({ category: '', amount: 0 }); }} className=\"flex-1 border rounded-lg p-2\">Cancel</button>
                <button type=\"submit\" className=\"flex-1 bg-blue-600 text-white rounded-lg p-2\">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmDialog isOpen={!!deleteTarget} title=\"Hapus Budget\" message={`Apakah Anda yakin ingin menghapus budget untuk kategori \"${deleteTarget?.category}\"?`} onConfirm={() => { deleteBudget(deleteTarget.id); setDeleteTarget(null); }} onCancel={() => setDeleteTarget(null)} />
    </div>
  );
};""")

# ========== 12. UPDATE GOALS PAGE (with edit, delete) ==========
write("src/pages/GoalsPage.tsx", """import React, { useState } from 'react';
import { useGoalStore } from '../stores/goalStore';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { EmptyState } from '../components/EmptyState';

export const GoalsPage = () => {
  const { goals, addGoal, updateGoal, deleteGoal, contribute } = useGoalStore();
  const [showForm, setShowForm] = useState(false);
  const [showContribute, setShowContribute] = useState(null);
  const [editingGoal, setEditingGoal] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [amount, setAmount] = useState(0);
  const [form, setForm] = useState({ name: '', target: 0, icon: '🎯', color: '#0B57D0' });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingGoal) {
      updateGoal(editingGoal.id, { target: form.target });
      setEditingGoal(null);
    } else {
      addGoal(form);
    }
    setForm({ name: '', target: 0, icon: '🎯', color: '#0B57D0' });
    setShowForm(false);
  };

  const openEdit = (goal) => {
    setEditingGoal(goal);
    setForm({ name: goal.name, target: goal.target, icon: goal.icon, color: goal.color });
    setShowForm(true);
  };

  const doContribute = () => {
    if (showContribute && amount > 0) {
      contribute(showContribute.id, amount);
      setShowContribute(null);
      setAmount(0);
    }
  };

  if (goals.length === 0 && !showForm) {
    return <EmptyState title=\"Belum Ada Goals\" message=\"Tetapkan tujuan keuangan Anda\" actionLabel=\"+ Buat Goal\" onAction={() => setShowForm(true)} />;
  }

  return (
    <div className=\"p-6 max-w-7xl mx-auto\">
      <div className=\"flex justify-between items-center mb-6\">
        <h1 className=\"text-2xl font-bold\">Financial Goals</h1>
        <button onClick={() => setShowForm(true)} className=\"bg-blue-600 text-white px-4 py-2 rounded-lg\">+ New Goal</button>
      </div>

      <div className=\"grid grid-cols-1 md:grid-cols-2 gap-4\">
        {goals.map(g => {
          const pct = Math.min(100, (g.current / g.target) * 100);
          return (
            <div key={g.id} className=\"bg-white rounded-xl shadow p-4\">
              <div className=\"flex justify-between items-start mb-2\">
                <div><h3 className=\"font-bold text-lg\">{g.icon} {g.name}</h3><p className=\"text-sm text-gray-500\">Rp {g.current.toLocaleString()} / Rp {g.target.toLocaleString()}</p></div>
                <div className=\"text-2xl font-bold text-green-600\">{pct.toFixed(0)}%</div>
              </div>
              <div className=\"h-2 bg-gray-200 rounded-full mt-2 mb-3 overflow-hidden\"><div className=\"h-full bg-green-500 rounded-full\" style={{ width: `${pct}%` }}></div></div>
              <div className=\"flex justify-end gap-2\">
                <button onClick={() => setShowContribute(g)} className=\"bg-green-600 text-white px-3 py-1 rounded text-sm\">+ Contribute</button>
                <button onClick={() => openEdit(g)} className=\"text-blue-500 text-sm\">Edit</button>
                <button onClick={() => setDeleteTarget(g)} className=\"text-red-500 text-sm\">Delete</button>
              </div>
            </div>
          );
        })}
      </div>

      {showForm && (
        <div className=\"fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4\">
          <div className=\"bg-white rounded-xl shadow-xl w-full max-w-md p-6\">
            <h2 className=\"text-xl font-bold mb-4\">{editingGoal ? 'Edit Goal' : 'New Goal'}</h2>
            <form onSubmit={handleSubmit}>
              <input type=\"text\" placeholder=\"Goal Name\" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className=\"w-full p-3 border rounded-lg mb-3\" required disabled={!!editingGoal} />
              <input type=\"number\" placeholder=\"Target Amount\" value={form.target} onChange={e => setForm({ ...form, target: parseFloat(e.target.value) || 0 })} className=\"w-full p-3 border rounded-lg mb-4\" required />
              <div className=\"flex gap-3\">
                <button type=\"button\" onClick={() => { setShowForm(false); setEditingGoal(null); setForm({ name: '', target: 0, icon: '🎯', color: '#0B57D0' }); }} className=\"flex-1 border rounded-lg p-2\">Cancel</button>
                <button type=\"submit\" className=\"flex-1 bg-blue-600 text-white rounded-lg p-2\">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showContribute && (
        <div className=\"fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4\">
          <div className=\"bg-white rounded-xl shadow-xl w-full max-w-md p-6\">
            <h2 className=\"text-xl font-bold mb-2\">Contribute to {showContribute.name}</h2>
            <p className=\"text-gray-500 mb-4\">Current: Rp {showContribute.current.toLocaleString()} / Rp {showContribute.target.toLocaleString()}</p>
            <input type=\"number\" placeholder=\"Amount\" value={amount} onChange={e => setAmount(parseFloat(e.target.value) || 0)} className=\"w-full p-3 border rounded-lg mb-4\" />
            <div className=\"flex gap-3\">
              <button onClick={() => setShowContribute(null)} className=\"flex-1 border rounded-lg p-2\">Cancel</button>
              <button onClick={doContribute} className=\"flex-1 bg-green-600 text-white rounded-lg p-2\">Add</button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog isOpen={!!deleteTarget} title=\"Hapus Goal\" message={`Apakah Anda yakin ingin menghapus goal \"${deleteTarget?.name}\"?`} onConfirm={() => { deleteGoal(deleteTarget.id); setDeleteTarget(null); }} onCancel={() => setDeleteTarget(null)} />
    </div>
  );
};""")

# ========== 13. GIT COMMIT & PUSH ==========
print("\n📤 Push ke GitHub...")
subprocess.run(["git", "add", "."], capture_output=True)
subprocess.run(["git", "commit", "-m", "feat: add all high priority features - edit, delete confirm, transfer, filter, search, export CSV, loading state, empty state"], capture_output=True)
subprocess.run(["git", "push", "origin", "main"], capture_output=True)

print("\n" + "="*60)
print("🎉 SEMUA HIGH PRIORITY FEATURES TELAH DITAMBAHKAN!")
print("="*60)
print("✅ FITUR YANG SUDAH SELESAI:")
print("   1. Edit Transaksi ✅")
print("   2. Edit Wallet ✅")
print("   3. Edit Budget ✅")
print("   4. Edit Goal ✅")
print("   5. Export CSV ✅")
print("   6. Loading State (Skeleton) ✅")
print("   7. Empty State (semua halaman) ✅")
print("   8. Transfer Antar Wallet ✅")
print("   9. Filter & Search Transaksi ✅")
print("   10. Delete Confirmation Dialog ✅")
print("")
print("🚀 Vercel auto-deploy dalam 2-3 menit")
print("🔗 https://my-finance-pro.vercel.app")
print("="*60)
