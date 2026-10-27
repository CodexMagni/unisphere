import PageHeader from '../../components/PageHeader';
import { useData } from '../../contexts/DataContext';
import { USERS } from '../../data/seed';
import { AlertTriangle, Users, ClipboardList, CheckCircle } from 'lucide-react';

export default function SuccessDashboard() {
  const { riskCases } = useData();
  const highRisk = riskCases.filter(r => r.priority === 'high');
  const mediumRisk = riskCases.filter(r => r.priority === 'medium');
  const totalInterventions = riskCases.reduce((s, r) => s + r.interventions.length, 0);

  return (
    <div>
      <PageHeader title="Student Success Centre" subtitle="Monitor at-risk students and coordinate support" />
      <div className="page-body">
        <div className="stats-grid" style={{ marginBottom: 24 }}>
          {[
            { label: 'High Priority Cases', value: highRisk.length, color: 'danger', bg: '#fee2e2', ic: 'var(--danger)', Icon: AlertTriangle },
            { label: 'Medium Priority', value: mediumRisk.length, color: 'warning', bg: '#fef3c7', ic: 'var(--warning)', Icon: AlertTriangle },
            { label: 'Total Active Cases', value: riskCases.length, color: 'info', bg: '#dbeafe', ic: 'var(--info)', Icon: Users },
            { label: 'Interventions Logged', value: totalInterventions, color: 'success', bg: '#d1fae5', ic: 'var(--success)', Icon: CheckCircle },
          ].map(s => (
            <div key={s.label} className={`stat-card ${s.color}`}>
              <div className="stat-icon" style={{ background: s.bg }}><s.Icon size={18} color={s.ic} /></div>
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="card">
          <h3 style={{ marginBottom: 16 }}>Active Cases — Prioritised</h3>
          <div style={{ background: '#fef3c7', border: '1px solid #fde68a', borderRadius: 'var(--radius-md)', padding: '10px 14px', marginBottom: 16, fontSize: 13, color: '#92400e' }}>
            ⚠ All interventions require trained staff review. Risk flags are prompts, not automatic academic decisions.
          </div>
          {riskCases.sort((a, b) => a.priority === 'high' ? -1 : 1).map(rc => {
            const student = USERS.find(u => u.id === rc.studentId);
            return (
              <div key={rc.id} style={{
                border: `1.5px solid ${rc.priority === 'high' ? '#fecaca' : '#fde68a'}`,
                borderRadius: 'var(--radius-lg)', padding: '16px 20px', marginBottom: 12,
                background: rc.priority === 'high' ? '#fef2f2' : '#fefce8'
              }}>
                <div className="flex items-center justify-between" style={{ marginBottom: 10 }}>
                  <div className="flex items-center gap-3">
                    <div className="avatar" style={{ background: rc.priority === 'high' ? '#fecaca' : '#fde68a', color: rc.priority === 'high' ? 'var(--danger)' : '#92400e' }}>
                      {student?.avatar}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 14 }}>{student?.name}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{student?.studentId} · {student?.programme}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`badge badge-${rc.priority === 'high' ? 'danger' : 'warning'}`}>
                      {rc.priority === 'high' ? '⚠ High Priority' : 'Medium'}
                    </span>
                    <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Flagged: {rc.createdAt}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 10 }}>
                  {rc.triggers.map((t, i) => (
                    <div key={i} style={{ display: 'flex', gap: 8, fontSize: 13, color: rc.priority === 'high' ? 'var(--danger)' : '#92400e', alignItems: 'center' }}>
                      <div style={{ width: 5, height: 5, borderRadius: '50%', background: 'currentColor', flexShrink: 0 }} />
                      {t}
                    </div>
                  ))}
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                  {rc.interventions.length} intervention(s) recorded · Next follow-up: {rc.nextFollowUp}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
