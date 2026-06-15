import { z } from 'zod';

export const transactionSchema = z.object({
  walletId: z.string().uuid('Wallet tidak valid'),
  amount: z.number().positive('Jumlah harus lebih dari 0'),
  type: z.enum(['income', 'expense', 'transfer']),
  category: z.string().min(1, 'Kategori harus diisi'),
  description: z.string().min(1, 'Deskripsi harus diisi').max(100, 'Deskripsi maksimal 100 karakter'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Format tanggal tidak valid'),
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
export type TransactionFilterInput = z.infer<typeof transactionFilterSchema>;