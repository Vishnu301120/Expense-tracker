import React from 'react';
import { Link } from 'react-router-dom';
import ExpenseList from '../components/ExpenseList';
import { useExpenses } from '../context/ExpenseContext';

export default function ExpensesPage() {
  const { expenses, loading, deletingId, deleteExpense, updateExpense } = useExpenses();

  return (
    <div className="expenses-page-container">
      <div className="page-header-strip">
        <div>
          <h2 className="page-title">Transaction History</h2>
          <p className="page-subtitle">
            Manage, filter, search, edit, and export all recorded transactions ({expenses.length} total)
          </p>
        </div>
        <div className="header-quick-links">
          <Link to="/analytics" className="btn btn-secondary">
            📈 View Analytics
          </Link>
        </div>
      </div>

      <div className="full-width-section">
        {loading ? (
          <div className="loading-state card">
            <div className="spinner"></div>
            <p>Loading transactions...</p>
          </div>
        ) : (
          <ExpenseList
            expenses={expenses}
            onDeleteExpense={deleteExpense}
            onUpdateExpense={updateExpense}
            deletingId={deletingId}
          />
        )}
      </div>
    </div>
  );
}
