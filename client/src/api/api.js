import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3035/v1/api/",
  withCredentials: false, // Cambiado a false ya que no estamos usando cookies
});

// Interceptor de solicitud
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Interceptor de respuesta
api.interceptors.response.use((response) => {
  return response;
}, (error) => {
  if (error.response && error.response.status === 401) {
    // Manejar errores 401 (no autorizado)
    console.log('No autorizado, redirigiendo al inicio de sesión');
    localStorage.removeItem('token'); // Eliminar el token inválido
    // Implementa tu lógica de redirección aquí, por ejemplo:
    // window.location.href = '/login';
  }
  return Promise.reject(error);
});

export default api;