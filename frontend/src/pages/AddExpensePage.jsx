import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import ExpenseForm from '../components/ExpenseForm';
import { useExpenses } from '../context/ExpenseContext';

export default function AddExpensePage() {
  const { addExpense } = useExpenses();
  const navigate = useNavigate();

  const handleAdd = async (expenseData) => {
    await addExpense(expenseData);
    navigate('/expenses');
  };

  return (
    <div className="add-expense-page-container">
      <div className="page-header-strip">
        <div>
          <h2 className="page-title">Record Transaction</h2>
          <p className="page-subtitle">Add a new expense or income to your tracker</p>
        </div>
        <div className="header-quick-links">
          <Link to="/expenses" className="btn btn-secondary">
            ← Back to Transactions
          </Link>
        </div>
      </div>

      <div className="add-form-wrapper">
        <ExpenseForm onAddExpense={handleAdd} />
      </div>
    </div>
  );
}
