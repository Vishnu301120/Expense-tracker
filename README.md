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
│   ├── middleware/
│   │   └── authMiddleware.js # JWT verification middleware
│   ├── models/
│   │   ├── Expense.js        # Mongoose Expense Schema
│   │   └── User.js           # Mongoose User Schema
│   ├── routes/
│   │   ├── authRoutes.js     # Auth API endpoints (/api/auth)
│   │   └── expenseRoutes.js  # Expense REST API endpoints (/api/expenses)
│   ├── .env                  # Server PORT and MongoDB URI
│   ├── package.json
│   └── server.js             # Express server entry point
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── layout/
    │   │   │   ├── Navbar.jsx        # Navigation bar with active link indicators
    │   │   │   └── AppLayout.jsx     # Shared layout shell with Navbar, notifications & footer
    │   │   ├── Auth.jsx              # Split-screen Auth UI
    │   │   ├── ExpenseForm.jsx       # Transaction entry form
    │   │   ├── ExpenseList.jsx       # Search, filter, edit, delete & PDF export
    │   │   └── ExpenseSummary.jsx    # Metrics cards
    │   ├── context/
    │   │   ├── AuthContext.jsx       # User authentication state & session
    │   │   └── ExpenseContext.jsx    # Global expense data & operations
    │   ├── pages/
    │   │   ├── LoginPage.jsx         # /login page
    │   │   ├── RegisterPage.jsx      # /register page
    │   │   ├── DashboardPage.jsx     # / or /dashboard overview
    │   │   ├── ExpensesPage.jsx      # /expenses full transaction history
    │   │   ├── AddExpensePage.jsx    # /add-expense transaction creation
    │   │   ├── AnalyticsPage.jsx     # /analytics financial breakdowns & insights
    │   │   └── NotFoundPage.jsx      # 404 catch-all page
    │   ├── routes/
    │   │   └── AppRouter.jsx         # Central router for all pages with route guards
    │   ├── App.jsx                   # Context providers & router root
    │   ├── index.css                 # Modern responsive styling & design tokens
    │   └── main.jsx
    ├── index.html
    └── package.json
```

---

## 🧭 Page Routes

| Route | Page Component | Access | Description |
| :--- | :--- | :--- | :--- |
| `/login` | `LoginPage` | Public (guest only) | User login screen |
| `/register` | `RegisterPage` | Public (guest only) | New user registration |
| `/` or `/dashboard` | `DashboardPage` | Protected | Main overview, quick stats, quick add & recent transactions |
| `/expenses` | `ExpensesPage` | Protected | Full transaction management, search, category filters & PDF export |
| `/add-expense` | `AddExpensePage` | Protected | Dedicated expense / income entry form |
| `/analytics` | `AnalyticsPage` | Protected | Category distribution bars, savings rate & cash flow analytics |
| `*` | `NotFoundPage` | Public | Friendly 404 page with return to dashboard link |


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
