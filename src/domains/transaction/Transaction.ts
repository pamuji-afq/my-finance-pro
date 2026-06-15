export interface Transaction {
  id: string;
  userId: string;
  walletId: string;
  amount: number;
  type: 'income' | 'expense' | 'transfer';
  category: string;
  description: string;
  date: string;
  note?: string;
  tags?: string[];
  attachment?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TransactionFilter {
  startDate?: string;
  endDate?: string;
  walletId?: string;
  category?: string;
  type?: 'income' | 'expense' | 'all';
  minAmount?: number;
  maxAmount?: number;
  search?: string;
}