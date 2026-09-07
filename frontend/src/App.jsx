import React from 'react';
import { AuthProvider } from './context/AuthContext';
import { ExpenseProvider } from './context/ExpenseContext';
import AppRouter from './routes/AppRouter';

export default function App() {
  return (
    <AuthProvider>
      <ExpenseProvider>
        <AppRouter />
      </ExpenseProvider>
    </AuthProvider>
  );
}
