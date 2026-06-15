import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Bill {
  id: string;
  name: string;
  amount: number;
  dueDate: string;
  category: string;
  paid: boolean;
  reminderDays: number;
}

interface BillState {
  bills: Bill[];
  addBill: (bill: Omit<Bill, 'id'>) => void;
  updateBill: (id: string, updates: Partial<Bill>) => void;
  deleteBill: (id: string) => void;
  getUpcoming: (days?: number) => Bill[];
}

export const useBillStore = create(persist((set, get) => ({
  bills: [
    { id: '1', name: 'Listrik', amount: 150000, dueDate: '2026-06-20', category: 'Bills', paid: false, reminderDays: 3 },
    { id: '2', name: 'Air', amount: 75000, dueDate: '2026-06-25', category: 'Bills', paid: false, reminderDays: 3 },
    { id: '3', name: 'Internet', amount: 350000, dueDate: '2026-06-28', category: 'Bills', paid: false, reminderDays: 3 },
  ],
  addBill: (bill) => set(s => ({ bills: [...s.bills, { ...bill, id: Date.now().toString() }] })),
  updateBill: (id, updates) => set(s => ({ bills: s.bills.map(b => b.id === id ? { ...b, ...updates } : b) })),
  deleteBill: (id) => set(s => ({ bills: s.bills.filter(b => b.id !== id) })),
  getUpcoming: (days = 7) => {
    const today = new Date();
    const upcoming = get().bills.filter(b => {
      if (b.paid) return false;
      const due = new Date(b.dueDate);
      const diff = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      return diff >= 0 && diff <= days;
    });
    return upcoming.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  },
}), { name: 'bills' }));