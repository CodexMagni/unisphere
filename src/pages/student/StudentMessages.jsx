import { useState, useRef, useEffect } from 'react';
import PageHeader from '../../components/PageHeader';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { USERS, MODULES, ENROLMENTS } from '../../data/seed';
import { Send, Plus, MessageSquare } from 'lucide-react';

export default function StudentMessages() {
  const { user } = useAuth();
  const { messages, sendMessage } = useData();
  const [selectedContact, setSelectedContact] = useState(null);
  const [newMsg, setNewMsg] = useState('');
  const [showCompose, setShowCompose] = useState(false);
  const [composeTo, setComposeTo] = useState('');
  const [composeSubject, setComposeSubject] = useState('');
  const [composeBody, setComposeBody] = useState('');
  const bottomRef = useRef(null);

  // Build conversations
  const myMsgs = messages.filter(m => m.fromId === user?.id || m.toId === user?.id);
  const convos = {};
  myMsgs.forEach(m => {
    const otherId = m.fromId === user?.id ? m.toId : m.fromId;
    if (!convos[otherId]) convos[otherId] = [];
    convos[otherId].push(m);
  });

  // My lecturers (from enrolled modules)
  const myModuleIds = ENROLMENTS.filter(e => e.studentId === user?.id).map(e => e.moduleId);
  const myLecturerIds = [...new Set(MODULES.filter(m => myModuleIds.includes(m.id)).map(m => m.lecturer).filter(Boolean))];
  const myLecturers = myLecturerIds.map(id => USERS.find(u => u.id === id)).filter(Boolean);
  const mySuccessOfficers = USERS.filter(u => u.role === 'success_officer');

  const allContacts = [...myLecturers, ...mySuccessOfficers];

  const convoMessages = selectedContact
    ? (convos[selectedContact] || []).sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
    : [];
  const contactUser = selectedContact ? USERS.find(u => u.id === selectedContact) : null;

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [convoMessages.length]);

  const handleSend = () => {
    if (!newMsg.trim() || !selectedContact) return;
    sendMessage(user.id, selectedContact, `Message from ${user?.name}`, newMsg.trim());
    setNewMsg('');
  };

  const handleCompose = () => {
    if (!composeTo || !composeSubject.trim() || !composeBody.trim()) return;
    sendMessage(user.id, composeTo, composeSubject, composeBody);
    setShowCompose(false);
    setComposeTo(''); setComposeSubject(''); setComposeBody('');
    setSelectedContact(composeTo);
  };

  const formatTime = (ts) => new Date(ts).toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit' });

  return (
    <div>
      <PageHeader title="Messages" subtitle="Communicate with your lecturers and academic support"
        actions={<button className="btn btn-primary" onClick={() => setShowCompose(true)}><Plus size={14} /> New Message</button>} />
      <div className="page-body">
        <div className="card" style={{ padding: 0, display: 'flex', height: 600, overflow: 'hidden' }}>
          {/* Left sidebar - contacts */}
          <div style={{ width: 280, borderRight: '1px solid var(--surface-dark)', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--surface-dark)' }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Conversations</div>
            </div>

            <div style={{ flex: 1, overflowY: 'auto' }}>
              {Object.keys(convos).length === 0 && (
                <div style={{ padding: 32, textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>
                  No conversations yet.<br />Start by messaging your lecturer.
                </div>
              )}
              {Object.entries(convos).map(([id, msgs]) => {
                const contact = USERS.find(u => u.id === id);
                const last = [...msgs].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0];
                const unread = msgs.filter(m => m.toId === user?.id && !m.read).length;
                return (
                  <div key={id} onClick={() => setSelectedContact(id)}
                    style={{
                      display: 'flex', gap: 10, padding: '12px 16px',
                      background: selectedContact === id ? 'var(--gold-pale)' : unread ? 'var(--gold-pale)' : 'transparent',
                      cursor: 'pointer', borderBottom: '1px solid var(--surface-mid)',
                      borderLeft: selectedContact === id ? '3px solid var(--gold)' : '3px solid transparent'
                    }}>
                    <div className="avatar" style={{ background: 'var(--navy)', color: 'var(--gold)', fontSize: 13 }}>
                      {contact?.avatar}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="flex items-center justify-between">
                        <span style={{ fontWeight: unread ? 700 : 500, fontSize: 13 }}>{contact?.name}</span>
                        {unread > 0 && <span style={{ background: 'var(--danger)', color: 'white', borderRadius: 100, fontSize: 10, padding: '1px 5px', fontWeight: 700 }}>{unread}</span>}
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)' }} className="truncate">{last?.body?.slice(0, 50)}</div>
                      <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>
                        {contact?.role === 'lecturer' ? 'Lecturer' : 'Success Officer'}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick contact section */}
            <div style={{ padding: '12px 16px', borderTop: '1px solid var(--surface-dark)' }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase' }}>My Lecturers</div>
              {myLecturers.map(lec => (
                <div key={lec.id} onClick={() => setSelectedContact(lec.id)}
                  style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0', cursor: 'pointer' }}>
                  <div className="avatar" style={{ width: 28, height: 28, background: 'var(--navy)', color: 'var(--gold)', fontSize: 11 }}>{lec.avatar}</div>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 500 }}>{lec.name}</div>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>
                      {MODULES.filter(m => m.lecturer === lec.id && myModuleIds.includes(m.id)).map(m => m.code).join(', ')}
                    </div>
                  </div>
                </div>
              ))}
              {mySuccessOfficers.map(o => (
                <div key={o.id} onClick={() => setSelectedContact(o.id)}
                  style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0', cursor: 'pointer' }}>
                  <div className="avatar" style={{ width: 28, height: 28, background: '#dbeafe', color: 'var(--info)', fontSize: 11 }}>{o.avatar}</div>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 500 }}>{o.name}</div>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>Success Officer</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Chat area */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--surface)' }}>
            {!selectedContact ? (
              <div className="empty-state" style={{ flex: 1 }}>
                <MessageSquare size={40} color="var(--text-muted)" />
                <h4 style={{ marginTop: 12 }}>Send a message to your lecturer</h4>
                <p style={{ maxWidth: 260, textAlign: 'center' }}>Select a conversation or start a new one. Your lecturers are here to help.</p>
                <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={() => setShowCompose(true)}>
                  <Plus size={14} /> Start a conversation
                </button>
              </div>
            ) : (
              <>
                <div style={{ padding: '14px 20px', background: 'white', borderBottom: '1px solid var(--surface-dark)', display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div className="avatar" style={{ background: 'var(--navy)', color: 'var(--gold)', fontSize: 14 }}>{contactUser?.avatar}</div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{contactUser?.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                      {contactUser?.role === 'lecturer' ? `Lecturer · ${MODULES.filter(m => m.lecturer === contactUser.id && myModuleIds.includes(m.id)).map(m => m.code).join(', ')}` : 'Student Success Officer'}
                    </div>
                  </div>
                </div>

                <div className="chat-messages" style={{ flex: 1, background: 'var(--surface)' }}>
                  {convoMessages.length === 0 && (
                    <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: 13, padding: 24 }}>
                      No messages yet. Start the conversation below.
                    </div>
                  )}
                  {convoMessages.map(m => {
                    const isSent = m.fromId === user?.id;
                    return (
                      <div key={m.id} style={{ display: 'flex', flexDirection: 'column', alignItems: isSent ? 'flex-end' : 'flex-start' }}>
                        {m.subject && <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4, fontStyle: 'italic' }}>{m.subject}</div>}
                        <div className={`chat-bubble ${isSent ? 'sent' : 'received'}`}>
                          {m.body}
                          <div className="chat-bubble-time">{formatTime(m.timestamp)}</div>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={bottomRef} />
                </div>

                <div className="chat-input-area" style={{ background: 'white', borderTop: '1px solid var(--surface-dark)' }}>
                  <input className="input-field" style={{ flex: 1, background: 'var(--surface)' }}
                    value={newMsg} onChange={e => setNewMsg(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                    placeholder={`Message ${contactUser?.name?.split(' ')[0]}…`} />
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
                <button className="btn btn-ghost btn-sm btn-icon" onClick={() => setShowCompose(false)}>✕</button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div className="input-group">
                  <label className="input-label">To</label>
                  <select className="input-field" value={composeTo} onChange={e => setComposeTo(e.target.value)}>
                    <option value="">Select recipient</option>
                    <optgroup label="My Lecturers">
                      {myLecturers.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                    </optgroup>
                    <optgroup label="Student Support">
                      {mySuccessOfficers.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
                    </optgroup>
                  </select>
                </div>
                <div className="input-group">
                  <label className="input-label">Subject</label>
                  <input className="input-field" value={composeSubject} onChange={e => setComposeSubject(e.target.value)} placeholder="e.g. Question about Assignment 2" />
                </div>
                <div className="input-group">
                  <label className="input-label">Message</label>
                  <textarea className="input-field" value={composeBody} onChange={e => setComposeBody(e.target.value)} rows={5} placeholder="Write your message here…" />
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
