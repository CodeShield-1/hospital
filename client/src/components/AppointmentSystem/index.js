import React, { useState, useEffect } from 'react';
import { appointmentApi } from '../../services/api';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../Shared/LoadingSpinner';
import { toast } from 'react-toastify';
import { useSearchParams } from 'react-router-dom';

export default function AppointmentSystem() {
  const { user, role } = useAuth();
  const [searchParams] = useSearchParams();
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showBooking, setShowBooking] = useState(!!searchParams.get('pid'));
  const [formData, setFormData] = useState({
    fname: searchParams.get('fname') || user?.fname || '',
    lname: searchParams.get('lname') || user?.lname || '',
    gender: user?.gender || 'Male',
    email: user?.email || '',
    contact: user?.contact || '',
    doctor: '',
    docFees: '',
    appdate: '',
    apptime: '',
  });
  const [selectedSpec, setSelectedSpec] = useState('');
  const [booking, setBooking] = useState(false);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [apptRes, docRes] = await Promise.all([
        role === 'patient' && user?._id ? appointmentApi.get(`/api/appointments/patient/${user._id}`) : appointmentApi.get('/api/appointments'),
        api.get('/api/doctors'),
      ]);
      setAppointments(apptRes.data?.appointments || []);
      setDoctors(docRes.data.doctors || []);
      const specs = [...new Set((docRes.data.doctors || []).map(d => d.spec))];
      setSpecializations(specs);
    } catch (err) { setAppointments([]); } finally { setLoading(false); }
  };

  const handleSpecChange = (spec) => { setSelectedSpec(spec); setFormData(prev => ({ ...prev, doctor: '', docFees: '' })); };

  const handleDoctorChange = (doctorName) => {
    const doctor = doctors.find(d => d.username === doctorName);
    setFormData(prev => ({ ...prev, doctor: doctorName, docFees: doctor ? doctor.docFees : '' }));
  };

  const handleSubmitBooking = async (e) => {
    e.preventDefault();
    setBooking(true);
    try {
      await appointmentApi.post('/api/appointments', { ...formData, pid: user?._id || searchParams.get('pid') });
      toast.success('Appointment booked successfully!');
      setShowBooking(false);
      setFormData(prev => ({ ...prev, doctor: '', docFees: '', appdate: '', apptime: '' }));
      fetchData();
    } catch (err) { toast.error(err.response?.data?.error || 'Failed to book appointment'); }
    finally { setBooking(false); }
  };

  const cancelAppointment = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) return;
    try {
      await appointmentApi.patch(`/api/appointments/${id}/cancel/${role === 'doctor' ? 'doctor' : 'patient'}`);
      toast.success('Appointment cancelled');
      fetchData();
    } catch (err) { toast.error('Failed to cancel'); }
  };

  const getStatusBadge = (a) => {
    if (a.userStatus === 1 && a.doctorStatus === 1) return <span className="badge badge-status-active">Active</span>;
    if (a.userStatus === 0) return <span className="badge badge-status-cancelled-patient">Cancelled by Patient</span>;
    return <span className="badge badge-status-cancelled-doctor">Cancelled by Doctor</span>;
  };

  if (loading) return <LoadingSpinner />;

  const activeCount = appointments.filter(a => a.userStatus === 1 && a.doctorStatus === 1).length;

  return (
    <div className="container-fluid py-4 bg-pattern">
      <div className="page-header animate-fade-in-up">
        <h3><i className="fas fa-calendar-check"></i> Appointment System</h3>
        <div className="d-flex gap-2 align-items-center">
          <span className="badge bg-info fs-6">Microservice</span>
          <span className="live-indicator">Live</span>
        </div>
      </div>
      <div className="row">
        <div className={showBooking ? 'col-md-8' : 'col-md-12'}>
          <div className="card animate-fade-in-up delay-1">
            <div className="card-header bg-gradient-primary text-white d-flex justify-content-between align-items-center">
              <h5 className="mb-0"><i className="fas fa-list me-2"></i>Appointments</h5>
              {role !== 'doctor' && (
                <button className="btn btn-light btn-sm" onClick={() => setShowBooking(!showBooking)}>
                  <i className={`fas fa-${showBooking ? 'times' : 'plus'} me-1`}></i>
                  {showBooking ? 'Close' : 'New Booking'}
                </button>
              )}
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead>
                    <tr>
                      <th>Patient</th>
                      <th>Doctor</th>
                      <th>Date</th>
                      <th>Time</th>
                      <th>Fees</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.length === 0 ? (
                      <tr><td colSpan="7" className="text-center py-5">
                        <div className="empty-state"><i className="fas fa-calendar-times"></i><p>No appointments found</p></div>
                      </td></tr>
                    ) : (
                      appointments.map(a => (
                        <tr key={a._id}>
                          <td><strong>{a.fname} {a.lname}</strong></td>
                          <td>{a.doctor}</td>
                          <td>{new Date(a.appdate).toLocaleDateString()}</td>
                          <td>{a.apptime}</td>
                          <td>${a.docFees}</td>
                          <td>{getStatusBadge(a)}</td>
                          <td>
                            {a.userStatus === 1 && a.doctorStatus === 1 && (
                              <button className="btn btn-danger btn-sm" onClick={() => cancelAppointment(a._id)}>
                                <i className="fas fa-times"></i> Cancel
                              </button>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        {showBooking && (
          <div className="col-md-4 animate-fade-in-right">
            <div className="card">
              <div className="card-header bg-gradient-success text-white">
                <h5 className="mb-0"><i className="fas fa-plus-circle me-2"></i>Book Appointment</h5>
              </div>
              <div className="card-body">
                <form onSubmit={handleSubmitBooking}>
                  <div className="mb-2">
                    <label className="form-label">First Name</label>
                    <input type="text" className="form-control" value={formData.fname} onChange={e => setFormData({ ...formData, fname: e.target.value })} required />
                  </div>
                  <div className="mb-2">
                    <label className="form-label">Last Name</label>
                    <input type="text" className="form-control" value={formData.lname} onChange={e => setFormData({ ...formData, lname: e.target.value })} required />
                  </div>
                  <div className="mb-2">
                    <label className="form-label">Gender</label>
                    <select className="form-select" value={formData.gender} onChange={e => setFormData({ ...formData, gender: e.target.value })}>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                  <div className="mb-2">
                    <label className="form-label">Email</label>
                    <input type="email" className="form-control" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} required />
                  </div>
                  <div className="mb-2">
                    <label className="form-label">Contact</label>
                    <input type="text" className="form-control" value={formData.contact} onChange={e => setFormData({ ...formData, contact: e.target.value })} maxLength="10" required />
                  </div>
                  <hr />
                  <div className="mb-2">
                    <label className="form-label">Specialization</label>
                    <select className="form-select" value={selectedSpec} onChange={e => handleSpecChange(e.target.value)}>
                      <option value="">Select Specialization</option>
                      {specializations.map(spec => (<option key={spec} value={spec}>{spec}</option>))}
                    </select>
                  </div>
                  <div className="mb-2">
                    <label className="form-label">Doctor</label>
                    <select className="form-select" value={formData.doctor} onChange={e => handleDoctorChange(e.target.value)} required>
                      <option value="">Select Doctor</option>
                      {doctors.filter(d => !selectedSpec || d.spec === selectedSpec).map(d => (
                        <option key={d._id} value={d.username}>{d.username} - ${d.docFees}</option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-2">
                    <label className="form-label">Consultancy Fees</label>
                    <input type="text" className="form-control" value={formData.docFees} readOnly />
                  </div>
                  <div className="mb-2">
                    <label className="form-label">Date</label>
                    <input type="date" className="form-control" value={formData.appdate}
                      onChange={e => setFormData({ ...formData, appdate: e.target.value })}
                      min={new Date().toISOString().split('T')[0]} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Time</label>
                    <select className="form-select" value={formData.apptime} onChange={e => setFormData({ ...formData, apptime: e.target.value })} required>
                      <option value="">Select Time</option>
                      <option value="08:00:00">8:00 AM</option>
                      <option value="10:00:00">10:00 AM</option>
                      <option value="12:00:00">12:00 PM</option>
                      <option value="14:00:00">2:00 PM</option>
                      <option value="16:00:00">4:00 PM</option>
                    </select>
                  </div>
                  <button type="submit" className="btn btn-success w-100" disabled={booking}>
                    {booking ? (
                      <><span className="spinner-border spinner-border-sm me-2" role="status"></span>Booking...</>
                    ) : (
                      <><i className="fas fa-check me-2"></i>Book Appointment</>
                    )}
                  </button>
                </form>
              </div>
            </div>
            <div className="stat-card bg-gradient-success mt-3">
              <i className="fas fa-calendar-check stat-icon"></i>
              <div className="stat-number">{activeCount}</div>
              <div className="stat-label">Active Appointments</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

