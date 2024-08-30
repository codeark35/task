/* import axios from "./axios"; */
import axios from "axios";
const APIURL ="http://localhost:3035/v1/api/auth"


export const loginRequest = (user) => {
  return axios.post(`${APIURL}/login`, user);
};

export const registerRequest = (user) => {
  return axios.post(`${APIURL}/register`, user);
};

export const verifyTokenRequest = (token) => {
  if (!token) {
    throw new Error("Token is undefined or null");
  }
  return axios.get(`${APIURL}/verify-token`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

