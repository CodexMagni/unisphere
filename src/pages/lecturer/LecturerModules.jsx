import { useState } from 'react';
import PageHeader from '../../components/PageHeader';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { MODULES, ASSESSMENTS, ENROLMENTS, USERS, ANNOUNCEMENTS } from '../../data/seed';
import { Plus, Megaphone } from 'lucide-react';

export default function LecturerModules() {
  const { user } = useAuth();
  const { announcements, addAnnouncement } = useData();
  const [showAnnounce, setShowAnnounce] = useState(false);
  const [annModule, setAnnModule] = useState('');
  const [annTitle, setAnnTitle] = useState('');
  const [annBody, setAnnBody] = useState('');

  const myModules = MODULES.filter(m => m.lecturer === user?.id);

  const handleAnnounce = () => {
    if (!annModule || !annTitle || !annBody) return;
    addAnnouncement(annModule, annTitle, annBody, user.id);
    setShowAnnounce(false); setAnnTitle(''); setAnnBody(''); setAnnModule('');
  };

  return (
    <div>
      <PageHeader title="My Modules" subtitle="Modules you are teaching this semester"
        actions={<button className="btn btn-primary" onClick={() => setShowAnnounce(true)}><Megaphone size={14} /> Post Announcement</button>} />
      <div className="page-body">
        {myModules.map(mod => {
          const students = ENROLMENTS.filter(e => e.moduleId === mod.id).map(e => USERS.find(u => u.id === e.studentId)).filter(Boolean);
          const modAssessments = ASSESSMENTS.filter(a => a.moduleId === mod.id);
          const modAnnouncements = announcements.filter(a => a.moduleId === mod.id);
          return (
            <div key={mod.id} className="card" style={{ marginBottom: 20 }}>
              <div className="flex items-center justify-between" style={{ marginBottom: 16 }}>
                <div>
                  <h3>{mod.name}</h3>
                  <p style={{ fontSize: 13, marginTop: 4 }}>{mod.code} · Semester {mod.semester}, Year {mod.year} · {mod.credits} credits</p>
                </div>
                <div className="flex gap-2">
                  <span className="badge badge-info">{mod.enrolled}/{mod.capacity} enrolled</span>
                </div>
              </div>
              <div className="page-grid-3" style={{ gap: 12, marginBottom: 16 }}>
                <div style={{ background: 'var(--surface)', borderRadius: 'var(--radius-md)', padding: '12px 14px' }}>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>STUDENTS</div>
                  <div style={{ fontWeight: 700, fontSize: 20 }}>{students.length}</div>
                </div>
                <div style={{ background: 'var(--surface)', borderRadius: 'var(--radius-md)', padding: '12px 14px' }}>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>ASSESSMENTS</div>
                  <div style={{ fontWeight: 700, fontSize: 20 }}>{modAssessments.length}</div>
                </div>
                <div style={{ background: 'var(--surface)', borderRadius: 'var(--radius-md)', padding: '12px 14px' }}>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>ANNOUNCEMENTS</div>
                  <div style={{ fontWeight: 700, fontSize: 20 }}>{modAnnouncements.length}</div>
                </div>
              </div>
              {modAnnouncements.length > 0 && (
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 8 }}>Recent Announcements</div>
                  {modAnnouncements.slice(-2).map(a => (
                    <div key={a.id} style={{ padding: '10px 14px', background: 'var(--gold-pale)', borderRadius: 'var(--radius-md)', marginBottom: 6, borderLeft: '3px solid var(--gold)' }}>
                      <div style={{ fontWeight: 600, fontSize: 13 }}>{a.title}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>{a.body}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>{a.date}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {showAnnounce && (
          <div className="modal-overlay" onClick={() => setShowAnnounce(false)}>
            <div className="modal" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h3 className="modal-title">Post Announcement</h3>
                <button className="btn btn-ghost btn-sm btn-icon" onClick={() => setShowAnnounce(false)}>✕</button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div className="input-group">
                  <label className="input-label">Module</label>
                  <select className="input-field" value={annModule} onChange={e => setAnnModule(e.target.value)}>
                    <option value="">Select module…</option>
                    {myModules.map(m => <option key={m.id} value={m.id}>{m.code} — {m.name}</option>)}
                  </select>
                </div>
                <div className="input-group">
                  <label className="input-label">Title</label>
                  <input className="input-field" value={annTitle} onChange={e => setAnnTitle(e.target.value)} placeholder="Announcement title…" />
                </div>
                <div className="input-group">
                  <label className="input-label">Message</label>
                  <textarea className="input-field" value={annBody} onChange={e => setAnnBody(e.target.value)} rows={4} placeholder="Write announcement…" />
                </div>
                <div className="flex gap-2">
                  <button className="btn btn-primary" onClick={handleAnnounce}><Megaphone size={14} /> Post</button>
                  <button className="btn btn-ghost" onClick={() => setShowAnnounce(false)}>Cancel</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
