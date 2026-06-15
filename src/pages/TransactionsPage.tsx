import React, { useState } from 'react';
import { useTransactionStore } from '../stores/transactionStore';
import { useWalletStore } from '../stores/walletStore';

export const TransactionsPage = () => {
  const { transactions, addTransaction, deleteTransaction } = useTransactionStore();
  const { wallets, updateBalance } = useWalletStore();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    walletId: wallets[0]?.id || '',
    amount: 0,
    type: 'expense',
    category: '',
    desc: '',
    date: new Date().toISOString().slice(0, 10)
  });

  const categories = { income: ['Salary', 'Freelance', 'Gift', 'Investment'], expense: ['Food', 'Transport', 'Shopping', 'Bills', 'Entertainment'] };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = form.type === 'expense' ? -form.amount : form.amount;
    addTransaction(form);
    updateBalance(form.walletId, amount);
    setShowForm(false);
    setForm({ walletId: wallets[0]?.id, amount: 0, type: 'expense', category: '', desc: '', date: new Date().toISOString().slice(0, 10) });
  };

  const getWalletName = (id: string) => wallets.find(w => w.id === id)?.name || 'Unknown';

  return (
    <div className="main-content">
      <div className="flex-between mb-6">
        <h1 className="title-large text-on-surface">Transactions</h1>
        <button onClick={() => setShowForm(true)} className="btn-primary">+ Add</button>
      </div>

      <div className="card overflow-hidden">
        {transactions.map(tx => (
          <div key={tx.id} className="flex-between p-4 border-b" style={{ borderBottomColor: 'var(--md-sys-color-outline-variant)' }}>
            <div>
              <div className="title-small text-on-surface">{tx.desc}</div>
              <div className="body-medium text-on-surface-variant">{tx.category} • {getWalletName(tx.walletId)} • {tx.date}</div>
            </div>
            <div className="flex items-center gap-3">
              <span className={`title-medium ${tx.type === 'income' ? 'text-success' : 'text-error'}`}>
                {tx.type === 'income' ? '+' : '-'}Rp {tx.amount.toLocaleString()}
              </span>
              <button onClick={() => deleteTransaction(tx.id)} className="text-error cursor-pointer">🗑️</button>
            </div>
          </div>
        ))}
        {transactions.length === 0 && <div className="text-center p-8 text-on-surface-variant">No transactions yet. Add your first transaction!</div>}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto" onClick={() => setShowForm(false)}>
          <div className="card-elevated w-full max-w-md" onClick={e => e.stopPropagation()}>
            <h2 className="title-medium text-on-surface mb-4">Add Transaction</h2>
            <form onSubmit={handleSubmit}>
              <select value={form.walletId} onChange={e => setForm({ ...form, walletId: e.target.value })} className="input w-full mb-3">{wallets.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}</select>
              <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value, category: '' })} className="input w-full mb-3"><option value="expense">Expense</option><option value="income">Income</option></select>
              <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="input w-full mb-3" required><option value="">Select category</option>{categories[form.type].map(c => <option key={c}>{c}</option>)}</select>
              <input type="text" placeholder="Description" value={form.desc} onChange={e => setForm({ ...form, desc: e.target.value })} className="input w-full mb-3" required />
              <input type="number" placeholder="Amount" value={form.amount} onChange={e => setForm({ ...form, amount: parseFloat(e.target.value) || 0 })} className="input w-full mb-3" required />
              <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} className="input w-full mb-4" required />
              <div className="flex gap-3">
                <button type="button" onClick={() => setShowForm(false)} className="btn-outline flex-1">Cancel</button>
                <button type="submit" className="btn-primary flex-1">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
