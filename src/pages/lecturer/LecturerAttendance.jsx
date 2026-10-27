import { useState } from 'react';
import PageHeader from '../../components/PageHeader';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { MODULES, USERS, ENROLMENTS } from '../../data/seed';
import { CheckSquare, Square, Save } from 'lucide-react';

export default function LecturerAttendance() {
  const { user } = useAuth();
  const { attendance, addToast } = useData();
  const [selectedModule, setSelectedModule] = useState('m1');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [present, setPresent] = useState({});
  const [saved, setSaved] = useState(false);

  const myModules = MODULES.filter(m => m.lecturer === user?.id);
  const moduleStudents = ENROLMENTS.filter(e => e.moduleId === selectedModule).map(e => USERS.find(u => u.id === e.studentId)).filter(Boolean);

  const getAttendance = (studentId) => attendance.find(a => a.studentId === studentId && a.moduleId === selectedModule);

  const toggle = (sid) => setPresent(p => ({ ...p, [sid]: !p[sid] }));

  const saveAttendance = () => {
    setSaved(true);
    addToast({ type: 'success', title: 'Attendance saved', body: `${Object.values(present).filter(Boolean).length} students marked present for ${date}.` });
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div>
      <PageHeader title="Attendance" subtitle="Record and view class attendance" />
      <div className="page-body">
        <div className="card" style={{ marginBottom: 20 }}>
          <div className="flex gap-4" style={{ flexWrap: 'wrap' }}>
            <div className="input-group" style={{ flex: 1, minWidth: 200 }}>
              <label className="input-label">Module</label>
              <select className="input-field" value={selectedModule} onChange={e => { setSelectedModule(e.target.value); setPresent({}); }}>
                {myModules.map(m => <option key={m.id} value={m.id}>{m.code} — {m.name}</option>)}
              </select>
            </div>
            <div className="input-group" style={{ width: 180 }}>
              <label className="input-label">Date</label>
              <input className="input-field" type="date" value={date} onChange={e => setDate(e.target.value)} />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between" style={{ marginBottom: 16 }}>
            <h3>Class Register — {date}</h3>
            <div className="flex gap-2">
              <button className="btn btn-ghost btn-sm" onClick={() => {
                const all = {};
                moduleStudents.forEach(s => all[s.id] = true);
                setPresent(all);
              }}>Mark All Present</button>
              <button className="btn btn-primary btn-sm" onClick={saveAttendance}>
                <Save size={13} /> Save Register
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {moduleStudents.map(student => {
              const att = getAttendance(student.id);
              const isPresent = present[student.id] ?? false;
              const risk = att && att.percentage < 75;
              return (
                <div key={student.id} style={{
                  display: 'flex', alignItems: 'center', gap: 14, padding: '14px 0',
                  borderBottom: '1px solid var(--surface-mid)',
                  background: isPresent ? 'rgba(16,185,129,0.03)' : 'transparent'
                }}>
                  <button onClick={() => toggle(student.id)}
                    style={{ background: 'none', color: isPresent ? 'var(--success)' : 'var(--text-muted)', flexShrink: 0 }}>
                    {isPresent ? <CheckSquare size={22} /> : <Square size={22} />}
                  </button>
                  <div className="avatar" style={{ background: 'var(--surface-mid)', color: 'var(--text-secondary)', fontSize: 13 }}>
                    {student.avatar}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--text-primary)' }}>{student.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{student.studentId}</div>
                  </div>
                  {att && (
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: risk ? 'var(--danger)' : 'var(--success)' }}>
                        {att.percentage.toFixed(0)}%
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{att.attended}/{att.total} sessions</div>
                      {risk && <span className="badge badge-danger" style={{ fontSize: 10, marginTop: 2 }}>Below threshold</span>}
                    </div>
                  )}
                  <span style={{ fontWeight: 600, fontSize: 13, color: isPresent ? 'var(--success)' : 'var(--text-muted)', minWidth: 60, textAlign: 'right' }}>
                    {isPresent ? 'Present' : 'Absent'}
                  </span>
                </div>
              );
            })}
          </div>

          <div style={{ marginTop: 16, padding: '12px 0', borderTop: '1px solid var(--surface-dark)', display: 'flex', gap: 24, fontSize: 13 }}>
            <span>Present: <strong style={{ color: 'var(--success)' }}>{Object.values(present).filter(Boolean).length}</strong></span>
            <span>Absent: <strong style={{ color: 'var(--danger)' }}>{moduleStudents.length - Object.values(present).filter(Boolean).length}</strong></span>
            <span>Total: <strong>{moduleStudents.length}</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
}
