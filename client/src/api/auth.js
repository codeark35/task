
import api from "./api"

export const loginRequest = async (user) => {
  try {
    const response = await api.post("/auth/login", user);
    const { token, user: userData } = response.data;
    
    if (!token) {
      throw new Error('No token received from server');
    }
    
    localStorage.setItem('token', token);
    
    return {
      data: {
        token,
        user: userData
      },
      status: response.status,
      statusText: response.statusText
    };
  } catch (error) {
    console.error('Login failed:', error.response?.data || error.message);
    throw error;
  }
};

export const registerRequest = async (user) => {
  try {
    const response = await api.post("/auth/register", user);
    console.log('Registration response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Registration failed:', error.response?.data || error.message);
    throw error;
  }
};

/* export const verifyTokenRequest = async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error("No token found");
  }
  try {
    const response = await api.get("/auth/verify-token", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error('Token verification failed:', error.response?.data || error.message);
    throw error;
  }
}; */
export const verifyTokenRequest = async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error("No token found");
  }
  try {
    const response = await api.get("/auth/verify-token");
    return response.data;
  } catch (error) {
    console.error('Token verification failed:', error.response?.data || error.message);
    throw error;
  }
};

