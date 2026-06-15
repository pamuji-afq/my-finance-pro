import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface RecurringTransaction {
  id: string;
  walletId: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  desc: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
  nextDate: string;
  endDate?: string;
  active: boolean;
}

interface RecurringState {
  recurring: RecurringTransaction[];
  addRecurring: (tx: Omit<RecurringTransaction, 'id'>) => void;
  updateRecurring: (id: string, updates: Partial<RecurringTransaction>) => void;
  deleteRecurring: (id: string) => void;
  getPending: () => RecurringTransaction[];
}

export const useRecurringStore = create(persist((set, get) => ({
  recurring: [
    { id: '1', walletId: '1', amount: 49000, type: 'expense', category: 'Subscription', desc: 'Netflix', frequency: 'monthly', nextDate: '2026-07-12', active: true },
    { id: '2', walletId: '1', amount: 150000, type: 'expense', category: 'Bills', desc: 'Listrik', frequency: 'monthly', nextDate: '2026-07-20', active: true },
  ],
  addRecurring: (tx) => set(s => ({ recurring: [...s.recurring, { ...tx, id: Date.now().toString() }] })),
  updateRecurring: (id, updates) => set(s => ({ recurring: s.recurring.map(r => r.id === id ? { ...r, ...updates } : r) })),
  deleteRecurring: (id) => set(s => ({ recurring: s.recurring.filter(r => r.id !== id) })),
  getPending: () => {
    const today = new Date().toISOString().slice(0,10);
    return get().recurring.filter(r => r.active && r.nextDate <= today);
  },
}), { name: 'recurring' }));