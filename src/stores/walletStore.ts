import { create } from 'zustand';
import { persist } from 'zustand/middleware';
export const useWalletStore = create(persist((set, get) => ({
  wallets: [{ id: '1', name: 'Tunai', balance: 12500000 }, { id: '2', name: 'BCA', balance: 5000000 }],
  activeWalletId: '1',
  addWallet: (w) => set(s => ({ wallets: [...s.wallets, { ...w, id: Date.now().toString() }] })),
  updateBalance: (id, amt) => set(s => ({ wallets: s.wallets.map(w => w.id === id ? { ...w, balance: w.balance + amt } : w) })),
  deleteWallet: (id) => set(s => ({ wallets: s.wallets.filter(w => w.id !== id) })),
  setActiveWallet: (id) => set({ activeWalletId: id }),
}), { name: 'wallets' }));