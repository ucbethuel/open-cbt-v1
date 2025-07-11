import CONFIG from '../config/examConfig';

export const apiCall = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${CONFIG.API.BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${window.authToken || 'demo-token'}`,
        ...options.headers
      },
      ...options
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
};
