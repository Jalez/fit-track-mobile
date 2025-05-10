import axios from 'axios';

const API_URL = 'https://api.example.com/workouts';

export const fetchWorkouts = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const createWorkout = async (workout) => {
  const response = await axios.post(API_URL, workout);
  return response.data;
};

export const updateWorkout = async (workoutId, workout) => {
  const response = await axios.put(`${API_URL}/${workoutId}`, workout);
  return response.data;
};

export const deleteWorkout = async (workoutId) => {
  await axios.delete(`${API_URL}/${workoutId}`);
};