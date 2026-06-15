import React, { useState } from 'react';
export const RecurringPage = () => {
  const [items, setItems] = useState([
    { id: '1', name: 'Netflix', amount: 49000, frequency: 'Monthly', nextDate: '2026-07-12', active: true },
    { id: '2', name: 'Listrik', amount: 150000, frequency: 'Monthly', nextDate: '2026-07-20', active: true },
  ]);
  return (<><h1 className="text-title-large mb-4">Transaksi Berulang</h1>{items.map(i => <div key={i.id} className="card mb-2"><div className="flex-between"><span className="text-title-medium">{i.name}</span><span className="text-success">Rp {i.amount.toLocaleString()}</span></div><div className="flex-between mt-1"><span className="text-label">{i.frequency} • Next: {i.nextDate}</span><span className={`text-label ${i.active ? 'text-success' : 'text-error'}`}>{i.active ? 'Active' : 'Inactive'}</span></div></div>)}</>);
};
