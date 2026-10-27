import PageHeader from '../../components/PageHeader';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { MODULES, ENROLMENTS, ASSESSMENTS, ANNOUNCEMENTS, USERS } from '../../data/seed';

export default function StudentModules() {
  const { user } = useAuth();
  const { grades, attendance } = useData();
  const myModuleIds = ENROLMENTS.filter(e => e.studentId === user?.id).map(e => e.moduleId);
  const myModules = MODULES.filter(m => myModuleIds.includes(m.id));

  return (
    <div>
      <PageHeader title="My Modules" subtitle="Enrolled modules this semester" />
      <div className="page-body">
        {myModules.map(mod => {
          const lecturer = USERS.find(u => u.id === mod.lecturer);
          const att = attendance.find(a => a.studentId === user?.id && a.moduleId === mod.id);
          const modAssessments = ASSESSMENTS.filter(a => a.moduleId === mod.id);
          const modGrades = grades.filter(g => g.studentId === user?.id && modAssessments.some(a => a.id === g.assessmentId));
          const announcements = ANNOUNCEMENTS.filter(a => a.moduleId === mod.id);
          const avg = modGrades.length > 0
            ? Math.round(modGrades.reduce((s, g) => {
                const a = modAssessments.find(a => a.id === g.assessmentId);
                return a ? s + (g.mark / a.totalMarks) * 100 : s;
              }, 0) / modGrades.length) : null;

          return (
            <div key={mod.id} className="card" style={{ marginBottom: 20 }}>
              <div className="flex items-center justify-between" style={{ marginBottom: 16 }}>
                <div>
                  <div className="flex items-center gap-3">
                    <span className="badge badge-navy">{mod.code}</span>
                    <h3 style={{ fontFamily: 'Sora', fontSize: 18 }}>{mod.name}</h3>
                  </div>
                  <p style={{ fontSize: 13, marginTop: 6 }}>
                    Lecturer: <strong>{lecturer?.name}</strong> · {mod.credits} credits · Semester {mod.semester}
                  </p>
                </div>
                {avg !== null && (
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontFamily: 'Sora', fontWeight: 800, fontSize: 28, color: avg >= 75 ? 'var(--success)' : avg >= 50 ? 'var(--warning)' : 'var(--danger)' }}>
                      {avg}%
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>avg mark</div>
                  </div>
                )}
              </div>

              <div className="page-grid-3" style={{ gap: 12, marginBottom: 20 }}>
                <div style={{ background: 'var(--surface)', borderRadius: 'var(--radius-md)', padding: '12px 14px' }}>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>ATTENDANCE</div>
                  <div style={{ fontWeight: 700, fontSize: 20, color: att ? (att.percentage < 75 ? 'var(--danger)' : 'var(--success)') : 'var(--text-muted)' }}>
                    {att ? `${att.percentage.toFixed(0)}%` : '—'}
                  </div>
                  {att && <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{att.attended}/{att.total} sessions</div>}
                </div>
                <div style={{ background: 'var(--surface)', borderRadius: 'var(--radius-md)', padding: '12px 14px' }}>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>ASSESSMENTS</div>
                  <div style={{ fontWeight: 700, fontSize: 20 }}>{modAssessments.length}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{modGrades.length} graded</div>
                </div>
                <div style={{ background: 'var(--surface)', borderRadius: 'var(--radius-md)', padding: '12px 14px' }}>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>CAPACITY</div>
                  <div style={{ fontWeight: 700, fontSize: 20 }}>{mod.enrolled}/{mod.capacity}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>students enrolled</div>
                </div>
              </div>

              {att && (
                <div style={{ marginBottom: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontSize: 12, color: 'var(--text-muted)' }}>
                    <span>Attendance</span>
                    <span>{att.percentage.toFixed(1)}%</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${att.percentage}%`, background: att.percentage < 75 ? 'var(--danger)' : 'var(--success)' }} />
                  </div>
                  {att.percentage < 75 && (
                    <div style={{ fontSize: 12, color: 'var(--danger)', marginTop: 6 }}>⚠ Your attendance is below the 75% threshold. Please attend classes regularly.</div>
                  )}
                </div>
              )}

              {announcements.length > 0 && (
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 8 }}>Latest Announcements</div>
                  {announcements.slice(-2).map(a => (
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
      </div>
    </div>
  );
}
