import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function Navbar() {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => { logout(); navigate('/login'); };
  const roleLabel = role === 'doctor' ? 'Doctor' : role === 'admin' ? 'Admin' : 'Patient';

  return (
    <nav className="navbar navbar-expand-lg navbar-dark">
      <div className="container-fluid">
        <NavLink className="navbar-brand" to="/dashboard">
          <i className="fas fa-user-plus me-1"></i> Global Hospital
        </NavLink>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item"><NavLink className="nav-link" to="/dashboard"><i className="fas fa-chart-pie me-1"></i>Dashboard</NavLink></li>
            <li className="nav-item"><NavLink className="nav-link" to="/appointments"><i className="fas fa-calendar-check me-1"></i>Appointments</NavLink></li>
            {(role === 'admin' || role === 'doctor') && (
              <li className="nav-item"><NavLink className="nav-link" to="/patients"><i className="fas fa-users me-1"></i>Patients</NavLink></li>
            )}
          </ul>
          <div className="d-flex align-items-center text-white gap-3">
            <span className="badge bg-white text-primary">{roleLabel}</span>
            <span className="small"><i className="fas fa-user-circle me-1"></i>{user?.username || user?.fname || user?.email || 'User'}</span>
            <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>
              <i className="fas fa-sign-out-alt me-1"></i>Logout
            </button>
          </div>
</div>
      </div>
    </nav>
  );
}
