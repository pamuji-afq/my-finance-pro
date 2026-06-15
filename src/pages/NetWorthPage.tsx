import React, { useState } from 'react';
export const NetWorthPage = () => {
  const [assets, setAssets] = useState([{ id: '1', name: 'Tabungan', value: 17500000 }, { id: '2', name: 'Emas', value: 10000000 }]);
  const [liabilities, setLiabilities] = useState([{ id: '1', name: 'KPR', value: 350000000 }]);
  const totalAssets = assets.reduce((s,a)=>s+a.value,0);
  const totalLiabilities = liabilities.reduce((s,l)=>s+l.value,0);
  const netWorth = totalAssets - totalLiabilities;
  return (<><h1 className="text-title-large mb-4">Net Worth</h1><div className="grid-2 mb-4"><div className="card"><div className="text-label">Total Assets</div><div className="text-headline text-success">Rp {totalAssets.toLocaleString()}</div></div><div className="card"><div className="text-label">Total Liabilities</div><div className="text-headline text-error">Rp {totalLiabilities.toLocaleString()}</div></div><div className="card" style={{ background: 'var(--md-primary-container)' }}><div className="text-label">Net Worth</div><div className="text-headline" style={{ color: netWorth >= 0 ? 'var(--md-success)' : 'var(--md-error)' }}>Rp {netWorth.toLocaleString()}</div></div></div><div className="card mb-4"><h2 className="text-title-medium mb-2">Assets</h2>{assets.map(a => <div key={a.id} className="flex-between"><span>{a.name}</span><span>Rp {a.value.toLocaleString()}</span></div>)}</div><div className="card"><h2 className="text-title-medium mb-2">Liabilities</h2>{liabilities.map(l => <div key={l.id} className="flex-between"><span>{l.name}</span><span className="text-error">Rp {l.value.toLocaleString()}</span></div>)}</div></>);
};
