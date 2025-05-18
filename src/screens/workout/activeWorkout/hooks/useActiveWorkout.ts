import { useState, useEffect, useContext } from 'react';
import { WorkoutContext, Workout } from '../../../../contexts/WorkoutContext';
import { ExerciseGroup, CompletedSetsMap } from '../types';
import { groupExercises } from '../utils';
import { WorkoutExercise, Exercise as ModelExercise } from '../../../../models/Exercise';

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
  handleCompleteSet: (exerciseId: string, actualReps?: number, actualRestTime?: number) => void;
  skipRest: () => void;
  handlePreviousExerciseGroup: () => void;
  handleNextExerciseGroup: () => void;
  finishWorkout: () => void;
  setWorkoutComplete: (value: boolean) => void;
  // New superset navigation state and methods
  supersetExerciseIndex: number;
  handlePreviousSupersetExercise: () => void;
  handleNextSupersetExercise: () => void;
  updateSupersetExerciseIndex: (index: number) => void;
}

// Track adjusted values for exercises
interface ExerciseAdjustments {
  [exerciseId: string]: {
    actualReps: number[];
    actualRestTimes: number[];
  };
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
  
  // Track adjusted values (reps and rest times) for each exercise set
  const [exerciseAdjustments, setExerciseAdjustments] = useState<ExerciseAdjustments>({});
  
  // Track active exercise within a superset group
  const [supersetExerciseIndex, setSupersetExerciseIndex] = useState(0);
  
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
        // Using a type assertion to allow adding workoutConfig
        const defaultExercises = [
          {
            id: '1',
            name: 'Barbell Squat',
            type: 'strength',
            sets: 4,
            reps: 10,
            restTime: 10,
          },
          {
            id: '2',
            name: 'Bench Press',
            type: 'strength',
            sets: 3,
            reps: 12,
            restTime: 60,
            groupId: 'superset1',
            groupType: 'group' as 'group' // Type assertion to fix type error
          },
          {
            id: '3',
            name: 'Pull-ups',
            type: 'strength',
            sets: 3,
            reps: 8,
            restTime: 60,
            groupId: 'superset1',
            groupType: 'group' as 'group' // Type assertion to fix type error
          },
          {
            id: '4',
            name: 'Deadlift',
            type: 'strength',
            sets: 4,
            reps: 8,
            restTime: 120,
          }
        ];

        foundWorkout = {
          id: workoutId || 'default',
          name: 'Full Body Workout',
          description: 'A comprehensive workout targeting all major muscle groups',
          duration: 60,
          difficulty: 'medium',
          exercises: defaultExercises
        };
      }
      
      // Handle the possibility of foundWorkout being undefined
      if (foundWorkout) {
        setWorkout(foundWorkout);
        
        // Convert Exercise[] to WorkoutExercise[] to ensure type compatibility
        const workoutExercises = foundWorkout.exercises.map(ex => {
          // Create a proper WorkoutExercise by adding workoutConfig if it doesn't exist
          const workoutEx: WorkoutExercise = {
            ...ex as unknown as ModelExercise,
            workoutConfig: {
              type: ex.groupType || 'single',
              groupId: ex.groupId,
              sets: Array(ex.sets || 1).fill({
                reps: ex.reps,
                restTime: ex.restTime || 60
              })
            }
          };
          return workoutEx;
        });
        
        // Group exercises into single exercises and supersets
        const groups = groupExercises(workoutExercises);
        setExerciseGroups(groups);
        
        // Initialize completed sets for all exercises
        const initialCompletedSets: Record<string, number> = {};
        // Initialize exercise adjustments tracking
        const initialAdjustments: ExerciseAdjustments = {};
        
        foundWorkout.exercises.forEach(ex => {
          initialCompletedSets[ex.id] = 0;
          initialAdjustments[ex.id] = {
            actualReps: [],
            actualRestTimes: []
          };
        });
        
        setCompletedSetsMap(initialCompletedSets);
        setExerciseAdjustments(initialAdjustments);
      }
      
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
      const newAdjustments = { ...exerciseAdjustments };
      
      exerciseGroups[currentGroupIndex].exercises.forEach(ex => {
        if (newCompletedSets[ex.id] === undefined) {
          newCompletedSets[ex.id] = 0;
        }
        
        if (newAdjustments[ex.id] === undefined) {
          newAdjustments[ex.id] = {
            actualReps: [],
            actualRestTimes: []
          };
        }
      });
      
      setCompletedSetsMap(newCompletedSets);
      setExerciseAdjustments(newAdjustments);
    }
  }, [currentGroupIndex, exerciseGroups]);

  // Reset the superset exercise index when changing exercise groups
  useEffect(() => {
    setSupersetExerciseIndex(0);
  }, [currentGroupIndex]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;
    if (isResting) {
      intervalId = setInterval(() => {
        setRestTime(prev => {
          if (prev <= 1) {
            if (intervalId) clearInterval(intervalId);
            setIsResting(false);
            
            // Check if there are still sets left in the current group
            const currentGroup = exerciseGroups[currentGroupIndex];
            if (currentGroup) {
              const isSuperset = currentGroup.type === 'superset';
              
              // Check if all exercises in this group have completed all their sets
              const allSetsInGroupCompleted = currentGroup.exercises.every(ex => {
                const totalSets = ex.workoutConfig?.sets?.length || ex.sets || 0;
                const completedSets = completedSetsMap[ex.id] || 0;
                return completedSets >= totalSets;
              });
              
              if (allSetsInGroupCompleted) {
                // If all sets are completed in this group, move to the next group
                if (currentGroupIndex < exerciseGroups.length - 1) {
                  setCurrentGroupIndex(prev => prev + 1);
                  setSupersetExerciseIndex(0);
                }
              } else if (isSuperset) {
                // For supersets, find the first exercise that still has sets to complete
                const nextExerciseIndex = currentGroup.exercises.findIndex(ex => {
                  const totalSets = ex.workoutConfig?.sets?.length || ex.sets || 0;
                  const completedSets = completedSetsMap[ex.id] || 0;
                  return completedSets < totalSets;
                });
                
                if (nextExerciseIndex !== -1) {
                  setSupersetExerciseIndex(nextExerciseIndex);
                }
              }
              // For normal exercises, we stay on the same exercise if it has sets left
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
  }, [isResting, currentGroupIndex, exerciseGroups, completedSetsMap]);

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
  
  const handleCompleteSet = (exerciseId: string, actualReps?: number, actualRestTime?: number) => {
    if (!workout) return;
    
    // Update completed sets for this specific exercise
    const newCompletedSetsMap = { ...completedSetsMap };
    const currentSetNumber = newCompletedSetsMap[exerciseId] || 0;
    newCompletedSetsMap[exerciseId] = currentSetNumber + 1;
    setCompletedSetsMap(newCompletedSetsMap);
    
    // Store the adjusted values if provided
    if (actualReps !== undefined || actualRestTime !== undefined) {
      const newAdjustments = { ...exerciseAdjustments };
      
      // Initialize if not already present
      if (!newAdjustments[exerciseId]) {
        newAdjustments[exerciseId] = {
          actualReps: [],
          actualRestTimes: []
        };
      }
      
      // Find current exercise
      const currentGroup = exerciseGroups[currentGroupIndex];
      if (!currentGroup) return;
      
      const exercise = currentGroup.exercises.find(e => e.id === exerciseId);
      if (!exercise) return;
      
      // Get default values
      const defaultReps = exercise.workoutConfig?.sets?.[currentSetNumber]?.reps || 
                          exercise.reps || 0;
      
      const defaultRestTime = exercise.workoutConfig?.sets?.[currentSetNumber]?.restTime || 
                             exercise.restTime || 60;
      
      // Store actual values or defaults
      newAdjustments[exerciseId].actualReps[currentSetNumber] = actualReps ?? defaultReps;
      newAdjustments[exerciseId].actualRestTimes[currentSetNumber] = actualRestTime ?? defaultRestTime;
      
      setExerciseAdjustments(newAdjustments);
      
      // Use provided rest time for the next rest period if available
      if (actualRestTime !== undefined) {
        setRestTime(actualRestTime);
      }
    }
    
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
    
    // Determine if we should start a rest period
    const isSuperset = currentGroup.type === 'superset';
    const exerciseIndex = currentGroup.exercises.findIndex(ex => ex.id === exerciseId);
    const isLastExerciseInSuperset = isSuperset && exerciseIndex === currentGroup.exercises.length - 1;
    const isNotInSuperset = !isSuperset;
    
    // Get the rest time to use
    let restTimeToUse = 60; // Default fallback
    const lastSetIndex = (newCompletedSetsMap[exerciseId] || 1) - 1;
    
    // Get actual rest time if available, otherwise use default
    const actualRestTimeValue = exerciseAdjustments[exerciseId]?.actualRestTimes[lastSetIndex];
    
    if (actualRestTimeValue !== undefined) {
      restTimeToUse = actualRestTimeValue;
    } else {
      restTimeToUse = exercise.workoutConfig?.sets?.[lastSetIndex]?.restTime || 
                    exercise.restTime || 
                    60;
    }
    
    // Start a rest period if:
    // 1. This is a single exercise (not in a superset), OR
    // 2. This is the last exercise in a superset
    if (isNotInSuperset || isLastExerciseInSuperset) {
      // If we've completed all sets in all exercises in this group
      if (allExercisesSetsCompleted) {
        // If there's another group, start rest period
        if (currentGroupIndex < exerciseGroups.length - 1) {
          setIsResting(true);
          setRestTime(restTimeToUse);
        } else {
          // If this was the last group, complete workout
          setWorkoutComplete(true);
        }
      } else if (exerciseCompleted) {
        // If we've completed all sets for just this exercise
        // but there are still other exercises in the group with sets to complete
        if (isSuperset) {
          // In a superset, move to the first exercise if we're at the end
          setSupersetExerciseIndex(0);
        }
      } else {
        // If we still have sets to complete for this exercise,
        // start a rest period before the next set
        setIsResting(true);
        setRestTime(restTimeToUse);
      }
    } else if (isSuperset && !isLastExerciseInSuperset) {
      // If we're in the middle of a superset, move to the next exercise without resting
      setSupersetExerciseIndex(exerciseIndex + 1);
    }
  };

  const handleNextSupersetExercise = () => {
    const currentGroup = exerciseGroups[currentGroupIndex];
    if (currentGroup?.type === 'superset' && supersetExerciseIndex < currentGroup.exercises.length - 1) {
      setSupersetExerciseIndex(prev => prev + 1);
    }
  };

  const handlePreviousSupersetExercise = () => {
    if (supersetExerciseIndex > 0) {
      setSupersetExerciseIndex(prev => prev - 1);
    }
  };

  const updateSupersetExerciseIndex = (index: number) => {
    const currentGroup = exerciseGroups[currentGroupIndex];
    if (currentGroup?.type === 'superset' && index >= 0 && index < currentGroup.exercises.length) {
      setSupersetExerciseIndex(index);
    }
  };
  
  const skipRest = () => {
    setIsResting(false);
    
    // Check if there are still sets left in the current group
    const currentGroup = exerciseGroups[currentGroupIndex];
    if (currentGroup) {
      const isSuperset = currentGroup.type === 'superset';
      
      // Check if all exercises in this group have completed all their sets
      const allSetsInGroupCompleted = currentGroup.exercises.every(ex => {
        const totalSets = ex.workoutConfig?.sets?.length || ex.sets || 0;
        const completedSets = completedSetsMap[ex.id] || 0;
        return completedSets >= totalSets;
      });
      
      if (allSetsInGroupCompleted) {
        // If all sets are completed in this group, move to the next group
        if (currentGroupIndex < exerciseGroups.length - 1) {
          setCurrentGroupIndex(prev => prev + 1);
          setSupersetExerciseIndex(0);
        }
      } else if (isSuperset) {
        // For supersets, find the first exercise that still has sets to complete
        const nextExerciseIndex = currentGroup.exercises.findIndex(ex => {
          const totalSets = ex.workoutConfig?.sets?.length || ex.sets || 0;
          const completedSets = completedSetsMap[ex.id] || 0;
          return completedSets < totalSets;
        });
        
        if (nextExerciseIndex !== -1) {
          setSupersetExerciseIndex(nextExerciseIndex);
        }
      }
      // For normal exercises, we stay on the same exercise if it has sets left
    }
  };

  const handleNextExerciseGroup = () => {
    if (exerciseGroups && currentGroupIndex < exerciseGroups.length - 1) {
      setCurrentGroupIndex(prev => prev + 1);
      setSupersetExerciseIndex(0); // Reset superset index when moving to next group
    } else {
      setWorkoutComplete(true);
    }
  };

  const handlePreviousExerciseGroup = () => {
    if (currentGroupIndex > 0) {
      setCurrentGroupIndex(prev => prev - 1);
      // When going to the previous group, set the superset index to the last exercise in that group
      const prevGroup = exerciseGroups[currentGroupIndex - 1];
      if (prevGroup?.type === 'superset') {
        setSupersetExerciseIndex(prevGroup.exercises.length - 1);
      } else {
        setSupersetExerciseIndex(0);
      }
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
    setWorkoutComplete,
    // New superset navigation state and methods
    supersetExerciseIndex,
    handlePreviousSupersetExercise,
    handleNextSupersetExercise,
    updateSupersetExerciseIndex
  };
};