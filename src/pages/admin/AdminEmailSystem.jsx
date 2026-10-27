import { useState } from 'react';
import PageHeader from '../../components/PageHeader';
import { useData } from '../../contexts/DataContext';
import { Mail, RefreshCw, CheckCircle, Clock, XCircle, AlertCircle, Send } from 'lucide-react';

const STATUS_CONFIG = {
  delivered: { label: 'Delivered', icon: CheckCircle, color: 'var(--success)', badge: 'success' },
  queued: { label: 'Queued', icon: Clock, color: 'var(--info)', badge: 'info' },
  failed: { label: 'Failed', icon: XCircle, color: 'var(--danger)', badge: 'danger' },
  sending: { label: 'Sending', icon: RefreshCw, color: 'var(--warning)', badge: 'warning' },
};

const TEMPLATES = [
  { id: 'application_status', name: 'Application Status Update', vars: ['applicant_name', 'status', 'programme'] },
  { id: 'at_risk_alert', name: 'Academic Risk Alert', vars: ['student_name', 'officer_name'] },
  { id: 'assignment_reminder', name: 'Assignment Due Reminder', vars: ['student_name', 'assignment', 'due_date'] },
  { id: 'missing_docs', name: 'Missing Documents Request', vars: ['applicant_name', 'docs_required'] },
  { id: 'grade_published', name: 'Grade Published', vars: ['student_name', 'module', 'mark'] },
];

export default function AdminEmailSystem() {
  const { emailQueue, retryEmail, addToast } = useData();
  const [tab, setTab] = useState('queue');
  const [composeTo, setComposeTo] = useState('');
  const [composeSubject, setComposeSubject] = useState('');
  const [composeBody, setComposeBody] = useState('');

  const stats = {
    delivered: emailQueue.filter(e => e.status === 'delivered').length,
    queued: emailQueue.filter(e => e.status === 'queued').length,
    failed: emailQueue.filter(e => e.status === 'failed').length,
  };

  const sendTest = () => {
    if (!composeTo || !composeSubject) return;
    addToast({ type: 'success', title: 'Email queued', body: `Message to ${composeTo} added to delivery queue.` });
    setComposeTo(''); setComposeSubject(''); setComposeBody('');
  };

  return (
    <div>
      <PageHeader title="Email System" subtitle="Manage email delivery queue, templates and monitoring" />
      <div className="page-body">
        <div className="stats-grid" style={{ marginBottom: 24, gridTemplateColumns: 'repeat(3, 1fr)' }}>
          {[
            { label: 'Delivered', value: stats.delivered, color: 'success', bg: '#d1fae5', iconColor: 'var(--success)' },
            { label: 'Queued', value: stats.queued, color: 'info', bg: '#dbeafe', iconColor: 'var(--info)' },
            { label: 'Failed', value: stats.failed, color: 'danger', bg: '#fee2e2', iconColor: 'var(--danger)' },
          ].map(s => (
            <div key={s.label} className={`stat-card ${s.color}`}>
              <div className="stat-icon" style={{ background: s.bg }}><Mail size={18} color={s.iconColor} /></div>
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label} emails</div>
            </div>
          ))}
        </div>

        <div className="card">
          <div className="tabs">
            {['queue','templates','compose'].map(t => (
              <button key={t} className={`tab ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>

          {tab === 'queue' && (
            <div className="table-wrapper">
              <table>
                <thead><tr>
                  <th>Recipient</th><th>Subject</th><th>Template</th><th>Status</th><th>Sent At</th><th>Retries</th><th>Actions</th>
                </tr></thead>
                <tbody>
                  {emailQueue.map(e => {
                    const sc = STATUS_CONFIG[e.status];
                    const Icon = sc?.icon;
                    return (
                      <tr key={e.id}>
                        <td style={{ fontSize: 13 }}>{e.to}</td>
                        <td style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>{e.subject}</td>
                        <td><span className="badge badge-neutral" style={{ fontSize: 11 }}>{e.template}</span></td>
                        <td>
                          <div className="flex items-center gap-1">
                            {Icon && <Icon size={12} color={sc.color} />}
                            <span className={`badge badge-${sc?.badge}`}>{sc?.label}</span>
                          </div>
                        </td>
                        <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                          {e.sentAt ? new Date(e.sentAt).toLocaleString('en-ZA', { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short' }) : '—'}
                        </td>
                        <td style={{ fontSize: 13 }}>{e.retries ?? 0}</td>
                        <td>
                          {e.status === 'failed' && (
                            <button className="btn btn-sm btn-ghost" onClick={() => retryEmail(e.id)}>
                              <RefreshCw size={12} /> Retry
                            </button>
                          )}
                          {e.error && <div style={{ fontSize: 11, color: 'var(--danger)', marginTop: 2 }}>{e.error}</div>}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {tab === 'templates' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
              {TEMPLATES.map(t => (
                <div key={t.id} style={{ border: '1px solid var(--surface-dark)', borderRadius: 'var(--radius-md)', padding: 16 }}>
                  <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 8 }}>{t.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 10 }}>Template: <code>{t.id}</code></div>
                  <div className="flex" style={{ flexWrap: 'wrap', gap: 4 }}>
                    {t.vars.map(v => <span key={v} className="badge badge-info" style={{ fontSize: 10 }}>{'{{'}{v}{'}}'}</span>)}
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === 'compose' && (
            <div style={{ maxWidth: 560 }}>
              <p style={{ marginBottom: 16, color: 'var(--text-muted)', fontSize: 13 }}>
                Compose and send a test email. In production, this would use the SMTP queue.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div className="input-group">
                  <label className="input-label">To</label>
                  <input className="input-field" value={composeTo} onChange={e => setComposeTo(e.target.value)} placeholder="recipient@example.com" />
                </div>
                <div className="input-group">
                  <label className="input-label">Subject</label>
                  <input className="input-field" value={composeSubject} onChange={e => setComposeSubject(e.target.value)} placeholder="Email subject" />
                </div>
                <div className="input-group">
                  <label className="input-label">Message</label>
                  <textarea className="input-field" value={composeBody} onChange={e => setComposeBody(e.target.value)} placeholder="Email body..." rows={5} />
                </div>
                <button className="btn btn-primary" style={{ width: 'fit-content' }} onClick={sendTest}>
                  <Send size={14} /> Queue Email
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
