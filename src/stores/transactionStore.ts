import { create } from 'zustand';
import { persist } from 'zustand/middleware';
export const useTransactionStore = create(persist((set, get) => ({
  transactions: [
    { id: '1', walletId: '1', amount: 5000000, type: 'income', category: 'Salary', desc: 'Gaji', date: '2026-06-13' },
    { id: '2', walletId: '1', amount: 150000, type: 'expense', category: 'Food', desc: 'Belanja', date: '2026-06-14' },
  ],
  addTransaction: (tx) => set(s => ({ transactions: [...s.transactions, { ...tx, id: Date.now().toString() }] })),
  deleteTransaction: (id) => set(s => ({ transactions: s.transactions.filter(t => t.id !== id) })),
}), { name: 'transactions' }));