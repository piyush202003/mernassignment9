import React from 'react';
import WalkInRegistrationForm from '../components/visitors/WalkInRegistrationForm';
import QrScanner from '../components/scanner/QrScanner';
import { useAuth } from '../context/AuthContext';

const SecurityDashboard = () => {
  const { user } = useAuth();

  return (
    <div>
      <h1>Security Dashboard</h1>
      <p>Welcome, {user?.name}. You can scan visitor passes and register walk-ins.</p>
      <QrScanner />
      {/* <WalkInRegistrationForm /> */}
    </div>
  );
};

export default SecurityDashboard;