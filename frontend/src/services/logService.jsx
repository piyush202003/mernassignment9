const API_URL = 'http://localhost:5000/api/logs';

const getToken = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  return user ? user.token : null;
};

const getAuthHeaders = () => {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
};

const handleScan = async (appointmentId) => {
  const response = await fetch(`${API_URL}/scan`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ appointmentId }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Scan failed');
  }

  return data;
};

export const logService = { handleScan };