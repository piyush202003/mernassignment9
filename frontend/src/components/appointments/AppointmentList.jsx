import React, { useState, useEffect } from 'react';
import { appointmentService } from '../../services/appointmentService';

const AppointmentList = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMyAppointments = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const data = await appointmentService.getMyAppointments();
        setAppointments(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMyAppointments();
  }, []);

  const handleStatusUpdate = async (appointmentId, newStatus) => {
    try {
      const updatedAppointment = await appointmentService.updateAppointmentStatus(
        appointmentId,
        newStatus
      );

      setAppointments((prevAppointments) =>
        prevAppointments.map((app) =>
          app._id === appointmentId
            ? { ...app, status: updatedAppointment.status }
            : app
        )
      );
    } catch (err) {
      setError(`Failed to update status: ${err.message}`);
    }
  };

  if (loading) {
    return <p>Loading your appointments...</p>;
  }

  if (error) {
    return <p style={{ color: 'red' }}>Error: {error}</p>;
  }

  if (appointments.length === 0) {
    return <p>You have no appointments.</p>;
  }

  return (
    <div style={{ marginTop: '2rem' }}>
      <h3>My Appointments</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#f4f4f4' }}>
            <th style={tableCellStyle}>Visitor</th>
            <th style={tableCellStyle}>Email</th>
            <th style={tableCellStyle}>Time</th>
            <th style={tableCellStyle}>Purpose</th>
            <th style={tableCellStyle}>Status</th>
            <th style={tableCellStyle}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((app) => (
            <tr key={app._id}>
              <td style={tableCellStyle}>{app.visitorName}</td>
              <td style={tableCellStyle}>{app.visitorEmail}</td>
              <td style={tableCellStyle}>
                {new Date(app.appointmentTime).toLocaleString()}
              </td>
              <td style={tableCellStyle}>{app.purpose}</td>
              <td style={{ ...tableCellStyle, fontWeight: 'bold' }}>
                {app.status}
              </td>
              <td style={tableCellStyle}>
                {app.status === 'Pending' && (
                  <>
                    <button
                      onClick={() => handleStatusUpdate(app._id, 'Approved')}
                      style={{ ...buttonStyle, backgroundColor: '#28a745' }}
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(app._id, 'Rejected')}
                      style={{ ...buttonStyle, backgroundColor: '#dc3545' }}
                    >
                      Reject
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const tableCellStyle = {
  border: '1px solid #ddd',
  padding: '8px',
  textAlign: 'left',
};

const buttonStyle = {
  color: 'white',
  border: 'none',
  padding: '5px 10px',
  cursor: 'pointer',
  borderRadius: '4px',
  marginRight: '5px',
};

export default AppointmentList;