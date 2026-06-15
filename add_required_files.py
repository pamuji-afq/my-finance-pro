import os
import json
import subprocess

BASE = os.getcwd()

def write(path, content):
    full = os.path.join(BASE, path)
    os.makedirs(os.path.dirname(full), exist_ok=True)
    with open(full, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"✅ {path}")

print("🚀 MENAMBAHKAN FILE WAJIB: Validators, Services, Repositories, Domains, Migrations...")

# ========== 1. DOMAINS (Type definitions) ==========
write("src/domains/user/User.ts", """export interface User {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserSettings {
  userId: string;
  theme: 'light' | 'dark' | 'system';
  currency: string;
  notificationEnabled: boolean;
}""")

write("src/domains/wallet/Wallet.ts", """export interface Wallet {
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
}""")

write("src/domains/transaction/Transaction.ts", """export interface Transaction {
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
}""")

write("src/domains/budget/Budget.ts", """export interface Budget {
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
}""")

write("src/domains/goal/Goal.ts", """export interface Goal {
  id: string;
  userId: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline?: string;
  icon?: string;
  color?: string;
  notes?: string;
  isCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface GoalContribution {
  id: string;
  goalId: string;
  amount: number;
  date: string;
  note?: string;
}""")

write("src/domains/index.ts", """export * from './user/User';
export * from './wallet/Wallet';
export * from './transaction/Transaction';
export *-from './budget/Budget';
export * from './goal/Goal';""")

# ========== 2. VALIDATORS (Zod schemas) ==========
write("src/validators/wallet.validator.ts", """import { z } from 'zod';

export const walletSchema = z.object({
  name: z.string().min(1, 'Nama wallet harus diisi').max(50, 'Nama wallet maksimal 50 karakter'),
  balance: z.number().min(0, 'Saldo tidak boleh negatif').max(999999999999, 'Saldo terlalu besar'),
  currency: z.string().default('IDR'),
  color: z.string().optional(),
  icon: z.string().optional(),
});

export const transferSchema = z.object({
  fromWalletId: z.string().uuid('Wallet sumber tidak valid'),
  toWalletId: z.string().uuid('Wallet tujuan tidak valid'),
  amount: z.number().positive('Jumlah transfer harus positif'),
  note: z.string().max(200, 'Catatan maksimal 200 karakter').optional(),
}).refine(data => data.fromWalletId !== data.toWalletId, {
  message: 'Wallet sumber dan tujuan tidak boleh sama',
  path: ['toWalletId'],
});

export type WalletInput = z.infer<typeof walletSchema>;
export type TransferInput = z.infer<typeof transferSchema>;""")

write("src/validators/transaction.validator.ts", """import { z } from 'zod';

export const transactionSchema = z.object({
  walletId: z.string().uuid('Wallet tidak valid'),
  amount: z.number().positive('Jumlah harus lebih dari 0'),
  type: z.enum(['income', 'expense', 'transfer']),
  category: z.string().min(1, 'Kategori harus diisi'),
  description: z.string().min(1, 'Deskripsi harus diisi').max(100, 'Deskripsi maksimal 100 karakter'),
  date: z.string().regex(/^\\d{4}-\\d{2}-\\d{2}$/, 'Format tanggal tidak valid'),
  note: z.string().max(500, 'Catatan maksimal 500 karakter').optional(),
  tags: z.array(z.string()).optional(),
});

export const transactionFilterSchema = z.object({
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  walletId: z.string().optional(),
  category: z.string().optional(),
  type: z.enum(['income', 'expense', 'all']).default('all'),
  minAmount: z.number().min(0).optional(),
  maxAmount: z.number().min(0).optional(),
  search: z.string().max(100).optional(),
});

export type TransactionInput = z.infer<typeof transactionSchema>;
export type TransactionFilterInput = z.infer<typeof transactionFilterSchema>;""")

write("src/validators/budget.validator.ts", """import { z } from 'zod';

export const budgetSchema = z.object({
  category: z.string().min(1, 'Kategori harus diisi'),
  amount: z.number().positive('Jumlah budget harus positif').max(999999999, 'Budget terlalu besar'),
  period: z.enum(['daily', 'weekly', 'monthly', 'yearly']).default('monthly'),
  alerts: z.boolean().default(true),
  alertThreshold: z.number().min(0).max(100).default(80),
});

export const budgetUpdateSchema = z.object({
  amount: z.number().positive().optional(),
  alerts: z.boolean().optional(),
  alertThreshold: z.number().min(0).max(100).optional(),
});

export type BudgetInput = z.infer<typeof budgetSchema>;
export type BudgetUpdateInput = z.infer<typeof budgetUpdateSchema>;""")

write("src/validators/goal.validator.ts", """import { z } from 'zod';

export const goalSchema = z.object({
  name: z.string().min(1, 'Nama goal harus diisi').max(100, 'Nama goal maksimal 100 karakter'),
  targetAmount: z.number().positive('Target harus lebih dari 0'),
  deadline: z.string().regex(/^\\d{4}-\\d{2}-\\d{2}$/, 'Format tanggal tidak valid').optional(),
  icon: z.string().optional(),
  color: z.string().optional(),
  notes: z.string().max(1000, 'Catatan maksimal 1000 karakter').optional(),
});

export const contributionSchema = z.object({
  goalId: z.string().uuid('Goal tidak valid'),
  amount: z.number().positive('Jumlah kontribusi harus positif'),
  note: z.string().max(200).optional(),
});

export type GoalInput = z.infer<typeof goalSchema>;
export type ContributionInput = z.infer<typeof contributionSchema>;""")

write("src/validators/index.ts", """export * from './wallet.validator';
export * from './transaction.validator';
export * from './budget.validator';
export * from './goal.validator';""")

# ========== 3. REPOSITORIES (Data access layer) ==========
write("src/repositories/WalletRepository.ts", """import { supabase } from '../integrations/supabase';
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

export const walletRepository = new WalletRepository();""")

write("src/repositories/TransactionRepository.ts", """import { supabase } from '../integrations/supabase';
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

export const transactionRepository = new TransactionRepository();""")

write("src/repositories/index.ts", """export * from './WalletRepository';
export * from './TransactionRepository';""")

# ========== 4. SERVICES (Business logic) ==========
write("src/services/analytics/CashflowService.ts", """import type { Transaction } from '../../domains/transaction/Transaction';

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

export const cashflowService = new CashflowService();""")

write("src/services/forecast/ForecastService.ts", """export class ForecastService {
  calculateMovingAverage(data: number[], windowSize: number = 3): number[] {
    const result: number[] = [];
    for (let i = 0; i <= data.length - windowSize; i++) {
      const window = data.slice(i, i + windowSize);
      const avg = window.reduce((a, b) => a + b, 0) / windowSize;
      result.push(avg);
    }
    return result;
  }

  forecastNextValue(data: number[], method: 'average' | 'trend' = 'average'): number {
    if (data.length === 0) return 0;
    if (method === 'average') {
      return data.reduce((a, b) => a + b, 0) / data.length;
    }
    // Simple linear trend
    const n = data.length;
    let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
    for (let i = 0; i < n; i++) {
      sumX += i;
      sumY += data[i];
      sumXY += i * data[i];
      sumX2 += i * i;
    }
    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;
    return slope * n + intercept;
  }

  predictNextMonthExpense(monthlyExpenses: number[]): number {
    if (monthlyExpenses.length === 0) return 0;
    const trend = this.forecastNextValue(monthlyExpenses, 'trend');
    return Math.max(0, trend);
  }
}

export const forecastService = new ForecastService();""")

write("src/services/index.ts", """export * from './analytics/CashflowService';
export * from './forecast/ForecastService';""")

# ========== 5. SUPABASE MIGRATIONS ==========
write("supabase/migrations/001_create_users.sql", """-- Create users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  currency TEXT DEFAULT 'IDR',
  theme TEXT DEFAULT 'light',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Function to handle new user
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();""")

write("supabase/migrations/002_create_wallets.sql", """-- Create wallets table
CREATE TABLE IF NOT EXISTS public.wallets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  balance BIGINT NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'IDR',
  color TEXT,
  icon TEXT,
  is_archived BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.wallets ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own wallets" ON public.wallets
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own wallets" ON public.wallets
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own wallets" ON public.wallets
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own wallets" ON public.wallets
  FOR DELETE USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX idx_wallets_user_id ON public.wallets(user_id);
CREATE INDEX idx_wallets_is_archived ON public.wallets(is_archived);

-- Update wallet balance function
CREATE OR REPLACE FUNCTION update_wallet_balance(wallet_id UUID, amount_delta BIGINT)
RETURNS VOID AS $$
BEGIN
  UPDATE public.wallets
  SET balance = balance + amount_delta,
      updated_at = NOW()
  WHERE id = wallet_id;
END;
$$ LANGUAGE plpgsql;""")

write("supabase/migrations/003_create_transactions.sql", """-- Create transactions table
CREATE TABLE IF NOT EXISTS public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  wallet_id UUID NOT NULL REFERENCES public.wallets(id) ON DELETE CASCADE,
  amount BIGINT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('income', 'expense', 'transfer')),
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  date DATE NOT NULL,
  note TEXT,
  tags TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own transactions" ON public.transactions
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own transactions" ON public.transactions
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own transactions" ON public.transactions
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own transactions" ON public.transactions
  FOR DELETE USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX idx_transactions_user_id ON public.transactions(user_id);
CREATE INDEX idx_transactions_wallet_id ON public.transactions(wallet_id);
CREATE INDEX idx_transactions_date ON public.transactions(date);
CREATE INDEX idx_transactions_category ON public.transactions(category);
CREATE INDEX idx_transactions_type ON public.transactions(type);""")

write("supabase/migrations/004_create_budgets.sql", """CREATE TABLE IF NOT EXISTS public.budgets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  amount BIGINT NOT NULL,
  spent BIGINT DEFAULT 0,
  period TEXT DEFAULT 'monthly',
  month TEXT NOT NULL,
  year INT NOT NULL,
  alerts BOOLEAN DEFAULT TRUE,
  alert_threshold INT DEFAULT 80,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.budgets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own budgets" ON public.budgets
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own budgets" ON public.budgets
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own budgets" ON public.budgets
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own budgets" ON public.budgets
  FOR DELETE USING (auth.uid() = user_id);

CREATE INDEX idx_budgets_user_id ON public.budgets(user_id);
CREATE INDEX idx_budgets_month ON public.budgets(month);""")

write("supabase/migrations/005_create_goals.sql", """CREATE TABLE IF NOT EXISTS public.goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  target_amount BIGINT NOT NULL,
  current_amount BIGINT DEFAULT 0,
  deadline DATE,
  icon TEXT,
  color TEXT,
  notes TEXT,
  is_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own goals" ON public.goals
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own goals" ON public.goals
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own goals" ON public.goals
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own goals" ON public.goals
  FOR DELETE USING (auth.uid() = user_id);

CREATE INDEX idx_goals_user_id ON public.goals(user_id);
CREATE INDEX idx_goals_is_completed ON public.goals(is_completed);""")

write("supabase/migrations/seed.sql", """-- Seed data for testing
INSERT INTO public.wallets (user_id, name, balance, currency, color)
SELECT 
  id,
  'Tunai',
  12500000,
  'IDR',
  '#0B57D0'
FROM auth.users 
WHERE email = 'demo@example.com'
ON CONFLICT DO NOTHING;

INSERT INTO public.wallets (user_id, name, balance, currency, color)
SELECT 
  id,
  'BCA',
  5000000,
  'IDR',
  '#34A853'
FROM auth.users 
WHERE email = 'demo@example.com'
ON CONFLICT DO NOTHING;""")

# ========== 6. INSTALL ZOD ==========
package_json_path = os.path.join(BASE, "package.json")
if os.path.exists(package_json_path):
    with open(package_json_path, 'r') as f:
        pkg = json.load(f)
    if 'dependencies' not in pkg:
        pkg['dependencies'] = {}
    pkg['dependencies']['zod'] = '^3.22.4'
    with open(package_json_path, 'w') as f:
        json.dump(pkg, f, indent=2)
    print("✅ Added zod to package.json")

# ========== 7. GIT COMMIT & PUSH ==========
print("\n📤 Push ke GitHub...")
subprocess.run(["git", "add", "."], capture_output=True)
subprocess.run(["git", "commit", "-m", "feat: add required files - validators, services, repositories, domains, migrations"], capture_output=True)
subprocess.run(["git", "push", "origin", "main"], capture_output=True)

print("\n" + "="*60)
print("✅ FILE WAJIB TELAH DITAMBAHKAN!")
print("="*60)
print("")
print("📁 File yang ditambahkan:")
print("")
print("📂 src/domains/ (5 file)")
print("   - user/User.ts")
print("   - wallet/Wallet.ts")
print("   - transaction/Transaction.ts")
print("   - budget/Budget.ts")
print("   - goal/Goal.ts")
print("")
print("📂 src/validators/ (5 file)")
print("   - wallet.validator.ts (Zod schema)")
print("   - transaction.validator.ts")
print("   - budget.validator.ts")
print("   - goal.validator.ts")
print("")
print("📂 src/repositories/ (3 file)")
print("   - WalletRepository.ts")
print("   - TransactionRepository.ts")
print("")
print("📂 src/services/ (3 file)")
print("   - analytics/CashflowService.ts")
print("   - forecast/ForecastService.ts")
print("")
print("📂 supabase/migrations/ (6 file)")
print("   - 001_create_users.sql")
print("   - 002_create_wallets.sql")
print("   - 003_create_transactions.sql")
print("   - 004_create_budgets.sql")
print("   - 005_create_goals.sql")
print("   - seed.sql")
print("")
print("📦 Dependencies added: zod@^3.22.4")
print("")
print("🚀 Vercel akan auto-deploy dalam 2-3 menit")
print("="*60)
