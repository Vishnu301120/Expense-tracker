import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useExpenses } from '../context/ExpenseContext';

const CATEGORY_ICONS = {
  Food: '🍔',
  Transport: '🚗',
  Utilities: '💡',
  Entertainment: '🎬',
  Shopping: '🛍️',
  Health: '💊',
  Salary: '💼',
  Freelance: '💻',
  Business: '🏢',
  Investments: '📈',
  Gift: '🎁',
  Other: '🏷️'
};

export default function AnalyticsPage() {
  const { expenses } = useExpenses();

  const stats = useMemo(() => {
    let totalIncome = 0;
    let totalExpense = 0;
    const categoryTotals = {};
    let highestExpense = null;

    expenses.forEach((item) => {
      const amt = Number(item.amount) || 0;
      if (item.type === 'income') {
        totalIncome += amt;
      } else {
        totalExpense += amt;
        categoryTotals[item.category] = (categoryTotals[item.category] || 0) + amt;

        if (!highestExpense || amt > Number(highestExpense.amount)) {
          highestExpense = item;
        }
      }
    });

    const netSavings = totalIncome - totalExpense;
    const savingsRate =
      totalIncome > 0 ? Math.max(0, Math.round((netSavings / totalIncome) * 100)) : 0;

    const sortedCategories = Object.entries(categoryTotals)
      .map(([cat, sum]) => ({
        category: cat,
        amount: sum,
        percentage: totalExpense > 0 ? Math.round((sum / totalExpense) * 100) : 0
      }))
      .sort((a, b) => b.amount - a.amount);

    return {
      totalIncome,
      totalExpense,
      netSavings,
      savingsRate,
      sortedCategories,
      highestExpense,
      totalCount: expenses.length
    };
  }, [expenses]);

  return (
    <div className="analytics-page-container">
      {/* Header */}
      <div className="page-header-strip">
        <div>
          <h2 className="page-title">Spending Analytics & Insights</h2>
          <p className="page-subtitle">Visual breakdown of your expenditure categories and cash flow</p>
        </div>
        <div className="header-quick-links">
          <Link to="/expenses" className="btn btn-secondary">
            📋 View Transactions
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="analytics-kpi-grid">
        <div className="analytics-kpi-card">
          <div className="kpi-icon">💰</div>
          <div className="kpi-details">
            <span className="kpi-label">Savings Rate</span>
            <h3 className="kpi-value">{stats.savingsRate}%</h3>
            <span className="kpi-hint">
              {stats.netSavings >= 0 ? 'Positive net accumulation' : 'Deficit spending detected'}
            </span>
          </div>
        </div>

        <div className="analytics-kpi-card">
          <div className="kpi-icon">🔥</div>
          <div className="kpi-details">
            <span className="kpi-label">Top Category</span>
            <h3 className="kpi-value">
              {stats.sortedCategories.length > 0 ? stats.sortedCategories[0].category : 'None'}
            </h3>
            <span className="kpi-hint">
              {stats.sortedCategories.length > 0
                ? `$${stats.sortedCategories[0].amount.toLocaleString('en-US', { minimumFractionDigits: 2 })} (${stats.sortedCategories[0].percentage}%)`
                : 'No expense recorded'}
            </span>
          </div>
        </div>

        <div className="analytics-kpi-card">
          <div className="kpi-icon">🎯</div>
          <div className="kpi-details">
            <span className="kpi-label">Largest Expense</span>
            <h3 className="kpi-value">
              {stats.highestExpense ? `$${Number(stats.highestExpense.amount).toLocaleString()}` : '$0'}
            </h3>
            <span className="kpi-hint">
              {stats.highestExpense ? stats.highestExpense.title : 'None'}
            </span>
          </div>
        </div>

        <div className="analytics-kpi-card">
          <div className="kpi-icon">📊</div>
          <div className="kpi-details">
            <span className="kpi-label">Cash Flow Ratio</span>
            <h3 className="kpi-value">
              {stats.totalExpense > 0
                ? (stats.totalIncome / stats.totalExpense).toFixed(2) + 'x'
                : 'N/A'}
            </h3>
            <span className="kpi-hint">Income divided by expenses</span>
          </div>
        </div>
      </div>

      {/* Category Breakdown Progress Meters */}
      <div className="analytics-breakdown-card card">
        <div className="card-header-flex">
          <div>
            <h3 className="card-title">Expense Distribution by Category</h3>
            <p className="card-subtitle">Detailed percentage share of each spending category</p>
          </div>
          <span className="badge badge-accent">
            Total Spent: ${stats.totalExpense.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </span>
        </div>

        {stats.sortedCategories.length === 0 ? (
          <div className="empty-analytics-placeholder">
            <p>No expense data recorded yet. Add some expenses to view insights!</p>
            <Link to="/" className="btn btn-secondary btn-sm">
              Log First Expense
            </Link>
          </div>
        ) : (
          <div className="category-bars-list">
            {stats.sortedCategories.map((item) => (
              <div key={item.category} className="category-bar-item">
                <div className="category-bar-label">
                  <div className="category-bar-title">
                    <span className="cat-icon">{CATEGORY_ICONS[item.category] || '🏷️'}</span>
                    <strong className="cat-name">{item.category}</strong>
                  </div>
                  <div className="category-bar-stats">
                    <span className="cat-amount">
                      ${item.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>
                    <span className="cat-percent">({item.percentage}%)</span>
                  </div>
                </div>

                <div className="progress-track">
                  <div
                    className="progress-fill"
                    style={{ width: `${Math.min(100, Math.max(4, item.percentage))}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
