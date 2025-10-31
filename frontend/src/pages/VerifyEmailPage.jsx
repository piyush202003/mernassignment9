import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';

const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState('Verifying your email...');
  const [error, setError] = useState(false);

  useEffect(() => {
    const token = searchParams.get('token');

    if (!token) {
      setMessage('Invalid verification link.');
      setError(true);
      return;
    }

    const verify = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/auth/verify-email?token=${token}`
        );
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Verification failed');
        }

        setMessage(data.message);
        setError(false);
      } catch (err) {
        setMessage(err.message);
        setError(true);
      }
    };

    verify();
  }, [searchParams]);

  return (
    <div style={{ textAlign: 'center', marginTop: '2rem' }}>
      <h1>Email Verification</h1>
      <p style={{ color: error ? 'red' : 'green' }}>{message}</p>
      {!error && (
        <Link to="/login">Click here to Login</Link>
      )}
    </div>
  );
};

export default VerifyEmailPage;