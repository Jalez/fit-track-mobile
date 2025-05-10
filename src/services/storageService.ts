import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@workout_data';

export const saveWorkoutData = async (workoutData) => {
  try {
    const jsonValue = JSON.stringify(workoutData);
    await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
  } catch (e) {
    console.error('Failed to save workout data:', e);
  }
};

export const getWorkoutData = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.error('Failed to fetch workout data:', e);
  }
};

export const clearWorkoutData = async () => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error('Failed to clear workout data:', e);
  }
};