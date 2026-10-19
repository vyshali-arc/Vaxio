import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Syringe,
  LayoutDashboard,
  CalendarCheck,
  FileText,
  User,
  LogOut,
  Menu,
  X,
  ShieldCheck,
} from 'lucide-react';

export const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const closeMobile = () => setMobileMenuOpen(false);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Brand Logo */}
        <Link to={isAuthenticated ? '/dashboard' : '/'} className="brand-logo" onClick={closeMobile}>
          <div className="brand-icon-wrapper">
            <Syringe size={22} />
          </div>
          <span>Vaxio</span>
        </Link>

        {/* Mobile toggle button */}
        <button
          className="mobile-nav-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Desktop Navigation Links */}
        <div className="nav-links">
          {isAuthenticated ? (
            <>
              <NavLink
                to="/dashboard"
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              >
                <LayoutDashboard size={18} />
                <span>Dashboard</span>
              </NavLink>

              <NavLink
                to="/vaccines"
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              >
                <CalendarCheck size={18} />
                <span>My Vaccines</span>
              </NavLink>

              <NavLink
                to="/records"
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              >
                <FileText size={18} />
                <span>My Records</span>
              </NavLink>

              <NavLink
                to="/profile"
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              >
                <User size={18} />
                <span>My Profile</span>
              </NavLink>

              <div className="user-badge">
                <ShieldCheck size={16} color="#7c3aed" />
                <span>{user?.name?.split(' ')[0] || 'User'}</span>
              </div>

              <button onClick={handleLogout} className="btn-logout" title="Log out">
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline btn-sm">
                Log In
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Get Started Free
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div
          style={{
            maxWidth: '1200px',
            margin: '0.75rem auto 0',
            paddingTop: '0.75rem',
            borderTop: '1px solid var(--border-color)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
          }}
        >
          {isAuthenticated ? (
            <>
              <NavLink
                to="/dashboard"
                className="nav-link"
                onClick={closeMobile}
              >
                <LayoutDashboard size={18} />
                <span>Dashboard</span>
              </NavLink>
              <NavLink
                to="/vaccines"
                className="nav-link"
                onClick={closeMobile}
              >
                <CalendarCheck size={18} />
                <span>My Vaccines</span>
              </NavLink>
              <NavLink
                to="/records"
                className="nav-link"
                onClick={closeMobile}
              >
                <FileText size={18} />
                <span>My Records</span>
              </NavLink>
              <NavLink
                to="/profile"
                className="nav-link"
                onClick={closeMobile}
              >
                <User size={18} />
                <span>My Profile</span>
              </NavLink>
              <button
                onClick={handleLogout}
                className="btn-logout"
                style={{ justifyContent: 'flex-start' }}
              >
                <LogOut size={16} />
                <span>Logout ({user?.name})</span>
              </button>
            </>
          ) : (
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <Link
                to="/login"
                className="btn btn-outline btn-sm"
                style={{ flex: 1 }}
                onClick={closeMobile}
              >
                Log In
              </Link>
              <Link
                to="/register"
                className="btn btn-primary btn-sm"
                style={{ flex: 1 }}
                onClick={closeMobile}
              >
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};
