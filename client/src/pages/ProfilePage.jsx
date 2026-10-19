import React, { useState, useEffect } from 'react';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import {
  User,
  Mail,
  Phone,
  Droplet,
  Calendar,
  Lock,
  CheckCircle2,
  AlertCircle,
  Save,
  KeyRound,
  Shield,
} from 'lucide-react';

export const ProfilePage = () => {
  const { user, updateUser } = useAuth();

  // Profile fields state
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    bloodGroup: '',
  });

  // Password fields state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });

  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  const [profileSuccess, setProfileSuccess] = useState('');
  const [profileError, setProfileError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        dateOfBirth: user.dateOfBirth
          ? new Date(user.dateOfBirth).toISOString().split('T')[0]
          : '',
        bloodGroup: user.bloodGroup || '',
      });
    }
  }, [user]);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setProfileSuccess('');
    setProfileError('');

    if (!profileData.name.trim()) {
      setProfileError('Full name cannot be empty.');
      return;
    }

    try {
      setProfileLoading(true);
      const res = await api.updateProfile(profileData);
      if (res.success) {
        setProfileSuccess('Profile updated successfully.');
        updateUser(res.user);
      }
    } catch (err) {
      setProfileError(err.message || 'Failed to update profile.');
    } finally {
      setProfileLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordSuccess('');
    setPasswordError('');

    if (!passwordData.currentPassword || !passwordData.newPassword) {
      setPasswordError('Please provide both current and new passwords.');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters.');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }

    try {
      setPasswordLoading(true);
      const res = await api.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      if (res.success) {
        setPasswordSuccess('Password successfully updated.');
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmNewPassword: '',
        });
      }
    } catch (err) {
      setPasswordError(err.message || 'Failed to change password.');
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.5px' }}>
          Personal Profile & Security
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Manage your personal patient details, medical attributes, and account credentials.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '2rem' }}>
        {/* Profile Information Card */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)' }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: 'var(--lavender-mid)', color: 'var(--primary-700)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <User size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>Profile Details</h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Update your health recipient identity</p>
            </div>
          </div>

          {profileSuccess && (
            <div className="alert alert-success">
              <CheckCircle2 size={18} />
              <span>{profileSuccess}</span>
            </div>
          )}

          {profileError && (
            <div className="alert alert-danger">
              <AlertCircle size={18} />
              <span>{profileError}</span>
            </div>
          )}

          <form onSubmit={handleUpdateProfile}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                name="name"
                className="form-input"
                value={profileData.name}
                onChange={handleProfileChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address (Read-only)</label>
              <input
                type="email"
                className="form-input"
                value={profileData.email}
                disabled
                style={{ background: '#f8fafc', color: '#64748b', cursor: 'not-allowed' }}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input
                type="tel"
                name="phone"
                className="form-input"
                placeholder="+1 (555) 000-0000"
                value={profileData.phone}
                onChange={handleProfileChange}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Date of Birth</label>
                <input
                  type="date"
                  name="dateOfBirth"
                  className="form-input"
                  value={profileData.dateOfBirth}
                  onChange={handleProfileChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Blood Group</label>
                <select
                  name="bloodGroup"
                  className="form-select"
                  value={profileData.bloodGroup}
                  onChange={handleProfileChange}
                >
                  <option value="">Select Group</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '0.5rem' }}
              disabled={profileLoading}
            >
              <Save size={16} />
              <span>{profileLoading ? 'Saving changes...' : 'Save Profile Details'}</span>
            </button>
          </form>
        </div>

        {/* Change Password Card */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)' }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: '#ede9fe', color: 'var(--primary-700)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <KeyRound size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>Account Security</h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Update your secret authentication password</p>
            </div>
          </div>

          {passwordSuccess && (
            <div className="alert alert-success">
              <CheckCircle2 size={18} />
              <span>{passwordSuccess}</span>
            </div>
          )}

          {passwordError && (
            <div className="alert alert-danger">
              <AlertCircle size={18} />
              <span>{passwordError}</span>
            </div>
          )}

          <form onSubmit={handleChangePassword}>
            <div className="form-group">
              <label className="form-label">Current Password</label>
              <input
                type="password"
                name="currentPassword"
                className="form-input"
                placeholder="••••••••"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">New Password (Min 6 chars)</label>
              <input
                type="password"
                name="newPassword"
                className="form-input"
                placeholder="••••••••"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Confirm New Password</label>
              <input
                type="password"
                name="confirmNewPassword"
                className="form-input"
                placeholder="••••••••"
                value={passwordData.confirmNewPassword}
                onChange={handlePasswordChange}
                required
              />
            </div>

            <div style={{ background: 'var(--lavender-light)', padding: '0.75rem 1rem', borderRadius: 12, marginBottom: '1.25rem', fontSize: '0.8rem', color: 'var(--primary-800)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Shield size={16} style={{ flexShrink: 0 }} />
              <span>Passwords are encrypted using one-way bcrypt hashing.</span>
            </div>

            <button
              type="submit"
              className="btn btn-secondary"
              style={{ width: '100%' }}
              disabled={passwordLoading}
            >
              <Lock size={16} />
              <span>{passwordLoading ? 'Updating password...' : 'Update Password'}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
