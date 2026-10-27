import PageHeader from '../../components/PageHeader';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { MODULES, ASSESSMENTS, ENROLMENTS } from '../../data/seed';

export default function StudentGrades() {
  const { user } = useAuth();
  const { grades } = useData();

  const myModuleIds = ENROLMENTS.filter(e => e.studentId === user?.id).map(e => e.moduleId);
  const myModules = MODULES.filter(m => myModuleIds.includes(m.id));

  return (
    <div>
      <PageHeader title="Results" subtitle="Your academic performance this semester" />
      <div className="page-body">
        {myModules.map(mod => {
          const modAssessments = ASSESSMENTS.filter(a => a.moduleId === mod.id);
          const modGrades = grades.filter(g => g.studentId === user?.id && modAssessments.some(a => a.id === g.assessmentId));
          const totalWeighted = modGrades.reduce((s, g) => {
            const a = modAssessments.find(a => a.id === g.assessmentId);
            return a ? s + (g.mark / a.totalMarks) * a.weight : s;
          }, 0);
          const totalWeight = modGrades.reduce((s, g) => {
            const a = modAssessments.find(a => a.id === g.assessmentId);
            return a ? s + a.weight : s;
          }, 0);
          const currentMark = totalWeight > 0 ? Math.round(totalWeighted / totalWeight * 100) : null;

          return (
            <div key={mod.id} className="card" style={{ marginBottom: 20 }}>
              <div className="flex items-center justify-between" style={{ marginBottom: 16 }}>
                <div>
                  <h3>{mod.name}</h3>
                  <p style={{ fontSize: 13, marginTop: 2 }}>{mod.code} · Semester {mod.semester}</p>
                </div>
                {currentMark !== null && (
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontFamily: 'Sora', fontSize: 28, fontWeight: 800, color: currentMark >= 75 ? 'var(--success)' : currentMark >= 50 ? 'var(--warning)' : 'var(--danger)' }}>
                      {currentMark}%
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Current mark</div>
                  </div>
                )}
              </div>

              <div className="table-wrapper">
                <table>
                  <thead><tr>
                    <th>Assessment</th><th>Type</th><th>Weight</th><th>Due</th><th>Mark</th><th>Percentage</th><th>Feedback</th>
                  </tr></thead>
                  <tbody>
                    {modAssessments.map(a => {
                      const g = grades.find(gr => gr.assessmentId === a.id && gr.studentId === user?.id);
                      const pct = g ? Math.round((g.mark / a.totalMarks) * 100) : null;
                      return (
                        <tr key={a.id}>
                          <td style={{ fontWeight: 500, color: 'var(--text-primary)', fontSize: 13 }}>{a.title}</td>
                          <td><span className="badge badge-neutral">{a.type}</span></td>
                          <td style={{ fontSize: 13 }}>{a.weight}%</td>
                          <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>{a.dueDate}</td>
                          <td style={{ fontWeight: 700, color: pct !== null ? (pct >= 50 ? 'var(--success)' : 'var(--danger)') : 'var(--text-muted)' }}>
                            {g ? `${g.mark}/${a.totalMarks}` : '—'}
                          </td>
                          <td>
                            {pct !== null ? (
                              <div>
                                <div style={{ fontWeight: 700, color: pct >= 75 ? 'var(--success)' : pct >= 50 ? 'var(--warning)' : 'var(--danger)', fontSize: 14 }}>{pct}%</div>
                                <div className="progress-bar" style={{ marginTop: 4 }}>
                                  <div className="progress-fill" style={{ width: `${pct}%`, background: pct >= 75 ? 'var(--success)' : pct >= 50 ? 'var(--warning)' : 'var(--danger)' }} />
                                </div>
                              </div>
                            ) : <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>Not yet graded</span>}
                          </td>
                          <td style={{ fontSize: 12, color: 'var(--text-secondary)', maxWidth: 200 }}>{g?.feedback || '—'}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
