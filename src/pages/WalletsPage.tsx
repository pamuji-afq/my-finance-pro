import React, { useState } from 'react';
import { useWalletStore } from '../stores/walletStore';

export const WalletsPage = () => {
  const { wallets, addWallet, deleteWallet } = useWalletStore();
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [balance, setBalance] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      addWallet({ name, balance, currency: 'IDR' });
      setName('');
      setBalance(0);
      setShowForm(false);
    }
  };

  return (
    <div className="main-content">
      <div className="flex-between mb-6">
        <h1 className="title-large text-on-surface">Wallets</h1>
        <button onClick={() => setShowForm(true)} className="btn-primary">+ New Wallet</button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {wallets.map(w => (
          <div key={w.id} className="card">
            <div className="flex-between">
              <div>
                <h3 className="title-medium text-on-surface">{w.name}</h3>
                <p className="headline-medium text-primary">Rp {w.balance.toLocaleString()}</p>
                <p className="label-small text-on-surface-variant">{w.currency}</p>
              </div>
              <button onClick={() => deleteWallet(w.id)} className="text-error cursor-pointer">🗑️</button>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowForm(false)}>
          <div className="card-elevated w-full max-w-md" onClick={e => e.stopPropagation()}>
            <h2 className="title-medium text-on-surface mb-4">New Wallet</h2>
            <form onSubmit={handleSubmit}>
              <input type="text" placeholder="Wallet Name" value={name} onChange={e => setName(e.target.value)} className="input w-full mb-3" required />
              <input type="number" placeholder="Initial Balance" value={balance} onChange={e => setBalance(parseFloat(e.target.value) || 0)} className="input w-full mb-4" />
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
