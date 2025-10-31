import React, { useState } from 'react';
import CreateUserForm from '../components/admin/CreateUserForm';
import UserList from '../components/admin/UserList';
import LogReport from '../components/admin/LogReport';

const AdminDashboard = () => {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleUserCreated = () => {
    setRefreshKey((oldKey) => oldKey + 1);
  };

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <p>Manage users and view visitor reports.</p>
      <div style={{ marginBottom: '2rem' }}>
        <CreateUserForm onUserCreated={handleUserCreated} />
        <UserList key={refreshKey} />
      </div>
      <hr style={{ margin: '2rem 0' }} />
      <LogReport />
      <br></br>
    </div>
  );
};

export default AdminDashboard;