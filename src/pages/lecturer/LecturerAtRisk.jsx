import { useState } from 'react';
import PageHeader from '../../components/PageHeader';
import { useData } from '../../contexts/DataContext';
import { USERS, MODULES, ENROLMENTS } from '../../data/seed';
import { AlertTriangle, MessageSquare, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function LecturerAtRisk() {
  const { riskCases, addRiskIntervention } = useData();
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(null);
  const [action, setAction] = useState('');

  const handleIntervention = (caseId, userId) => {
    if (!action.trim()) return;
    addRiskIntervention(caseId, action, userId);
    setAction('');
  };

  return (
    <div>
      <PageHeader title="At-Risk Students" subtitle="Students flagged for academic support review" />
      <div className="page-body">
        <div style={{ background: '#fef3c7', border: '1px solid #fde68a', borderRadius: 'var(--radius-lg)', padding: '14px 20px', marginBottom: 24, display: 'flex', gap: 12, alignItems: 'center' }}>
          <AlertTriangle size={18} color="var(--warning)" />
          <p style={{ color: '#92400e', fontSize: 14, margin: 0 }}>
            Risk flags are prompts for human review. They require a trained staff member to review each case before any action is taken.
          </p>
        </div>

        {riskCases.map(rc => {
          const student = USERS.find(u => u.id === rc.studentId);
          const isExpanded = expanded === rc.id;
          return (
            <div key={rc.id} className="card" style={{ marginBottom: 16 }}>
              <div className="flex items-center justify-between" onClick={() => setExpanded(isExpanded ? null : rc.id)} style={{ cursor: 'pointer' }}>
                <div className="flex items-center gap-12">
                  <div className="avatar" style={{ background: rc.priority === 'high' ? '#fee2e2' : '#fef3c7', color: rc.priority === 'high' ? 'var(--danger)' : 'var(--warning)' }}>
                    {student?.avatar}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 15 }}>{student?.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{student?.studentId} · {student?.programme}</div>
                  </div>
                </div>
                <div className="flex items-center gap-12">
                  <span className={`badge badge-${rc.priority === 'high' ? 'danger' : 'warning'}`} style={{ fontSize: 13, padding: '4px 12px' }}>
                    {rc.priority === 'high' ? '⚠ High Priority' : '⚡ Medium Priority'}
                  </span>
                  <span style={{ color: 'var(--text-muted)', fontSize: 18 }}>{isExpanded ? '▲' : '▼'}</span>
                </div>
              </div>

              {isExpanded && (
                <div style={{ marginTop: 20 }}>
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Risk Triggers</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      {rc.triggers.map((t, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--danger)' }}>
                          <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--danger)', flexShrink: 0 }} />
                          {t}
                        </div>
                      ))}
                    </div>
                  </div>

                  {rc.interventions.length > 0 && (
                    <div style={{ marginBottom: 16 }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Interventions Taken</div>
                      {rc.interventions.map(i => (
                        <div key={i.id} style={{ display: 'flex', gap: 10, padding: '8px 0', borderBottom: '1px solid var(--surface-mid)' }}>
                          <CheckCircle size={14} color="var(--success)" style={{ flexShrink: 0, marginTop: 2 }} />
                          <div>
                            <div style={{ fontSize: 13, fontWeight: 500 }}>{i.action}</div>
                            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{i.date} · {i.outcome}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div style={{ borderTop: '1px solid var(--surface-dark)', paddingTop: 16 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Log New Intervention</div>
                    <div className="flex gap-3">
                      <input className="input-field" style={{ flex: 1 }} value={action}
                        onChange={e => setAction(e.target.value)}
                        placeholder="Describe action taken (e.g. Email sent, Consultation scheduled)…" />
                      <button className="btn btn-primary" onClick={() => handleIntervention(rc.id, 'u2')}>Save</button>
                    </div>
                    <div className="flex gap-2" style={{ marginTop: 10 }}>
                      <button className="btn btn-ghost btn-sm" onClick={() => navigate('/lecturer/messages')}>
                        <MessageSquare size={13} /> Message Student
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
