-- Create wallets table
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
$$ LANGUAGE plpgsql;