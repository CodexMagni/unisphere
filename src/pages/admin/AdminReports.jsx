import PageHeader from '../../components/PageHeader';
import { useData } from '../../contexts/DataContext';
import { MODULES, PROGRAMMES, USERS } from '../../data/seed';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { Download } from 'lucide-react';

const COLOURS = ['#0f1f3d', '#d4a843', '#10b981', '#3b82f6', '#ef4444'];

export default function AdminReports() {
  const { grades, applications, riskCases, exportToCsv } = useData();

  const handleExportCsv = () => {
    const headers = ['Report Category', 'Metric Name', 'Count / Value'];
    const rows = [
      ...applications.map(a => ['Applications', `${a.name} (${a.email})`, a.status]),
      ...MODULES.map(m => ['Module Capacity', `${m.code} - ${m.name}`, `${m.enrolled}/${m.capacity} enrolled`]),
      ...riskCases.map(rc => ['Risk Cases', `Student: ${rc.studentId}`, `Priority: ${rc.priority}, Status: ${rc.status}`])
    ];
    exportToCsv('unisphere_institutional_report', headers, rows);
  };

  const appByStatus = [
    { name: 'Under Review', value: applications.filter(a => a.status === 'under_review').length },
    { name: 'Pending Docs', value: applications.filter(a => a.status === 'pending_docs').length },
    { name: 'Accepted', value: applications.filter(a => a.status === 'accepted').length },
    { name: 'Rejected', value: applications.filter(a => a.status === 'rejected').length },
  ];

  const moduleEnrolment = MODULES.map(m => ({ name: m.code, enrolled: m.enrolled, capacity: m.capacity }));

  const progData = PROGRAMMES.map(p => ({
    name: p.name.split(' ').slice(0, 2).join(' '),
    fee: p.fee / 1000, credits: p.credits
  }));

  return (
    <div>
      <PageHeader title="Reports & Analytics" subtitle="Institutional performance overview"
        actions={<button className="btn btn-ghost btn-sm" onClick={handleExportCsv}><Download size={14} /> Export CSV</button>} />
      <div className="page-body">
        <div className="page-grid-2" style={{ marginBottom: 24 }}>
          <div className="card">
            <h3 style={{ marginBottom: 16 }}>Applications by Status</h3>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={appByStatus} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                  {appByStatus.map((_, i) => <Cell key={i} fill={COLOURS[i % COLOURS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="card">
            <h3 style={{ marginBottom: 16 }}>Module Enrolment vs Capacity</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={moduleEnrolment}>
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="capacity" fill="var(--surface-dark)" name="Capacity" radius={[4,4,0,0]} />
                <Bar dataKey="enrolled" fill="var(--navy)" name="Enrolled" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <h3 style={{ marginBottom: 16 }}>Programme Overview</h3>
          <div className="table-wrapper">
            <table>
              <thead><tr><th>Programme</th><th>Faculty</th><th>Years</th><th>Credits</th><th>NQF Level</th><th>Annual Fee</th></tr></thead>
              <tbody>
                {PROGRAMMES.map(p => (
                  <tr key={p.id}>
                    <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{p.name}</td>
                    <td>{p.faculty}</td>
                    <td>{p.years}</td>
                    <td>{p.credits}</td>
                    <td><span className="badge badge-navy">NQF {p.nqf}</span></td>
                    <td style={{ fontWeight: 700 }}>R {p.fee.toLocaleString()}</td>
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
