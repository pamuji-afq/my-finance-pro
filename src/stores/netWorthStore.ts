import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Asset {
  id: string;
  name: string;
  value: number;
  type: 'cash' | 'bank' | 'investment' | 'property' | 'vehicle';
}

export interface Liability {
  id: string;
  name: string;
  value: number;
  type: 'loan' | 'mortgage' | 'credit' | 'personal';
  interestRate?: number;
}

interface NetWorthState {
  assets: Asset[];
  liabilities: Liability[];
  addAsset: (asset: Omit<Asset, 'id'>) => void;
  updateAsset: (id: string, value: number) => void;
  deleteAsset: (id: string) => void;
  addLiability: (liability: Omit<Liability, 'id'>) => void;
  updateLiability: (id: string, value: number) => void;
  deleteLiability: (id: string) => void;
  getNetWorth: () => number;
}

export const useNetWorthStore = create(persist((set, get) => ({
  assets: [
    { id: '1', name: 'Tabungan BCA', value: 5000000, type: 'bank' },
    { id: '2', name: 'Tunai', value: 12500000, type: 'cash' },
    { id: '3', name: 'Emas', value: 10000000, type: 'investment' },
  ],
  liabilities: [
    { id: '1', name: 'KPR Rumah', value: 350000000, type: 'mortgage', interestRate: 8.5 },
    { id: '2', name: 'Kredit Mobil', value: 150000000, type: 'loan', interestRate: 9 },
  ],
  addAsset: (asset) => set(s => ({ assets: [...s.assets, { ...asset, id: Date.now().toString() }] })),
  updateAsset: (id, value) => set(s => ({ assets: s.assets.map(a => a.id === id ? { ...a, value } : a) })),
  deleteAsset: (id) => set(s => ({ assets: s.assets.filter(a => a.id !== id) })),
  addLiability: (liability) => set(s => ({ liabilities: [...s.liabilities, { ...liability, id: Date.now().toString() }] })),
  updateLiability: (id, value) => set(s => ({ liabilities: s.liabilities.map(l => l.id === id ? { ...l, value } : l) })),
  deleteLiability: (id) => set(s => ({ liabilities: s.liabilities.filter(l => l.id !== id) })),
  getNetWorth: () => {
    const totalAssets = get().assets.reduce((sum, a) => sum + a.value, 0);
    const totalLiabilities = get().liabilities.reduce((sum, l) => sum + l.value, 0);
    return totalAssets - totalLiabilities;
  },
}), { name: 'networth' }));