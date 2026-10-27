import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import {
  LayoutDashboard, BookOpen, Users, GraduationCap, Bell, MessageSquare,
  FileText, BarChart3, LogOut, AlertTriangle, ClipboardList,
  Mail, Shield, CheckSquare, Calendar, ArrowUpRight, X
} from 'lucide-react';

const NAV_CONFIG = {
  admin: [
    { section: 'Overview', items: [
      { to: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
      { to: '/admin/applications', icon: FileText, label: 'Applications' },
      { to: '/admin/students', icon: Users, label: 'Students' },
      { to: '/admin/programmes', icon: BookOpen, label: 'Programmes' },
    ]},
    { section: 'Management', items: [
      { to: '/admin/reports', icon: BarChart3, label: 'Reports' },
      { to: '/admin/email-system', icon: Mail, label: 'Email System' },
      { to: '/admin/audit', icon: Shield, label: 'Audit Log' },
    ]},
    { section: 'Communication', items: [
      { to: '/admin/messages', icon: MessageSquare, label: 'Messages' },
      { to: '/admin/notifications', icon: Bell, label: 'Notifications' },
    ]},
  ],
  lecturer: [
    { section: 'Teaching', items: [
      { to: '/lecturer', icon: LayoutDashboard, label: 'Dashboard' },
      { to: '/lecturer/modules', icon: BookOpen, label: 'My Modules' },
      { to: '/lecturer/grades', icon: ClipboardList, label: 'Grades & Marks' },
      { to: '/lecturer/attendance', icon: CheckSquare, label: 'Attendance' },
    ]},
    { section: 'Students', items: [
      { to: '/lecturer/at-risk', icon: AlertTriangle, label: 'At-Risk Students', badge: true },
      { to: '/lecturer/messages', icon: MessageSquare, label: 'Messages' },
    ]},
  ],
  student: [
    { section: 'My Learning', items: [
      { to: '/student', icon: LayoutDashboard, label: 'Dashboard' },
      { to: '/student/modules', icon: BookOpen, label: 'My Modules' },
      { to: '/student/timetable', icon: Calendar, label: 'Timetable' },
      { to: '/student/grades', icon: BarChart3, label: 'Results' },
    ]},
    { section: 'Communication', items: [
      { to: '/student/messages', icon: MessageSquare, label: 'Messages', badge: true },
      { to: '/student/notifications', icon: Bell, label: 'Notifications', badge: true },
    ]},
  ],
  success_officer: [
    { section: 'Student Success', items: [
      { to: '/success', icon: LayoutDashboard, label: 'Dashboard' },
      { to: '/success/risk-cases', icon: AlertTriangle, label: 'At-Risk Cases', badge: true },
      { to: '/success/interventions', icon: ClipboardList, label: 'Interventions' },
      { to: '/success/students', icon: Users, label: 'All Students' },
    ]},
    { section: 'Communication', items: [
      { to: '/success/messages', icon: MessageSquare, label: 'Messages' },
      { to: '/success/notifications', icon: Bell, label: 'Notifications' },
    ]},
  ],
};

export default function Sidebar({ isOpen = false, onNavigate = () => {} }) {
  const { user, logout } = useAuth();
  const { notifications, riskCases } = useData();
  const navigate = useNavigate();

  if (!user) return null;

  const navSections = NAV_CONFIG[user.role] || [];
  const unreadNotifs = notifications.filter(n => n.userId === user.id && !n.read).length;
  const highRiskCount = riskCases.filter(r => r.priority === 'high').length;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <aside className={`sidebar${isOpen ? ' is-open' : ''}`}>
      <div className="sidebar-brand">
        <div className="sidebar-brand-heading">
          <div className="sidebar-brand-lockup">
            <div className="sidebar-brand-mark"><GraduationCap size={21} strokeWidth={2.2} /></div>
            <div className="sidebar-brand-name">uni<span>sphere</span></div>
          </div>
          <button className="sidebar-close" type="button" onClick={onNavigate} aria-label="Close navigation">
            <X size={19} />
          </button>
        </div>
        <div className="sidebar-brand-tag">ONE PLATFORM · EVERY STEP</div>
      </div>

      <nav className="sidebar-nav">
        {navSections.map(section => (
          <div className="sidebar-nav-section" key={section.section}>
            <div className="nav-section-label">{section.section}</div>
            {section.items.map(item => {
              const badgeCount = item.badge
                ? (item.label.includes('Risk') ? highRiskCount : unreadNotifs)
                : 0;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={onNavigate}
                  end={item.to === '/admin' || item.to === '/lecturer' || item.to === '/student' || item.to === '/success'}
                  className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                >
                  <item.icon size={16} />
                  {item.label}
                  {badgeCount > 0 && <span className="nav-badge">{badgeCount}</span>}
                </NavLink>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="sidebar-user">
        <div className="sidebar-avatar">{user.avatar}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="sidebar-user-name truncate">{user.name}</div>
          <div className="sidebar-user-role">{user.role.replace('_', ' ')}</div>
        </div>
        <button className="btn btn-icon" onClick={handleLogout} title="Sign out"
          style={{ color: 'var(--text-muted)', padding: '6px' }}>
          <LogOut size={16} />
        </button>
      </div>
      <div className="sidebar-footer-note"><span>YOUR JOURNEY,</span> <strong>YOUR WAY</strong><ArrowUpRight size={14} /></div>
    </aside>
  );
}
