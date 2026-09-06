const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense');
const authMiddleware = require('../middleware/authMiddleware');

// Protect all expense/income routes with authentication
router.use(authMiddleware);

// @route   GET /api/expenses
// @desc    Get all transactions (expenses and income) for the logged-in user
router.get('/', async (req, res) => {
  try {
    const filter = { user: req.user._id };
    if (req.query.type) {
      filter.type = req.query.type;
    }

    const expenses = await Expense.find(filter).sort({ date: -1, createdAt: -1 });
    res.json(expenses);
  } catch (error) {
    console.error('Error fetching expenses:', error);
    res.status(500).json({ message: 'Server error while fetching expenses' });
  }
});

// @route   POST /api/expenses
// @desc    Add a new transaction (expense or income) for the logged-in user
router.post('/', async (req, res) => {
  try {
    const { title, amount, category, date, type } = req.body;

    if (!title || title.trim() === '') {
      return res.status(400).json({ message: 'Title is required' });
    }

    if (amount === undefined || amount === null || Number(amount) <= 0) {
      return res.status(400).json({ message: 'Amount must be greater than 0' });
    }

    const newExpense = new Expense({
      user: req.user._id,
      type: type === 'income' ? 'income' : 'expense',
      title: title.trim(),
      amount: Number(amount),
      category: category || 'Other',
      date: date ? new Date(date) : new Date()
    });

    const savedExpense = await newExpense.save();
    res.status(201).json(savedExpense);
  } catch (error) {
    console.error('Error creating transaction:', error);
    res.status(400).json({ message: error.message || 'Invalid transaction data' });
  }
});

// @route   PUT /api/expenses/:id
// @desc    Update an existing transaction owned by the logged-in user
router.put('/:id', async (req, res) => {
  try {
    const { title, amount, category, date, type } = req.body;

    if (title !== undefined && (!title || title.trim() === '')) {
      return res.status(400).json({ message: 'Title cannot be empty' });
    }

    if (amount !== undefined && (amount === null || Number(amount) <= 0 || isNaN(Number(amount)))) {
      return res.status(400).json({ message: 'Amount must be greater than 0' });
    }

    const expense = await Expense.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!expense) {
      return res.status(404).json({ message: 'Transaction not found or unauthorized' });
    }

    if (title !== undefined) expense.title = title.trim();
    if (amount !== undefined) expense.amount = Number(amount);
    if (category !== undefined) expense.category = category || 'Other';
    if (date !== undefined) expense.date = date ? new Date(date) : expense.date;
    if (type !== undefined) expense.type = type === 'income' ? 'income' : 'expense';

    const updatedExpense = await expense.save();
    res.json(updatedExpense);
  } catch (error) {
    console.error('Error updating transaction:', error);
    res.status(400).json({ message: error.message || 'Server error while updating transaction' });
  }
});

// @route   DELETE /api/expenses/:id
// @desc    Delete a transaction owned by the logged-in user
router.delete('/:id', async (req, res) => {
  try {
    const expense = await Expense.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });

    if (!expense) {
      return res.status(404).json({ message: 'Transaction not found or unauthorized' });
    }

    res.json({ message: 'Transaction removed successfully', id: req.params.id });
  } catch (error) {
    console.error('Error deleting transaction:', error);
    res.status(500).json({ message: 'Server error while deleting transaction' });
  }
});

module.exports = router;
