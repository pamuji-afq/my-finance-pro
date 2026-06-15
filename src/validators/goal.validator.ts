import { z } from 'zod';

export const goalSchema = z.object({
  name: z.string().min(1, 'Nama goal harus diisi').max(100, 'Nama goal maksimal 100 karakter'),
  targetAmount: z.number().positive('Target harus lebih dari 0'),
  deadline: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Format tanggal tidak valid').optional(),
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
export type ContributionInput = z.infer<typeof contributionSchema>;