const API_URL = 'http://localhost:5000/api/profile';

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

const getMyProfile = async () => {
  const response = await fetch(`${API_URL}/me`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch profile');
  }
  return data;
};
const sendEmailVerificationOtp = async () => {
  const response = await fetch(`${API_URL}/send-email-otp`, {
    method: 'POST',
    headers: getAuthHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to send OTP');
  }
  return data;
};

const verifyEmailOtp = async (otp) => {
  const response = await fetch(`${API_URL}/verify-email-otp`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ otp }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to verify OTP');
  }
  return data;
};

const updateProfilePhoto = async (photoFile) => {
  const formData = new FormData();
  formData.append('photo', photoFile, photoFile.name); 

  const response = await fetch(`${API_URL}/photo`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${getToken()}`,
    },
    body: formData, 
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to update photo');
  }
  return data;
};

export const profileService = {
  getMyProfile,
  sendEmailVerificationOtp,
  verifyEmailOtp,
  updateProfilePhoto
};