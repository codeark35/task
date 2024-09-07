
import api from "./api"

export const getTasksRequest = () => api.get('/tasks');

export const createTaskRequest = (task) => api.post('/task/create', task);

export const getTaskRequest = async (id) => api.get(`/task/${id}`);

export const updateTaskRequest = async (id, task) =>
  api.put(`/task/update/${id}`, task);

export const deleteTaskRequest = async (id) => api.delete(`/task/delete/${id}`);
