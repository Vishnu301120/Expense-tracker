/* oxlint-disable react/only-export-components, react/set-state-in-effect */
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';

const ExpenseContext = createContext(null);
const API_BASE_URL = 'http://localhost:5000/api/expenses';

export function ExpenseProvider({ children }) {
  const { user, logout } = useAuth();
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

  // Fetch expenses for the active user
  const fetchExpenses = useCallback(async () => {
    if (!user || !user.token) {
      setExpenses([]);
      return;
    }

    try {
      setLoading(true);
      setError('');
      const res = await fetch(API_BASE_URL, {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      });

      if (res.status === 401) {
        logout();
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
  }, [user, logout]);

  useEffect(() => {
    if (user && user.token) {
      fetchExpenses();
    } else {
      setExpenses([]);
    }
  }, [user, fetchExpenses]);

  // Add expense handler
  const addExpense = useCallback(
    async (expenseData) => {
      if (!user || !user.token) return;

      const res = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify(expenseData)
      });

      if (res.status === 401) {
        logout();
        return;
      }

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || 'Failed to save transaction');
      }

      const savedExpense = await res.json();
      setExpenses((prev) => [savedExpense, ...prev]);
      setFeedbackMessage({
        type: 'success',
        text: `Added "${savedExpense.title}" successfully!`
      });
      return savedExpense;
    },
    [user, logout]
  );

  // Delete expense handler
  const deleteExpense = useCallback(
    async (id) => {
      if (!user || !user.token) return;

      try {
        setDeletingId(id);
        const res = await fetch(`${API_BASE_URL}/${id}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        });

        if (res.status === 401) {
          logout();
          return;
        }

        if (!res.ok) {
          throw new Error('Failed to delete transaction');
        }

        setExpenses((prev) => prev.filter((exp) => exp._id !== id));
        setFeedbackMessage({ type: 'info', text: 'Transaction removed.' });
      } catch (err) {
        alert(err.message || 'Error deleting transaction');
      } finally {
        setDeletingId(null);
      }
    },
    [user, logout]
  );

  // Update expense handler
  const updateExpense = useCallback(
    async (id, updatedData) => {
      if (!user || !user.token) return;

      const res = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify(updatedData)
      });

      if (res.status === 401) {
        logout();
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
    },
    [user, logout]
  );

  const value = {
    expenses,
    loading,
    error,
    deletingId,
    feedbackMessage,
    setFeedbackMessage,
    fetchExpenses,
    addExpense,
    deleteExpense,
    updateExpense
  };

  return <ExpenseContext.Provider value={value}>{children}</ExpenseContext.Provider>;
}

export function useExpenses() {
  const context = useContext(ExpenseContext);
  if (!context) {
    throw new Error('useExpenses must be used within an ExpenseProvider');
  }
  return context;
}
