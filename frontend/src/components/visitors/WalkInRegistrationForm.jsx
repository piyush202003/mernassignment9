import React, { useState } from 'react';
import { visitorService } from '../../services/visitorService';

const WalkInRegistrationForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  
  const [photoFile, setPhotoFile] = useState(null);
  const [preview, setPreview] = useState(null);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoFile(file);
      setPreview(URL.createObjectURL(file));
    } else {
      setPhotoFile(null);
      setPreview(null);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    const visitorData = { name, email, phone };

    try {
      const newVisitor = await visitorService.createVisitor(visitorData, photoFile);
      
      setSuccess(
        `Visitor '${newVisitor.name}' created successfully!`
      );
      
      setName('');
      setEmail('');
      setPhone('');
      setPhotoFile(null);
      setPreview(null);
      e.target.reset();

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '500px', margin: 'auto', padding: '1rem', border: '1px solid #ddd' }}>
      <h3>Register Walk-In Visitor</h3>
      <form onSubmit={handleSubmit}>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {success && <p style={{ color: 'green' }}>{success}</p>}

        <div style={formGroupStyle}>
          <label htmlFor="name">Full Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={inputStyle}
          />
        </div>
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
          <label htmlFor="phone">Phone Number:</label>
          <input
            type="tel"
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            style={inputStyle}
          />
        </div>
        <div style={formGroupStyle}>
          <label htmlFor="photo">Visitor Photo:</label>
          <input
            type="file"
            id="photo"
            accept="image/*" 
            onChange={handleFileChange}
            style={inputStyle}
          />
        </div>
        
        {preview && (
          <div style={{ marginBottom: '1rem', textAlign: 'center' }}>
            <img 
              src={preview} 
              alt="Visitor preview" 
              style={{ width: '150px', height: '150px', objectFit: 'cover' }} 
            />
          </div>
        )}

        <button type="submit" disabled={loading} style={buttonStyle}>
          {loading ? 'Registering...' : 'Register Visitor'}
        </button>
      </form>
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

const buttonStyle = {
  backgroundColor: '#007bff',
  color: 'white',
  padding: '10px 15px',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
};

export default WalkInRegistrationForm;