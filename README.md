# Simple MERN Stack Expense Tracker

A clean, modern, and easy-to-use Expense Tracker built with the **MERN** stack (MongoDB, Express, React, Node.js).

---

## 🚀 Features

- **Add Expenses**: Quickly log an expense with title, amount, category, and date.
- **Summary Cards**: Real-time totals for Total Spent, Transactions count, Largest Expense, and Top Category.
- **Filter by Category**: Instantly filter expenses (Food, Transport, Utilities, Entertainment, Shopping, Health, Other).
- **Delete Expense**: Remove any recorded expense with a single click.
- **Persistent Storage**: Saves directly to your local MongoDB database.
- **Simple & Clean**: No complex authentication or bloated features — straight to the point.

---

## 🛠️ Project Structure

```
Expense tracker/
├── backend/
│   ├── models/
│   │   └── Expense.js       # Mongoose Schema
│   ├── routes/
│   │   └── expenseRoutes.js # REST API endpoints (GET, POST, DELETE)
│   ├── .env                 # Server PORT and MongoDB URI
│   ├── package.json
│   └── server.js            # Express server entry point
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── ExpenseForm.jsx    # Add expense form
    │   │   ├── ExpenseList.jsx    # List with category filter & delete
    │   │   └── ExpenseSummary.jsx # Total spending & metrics
    │   ├── App.jsx                # Main React App & state
    │   ├── index.css              # Modern UI styling
    │   └── main.jsx
    ├── index.html
    └── package.json
```

---

## 🏃 How to Run the Project

### 1. Prerequisites
- **Node.js** installed
- **MongoDB** running locally (or MongoDB Atlas connection string in `backend/.env`)

### 2. Start Backend Server
Open a terminal in the project root:
```bash
cd backend
npm install   # If not already installed
npm run dev   # Or npm start
```
> The backend server will run on: `http://localhost:5000`

### 3. Start Frontend Client
Open another terminal:
```bash
cd frontend
npm install   # If not already installed
npm run dev
```
> The frontend will run on: `http://localhost:5173`

---

## 📡 API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/expenses` | Retrieve all expenses (newest first) |
| `POST` | `/api/expenses` | Create a new expense |
| `DELETE` | `/api/expenses/:id` | Delete an expense by ID |
| `GET` | `/api/health` | Server health check |
