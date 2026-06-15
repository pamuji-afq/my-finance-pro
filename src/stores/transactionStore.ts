import { create } from 'zustand';
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
}), { name: 'transactions' }));