import React, { useState } from 'react';
import { useNetWorthStore } from '../stores/netWorthStore';
import { useNotification } from '../components/Notification';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

export const NetWorthPage = () => {
  const { assets, liabilities, addAsset, updateAsset, deleteAsset, addLiability, updateLiability, deleteLiability, getNetWorth } = useNetWorthStore();
  const { showNotification } = useNotification();
  const [showAssetForm, setShowAssetForm] = useState(false);
  const [showLiabilityForm, setShowLiabilityForm] = useState(false);
  const [assetForm, setAssetForm] = useState({ name: '', value: 0, type: 'cash' });
  const [liabilityForm, setLiabilityForm] = useState({ name: '', value: 0, type: 'loan', interestRate: 0 });

  const totalAssets = assets.reduce((s, a) => s + a.value, 0);
  const totalLiabilities = liabilities.reduce((s, l) => s + l.value, 0);
  const netWorth = getNetWorth();

  const assetData = assets.map(a => ({ name: a.name, value: a.value }));
  const liabilityData = liabilities.map(l => ({ name: l.name, value: l.value }));
  const COLORS = ['#0B57D0', '#34A853', '#FB8C00', '#EA4335', '#9334E6'];

  const handleAddAsset = (e) => {
    e.preventDefault();
    addAsset(assetForm);
    setAssetForm({ name: '', value: 0, type: 'cash' });
    setShowAssetForm(false);
    showNotification('Asset added', 'success');
  };

  const handleAddLiability = (e) => {
    e.preventDefault();
    addLiability(liabilityForm);
    setLiabilityForm({ name: '', value: 0, type: 'loan', interestRate: 0 });
    setShowLiabilityForm(false);
    showNotification('Liability added', 'success');
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold" style={{color: 'var(--on-surface)'}}>Net Worth</h1>
        <div className="flex gap-2"><button onClick={() => setShowAssetForm(true)} className="btn-primary">+ Asset</button><button onClick={() => setShowLiabilityForm(true)} className="btn-secondary">+ Liability</button></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"><div className="card"><div className="text-sm">Total Assets</div><div className="text-2xl font-bold text-success">Rp {totalAssets.toLocaleString()}</div></div><div className="card"><div className="text-sm">Total Liabilities</div><div className="text-2xl font-bold text-error">Rp {totalLiabilities.toLocaleString()}</div></div><div className="card" style={{background: 'var(--primary-container)'}}><div className="text-sm">Net Worth</div><div className={`text-2xl font-bold ${netWorth >= 0 ? 'text-success' : 'text-error'}`}>Rp {netWorth.toLocaleString()}</div></div></div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6"><div className="card"><h2 className="font-semibold mb-4">Assets</h2><ResponsiveContainer width="100%" height={200}>{assetData.length > 0 ? <PieChart><Pie data={assetData} cx="50%" cy="50%" outerRadius={80} dataKey="value">{assetData.map((_,i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip formatter={(v) => `Rp ${v.toLocaleString()}`} /></PieChart> : <div className="text-center py-8">No assets</div>}</ResponsiveContainer><div className="mt-4">{assets.map(a => <div key={a.id} className="flex justify-between py-2"><span>{a.name}</span><span>Rp {a.value.toLocaleString()}</span><button onClick={() => deleteAsset(a.id)} className="text-error">🗑️</button></div>)}</div></div><div className="card"><h2 className="font-semibold mb-4">Liabilities</h2><ResponsiveContainer width="100%" height={200}>{liabilityData.length > 0 ? <PieChart><Pie data={liabilityData} cx="50%" cy="50%" outerRadius={80} dataKey="value">{liabilityData.map((_,i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip formatter={(v) => `Rp ${v.toLocaleString()}`} /></PieChart> : <div className="text-center py-8">No liabilities</div>}</ResponsiveContainer><div className="mt-4">{liabilities.map(l => <div key={l.id} className="flex justify-between py-2"><span>{l.name}</span><span>Rp {l.value.toLocaleString()}</span><button onClick={() => deleteLiability(l.id)} className="text-error">🗑️</button></div>)}</div></div></div>
      {showAssetForm && <div className="fixed inset-0 bg-black/50 flex items-center justify-center"><div className="bg-surface rounded-xl p-6 w-96"><h2 className="text-xl font-bold mb-4">Add Asset</h2><form onSubmit={handleAddAsset}><input type="text" placeholder="Name" value={assetForm.name} onChange={e=>setAssetForm({...assetForm,name:e.target.value})} className="input-m3 w-full mb-3" required /><input type="number" placeholder="Value" value={assetForm.value} onChange={e=>setAssetForm({...assetForm,value:parseFloat(e.target.value)||0})} className="input-m3 w-full mb-3" required /><select value={assetForm.type} onChange={e=>setAssetForm({...assetForm,type:e.target.value})} className="input-m3 w-full mb-4"><option value="cash">Cash</option><option value="bank">Bank</option><option value="investment">Investment</option><option value="property">Property</option><option value="vehicle">Vehicle</option></select><div className="flex gap-3"><button type="button" onClick={()=>setShowAssetForm(false)} className="flex-1 border rounded-lg p-2">Cancel</button><button type="submit" className="flex-1 btn-primary">Save</button></div></form></div></div>}
      {showLiabilityForm && <div className="fixed inset-0 bg-black/50 flex items-center justify-center"><div className="bg-surface rounded-xl p-6 w-96"><h2 className="text-xl font-bold mb-4">Add Liability</h2><form onSubmit={handleAddLiability}><input type="text" placeholder="Name" value={liabilityForm.name} onChange={e=>setLiabilityForm({...liabilityForm,name:e.target.value})} className="input-m3 w-full mb-3" required /><input type="number" placeholder="Value" value={liabilityForm.value} onChange={e=>setLiabilityForm({...liabilityForm,value:parseFloat(e.target.value)||0})} className="input-m3 w-full mb-3" required /><select value={liabilityForm.type} onChange={e=>setLiabilityForm({...liabilityForm,type:e.target.value})} className="input-m3 w-full mb-3"><option value="loan">Loan</option><option value="mortgage">Mortgage</option><option value="credit">Credit Card</option><option value="personal">Personal</option></select><input type="number" placeholder="Interest Rate (%)" value={liabilityForm.interestRate} onChange={e=>setLiabilityForm({...liabilityForm,interestRate:parseFloat(e.target.value)||0})} className="input-m3 w-full mb-4" /><div className="flex gap-3"><button type="button" onClick={()=>setShowLiabilityForm(false)} className="flex-1 border rounded-lg p-2">Cancel</button><button type="submit" className="flex-1 btn-primary">Save</button></div></form></div></div>}
    </div>
  );
};