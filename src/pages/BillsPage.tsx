import React, { useState } from 'react';
export const BillsPage = () => {
  const [bills, setBills] = useState([
    { id: '1', name: 'Listrik', amount: 150000, dueDate: '2026-06-20', paid: false },
    { id: '2', name: 'Air', amount: 75000, dueDate: '2026-06-25', paid: false },
  ]);
  const togglePaid = (id) => setBills(bills.map(b => b.id === id ? { ...b, paid: !b.paid } : b));
  return (<><h1 className="text-title-large mb-4">Tagihan</h1>{bills.map(b => <div key={b.id} className="card mb-2"><div className="flex-between"><span className="text-title-medium">{b.name}</span><span className="text-error">Rp {b.amount.toLocaleString()}</span></div><div className="flex-between mt-1"><span className="text-label">Due: {b.dueDate}</span><button onClick={() => togglePaid(b.id)} className={`${b.paid ? 'text-success' : 'btn-primary'}`} style={{ width: 'auto', padding: '4px 12px' }}>{b.paid ? 'Lunas ✓' : 'Bayar'}</button></div></div>)}</>);
};
