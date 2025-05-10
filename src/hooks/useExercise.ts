import { useState, useEffect } from 'react';
import { fetchExercises, createExercise, updateExercise, deleteExercise } from '../api/exerciseApi';

const useExercise = () => {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadExercises = async () => {
      try {
        const fetchedExercises = await fetchExercises();
        setExercises(fetchedExercises);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    loadExercises();
  }, []);

  const addExercise = async (exercise) => {
    try {
      const newExercise = await createExercise(exercise);
      setExercises((prev) => [...prev, newExercise]);
    } catch (err) {
      setError(err);
    }
  };

  const editExercise = async (id, updatedExercise) => {
    try {
      const exercise = await updateExercise(id, updatedExercise);
      setExercises((prev) =>
        prev.map((ex) => (ex.id === id ? exercise : ex))
      );
    } catch (err) {
      setError(err);
    }
  };

  const removeExercise = async (id) => {
    try {
      await deleteExercise(id);
      setExercises((prev) => prev.filter((ex) => ex.id !== id));
    } catch (err) {
      setError(err);
    }
  };

  return {
    exercises,
    loading,
    error,
    addExercise,
    editExercise,
    removeExercise,
  };
};

export default useExercise;