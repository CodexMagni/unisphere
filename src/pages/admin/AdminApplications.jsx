import { useState, useRef } from 'react';
import PageHeader from '../../components/PageHeader';
import { useData } from '../../contexts/DataContext';
import { PROGRAMMES } from '../../data/seed';
import { CheckCircle, XCircle, FileText, Upload, Download, ExternalLink } from 'lucide-react';

export default function AdminApplications() {
  const { applications, updateApplicationStatus, uploadApplicationDocument, exportToCsv } = useData();
  const [filter, setFilter] = useState('all');
  const fileInputRef = useRef(null);
  const [activeUploadId, setActiveUploadId] = useState(null);

  const filtered = filter === 'all' ? applications : applications.filter(a => a.status === filter);

  const statusConfig = {
    under_review: { label: 'Under Review', badge: 'info' },
    pending_docs: { label: 'Pending Docs', badge: 'warning' },
    accepted: { label: 'Accepted', badge: 'success' },
    rejected: { label: 'Rejected', badge: 'danger' },
  };

  const handleUploadClick = (appId) => {
    setActiveUploadId(appId);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (file && activeUploadId) {
      await uploadApplicationDocument(activeUploadId, file);
      setActiveUploadId(null);
    }
  };

  const handleExportCsv = () => {
    const headers = ['Applicant Name', 'Email', 'Programme', 'Submitted Date', 'Score', 'Status'];
    const rows = applications.map(a => {
      const prog = PROGRAMMES.find(p => p.id === a.programme);
      return [a.name, a.email, prog?.name || a.programme, a.submitted, `${a.score}%`, a.status];
    });
    exportToCsv('unisphere_student_applications', headers, rows);
  };

  return (
    <div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: 'none' }}
        accept=".pdf,.png,.jpg,.jpeg,.docx"
      />
      <PageHeader
        title="Applications"
        subtitle="Review, verify documents, and process student applications"
        actions={
          <button className="btn btn-ghost btn-sm" onClick={handleExportCsv}>
            <Download size={14} /> Export CSV
          </button>
        }
      />
      <div className="page-body">
        <div className="card">
          <div className="flex items-center justify-between" style={{ marginBottom: 20 }}>
            <div className="tabs" style={{ marginBottom: 0, borderBottom: 'none' }}>
              {['all','under_review','pending_docs','accepted','rejected'].map(f => (
                <button key={f} className={`tab ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
                  {f === 'all' ? 'All' : statusConfig[f]?.label}
                  <span style={{ marginLeft: 6, background: 'var(--surface-dark)', borderRadius: 100, padding: '1px 7px', fontSize: 11 }}>
                    {f === 'all' ? applications.length : applications.filter(a => a.status === f).length}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="table-wrapper">
            <table>
              <thead><tr>
                <th>Applicant</th><th>Programme</th><th>Submitted</th><th>Score</th><th>Documents</th><th>Status</th><th>Actions</th>
              </tr></thead>
              <tbody>
                {filtered.map(app => {
                  const prog = PROGRAMMES.find(p => p.id === app.programme);
                  const sc = statusConfig[app.status];
                  return (
                    <tr key={app.id}>
                      <td>
                        <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{app.name}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{app.email}</div>
                      </td>
                      <td style={{ fontSize: 13 }}>{prog?.name}</td>
                      <td style={{ fontSize: 13 }}>{app.submitted}</td>
                      <td>
                        <span style={{ fontWeight: 700, color: app.score >= 70 ? 'var(--success)' : app.score >= 50 ? 'var(--warning)' : 'var(--danger)' }}>
                          {app.score}%
                        </span>
                      </td>
                      <td>
                        <div className="flex flex-col gap-1">
                          <div className="flex gap-1 flex-wrap">
                            {app.docs.map((d, i) => {
                              const isObj = typeof d === 'object';
                              const label = isObj ? d.name : d;
                              return (
                                <span
                                  key={i}
                                  className="badge badge-neutral flex items-center gap-1"
                                  style={{ cursor: isObj ? 'pointer' : 'default' }}
                                  onClick={() => isObj && window.open(d.url, '_blank')}
                                  title={isObj ? 'Click to view file' : ''}
                                >
                                  {label} {isObj && <ExternalLink size={10} />}
                                </span>
                              );
                            })}
                          </div>
                          <button
                            className="btn btn-ghost btn-sm"
                            style={{ padding: '2px 6px', fontSize: 11, width: 'fit-content' }}
                            onClick={() => handleUploadClick(app.id)}
                          >
                            <Upload size={11} /> Upload Doc
                          </button>
                        </div>
                      </td>
                      <td><span className={`badge badge-${sc?.badge}`}>{sc?.label}</span></td>
                      <td>
                        <div className="flex gap-2">
                          {app.status !== 'accepted' && (
                            <button className="btn btn-sm" style={{ background: '#d1fae5', color: '#065f46' }}
                              onClick={() => updateApplicationStatus(app.id, 'accepted')}>
                              <CheckCircle size={12} /> Accept
                            </button>
                          )}
                          {app.status !== 'rejected' && (
                            <button className="btn btn-sm btn-danger"
                              onClick={() => updateApplicationStatus(app.id, 'rejected')}>
                              <XCircle size={12} /> Reject
                            </button>
                          )}
                          {app.status !== 'pending_docs' && app.status !== 'accepted' && app.status !== 'rejected' && (
                            <button className="btn btn-sm btn-ghost"
                              onClick={() => updateApplicationStatus(app.id, 'pending_docs')}>
                              <FileText size={12} /> Req. Docs
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
