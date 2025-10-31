import React, { useState, useEffect } from 'react';
import { profileService } from '../services/profileService';
import { useAuth } from '../context/AuthContext';

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [otp, setOtp] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [actionMessage, setActionMessage] = useState(null);

  const [photoFile, setPhotoFile] = useState(null);
  const [photoLoading, setPhotoLoading] = useState(false);
  const [photoMessage, setPhotoMessage] = useState(null);

  const { user, login } = useAuth();
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const data = await profileService.getMyProfile();
        setProfile(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handlePhotoUpload = async (e) => {
    e.preventDefault();
    if (!photoFile) {
      setPhotoMessage({ type: 'error', text: 'Please select an image first.' });
      return;
    }

    setPhotoLoading(true);
    setPhotoMessage(null);

    try {
      const data = await profileService.updateProfilePhoto(photoFile);
      setProfile((prev) => ({ ...prev, photoUrl: data.photoUrl }));
      setPhotoFile(null);
      setPhotoMessage({ type: 'success', text: data.message });
      
    } catch (err) {
      setPhotoMessage({ type: 'error', text: err.message });
    } finally {
      setPhotoLoading(false);
    }
  };

  const handleSendOtp = async () => {
    setActionMessage(null);
    try {
      const data = await profileService.sendEmailVerificationOtp();
      setActionMessage(data.message);
      setShowOtpInput(true);
    } catch (err) {
      setActionMessage({ type: 'error', text: err.message });
    }
  };
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setActionMessage(null);
    try {
      const data = await profileService.verifyEmailOtp(otp);
      
      setProfile(data.user);
      setActionMessage({ type: 'success', text: data.message });
      setShowOtpInput(false);
      login({ ...user, isEmailVerified: data.user.isEmailVerified });

    } catch (err) {
      setActionMessage({ type: 'error', text: err.message });
    }
  };

  if (loading) return <p>Loading profile...</p>;
  if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;
  if (!profile) return <p>No profile data found.</p>;

  return (
    <div style={{ maxWidth: '600px', margin: 'auto' }}>
      <h1>My Profile</h1>
      <div style={profileBoxStyle}>
        <h4>Profile Picture</h4>
        <img 
          src={profile.photoUrl || 'https://via.placeholder.com/150?text=No+Photo'} 
          alt="Profile" 
          style={photoStyle}
        />
        
        <form onSubmit={handlePhotoUpload} style={{ marginTop: '1rem' }}>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setPhotoFile(e.target.files[0])}
            required
          />
          <button 
            type="submit" 
            disabled={photoLoading} 
            style={{ ...buttonStyle, marginLeft: '10px' }}
          >
            {photoLoading ? 'Uploading...' : 'Update Photo'}
          </button>
        </form>
        {photoMessage && (
            <p style={{ 
                color: photoMessage.type === 'error' ? 'red' : 'green',
                marginTop: '10px'
            }}>
              {photoMessage.text}
            </p>
          )}
      </div>
      
      <div style={profileBoxStyle}>
        <p><strong>Name:</strong> {profile.name}</p>
        <p><strong>Email:</strong> {profile.email}</p>
        <p><strong>Role:</strong> {profile.role}</p>
        <p>
          <strong>Email Status: </strong>
          {profile.isEmailVerified ? (
            <span style={{ color: 'green', fontWeight: 'bold' }}>Verified</span>
          ) : (
            <span style={{ color: 'red', fontWeight: 'bold' }}>Not Verified</span>
          )}
        </p>
      </div>

      {!profile.isEmailVerified && (
        <div style={{ ...profileBoxStyle, background: '#f9f9f9' }}>
          <h4>Verify Your Email</h4>
          <p>Click the button below to receive a 6-digit OTP to your email.</p>
          
          {actionMessage && (
            <p style={{ color: actionMessage.type === 'error' ? 'red' : 'green' }}>
              {actionMessage.text || actionMessage}
            </p>
          )}

          {!showOtpInput ? (
            <button onClick={handleSendOtp} style={buttonStyle}>
              Send Verification OTP
            </button>
          ) : (
            <form onSubmit={handleVerifyOtp}>
              <label htmlFor="otp">Enter OTP:</label>
              <input
                type="text"
                id="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                minLength={6}
                maxLength={6}
                style={{ margin: '0 10px' }}
              />
              <button type="submit" style={buttonStyle}>
                Verify
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
};

const profileBoxStyle = {
  border: '1px solid #ddd',
  borderRadius: '5px',
  padding: '1rem 1.5rem',
  marginBottom: '1rem',
};

const photoStyle = {
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    objectFit: 'cover',
    marginBottom: '10px',
};

const buttonStyle = {
  backgroundColor: '#007bff',
  color: 'white',
  padding: '8px 12px',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
};

export default ProfilePage;