import { Bell, Menu, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOutletContext } from 'react-router-dom';

export default function PageHeader({ title, subtitle, actions }) {
  const { user } = useAuth();
  const { onMenuClick, sidebarOpen } = useOutletContext();
  const { notifications, markNotifRead, markAllRead } = useData();
  const [showNotifs, setShowNotifs] = useState(false);
  const navigate = useNavigate();

  const userNotifs = notifications.filter(n => n.userId === user?.id);
  const unread = userNotifs.filter(n => !n.read).length;

  const notifPath = user?.role === 'student' ? '/student/notifications'
    : user?.role === 'lecturer' ? '/lecturer/messages'
    : user?.role === 'success_officer' ? '/success/notifications'
    : '/admin/notifications';
  const roleLabel = user?.role === 'success_officer'
    ? 'Student success'
    : `${user?.role || 'university'} portal`;

  return (
    <header className="page-header">
      <div className="page-header-title">
        <button className="page-menu-toggle" onClick={onMenuClick} aria-label={sidebarOpen ? 'Close navigation' : 'Open navigation'} aria-expanded={sidebarOpen}>
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
        <div className="page-header-copy">
          <div className="page-header-eyebrow"><span /> UNISPHERE <b>/</b> {roleLabel}</div>
          <h2>{title}</h2>
        {subtitle && <p style={{ fontSize: '12px', marginTop: 2 }}>{subtitle}</p>}
        </div>
      </div>
      <div className="flex items-center gap-3">
        {actions}
        <div className="relative">
          <button
            className="btn btn-ghost btn-icon"
            onClick={() => setShowNotifs(!showNotifs)}
            style={{ position: 'relative' }}
          >
            <Bell size={18} />
            {unread > 0 && (
              <span style={{
                position: 'absolute', top: -2, right: -2,
                background: 'var(--danger)', color: 'white',
                borderRadius: '50%', width: 16, height: 16,
                fontSize: 10, display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 700
              }}>{unread}</span>
            )}
          </button>

          {showNotifs && (
            <>
              <div style={{ position: 'fixed', inset: 0, zIndex: 99 }} onClick={() => setShowNotifs(false)} />
              <div style={{
                position: 'absolute', right: 0, top: '100%', marginTop: 8,
                background: 'white', borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--surface-dark)', boxShadow: 'var(--shadow-lg)',
                width: 340, zIndex: 100, overflow: 'hidden'
              }}>
                <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--surface-dark)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 600, fontSize: 14 }}>Notifications</span>
                  {unread > 0 && (
                    <button className="btn btn-sm" style={{ fontSize: 11, padding: '4px 10px' }}
                      onClick={() => markAllRead(user.id)}>Mark all read</button>
                  )}
                </div>
                {userNotifs.length === 0 ? (
                  <div style={{ padding: 24, textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>No notifications</div>
                ) : (
                  userNotifs.slice(0, 5).map(n => (
                    <div key={n.id} className={`inbox-item ${!n.read ? 'unread' : ''}`}
                      onClick={() => { markNotifRead(n.id); setShowNotifs(false); }}>
                      {!n.read && <div className="inbox-dot" />}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: !n.read ? 600 : 400, fontSize: 13, color: 'var(--text-primary)' }}>{n.title}</div>
                        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{n.body}</div>
                      </div>
                    </div>
                  ))
                )}
                <div style={{ padding: '10px 16px', borderTop: '1px solid var(--surface-dark)' }}>
                  <button className="btn btn-ghost w-full" style={{ fontSize: 12 }}
                    onClick={() => { setShowNotifs(false); navigate(notifPath); }}>
                    View all notifications
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="flex items-center gap-2" style={{
          background: 'var(--surface)',
          borderRadius: 'var(--radius-md)',
          padding: '6px 12px',
          border: '1px solid var(--surface-dark)'
        }}>
          <div className="avatar" style={{ width: 28, height: 28, background: 'var(--gold)', fontSize: 11, color: 'var(--navy)' }}>
            {user?.avatar}
          </div>
          <span style={{ fontSize: 13, fontWeight: 500 }}>{user?.name?.split(' ')[0]}</span>
        </div>
      </div>
    </header>
  );
}
