import { useContext, useCallback } from 'react';
import { WorkoutContext, ScheduledWorkout } from '../contexts/WorkoutContext';

export const useWorkoutScheduling = () => {
  const {
    workouts,
    scheduledWorkouts,
    getScheduledWorkoutForDate,
    getWorkoutById,
    scheduleWorkout,
    unscheduleWorkout,
    markWorkoutCompleted
  } = useContext(WorkoutContext);

  const getTodayScheduledWorkout = useCallback((): ScheduledWorkout | null => {
    const today = new Date().toISOString().split('T')[0];
    return getScheduledWorkoutForDate(today);
  }, [getScheduledWorkoutForDate]);

  const getTodayWorkout = useCallback(() => {
    const scheduled = getTodayScheduledWorkout();
    if (scheduled) {
      return getWorkoutById(scheduled.workoutId);
    }
    return null;
  }, [getTodayScheduledWorkout, getWorkoutById]);

  const scheduleWorkoutForDate = useCallback((workoutId: string, date: string) => {
    scheduleWorkout(workoutId, date);
  }, [scheduleWorkout]);

  const unscheduleWorkoutForDate = useCallback((scheduledId: string) => {
    unscheduleWorkout(scheduledId);
  }, [unscheduleWorkout]);

  const completeScheduledWorkout = useCallback((scheduledId: string) => {
    markWorkoutCompleted(scheduledId);
  }, [markWorkoutCompleted]);

  return {
    workouts,
    scheduledWorkouts,
    getTodayScheduledWorkout,
    getTodayWorkout,
    getScheduledWorkoutForDate,
    getWorkoutById,
    scheduleWorkoutForDate,
    unscheduleWorkoutForDate,
    completeScheduledWorkout
  };
}; 