import mongoose from 'mongoose';

import dotenv from 'dotenv';

dotenv.config();

const expenseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 100
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  category: {
    type: String,
    required: true,
    enum: [
      'Food & Dining',
      'Transportation',
      'Shopping',
      'Entertainment',
      'Bills & Utilities',
      'Healthcare',
      'Travel',
      'Education',
      'Personal Care',
      'Other'
    ]
  },
  date: {
    type: Date,
    required: true
  },
  description: {
    type: String,
    trim: true,
    maxlength: 500,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const ExpenseModel = mongoose.model('Expense', expenseSchema);

// Get all expenses
export const getExpenses = async (req, res) => {
  try {
    const expenses = await ExpenseModel.find({});
    res.status(200).json({ success: true, data: expenses });
  } catch (error) {
    console.log("error in fetching expenses:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Create a new expense
export const createExpense = async (req, res) => {
  const expense = req.body;

  if (!expense.title || !expense.amount || !expense.category || !expense.date) {
    return res.status(400).json({ success: false, message: "Please provide all required fields" });
  }

  const newExpense = new ExpenseModel({
    title: expense.title,
    amount: parseFloat(expense.amount),
    category: expense.category,
    date: new Date(expense.date),
    description: expense.description || ''
  });

  try {
    await newExpense.save();
    res.status(201).json({ success: true, data: newExpense });
  } catch (error) {
    console.error("Error in Create expense:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Update an existing expense
export const updateExpense = async (req, res) => {
  const { id } = req.params;
  const expense = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ success: false, message: "Invalid Expense Id" });
  }

  try {
    const updatedExpense = await ExpenseModel.findByIdAndUpdate(
      id,
      {
        title: expense.title,
        amount: parseFloat(expense.amount),
        category: expense.category,
        date: new Date(expense.date),
        description: expense.description || ''
      },
      { new: true }
    );

    if (!updatedExpense) {
      return res.status(404).json({ success: false, message: "Expense not found" });
    }

    res.status(200).json({ success: true, data: updatedExpense });
  } catch (error) {
    console.error("Error in Update expense:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Delete an expense
export const deleteExpense = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ success: false, message: "Invalid Expense Id" });
  }

  try {
    const expense = await ExpenseModel.findByIdAndDelete(id);
    if (!expense) {
      return res.status(404).json({ success: false, message: "Expense not found" });
    }
    res.status(200).json({ success: true, message: "Expense deleted" });
  } catch (error) {
    console.log("error in deleting expense:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

