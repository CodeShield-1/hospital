import React, { useState, useEffect } from 'react';
import api, { appointmentApi } from '../../services/api';
import LoadingSpinner from '../Shared/LoadingSpinner';
import { toast } from 'react-toastify';

export default function NursePortal() {
  const [activeTab, setActiveTab] = useState('list-app');
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [prescriptions, setPrescriptions] = useState([]);
  const [searchContact, setSearchContact] = useState('');
  const [searchDoctorEmail, setSearchDoctorEmail] = useState('');
  const [searchAppContact, setSearchAppContact] = useState('');

  useEffect(() => { fetchAllData(); }, []);

  const fetchAllData = async () => {
    try {
      const [apptRes, patRes, docRes, prescRes, msgRes] = await Promise.all([
        appointmentApi.get('/api/appointments'),
        api.get('/api/patients'),
        api.get('/api/doctors'),
        api.get('/api/prescriptions'),
        api.get('/api/contact'),
      ]);
      setAppointments(apptRes.data.appointments || []);
      setPatients(patRes.data.patients || []);
      setDoctors(docRes.data.doctors || []);
      setPrescriptions(prescRes.data.prescriptions || []);
      setMessages(msgRes.data.messages || []);
    } catch (err) { toast.error('Failed to load data'); }
    finally { setLoading(false); }
  };

  const handleAppSearch = async (e) => {
    e.preventDefault();
    try {
      const res = await appointmentApi.get(`/api/appointments/search?contact=${searchAppContact}`);
      setAppointments(res.data.appointments || [res.data.appointment].filter(Boolean));
    } catch { toast.error('No appointment found'); }
  };

  const handlePatientSearch = async (e) => {
    e.preventDefault();
    try {
      const res = await api.get(`/api/patients/search?contact=${searchContact}`);
      setPatients([res.data.patient].filter(Boolean));
    } catch { toast.error('No patient found'); }
  };

  const handleDoctorSearch = async (e) => {
    e.preventDefault();
    try {
      const res = await api.get(`/api/doctors/search?email=${searchDoctorEmail}`);
      setDoctors([res.data.doctor].filter(Boolean));
    } catch { toast.error('No doctor found'); }
  };

  if (loading) return <LoadingSpinner />;

  const getStatusBadge = (appt) => {
    if (appt.userStatus === 1 && appt.doctorStatus === 1) return <span className="badge badge-status-active">Active</span>;
    if (appt.userStatus === 0) return <span className="badge badge-status-cancelled-patient">Cancelled by Patient</span>;
    return <span className="badge badge-status-cancelled-doctor">Cancelled by Doctor</span>;
  };

  const tabs = [
    { key: 'list-app', icon: 'fa-calendar', label: 'Appointments', count: appointments.length },
    { key: 'list-pat', icon: 'fa-users', label: 'Patients', count: patients.length },
    { key: 'list-doc', icon: 'fa-user-md', label: 'Doctors', count: doctors.length },
    { key: 'list-pres', icon: 'fa-prescription', label: 'Prescriptions', count: prescriptions.length },
    { key: 'list-msg', icon: 'fa-envelope', label: 'Messages', count: messages.length },
  ];

  return (
    <div className="container-fluid py-4 bg-pattern">
      <div className="page-header animate-fade-in-up">
        <h3>
          <i className="fas fa-user-nurse"></i>
          Receptionist Dashboard
        </h3>
        <div className="d-flex gap-2 align-items-center">
          <span className="live-indicator">Live</span>
          <span className="text-muted small">Global Hospital Management System</span>
        </div>
      </div>
      <div className="row">
        <div className="col-md-3 col-lg-2 mb-4">
          <div className="list-group">
            {tabs.map(tab => (
              <button key={tab.key}
                className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center ${activeTab === tab.key ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.key)}
              >
                <span><i className={`fas ${tab.icon} me-2`}></i>{tab.label}</span>
                <span className="badge bg-light text-dark rounded-pill">{tab.count}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="col-md-9 col-lg-10">
          {activeTab === 'list-app' && (
            <div>
              <div className="card mb-4">
                <div className="card-body">
                  <form onSubmit={handleAppSearch} className="d-flex gap-2">
                    <input type="text" className="form-control" placeholder="Search by contact..." value={searchAppContact} onChange={(e) => setSearchAppContact(e.target.value)} />
                    <button type="submit" className="btn btn-primary"><i className="fas fa-search me-1"></i>Search</button>
                    {searchAppContact && <button type="button" className="btn btn-secondary" onClick={() => { setSearchAppContact(''); fetchAllData(); }}>Clear</button>}
                  </form>
                </div>
              </div>
              <div className="card">
                <div className="card-header bg-gradient-primary text-white d-flex justify-content-between align-items-center">
                  <h5 className="mb-0"><i className="fas fa-list me-2"></i>All Appointments</h5>
                  <span className="badge bg-light text-dark">{appointments.length} total</span>
                </div>
                <div className="card-body p-0">
                  <div className="table-responsive">
                    <table className="table table-hover mb-0">
                      <thead>
                        <tr>
                          <th>ID</th><th>Patient ID</th><th>Patient</th><th>Doctor</th>
                          <th>Date</th><th>Time</th><th>Fees</th><th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {appointments.length === 0 ? (
                          <tr><td colSpan="8" className="text-center text-muted py-4">No appointments</td></tr>
                        ) : (
                          appointments.map(a => (
                            <tr key={a._id}>
                              <td><span className="badge bg-secondary">{a._id?.slice(-6)}</span></td>
                              <td><span className="badge bg-info">{a.pid?.slice(-6) || a._id?.slice(-6)}</span></td>
                              <td><strong>{a.fname} {a.lname}</strong></td>
                              <td>{a.doctor}</td>
                              <td>{new Date(a.appdate).toLocaleDateString()}</td>
                              <td>{a.apptime}</td>
                              <td>${a.docFees}</td>
                              <td>{getStatusBadge(a)}</td>
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
          {activeTab === 'list-pat' && (
            <div>
              <div className="card mb-4">
                <div className="card-body">
                  <form onSubmit={handlePatientSearch} className="d-flex gap-2">
                    <input type="text" className="form-control" placeholder="Search by contact..." value={searchContact} onChange={(e) => setSearchContact(e.target.value)} />
                    <button type="submit" className="btn btn-primary"><i className="fas fa-search me-1"></i>Search</button>
                    {searchContact && <button type="button" className="btn btn-secondary" onClick={() => { setSearchContact(''); fetchAllData(); }}>Clear</button>}
                  </form>
                </div>
              </div>
              <div className="card">
                <div className="card-header bg-gradient-primary text-white d-flex justify-content-between align-items-center">
                  <h5 className="mb-0"><i className="fas fa-users me-2"></i>Registered Patients</h5>
                  <span className="badge bg-light text-dark">{patients.length} total</span>
                </div>
                <div className="card-body p-0">
                  <div className="table-responsive">
                    <table className="table table-hover mb-0">
                      <thead>
                        <tr>
                          <th>ID</th><th>Name</th><th>Gender</th><th>Email</th><th>Contact</th>
                        </tr>
                      </thead>
                      <tbody>
                        {patients.map(p => (
                          <tr key={p._id || p.pid}>
                            <td><span className="badge bg-secondary">{p._id?.slice(-6) || p.pid}</span></td>
                            <td><strong>{p.fname} {p.lname}</strong></td>
                            <td>{p.gender}</td><td>{p.email}</td><td>{p.contact}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}
          {activeTab === 'list-doc' && (
            <div>
              <div className="card mb-4">
                <div className="card-body">
                  <form onSubmit={handleDoctorSearch} className="d-flex gap-2">
                    <input type="text" className="form-control" placeholder="Search by email..." value={searchDoctorEmail} onChange={(e) => setSearchDoctorEmail(e.target.value)} />
                    <button type="submit" className="btn btn-primary"><i className="fas fa-search me-1"></i>Search</button>
                    {searchDoctorEmail && <button type="button" className="btn btn-secondary" onClick={() => { setSearchDoctorEmail(''); fetchAllData(); }}>Clear</button>}
                  </form>
                </div>
              </div>
              <div className="card">
                <div className="card-header bg-gradient-primary text-white d-flex justify-content-between align-items-center">
                  <h5 className="mb-0"><i className="fas fa-user-md me-2"></i>Doctors</h5>
                  <span className="badge bg-light text-dark">{doctors.length} total</span>
                </div>
                <div className="card-body p-0">
                  <div className="table-responsive">
                    <table className="table table-hover mb-0">
                      <thead>
                        <tr>
                          <th>Username</th><th>Email</th><th>Specialization</th><th>Fees</th>
                        </tr>
                      </thead>
                      <tbody>
                        {doctors.map(d => (
                          <tr key={d._id}>
                            <td><strong>{d.username}</strong></td>
                            <td>{d.email}</td>
                            <td><span className="badge badge-spec">{d.spec}</span></td>
                            <td>${d.docFees}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}
          {activeTab === 'list-pres' && (
            <div className="card">
              <div className="card-header bg-gradient-primary text-white d-flex justify-content-between align-items-center">
                <h5 className="mb-0"><i className="fas fa-prescription me-2"></i>Prescriptions</h5>
                <span className="badge bg-light text-dark">{prescriptions.length} total</span>
              </div>
              <div className="card-body p-0">
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead>
                      <tr>
                        <th>Doctor</th><th>Patient ID</th><th>Patient</th><th>Date</th>
                        <th>Disease</th><th>Allergy</th><th>Prescription</th>
                      </tr>
                    </thead>
                    <tbody>
                      {prescriptions.length === 0 ? (
                        <tr><td colSpan="7" className="text-center text-muted py-4">No prescriptions</td></tr>
                      ) : (
                        prescriptions.map(p => (
                          <tr key={p._id}>
                            <td><strong>{p.doctor}</strong></td>
                            <td><span className="badge bg-secondary">{p.pid?.slice(-6) || p._id?.slice(-6)}</span></td>
                            <td>{p.fname} {p.lname}</td>
                            <td>{new Date(p.appdate).toLocaleDateString()}</td>
                            <td>{p.disease}</td>
                            <td>{p.allergy}</td>
                            <td style={{ maxWidth: '200px' }}>{p.prescription}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
          {activeTab === 'list-msg' && (
            <div className="card">
              <div className="card-header bg-gradient-primary text-white d-flex justify-content-between align-items-center">
                <h5 className="mb-0"><i className="fas fa-envelope me-2"></i>Contact Messages</h5>
                <span className="badge bg-light text-dark">{messages.length} total</span>
              </div>
              <div className="card-body p-0">
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead>
                      <tr>
                        <th>Name</th><th>Email</th><th>Contact</th><th>Message</th>
                      </tr>
                    </thead>
                    <tbody>
                      {messages.length === 0 ? (
                        <tr><td colSpan="4" className="text-center text-muted py-4">No messages</td></tr>
                      ) : (
                        messages.map(m => (
                          <tr key={m._id}>
                            <td><strong>{m.name}</strong></td>
                            <td>{m.email}</td>
                            <td>{m.contact}</td>
                            <td style={{ maxWidth: '300px' }}>{m.message}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

