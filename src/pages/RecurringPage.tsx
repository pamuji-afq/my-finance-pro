import React, { useState } from 'react';
import { useRecurringStore } from '../stores/recurringStore';
import { useWalletStore } from '../stores/walletStore';
import { useNotification } from '../components/Notification';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { EmptyState } from '../components/EmptyState';

export const RecurringPage = () => {
  const { recurring, addRecurring, updateRecurring, deleteRecurring } = useRecurringStore();
  const { wallets } = useWalletStore();
  const { showNotification } = useNotification();
  const [showForm, setShowForm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [form, setForm] = useState({
    walletId: wallets[0]?.id || '', amount: 0, type: 'expense', category: '', desc: '', frequency: 'monthly', nextDate: new Date().toISOString().slice(0,10), active: true
  });
  const categories = { income: ['Salary', 'Freelance', 'Gift'], expense: ['Food', 'Transport', 'Shopping', 'Bills', 'Subscription'] };

  const handleSubmit = (e) => {
    e.preventDefault();
    addRecurring(form);
    setShowForm(false);
    setForm({ walletId: wallets[0]?.id, amount: 0, type: 'expense', category: '', desc: '', frequency: 'monthly', nextDate: new Date().toISOString().slice(0,10), active: true });
    showNotification('Recurring transaction added', 'success');
  };

  const toggleActive = (id, active) => {
    updateRecurring(id, { active: !active });
    showNotification(`Recurring ${!active ? 'activated' : 'deactivated'}`, 'info');
  };

  if (recurring.length === 0 && !showForm) {
    return <EmptyState title="Belum Ada Transaksi Berulang" message="Buat transaksi otomatis bulanan" actionLabel="+ Buat" onAction={() => setShowForm(true)} />;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold" style={{color: 'var(--on-surface)'}}>Transaksi Berulang</h1>
        <button onClick={() => setShowForm(true)} className="btn-primary">+ Tambah</button>
      </div>
      <div className="grid gap-4">
        {recurring.map(r => (
          <div key={r.id} className="card">
            <div className="flex justify-between items-start">
              <div><h3 className="font-semibold" style={{color: 'var(--on-surface)'}}>{r.desc}</h3><p className="text-sm" style={{color: 'var(--on-surface-variant)'}}>{r.category} • {r.frequency} • Next: {r.nextDate}</p></div>
              <div className="text-right"><p className={`font-bold ${r.type === 'income' ? 'text-success' : 'text-error'}`}>{r.type === 'income' ? '+' : '-'}Rp {r.amount.toLocaleString()}</p><button onClick={() => toggleActive(r.id, r.active)} className={`text-sm ${r.active ? 'text-success' : 'text-on-surface-variant'}`}>{r.active ? 'Active' : 'Inactive'}</button></div>
            </div>
            <div className="flex justify-end gap-2 mt-2"><button onClick={() => setDeleteTarget(r)} className="text-error">Delete</button></div>
          </div>
        ))}
      </div>
      {showForm && <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"><div className="bg-surface rounded-xl shadow-xl w-full max-w-md p-6"><h2 className="text-xl font-bold mb-4">New Recurring</h2><form onSubmit={handleSubmit}><select value={form.walletId} onChange={e=>setForm({...form,walletId:e.target.value})} className="input-m3 w-full mb-3">{wallets.map(w=><option key={w.id} value={w.id}>{w.name}</option>)}</select><select value={form.type} onChange={e=>setForm({...form,type:e.target.value,category:''})} className="input-m3 w-full mb-3"><option value="expense">Expense</option><option value="income">Income</option></select><select value={form.category} onChange={e=>setForm({...form,category:e.target.value})} className="input-m3 w-full mb-3" required><option value="">Category</option>{categories[form.type].map(c=><option key={c}>{c}</option>)}</select><input type="text" placeholder="Description" value={form.desc} onChange={e=>setForm({...form,desc:e.target.value})} className="input-m3 w-full mb-3" required /><input type="number" placeholder="Amount" value={form.amount} onChange={e=>setForm({...form,amount:parseFloat(e.target.value)||0})} className="input-m3 w-full mb-3" required /><select value={form.frequency} onChange={e=>setForm({...form,frequency:e.target.value})} className="input-m3 w-full mb-3"><option value="daily">Daily</option><option value="weekly">Weekly</option><option value="monthly">Monthly</option><option value="yearly">Yearly</option></select><input type="date" value={form.nextDate} onChange={e=>setForm({...form,nextDate:e.target.value})} className="input-m3 w-full mb-4" required /><div className="flex gap-3"><button type="button" onClick={()=>setShowForm(false)} className="flex-1 border rounded-lg p-2">Cancel</button><button type="submit" className="flex-1 btn-primary">Save</button></div></form></div></div>}
      <ConfirmDialog isOpen={!!deleteTarget} title="Hapus" message={`Hapus transaksi berulang "${deleteTarget?.desc}"?`} onConfirm={()=>{deleteRecurring(deleteTarget.id); setDeleteTarget(null); showNotification('Deleted','success');}} onCancel={()=>setDeleteTarget(null)} />
    </div>
  );
};