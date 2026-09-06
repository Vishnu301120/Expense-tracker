import React, { useState } from 'react';

const EXPENSE_CATEGORIES = [
  'Food',
  'Transport',
  'Utilities',
  'Entertainment',
  'Shopping',
  'Health',
  'Other'
];

const INCOME_CATEGORIES = [
  'Salary',
  'Freelance',
  'Business',
  'Investments',
  'Gift',
  'Other'
];

export default function ExpenseForm({ onAddExpense }) {
  const today = new Date().toISOString().split('T')[0];

  const [type, setType] = useState('expense'); // 'expense' or 'income'
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(EXPENSE_CATEGORIES[0]);
  const [date, setDate] = useState(today);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const currentCategories = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  const handleTypeChange = (newType) => {
    setType(newType);
    setCategory(newType === 'income' ? INCOME_CATEGORIES[0] : EXPENSE_CATEGORIES[0]);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError(`Please enter an ${type} title.`);
      return;
    }

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setError('Please enter a valid amount greater than 0.');
      return;
    }

    if (!date) {
      setError('Please choose a date.');
      return;
    }

    setIsSubmitting(true);
    try {
      await onAddExpense({
        type,
        title: title.trim(),
        amount: numAmount,
        category,
        date
      });

      // Reset form
      setTitle('');
      setAmount('');
      setCategory(type === 'income' ? INCOME_CATEGORIES[0] : EXPENSE_CATEGORIES[0]);
      setDate(today);
    } catch (err) {
      setError(err.message || `Failed to add ${type}. Please try again.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="card form-card">
      <h2 className="card-title">Add Transaction</h2>

      {/* Type Selector (Expense vs Income) */}
      <div className="type-toggle-container">
        <button
          type="button"
          className={`type-toggle-btn expense-btn ${type === 'expense' ? 'active' : ''}`}
          onClick={() => handleTypeChange('expense')}
        >
          💸 Expense
        </button>
        <button
          type="button"
          className={`type-toggle-btn income-btn ${type === 'income' ? 'active' : ''}`}
          onClick={() => handleTypeChange('income')}
        >
          💰 Income
        </button>
      </div>

      {error && <div className="alert-badge error">{error}</div>}

      <form onSubmit={handleSubmit} className="expense-form">
        <div className="form-group">
          <label htmlFor="expense-title">
            {type === 'income' ? 'Income Source / Title' : 'Expense Title'}
          </label>
          <input
            id="expense-title"
            type="text"
            placeholder={
              type === 'income'
                ? 'e.g. Monthly Salary, Freelance project'
                : 'e.g. Grocery shopping, Metro pass'
            }
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={isSubmitting}
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="expense-amount">Amount ($)</label>
            <input
              id="expense-amount"
              type="number"
              step="0.01"
              min="0.01"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              disabled={isSubmitting}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="expense-category">Category</label>
            <select
              id="expense-category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              disabled={isSubmitting}
            >
              {currentCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="expense-date">Date</label>
          <input
            id="expense-date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            disabled={isSubmitting}
            required
          />
        </div>

        <button
          type="submit"
          className={`btn btn-primary ${type === 'income' ? 'btn-income' : ''}`}
          disabled={isSubmitting}
        >
          {isSubmitting
            ? 'Saving...'
            : type === 'income'
            ? '+ Add Income'
            : '+ Add Expense'}
        </button>
      </form>
    </div>
  );
}
