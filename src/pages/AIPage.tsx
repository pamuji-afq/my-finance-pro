import React, { useState } from 'react';
import { useAIStore } from '../stores/aiStore';
import { useTransactionStore } from '../stores/transactionStore';
import { useWalletStore } from '../stores/walletStore';

export const AIPage = () => {
  const { loading, advice, getAdvice } = useAIStore();
  const { transactions } = useTransactionStore();
  const { wallets } = useWalletStore();
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant', content: string }[]>([
    { role: 'assistant', content: 'Halo! Saya adalah AI Financial Advisor. Tanyakan tentang analisis keuangan, tips investasi, atau saran budget. Apa yang bisa saya bantu hari ini?' }
  ]);

  const currentMonth = new Date().toISOString().slice(0,7);
  const monthlyTx = transactions.filter(t => t.date.startsWith(currentMonth));
  const income = monthlyTx.filter(t=>t.type==='income').reduce((s,t)=>s+t.amount,0);
  const expense = monthlyTx.filter(t=>t.type==='expense').reduce((s,t)=>s+t.amount,0);
  const totalBalance = wallets.reduce((s,w)=>s+w.balance,0);

  const handleAsk = async () => {
    if (!prompt.trim()) return;
    const userMsg = { role: 'user' as const, content: prompt };
    setMessages(prev => [...prev, userMsg]);
    const context = { income, expense, totalBalance, transactions: transactions.slice(0, 10) };
    const response = await getAdvice(prompt, context);
    setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    setPrompt('');
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6" style={{color: 'var(--on-surface)'}}>🤖 AI Financial Advisor</h1>
      <div className="card mb-6" style={{height: '400px', overflowY: 'auto'}}>
        {messages.map((msg, idx) => (
          <div key={idx} className={`mb-4 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
            <div className={`inline-block p-3 rounded-lg max-w-[80%] ${msg.role === 'user' ? 'bg-primary text-on-primary' : 'bg-surface-container text-on-surface'}`}>
              <div className="whitespace-pre-wrap">{msg.content}</div>
            </div>
          </div>
        ))}
        {loading && <div className="text-center py-4"><div className="inline-block animate-pulse">AI sedang berpikir...</div></div>}
      </div>
      <div className="flex gap-3">
        <input type="text" placeholder="Tanyakan tentang keuangan Anda..." value={prompt} onChange={e => setPrompt(e.target.value)} onKeyPress={e => e.key === 'Enter' && handleAsk()} className="input-m3 flex-1" />
        <button onClick={handleAsk} disabled={loading} className="btn-primary">Kirim</button>
      </div>
      <div className="mt-4 flex gap-2 flex-wrap">
        {['Analisa keuangan saya', 'Tips investasi untuk pemula', 'Bagaimana cara membuat budget?'].map(suggestion => (
          <button key={suggestion} onClick={() => { setPrompt(suggestion); handleAsk(); }} className="text-sm px-3 py-1 rounded-full" style={{background: 'var(--surface-container)', color: 'var(--on-surface-variant)'}}>{suggestion}</button>
        ))}
      </div>
    </div>
  );
};