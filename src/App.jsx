import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import Sidebar from './components/Sidebar';
import ToastStack from './components/ToastStack';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import LandingPage from './pages/LandingPage';

// Admin
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminApplications from './pages/admin/AdminApplications';
import AdminStudents from './pages/admin/AdminStudents';
import AdminProgrammes from './pages/admin/AdminProgrammes';
import AdminReports from './pages/admin/AdminReports';
import AdminEmailSystem from './pages/admin/AdminEmailSystem';
import AdminAudit from './pages/admin/AdminAudit';
import AdminMessages from './pages/admin/AdminMessages';

// Lecturer
import LecturerDashboard from './pages/lecturer/LecturerDashboard';
import LecturerModules from './pages/lecturer/LecturerModules';
import LecturerGrades from './pages/lecturer/LecturerGrades';
import LecturerAttendance from './pages/lecturer/LecturerAttendance';
import LecturerAtRisk from './pages/lecturer/LecturerAtRisk';
import LecturerMessages from './pages/lecturer/LecturerMessages';

// Student
import StudentDashboard from './pages/student/StudentDashboard';
import StudentModules from './pages/student/StudentModules';
import StudentTimetable from './pages/student/StudentTimetable';
import StudentGrades from './pages/student/StudentGrades';
import StudentMessages from './pages/student/StudentMessages';
import StudentNotifications from './pages/student/StudentNotifications';

// Success Officer
import SuccessDashboard from './pages/success/SuccessDashboard';
import SuccessRiskCases from './pages/success/SuccessRiskCases';
import SuccessInterventions from './pages/success/SuccessInterventions';
import SuccessStudents from './pages/success/SuccessStudents';
import SuccessMessages from './pages/success/SuccessMessages';

// Shared
import NotificationsPage from './pages/shared/NotificationsPage';

function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className={`app-layout${sidebarOpen ? ' sidebar-open' : ''}`}>
      <Sidebar isOpen={sidebarOpen} onNavigate={() => setSidebarOpen(false)} />
      {sidebarOpen && <button className="sidebar-backdrop" onClick={() => setSidebarOpen(false)} aria-label="Close navigation" />}
      <div className="main-content">
        <Outlet context={{ onMenuClick: () => setSidebarOpen(open => !open), sidebarOpen }} />
      </div>
      <ToastStack />
    </div>
  );
}

function RequireAuth({ allowedRoles }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/" replace />;
  return <AppLayout />;
}

function RootRedirect() {
  const { user } = useAuth();
  if (!user) return <LandingPage />;
  const routes = { admin: '/admin', lecturer: '/lecturer', student: '/student', success_officer: '/success' };
  return <Navigate to={routes[user.role] || '/'} replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <DataProvider>
          <Routes>
            <Route path="/" element={<RootRedirect />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Admin routes */}
            <Route element={<RequireAuth allowedRoles={['admin']} />}>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/applications" element={<AdminApplications />} />
              <Route path="/admin/students" element={<AdminStudents />} />
              <Route path="/admin/programmes" element={<AdminProgrammes />} />
              <Route path="/admin/reports" element={<AdminReports />} />
              <Route path="/admin/email-system" element={<AdminEmailSystem />} />
              <Route path="/admin/audit" element={<AdminAudit />} />
              <Route path="/admin/messages" element={<AdminMessages />} />
              <Route path="/admin/notifications" element={<NotificationsPage />} />
            </Route>

            {/* Lecturer routes */}
            <Route element={<RequireAuth allowedRoles={['lecturer']} />}>
              <Route path="/lecturer" element={<LecturerDashboard />} />
              <Route path="/lecturer/modules" element={<LecturerModules />} />
              <Route path="/lecturer/grades" element={<LecturerGrades />} />
              <Route path="/lecturer/attendance" element={<LecturerAttendance />} />
              <Route path="/lecturer/at-risk" element={<LecturerAtRisk />} />
              <Route path="/lecturer/messages" element={<LecturerMessages />} />
            </Route>

            {/* Student routes */}
            <Route element={<RequireAuth allowedRoles={['student']} />}>
              <Route path="/student" element={<StudentDashboard />} />
              <Route path="/student/modules" element={<StudentModules />} />
              <Route path="/student/timetable" element={<StudentTimetable />} />
              <Route path="/student/grades" element={<StudentGrades />} />
              <Route path="/student/messages" element={<StudentMessages />} />
              <Route path="/student/notifications" element={<StudentNotifications />} />
            </Route>

            {/* Success Officer routes */}
            <Route element={<RequireAuth allowedRoles={['success_officer']} />}>
              <Route path="/success" element={<SuccessDashboard />} />
              <Route path="/success/risk-cases" element={<SuccessRiskCases />} />
              <Route path="/success/interventions" element={<SuccessInterventions />} />
              <Route path="/success/students" element={<SuccessStudents />} />
              <Route path="/success/messages" element={<SuccessMessages />} />
              <Route path="/success/notifications" element={<NotificationsPage />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </DataProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
