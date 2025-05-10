import { useState, useEffect } from 'react';
import { Workout } from '../models/Workout';
import { fetchWorkouts, createWorkout, updateWorkout, deleteWorkout } from '../api/workoutApi';

const useWorkout = () => {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadWorkouts = async () => {
      try {
        const fetchedWorkouts = await fetchWorkouts();
        setWorkouts(fetchedWorkouts);
      } catch (err) {
        setError('Failed to load workouts');
      } finally {
        setLoading(false);
      }
    };

    loadWorkouts();
  }, []);

  const addWorkout = async (workout: Workout) => {
    try {
      const newWorkout = await createWorkout(workout);
      setWorkouts((prev) => [...prev, newWorkout]);
    } catch (err) {
      setError('Failed to add workout');
    }
  };

  const editWorkout = async (workout: Workout) => {
    try {
      const updatedWorkout = await updateWorkout(workout);
      setWorkouts((prev) =>
        prev.map((w) => (w.id === updatedWorkout.id ? updatedWorkout : w))
      );
    } catch (err) {
      setError('Failed to update workout');
    }
  };

  const removeWorkout = async (id: string) => {
    try {
      await deleteWorkout(id);
      setWorkouts((prev) => prev.filter((w) => w.id !== id));
    } catch (err) {
      setError('Failed to delete workout');
    }
  };

  return {
    workouts,
    loading,
    error,
    addWorkout,
    editWorkout,
    removeWorkout,
  };
};

export default useWorkout;