import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Eye, EyeOff, Shield, GraduationCap, Users, BookOpen } from 'lucide-react';

const DEMO_ACCOUNTS = [
  { role: 'admin', label: 'Administrator', email: 'admin@unisphere.ac.za', password: 'Admin@123', icon: Shield, color: '#0f1f3d' },
  { role: 'lecturer', label: 'Lecturer', email: 'lecturer@unisphere.ac.za', password: 'Lecture@123', icon: BookOpen, color: '#d4a843' },
  { role: 'student', label: 'Student', email: 'student@unisphere.ac.za', password: 'Student@123', icon: GraduationCap, color: '#10b981' },
  { role: 'success_officer', label: 'Success Officer', email: 'success@unisphere.ac.za', password: 'Success@123', icon: Users, color: '#3b82f6' },
];

const ROLE_ROUTES = { admin: '/admin', lecturer: '/lecturer', student: '/student', success_officer: '/success' };

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const result = await login(email, password);
      if (result.success) {
        navigate(ROLE_ROUTES[result.role] || '/');
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Connection failed. Please check backend.');
    } finally {
      setLoading(false);
    }
  };

  const quickLogin = async (acc) => {
    setEmail(acc.email);
    setPassword(acc.password);
    try {
      const result = await login(acc.email, acc.password);
      if (result.success) navigate(ROLE_ROUTES[result.role]);
    } catch (err) {
      setError('Quick login failed.');
    }
  };

  return (
    <div className="login-page">
      <div className="login-left">
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ fontFamily: 'Sora', fontSize: 36, fontWeight: 800, color: 'white', lineHeight: 1.1, marginBottom: 16 }}>
            UniSphere
          </div>
          <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.1em', marginBottom: 48 }}>
            ONE PLATFORM · EVERY STEP
          </div>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 18, lineHeight: 1.7, maxWidth: 420, marginBottom: 48 }}>
            The complete university management ecosystem — connecting students, lecturers and administrators in one intelligent platform.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[
              'Student journey from discovery to graduation',
              'Early warning system for at-risk students',
              'Real-time communication between all parties',
              'Comprehensive academic & financial management',
            ].map((feat, i) => (
              <div key={i} className="flex items-center gap-3">
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--gold)', flexShrink: 0 }} />
                <span style={{ color: 'rgba(255,255,255,0.75)', fontSize: 14 }}>{feat}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="login-right">
        <div className="login-form-wrap">
          <h2 className="login-title">Welcome back</h2>
          <p className="login-subtitle">Sign in to your UniSphere account</p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="input-group">
              <label className="input-label">Email address</label>
              <input className="input-field" type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="your@unisphere.ac.za" required />
            </div>
            <div className="input-group">
              <label className="input-label">Password</label>
              <div className="relative">
                <input className="input-field" type={showPw ? 'text' : 'password'}
                  value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="Enter your password" required style={{ paddingRight: 42 }} />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', color: 'var(--text-muted)' }}>
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            {error && (
              <div style={{ background: '#fee2e2', border: '1px solid #fecaca', borderRadius: 'var(--radius-md)', padding: '10px 14px', fontSize: 13, color: 'var(--danger)' }}>
                {error}
              </div>
            )}
            <button type="submit" className="btn btn-primary btn-lg w-full" disabled={loading}
              style={{ justifyContent: 'center', marginTop: 4 }}>
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <div style={{ marginTop: 16, textAlign: 'center', fontSize: 13, color: 'var(--text-muted)' }}>
            New student?{' '}
            <Link to="/register" style={{ color: 'var(--navy)', fontWeight: 600, textDecoration: 'underline' }}>
              Create student account
            </Link>
          </div>

          <div style={{ marginTop: 32 }}>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 12, textAlign: 'center' }}>
              Demo accounts — click to sign in instantly
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {DEMO_ACCOUNTS.map(acc => {
                const Icon = acc.icon;
                return (
                  <button key={acc.role} onClick={() => quickLogin(acc)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 8,
                      padding: '10px 12px', borderRadius: 'var(--radius-md)',
                      border: '1.5px solid var(--surface-dark)', background: 'white',
                      cursor: 'pointer', fontSize: 13, fontWeight: 500, transition: 'all 0.15s'
                    }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = acc.color}
                    onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--surface-dark)'}
                  >
                    <div style={{ width: 28, height: 28, borderRadius: 6, background: acc.color + '18',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Icon size={14} color={acc.color} />
                    </div>
                    {acc.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
