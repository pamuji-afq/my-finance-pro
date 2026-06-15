import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useWalletStore = create(persist((set, get) => ({
  wallets: [
    { id: '1', name: 'Tunai', balance: 12500000, currency: 'IDR', color: '#0B57D0' },
    { id: '2', name: 'BCA', balance: 5000000, currency: 'IDR', color: '#34A853' },
    { id: '3', name: 'OVO', balance: 150000, currency: 'IDR', color: '#FB8C00' },
  ],
  activeWalletId: '1',
  loading: false,
  
  addWallet: (wallet) => set(s => ({ 
    wallets: [...s.wallets, { ...wallet, id: Date.now().toString() }] 
  })),
  
  updateWallet: (id, updates) => set(s => ({
    wallets: s.wallets.map(w => w.id === id ? { ...w, ...updates } : w)
  })),
  
  deleteWallet: (id) => set(s => ({ 
    wallets: s.wallets.filter(w => w.id !== id),
    activeWalletId: s.activeWalletId === id ? s.wallets[0]?.id || null : s.activeWalletId
  })),
  
  updateBalance: (id, amount) => set(s => ({
    wallets: s.wallets.map(w => w.id === id ? { ...w, balance: w.balance + amount } : w)
  })),
  
  setActiveWallet: (id) => set({ activeWalletId: id }),
  
  transfer: (fromId, toId, amount) => {
    const { wallets, updateBalance } = get();
    const fromWallet = wallets.find(w => w.id === fromId);
    const toWallet = wallets.find(w => w.id === toId);
    if (!fromWallet || !toWallet || fromWallet.balance < amount) return false;
    updateBalance(fromId, -amount);
    updateBalance(toId, amount);
    return true;
  },
}), { name: 'wallets' }));