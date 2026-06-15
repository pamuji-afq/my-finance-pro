import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface ExchangeRate {
  code: string;
  name: string;
  rate: number;
  symbol: string;
}

interface CurrencyState {
  baseCurrency: string;
  rates: ExchangeRate[];
  convert: (amount: number, from: string, to: string) => number;
  format: (amount: number, currency: string) => string;
}

const defaultRates: ExchangeRate[] = [
  { code: 'IDR', name: 'Indonesian Rupiah', rate: 1, symbol: 'Rp' },
  { code: 'USD', name: 'US Dollar', rate: 15200, symbol: '$' },
  { code: 'SGD', name: 'Singapore Dollar', rate: 11200, symbol: 'S$' },
  { code: 'MYR', name: 'Malaysian Ringgit', rate: 3400, symbol: 'RM' },
  { code: 'JPY', name: 'Japanese Yen', rate: 100, symbol: '¥' },
];

export const useCurrencyStore = create(persist((set, get) => ({
  baseCurrency: 'IDR',
  rates: defaultRates,
  setBaseCurrency: (currency: string) => set({ baseCurrency: currency }),
  updateRate: (code: string, rate: number) => set(s => ({ rates: s.rates.map(r => r.code === code ? { ...r, rate } : r) })),
  convert: (amount, from, to) => {
    const fromRate = get().rates.find(r => r.code === from)?.rate || 1;
    const toRate = get().rates.find(r => r.code === to)?.rate || 1;
    return (amount / fromRate) * toRate;
  },
  format: (amount, currency) => {
    const rate = get().rates.find(r => r.code === currency);
    if (!rate) return `${currency} ${amount.toLocaleString()}`;
    return `${rate.symbol} ${amount.toLocaleString()}`;
  },
}), { name: 'currency' }));