import PageHeader from '../../components/PageHeader';
import { useAuth } from '../../contexts/AuthContext';
import { MODULES, ENROLMENTS, TIMETABLE } from '../../data/seed';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const COLORS = { lecture: { bg: '#e8ecf7', border: 'var(--navy)', text: 'var(--navy)' }, tutorial: { bg: '#fdf4e0', border: 'var(--gold)', text: '#92400e' } };

export default function StudentTimetable() {
  const { user } = useAuth();
  const myModuleIds = ENROLMENTS.filter(e => e.studentId === user?.id).map(e => e.moduleId);
  const myTimetable = TIMETABLE.filter(t => myModuleIds.includes(t.moduleId));

  return (
    <div>
      <PageHeader title="Timetable" subtitle="Your weekly class schedule" />
      <div className="page-body">
        <div className="card" style={{ overflowX: 'auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '80px repeat(5, 1fr)', gap: 8, minWidth: 700 }}>
            <div />
            {DAYS.map(d => (
              <div key={d} style={{ fontWeight: 700, fontSize: 13, color: 'var(--text-primary)', textAlign: 'center', padding: '8px 4px', background: 'var(--surface)', borderRadius: 'var(--radius-sm)' }}>{d}</div>
            ))}
            {['08:00', '10:00', '12:00', '14:00', '16:00'].map(time => (
              <>
                <div key={time} style={{ fontSize: 11, color: 'var(--text-muted)', paddingTop: 12, textAlign: 'right', paddingRight: 8 }}>{time}</div>
                {DAYS.map(day => {
                  const slot = myTimetable.find(t => t.day === day && t.time.startsWith(time));
                  const mod = slot ? MODULES.find(m => m.id === slot.moduleId) : null;
                  const c = slot ? COLORS[slot.type] : null;
                  return (
                    <div key={`${time}-${day}`} style={{ minHeight: 70, borderRadius: 'var(--radius-md)', background: c ? c.bg : 'var(--surface)', border: c ? `2px solid ${c.border}` : '2px dashed var(--surface-dark)', padding: c ? 10 : 0, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                      {slot && mod && (
                        <>
                          <div style={{ fontWeight: 700, fontSize: 12, color: c.text }}>{mod.code}</div>
                          <div style={{ fontSize: 11, color: c.text, opacity: 0.8, marginTop: 2 }}>{slot.time}</div>
                          <div style={{ fontSize: 10, color: c.text, opacity: 0.7 }}>{slot.room}</div>
                          <span style={{ marginTop: 4, fontSize: 10, background: c.border, color: 'white', borderRadius: 100, padding: '1px 6px', width: 'fit-content' }}>{slot.type}</span>
                        </>
                      )}
                    </div>
                  );
                })}
              </>
            ))}
          </div>
        </div>

        <div className="card" style={{ marginTop: 20 }}>
          <h3 style={{ marginBottom: 16 }}>Module Legend</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 12 }}>
            {myModuleIds.map(id => {
              const mod = MODULES.find(m => m.id === id);
              if (!mod) return null;
              return (
                <div key={id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: 'var(--surface)', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ width: 4, height: 32, background: 'var(--navy)', borderRadius: 2 }} />
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 13 }}>{mod.code}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{mod.name}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
