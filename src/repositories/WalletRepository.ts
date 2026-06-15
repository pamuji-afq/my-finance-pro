import { supabase } from '../integrations/supabase';
import type { Wallet } from '../domains/wallet/Wallet';

export class WalletRepository {
  async findByUserId(userId: string): Promise<Wallet[]> {
    const { data, error } = await supabase
      .from('wallets')
      .select('*')
      .eq('user_id', userId)
      .eq('is_archived', false)
      .order('created_at', { ascending: true });
    if (error) throw new Error(`Failed to fetch wallets: ${error.message}`);
    return data || [];
  }

  async findById(id: string): Promise<Wallet | null> {
    const { data, error } = await supabase
      .from('wallets')
      .select('*')
      .eq('id', id)
      .single();
    if (error) return null;
    return data;
  }

  async create(wallet: Omit<Wallet, 'id' | 'createdAt' | 'updatedAt'>): Promise<Wallet> {
    const { data, error } = await supabase
      .from('wallets')
      .insert({
        name: wallet.name,
        balance: wallet.balance,
        currency: wallet.currency,
        user_id: wallet.userId,
      })
      .select()
      .single();
    if (error) throw new Error(`Failed to create wallet: ${error.message}`);
    return data;
  }

  async update(id: string, updates: Partial<Wallet>): Promise<Wallet> {
    const { data, error } = await supabase
      .from('wallets')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw new Error(`Failed to update wallet: ${error.message}`);
    return data;
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('wallets')
      .update({ is_archived: true })
      .eq('id', id);
    if (error) throw new Error(`Failed to delete wallet: ${error.message}`);
  }

  async updateBalance(id: string, amount: number): Promise<void> {
    const { error } = await supabase.rpc('update_wallet_balance', {
      wallet_id: id,
      amount_delta: amount,
    });
    if (error) throw new Error(`Failed to update balance: ${error.message}`);
  }
}

export const walletRepository = new WalletRepository();