import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const API_BASE_URL = 'http://localhost:5000/api/auth';

export default function Auth({ onAuthSuccess, initialMode = 'login', onModeChange }) {
  const authContext = useAuth();
  const [isLogin, setIsLogin] = useState(initialMode === 'login');
  const [prevMode, setPrevMode] = useState(initialMode);

  if (prevMode !== initialMode) {
    setPrevMode(initialMode);
    setIsLogin(initialMode === 'login');
  }

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Auto-dismiss success notification popup after 5 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  // Auto-dismiss error alert after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!email.trim() || !password) {
      setError('Please fill in all required fields.');
      return;
    }

    if (!isLogin && !name.trim()) {
      setError('Please provide your full name.');
      return;
    }

    if (password.length < 6) {
      setError('Password must contain at least 6 characters.');
      return;
    }

    setLoading(true);
    const endpoint = isLogin ? `${API_BASE_URL}/login` : `${API_BASE_URL}/register`;
    const payload = isLogin
      ? { email: email.trim(), password }
      : { name: name.trim(), email: email.trim(), password };

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Authentication failed');
      }

      if (isLogin) {
        // User logged in: proceed to dashboard
        if (onAuthSuccess) {
          onAuthSuccess(data);
        } else if (authContext?.login) {
          authContext.login(data);
        }
      } else {
        // User registered: switch to Login page, show success notification, and clear all inputs
        if (onModeChange) {
          onModeChange('login');
        } else {
          setIsLogin(true);
        }
        setSuccessMessage('Account created successfully! Please sign in with your email and password.');
        setEmail('');
        setPassword('');
        setName('');
      }
    } catch (err) {
      setError(err.message || 'Something went wrong. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    const nextMode = isLogin ? 'register' : 'login';
    if (onModeChange) {
      onModeChange(nextMode);
    } else {
      setIsLogin((prev) => !prev);
    }
    setError('');
    setSuccessMessage('');
    setName('');
    setEmail('');
    setPassword('');
  };

  return (
    <div className="modern-auth-container">
      <div className="modern-auth-shell">
        {/* Left Showcase Side */}
        <div className="auth-hero-pane">
          <div className="hero-glow hero-glow-1"></div>
          <div className="hero-glow hero-glow-2"></div>

          <div className="hero-content">
            <div className="hero-brand">
              <span className="brand-logo-icon">📊</span>
              <div>
                <span className="hero-brand-name">Expense Tracker</span>
                <span className="hero-brand-tag">Daily Expense Manager</span>
              </div>
            </div>

            <div className="hero-text-block">
              <h1 className="hero-title">
                {isLogin ? 'Smart & Simple Expense Tracking.' : 'Take Control of Your Daily Expenses.'}
              </h1>
              <p className="hero-desc">
                Keep track of every penny, organize categories effortlessly, and stay on top of your daily spending.
              </p>
            </div>

            {/* Features Only Card */}
            <div className="glass-preview-card features-only-card">
              <div className="preview-card-header">
                <div className="preview-card-dot"></div>
                <span className="preview-card-title">Key Features</span>
                <span className="preview-badge-status">Included</span>
              </div>

              <div className="features-icon-grid">
                <div className="feature-icon-row">
                  <div className="feature-icon-circle">⚡</div>
                  <div className="feature-text-group">
                    <h4 className="feature-heading">Quick Expense Logging</h4>
                    <p className="feature-sub">Add title, amount, category & date instantly</p>
                  </div>
                </div>

                <div className="feature-icon-row">
                  <div className="feature-icon-circle">🏷️</div>
                  <div className="feature-text-group">
                    <h4 className="feature-heading">Smart Categories</h4>
                    <p className="feature-sub">Organize by Food, Transport, Bills & more</p>
                  </div>
                </div>

                <div className="feature-icon-row">
                  <div className="feature-icon-circle">📈</div>
                  <div className="feature-text-group">
                    <h4 className="feature-heading">Real-Time Summary</h4>
                    <p className="feature-sub">Live total spending & largest expense metrics</p>
                  </div>
                </div>

                <div className="feature-icon-row">
                  <div className="feature-icon-circle">🔍</div>
                  <div className="feature-text-group">
                    <h4 className="feature-heading">Category Filter</h4>
                    <p className="feature-sub">Filter and review transactions with 1 click</p>
                  </div>
                </div>

                <div className="feature-icon-row">
                  <div className="feature-icon-circle">🔒</div>
                  <div className="feature-text-group">
                    <h4 className="feature-heading">Secure & Private</h4>
                    <p className="feature-sub">Encrypted account with personal data protection</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Form Side */}
        <div className="auth-form-pane">
          <div className="form-pane-inner">
            <div className="form-header-box">
              <h2 className="form-heading">
                {isLogin ? 'Sign in to your account' : 'Create your account'}
              </h2>
              <p className="form-subheading">
                {isLogin
                  ? 'Enter your details below to access your expenses'
                  : 'Start tracking your spending habits today'}
              </p>
            </div>

            {/* Modern Segmented Tab Switcher */}
            <div className="pill-tabs-container">
              <button
                type="button"
                className={`pill-tab ${isLogin ? 'active' : ''}`}
                onClick={() => {
                  if (onModeChange) {
                    onModeChange('login');
                  } else {
                    setIsLogin(true);
                  }
                  setError('');
                  setSuccessMessage('');
                }}
              >
                Sign In
              </button>
              <button
                type="button"
                className={`pill-tab ${!isLogin ? 'active' : ''}`}
                onClick={() => {
                  if (onModeChange) {
                    onModeChange('register');
                  } else {
                    setIsLogin(false);
                  }
                  setError('');
                  setSuccessMessage('');
                }}
              >
                Register
              </button>
            </div>

            {/* Success message banner upon registration */}
            {successMessage && (
              <div className="modern-success-badge">
                <span className="success-icon">✅</span>
                <span>{successMessage}</span>
              </div>
            )}

            {/* Error message banner */}
            {error && (
              <div className="modern-error-badge">
                <span className="error-icon">⚠️</span>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="modern-form">
              {!isLogin && (
                <div className="floating-input-group">
                  <label htmlFor="input-name">Full Name</label>
                  <div className="input-with-icon">
                    <span className="input-icon">👤</span>
                    <input
                      id="input-name"
                      type="text"
                      placeholder="e.g. Sarah Connor"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      disabled={loading}
                      required
                    />
                  </div>
                </div>
              )}

              <div className="floating-input-group">
                <label htmlFor="input-email">Email Address</label>
                <div className="input-with-icon">
                  <span className="input-icon">✉️</span>
                  <input
                    id="input-email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    required
                  />
                </div>
              </div>

              <div className="floating-input-group">
                <label htmlFor="input-password">Password</label>
                <div className="input-with-icon">
                  <span className="input-icon">🔒</span>
                  <input
                    id="input-password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Min. 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    required
                  />
                  <button
                    type="button"
                    className="btn-toggle-pwd"
                    onClick={() => setShowPassword((prev) => !prev)}
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="btn-modern-primary"
                disabled={loading}
              >
                {loading ? (
                  <span className="btn-loading-flex">
                    <span className="mini-spinner"></span>
                    {isLogin ? 'Signing In...' : 'Registering...'}
                  </span>
                ) : (
                  <span>{isLogin ? 'Sign In →' : 'Create Account →'}</span>
                )}
              </button>
            </form>

            <div className="form-footer-box">
              <span className="footer-text">
                {isLogin ? "Don't have an account?" : 'Already registered?'}
              </span>
              <button type="button" className="footer-switch-btn" onClick={toggleMode}>
                {isLogin ? 'Create one now' : 'Sign in instead'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
