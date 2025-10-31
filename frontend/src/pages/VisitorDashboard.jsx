import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import NewAppointmentForm from '../components/appointments/NewAppointmentForm';
import VisitorAppointmentList from '../components/appointments/VisitorAppointmentList';

const VisitorDashboard = () => {
  const { user } = useAuth();
  const [refreshKey, setRefreshKey] = useState(0);

  const handleAppointmentRequested = () => {
    setRefreshKey((prevKey) => prevKey + 1);
  };

  return (
    <div className="container my-5">
      <div className="card shadow-sm border-0 mb-5">
        <div className="card-header bg-primary text-white fw-semibold">
          Request a New Appointment
        </div>
        <div className="card-body">
          <NewAppointmentForm onAppointmentRequested={handleAppointmentRequested} />
        </div>
      </div>
      
      <div className="card shadow-sm border-0">
        <div className="card-header bg-secondary text-white fw-semibold">
          Your Appointment Requests
        </div>
        <div className="card-body">
          <VisitorAppointmentList key={refreshKey} />
        </div>
      </div>
    </div>
  );
};

export default VisitorDashboard;
