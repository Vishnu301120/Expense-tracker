import React from 'react';

export default function ExpenseSummary({ expenses }) {
  // Separate income and expenses
  const totalIncome = expenses
    .filter((e) => e.type === 'income')
    .reduce((sum, item) => sum + Number(item.amount), 0);

  const totalExpense = expenses
    .filter((e) => e.type !== 'income')
    .reduce((sum, item) => sum + Number(item.amount), 0);

  const netBalance = totalIncome - totalExpense;
  const totalTransactions = expenses.length;

  return (
    <div className="summary-grid">
      <div className="summary-card balance">
        <div className="summary-icon">⚖️</div>
        <div className="summary-info">
          <span className="summary-label">Net Balance</span>
          <h3 className={`summary-value ${netBalance >= 0 ? 'positive' : 'negative'}`}>
            {netBalance < 0 ? '-' : ''}${Math.abs(netBalance).toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            })}
          </h3>
        </div>
      </div>

      <div className="summary-card income">
        <div className="summary-icon">💰</div>
        <div className="summary-info">
          <span className="summary-label">Total Income</span>
          <h3 className="summary-value income-value">
            +${totalIncome.toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            })}
          </h3>
        </div>
      </div>

      <div className="summary-card total">
        <div className="summary-icon">💸</div>
        <div className="summary-info">
          <span className="summary-label">Total Expenses</span>
          <h3 className="summary-value expense-value">
            -${totalExpense.toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            })}
          </h3>
        </div>
      </div>

      <div className="summary-card transactions">
        <div className="summary-icon">📝</div>
        <div className="summary-info">
          <span className="summary-label">Transactions</span>
          <h3 className="summary-value">{totalTransactions}</h3>
        </div>
      </div>
    </div>
  );
}
