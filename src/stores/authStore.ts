import { create } from 'zustand';
import { persist } from 'zustand/middleware';
export const useAuthStore = create(persist((set) => ({
  user: null,
  login: async (email, pwd) => { set({ user: { id: '1', email } }); return true; },
  logout: () => set({ user: null }),
}), { name: 'auth' }));