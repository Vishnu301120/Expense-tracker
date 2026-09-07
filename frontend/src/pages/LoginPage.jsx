import React from 'react';
import { useNavigate } from 'react-router-dom';
import Auth from '../components/Auth';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSuccess = (userData) => {
    login(userData);
    navigate('/');
  };

  const handleModeChange = (mode) => {
    if (mode === 'register') {
      navigate('/register');
    }
  };

  return (
    <Auth
      initialMode="login"
      onAuthSuccess={handleSuccess}
      onModeChange={handleModeChange}
    />
  );
}
