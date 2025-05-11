import { useState, useEffect, useContext } from 'react';
import { WorkoutContext, Workout } from '../../../../contexts/WorkoutContext';
import { ExerciseGroup, CompletedSetsMap } from '../types';
import { groupExercises } from '../utils';

interface UseActiveWorkoutProps {
  workoutId: string | undefined;
}

interface UseActiveWorkoutReturn {
  workout: Workout | null;
  loading: boolean;
  exerciseGroups: ExerciseGroup[];
  currentGroupIndex: number;
  completedSetsMap: CompletedSetsMap;
  isResting: boolean;
  restTime: number;
  elapsedTime: number;
  workoutComplete: boolean;
  handleCompleteSet: (exerciseId: string) => void;
  skipRest: () => void;
  handlePreviousExerciseGroup: () => void;
  handleNextExerciseGroup: () => void;
  finishWorkout: () => void;
  setWorkoutComplete: (value: boolean) => void;
}

export const useActiveWorkout = ({ workoutId }: UseActiveWorkoutProps): UseActiveWorkoutReturn => {
  const { workouts } = useContext(WorkoutContext);
  const [loading, setLoading] = useState(true);
  const [workout, setWorkout] = useState<Workout | null>(null);
  
  // Track current exercise group (single exercise or superset) instead of just one exercise
  const [currentGroupIndex, setCurrentGroupIndex] = useState(0);
  const [exerciseGroups, setExerciseGroups] = useState<ExerciseGroup[]>([]);
  
  // Track completed sets per exercise in the current group
  const [completedSetsMap, setCompletedSetsMap] = useState<CompletedSetsMap>({});
  
  const [isResting, setIsResting] = useState(false);
  const [restTime, setRestTime] = useState(60);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [workoutComplete, setWorkoutComplete] = useState(false);
  
  useEffect(() => {
    // Load the workout data
    const loadWorkout = () => {
      // Find the workout in the context
      let foundWorkout = workouts.find(w => w.id.toString() === workoutId?.toString());
      
      // If not found or no workoutId, use a default workout
      if (!foundWorkout) {
        foundWorkout = {
          id: workoutId || 'default',
          name: 'Full Body Workout',
          description: 'A comprehensive workout targeting all major muscle groups',
          duration: 60,
          difficulty: 'medium',
          exercises: [
            {
              id: '1',
              name: 'Barbell Squat',
              type: 'strength',
              sets: 4,
              reps: 10,
              restTime: 90,
              workoutConfig: {
                type: 'single',
                sets: [{ reps: 10, restTime: 90 }]
              }
            },
            {
              id: '2',
              name: 'Bench Press',
              type: 'strength',
              sets: 3,
              reps: 12,
              restTime: 60,
              workoutConfig: {
                type: 'group',
                groupId: 'superset1',
                sets: [{ reps: 12, restTime: 60 }]
              }
            },
            {
              id: '3',
              name: 'Pull-ups',
              type: 'strength',
              sets: 3,
              reps: 8,
              restTime: 60,
              workoutConfig: {
                type: 'group',
                groupId: 'superset1',
                sets: [{ reps: 8, restTime: 60 }]
              }
            },
            {
              id: '4',
              name: 'Deadlift',
              type: 'strength',
              sets: 4,
              reps: 8,
              restTime: 120,
              workoutConfig: {
                type: 'single',
                sets: [{ reps: 8, restTime: 120 }]
              }
            }
          ]
        };
      }
      
      setWorkout(foundWorkout);
      
      // Group exercises into single exercises and supersets
      const groups = groupExercises(foundWorkout.exercises);
      setExerciseGroups(groups);
      
      // Initialize completed sets for all exercises
      const initialCompletedSets: Record<string, number> = {};
      foundWorkout.exercises.forEach(ex => {
        initialCompletedSets[ex.id] = 0;
      });
      setCompletedSetsMap(initialCompletedSets);
      
      setLoading(false);
    };

    // Simulate a loading delay
    setTimeout(loadWorkout, 500);
  }, [workoutId, workouts]);
  
  // Reset completed sets when changing exercise groups
  useEffect(() => {
    if (exerciseGroups.length > 0 && currentGroupIndex >= 0 && currentGroupIndex < exerciseGroups.length) {
      // Don't reset the completed sets, just ensure all exercises in this group have entries
      const newCompletedSets = { ...completedSetsMap };
      exerciseGroups[currentGroupIndex].exercises.forEach(ex => {
        if (newCompletedSets[ex.id] === undefined) {
          newCompletedSets[ex.id] = 0;
        }
      });
      setCompletedSetsMap(newCompletedSets);
    }
  }, [currentGroupIndex, exerciseGroups]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;
    if (isResting) {
      intervalId = setInterval(() => {
        setRestTime(prev => {
          if (prev <= 1) {
            if (intervalId) clearInterval(intervalId);
            setIsResting(false);
            // Automatically advance to the next group when rest time is complete
            if (currentGroupIndex < exerciseGroups.length - 1) {
              setCurrentGroupIndex(prev => prev + 1);
            }
            return 60; // Reset for next rest period
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isResting, currentGroupIndex, exerciseGroups.length]);

  useEffect(() => {
    // Overall workout timer
    let intervalId: NodeJS.Timeout | null = null;
    if (!workoutComplete) {
      intervalId = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [workoutComplete]);
  
  const handleCompleteSet = (exerciseId: string) => {
    if (!workout) return;
    
    // Update completed sets for this specific exercise
    const newCompletedSetsMap = { ...completedSetsMap };
    newCompletedSetsMap[exerciseId] = (newCompletedSetsMap[exerciseId] || 0) + 1;
    setCompletedSetsMap(newCompletedSetsMap);
    
    const currentGroup = exerciseGroups[currentGroupIndex];
    if (!currentGroup) return;
    
    const exercise = currentGroup.exercises.find(e => e.id === exerciseId);
    if (!exercise) return;
    
    // Get the total number of sets for this exercise (from either source)
    const exerciseTotalSets = exercise.workoutConfig?.sets?.length || exercise.sets || 0;
    
    // Check if this specific exercise has completed all its sets
    const exerciseCompleted = newCompletedSetsMap[exerciseId] >= exerciseTotalSets;
    
    // Check if all exercises in the current group have completed all their sets
    const allExercisesSetsCompleted = currentGroup.exercises.every(ex => {
      const totalSets = ex.workoutConfig?.sets?.length || ex.sets || 0;
      return newCompletedSetsMap[ex.id] >= totalSets;
    });
    
    // If all sets of all exercises in the group are completed
    if (allExercisesSetsCompleted) {
      // If there's another group, start rest period
      if (currentGroupIndex < exerciseGroups.length - 1) {
        setIsResting(true);
        // Use the rest time from the last exercise in the group
        const lastExercise = currentGroup.exercises[currentGroup.exercises.length - 1];
        const restTimeValue = lastExercise.workoutConfig?.sets?.[0]?.restTime || 
                              lastExercise.restTime || 
                              60;
        setRestTime(restTimeValue);
        
        // Move to the next group after the rest period auto-completes
        // (or the user can skip rest with skipRest)
      } else {
        // If this was the last group, complete workout
        setWorkoutComplete(true);
      }
    }
  };

  const skipRest = () => {
    setIsResting(false);
    // Move to the next group after skipping rest
    if (currentGroupIndex < exerciseGroups.length - 1) {
      setCurrentGroupIndex(prev => prev + 1);
    }
  };

  const handleNextExerciseGroup = () => {
    if (exerciseGroups && currentGroupIndex < exerciseGroups.length - 1) {
      setCurrentGroupIndex(prev => prev + 1);
    } else {
      setWorkoutComplete(true);
    }
  };

  const handlePreviousExerciseGroup = () => {
    if (currentGroupIndex > 0) {
      setCurrentGroupIndex(prev => prev - 1);
    }
  };

  const finishWorkout = () => {
    setWorkoutComplete(true);
  };
  
  return {
    workout,
    loading,
    exerciseGroups,
    currentGroupIndex,
    completedSetsMap,
    isResting,
    restTime,
    elapsedTime,
    workoutComplete,
    handleCompleteSet,
    skipRest,
    handlePreviousExerciseGroup,
    handleNextExerciseGroup,
    finishWorkout,
    setWorkoutComplete
  };
};