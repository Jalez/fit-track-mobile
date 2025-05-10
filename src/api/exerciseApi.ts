import axios from 'axios';

const API_URL = 'https://api.example.com/exercises';

// Mock exercise data to prevent infinite loading
const mockExercises = [
  {
    id: '1',
    name: 'Barbell Squat',
    type: 'strength',
    muscle: 'legs',
    equipment: 'barbell',
    difficulty: 'intermediate',
    instructions: 'Stand with feet shoulder-width apart, barbell across upper back. Bend knees and lower body until thighs are parallel to floor. Return to start position.',
  },
  {
    id: '2',
    name: 'Push-up',
    type: 'strength',
    muscle: 'chest',
    equipment: 'body weight',
    difficulty: 'beginner',
    instructions: 'Start in plank position with hands slightly wider than shoulder-width. Lower body until chest nearly touches floor, then push back up.',
  },
  {
    id: '3',
    name: 'Pull-up',
    type: 'strength',
    muscle: 'back',
    equipment: 'pull-up bar',
    difficulty: 'intermediate',
    instructions: 'Hang from bar with palms facing away. Pull body up until chin clears the bar, then lower back down with control.',
  },
  {
    id: '4',
    name: 'Running',
    type: 'cardio',
    muscle: 'legs',
    equipment: 'none',
    difficulty: 'beginner',
    instructions: 'Start at a comfortable pace and maintain steady breathing. Keep upper body relaxed and maintain good posture.',
  },
  {
    id: '5',
    name: 'Plank',
    type: 'strength',
    muscle: 'core',
    equipment: 'none',
    difficulty: 'beginner',
    instructions: 'Start in forearm plank position. Keep body in straight line from head to heels. Hold the position while engaging your core.',
  }
];

export const fetchExercises = async () => {
  try {
    // Simulate network delay for 1 second
    return await new Promise(resolve => {
      setTimeout(() => resolve(mockExercises), 1000);
    });
    
    // The following code would be used in a production environment:
    // const response = await axios.get(API_URL);
    // return response.data;
  } catch (error) {
    console.error('Error fetching exercises:', error);
    // Return mock data as fallback
    return mockExercises;
  }
};

export const createExercise = async (exercise) => {
  try {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Return the new exercise with a generated ID
    return {
      ...exercise,
      id: (Date.now().toString())
    };
    
    // Production code:
    // const response = await axios.post(API_URL, exercise);
    // return response.data;
  } catch (error) {
    console.error('Error creating exercise:', error);
    throw error;
  }
};

export const updateExercise = async (id, exercise) => {
  try {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Return the updated exercise
    return {
      ...exercise,
      id
    };
    
    // Production code:
    // const response = await axios.put(`${API_URL}/${id}`, exercise);
    // return response.data;
  } catch (error) {
    console.error('Error updating exercise:', error);
    throw error;
  }
};

export const deleteExercise = async (id) => {
  try {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Production code:
    // await axios.delete(`${API_URL}/${id}`);
  } catch (error) {
    console.error('Error deleting exercise:', error);
    throw error;
  }
};