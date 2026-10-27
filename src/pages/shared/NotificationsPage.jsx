import PageHeader from '../../components/PageHeader';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { Bell, AlertTriangle, Info, CheckCircle, XCircle } from 'lucide-react';

const ICONS = {
  warning: <AlertTriangle size={16} color="var(--warning)" />,
  info: <Info size={16} color="var(--info)" />,
  danger: <XCircle size={16} color="var(--danger)" />,
  success: <CheckCircle size={16} color="var(--success)" />,
};

export default function NotificationsPage() {
  const { user } = useAuth();
  const { notifications, markNotifRead, markAllRead } = useData();
  const myNotifs = notifications.filter(n => n.userId === user?.id).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  const unread = myNotifs.filter(n => !n.read).length;

  return (
    <div>
      <PageHeader title="Notifications" subtitle="Your alerts and system messages"
        actions={unread > 0 && <button className="btn btn-ghost btn-sm" onClick={() => markAllRead(user?.id)}>Mark all read</button>} />
      <div className="page-body">
        <div className="card" style={{ padding: 0 }}>
          {myNotifs.length === 0 ? (
            <div className="empty-state" style={{ padding: 60 }}><Bell size={40} /><h4 style={{ marginTop: 16 }}>All caught up</h4><p>No notifications at this time.</p></div>
          ) : myNotifs.map(n => (
            <div key={n.id} onClick={() => markNotifRead(n.id)}
              className={`inbox-item ${!n.read ? 'unread' : ''}`}
              style={{ cursor: 'pointer', padding: '16px 20px', display: 'flex', gap: 14, alignItems: 'flex-start' }}>
              <div style={{ marginTop: 2, flexShrink: 0 }}>{ICONS[n.type] || ICONS.info}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: !n.read ? 700 : 500, fontSize: 14, color: 'var(--text-primary)' }}>{n.title}</div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 3 }}>{n.body}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 5 }}>
                  {new Date(n.timestamp).toLocaleString('en-ZA', { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
              {!n.read && <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--gold)', flexShrink: 0, marginTop: 6 }} />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
