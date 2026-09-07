import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="app-header main-navbar">
      <div className="navbar-container">
        {/* Brand */}
        <div className="navbar-brand">
          <NavLink to="/" className="brand-link">
            <div className="brand-badge">Daily Tracker</div>
            <h1 className="brand-title">Expense Tracker</h1>
          </NavLink>
        </div>

        {/* Navigation Links */}
        <nav className="navbar-nav">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `nav-link ${isActive ? 'active' : ''}`
            }
          >
            <span className="nav-icon">📊</span>
            <span>Dashboard</span>
          </NavLink>

          <NavLink
            to="/expenses"
            className={({ isActive }) =>
              `nav-link ${isActive ? 'active' : ''}`
            }
          >
            <span className="nav-icon">📋</span>
            <span>Expenses</span>
          </NavLink>

          <NavLink
            to="/analytics"
            className={({ isActive }) =>
              `nav-link ${isActive ? 'active' : ''}`
            }
          >
            <span className="nav-icon">📈</span>
            <span>Analytics</span>
          </NavLink>
        </nav>

        {/* User Info & Actions */}
        <div className="navbar-actions">
          {user && (
            <div className="user-profile-bar">
              <span className="user-greeting">
                👤 Hi, <strong>{user.name}</strong>
              </span>
              <button
                className="btn btn-logout"
                onClick={handleLogoutClick}
                title="Log out"
              >
                Log Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
