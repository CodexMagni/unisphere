import PageHeader from '../../components/PageHeader';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { MODULES, ASSESSMENTS, ENROLMENTS, TIMETABLE, ANNOUNCEMENTS } from '../../data/seed';
import { BookOpen, AlertTriangle, MessageSquare, Bell } from 'lucide-react';

export default function StudentDashboard() {
  const { user } = useAuth();
  const { grades, riskCases, messages, notifications, attendance } = useData();

  const myEnrolments = ENROLMENTS.filter(e => e.studentId === user?.id);
  const myModuleIds = myEnrolments.map(e => e.moduleId);
  const myModules = MODULES.filter(m => myModuleIds.includes(m.id));
  const myRisk = riskCases.find(rc => rc.studentId === user?.id);
  const myGrades = grades.filter(g => g.studentId === user?.id);
  const unreadMsgs = messages.filter(m => m.toId === user?.id && !m.read).length;
  const unreadNotifs = notifications.filter(n => n.userId === user?.id && !n.read).length;

  const todayDay = new Date().toLocaleDateString('en-ZA', { weekday: 'long' });
  const todayClasses = TIMETABLE.filter(t => myModuleIds.includes(t.moduleId) && t.day === todayDay);
  const upcoming = ASSESSMENTS.filter(a => myModuleIds.includes(a.moduleId) && new Date(a.dueDate) > new Date())
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate)).slice(0, 3);

  const avgMark = myGrades.length > 0
    ? Math.round(myGrades.reduce((s, g) => {
        const a = ASSESSMENTS.find(a => a.id === g.assessmentId);
        return a ? s + (g.mark / a.totalMarks) * 100 : s;
      }, 0) / myGrades.length)
    : null;

  const myAnnouncements = ANNOUNCEMENTS.filter(a => myModuleIds.includes(a.moduleId)).slice(0, 3);

  return (
    <div>
      <PageHeader title={`Hello, ${user?.name?.split(' ')[0]}`} subtitle={`${user?.programme} · Year ${user?.year} · ${user?.studentId}`} />
      <div className="page-body">
        {myRisk && (
          <div style={{
            background: myRisk.priority === 'high' ? '#fef2f2' : '#fefce8',
            border: `1.5px solid ${myRisk.priority === 'high' ? '#fecaca' : '#fde68a'}`,
            borderRadius: 'var(--radius-lg)', padding: '16px 20px', marginBottom: 24,
            display: 'flex', gap: 14, alignItems: 'flex-start'
          }}>
            <AlertTriangle size={20} color={myRisk.priority === 'high' ? 'var(--danger)' : 'var(--warning)'} style={{ flexShrink: 0, marginTop: 2 }} />
            <div>
              <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--text-primary)', marginBottom: 4 }}>
                Your academic success officer has flagged your account for support
              </div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                {myRisk.triggers.join(' · ')}
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>
                This is not a penalty — it means help is available. Please check your messages.
              </div>
            </div>
          </div>
        )}

        <div className="stats-grid" style={{ marginBottom: 24 }}>
          {[
            { label: 'Modules Enrolled', value: myModules.length, color: 'navy', bg: '#e8ecf7', ic: 'var(--navy)', Icon: BookOpen },
            { label: 'Current Average', value: avgMark !== null ? `${avgMark}%` : '—', color: avgMark !== null && avgMark < 50 ? 'danger' : 'success', bg: avgMark !== null && avgMark < 50 ? '#fee2e2' : '#d1fae5', ic: avgMark !== null && avgMark < 50 ? 'var(--danger)' : 'var(--success)', Icon: BookOpen },
            { label: 'Unread Messages', value: unreadMsgs, color: 'info', bg: '#dbeafe', ic: 'var(--info)', Icon: MessageSquare },
            { label: 'Notifications', value: unreadNotifs, color: 'warning', bg: '#fef3c7', ic: 'var(--warning)', Icon: Bell },
          ].map(s => (
            <div key={s.label} className={`stat-card ${s.color}`}>
              <div className="stat-icon" style={{ background: s.bg }}><s.Icon size={18} color={s.ic} /></div>
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="page-grid-2" style={{ gap: 20 }}>
          <div className="card">
            <h3 style={{ marginBottom: 16 }}>Today's Classes {todayClasses.length === 0 && <span className="badge badge-neutral" style={{ marginLeft: 8 }}>No classes today</span>}</h3>
            {todayClasses.map(t => {
              const mod = MODULES.find(m => m.id === t.moduleId);
              return (
                <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 0', borderBottom: '1px solid var(--surface-mid)' }}>
                  <div style={{ width: 4, height: 40, borderRadius: 2, background: t.type === 'lecture' ? 'var(--navy)' : 'var(--gold)', flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 13 }}>{mod?.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{t.time} · {t.room}</div>
                  </div>
                  <span className={`badge ${t.type === 'lecture' ? 'badge-navy' : 'badge-warning'}`}>{t.type}</span>
                </div>
              );
            })}
            {todayClasses.length === 0 && <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>Enjoy your free day!</p>}
          </div>

          <div className="card">
            <h3 style={{ marginBottom: 16 }}>Upcoming Assessments</h3>
            {upcoming.map(a => {
              const mod = MODULES.find(m => m.id === a.moduleId);
              const daysLeft = Math.ceil((new Date(a.dueDate) - new Date()) / (1000 * 60 * 60 * 24));
              const g = grades.find(gr => gr.assessmentId === a.id && gr.studentId === user?.id);
              return (
                <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: '1px solid var(--surface-mid)' }}>
                  <div style={{ width: 46, height: 46, borderRadius: 'var(--radius-md)', background: daysLeft <= 3 ? '#fee2e2' : 'var(--surface-mid)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <div style={{ fontWeight: 800, fontSize: 16, color: daysLeft <= 3 ? 'var(--danger)' : 'var(--navy)', lineHeight: 1 }}>{daysLeft}</div>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>days</div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 13 }}>{a.title}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{mod?.code} · Due {a.dueDate}</div>
                  </div>
                  {g ? <span className="badge badge-success">{Math.round(g.mark/a.totalMarks*100)}%</span> : <span className="badge badge-neutral">Pending</span>}
                </div>
              );
            })}
          </div>

          <div className="card">
            <h3 style={{ marginBottom: 16 }}>My Modules</h3>
            {myModules.map(m => {
              const att = attendance.find(a => a.studentId === user?.id && a.moduleId === m.id);
              return (
                <div key={m.id} style={{ padding: '12px 0', borderBottom: '1px solid var(--surface-mid)' }}>
                  <div className="flex items-center justify-between">
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--text-primary)' }}>{m.name}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{m.code}</div>
                    </div>
                    {att && (
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontWeight: 700, fontSize: 13, color: att.percentage < 75 ? 'var(--danger)' : 'var(--success)' }}>
                          {att.percentage.toFixed(0)}%
                        </div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>attendance</div>
                      </div>
                    )}
                  </div>
                  {att && (
                    <div className="progress-bar" style={{ marginTop: 8 }}>
                      <div className="progress-fill" style={{ width: `${att.percentage}%`, background: att.percentage < 75 ? 'var(--danger)' : 'var(--success)' }} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="card">
            <h3 style={{ marginBottom: 16 }}>Announcements</h3>
            {myAnnouncements.length === 0 ? <p>No announcements yet.</p> :
              myAnnouncements.map(a => {
                const mod = MODULES.find(m => m.id === a.moduleId);
                return (
                  <div key={a.id} style={{ padding: '12px 0', borderBottom: '1px solid var(--surface-mid)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span className="badge badge-navy" style={{ fontSize: 10 }}>{mod?.code}</span>
                      <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{a.date}</span>
                    </div>
                    <div style={{ fontWeight: 600, fontSize: 13 }}>{a.title}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4 }}>{a.body}</div>
                  </div>
                );
              })
            }
          </div>
        </div>
      </div>
    </div>
  );
}
