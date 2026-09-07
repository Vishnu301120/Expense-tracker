import React from 'react';
import { useNavigate } from 'react-router-dom';
import Auth from '../components/Auth';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSuccess = (userData) => {
    login(userData);
    navigate('/');
  };

  const handleModeChange = (mode) => {
    if (mode === 'login') {
      navigate('/login');
    }
  };

  return (
    <Auth
      initialMode="register"
      onAuthSuccess={handleSuccess}
      onModeChange={handleModeChange}
    />
  );
}
