import React from 'react';
import { Link } from 'react-router-dom';
import ExpenseSummary from '../components/ExpenseSummary';
import ExpenseForm from '../components/ExpenseForm';
import ExpenseList from '../components/ExpenseList';
import { useExpenses } from '../context/ExpenseContext';

export default function DashboardPage() {
  const {
    expenses,
    loading,
    deletingId,
    addExpense,
    deleteExpense,
    updateExpense
  } = useExpenses();

  return (
    <div className="dashboard-page-container">
      {/* Subtitle / Intro */}
      <div className="page-header-strip">
        <div>
          <h2 className="page-title">Financial Dashboard</h2>
          <p className="page-subtitle">Overview of your income, expenses, and latest activity</p>
        </div>
        <div className="header-quick-links">
          <Link to="/expenses" className="btn btn-secondary btn-sm">
            📋 All Transactions ({expenses.length})
          </Link>
          <Link to="/analytics" className="btn btn-secondary btn-sm">
            📈 Analytics
          </Link>
        </div>
      </div>

      {/* Summary Metrics */}
      <ExpenseSummary expenses={expenses} />

      {/* Main Grid: Form (Left) & Recent / Full List (Right) */}
      <div className="main-content-grid">
        <section className="column-form">
          <ExpenseForm onAddExpense={addExpense} />
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
              onDeleteExpense={deleteExpense}
              onUpdateExpense={updateExpense}
              deletingId={deletingId}
            />
          )}
        </section>
      </div>
    </div>
  );
}
