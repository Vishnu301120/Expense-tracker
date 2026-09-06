import React, { useState, useEffect, useCallback } from 'react';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import ExpenseSummary from './components/ExpenseSummary';
import Auth from './components/Auth';

const API_BASE_URL = 'http://localhost:5000/api/expenses';

export default function App() {
  const [user, setUser] = useState(() => {
    // Clear any persistent localStorage auth so closing the window requires sign in
    try {
      localStorage.removeItem('expense_user');
    } catch {
      // Ignore storage errors
    }
    const saved = sessionStorage.getItem('expense_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const [feedbackMessage, setFeedbackMessage] = useState(null);

  // Auto clear feedback message after 3.5 seconds
  useEffect(() => {
    if (feedbackMessage) {
      const timer = setTimeout(() => setFeedbackMessage(null), 3500);
      return () => clearTimeout(timer);
    }
  }, [feedbackMessage]);

  // Logout handler
  const handleLogout = useCallback(() => {
    sessionStorage.removeItem('expense_user');
    try {
      localStorage.removeItem('expense_user');
    } catch {
      // Ignore storage errors
    }
    setUser(null);
    setExpenses([]);
    setFeedbackMessage(null);
  }, []);

  // Fetch expenses for logged-in user
  const fetchExpenses = useCallback(async () => {
    if (!user || !user.token) return;

    try {
      setLoading(true);
      setError('');
      const res = await fetch(API_BASE_URL, {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      });

      if (res.status === 401) {
        handleLogout();
        return;
      }

      if (!res.ok) {
        throw new Error('Failed to connect to backend server');
      }

      const data = await res.json();
      setExpenses(data);
    } catch (err) {
      console.error(err);
      setError('Unable to load expenses. Ensure the backend server is running on port 5000.');
    } finally {
      setLoading(false);
    }
  }, [user, handleLogout]);

  useEffect(() => {
    if (user) {
      fetchExpenses();
    }
  }, [user, fetchExpenses]);

  // Auth success handler
  const handleAuthSuccess = (userData) => {
    sessionStorage.setItem('expense_user', JSON.stringify(userData));
    try {
      localStorage.removeItem('expense_user');
    } catch {
      // Ignore storage errors
    }
    setUser(userData);
    setFeedbackMessage({
      type: 'success',
      text: `Welcome, ${userData.name}!`
    });
  };

  // Add expense handler
  const handleAddExpense = async (expenseData) => {
    const res = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.token}`
      },
      body: JSON.stringify(expenseData)
    });

    if (res.status === 401) {
      handleLogout();
      return;
    }

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.message || 'Failed to save expense');
    }

    const savedExpense = await res.json();
    setExpenses((prev) => [savedExpense, ...prev]);
    setFeedbackMessage({ type: 'success', text: `Added "${savedExpense.title}" successfully!` });
  };

  // Delete expense handler
  const handleDeleteExpense = async (id) => {
    try {
      setDeletingId(id);
      const res = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      });

      if (res.status === 401) {
        handleLogout();
        return;
      }

      if (!res.ok) {
        throw new Error('Failed to delete expense');
      }

      setExpenses((prev) => prev.filter((exp) => exp._id !== id));
      setFeedbackMessage({ type: 'info', text: 'Transaction removed.' });
    } catch (err) {
      alert(err.message || 'Error deleting transaction');
    } finally {
      setDeletingId(null);
    }
  };

  // Update expense handler
  const handleUpdateExpense = async (id, updatedData) => {
    const res = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.token}`
      },
      body: JSON.stringify(updatedData)
    });

    if (res.status === 401) {
      handleLogout();
      return;
    }

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.message || 'Failed to update transaction');
    }

    const updatedExpense = await res.json();
    setExpenses((prev) =>
      prev.map((exp) => (exp._id === id ? updatedExpense : exp))
    );
    setFeedbackMessage({
      type: 'success',
      text: `Updated "${updatedExpense.title}" successfully!`
    });
    return updatedExpense;
  };

  // If user is not logged in, render the Login / Register screen
  if (!user) {
    return <Auth onAuthSuccess={handleAuthSuccess} />;
  }

  return (
    <div className="app-container">
      {/* Header with User Info & Logout */}
      <header className="app-header">
        <div className="header-top-bar">
          <div className="header-brand">
            <div className="brand-badge">Daily Tracker</div>
            <h1>Expense Tracker</h1>
          </div>

          <div className="user-profile-bar">
            <span className="user-greeting">
              👤 Hi, <strong>{user.name}</strong>
            </span>
            <button className="btn btn-logout" onClick={handleLogout} title="Log out">
              Log Out
            </button>
          </div>
        </div>
        <p className="header-subtitle">
          Keep track of your daily spendings with ease
        </p>
      </header>

      {/* Global Feedback Banner */}
      {feedbackMessage && (
        <div className={`feedback-banner ${feedbackMessage.type}`}>
          {feedbackMessage.text}
        </div>
      )}

      {/* Connection Error Banner */}
      {error && (
        <div className="error-banner">
          <span>⚠️ {error}</span>
          <button className="btn-retry" onClick={fetchExpenses}>
            Retry
          </button>
        </div>
      )}

      {/* Summary Metrics */}
      <ExpenseSummary expenses={expenses} />

      {/* Main Grid: Form (Left) & List (Right) */}
      <main className="main-content-grid">
        <section className="column-form">
          <ExpenseForm onAddExpense={handleAddExpense} />
        </section>

        <section className="column-list">
          {loading ? (
            <div className="loading-state card">
              <div className="spinner"></div>
              <p>Loading your expenses...</p>
            </div>
          ) : (
            <ExpenseList
              expenses={expenses}
              onDeleteExpense={handleDeleteExpense}
              onUpdateExpense={handleUpdateExpense}
              deletingId={deletingId}
            />
          )}
        </section>
      </main>

      {/* Simple Footer */}
      <footer className="app-footer">
        <p>© 2026 Personal Expense Tracker • Simple & Secure</p>
      </footer>
    </div>
  );
}
