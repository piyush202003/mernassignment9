const API_URL = 'http://localhost:5000/api/appointments';


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

const getAllEmployees = async () => {
  const response = await fetch(`${API_URL}/employees`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch employees');
  }
  return data;
};

const createAppointment = async (appointmentData) => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(appointmentData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to create appointment');
  }
  return data;
};

const getVisitorAppointments = async () => {
  const response = await fetch(`${API_URL}/my-appointments`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch appointments');
  }
  return data;
};

const getMyAppointments = async () => {
  const response = await fetch(`${API_URL}/my`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch appointments');
  }
  return data;
};

const updateAppointmentStatus = async (appointmentId, status) => {
  const response = await fetch(`${API_URL}/${appointmentId}/status`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify({ status }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to update status');
  }
  return data;
};

export const appointmentService = {
  getAllEmployees,
  createAppointment,
  getVisitorAppointments,
  getMyAppointments,
  updateAppointmentStatus,
};