-- Seed data for testing
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
ON CONFLICT DO NOTHING;