import PageHeader from '../../components/PageHeader';
import { useData } from '../../contexts/DataContext';
import { USERS } from '../../data/seed';
import { CheckCircle, Clock } from 'lucide-react';

export default function SuccessInterventions() {
  const { riskCases } = useData();
  const allInterventions = riskCases.flatMap(rc => rc.interventions.map(i => ({
    ...i, studentId: rc.studentId, caseId: rc.id
  }))).sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div>
      <PageHeader title="Interventions" subtitle="All recorded support actions" />
      <div className="page-body">
        <div className="card">
          <div className="table-wrapper">
            <table>
              <thead><tr><th>Date</th><th>Student</th><th>Action</th><th>Outcome</th><th>By</th></tr></thead>
              <tbody>
                {allInterventions.map(i => {
                  const student = USERS.find(u => u.id === i.studentId);
                  const officer = USERS.find(u => u.id === i.by);
                  return (
                    <tr key={i.id}>
                      <td style={{ fontSize: 12, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{i.date}</td>
                      <td>
                        <div className="flex items-center gap-2">
                          <div className="avatar" style={{ width: 28, height: 28, background: 'var(--surface-mid)', fontSize: 11 }}>{student?.avatar}</div>
                          <div>
                            <div style={{ fontWeight: 600, fontSize: 13 }}>{student?.name}</div>
                            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{student?.studentId}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>{i.action}</td>
                      <td>
                        <div className="flex items-center gap-2">
                          {i.outcome === 'Pending response' ? <Clock size={13} color="var(--warning)" /> : <CheckCircle size={13} color="var(--success)" />}
                          <span style={{ fontSize: 13 }}>{i.outcome}</span>
                        </div>
                      </td>
                      <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>{officer?.name?.split(' ').slice(0,2).join(' ')}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {allInterventions.length === 0 && (
            <div className="empty-state"><CheckCircle size={36} /><h4>No interventions yet</h4><p>Log your first intervention from an at-risk case.</p></div>
          )}
        </div>
      </div>
    </div>
  );
}
