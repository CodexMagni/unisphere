import { useState } from 'react';
import PageHeader from '../../components/PageHeader';
import { useData } from '../../contexts/DataContext';
import { Search, UserPlus, Download, X, CheckCircle2 } from 'lucide-react';

export default function AdminStudents() {
  const { users, programmes, enrolments, riskCases, exportToCsv, addToast } = useData();
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    programme: 'BSc Computer Science',
    year: '1',
  });

  const students = users.filter(u => u.role === 'student');
  const filtered = students.filter(s =>
    !search ||
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.studentId?.toLowerCase().includes(search.toLowerCase()) ||
    s.programme?.toLowerCase().includes(search.toLowerCase())
  );

  const handleExportCsv = () => {
    const headers = ['Student Name', 'Student ID', 'Email', 'Programme', 'Year', 'Status'];
    const rows = students.map(s => {
      const atRisk = riskCases.find(rc => rc.studentId === s.id);
      return [s.name, s.studentId || '', s.email, s.programme || '', `Year ${s.year || 1}`, atRisk ? `At Risk (${atRisk.priority})` : 'Active'];
    });
    exportToCsv('unisphere_registered_students', headers, rows);
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        addToast({
          type: 'success',
          title: 'Student Registered',
          body: `${data.user.name} (${data.user.studentId}) successfully registered in ${data.user.programme}.`
        });
        setShowModal(false);
        setFormData({
          name: '',
          email: '',
          password: '',
          programme: programmes[0]?.name || 'BSc Computer Science',
          year: '1',
        });
      } else {
        setFormError(data.error || 'Failed to register student.');
      }
    } catch (err) {
      setFormError('Failed to connect to registration server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Students"
        subtitle={`All registered university learners (${students.length} total)`}
        actions={
          <div className="flex gap-2">
            <button className="btn btn-ghost btn-sm" onClick={handleExportCsv}>
              <Download size={14} /> Export CSV
            </button>
            <button className="btn btn-primary btn-sm" onClick={() => setShowModal(true)}>
              <UserPlus size={14} /> Register Student
            </button>
          </div>
        }
      />

      <div className="page-body">
        <div className="card">
          <div style={{ marginBottom: 16 }}>
            <div className="search-wrap" style={{ maxWidth: 340 }}>
              <Search size={14} />
              <input
                className="input-field"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search by name, ID, or degree…"
                style={{ paddingLeft: 34 }}
              />
            </div>
          </div>

          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Student ID</th>
                  <th>Programme</th>
                  <th>Year</th>
                  <th>Enrolments</th>
                  <th>Academic Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(s => {
                  const enrolCount = enrolments.filter(e => e.studentId === s.id).length;
                  const atRisk = riskCases.find(rc => rc.studentId === s.id);
                  return (
                    <tr key={s.id}>
                      <td>
                        <div className="flex items-center gap-2">
                          <div className="avatar" style={{ width: 32, height: 32, background: 'var(--gold)', color: 'var(--navy)', fontSize: 12 }}>
                            {s.avatar}
                          </div>
                          <div>
                            <span style={{ fontWeight: 600, color: 'var(--text-primary)', display: 'block' }}>{s.name}</span>
                            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{s.email}</span>
                          </div>
                        </div>
                      </td>
                      <td style={{ fontFamily: 'monospace', fontSize: 12, fontWeight: 600 }}>{s.studentId}</td>
                      <td style={{ fontSize: 13 }}>{s.programme}</td>
                      <td>Year {s.year || 1}</td>
                      <td>
                        <span className="badge badge-neutral">{enrolCount || s.modules?.length || 0} modules</span>
                      </td>
                      <td>
                        {atRisk ? (
                          <span className={`badge badge-${atRisk.priority === 'high' ? 'danger' : 'warning'}`}>
                            ⚠ At Risk ({atRisk.priority})
                          </span>
                        ) : (
                          <span className="badge badge-success">Active</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Admin Register Student Modal */}
      {showModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(15, 31, 61, 0.6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 16
        }}>
          <div className="card" style={{ maxWidth: 500, width: '100%', position: 'relative' }}>
            <div className="flex items-center justify-between" style={{ marginBottom: 16, borderBottom: '1px solid var(--surface-dark)', paddingBottom: 12 }}>
              <div className="flex items-center gap-2">
                <UserPlus size={18} color="var(--navy)" />
                <h3 style={{ margin: 0 }}>Register New Student</h3>
              </div>
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => setShowModal(false)}
                style={{ padding: 4 }}
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleRegisterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div className="input-group">
                <label className="input-label">Full Name</label>
                <input
                  className="input-field"
                  required
                  placeholder="e.g. Nandi Madlala"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="input-group">
                <label className="input-label">Email Address</label>
                <input
                  className="input-field"
                  type="email"
                  required
                  placeholder="student@unisphere.ac.za"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div className="input-group">
                <label className="input-label">Initial Password</label>
                <input
                  className="input-field"
                  type="password"
                  required
                  placeholder="Set initial login password"
                  value={formData.password}
                  onChange={e => setFormData({ ...formData, password: e.target.value })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 110px', gap: 12 }}>
                <div className="input-group">
                  <label className="input-label">Degree Programme</label>
                  <select
                    className="input-field"
                    value={formData.programme}
                    onChange={e => setFormData({ ...formData, programme: e.target.value })}
                  >
                    {programmes.map(p => (
                      <option key={p.id} value={p.name}>{p.name}</option>
                    ))}
                  </select>
                </div>

                <div className="input-group">
                  <label className="input-label">Year of Study</label>
                  <select
                    className="input-field"
                    value={formData.year}
                    onChange={e => setFormData({ ...formData, year: e.target.value })}
                  >
                    <option value="1">Year 1</option>
                    <option value="2">Year 2</option>
                    <option value="3">Year 3</option>
                    <option value="4">Year 4</option>
                  </select>
                </div>
              </div>

              {formError && (
                <div style={{ background: '#fee2e2', border: '1px solid #fecaca', padding: '10px 14px', borderRadius: 'var(--radius-md)', fontSize: 13, color: 'var(--danger)' }}>
                  {formError}
                </div>
              )}

              <div className="flex justify-end gap-2" style={{ marginTop: 8, paddingTop: 12, borderTop: '1px solid var(--surface-dark)' }}>
                <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Registering…' : 'Complete Registration'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
