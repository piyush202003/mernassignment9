import React from 'react';
import LoginForm from '../components/auth/LoginForm';
import { Link } from 'react-router-dom';

const LoginPage = () => {
  return (
    <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
      <div className="card shadow p-4 border-0" style={{ width: '100%', maxWidth: '400px' }}>
        <div className="text-center mb-4">
          <h2 className="fw-bold text-primary">Login</h2>
          <p className="text-muted">Access your account securely</p>
        </div>

        <LoginForm />

        <div className="text-center mt-3">
          <Link to="/forgot-password" className="text-decoration-none text-secondary">
            <i className="bi bi-question-circle me-1"></i> Forgot your password?
          </Link>
        </div>

        <hr className="my-4" />
        <div className="text-center">
          <p className="text-muted mb-0">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary fw-semibold text-decoration-none">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
