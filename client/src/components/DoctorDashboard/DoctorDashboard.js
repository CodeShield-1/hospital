import React, { useState, useEffect } from 'react';
import api, { appointmentApi } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../Shared/LoadingSpinner';
import { toast } from 'react-toastify';

export default function DoctorDashboard() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dash');
  const [showPrescribe, setShowPrescribe] = useState(false);
  const [prescribeForm, setPrescribeForm] = useState({ disease: '', allergy: '', prescription: '', pid: '', ID: '', fname: '', lname: '', appdate: '', apptime: '' });

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [apptRes, prescRes] = await Promise.all([appointmentApi.get('/api/appointments'), api.get('/api/prescriptions')]);
      const doctorName = user?.username || user?.email;
      setAppointments((apptRes.data.appointments || []).filter(a => a.doctor === doctorName));
      setPrescriptions((prescRes.data.prescriptions || []).filter(p => p.doctor === doctorName));
    } catch (err) { toast.error('Failed to load data'); } finally { setLoading(false); }
  };

  const cancelAppointment = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) return;
    try { await appointmentApi.patch(`/api/appointments/${id}/cancel/doctor`); toast.success('Appointment cancelled'); fetchData(); }
    catch (err) { toast.error('Failed to cancel'); }
  };

  const handlePrescribeClick = (appt) => {
    setPrescribeForm({ pid: appt.pid || appt._id, ID: appt._id, fname: appt.fname, lname: appt.lname, appdate: appt.appdate, apptime: appt.apptime, disease: '', allergy: '', prescription: '' });
    setShowPrescribe(true);
    setActiveTab('list-pres');
  };

  const handlePrescribeSubmit = async (e) => {
    e.preventDefault();
    try { await api.post('/api/prescriptions', { ...prescribeForm, doctor: user?.username || user?.email }); toast.success('Prescribed successfully!'); setShowPrescribe(false); fetchData(); }
    catch (err) { toast.error('Failed to prescribe'); }
  };

  if (loading) return <LoadingSpinner />;

  const getBadge = (a) => {
    if (a.userStatus === 1 && a.doctorStatus === 1) return <span className="badge badge-status-active">Active</span>;
    if (a.userStatus === 0) return <span className="badge badge-status-cancelled-patient">Cancelled by Patient</span>;
    return <span className="badge badge-status-cancelled-doctor">Cancelled by You</span>;
  };

  const activeCount = appointments.filter(a => a.userStatus === 1 && a.doctorStatus === 1).length;
  const cls = (t) => 'list-group-item list-group-item-action' + (activeTab === t ? ' active' : '');

  return (
    <div className="container-fluid py-4 bg-pattern">
      <div className="page-header animate-fade-in-up">
        <h3><i className="fas fa-user-md me-2"></i>Doctor Dashboard</h3>
        <span className="live-indicator">Live</span>
      </div>
      <div className="row">
        <div className="col-md-3 col-lg-2 mb-4">
          <div className="list-group">
            <button className={cls('dash')} onClick={() => setActiveTab('dash')}><i className="fas fa-chart-pie me-2"></i>Dashboard</button>
            <button className={cls('list-app')} onClick={() => setActiveTab('list-app')}><i className="fas fa-list me-2"></i>Appointments</button>
            <button className={cls('list-pres')} onClick={() => setActiveTab('list-pres')}><i className="fas fa-prescription me-2"></i>Prescriptions</button>
          </div>
        </div>
        <div className="col-md-9 col-lg-10">
          {activeTab === 'dash' && (
            <div className="animate-fade-in-up">
              <div className="row g-3 mb-4">
                <div className="col-md-4">
                  <div className="stat-card bg-gradient-primary">
                    <i className="fas fa-calendar-check stat-icon"></i>
                    <div className="stat-number">{activeCount}</div>
                    <div className="stat-label">Active Appointments</div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="stat-card bg-gradient-success">
                    <i className="fas fa-prescription stat-icon"></i>
                    <div className="stat-number">{prescriptions.length}</div>
                    <div className="stat-label">Total Prescriptions</div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="stat-card bg-gradient-info">
                    <i className="fas fa-users stat-icon"></i>
                    <div className="stat-number">{appointments.length}</div>
                    <div className="stat-label">Total Appointments</div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {activeTab === 'list-app' && (
            <div className="card animate-fade-in-up">
              <div className="card-header bg-gradient-primary text-white">
                <h5 className="mb-0"><i className="fas fa-calendar-alt me-2"></i>My Appointments</h5>
              </div>
              <div className="card-body p-0">
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead>
                      <tr>
                        <th>Patient ID</th><th>Name</th><th>Gender</th><th>Email</th>
                        <th>Contact</th><th>Date</th><th>Time</th><th>Status</th><th>Action</th><th>Prescribe</th>
                      </tr>
                    </thead>
                    <tbody>
                      {appointments.length === 0 ? (
                        <tr><td colSpan="10" className="text-center text-muted py-4">No appointments found</td></tr>
                      ) : (
                        appointments.map(a => (
                          <tr key={a._id}>
                            <td><span className="badge bg-secondary">{String(a.pid || a._id).slice(-6)}</span></td>
                            <td><strong>{a.fname} {a.lname}</strong></td>
                            <td>{a.gender}</td><td>{a.email}</td><td>{a.contact}</td>
                            <td>{new Date(a.appdate).toLocaleDateString()}</td><td>{a.apptime}</td>
                            <td>{getBadge(a)}</td>
                            <td>{a.userStatus === 1 && a.doctorStatus === 1 ? (
                              <button className="btn btn-danger btn-sm" onClick={() => cancelAppointment(a._id)}><i className="fas fa-times me-1"></i>Cancel</button>
                            ) : '--'}</td>
                            <td>{a.userStatus === 1 && a.doctorStatus === 1 ? (
                              <button className="btn btn-success btn-sm" onClick={() => handlePrescribeClick(a)}><i className="fas fa-prescription me-1"></i>Prescribe</button>
                            ) : '-'}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
          {activeTab === 'list-pres' && (
            <div className="animate-fade-in-up">
              {showPrescribe && (
                <div className="card mb-4">
                  <div className="card-header bg-gradient-success text-white">
                    <h5 className="mb-0"><i className="fas fa-plus-circle me-2"></i>New Prescription</h5>
                  </div>
                  <div className="card-body">
                    <form onSubmit={handlePrescribeSubmit}>
                      <div className="row mb-3">
                        <div className="col-md-4">
                          <label className="form-label">Patient</label>
                          <input className="form-control" value={prescribeForm.fname + ' ' + prescribeForm.lname} readOnly />
                        </div>
                        <div className="col-md-4">
                          <label className="form-label">Date</label>
                          <input className="form-control" value={new Date(prescribeForm.appdate).toLocaleDateString()} readOnly />
                        </div>
                        <div className="col-md-4">
                          <label className="form-label">Time</label>
                          <input className="form-control" value={prescribeForm.apptime} readOnly />
                        </div>
                      </div>
                      <div className="mb-2">
                        <label className="form-label">Disease</label>
                        <textarea className="form-control" rows="3" value={prescribeForm.disease}
                          onChange={e => setPrescribeForm({ ...prescribeForm, disease: e.target.value })} required />
                      </div>
                      <div className="mb-2">
                        <label className="form-label">Allergies</label>
                        <textarea className="form-control" rows="3" value={prescribeForm.allergy}
                          onChange={e => setPrescribeForm({ ...prescribeForm, allergy: e.target.value })} required />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Prescription</label>
                        <textarea className="form-control" rows="5" value={prescribeForm.prescription}
                          onChange={e => setPrescribeForm({ ...prescribeForm, prescription: e.target.value })} required />
                      </div>
                      <div className="d-flex gap-2">
                        <button type="submit" className="btn btn-success"><i className="fas fa-check me-2"></i>Submit Prescription</button>
                        <button type="button" className="btn btn-secondary" onClick={() => setShowPrescribe(false)}>Cancel</button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
              <div className="card">
                <div className="card-header bg-gradient-primary text-white">
                  <h5 className="mb-0"><i className="fas fa-list me-2"></i>Prescription History</h5>
                </div>
                <div className="card-body p-0">
                  <div className="table-responsive">
                    <table className="table table-hover mb-0">
                      <thead>
                        <tr>
                          <th>Patient ID</th><th>Name</th><th>Date</th><th>Time</th>
                          <th>Disease</th><th>Allergy</th><th>Prescription</th>
                        </tr>
                      </thead>
                      <tbody>
                        {prescriptions.length === 0 ? (
                          <tr><td colSpan="7" className="text-center text-muted py-4">No prescriptions</td></tr>
                        ) : (
                          prescriptions.map(p => (
                            <tr key={p._id}>
                              <td><span className="badge bg-secondary">{String(p.pid || p._id).slice(-6)}</span></td>
                              <td><strong>{p.fname} {p.lname}</strong></td>
                              <td>{new Date(p.appdate).toLocaleDateString()}</td>
                              <td>{p.apptime}</td>
                              <td>{p.disease}</td>
                              <td>{p.allergy}</td>
                              <td style={{ maxWidth: '250px' }}>{p.prescription}</td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

