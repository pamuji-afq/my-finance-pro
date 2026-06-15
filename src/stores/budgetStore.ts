import { create } from 'zustand';
import { persist } from 'zustand/middleware';
export const useBudgetStore = create(persist((set, get) => ({
  budgets: [
    { id: '1', category: 'Food', amount: 2000000, spent: 650000, month: '2026-06' },
    { id: '2', category: 'Transport', amount: 1000000, spent: 300000, month: '2026-06' },
  ],
  addBudget: (b) => set(s => ({ budgets: [...s.budgets, { ...b, id: Date.now().toString(), spent: 0 }] })),
  updateSpent: (cat, amt) => set(s => ({ budgets: s.budgets.map(b => b.category === cat ? { ...b, spent: b.spent + amt } : b) })),
}), { name: 'budgets' }));