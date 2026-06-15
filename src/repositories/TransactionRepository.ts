import { supabase } from '../integrations/supabase';
import type { Transaction, TransactionFilter } from '../domains/transaction/Transaction';

export class TransactionRepository {
  async findByUserId(userId: string, filter?: TransactionFilter): Promise<Transaction[]> {
    let query = supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false });

    if (filter?.startDate) query = query.gte('date', filter.startDate);
    if (filter?.endDate) query = query.lte('date', filter.endDate);
    if (filter?.walletId) query = query.eq('wallet_id', filter.walletId);
    if (filter?.category) query = query.eq('category', filter.category);
    if (filter?.type && filter.type !== 'all') query = query.eq('type', filter.type);
    if (filter?.minAmount) query = query.gte('amount', filter.minAmount);
    if (filter?.maxAmount) query = query.lte('amount', filter.maxAmount);
    if (filter?.search) query = query.ilike('description', `%${filter.search}%`);

    const { data, error } = await query;
    if (error) throw new Error(`Failed to fetch transactions: ${error.message}`);
    return data || [];
  }

  async findById(id: string): Promise<Transaction | null> {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('id', id)
      .single();
    if (error) return null;
    return data;
  }

  async create(transaction: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>): Promise<Transaction> {
    const { data, error } = await supabase
      .from('transactions')
      .insert({
        wallet_id: transaction.walletId,
        amount: transaction.amount,
        type: transaction.type,
        category: transaction.category,
        description: transaction.description,
        date: transaction.date,
        note: transaction.note,
        user_id: transaction.userId,
      })
      .select()
      .single();
    if (error) throw new Error(`Failed to create transaction: ${error.message}`);
    return data;
  }

  async update(id: string, updates: Partial<Transaction>): Promise<Transaction> {
    const { data, error } = await supabase
      .from('transactions')
      .update({
        amount: updates.amount,
        category: updates.category,
        description: updates.description,
        date: updates.date,
        note: updates.note,
      })
      .eq('id', id)
      .select()
      .single();
    if (error) throw new Error(`Failed to update transaction: ${error.message}`);
    return data;
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id);
    if (error) throw new Error(`Failed to delete transaction: ${error.message}`);
  }

  async getSummary(userId: string, startDate: string, endDate: string): Promise<{ income: number; expense: number }> {
    const { data, error } = await supabase
      .from('transactions')
      .select('type, amount')
      .eq('user_id', userId)
      .gte('date', startDate)
      .lte('date', endDate);
    if (error) throw new Error(`Failed to get summary: ${error.message}`);
    const income = data?.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0) || 0;
    const expense = data?.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0) || 0;
    return { income, expense };
  }
}

export const transactionRepository = new TransactionRepository();