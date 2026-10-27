import { useState, useRef, useEffect } from 'react';
import PageHeader from '../../components/PageHeader';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { USERS } from '../../data/seed';
import { Send, Plus } from 'lucide-react';

export default function AdminMessages() {
  const { user } = useAuth();
  const { messages, sendMessage } = useData();
  const [selectedContact, setSelectedContact] = useState(null);
  const [newMsg, setNewMsg] = useState('');
  const [showCompose, setShowCompose] = useState(false);
  const [composeTo, setComposeTo] = useState('');
  const [composeSubject, setComposeSubject] = useState('');
  const [composeBody, setComposeBody] = useState('');
  const bottomRef = useRef(null);

  const myMsgs = messages.filter(m => m.fromId === user?.id || m.toId === user?.id);
  const convos = {};
  myMsgs.forEach(m => {
    const otherId = m.fromId === user?.id ? m.toId : m.fromId;
    if (!convos[otherId]) convos[otherId] = [];
    convos[otherId].push(m);
  });

  const contacts = USERS.filter(u => u.id !== user?.id);
  const convoMsgs = selectedContact ? (convos[selectedContact] || []).sort((a,b) => new Date(a.timestamp) - new Date(b.timestamp)) : [];
  const contactUser = selectedContact ? USERS.find(u => u.id === selectedContact) : null;

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [convoMsgs.length]);

  const handleSend = () => {
    if (!newMsg.trim() || !selectedContact) return;
    sendMessage(user.id, selectedContact, 'Admin message', newMsg.trim());
    setNewMsg('');
  };
  const handleCompose = () => {
    if (!composeTo || !composeSubject || !composeBody) return;
    sendMessage(user.id, composeTo, composeSubject, composeBody);
    setShowCompose(false); setComposeTo(''); setComposeSubject(''); setComposeBody('');
    setSelectedContact(composeTo);
  };

  return (
    <div>
      <PageHeader title="Messages" subtitle="System-wide communication"
        actions={<button className="btn btn-primary" onClick={() => setShowCompose(true)}><Plus size={14} /> New Message</button>} />
      <div className="page-body">
        <div className="card" style={{ padding: 0, display: 'flex', height: 560, overflow: 'hidden' }}>
          <div style={{ width: 240, borderRight: '1px solid var(--surface-dark)', overflowY: 'auto' }}>
            {Object.entries(convos).map(([id, msgs]) => {
              const c = USERS.find(u => u.id === id);
              const last = [...msgs].sort((a,b) => new Date(b.timestamp)-new Date(a.timestamp))[0];
              return (
                <div key={id} onClick={() => setSelectedContact(id)}
                  style={{ padding: '12px 14px', cursor: 'pointer', borderBottom: '1px solid var(--surface-mid)', background: selectedContact===id ? 'var(--surface-mid)' : 'transparent', display: 'flex', gap: 10 }}>
                  <div className="avatar" style={{ width: 32, height: 32, background: 'var(--surface-dark)', fontSize: 12 }}>{c?.avatar}</div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: 13 }}>{c?.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }} className="truncate">{last?.body?.slice(0,40)}</div>
                  </div>
                </div>
              );
            })}
            {Object.keys(convos).length === 0 && <div style={{ padding: 20, fontSize: 13, color: 'var(--text-muted)', textAlign: 'center' }}>No messages yet</div>}
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            {!selectedContact ? (
              <div className="empty-state" style={{ flex: 1 }}><Send size={32} /><h4>Select a conversation</h4></div>
            ) : (
              <>
                <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--surface-dark)', display: 'flex', gap: 10 }}>
                  <div className="avatar" style={{ background: 'var(--surface-dark)', fontSize: 13 }}>{contactUser?.avatar}</div>
                  <div><div style={{ fontWeight: 700, fontSize: 14 }}>{contactUser?.name}</div><div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{contactUser?.role?.replace('_',' ')}</div></div>
                </div>
                <div className="chat-messages" style={{ flex: 1 }}>
                  {convoMsgs.map(m => {
                    const isSent = m.fromId === user?.id;
                    return (
                      <div key={m.id} style={{ display: 'flex', justifyContent: isSent ? 'flex-end' : 'flex-start' }}>
                        <div className={`chat-bubble ${isSent ? 'sent' : 'received'}`}>{m.body}<div className="chat-bubble-time">{new Date(m.timestamp).toLocaleTimeString('en-ZA', {hour:'2-digit',minute:'2-digit'})}</div></div>
                      </div>
                    );
                  })}
                  <div ref={bottomRef} />
                </div>
                <div className="chat-input-area">
                  <input className="input-field" style={{ flex: 1 }} value={newMsg} onChange={e => setNewMsg(e.target.value)} onKeyDown={e => e.key==='Enter' && handleSend()} placeholder="Type message…" />
                  <button className="btn btn-primary" onClick={handleSend}><Send size={15} /></button>
                </div>
              </>
            )}
          </div>
        </div>
        {showCompose && (
          <div className="modal-overlay" onClick={() => setShowCompose(false)}>
            <div className="modal" onClick={e => e.stopPropagation()}>
              <div className="modal-header"><h3 className="modal-title">New Message</h3><button className="btn btn-ghost btn-sm btn-icon" onClick={() => setShowCompose(false)}>✕</button></div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div className="input-group"><label className="input-label">To</label>
                  <select className="input-field" value={composeTo} onChange={e => setComposeTo(e.target.value)}>
                    <option value="">Select recipient</option>
                    {contacts.map(c => <option key={c.id} value={c.id}>{c.name} ({c.role.replace('_',' ')})</option>)}
                  </select>
                </div>
                <div className="input-group"><label className="input-label">Subject</label><input className="input-field" value={composeSubject} onChange={e => setComposeSubject(e.target.value)} /></div>
                <div className="input-group"><label className="input-label">Message</label><textarea className="input-field" value={composeBody} onChange={e => setComposeBody(e.target.value)} rows={4} /></div>
                <div className="flex gap-2"><button className="btn btn-primary" onClick={handleCompose}><Send size={14}/> Send</button><button className="btn btn-ghost" onClick={() => setShowCompose(false)}>Cancel</button></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
