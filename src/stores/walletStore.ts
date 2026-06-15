import { create } from 'zustand';
import { persist } from 'zustand/middleware';
export const useWalletStore = create(persist((set, get) => ({
  wallets: [{ id: '1', name: 'Tunai', balance: 12500000, currency: 'IDR' }, { id: '2', name: 'BCA', balance: 5000000, currency: 'IDR' }, { id: '3', name: 'OVO', balance: 150000, currency: 'IDR' }],
  activeWalletId: '1',
  addWallet: (w) => set(s => ({ wallets: [...s.wallets, { ...w, id: Date.now().toString() }] })),
  updateWallet: (id, updates) => set(s => ({ wallets: s.wallets.map(w => w.id === id ? { ...w, ...updates } : w) })),
  deleteWallet: (id) => set(s => ({ wallets: s.wallets.filter(w => w.id !== id) })),
  updateBalance: (id, amt) => set(s => ({ wallets: s.wallets.map(w => w.id === id ? { ...w, balance: w.balance + amt } : w) })),
  setActiveWallet: (id) => set({ activeWalletId: id }),
}), { name: 'wallets' }));