import React from 'react';
import AppointmentList from '../components/appointments/AppointmentList';
import { useAuth } from '../context/AuthContext';
const EmployeeDashboard = () => {
  const { user } = useAuth();

  return (
    <div>
      <h1>Welcome, {user?.name}</h1>
      <p>Here are your pending appointments. Please approve or reject them.</p>

      <AppointmentList />
      <br />
    </div>
  );
};

export default EmployeeDashboard;