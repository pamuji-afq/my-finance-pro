import React, { useState } from 'react';
import { useBillStore } from '../stores/billStore';
import { useNotification } from '../components/Notification';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { EmptyState } from '../components/EmptyState';

export const BillsPage = () => {
  const { bills, addBill, updateBill, deleteBill, getUpcoming } = useBillStore();
  const { showNotification } = useNotification();
  const [showForm, setShowForm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [form, setForm] = useState({ name: '', amount: 0, dueDate: new Date().toISOString().slice(0,10), category: 'Bills', paid: false, reminderDays: 3 });
  const upcoming = getUpcoming(7);

  const handleSubmit = (e) => {
    e.preventDefault();
    addBill(form);
    setShowForm(false);
    setForm({ name: '', amount: 0, dueDate: new Date().toISOString().slice(0,10), category: 'Bills', paid: false, reminderDays: 3 });
    showNotification('Bill added', 'success');
  };

  const markPaid = (id) => {
    updateBill(id, { paid: true });
    showNotification('Bill marked as paid', 'success');
  };

  const getStatusColor = (dueDate, paid) => {
    if (paid) return 'text-success';
    const diff = Math.ceil((new Date(dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    if (diff < 0) return 'text-error';
    if (diff <= 3) return 'text-warning';
    return 'text-on-surface-variant';
  };

  if (bills.length === 0 && !showForm) {
    return <EmptyState title="Belum Ada Tagihan" message="Catat tagihan rutin Anda" actionLabel="+ Tambah Tagihan" onAction={() => setShowForm(true)} />;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold" style={{color: 'var(--on-surface)'}}>Tagihan</h1>
        <button onClick={() => setShowForm(true)} className="btn-primary">+ Tambah</button>
      </div>
      {upcoming.length > 0 && <div className="card mb-6" style={{background: 'var(--warning-container)'}}><h2 className="font-semibold mb-2">⚠️ Tagihan Mendatang (7 hari)</h2>{upcoming.map(b => <div key={b.id} className="flex justify-between py-2"><span>{b.name}</span><span>Rp {b.amount.toLocaleString()}</span><span>{b.dueDate}</span></div>)}</div>}
      <div className="grid gap-4">{bills.map(b => <div key={b.id} className="card"><div className="flex justify-between items-start"><div><h3 className="font-semibold">{b.name}</h3><p className="text-sm" style={{color: 'var(--on-surface-variant)'}}>Due: {b.dueDate}</p></div><div className="text-right"><p className={`font-bold ${getStatusColor(b.dueDate, b.paid)}`}>Rp {b.amount.toLocaleString()}</p>{!b.paid && <button onClick={() => markPaid(b.id)} className="text-success text-sm">Mark Paid</button>}</div></div><div className="flex justify-end gap-2 mt-2"><button onClick={() => setDeleteTarget(b)} className="text-error">Delete</button></div></div>)}</div>
      {showForm && <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"><div className="bg-surface rounded-xl shadow-xl w-full max-w-md p-6"><h2 className="text-xl font-bold mb-4">New Bill</h2><form onSubmit={handleSubmit}><input type="text" placeholder="Bill Name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} className="input-m3 w-full mb-3" required /><input type="number" placeholder="Amount" value={form.amount} onChange={e=>setForm({...form,amount:parseFloat(e.target.value)||0})} className="input-m3 w-full mb-3" required /><input type="date" value={form.dueDate} onChange={e=>setForm({...form,dueDate:e.target.value})} className="input-m3 w-full mb-4" required /><div className="flex gap-3"><button type="button" onClick={()=>setShowForm(false)} className="flex-1 border rounded-lg p-2">Cancel</button><button type="submit" className="flex-1 btn-primary">Save</button></div></form></div></div>}
      <ConfirmDialog isOpen={!!deleteTarget} title="Hapus Tagihan" message={`Hapus tagihan "${deleteTarget?.name}"?`} onConfirm={()=>{deleteBill(deleteTarget.id); setDeleteTarget(null);}} onCancel={()=>setDeleteTarget(null)} />
    </div>
  );
};