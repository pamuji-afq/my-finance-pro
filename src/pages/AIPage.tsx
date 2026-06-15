import React, { useState } from 'react';
export const AIPage = () => {
  const [messages, setMessages] = useState([{ role: 'assistant', content: 'Halo! Saya AI Advisor. Tanyakan tentang keuangan Anda!' }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const handleSend = async () => {
    if (!input.trim()) return;
    setMessages(prev => [...prev, { role: 'user', content: input }]);
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    setMessages(prev => [...prev, { role: 'assistant', content: `Analisis untuk "${input}": Rekomendasi saya adalah atur budget 50% kebutuhan, 30% keinginan, 20% tabungan.` }]);
    setInput('');
    setLoading(false);
  };
  return (<><h1 className="text-title-large mb-4">🤖 AI Advisor</h1><div className="card" style={{ height: 400, overflowY: 'auto', marginBottom: 16 }}>{messages.map((m,i) => <div key={i} className={`mb-2 ${m.role === 'user' ? 'text-right' : 'text-left'}`}><span className={`inline-block p-2 rounded ${m.role === 'user' ? 'bg-primary text-on-primary' : 'bg-surface-container'}`}>{m.content}</span></div>)}{loading && <div className="text-center text-label">AI sedang berpikir...</div>}</div><div className="flex gap-2"><input type="text" value={input} onChange={e=>setInput(e.target.value)} onKeyPress={e=>e.key==='Enter'&&handleSend()} placeholder="Tanya tentang keuangan..." className="input-field flex-1" /><button onClick={handleSend} className="btn-primary" style={{ width: 'auto', padding: '12px 20px' }}>Kirim</button></div></>);
};
