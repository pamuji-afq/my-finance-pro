import { z } from 'zod';

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
export type BudgetUpdateInput = z.infer<typeof budgetUpdateSchema>;