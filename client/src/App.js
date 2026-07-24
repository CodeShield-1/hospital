import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Navbar from './components/Shared/Navbar';
import AuthGuard from './components/Shared/AuthGuard';
import LoadingSpinner from './components/Shared/LoadingSpinner';
import LoginPage from './components/Shared/LoginPage';
import DoctorDashboard from './components/DoctorDashboard';
import NursePortal from './components/NursePortal';
import PatientManagement from './components/PatientManagement';
import AppointmentSystem from './components/AppointmentSystem';

function App() {
  const { isAuthenticated, role, loading } = useAuth();

  if (loading) return <LoadingSpinner fullPage />;

  return (
    <Router>
      {isAuthenticated && <Navbar />}
      <div className={isAuthenticated ? 'main-container' : ''}>
        <Routes>
          {/* Public route */}
          <Route
            path="/login"
            element={isAuthenticated ? <Navigate to="/dashboard" /> : <LoginPage />}
          />

          {/* Doctor Dashboard */}
          <Route
            path="/dashboard"
            element={
              <AuthGuard>
                {role === 'doctor' ? <DoctorDashboard /> : <NursePortal />}
              </AuthGuard>
            }
          />

          {/* Patient Management */}
          <Route
            path="/patients"
            element={
              <AuthGuard roles={['admin', 'doctor']}>
                <PatientManagement />
              </AuthGuard>
            }
          />
          <Route
            path="/patients/:id"
            element={
              <AuthGuard roles={['admin', 'doctor']}>
                <PatientManagement view="detail" />
              </AuthGuard>
            }
          />

          {/* Appointment System */}
          <Route
            path="/appointments"
            element={
              <AuthGuard>
                <AppointmentSystem />
              </AuthGuard>
            }
          />
          <Route
            path="/appointments/book"
            element={
              <AuthGuard roles={['patient', 'admin']}>
                <AppointmentSystem view="book" />
              </AuthGuard>
            }
          />

          {/* Default redirect */}
          <Route path="*" element={<Navigate to={isAuthenticated ? '/dashboard' : '/login'} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

