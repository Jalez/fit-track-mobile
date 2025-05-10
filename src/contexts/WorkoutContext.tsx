import React, { createContext, useContext, useState } from 'react';

export interface Workout {
  id: string;
  name: string;
  description?: string;
  duration?: number;
  difficulty?: string;
  exercises: Exercise[];
}

export interface Exercise {
  id: string;
  name: string;
  type?: string;
  sets: number;
  reps: number;
  restTime?: number;
}

interface WorkoutContextType {
  workouts: Workout[];
  addWorkout: (workout: Omit<Workout, 'id'>) => void;
}

export const WorkoutContext = createContext<WorkoutContextType>({
  workouts: [],
  addWorkout: () => {},
});

export const WorkoutProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [workouts, setWorkouts] = useState<Workout[]>([]);

  const addWorkout = (workout: Omit<Workout, 'id'>) => {
    const newWorkout = {
      ...workout,
      id: Math.random().toString(36).substr(2, 9),
    };
    setWorkouts(prev => [...prev, newWorkout]);
  };

  return (
    <WorkoutContext.Provider value={{ workouts, addWorkout }}>
      {children}
    </WorkoutContext.Provider>
  );
};

export const useWorkout = () => {
  const context = useContext(WorkoutContext);
  if (!context) {
    throw new Error('useWorkout must be used within a WorkoutProvider');
  }
  return context;
};