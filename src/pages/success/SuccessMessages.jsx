import { useState, useRef, useEffect } from 'react';
import PageHeader from '../../components/PageHeader';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { USERS } from '../../data/seed';
import { Send, Plus, MessageSquare } from 'lucide-react';

export default function SuccessMessages() {
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

  const students = USERS.filter(u => u.role === 'student');
  const contacts = USERS.filter(u => u.id !== user?.id);

  const convoMsgs = selectedContact
    ? (convos[selectedContact] || []).sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
    : [];
  const contactUser = selectedContact ? USERS.find(u => u.id === selectedContact) : null;

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [convoMsgs.length]);

  const handleSend = () => {
    if (!newMsg.trim() || !selectedContact) return;
    sendMessage(user.id, selectedContact, `Support message from ${user?.name}`, newMsg.trim());
    setNewMsg('');
  };

  const handleCompose = () => {
    if (!composeTo || !composeSubject.trim() || !composeBody.trim()) return;
    sendMessage(user.id, composeTo, composeSubject, composeBody);
    setShowCompose(false);
    setComposeTo(''); setComposeSubject(''); setComposeBody('');
    setSelectedContact(composeTo);
  };

  const formatTime = ts => new Date(ts).toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit' });

  return (
    <div>
      <PageHeader title="Messages" subtitle="Contact students and coordinate support"
        actions={<button className="btn btn-primary" onClick={() => setShowCompose(true)}><Plus size={14} /> Contact Student</button>} />
      <div className="page-body">
        <div className="card" style={{ padding: 0, display: 'flex', height: 580, overflow: 'hidden' }}>
          {/* Sidebar */}
          <div style={{ width: 260, borderRight: '1px solid var(--surface-dark)', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--surface-dark)' }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Conversations</div>
            </div>
            <div style={{ flex: 1, overflowY: 'auto' }}>
              {Object.keys(convos).length === 0 && (
                <div style={{ padding: 24, textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>No conversations yet.</div>
              )}
              {Object.entries(convos).map(([id, msgs]) => {
                const contact = USERS.find(u => u.id === id);
                const last = [...msgs].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0];
                const unread = msgs.filter(m => m.toId === user?.id && !m.read).length;
                return (
                  <div key={id} onClick={() => setSelectedContact(id)}
                    style={{ display: 'flex', gap: 10, padding: '12px 16px', cursor: 'pointer',
                      background: selectedContact === id ? 'var(--surface-mid)' : 'transparent',
                      borderBottom: '1px solid var(--surface-mid)' }}>
                    <div className="avatar" style={{ width: 36, height: 36, background: 'var(--surface-mid)', color: 'var(--text-secondary)', fontSize: 13 }}>{contact?.avatar}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="flex items-center justify-between">
                        <span style={{ fontWeight: unread ? 700 : 500, fontSize: 13 }}>{contact?.name}</span>
                        {unread > 0 && <span style={{ background: 'var(--danger)', color: 'white', borderRadius: 100, fontSize: 10, padding: '1px 5px', fontWeight: 700 }}>{unread}</span>}
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }} className="truncate">{last?.body?.slice(0, 45)}</div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div style={{ padding: '12px 16px', borderTop: '1px solid var(--surface-dark)' }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase' }}>At-Risk Students</div>
              {students.map(s => (
                <div key={s.id} onClick={() => setSelectedContact(s.id)}
                  style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0', cursor: 'pointer' }}>
                  <div className="avatar" style={{ width: 26, height: 26, background: 'var(--surface-mid)', fontSize: 10 }}>{s.avatar}</div>
                  <div style={{ fontSize: 12 }}>{s.name}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Chat */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            {!selectedContact ? (
              <div className="empty-state" style={{ flex: 1 }}>
                <MessageSquare size={36} />
                <h4>Select a conversation</h4>
                <p>Or contact a student directly from their risk case.</p>
              </div>
            ) : (
              <>
                <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--surface-dark)', display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div className="avatar" style={{ background: 'var(--surface-mid)', fontSize: 14 }}>{contactUser?.avatar}</div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{contactUser?.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{contactUser?.studentId || contactUser?.role?.replace('_', ' ')}</div>
                  </div>
                </div>
                <div className="chat-messages" style={{ flex: 1 }}>
                  {convoMsgs.length === 0 && (
                    <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: 13, padding: 24 }}>No messages yet. Introduce yourself below.</div>
                  )}
                  {convoMsgs.map(m => {
                    const isSent = m.fromId === user?.id;
                    return (
                      <div key={m.id} style={{ display: 'flex', flexDirection: 'column', alignItems: isSent ? 'flex-end' : 'flex-start' }}>
                        <div className={`chat-bubble ${isSent ? 'sent' : 'received'}`}>
                          {m.body}
                          <div className="chat-bubble-time">{formatTime(m.timestamp)}</div>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={bottomRef} />
                </div>
                <div className="chat-input-area">
                  <input className="input-field" style={{ flex: 1 }} value={newMsg}
                    onChange={e => setNewMsg(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
                    placeholder="Type a support message…" />
                  <button className="btn btn-primary" onClick={handleSend} disabled={!newMsg.trim()}>
                    <Send size={15} />
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {showCompose && (
          <div className="modal-overlay" onClick={() => setShowCompose(false)}>
            <div className="modal" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h3 className="modal-title">Contact Student</h3>
                <button className="btn btn-ghost btn-sm btn-icon" onClick={() => setShowCompose(false)}>✕</button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div className="input-group">
                  <label className="input-label">Student</label>
                  <select className="input-field" value={composeTo} onChange={e => setComposeTo(e.target.value)}>
                    <option value="">Select student…</option>
                    {contacts.map(c => <option key={c.id} value={c.id}>{c.name} ({c.role.replace('_', ' ')})</option>)}
                  </select>
                </div>
                <div className="input-group">
                  <label className="input-label">Subject</label>
                  <input className="input-field" value={composeSubject} onChange={e => setComposeSubject(e.target.value)} placeholder="e.g. Academic Support Check-In" />
                </div>
                <div className="input-group">
                  <label className="input-label">Message</label>
                  <textarea className="input-field" value={composeBody} onChange={e => setComposeBody(e.target.value)} rows={5}
                    placeholder="Hi [name], I'm your assigned success officer and I'd like to schedule a consultation…" />
                </div>
                <div className="flex gap-2">
                  <button className="btn btn-primary" onClick={handleCompose}><Send size={14} /> Send</button>
                  <button className="btn btn-ghost" onClick={() => setShowCompose(false)}>Cancel</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
