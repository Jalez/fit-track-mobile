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
  time?: number;
  distance?: number;
  weight?: number;
  restTime?: number;
  // Add these fields for superset support
  groupId?: string;
  groupType?: 'single' | 'group';
}

export interface ScheduledWorkout {
  id: string;
  workoutId: string;
  date: string; // ISO date string (YYYY-MM-DD)
  completed?: boolean;
  notes?: string;
}

interface WorkoutContextType {
  workouts: Workout[];
  scheduledWorkouts: ScheduledWorkout[];
  addWorkout: (workout: Omit<Workout, 'id'>) => void;
  scheduleWorkout: (workoutId: string, date: string) => void;
  unscheduleWorkout: (scheduledId: string) => void;
  getScheduledWorkoutForDate: (date: string) => ScheduledWorkout | null;
  getWorkoutById: (id: string) => Workout | undefined;
  markWorkoutCompleted: (scheduledId: string) => void;
}

export const WorkoutContext = createContext<WorkoutContextType>({
  workouts: [],
  scheduledWorkouts: [],
  addWorkout: () => {},
  scheduleWorkout: () => {},
  unscheduleWorkout: () => {},
  getScheduledWorkoutForDate: () => null,
  getWorkoutById: () => undefined,
  markWorkoutCompleted: () => {},
});

export const WorkoutProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [workouts, setWorkouts] = useState<Workout[]>([
    {
      id: 'test-workout-1',
      name: 'Full Body Strength',
      description: 'A comprehensive full-body workout targeting all major muscle groups',
      duration: 45,
      difficulty: 'intermediate',
      exercises: [
        {
          id: '1',
          name: 'Barbell Squat',
          type: 'strength',
          sets: 4,
          reps: 10,
          restTime: 90,
          weight: 135
        },
        {
          id: '2',
          name: 'Bench Press',
          type: 'strength',
          sets: 3,
          reps: 12,
          restTime: 60,
          weight: 115
        },
        {
          id: '3',
          name: 'Pull-ups',
          type: 'strength',
          sets: 3,
          reps: 8,
          restTime: 60
        },
        {
          id: '4',
          name: 'Deadlift',
          type: 'strength',
          sets: 4,
          reps: 8,
          restTime: 120,
          weight: 185
        }
      ]
    },
    {
      id: 'test-workout-2',
      name: 'Upper Body Focus',
      description: 'Target your chest, back, shoulders, and arms',
      duration: 35,
      difficulty: 'beginner',
      exercises: [
        {
          id: '5',
          name: 'Push-ups',
          type: 'strength',
          sets: 3,
          reps: 15,
          restTime: 45
        },
        {
          id: '6',
          name: 'Dumbbell Rows',
          type: 'strength',
          sets: 3,
          reps: 12,
          restTime: 60,
          weight: 25
        },
        {
          id: '7',
          name: 'Shoulder Press',
          type: 'strength',
          sets: 3,
          reps: 10,
          restTime: 60,
          weight: 30
        }
      ]
    }
  ]);

  const [scheduledWorkouts, setScheduledWorkouts] = useState<ScheduledWorkout[]>([
    // Add a test scheduled workout for today
    {
      id: 'scheduled-1',
      workoutId: 'test-workout-1',
      date: new Date().toISOString().split('T')[0], // Today's date
      completed: false
    }
  ]);

  const addWorkout = (workout: Omit<Workout, 'id'>) => {
    const newWorkout = {
      ...workout,
      id: Math.random().toString(36).substr(2, 9),
    };
    setWorkouts(prev => [...prev, newWorkout]);
  };

  const scheduleWorkout = (workoutId: string, date: string) => {
    const newScheduledWorkout: ScheduledWorkout = {
      id: Math.random().toString(36).substr(2, 9),
      workoutId,
      date,
      completed: false
    };
    setScheduledWorkouts(prev => [...prev, newScheduledWorkout]);
  };

  const unscheduleWorkout = (scheduledId: string) => {
    setScheduledWorkouts(prev => prev.filter(sw => sw.id !== scheduledId));
  };

  const getScheduledWorkoutForDate = (date: string): ScheduledWorkout | null => {
    return scheduledWorkouts.find(sw => sw.date === date) || null;
  };

  const getWorkoutById = (id: string): Workout | undefined => {
    return workouts.find(w => w.id === id);
  };

  const markWorkoutCompleted = (scheduledId: string) => {
    setScheduledWorkouts(prev => 
      prev.map(sw => 
        sw.id === scheduledId ? { ...sw, completed: true } : sw
      )
    );
  };

  return (
    <WorkoutContext.Provider value={{ 
      workouts, 
      scheduledWorkouts,
      addWorkout, 
      scheduleWorkout,
      unscheduleWorkout,
      getScheduledWorkoutForDate,
      getWorkoutById,
      markWorkoutCompleted
    }}>
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