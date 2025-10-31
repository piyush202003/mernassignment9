const API_URL = 'http://localhost:5000/api/reports';

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

const getLogsReport = async (filters = {}) => {
  const params = new URLSearchParams();
  
  for (const key in filters) {
    if (filters[key]) {
      params.append(key, filters[key]);
    }
  }
  
  const queryString = params.toString();
  const url = `${API_URL}/logs?${queryString}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch report');
  }

  return data;
};

export const reportService = {
  getLogsReport,
};