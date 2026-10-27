import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { USERS } from '../data/seed';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('unisphere_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    try {
      return localStorage.getItem('unisphere_token') || null;
    } catch {
      return null;
    }
  });

  const login = useCallback(async (email, password) => {
    // Attempt backend API login (Neon PostgreSQL + JWT)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.user) {
          setUser(data.user);
          setToken(data.token);
          localStorage.setItem('unisphere_user', JSON.stringify(data.user));
          if (data.token) {
            localStorage.setItem('unisphere_token', data.token);
          }
          return { success: true, role: data.user.role };
        }
      } else {
        const data = await res.json().catch(() => ({}));
        if (data.error) {
          return { success: false, error: data.error };
        }
      }
    } catch (err) {
      console.warn('API login not reachable, attempting local fallback:', err);
    }

    // Fallback to local seed data if server is offline
    const found = USERS.find(u => u.email === email && u.password === password);
    if (found) {
      setUser(found);
      localStorage.setItem('unisphere_user', JSON.stringify(found));
      return { success: true, role: found.role };
    }
    return { success: false, error: 'Invalid email or password.' };
  }, []);

  const register = useCallback(async (studentData) => {
    try {
      const isFormData = studentData instanceof FormData;
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: isFormData ? {} : { 'Content-Type': 'application/json' },
        body: isFormData ? studentData : JSON.stringify(studentData),
      });
      const data = await res.json();
      if (res.ok && data.success && data.user) {
        setUser(data.user);
        setToken(data.token);
        localStorage.setItem('unisphere_user', JSON.stringify(data.user));
        if (data.token) {
          localStorage.setItem('unisphere_token', data.token);
        }
        return { success: true, role: data.user.role, user: data.user, credentials: data.credentials };
      }
      return { success: false, error: data.error || 'Registration failed.' };
    } catch (err) {
      return { success: false, error: 'Registration service unreachable.' };
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('unisphere_user');
    localStorage.removeItem('unisphere_token');
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
