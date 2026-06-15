import React, { useState } from 'react';
import { useWalletStore } from '../stores/walletStore';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { EmptyState } from '../components/EmptyState';

export const WalletsPage = () => {
  const { wallets, addWallet, updateWallet, deleteWallet, transfer } = useWalletStore();
  const [showForm, setShowForm] = useState(false);
  const [showTransfer, setShowTransfer] = useState(false);
  const [editingWallet, setEditingWallet] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [form, setForm] = useState({ name: '', balance: 0 });
  const [transferData, setTransferData] = useState({ fromId: '', toId: '', amount: 0 });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingWallet) {
      updateWallet(editingWallet.id, form);
    } else {
      addWallet({ ...form, currency: 'IDR', color: '#0B57D0' });
    }
    setForm({ name: '', balance: 0 });
    setEditingWallet(null);
    setShowForm(false);
  };

  const handleTransfer = (e) => {
    e.preventDefault();
    const success = transfer(transferData.fromId, transferData.toId, transferData.amount);
    if (success) {
      setShowTransfer(false);
      setTransferData({ fromId: '', toId: '', amount: 0 });
    } else {
      alert('Transfer failed: insufficient balance');
    }
  };

  const openEdit = (wallet) => {
    setEditingWallet(wallet);
    setForm({ name: wallet.name, balance: wallet.balance });
    setShowForm(true);
  };

  if (wallets.length === 0 && !showForm) {
    return <EmptyState title="Belum Ada Wallet" message="Tambahkan wallet pertama Anda untuk mulai mengelola keuangan" actionLabel="+ Tambah Wallet" onAction={() => setShowForm(true)} />;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Wallets</h1>
        <div className="flex gap-2">
          <button onClick={() => setShowTransfer(true)} className="bg-purple-600 text-white px-4 py-2 rounded-lg">↗️ Transfer</button>
          <button onClick={() => setShowForm(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg">+ New Wallet</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {wallets.map(w => (
          <div key={w.id} className="bg-white rounded-xl shadow p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-lg">{w.name}</h3>
                <p className="text-2xl font-bold text-blue-600">Rp {w.balance.toLocaleString()}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => openEdit(w)} className="text-blue-500">✏️</button>
                <button onClick={() => setDeleteTarget(w)} className="text-red-500">🗑️</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <h2 className="text-xl font-bold mb-4">{editingWallet ? 'Edit Wallet' : 'New Wallet'}</h2>
            <form onSubmit={handleSubmit}>
              <input type="text" placeholder="Wallet Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full p-3 border rounded-lg mb-3" required />
              <input type="number" placeholder="Balance" value={form.balance} onChange={e => setForm({ ...form, balance: parseFloat(e.target.value) || 0 })} className="w-full p-3 border rounded-lg mb-4" />
              <div className="flex gap-3">
                <button type="button" onClick={() => { setShowForm(false); setEditingWallet(null); setForm({ name: '', balance: 0 }); }} className="flex-1 border rounded-lg p-2">Cancel</button>
                <button type="submit" className="flex-1 bg-blue-600 text-white rounded-lg p-2">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Transfer Modal */}
      {showTransfer && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <h2 className="text-xl font-bold mb-4">Transfer Money</h2>
            <form onSubmit={handleTransfer}>
              <select value={transferData.fromId} onChange={e => setTransferData({ ...transferData, fromId: e.target.value })} className="w-full p-3 border rounded-lg mb-3" required>
                <option value="">From Wallet</option>
                {wallets.map(w => <option key={w.id} value={w.id}>{w.name} (Rp {w.balance.toLocaleString()})</option>)}
              </select>
              <select value={transferData.toId} onChange={e => setTransferData({ ...transferData, toId: e.target.value })} className="w-full p-3 border rounded-lg mb-3" required>
                <option value="">To Wallet</option>
                {wallets.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
              </select>
              <input type="number" placeholder="Amount" value={transferData.amount} onChange={e => setTransferData({ ...transferData, amount: parseFloat(e.target.value) || 0 })} className="w-full p-3 border rounded-lg mb-4" required />
              <div className="flex gap-3">
                <button type="button" onClick={() => setShowTransfer(false)} className="flex-1 border rounded-lg p-2">Cancel</button>
                <button type="submit" className="flex-1 bg-purple-600 text-white rounded-lg p-2">Transfer</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog isOpen={!!deleteTarget} title="Hapus Wallet" message={`Apakah Anda yakin ingin menghapus wallet "${deleteTarget?.name}"? Data transaksi terkait wallet ini akan tetap tersimpan.`} onConfirm={() => { deleteWallet(deleteTarget.id); setDeleteTarget(null); }} onCancel={() => setDeleteTarget(null)} />
    </div>
  );
};