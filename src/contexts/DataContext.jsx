import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';
import {
  NOTIFICATIONS, MESSAGES, GRADES, ASSESSMENTS, RISK_CASES,
  ATTENDANCE, ENROLMENTS, APPLICATIONS, EMAIL_QUEUE, ANNOUNCEMENTS,
  MODULES, USERS, PROGRAMMES, TIMETABLE
} from '../data/seed';

const DataContext = createContext(null);

export function DataProvider({ children }) {
  const { user, token } = useAuth();
  const [users, setUsers] = useState(USERS);
  const [programmes, setProgrammes] = useState(PROGRAMMES);
  const [modules, setModules] = useState(MODULES);
  const [notifications, setNotifications] = useState(NOTIFICATIONS);
  const [messages, setMessages] = useState(MESSAGES);
  const [grades, setGrades] = useState(GRADES);
  const [riskCases, setRiskCases] = useState(RISK_CASES);
  const [attendance, setAttendance] = useState(ATTENDANCE);
  const [enrolments, setEnrolments] = useState(ENROLMENTS);
  const [applications, setApplications] = useState(APPLICATIONS);
  const [emailQueue, setEmailQueue] = useState(EMAIL_QUEUE);
  const [announcements, setAnnouncements] = useState(ANNOUNCEMENTS);
  const [toasts, setToasts] = useState([]);
  const [isDbConnected, setIsDbConnected] = useState(false);
  const [socket, setSocket] = useState(null);

  const addToast = useCallback((toast) => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { ...toast, id }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4500);
  }, []);

  // Sync data from Neon backend on mount
  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        const healthRes = await fetch('/api/health');
        if (!healthRes.ok) return;
        const health = await healthRes.json();
        if (health.status === 'connected') {
          if (isMounted) setIsDbConnected(true);
          
          const [uRes, pRes, mRes, nRes, msgRes, gRes, rRes, aRes, eRes, appRes, eqRes, annRes] = await Promise.all([
            fetch('/api/users').then(r => r.ok ? r.json() : null).catch(() => null),
            fetch('/api/programmes').then(r => r.ok ? r.json() : null).catch(() => null),
            fetch('/api/modules').then(r => r.ok ? r.json() : null).catch(() => null),
            fetch('/api/notifications').then(r => r.ok ? r.json() : null).catch(() => null),
            fetch('/api/messages').then(r => r.ok ? r.json() : null).catch(() => null),
            fetch('/api/grades').then(r => r.ok ? r.json() : null).catch(() => null),
            fetch('/api/risk-cases').then(r => r.ok ? r.json() : null).catch(() => null),
            fetch('/api/attendance').then(r => r.ok ? r.json() : null).catch(() => null),
            fetch('/api/enrolments').then(r => r.ok ? r.json() : null).catch(() => null),
            fetch('/api/applications').then(r => r.ok ? r.json() : null).catch(() => null),
            fetch('/api/email-queue').then(r => r.ok ? r.json() : null).catch(() => null),
            fetch('/api/announcements').then(r => r.ok ? r.json() : null).catch(() => null),
          ]);

          if (!isMounted) return;
          if (uRes && uRes.length) setUsers(uRes);
          if (pRes && pRes.length) setProgrammes(pRes);
          if (mRes && mRes.length) setModules(mRes);
          if (nRes && nRes.length) setNotifications(nRes);
          if (msgRes && msgRes.length) setMessages(msgRes);
          if (gRes && gRes.length) setGrades(gRes);
          if (rRes && rRes.length) setRiskCases(rRes);
          if (aRes && aRes.length) setAttendance(aRes);
          if (eRes && eRes.length) setEnrolments(eRes);
          if (appRes && appRes.length) setApplications(appRes);
          if (eqRes && eqRes.length) setEmailQueue(eqRes);
          if (annRes && annRes.length) setAnnouncements(annRes);
        }
      } catch (err) {
        console.debug('Using initial seed dataset (backend not active):', err);
      }
    }
    loadData();
    return () => { isMounted = false; };
  }, []);

  // WebSockets Connection & Event Listeners
  useEffect(() => {
    const newSocket = io({
      transports: ['websocket', 'polling'],
      autoConnect: true,
    });
    setSocket(newSocket);

    if (user?.id) {
      newSocket.emit('join', user.id);
    }

    newSocket.on('new_student_registered', (newStudent) => {
      setUsers(prev => {
        if (prev.some(u => u.id === newStudent.id)) return prev;
        return [newStudent, ...prev];
      });
      addToast({
        type: 'info',
        title: 'New Student Registered',
        body: `${newStudent.name} (${newStudent.studentId}) registered for ${newStudent.programme}.`
      });
    });

    newSocket.on('new_message', (msg) => {
      setMessages(prev => {
        if (prev.some(m => m.id === msg.id)) return prev;
        return [...prev, msg];
      });
      if (msg.toId === user?.id) {
        addToast({
          type: 'info',
          title: 'New Message Received',
          body: msg.subject
        });
      }
    });

    newSocket.on('new_notification', (notif) => {
      setNotifications(prev => {
        if (prev.some(n => n.id === notif.id)) return prev;
        return [notif, ...prev];
      });
      if (notif.userId === user?.id) {
        addToast({
          type: notif.type === 'danger' ? 'danger' : 'info',
          title: notif.title,
          body: notif.body
        });
      }
    });

    newSocket.on('grade_updated', (updatedGrade) => {
      setGrades(prev => {
        const idx = prev.findIndex(g => g.assessmentId === updatedGrade.assessmentId && g.studentId === updatedGrade.studentId);
        if (idx >= 0) {
          const cp = [...prev];
          cp[idx] = updatedGrade;
          return cp;
        }
        return [...prev, updatedGrade];
      });
    });

    newSocket.on('attendance_updated', (updatedAt) => {
      setAttendance(prev => {
        const idx = prev.findIndex(a => a.studentId === updatedAt.studentId && a.moduleId === updatedAt.moduleId);
        if (idx >= 0) {
          const cp = [...prev];
          cp[idx] = updatedAt;
          return cp;
        }
        return [...prev, updatedAt];
      });
    });

    newSocket.on('risk_case_updated', (caseData) => {
      setRiskCases(prev => {
        const idx = prev.findIndex(rc => rc.id === caseData.caseId || rc.studentId === caseData.studentId);
        if (idx >= 0) {
          const cp = [...prev];
          cp[idx] = { ...cp[idx], ...caseData };
          return cp;
        }
        return [...prev, caseData];
      });
    });

    newSocket.on('intervention_added', ({ caseId, intervention }) => {
      setRiskCases(prev => prev.map(rc => rc.id === caseId ? { ...rc, interventions: [...(rc.interventions || []), intervention] } : rc));
    });

    newSocket.on('application_status_updated', ({ id, status }) => {
      setApplications(prev => prev.map(a => a.id === id ? { ...a, status } : a));
    });

    newSocket.on('email_queue_updated', ({ id, status }) => {
      setEmailQueue(prev => prev.map(e => e.id === id ? { ...e, status } : e));
    });

    newSocket.on('new_announcement', (ann) => {
      setAnnouncements(prev => [ann, ...prev]);
      addToast({ type: 'info', title: 'New Announcement', body: ann.title });
    });

    return () => {
      newSocket.disconnect();
    };
  }, [user?.id, addToast]);

  const markNotifRead = useCallback((id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    fetch(`/api/notifications/${id}/read`, {
      method: 'PATCH',
      headers: token ? { 'Authorization': `Bearer ${token}` } : {}
    }).catch(() => {});
  }, [token]);

  const markAllRead = useCallback((userId) => {
    setNotifications(prev => prev.map(n => (!userId || n.userId === userId) ? { ...n, read: true } : n));
    fetch('/api/notifications/read-all', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      },
      body: JSON.stringify({ userId })
    }).catch(() => {});
  }, [token]);

  const sendMessage = useCallback((fromId, toId, subject, body) => {
    const newMsg = {
      id: `msg${Date.now()}`,
      conversationId: `conv${Date.now()}`,
      fromId, toId, subject, body,
      timestamp: new Date().toISOString(),
      read: false
    };
    setMessages(prev => [...prev, newMsg]);

    const sender = users.find(u => u.id === fromId) || USERS.find(u => u.id === fromId);
    setNotifications(prev => [...prev, {
      id: `n${Date.now()}`,
      userId: toId,
      type: 'info',
      title: `New message from ${sender?.name || 'Someone'}`,
      body: subject,
      read: false,
      timestamp: new Date().toISOString()
    }]);
    addToast({ type: 'success', title: 'Message sent', body: 'Your message has been delivered.' });

    // Sync to backend with token
    fetch('/api/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      },
      body: JSON.stringify({ fromId, toId, subject, body })
    }).catch(() => {});

    return newMsg;
  }, [addToast, token, users]);

  const updateApplicationStatus = useCallback((id, status) => {
    setApplications(prev => prev.map(a => a.id === id ? { ...a, status } : a));
    const statusLabels = { accepted: 'accepted', rejected: 'rejected', under_review: 'under review' };
    addToast({ type: 'success', title: 'Application updated', body: `Application marked as ${statusLabels[status] || status}.` });

    fetch(`/api/applications/${id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      },
      body: JSON.stringify({ status })
    }).catch(() => {});
  }, [addToast, token]);

  const uploadApplicationDocument = useCallback(async (applicationId, file) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch(`/api/applications/${applicationId}/documents`, {
        method: 'POST',
        headers: token ? { 'Authorization': `Bearer ${token}` } : {},
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setApplications(prev => prev.map(a => a.id === applicationId ? { ...a, docs: data.docs } : a));
        addToast({ type: 'success', title: 'Document uploaded', body: `${file.name} saved successfully.` });
        return { success: true, document: data.document };
      }
    } catch (err) {
      addToast({ type: 'danger', title: 'Upload failed', body: err.message });
    }
    return { success: false };
  }, [addToast, token]);

  const addGrade = useCallback((assessmentId, studentId, mark, feedback) => {
    const newGrade = { id: `g${Date.now()}`, assessmentId, studentId, mark: Number(mark), feedback };
    setGrades(prev => {
      const existing = prev.findIndex(g => g.assessmentId === assessmentId && g.studentId === studentId);
      if (existing >= 0) { const n = [...prev]; n[existing] = newGrade; return n; }
      return [...prev, newGrade];
    });
    addToast({ type: 'success', title: 'Grade recorded', body: 'Student grade saved & risk evaluation triggered.' });

    fetch('/api/grades', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      },
      body: JSON.stringify({ assessmentId, studentId, mark, feedback })
    }).catch(() => {});
  }, [addToast, token]);

  const addRiskIntervention = useCallback((caseId, action, by) => {
    const intervention = { id: `i${Date.now()}`, date: new Date().toISOString().split('T')[0], action, by, outcome: 'Pending response' };
    setRiskCases(prev => prev.map(rc => rc.id === caseId ? { ...rc, interventions: [...(rc.interventions || []), intervention] } : rc));
    addToast({ type: 'success', title: 'Intervention recorded', body: 'The action has been logged.' });

    fetch(`/api/risk-cases/${caseId}/interventions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      },
      body: JSON.stringify({ action, by })
    }).catch(() => {});
  }, [addToast, token]);

  const retryEmail = useCallback((id) => {
    setEmailQueue(prev => prev.map(e => e.id === id ? { ...e, status: 'queued', retries: 0, error: null } : e));
    addToast({ type: 'info', title: 'Dispatching Email', body: 'Attempting SMTP/Ethereal delivery...' });

    fetch(`/api/email-queue/${id}/retry`, {
      method: 'POST',
      headers: token ? { 'Authorization': `Bearer ${token}` } : {}
    })
      .then(r => r.json())
      .then(res => {
        if (res.delivered) {
          addToast({ type: 'success', title: 'Email Delivered', body: 'Delivery confirmed successfully.' });
        } else {
          addToast({ type: 'danger', title: 'Delivery Failed', body: 'Check SMTP server settings.' });
        }
      })
      .catch(() => {});
  }, [addToast, token]);

  const addAnnouncement = useCallback((moduleId, title, body, postedBy) => {
    const ann = { id: `an${Date.now()}`, moduleId, title, body, postedBy, date: new Date().toISOString().split('T')[0] };
    setAnnouncements(prev => [ann, ...prev]);
    addToast({ type: 'success', title: 'Announcement posted', body: 'Broadcasting to all module students in real time.' });

    fetch('/api/announcements', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      },
      body: JSON.stringify({ moduleId, title, body, postedBy })
    }).catch(() => {});
  }, [addToast, token]);

  const exportToCsv = useCallback((filename, headers, rows) => {
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${String(cell || '').replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast({ type: 'info', title: 'Report Exported', body: `Downloaded ${filename}.csv` });
  }, [addToast]);

  return (
    <DataContext.Provider value={{
      users, programmes, modules,
      notifications, messages, grades, riskCases, attendance, enrolments,
      applications, emailQueue, announcements, toasts, isDbConnected, socket,
      markNotifRead, markAllRead, sendMessage, updateApplicationStatus,
      uploadApplicationDocument, addGrade, addRiskIntervention, retryEmail,
      addAnnouncement, addToast, exportToCsv
    }}>
      {children}
    </DataContext.Provider>
  );
}

export const useData = () => useContext(DataContext);
