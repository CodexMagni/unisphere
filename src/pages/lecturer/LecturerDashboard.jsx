import PageHeader from '../../components/PageHeader';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { MODULES, USERS, ENROLMENTS, ASSESSMENTS } from '../../data/seed';
import { Users, AlertTriangle, ClipboardList, BookOpen } from 'lucide-react';

export default function LecturerDashboard() {
  const { user } = useAuth();
  const { grades, riskCases, attendance } = useData();

  const myModules = MODULES.filter(m => m.lecturer === user?.id);
  const myStudentIds = [...new Set(ENROLMENTS.filter(e => myModules.some(m => m.id === e.moduleId)).map(e => e.studentId))];
  const myRiskCases = riskCases.filter(rc => myStudentIds.includes(rc.studentId));
  const highRisk = myRiskCases.filter(r => r.priority === 'high');

  return (
    <div>
      <PageHeader title={`Welcome, ${user?.name?.split(' ')[1] || ''}`} subtitle="Your teaching overview for this semester" />
      <div className="page-body">
        <div className="stats-grid" style={{ marginBottom: 24 }}>
          {[
            { label: 'My Modules', value: myModules.length, icon: BookOpen, color: 'navy', bg: '#e8ecf7', ic: 'var(--navy)' },
            { label: 'Students Enrolled', value: myStudentIds.length, icon: Users, color: 'gold', bg: '#fdf4e0', ic: 'var(--gold)' },
            { label: 'At-Risk Students', value: myRiskCases.length, icon: AlertTriangle, color: 'danger', bg: '#fee2e2', ic: 'var(--danger)' },
            { label: 'Grades Recorded', value: grades.length, icon: ClipboardList, color: 'success', bg: '#d1fae5', ic: 'var(--success)' },
          ].map(s => (
            <div key={s.label} className={`stat-card ${s.color}`}>
              <div className="stat-icon" style={{ background: s.bg }}><s.icon size={18} color={s.ic} /></div>
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="page-grid-2">
          <div className="card">
            <h3 style={{ marginBottom: 16 }}>My Modules</h3>
            {myModules.map(m => (
              <div key={m.id} style={{ padding: '12px 0', borderBottom: '1px solid var(--surface-mid)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: 14 }}>{m.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{m.code} · Sem {m.semester} · Year {m.year}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 700, fontSize: 16, color: 'var(--navy)' }}>{m.enrolled}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>students</div>
                </div>
              </div>
            ))}
          </div>

          <div className="card">
            <div className="flex items-center justify-between" style={{ marginBottom: 16 }}>
              <h3>At-Risk Students</h3>
              {highRisk.length > 0 && <span className="badge badge-danger">{highRisk.length} urgent</span>}
            </div>
            {myRiskCases.length === 0 ? (
              <div className="empty-state" style={{ padding: 32 }}>
                <AlertTriangle size={32} />
                <p>No at-risk students flagged</p>
              </div>
            ) : myRiskCases.map(rc => {
              const student = USERS.find(u => u.id === rc.studentId);
              return (
                <div key={rc.id} style={{ padding: '12px 0', borderBottom: '1px solid var(--surface-mid)' }}>
                  <div className="flex items-center gap-3">
                    <div className="avatar" style={{ background: rc.priority === 'high' ? '#fee2e2' : '#fef3c7', color: rc.priority === 'high' ? 'var(--danger)' : 'var(--warning)', fontSize: 13 }}>
                      {student?.avatar}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: 13 }}>{student?.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{rc.triggers[0]}</div>
                    </div>
                    <span className={`badge badge-${rc.priority === 'high' ? 'danger' : 'warning'}`}>{rc.priority}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
