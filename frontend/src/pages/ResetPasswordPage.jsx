import React, { useState } from 'react';
import { authService } from '../services/authService';
import { useNavigate, Link } from 'react-router-dom';

const ResetPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const data = await authService.resetPassword(email, otp, newPassword);
      setMessage(data.message);
      setTimeout(() => {
        navigate('/login');
      }, 3000);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: 'auto', padding: '2rem' }}>
      <h2>Reset Your Password</h2>
      {!message ? (
        <form onSubmit={handleSubmit}>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          
          <div style={formGroupStyle}>
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={inputStyle}
            />
          </div>
          
          <div style={formGroupStyle}>
            <label htmlFor="otp">6-Digit OTP:</label>
            <input
              type="text"
              id="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              minLength={6}
              maxLength={6}
              style={inputStyle}
            />
          </div>
          
          <div style={formGroupStyle}>
            <label htmlFor="newPassword">New Password:</label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={6}
              style={inputStyle}
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading} 
            style={{ width: '100%', padding: '10px', cursor: 'pointer' }}
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      ) : (
        <div>
          <p style={{ color: 'green' }}>{message}</p>
          <p>Redirecting you to the login page...</p>
          <Link to="/login">Click here to login now</Link>
        </div>
      )}
    </div>
  );
};

const formGroupStyle = {
  marginBottom: '1rem',
};

const inputStyle = {
  width: '100%',
  padding: '8px',
  boxSizing: 'border-box',
};

export default ResetPasswordPage;