import PageHeader from '../../components/PageHeader';
import { Shield } from 'lucide-react';

const AUDIT_LOGS = [
  { id: 1, actor: 'Admin Mokoena', action: 'Application status changed to accepted', target: 'Sipho Mahlangu (app3)', timestamp: '2025-04-20T11:32:00', category: 'admissions' },
  { id: 2, actor: 'System', action: 'Risk case created for student STU-10087', target: 'Thembi Sithole', timestamp: '2025-04-14T08:00:00', category: 'risk' },
  { id: 3, actor: 'Admin Mokoena', action: 'Application status changed to rejected', target: 'Precious Moloi (app4)', timestamp: '2025-04-10T14:15:00', category: 'admissions' },
  { id: 4, actor: 'Prof. Dlamini', action: 'Grade recorded for CSC201 Assignment 1', target: 'Thabo Nkosi', timestamp: '2025-03-20T10:00:00', category: 'academic' },
  { id: 5, actor: 'Officer Khumalo', action: 'Intervention logged for risk case rc2', target: 'Thembi Sithole', timestamp: '2025-04-14T09:30:00', category: 'support' },
  { id: 6, actor: 'System', action: 'Email delivery failed after 3 retries', target: 'nomvula@gmail.com', timestamp: '2025-04-10T10:30:00', category: 'email' },
  { id: 7, actor: 'Prof. Dlamini', action: 'Announcement posted', target: 'CSC201', timestamp: '2025-04-08T07:45:00', category: 'academic' },
];

const CAT_BADGES = {
  admissions: 'badge-info',
  risk: 'badge-warning',
  academic: 'badge-success',
  support: 'badge-neutral',
  email: 'badge-danger',
};

export default function AdminAudit() {
  return (
    <div>
      <PageHeader title="Audit Log" subtitle="Immutable record of all system actions" />
      <div className="page-body">
        <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 'var(--radius-lg)', padding: '12px 18px', marginBottom: 20, display: 'flex', gap: 10, alignItems: 'center', fontSize: 13, color: '#065f46' }}>
          <Shield size={16} />
          Audit logs are read-only and cannot be modified or deleted.
        </div>
        <div className="card" style={{ padding: 0 }}>
          <div className="table-wrapper">
            <table>
              <thead><tr><th>Timestamp</th><th>Actor</th><th>Action</th><th>Target</th><th>Category</th></tr></thead>
              <tbody>
                {AUDIT_LOGS.sort((a,b) => new Date(b.timestamp) - new Date(a.timestamp)).map(log => (
                  <tr key={log.id}>
                    <td style={{ fontSize: 12, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                      {new Date(log.timestamp).toLocaleString('en-ZA', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td style={{ fontWeight: 600, fontSize: 13, color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>{log.actor}</td>
                    <td style={{ fontSize: 13 }}>{log.action}</td>
                    <td style={{ fontSize: 13, color: 'var(--text-muted)' }}>{log.target}</td>
                    <td><span className={`badge ${CAT_BADGES[log.category]}`}>{log.category}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
