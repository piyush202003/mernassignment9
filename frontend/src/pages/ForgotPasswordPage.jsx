import React, { useState } from 'react';
import { authService } from '../services/authService';
import { Link } from 'react-router-dom';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const data = await authService.forgotPassword(email);
      setMessage(data.message); 
    } catch (err) {
      setMessage('If this email is registered, a password reset OTP has been sent.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: 'auto', padding: '2rem' }}>
      <h2>Forgot Password</h2>
      {!message ? (
        <>
          <p>Enter your email address to receive a password reset OTP.</p>
          <form onSubmit={handleSubmit}>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <div style={{ marginBottom: '1rem' }}>
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
              />
            </div>
            <button 
              type="submit" 
              disabled={loading} 
              style={{ width: '100%', padding: '10px', cursor: 'pointer' }}
            >
              {loading ? 'Sending...' : 'Send Reset OTP'}
            </button>
          </form>
        </>
      ) : (
        <div>
          <p style={{ color: 'green' }}>{message}</p>
          <p>Please check your inbox (and spam folder).</p>
          <Link to="/login">Back to Login</Link>
        </div>
      )}
    </div>
  );
};

export default ForgotPasswordPage;