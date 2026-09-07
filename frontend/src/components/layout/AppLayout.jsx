import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import { useExpenses } from '../../context/ExpenseContext';

export default function AppLayout() {
  const { feedbackMessage, error, fetchExpenses } = useExpenses();

  return (
    <div className="app-container">
      {/* Top Navigation */}
      <Navbar />

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

      {/* Routed Page Content */}
      <main className="routed-page-wrapper">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <p>© 2026 Personal Expense Tracker • Simple & Secure</p>
      </footer>
    </div>
  );
}
