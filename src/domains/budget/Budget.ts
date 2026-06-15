export interface Budget {
  id: string;
  userId: string;
  category: string;
  amount: number;
  spent: number;
  period: 'daily' | 'weekly' | 'monthly' | 'yearly';
  month: string;
  year: number;
  alerts: boolean;
  alertThreshold: number;
  createdAt: string;
  updatedAt: string;
}

export interface BudgetAlert {
  budgetId: string;
  category: string;
  spent: number;
  budget: number;
  percentage: number;
  isExceeded: boolean;
}