const API_URL = 'http://localhost:5000/api/visitors';

const getToken = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  return user ? user.token : null;
};

const getAuthHeaders = () => {
  const token = getToken();
  return {
    'Authorization': `Bearer ${token}`,
  };
};

const createVisitor = async (visitorData, photoFile) => {
  const formData = new FormData();

  formData.append('name', visitorData.name);
  formData.append('email', visitorData.email);
  formData.append('phone', visitorData.phone);

  if (photoFile) {
    formData.append('photo', photoFile, photoFile.name);
  }

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to create visitor');
  }
  return data;
};
export const visitorService = {
  createVisitor,
};