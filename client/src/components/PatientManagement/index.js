import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import LoadingSpinner from '../Shared/LoadingSpinner';
import { toast } from 'react-toastify';

export default function PatientManagement() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchContact, setSearchContact] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});

  useEffect(() => { fetchPatients(); }, []);

  const fetchPatients = async () => {
    try {
      const res = await api.get('/api/patients');
      setPatients(res.data.patients || []);
    } catch (err) { toast.error('Failed to load patients'); }
    finally { setLoading(false); }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchContact.trim()) { fetchPatients(); return; }
    try {
      const res = await api.get(`/api/patients/search?contact=${searchContact}`);
      setPatients([res.data.patient].filter(Boolean));
    } catch (err) { toast.error('Patient not found with this contact'); }
  };

  const handleEdit = (patient) => {
    setIsEditing(true);
    setSelectedPatient(patient);
    setEditForm({ fname: patient.fname, lname: patient.lname, gender: patient.gender, email: patient.email, contact: patient.contact });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/api/patients/${selectedPatient._id}`, editForm);
      toast.success('Patient updated successfully');
      setIsEditing(false);
      setSelectedPatient(null);
      fetchPatients();
    } catch (err) { toast.error('Failed to update patient'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this patient?')) return;
    try { await api.delete(`/api/patients/${id}`); toast.success('Patient deleted'); fetchPatients(); }
    catch (err) { toast.error('Failed to delete patient'); }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="container-fluid py-4 bg-pattern">
      <div className="page-header animate-fade-in-up">
        <h3><i className="fas fa-users"></i> Patient Management</h3>
        <span className="text-muted small">Manage all registered patients</span>
      </div>
      <div className="row">
        <div className={isEditing ? 'col-md-8' : 'col-md-12'}>
          <div className="card mb-4 animate-fade-in-up delay-1">
            <div className="card-body">
              <form onSubmit={handleSearch} className="d-flex gap-2">
                <input type="text" className="form-control" placeholder="Search by contact number..." value={searchContact} onChange={(e) => setSearchContact(e.target.value)} />
                <button type="submit" className="btn btn-primary"><i className="fas fa-search me-1"></i>Search</button>
                {searchContact && <button type="button" className="btn btn-secondary" onClick={() => { setSearchContact(''); fetchPatients(); }}><i className="fas fa-times me-1"></i>Clear</button>}
              </form>
            </div>
          </div>
          <div className="card animate-fade-in-up delay-2">
            <div className="card-header bg-gradient-primary text-white d-flex justify-content-between align-items-center">
              <h5 className="mb-0"><i className="fas fa-list me-2"></i>All Patients</h5>
              <span className="badge bg-light text-dark">{patients.length} total</span>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead>
                    <tr>
                      <th>ID</th><th>Name</th><th>Gender</th><th>Email</th><th>Contact</th><th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {patients.length === 0 ? (
                      <tr><td colSpan="6" className="text-center py-5">
                        <div className="empty-state"><i className="fas fa-users"></i><p>No patients found</p></div>
                      </td></tr>
                    ) : (
                      patients.map(p => (
                        <tr key={p._id || p.pid}>
                          <td><span className="badge bg-secondary">{p._id?.slice(-6) || p.pid}</span></td>
                          <td><strong>{p.fname} {p.lname}</strong></td>
                          <td>{p.gender}</td><td>{p.email}</td>
                          <td><span className="badge bg-light text-dark">{p.contact}</span></td>
                          <td>
                            <div className="d-flex gap-1">
                              <button className="btn btn-primary btn-sm" onClick={() => handleEdit(p)} title="Edit"><i className="fas fa-edit"></i></button>
                              <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p._id)} title="Delete"><i className="fas fa-trash"></i></button>
                            </div>
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
        {isEditing && selectedPatient && (
          <div className="col-md-4 animate-fade-in-right">
            <div className="card">
              <div className="card-header bg-gradient-success text-white">
                <h5 className="mb-0"><i className="fas fa-edit me-2"></i>Edit Patient</h5>
              </div>
              <div className="card-body">
                <form onSubmit={handleUpdate}>
                  <div className="mb-2">
                    <label className="form-label">First Name</label>
                    <input type="text" className="form-control" value={editForm.fname} onChange={(e) => setEditForm({ ...editForm, fname: e.target.value })} required />
                  </div>
                  <div className="mb-2">
                    <label className="form-label">Last Name</label>
                    <input type="text" className="form-control" value={editForm.lname} onChange={(e) => setEditForm({ ...editForm, lname: e.target.value })} required />
                  </div>
                  <div className="mb-2">
                    <label className="form-label">Gender</label>
                    <select className="form-select" value={editForm.gender} onChange={(e) => setEditForm({ ...editForm, gender: e.target.value })}>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                  <div className="mb-2">
                    <label className="form-label">Email</label>
                    <input type="email" className="form-control" value={editForm.email} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Contact</label>
                    <input type="text" className="form-control" value={editForm.contact} onChange={(e) => setEditForm({ ...editForm, contact: e.target.value })} maxLength="10" required />
                  </div>
                  <div className="d-flex gap-2">
                    <button type="submit" className="btn btn-success flex-grow-1"><i className="fas fa-save me-1"></i>Save Changes</button>
                    <button type="button" className="btn btn-secondary" onClick={() => setIsEditing(false)}><i className="fas fa-times"></i></button>
                  </div>
                </form>
              </div>
            </div>
            <div className="stat-card bg-gradient-info mt-3">
              <i className="fas fa-users stat-icon"></i>
              <div className="stat-number">{patients.length}</div>
              <div className="stat-label">Total Patients</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

