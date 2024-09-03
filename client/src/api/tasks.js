
import api from "./api"

export const getTasksRequest = () => api.get('/tasks');

export const createTaskRequest = (task) => api.post('/task/create', task);

export const updateTaskRequest = async (task) =>
  axios.put(`/tasks/${task._id}`, task);

export const deleteTaskRequest = async (id) => axios.delete(`/tasks/${id}`);

export const getTaskRequest = async (id) => axios.get(`/tasks/${id}`);
