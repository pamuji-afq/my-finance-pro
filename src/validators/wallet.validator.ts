import { z } from 'zod';

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
export type TransferInput = z.infer<typeof transferSchema>;