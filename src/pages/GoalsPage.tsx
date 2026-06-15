import React, { useState } from 'react';
import { useGoalStore } from '../stores/goalStore';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { EmptyState } from '../components/EmptyState';

export const GoalsPage = () => {
  const { goals, addGoal, updateGoal, deleteGoal, contribute } = useGoalStore();
  const [showForm, setShowForm] = useState(false);
  const [showContribute, setShowContribute] = useState(null);
  const [editingGoal, setEditingGoal] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [amount, setAmount] = useState(0);
  const [form, setForm] = useState({ name: '', target: 0, icon: '🎯', color: '#0B57D0' });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingGoal) {
      updateGoal(editingGoal.id, { target: form.target });
      setEditingGoal(null);
    } else {
      addGoal(form);
    }
    setForm({ name: '', target: 0, icon: '🎯', color: '#0B57D0' });
    setShowForm(false);
  };

  const openEdit = (goal) => {
    setEditingGoal(goal);
    setForm({ name: goal.name, target: goal.target, icon: goal.icon, color: goal.color });
    setShowForm(true);
  };

  const doContribute = () => {
    if (showContribute && amount > 0) {
      contribute(showContribute.id, amount);
      setShowContribute(null);
      setAmount(0);
    }
  };

  if (goals.length === 0 && !showForm) {
    return <EmptyState title="Belum Ada Goals" message="Tetapkan tujuan keuangan Anda" actionLabel="+ Buat Goal" onAction={() => setShowForm(true)} />;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Financial Goals</h1>
        <button onClick={() => setShowForm(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg">+ New Goal</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {goals.map(g => {
          const pct = Math.min(100, (g.current / g.target) * 100);
          return (
            <div key={g.id} className="bg-white rounded-xl shadow p-4">
              <div className="flex justify-between items-start mb-2">
                <div><h3 className="font-bold text-lg">{g.icon} {g.name}</h3><p className="text-sm text-gray-500">Rp {g.current.toLocaleString()} / Rp {g.target.toLocaleString()}</p></div>
                <div className="text-2xl font-bold text-green-600">{pct.toFixed(0)}%</div>
              </div>
              <div className="h-2 bg-gray-200 rounded-full mt-2 mb-3 overflow-hidden"><div className="h-full bg-green-500 rounded-full" style={{ width: `${pct}%` }}></div></div>
              <div className="flex justify-end gap-2">
                <button onClick={() => setShowContribute(g)} className="bg-green-600 text-white px-3 py-1 rounded text-sm">+ Contribute</button>
                <button onClick={() => openEdit(g)} className="text-blue-500 text-sm">Edit</button>
                <button onClick={() => setDeleteTarget(g)} className="text-red-500 text-sm">Delete</button>
              </div>
            </div>
          );
        })}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <h2 className="text-xl font-bold mb-4">{editingGoal ? 'Edit Goal' : 'New Goal'}</h2>
            <form onSubmit={handleSubmit}>
              <input type="text" placeholder="Goal Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full p-3 border rounded-lg mb-3" required disabled={!!editingGoal} />
              <input type="number" placeholder="Target Amount" value={form.target} onChange={e => setForm({ ...form, target: parseFloat(e.target.value) || 0 })} className="w-full p-3 border rounded-lg mb-4" required />
              <div className="flex gap-3">
                <button type="button" onClick={() => { setShowForm(false); setEditingGoal(null); setForm({ name: '', target: 0, icon: '🎯', color: '#0B57D0' }); }} className="flex-1 border rounded-lg p-2">Cancel</button>
                <button type="submit" className="flex-1 bg-blue-600 text-white rounded-lg p-2">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showContribute && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <h2 className="text-xl font-bold mb-2">Contribute to {showContribute.name}</h2>
            <p className="text-gray-500 mb-4">Current: Rp {showContribute.current.toLocaleString()} / Rp {showContribute.target.toLocaleString()}</p>
            <input type="number" placeholder="Amount" value={amount} onChange={e => setAmount(parseFloat(e.target.value) || 0)} className="w-full p-3 border rounded-lg mb-4" />
            <div className="flex gap-3">
              <button onClick={() => setShowContribute(null)} className="flex-1 border rounded-lg p-2">Cancel</button>
              <button onClick={doContribute} className="flex-1 bg-green-600 text-white rounded-lg p-2">Add</button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog isOpen={!!deleteTarget} title="Hapus Goal" message={`Apakah Anda yakin ingin menghapus goal "${deleteTarget?.name}"?`} onConfirm={() => { deleteGoal(deleteTarget.id); setDeleteTarget(null); }} onCancel={() => setDeleteTarget(null)} />
    </div>
  );
};