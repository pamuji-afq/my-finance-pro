import { create } from 'zustand';
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
}), { name: 'budgets' }));