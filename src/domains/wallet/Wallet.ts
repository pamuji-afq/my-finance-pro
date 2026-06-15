export interface Wallet {
  id: string;
  userId: string;
  name: string;
  balance: number;
  currency: string;
  color?: string;
  icon?: string;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface WalletTransaction {
  id: string;
  walletId: string;
  amount: number;
  type: 'income' | 'expense' | 'transfer';
  category: string;
  description: string;
  date: string;
  note?: string;
  createdAt: string;
}