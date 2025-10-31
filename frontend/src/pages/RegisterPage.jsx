import React from 'react';
import RegisterForm from '../components/auth/RegisterForm';
import { Link } from 'react-router-dom';

const RegisterPage = () => {
  return (
    <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
      <div className="card shadow p-4 border-0" style={{ width: '100%', maxWidth: '450px' }}>
        <div className="text-center mb-4">
          <h2 className="fw-bold text-success">Create an Account</h2>
          <p className="text-muted">Register as a visitor to access the system</p>
        </div>

        <RegisterForm />

        <hr className="my-4" />

        <div className="text-center">
          <p className="text-muted mb-0">
            Already have an account?{' '}
            <Link to="/login" className="text-success fw-semibold text-decoration-none">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
