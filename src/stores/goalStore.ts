import { create } from 'zustand';
import { persist } from 'zustand/middleware';
export const useGoalStore = create(persist((set, get) => ({
  goals: [
    { id: '1', name: 'Dana Darurat', target: 30000000, current: 18000000 },
    { id: '2', name: 'Liburan', target: 5000000, current: 2000000 },
  ],
  addGoal: (g) => set(s => ({ goals: [...s.goals, { ...g, id: Date.now().toString(), current: 0 }] })),
  updateGoal: (id, target) => set(s => ({ goals: s.goals.map(g => g.id === id ? { ...g, target } : g) })),
  deleteGoal: (id) => set(s => ({ goals: s.goals.filter(g => g.id !== id) })),
  contribute: (id, amt) => set(s => ({ goals: s.goals.map(g => g.id === id ? { ...g, current: g.current + amt } : g) })),
}), { name: 'goals' }));