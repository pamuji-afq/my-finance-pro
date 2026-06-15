import { create } from 'zustand';
import { useTransactionStore } from './transactionStore';
import { useWalletStore } from './walletStore';
import { useGoalStore } from './goalStore';

export interface SearchResult {
  id: string;
  type: 'transaction' | 'wallet' | 'goal';
  title: string;
  subtitle: string;
  icon: string;
  link: string;
}

interface SearchState {
  query: string;
  results: SearchResult[];
  search: (q: string) => void;
  clear: () => void;
}

export const useSearchStore = create<SearchState>((set, get) => ({
  query: '',
  results: [],
  search: (q) => {
    if (!q.trim()) {
      set({ query: '', results: [] });
      return;
    }
    const lowerQ = q.toLowerCase();
    const transactions = useTransactionStore.getState().transactions;
    const wallets = useWalletStore.getState().wallets;
    const goals = useGoalStore.getState().goals;
    
    const results: SearchResult[] = [];
    
    // Search transactions
    transactions.filter(t => t.desc.toLowerCase().includes(lowerQ) || t.category.toLowerCase().includes(lowerQ))
      .forEach(t => results.push({
        id: t.id,
        type: 'transaction',
        title: t.desc,
        subtitle: `${t.category} • ${t.type === 'income' ? '+' : '-'}Rp ${t.amount.toLocaleString()}`,
        icon: t.type === 'income' ? '💰' : '💸',
        link: '/transactions',
      }));
    
    // Search wallets
    wallets.filter(w => w.name.toLowerCase().includes(lowerQ))
      .forEach(w => results.push({
        id: w.id,
        type: 'wallet',
        title: w.name,
        subtitle: `Balance: Rp ${w.balance.toLocaleString()}`,
        icon: '👛',
        link: '/wallets',
      }));
    
    // Search goals
    goals.filter(g => g.name.toLowerCase().includes(lowerQ))
      .forEach(g => results.push({
        id: g.id,
        type: 'goal',
        title: g.name,
        subtitle: `${((g.current / g.target) * 100).toFixed(0)}% achieved`,
        icon: '🎯',
        link: '/goals',
      }));
    
    set({ query: q, results: results.slice(0, 10) });
  },
  clear: () => set({ query: '', results: [] }),
}));