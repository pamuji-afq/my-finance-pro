import type { Transaction } from '../../domains/transaction/Transaction';

export class CashflowService {
  calculateTotalIncome(transactions: Transaction[]): number {
    return transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
  }

  calculateTotalExpense(transactions: Transaction[]): number {
    return transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
  }

  calculateSavingRate(income: number, expense: number): number {
    if (income === 0) return 0;
    return ((income - expense) / income) * 100;
  }

  calculateMonthlyCashflow(transactions: Transaction[]): Record<string, { income: number; expense: number }> {
    const result: Record<string, { income: number; expense: number }> = {};
    transactions.forEach(t => {
      const month = t.date.slice(0, 7);
      if (!result[month]) result[month] = { income: 0, expense: 0 };
      if (t.type === 'income') result[month].income += t.amount;
      else result[month].expense += t.amount;
    });
    return result;
  }

  getTopCategories(transactions: Transaction[], limit: number = 5): { category: string; amount: number }[] {
    const expenseByCategory: Record<string, number> = {};
    transactions
      .filter(t => t.type === 'expense')
      .forEach(t => {
        expenseByCategory[t.category] = (expenseByCategory[t.category] || 0) + t.amount;
      });
    return Object.entries(expenseByCategory)
      .map(([category, amount]) => ({ category, amount }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, limit);
  }
}

export const cashflowService = new CashflowService();