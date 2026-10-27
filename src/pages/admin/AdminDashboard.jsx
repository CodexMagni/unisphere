import PageHeader from '../../components/PageHeader';
import { USERS, PROGRAMMES, MODULES, APPLICATIONS } from '../../data/seed';
import { useData } from '../../contexts/DataContext';
import { Users, BookOpen, FileText, AlertTriangle, TrendingUp, CheckCircle, Clock, XCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const enrolmentData = [
  { month: 'Jan', students: 120 }, { month: 'Feb', students: 145 }, { month: 'Mar', students: 210 },
  { month: 'Apr', students: 320 }, { month: 'May', students: 280 }, { month: 'Jun', students: 195 },
];
const moduleData = [
  { name: 'CSC201', pass: 72, fail: 28 }, { name: 'CSC202', pass: 81, fail: 19 },
  { name: 'CSC203', pass: 68, fail: 32 }, { name: 'MAT201', pass: 60, fail: 40 },
];

export default function AdminDashboard() {
  const { riskCases, applications } = useData();
  const highRisk = riskCases.filter(r => r.priority === 'high').length;
  const pending = applications.filter(a => a.status === 'under_review' || a.status === 'pending_docs').length;

  const stats = [
    { label: 'Total Students', value: '1,248', icon: Users, color: 'navy', bg: '#e8ecf7', iconColor: 'var(--navy)' },
    { label: 'Active Programmes', value: PROGRAMMES.length, icon: BookOpen, color: 'gold', bg: '#fdf4e0', iconColor: 'var(--gold)' },
    { label: 'Pending Applications', value: pending, icon: FileText, color: 'info', bg: '#dbeafe', iconColor: 'var(--info)' },
    { label: 'At-Risk Students', value: riskCases.length, icon: AlertTriangle, color: 'danger', bg: '#fee2e2', iconColor: 'var(--danger)' },
  ];

  return (
    <div>
      <PageHeader title="Admin Dashboard" subtitle="University-wide overview" />
      <div className="page-body">
        <div className="stats-grid" style={{ marginBottom: 28 }}>
          {stats.map(s => (
            <div key={s.label} className={`stat-card ${s.color}`}>
              <div className="stat-icon" style={{ background: s.bg }}>
                <s.icon size={20} color={s.iconColor} />
              </div>
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="page-grid-2">
          <div className="card">
            <h3 style={{ marginBottom: 20 }}>Enrolment Trend</h3>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={enrolmentData}>
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Line type="monotone" dataKey="students" stroke="var(--navy)" strokeWidth={2} dot={{ fill: 'var(--navy)', r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="card">
            <h3 style={{ marginBottom: 20 }}>Module Pass Rates (%)</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={moduleData}>
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="pass" fill="var(--navy)" radius={[4,4,0,0]} name="Pass %" />
                <Bar dataKey="fail" fill="#fee2e2" radius={[4,4,0,0]} name="Fail %" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="page-grid-2" style={{ marginTop: 24 }}>
          <div className="card">
            <div className="flex items-center justify-between" style={{ marginBottom: 16 }}>
              <h3>Recent Applications</h3>
              <span className="badge badge-info">{applications.length} total</span>
            </div>
            <div className="table-wrapper">
              <table>
                <thead><tr>
                  <th>Applicant</th><th>Programme</th><th>Status</th>
                </tr></thead>
                <tbody>
                  {applications.map(a => {
                    const prog = PROGRAMMES.find(p => p.id === a.programme);
                    return (
                      <tr key={a.id}>
                        <td><div style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{a.name}</div><div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{a.email}</div></td>
                        <td>{prog?.name}</td>
                        <td><span className={`badge badge-${a.status === 'accepted' ? 'success' : a.status === 'rejected' ? 'danger' : a.status === 'pending_docs' ? 'warning' : 'info'}`}>
                          {a.status.replace('_', ' ')}
                        </span></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between" style={{ marginBottom: 16 }}>
              <h3>Student Risk Summary</h3>
              <span className="badge badge-danger">{highRisk} high priority</span>
            </div>
            {riskCases.map(rc => {
              const student = USERS.find(u => u.id === rc.studentId);
              return (
                <div key={rc.id} style={{
                  display: 'flex', gap: 12, alignItems: 'flex-start', padding: '12px 0',
                  borderBottom: '1px solid var(--surface-mid)'
                }}>
                  <div className="avatar" style={{ background: rc.priority === 'high' ? '#fee2e2' : '#fef3c7', color: rc.priority === 'high' ? 'var(--danger)' : 'var(--warning)', fontSize: 12 }}>
                    {student?.avatar}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--text-primary)' }}>{student?.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{student?.studentId} · {rc.triggers[0]}</div>
                  </div>
                  <span className={`badge badge-${rc.priority === 'high' ? 'danger' : 'warning'}`}>{rc.priority}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
