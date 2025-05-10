import axios from 'axios';

const API_URL = 'https://yourapiurl.com/api'; // Replace with your actual API URL

export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/auth/register`, userData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const loginUser = async (credentials) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, credentials);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const logoutUser = async () => {
  try {
    await axios.post(`${API_URL}/auth/logout`);
  } catch (error) {
    throw error.response.data;
  }
};

export const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem('user'));
};