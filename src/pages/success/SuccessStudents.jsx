import PageHeader from '../../components/PageHeader';
import { useData } from '../../contexts/DataContext';
import { USERS, ENROLMENTS } from '../../data/seed';
import { useNavigate } from 'react-router-dom';
import { MessageSquare } from 'lucide-react';

export default function SuccessStudents() {
  const { riskCases } = useData();
  const navigate = useNavigate();
  const students = USERS.filter(u => u.role === 'student');

  return (
    <div>
      <PageHeader title="All Students" subtitle="Student roster with academic status" />
      <div className="page-body">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
          {students.map(s => {
            const rc = riskCases.find(r => r.studentId === s.id);
            const enrolCount = ENROLMENTS.filter(e => e.studentId === s.id).length;
            return (
              <div key={s.id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div className="flex items-center gap-12">
                  <div className="avatar" style={{ width: 48, height: 48, background: rc ? (rc.priority === 'high' ? '#fee2e2' : '#fef3c7') : 'var(--gold)', color: rc ? (rc.priority === 'high' ? 'var(--danger)' : '#92400e') : 'var(--navy)', fontSize: 16 }}>
                    {s.avatar}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 15 }}>{s.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{s.studentId}</div>
                  </div>
                  {rc && <span className={`badge badge-${rc.priority === 'high' ? 'danger' : 'warning'}`}>At Risk</span>}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{s.programme} · Year {s.year}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{enrolCount} modules enrolled</div>
                </div>
                {rc && (
                  <div style={{ background: 'var(--surface)', borderRadius: 'var(--radius-md)', padding: '8px 12px' }}>
                    <div style={{ fontSize: 12, color: 'var(--danger)', fontWeight: 500 }}>{rc.triggers[0]}</div>
                  </div>
                )}
                <button className="btn btn-ghost btn-sm" onClick={() => navigate('/success/messages')}>
                  <MessageSquare size={13} /> Send Message
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
