import { useState, useRef, useEffect } from 'react';
import PageHeader from '../../components/PageHeader';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { USERS, MODULES, ENROLMENTS } from '../../data/seed';
import { Send, Plus, Search } from 'lucide-react';

export default function LecturerMessages() {
  const { user } = useAuth();
  const { messages, sendMessage } = useData();
  const [selectedConvo, setSelectedConvo] = useState(null);
  const [newMsg, setNewMsg] = useState('');
  const [showCompose, setShowCompose] = useState(false);
  const [composeTo, setComposeTo] = useState('');
  const [composeSubject, setComposeSubject] = useState('');
  const [composeBody, setComposeBody] = useState('');
  const [search, setSearch] = useState('');
  const bottomRef = useRef(null);

  // Get conversations
  const myMsgs = messages.filter(m => m.fromId === user?.id || m.toId === user?.id);
  const convos = {};
  myMsgs.forEach(m => {
    const otherId = m.fromId === user?.id ? m.toId : m.fromId;
    if (!convos[otherId]) convos[otherId] = [];
    convos[otherId].push(m);
  });

  // My students (from enrolled modules)
  const myModuleIds = MODULES.filter(m => m.lecturer === user?.id).map(m => m.id);
  const myStudents = [...new Set(ENROLMENTS.filter(e => myModuleIds.includes(e.moduleId)).map(e => e.studentId))]
    .map(id => USERS.find(u => u.id === id)).filter(Boolean);

  const allContacts = USERS.filter(u => u.id !== user?.id && (u.role === 'student' || u.role === 'admin' || u.role === 'success_officer'));

  const filteredContacts = Object.entries(convos).filter(([id]) => {
    const contact = USERS.find(u => u.id === id);
    return !search || contact?.name.toLowerCase().includes(search.toLowerCase());
  });

  const convoMessages = selectedConvo ? (convos[selectedConvo] || []).sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp)) : [];
  const contactUser = selectedConvo ? USERS.find(u => u.id === selectedConvo) : null;

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [convoMessages.length]);

  const handleSend = () => {
    if (!newMsg.trim() || !selectedConvo) return;
    sendMessage(user.id, selectedConvo, `Re: ${convoMessages[0]?.subject || 'Message'}`, newMsg.trim());
    setNewMsg('');
  };

  const handleCompose = () => {
    if (!composeTo || !composeSubject || !composeBody) return;
    sendMessage(user.id, composeTo, composeSubject, composeBody);
    setShowCompose(false);
    setComposeTo(''); setComposeSubject(''); setComposeBody('');
    setSelectedConvo(composeTo);
  };

  const formatTime = (ts) => {
    const d = new Date(ts);
    return d.toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div>
      <PageHeader title="Messages" subtitle="Communicate with students and colleagues"
        actions={<button className="btn btn-primary" onClick={() => setShowCompose(true)}><Plus size={14} /> New Message</button>} />
      <div className="page-body">
        <div className="card" style={{ padding: 0, display: 'flex', height: 600, overflow: 'hidden' }}>
          {/* Sidebar */}
          <div style={{ width: 280, borderRight: '1px solid var(--surface-dark)', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--surface-dark)' }}>
              <div className="search-wrap">
                <Search size={14} />
                <input className="input-field" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search conversations…" style={{ paddingLeft: 34, fontSize: 13 }} />
              </div>
            </div>
            <div style={{ flex: 1, overflowY: 'auto' }}>
              {filteredContacts.length === 0 && (
                <div style={{ padding: 24, textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>
                  No conversations yet.<br />Start by composing a message.
                </div>
              )}
              {filteredContacts.map(([id, msgs]) => {
                const contact = USERS.find(u => u.id === id);
                const last = msgs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0];
                const unread = msgs.filter(m => m.toId === user?.id && !m.read).length;
                return (
                  <div key={id} onClick={() => setSelectedConvo(id)}
                    className={`inbox-item ${id === selectedConvo ? 'unread' : ''}`}
                    style={{ padding: '12px 16px' }}>
                    <div className="avatar" style={{ width: 36, height: 36, background: 'var(--gold)', color: 'var(--navy)', fontSize: 13 }}>
                      {contact?.avatar}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="flex items-center justify-between">
                        <span style={{ fontWeight: 600, fontSize: 13, color: 'var(--text-primary)' }}>{contact?.name}</span>
                        {unread > 0 && <span className="badge badge-danger" style={{ fontSize: 9, padding: '1px 5px' }}>{unread}</span>}
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }} className="truncate">{last?.body}</div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ padding: '12px 16px', borderTop: '1px solid var(--surface-dark)' }}>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 8 }}>My Students</div>
              {myStudents.slice(0, 3).map(s => (
                <div key={s.id} onClick={() => setSelectedConvo(s.id)}
                  style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0', cursor: 'pointer' }}>
                  <div className="avatar" style={{ width: 24, height: 24, background: 'var(--surface-mid)', color: 'var(--text-secondary)', fontSize: 10 }}>{s.avatar}</div>
                  <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{s.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Chat area */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            {!selectedConvo ? (
              <div className="empty-state" style={{ flex: 1 }}>
                <Send size={36} />
                <h4>Select a conversation</h4>
                <p>Choose a student or contact to start messaging</p>
              </div>
            ) : (
              <>
                <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--surface-dark)', display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div className="avatar" style={{ background: 'var(--gold)', color: 'var(--navy)', fontSize: 14 }}>{contactUser?.avatar}</div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{contactUser?.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{contactUser?.role?.replace('_', ' ')} {contactUser?.studentId ? `· ${contactUser.studentId}` : ''}</div>
                  </div>
                </div>

                <div className="chat-messages" style={{ flex: 1 }}>
                  {convoMessages.map(m => {
                    const isSent = m.fromId === user?.id;
                    return (
                      <div key={m.id} style={{ display: 'flex', flexDirection: 'column', alignItems: isSent ? 'flex-end' : 'flex-start' }}>
                        {m.subject && <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>{m.subject}</div>}
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
                    placeholder="Type your message…" />
                  <button className="btn btn-primary" onClick={handleSend} disabled={!newMsg.trim()}>
                    <Send size={15} />
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Compose modal */}
        {showCompose && (
          <div className="modal-overlay" onClick={() => setShowCompose(false)}>
            <div className="modal" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h3 className="modal-title">New Message</h3>
                <button className="btn btn-ghost btn-icon btn-sm" onClick={() => setShowCompose(false)}>✕</button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div className="input-group">
                  <label className="input-label">To</label>
                  <select className="input-field" value={composeTo} onChange={e => setComposeTo(e.target.value)}>
                    <option value="">Select recipient</option>
                    {allContacts.map(c => <option key={c.id} value={c.id}>{c.name} ({c.role.replace('_',' ')})</option>)}
                  </select>
                </div>
                <div className="input-group">
                  <label className="input-label">Subject</label>
                  <input className="input-field" value={composeSubject} onChange={e => setComposeSubject(e.target.value)} placeholder="Subject…" />
                </div>
                <div className="input-group">
                  <label className="input-label">Message</label>
                  <textarea className="input-field" value={composeBody} onChange={e => setComposeBody(e.target.value)} rows={5} placeholder="Write your message here…" />
                </div>
                <div className="flex gap-2">
                  <button className="btn btn-primary" onClick={handleCompose}><Send size={14} /> Send Message</button>
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
