import { create } from 'zustand';
import { Exercise, WorkoutExercise } from '../models/Exercise';
import { fetchExercises } from '../api/exerciseApi';

interface ExerciseStore {
  // All available exercises from API
  exercises: WorkoutExercise[];
  // Exercises selected for current workout
  selectedExercises: WorkoutExercise[];
  // Loading state
  isLoading: boolean;
  // Error state
  error: string | null;
  
  // Actions
  fetchExercises: () => Promise<void>;
  addExerciseToWorkout: (exercise: WorkoutExercise) => void;
  removeExerciseFromWorkout: (exerciseId: string) => void;
  updateExerciseConfig: (exerciseId: string, config: WorkoutExercise['workoutConfig']) => void;
  clearSelectedExercises: () => void;
  
  // Superset/Triset management
  createSuperset: (exerciseIds: string[]) => void;
  createTriset: (exerciseIds: string[]) => void;
  createCircuit: (exerciseIds: string[]) => void;
  removeFromGroup: (exerciseId: string) => void;
}

export const useExerciseStore = create<ExerciseStore>((set, get) => ({
  exercises: [],
  selectedExercises: [],
  isLoading: false,
  error: null,

  fetchExercises: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await fetchExercises() as Exercise[];
      
      // Convert simple exercises to WorkoutExercise format with proper typing
      const workoutExercises: WorkoutExercise[] = data.map((exercise: Exercise) => ({
        ...exercise,
        workoutConfig: {
          type: 'single' as const,
          sets: [{ reps: 10, restTime: 60 }], // Default values
          groupId: undefined,
        }
      }));
      
      set({ exercises: workoutExercises, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch exercises', 
        isLoading: false 
      });
    }
  },

  addExerciseToWorkout: (exercise) => {
    set((state) => ({
      selectedExercises: [...state.selectedExercises, exercise]
    }));
  },

  removeExerciseFromWorkout: (exerciseId) => {
    set((state) => ({
      selectedExercises: state.selectedExercises.filter(ex => ex.id !== exerciseId)
    }));
  },

  updateExerciseConfig: (exerciseId, config) => {
    set((state) => ({
      selectedExercises: state.selectedExercises.map(ex => 
        ex.id === exerciseId 
          ? { ...ex, workoutConfig: config }
          : ex
      )
    }));
  },

  clearSelectedExercises: () => {
    set({ selectedExercises: [] });
  },

  createSuperset: (exerciseIds) => {
    set((state) => {
      const updated = [...state.selectedExercises];
      
      // Generate a unique group ID for this superset
      const groupId = `superset-${Date.now()}`;
      
      // Find exercises and update their type to 'super' with the same groupId
      exerciseIds.forEach(id => {
        const index = updated.findIndex(ex => ex.id === id);
        if (index !== -1) {
          updated[index] = {
            ...updated[index],
            workoutConfig: {
              ...updated[index].workoutConfig,
              type: 'group',
              groupId: groupId // Assign the shared group ID
            }
          };
        }
      });
      
      return { selectedExercises: updated };
    });
  },

  createTriset: (exerciseIds) => {
    set((state) => {
      const updated = [...state.selectedExercises];
      
      // Generate a unique group ID for this triset
      const groupId = `triset-${Date.now()}`;
      
      // Find exercises and update their type to 'tri' with the same groupId
      exerciseIds.forEach(id => {
        const index = updated.findIndex(ex => ex.id === id);
        if (index !== -1) {
          updated[index] = {
            ...updated[index],
            workoutConfig: {
              ...updated[index].workoutConfig,
              type: 'group',
              groupId: groupId // Assign the shared group ID
            }
          };
        }
      });
      
      return { selectedExercises: updated };
    });
  },

  createCircuit: (exerciseIds) => {
    set((state) => {
      const updated = [...state.selectedExercises];
      
      // Generate a unique group ID for this circuit
      const groupId = `circuit-${Date.now()}`;
      
      // Find exercises and update their type to 'circuit' with the same groupId
      exerciseIds.forEach(id => {
        const index = updated.findIndex(ex => ex.id === id);
        if (index !== -1) {
          updated[index] = {
            ...updated[index],
            workoutConfig: {
              ...updated[index].workoutConfig,
              type: 'group',
              groupId: groupId // Assign the shared group ID
            }
          };
        }
      });
      
      return { selectedExercises: updated };
    });
  },

  removeFromGroup: (exerciseId) => {
    set((state) => {
      const updated = [...state.selectedExercises];
      
      // Find exercise and reset type to 'single'
      const index = updated.findIndex(ex => ex.id === exerciseId);
      if (index !== -1) {
        updated[index] = {
          ...updated[index],
          workoutConfig: {
            ...updated[index].workoutConfig,
            type: 'single',
            groupId: undefined // Remove group ID
          }
        };
      }
      
      return { selectedExercises: updated };
    });
  }
}));