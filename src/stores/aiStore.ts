import { create } from 'zustand';

interface AIState {
  loading: boolean;
  advice: string | null;
  getAdvice: (prompt: string, context?: any) => Promise<string>;
}

// Mock AI - Replace with actual Gemini API
const mockAIResponse = (prompt: string, context?: any): string => {
  if (prompt.includes('analisa') || prompt.includes('keuangan')) {
    const income = context?.income || 0;
    const expense = context?.expense || 0;
    const saving = income - expense;
    const savingRate = income > 0 ? (saving / income * 100).toFixed(0) : 0;
    return `📊 *Analisis Keuangan Anda*

• Pemasukan bulan ini: Rp ${income.toLocaleString()}
• Pengeluaran: Rp ${expense.toLocaleString()}
• Tabungan: Rp ${saving.toLocaleString()} (${savingRate}% dari pemasukan)

💡 *Saran:* ${savingRate >= 20 ? 'Tabungan Anda sudah baik! Pertahankan.' : 'Coba kurangi pengeluaran tidak penting untuk meningkatkan tabungan.'}`;
  }
  if (prompt.includes('invest') || prompt.includes('investasi')) {
    return `📈 *Rekomendasi Investasi*

Untuk pemula, saya sarankan:
1. Reksa Dana Pasar Uang (risiko rendah)
2. Deposito Berjangka
3. Emas batangan

Mulai dengan nominal kecil dan konsisten setiap bulan.`;
  }
  if (prompt.includes('budget')) {
    return `💰 *Saran Budget*

Aturan 50/30/20:
• 50% untuk kebutuhan pokok
• 30% untuk keinginan
• 20% untuk tabungan & investasi

Sesuaikan dengan kondisi keuangan Anda.`;
  }
  return `🤖 *AI Financial Advisor*

Terima kasih atas pertanyaan Anda. Untuk saran yang lebih spesifik, silakan tanyakan tentang:
- Analisis keuangan bulanan
- Tips investasi
- Strategi budget
- Rencana pensiun`;
};

export const useAIStore = create<AIState>((set, get) => ({
  loading: false,
  advice: null,
  getAdvice: async (prompt, context) => {
    set({ loading: true });
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    const advice = mockAIResponse(prompt, context);
    set({ loading: false, advice });
    return advice;
  },
}));