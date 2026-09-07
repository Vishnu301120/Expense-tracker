import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Layout
import AppLayout from '../components/layout/AppLayout';

// Pages
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import DashboardPage from '../pages/DashboardPage';
import ExpensesPage from '../pages/ExpensesPage';
import AddExpensePage from '../pages/AddExpensePage';
import AnalyticsPage from '../pages/AnalyticsPage';
import NotFoundPage from '../pages/NotFoundPage';

/**
 * Route guard for pages requiring authentication.
 * Redirects unauthenticated users to /login.
 */
function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

/**
 * Route guard for guest-only pages (Login, Register).
 * Redirects already logged-in users to the main dashboard.
 */
function PublicOnlyRoute({ children }) {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
}

/**
 * Central Router Configuration for All Pages
 */
export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Authentication Pages */}
        <Route
          path="/login"
          element={
            <PublicOnlyRoute>
              <LoginPage />
            </PublicOnlyRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicOnlyRoute>
              <RegisterPage />
            </PublicOnlyRoute>
          }
        />

        {/* Protected Application Pages with Shared Layout (Navbar, Banners, Footer) */}
        <Route
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="dashboard" element={<Navigate to="/" replace />} />
          <Route path="expenses" element={<ExpensesPage />} />
          <Route path="add-expense" element={<AddExpensePage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
        </Route>

        {/* 404 Catch-All Page */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
