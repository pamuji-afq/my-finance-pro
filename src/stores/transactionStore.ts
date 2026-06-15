import { create } from 'zustand';
import { persist } from 'zustand/middleware';
export const useTransactionStore = create(persist((set, get) => ({
  transactions: [
    { id: '1', walletId: '1', amount: 5000000, type: 'income', category: 'Salary', desc: 'Gaji Bulanan', date: '2026-06-13' },
    { id: '2', walletId: '1', amount: 150000, type: 'expense', category: 'Food', desc: 'Belanja', date: '2026-06-14' },
    { id: '3', walletId: '2', amount: 200000, type: 'expense', category: 'Transport', desc: 'Bensin', date: '2026-06-12' },
  ],
  addTransaction: (tx) => set(s => ({ transactions: [...s.transactions, { ...tx, id: Date.now().toString() }] })),
  updateTransaction: (id, updates) => set(s => ({ transactions: s.transactions.map(t => t.id === id ? { ...t, ...updates } : t) })),
  deleteTransaction: (id) => set(s => ({ transactions: s.transactions.filter(t => t.id !== id) })),
}), { name: 'transactions' }));