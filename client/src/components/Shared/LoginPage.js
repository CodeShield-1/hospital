import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('patient');
  const [formData, setFormData] = useState({ email: '', password: '', username: '', password2: '', fname: '', lname: '', gender: 'Male', contact: '', cpassword: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => { setFormData(prev => ({ ...prev, [e.target.name]: e.target.value })); };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (activeTab === 'patient') { await login('patient/login', { email: formData.email, password: formData.password }); toast.success('Welcome back!'); }
      else if (activeTab === 'doctor') { await login('doctor/login', { username: formData.username, password: formData.password2 }); toast.success('Welcome Doctor!'); }
      else if (activeTab === 'admin') { await login('admin/login', { username: formData.username, password: formData.password2 }); toast.success('Welcome Admin!'); }
      navigate('/dashboard');
    } catch (err) { toast.error(err.response?.data?.error || 'Login failed'); }
    finally { setLoading(false); }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login('patient/register', { fname: formData.fname, lname: formData.lname, gender: formData.gender, email: formData.email, contact: formData.contact, password: formData.password, cpassword: formData.cpassword });
      toast.success('Account created successfully!');
      navigate('/dashboard');
    } catch (err) { toast.error(err.response?.data?.error || 'Registration failed'); }
    finally { setLoading(false); }
  };

  return (
    <div className="login-page">
      <div className="login-card animate-scale-in">
        <div className="login-header">
          <div className="logo-icon"><i className="fas fa-hospital"></i></div>
          <h3 className="fw-bold mb-1">Global Hospital</h3>
          <p className="mb-0" style={{ opacity: 0.85, fontSize: '0.9rem' }}>Management System</p>
        </div>
        <div className="login-body">
          <ul className="nav nav-pills nav-justified mb-4">
            {['patient', 'doctor', 'admin'].map(tab => (
              <li className="nav-item" key={tab}>
                <button className={'nav-link' + (activeTab === tab ? ' active' : '')} onClick={() => setActiveTab(tab)}>
                  <i className={'fas fa-' + (tab === 'patient' ? 'user' : tab === 'doctor' ? 'user-md' : 'user-tie') + ' me-2'}></i>
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              </li>
            ))}
          </ul>
          <div className="animate-fade-in-up">
            {activeTab === 'patient' && (
              <div>
                <form onSubmit={handleRegister} className="mb-4 p-3 reg-form-box">
                  <h5 className="mb-3" style={{ color: 'var(--primary-700)', fontWeight: 600 }}><i className="fas fa-user-plus me-2"></i>New Patient Registration</h5>
                  <div className="row">
                    <div className="col-md-6 mb-2">
                      <input type="text" className="form-control" name="fname" placeholder="First Name *" onChange={handleChange} required />
                    </div>
                    <div className="col-md-6 mb-2">
                      <input type="text" className="form-control" name="lname" placeholder="Last Name *" onChange={handleChange} required />
                    </div>
                    <div className="col-md-6 mb-2">
                      <input type="email" className="form-control" name="email" placeholder="Email *" onChange={handleChange} required />
                    </div>
                    <div className="col-md-6 mb-2">
                      <input type="tel" className="form-control" name="contact" placeholder="Phone *" maxLength="10" onChange={handleChange} required />
                    </div>
                    <div className="col-md-6 mb-2">
                      <input type="password" className="form-control" name="password" placeholder="Password *" minLength="6" onChange={handleChange} required />
                    </div>
                    <div className="col-md-6 mb-2">
                      <input type="password" className="form-control" name="cpassword" placeholder="Confirm Password *" minLength="6" onChange={handleChange} required />
                    </div>
                    <div className="col-12 mb-3">
                      <select className="form-select" name="gender" onChange={handleChange} defaultValue="Male">
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </select>
                    </div>
                    <div className="col-12">
                      <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                        {loading ? <><span className="spinner-border spinner-border-sm me-2" role="status"></span>Registering...</>
                          : <><i className="fas fa-user-check me-2"></i>Create Account</>}
                      </button>
                    </div>
                  </div>
                </form>
                <form onSubmit={handleLogin}>
                  <h5 className="mb-3" style={{ color: 'var(--primary-700)', fontWeight: 600 }}><i className="fas fa-sign-in-alt me-2"></i>Returning Patient</h5>
                  <div className="mb-2">
                    <label className="form-label">Email Address</label>
                    <input type="email" className="form-control" name="email" placeholder="your@email.com" onChange={handleChange} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Password</label>
                    <input type="password" className="form-control" name="password" placeholder="Enter your password" onChange={handleChange} required />
                  </div>
                  <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                    {loading ? <><span className="spinner-border spinner-border-sm me-2" role="status"></span>Logging in...</>
                      : <><i className="fas fa-sign-in-alt me-2"></i>Login</>}
                  </button>
                </form>
              </div>
            )}
            {(activeTab === 'doctor' || activeTab === 'admin') && (
              <form onSubmit={handleLogin}>
                <div className="text-center mb-4">
                  <i className={'fas fa-' + (activeTab === 'doctor' ? 'user-md' : 'user-tie') + ' fa-3x'} style={{ color: 'var(--primary-400)' }}></i>
                  <h5 className="mt-2" style={{ color: 'var(--primary-700)', fontWeight: 600 }}>
                    {activeTab === 'doctor' ? 'Doctor Login' : 'Admin Login'}
                  </h5>
                </div>
                <div className="mb-2">
                  <label className="form-label">Username</label>
                  <input type="text" className="form-control" name="username" placeholder="Enter username" onChange={handleChange} required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Password</label>
                  <input type="password" className="form-control" name="password2" placeholder="Enter password" onChange={handleChange} required />
                </div>
                <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                  {loading ? <><span className="spinner-border spinner-border-sm me-2" role="status"></span>Logging in...</>
                    : <><i className="fas fa-sign-in-alt me-2"></i>Login</>}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

