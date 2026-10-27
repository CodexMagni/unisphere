import { useData } from '../contexts/DataContext';
import { CheckCircle, AlertTriangle, Info, XCircle, X } from 'lucide-react';

const ICONS = {
  success: <CheckCircle size={18} color="var(--success)" />,
  warning: <AlertTriangle size={18} color="var(--warning)" />,
  danger: <XCircle size={18} color="var(--danger)" />,
  info: <Info size={18} color="var(--info)" />,
};

export default function ToastStack() {
  const { toasts } = useData();
  return (
    <div className="notification-stack">
      {toasts.map(t => (
        <div key={t.id} className={`toast ${t.type}`}>
          {ICONS[t.type] || ICONS.info}
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--text-primary)' }}>{t.title}</div>
            {t.body && <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{t.body}</div>}
          </div>
        </div>
      ))}
    </div>
  );
}
