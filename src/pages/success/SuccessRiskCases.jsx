import { useState } from 'react';
import PageHeader from '../../components/PageHeader';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { USERS, MODULES, ASSESSMENTS } from '../../data/seed';
import { MessageSquare, Plus, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function SuccessRiskCases() {
  const { user } = useAuth();
  const { riskCases, addRiskIntervention } = useData();
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(null);
  const [actionText, setActionText] = useState('');

  const handleLog = (caseId) => {
    if (!actionText.trim()) return;
    addRiskIntervention(caseId, actionText.trim(), user?.id);
    setActionText('');
  };

  return (
    <div>
      <PageHeader title="At-Risk Cases" subtitle="Active cases requiring student support review" />
      <div className="page-body">
        <div style={{ background: '#dbeafe', border: '1px solid #93c5fd', borderRadius: 'var(--radius-lg)', padding: '14px 20px', marginBottom: 24, fontSize: 13, color: '#1e40af' }}>
          ℹ Risk flags identify students who may benefit from support. Each flag must be reviewed by trained staff before any action. Flags do not automatically affect academic standing.
        </div>

        {riskCases.map(rc => {
          const student = USERS.find(u => u.id === rc.studentId);
          const isOpen = expanded === rc.id;
          return (
            <div key={rc.id} className="card" style={{ marginBottom: 16, padding: 0, overflow: 'hidden' }}>
              {/* Header */}
              <div style={{
                padding: '18px 24px',
                background: rc.priority === 'high' ? 'linear-gradient(90deg, #fff5f5, white)' : 'linear-gradient(90deg, #fffbeb, white)',
                borderBottom: isOpen ? '1px solid var(--surface-dark)' : 'none',
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 16
              }} onClick={() => setExpanded(isOpen ? null : rc.id)}>
                <div className="avatar" style={{ width: 48, height: 48, fontSize: 16, background: rc.priority === 'high' ? '#fee2e2' : '#fef3c7', color: rc.priority === 'high' ? 'var(--danger)' : '#92400e' }}>
                  {student?.avatar}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 16 }}>{student?.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
                    {student?.studentId} · {student?.programme} · Year {student?.year}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Flagged</div>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{rc.createdAt}</div>
                  </div>
                  <span className={`badge badge-${rc.priority === 'high' ? 'danger' : 'warning'}`} style={{ fontSize: 12, padding: '5px 12px' }}>
                    {rc.priority === 'high' ? '⚠ High' : '⚡ Medium'}
                  </span>
                  {isOpen ? <ChevronUp size={18} color="var(--text-muted)" /> : <ChevronDown size={18} color="var(--text-muted)" />}
                </div>
              </div>

              {isOpen && (
                <div style={{ padding: '20px 24px' }}>
                  <div className="page-grid-2" style={{ gap: 20, marginBottom: 20 }}>
                    {/* Triggers */}
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: 10 }}>
                        Risk Triggers Detected
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {rc.triggers.map((t, i) => (
                          <div key={i} style={{
                            display: 'flex', gap: 10, padding: '10px 14px',
                            background: 'var(--surface)', borderRadius: 'var(--radius-md)',
                            borderLeft: '3px solid var(--danger)', alignItems: 'center'
                          }}>
                            <span style={{ fontSize: 13, color: 'var(--text-primary)' }}>{t}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Case info */}
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: 10 }}>
                        Case Information
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        {[
                          { label: 'Case ID', value: rc.id },
                          { label: 'Status', value: rc.status },
                          { label: 'Priority', value: rc.priority },
                          { label: 'Next Follow-up', value: rc.nextFollowUp },
                          { label: 'Interventions', value: `${rc.interventions.length} recorded` },
                        ].map(item => (
                          <div key={item.label} className="flex items-center justify-between" style={{ fontSize: 13 }}>
                            <span style={{ color: 'var(--text-muted)' }}>{item.label}</span>
                            <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{item.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Intervention history */}
                  <div style={{ marginBottom: 20 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: 10 }}>
                      Intervention History
                    </div>
                    {rc.interventions.length === 0 ? (
                      <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>No interventions recorded yet.</p>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {rc.interventions.map(iv => (
                          <div key={iv.id} style={{ display: 'flex', gap: 12, padding: '12px 16px', background: '#f0fdf4', borderRadius: 'var(--radius-md)', border: '1px solid #bbf7d0' }}>
                            <CheckCircle size={16} color="var(--success)" style={{ flexShrink: 0, marginTop: 2 }} />
                            <div>
                              <div style={{ fontWeight: 600, fontSize: 13 }}>{iv.action}</div>
                              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{iv.date} · Outcome: {iv.outcome}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Log new intervention */}
                  <div style={{ borderTop: '1px solid var(--surface-dark)', paddingTop: 16 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: 10 }}>
                      Log Intervention
                    </div>
                    <div className="flex gap-3">
                      <input className="input-field" style={{ flex: 1 }} value={actionText}
                        onChange={e => setActionText(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleLog(rc.id)}
                        placeholder="Describe action taken (email sent, consultation scheduled, referral made…)" />
                      <button className="btn btn-primary" onClick={() => handleLog(rc.id)}>
                        <Plus size={14} /> Log
                      </button>
                    </div>
                    <div className="flex gap-2" style={{ marginTop: 10 }}>
                      <button className="btn btn-ghost btn-sm" onClick={() => navigate('/success/messages')}>
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
