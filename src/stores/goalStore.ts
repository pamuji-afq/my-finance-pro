import { create } from 'zustand';
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
}), { name: 'goals' }));