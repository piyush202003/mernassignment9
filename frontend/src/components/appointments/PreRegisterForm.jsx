import React, { useState, useEffect } from 'react';
import { appointmentService } from '../../services/appointmentService';

const initialState = {
  visitorName: '',
  visitorEmail: '',
  visitorPhone: '',
  purpose: '',
  host: '',
  appointmentTime: '',
};

const PreRegisterForm = () => {
  const [formData, setFormData] = useState(initialState);
  const [employees, setEmployees] = useState([]);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const data = await appointmentService.getAllEmployees();
        setEmployees(data);
        if (data.length > 0) {
          setFormData((prev) => ({ ...prev, host: data[0]._id }));
        }
      } catch (err) {
        setError('Failed to fetch employee list. Please try again later.');
      }
    };

    fetchEmployees();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const newAppointment = await appointmentService.createAppointment(formData);
      
      setSuccess(
        `Appointment requested successfully! Your request for ${newAppointment.appointmentTime} is pending approval.`
      );
      setFormData(initialState);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '500px', margin: 'auto' }}>
      <h2>Visitor Pre-Registration</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}

      <div style={formGroupStyle}>
        <label htmlFor="visitorName">Full Name:</label>
        <input
          type="text"
          name="visitorName"
          id="visitorName"
          value={formData.visitorName}
          onChange={handleChange}
          required
          style={inputStyle}
        />
      </div>
      <div style={formGroupStyle}>
        <label htmlFor="visitorEmail">Email:</label>
        <input
          type="email"
          name="visitorEmail"
          id="visitorEmail"
          value={formData.visitorEmail}
          onChange={handleChange}
          required
          style={inputStyle}
        />
      </div>
      <div style={formGroupStyle}>
        <label htmlFor="visitorPhone">Phone Number:</label>
        <input
          type="tel"
          name="visitorPhone"
          id="visitorPhone"
          value={formData.visitorPhone}
          onChange={handleChange}
          required
          style={inputStyle}
        />
      </div>
      <div style={formGroupStyle}>
        <label htmlFor="host">Host (Employee to visit):</label>
        <select
          name="host"
          id="host"
          value={formData.host}
          onChange={handleChange}
          required
          style={inputStyle}
        >
          <option value="">-- Select a Host --</option>
          {employees.map((emp) => (
            <option key={emp._id} value={emp._id}>
              {emp.name}
            </option>
          ))}
        </select>
      </div>
      <div style={formGroupStyle}>
        <label htmlFor="appointmentTime">Appointment Time:</label>
        <input
          type="datetime-local"
          name="appointmentTime"
          id="appointmentTime"
          value={formData.appointmentTime}
          onChange={handleChange}
          required
          style={inputStyle}
        />
      </div>
      <div style={formGroupStyle}>
        <label htmlFor="purpose">Purpose of Visit:</label>
        <textarea
          name="purpose"
          id="purpose"
          value={formData.purpose}
          onChange={handleChange}
          required
          style={inputStyle}
          rows={3}
        />
      </div>
      <button type="submit" disabled={loading} style={buttonStyle}>
        {loading ? 'Submitting...' : 'Request Appointment'}
      </button>
    </form>
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

export default PreRegisterForm;