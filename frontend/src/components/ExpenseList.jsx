import React, { useState } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const ICONS = {
  // Expense Categories
  Food: '🍔',
  Transport: '🚗',
  Utilities: '💡',
  Entertainment: '🎬',
  Shopping: '🛍️',
  Health: '💊',
  // Income Categories
  Salary: '💼',
  Freelance: '💻',
  Business: '🏢',
  Investments: '📈',
  Gift: '🎁',
  Other: '🏷️'
};

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

export default function ExpenseList({ expenses, onDeleteExpense, onUpdateExpense, deletingId }) {
  const currentMonthStr = new Date().toISOString().slice(0, 7); // 'YYYY-MM'
  const [selectedMonth, setSelectedMonth] = useState(currentMonthStr);
  const [filterType, setFilterType] = useState('all'); // 'all', 'expense', 'income'
  const [editingItem, setEditingItem] = useState(null);
  const [editSubmitting, setEditSubmitting] = useState(false);
  const [editError, setEditError] = useState('');

  const handleStartEdit = (expense) => {
    const dateStr = expense.date
      ? new Date(expense.date).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0];

    setEditingItem({
      _id: expense._id,
      type: expense.type === 'income' ? 'income' : 'expense',
      title: expense.title || '',
      amount: expense.amount !== undefined ? String(expense.amount) : '',
      category: expense.category || (expense.type === 'income' ? 'Salary' : 'Food'),
      date: dateStr
    });
    setEditError('');
  };

  const handleCloseEdit = () => {
    setEditingItem(null);
    setEditError('');
    setEditSubmitting(false);
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editingItem) return;

    if (!editingItem.title.trim()) {
      setEditError('Title is required.');
      return;
    }

    const numAmount = parseFloat(editingItem.amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setEditError('Please enter a valid amount greater than 0.');
      return;
    }

    if (!editingItem.date) {
      setEditError('Date is required.');
      return;
    }

    try {
      setEditSubmitting(true);
      setEditError('');
      await onUpdateExpense(editingItem._id, {
        type: editingItem.type,
        title: editingItem.title.trim(),
        amount: numAmount,
        category: editingItem.category,
        date: editingItem.date
      });
      handleCloseEdit();
    } catch (err) {
      setEditError(err.message || 'Failed to update transaction.');
    } finally {
      setEditSubmitting(false);
    }
  };

  const handleDeleteClick = (expense) => {
    const confirmed = window.confirm(`Are you sure you want to delete "${expense.title}"?`);
    if (confirmed) {
      onDeleteExpense(expense._id);
    }
  };

  const filteredExpenses = expenses.filter((exp) => {
    if (filterType === 'all') return true;
    if (filterType === 'expense') return exp.type !== 'income';
    if (filterType === 'income') return exp.type === 'income';
    return true;
  });

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatMonthName = (yearMonth) => {
    if (!yearMonth) return '';
    const [year, month] = yearMonth.split('-');
    const date = new Date(Number(year), Number(month) - 1, 1);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  // Count transactions for selected month
  const monthlyTransactions = expenses.filter((exp) => {
    if (!exp.date) return false;
    const expMonth = new Date(exp.date).toISOString().slice(0, 7);
    return expMonth === selectedMonth;
  });

  // Handler to generate and download professional PDF
  const handleDownloadPDF = () => {
    if (monthlyTransactions.length === 0) {
      alert(`No transactions found for ${formatMonthName(selectedMonth)} to generate a PDF.`);
      return;
    }

    // Sort by date ascending for statement
    const sorted = [...monthlyTransactions].sort((a, b) => new Date(a.date) - new Date(b.date));

    const totalIncome = sorted
      .filter((e) => e.type === 'income')
      .reduce((sum, item) => sum + Number(item.amount), 0);

    const totalExpense = sorted
      .filter((e) => e.type !== 'income')
      .reduce((sum, item) => sum + Number(item.amount), 0);

    const netSavings = totalIncome - totalExpense;
    const monthTitle = formatMonthName(selectedMonth);

    // Create jsPDF document (Portrait, A4)
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'pt',
      format: 'a4'
    });

    // 1. Header Banner
    doc.setFillColor(15, 23, 42); // Navy slate
    doc.rect(0, 0, 595.28, 75, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.setTextColor(255, 255, 255);
    doc.text('MONTHLY FINANCIAL STATEMENT', 40, 42);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(203, 213, 225);
    doc.text(`Expense Tracker Report | Month: ${monthTitle}`, 40, 60);

    // Document Details
    const nowStr = new Date().toLocaleString('en-US');
    doc.setFontSize(9);
    doc.text(`Generated: ${nowStr}`, 410, 60);

    // 2. Financial Summary Overview Cards
    let startY = 95;

    // Income Card
    doc.setFillColor(240, 253, 244);
    doc.setDrawColor(187, 247, 208);
    doc.roundedRect(40, startY, 155, 52, 6, 6, 'FD');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(22, 101, 52);
    doc.text('TOTAL INCOME', 50, startY + 18);
    doc.setFontSize(14);
    doc.text(`+$${totalIncome.toFixed(2)}`, 50, startY + 38);

    // Expense Card
    doc.setFillColor(254, 242, 242);
    doc.setDrawColor(254, 202, 202);
    doc.roundedRect(215, startY, 155, 52, 6, 6, 'FD');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(153, 27, 27);
    doc.text('TOTAL EXPENSES', 225, startY + 18);
    doc.setFontSize(14);
    doc.text(`-$${totalExpense.toFixed(2)}`, 225, startY + 38);

    // Net Balance Card
    doc.setFillColor(238, 242, 255);
    doc.setDrawColor(199, 210, 254);
    doc.roundedRect(390, startY, 165, 52, 6, 6, 'FD');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(67, 56, 202);
    doc.text('NET BALANCE', 400, startY + 18);
    doc.setFontSize(14);
    const balanceSign = netSavings >= 0 ? '+$' : '-$';
    doc.text(`${balanceSign}${Math.abs(netSavings).toFixed(2)}`, 400, startY + 38);

    // 3. Transactions Table
    const tableRows = sorted.map((item, index) => {
      const isIncome = item.type === 'income';
      const formattedDate = new Date(item.date).toISOString().split('T')[0];
      const sign = isIncome ? '+' : '-';
      return [
        index + 1,
        formattedDate,
        isIncome ? 'Income' : 'Expense',
        item.title,
        item.category,
        `${sign}$${Number(item.amount).toFixed(2)}`
      ];
    });

    autoTable(doc, {
      startY: startY + 70,
      head: [['#', 'Date', 'Type', 'Description', 'Category', 'Amount']],
      body: tableRows,
      theme: 'striped',
      headStyles: {
        fillColor: [30, 41, 59],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 9
      },
      styles: {
        fontSize: 9,
        cellPadding: 6,
        font: 'helvetica'
      },
      columnStyles: {
        0: { cellWidth: 28, halign: 'center' },
        1: { cellWidth: 65 },
        2: { cellWidth: 55, fontStyle: 'bold' },
        3: { cellWidth: 190 },
        4: { cellWidth: 85 },
        5: { cellWidth: 80, halign: 'right', fontStyle: 'bold' }
      },
      didParseCell: (data) => {
        if (data.section === 'body') {
          // Color code Type and Amount
          const rowData = data.row.raw;
          const isIncome = rowData[2] === 'Income';
          if (data.column.index === 2 || data.column.index === 5) {
            data.cell.styles.textColor = isIncome ? [22, 163, 74] : [225, 29, 72];
          }
        }
      }
    });

    // 4. Category Summary on bottom or next page
    let finalY = doc.lastAutoTable.finalY + 25;

    // Check if space is left on current page or add new page
    if (finalY > 700) {
      doc.addPage();
      finalY = 45;
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(15, 23, 42);
    doc.text('Category Breakdown Summary', 40, finalY);

    // Group totals by category
    const categoryTotals = {};
    sorted.forEach((item) => {
      const key = `${item.category} (${item.type === 'income' ? 'Income' : 'Expense'})`;
      categoryTotals[key] = (categoryTotals[key] || 0) + Number(item.amount);
    });

    const categoryRows = Object.entries(categoryTotals).map(([cat, total]) => [
      cat,
      `$${total.toFixed(2)}`
    ]);

    autoTable(doc, {
      startY: finalY + 10,
      head: [['Category Breakdown', 'Total Amount']],
      body: categoryRows,
      theme: 'plain',
      headStyles: {
        fillColor: [241, 245, 249],
        textColor: [51, 65, 85],
        fontStyle: 'bold',
        fontSize: 9
      },
      styles: {
        fontSize: 8.5,
        cellPadding: 5
      },
      columnStyles: {
        0: { cellWidth: 280 },
        1: { cellWidth: 100, halign: 'right', fontStyle: 'bold' }
      }
    });

    // 5. Save and trigger download
    doc.save(`Monthly_Expense_Report_${selectedMonth}.pdf`);
  };

  return (
    <div className="card list-card">
      {/* Monthly Report PDF Download Bar */}
      <div className="download-action-bar">
        <div className="download-controls-left">
          <span className="download-bar-icon">📄</span>
          <div>
            <h3 className="download-bar-title">Monthly PDF Statement</h3>
            <p className="download-bar-desc">Download detailed financial statement in PDF format</p>
          </div>
        </div>

        <div className="download-controls-right">
          <div className="month-picker-wrapper">
            <label htmlFor="select-report-month" className="picker-label">Month:</label>
            <input
              id="select-report-month"
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="month-input"
            />
          </div>

          <button
            type="button"
            className="btn btn-download btn-download-pdf"
            onClick={handleDownloadPDF}
            title={`Download PDF statement for ${formatMonthName(selectedMonth)}`}
          >
            <span>Download PDF</span>
          </button>
        </div>
      </div>

      {/* List Header & Type Filter */}
      <div className="list-header">
        <div>
          <h2 className="card-title">Transaction History</h2>
          <span className="list-count">
            {filteredExpenses.length} {filteredExpenses.length === 1 ? 'record' : 'records'}
          </span>
        </div>

        {/* Filter Type Pills */}
        <div className="filter-type-pills">
          <button
            type="button"
            className={`filter-pill ${filterType === 'all' ? 'active' : ''}`}
            onClick={() => setFilterType('all')}
          >
            All
          </button>
          <button
            type="button"
            className={`filter-pill ${filterType === 'expense' ? 'active' : ''}`}
            onClick={() => setFilterType('expense')}
          >
            Expenses
          </button>
          <button
            type="button"
            className={`filter-pill ${filterType === 'income' ? 'active' : ''}`}
            onClick={() => setFilterType('income')}
          >
            Income
          </button>
        </div>
      </div>

      {filteredExpenses.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📭</div>
          <p className="empty-title">No transactions found</p>
          <p className="empty-subtitle">
            {filterType === 'all'
              ? 'Add your first transaction using the form to start tracking!'
              : `No ${filterType} records recorded yet.`}
          </p>
        </div>
      ) : (
        <div className="expense-items">
          {filteredExpenses.map((expense) => {
            const isDeleting = deletingId === expense._id;
            const isIncome = expense.type === 'income';

            return (
              <div key={expense._id} className={`expense-item ${isIncome ? 'income-item' : ''}`}>
                <div
                  className={`expense-category-badge ${isIncome ? 'income-badge' : ''}`}
                  title={expense.category}
                >
                  <span className="category-emoji">
                    {ICONS[expense.category] || (isIncome ? '💰' : '🏷️')}
                  </span>
                </div>

                <div className="expense-details">
                  <div className="expense-title-row">
                    <h4 className="expense-item-title">{expense.title}</h4>
                    <span className={`badge-type-pill ${isIncome ? 'pill-income' : 'pill-expense'}`}>
                      {isIncome ? 'Income' : 'Expense'}
                    </span>
                  </div>
                  <div className="expense-meta">
                    <span className="expense-category-name">{expense.category}</span>
                    <span className="meta-separator">•</span>
                    <span className="expense-date">{formatDate(expense.date)}</span>
                  </div>
                </div>

                <div className="expense-action-group">
                  <span className={`expense-amount ${isIncome ? 'income-amount' : ''}`}>
                    {isIncome ? '+' : '-'}${Number(expense.amount).toFixed(2)}
                  </span>
                  <div className="action-buttons-wrap">
                    <button
                      type="button"
                      className="btn btn-action-icon btn-edit"
                      onClick={() => handleStartEdit(expense)}
                      disabled={isDeleting}
                      title={`Edit ${expense.title}`}
                      aria-label={`Edit ${expense.title}`}
                    >
                      ✏️
                    </button>
                    <button
                      type="button"
                      className="btn btn-action-icon btn-delete"
                      onClick={() => handleDeleteClick(expense)}
                      disabled={isDeleting}
                      title={`Delete ${expense.title}`}
                      aria-label={`Delete ${expense.title}`}
                    >
                      {isDeleting ? '...' : '🗑️'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Edit Transaction Modal Dialog */}
      {editingItem && (
        <div className="modal-backdrop" onClick={handleCloseEdit}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">✏️ Edit Transaction</h3>
              <button
                type="button"
                className="modal-close-btn"
                onClick={handleCloseEdit}
                title="Close"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEdit}>
              <div className="modal-body">
                {/* Type Toggle */}
                <div className="type-toggle-container" style={{ marginBottom: '1.25rem' }}>
                  <button
                    type="button"
                    className={`type-toggle-btn expense-btn ${editingItem.type === 'expense' ? 'active' : ''}`}
                    onClick={() =>
                      setEditingItem((prev) => ({
                        ...prev,
                        type: 'expense',
                        category: EXPENSE_CATEGORIES[0]
                      }))
                    }
                  >
                    💸 Expense
                  </button>
                  <button
                    type="button"
                    className={`type-toggle-btn income-btn ${editingItem.type === 'income' ? 'active' : ''}`}
                    onClick={() =>
                      setEditingItem((prev) => ({
                        ...prev,
                        type: 'income',
                        category: INCOME_CATEGORIES[0]
                      }))
                    }
                  >
                    💰 Income
                  </button>
                </div>

                {editError && (
                  <div className="modal-error-badge" style={{ marginBottom: '1rem' }}>
                    <span>⚠️ {editError}</span>
                  </div>
                )}

                <div className="form-group">
                  <label htmlFor="edit-title">
                    {editingItem.type === 'income' ? 'Income Source / Title' : 'Expense Title'}
                  </label>
                  <input
                    id="edit-title"
                    type="text"
                    value={editingItem.title}
                    onChange={(e) =>
                      setEditingItem((prev) => ({ ...prev, title: e.target.value }))
                    }
                    required
                    disabled={editSubmitting}
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="edit-amount">Amount ($)</label>
                    <input
                      id="edit-amount"
                      type="number"
                      step="0.01"
                      min="0.01"
                      value={editingItem.amount}
                      onChange={(e) =>
                        setEditingItem((prev) => ({ ...prev, amount: e.target.value }))
                      }
                      required
                      disabled={editSubmitting}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="edit-category">Category</label>
                    <select
                      id="edit-category"
                      value={editingItem.category}
                      onChange={(e) =>
                        setEditingItem((prev) => ({ ...prev, category: e.target.value }))
                      }
                      disabled={editSubmitting}
                    >
                      {(editingItem.type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES).map(
                        (cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        )
                      )}
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="edit-date">Date</label>
                  <input
                    id="edit-date"
                    type="date"
                    value={editingItem.date}
                    onChange={(e) =>
                      setEditingItem((prev) => ({ ...prev, date: e.target.value }))
                    }
                    required
                    disabled={editSubmitting}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-cancel"
                  onClick={handleCloseEdit}
                  disabled={editSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={editSubmitting}
                >
                  {editSubmitting ? 'Saving...' : '💾 Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
