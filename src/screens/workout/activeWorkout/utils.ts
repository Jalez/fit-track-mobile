import { WorkoutExercise } from '../../../models/Exercise';
import { ExerciseGroup } from './types';

/**
 * Formats time in seconds to a readable MM:SS format
 */
export const formatTime = (timeInSeconds: number): string => {
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = timeInSeconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

/**
 * Returns the appropriate icon name based on exercise type
 */
export const getExerciseIcon = (type: string | undefined): string => {
  switch (type?.toLowerCase()) {
    case 'cardio':
      return 'run';
    case 'strength':
      return 'dumbbell';
    case 'flexibility':
      return 'yoga';
    case 'balance':
      return 'human-handsup';
    default:
      return 'arm-flex';
  }
};

/**
 * Groups exercises into single exercises and supersets based on their configuration
 * Handles both workoutConfig format and direct properties on exercises
 */
export const groupExercises = (exercises: WorkoutExercise[]): ExerciseGroup[] => {
  // Handle null or empty array
  if (!exercises || exercises.length === 0) {
    return [];
  }
  
  const groups: ExerciseGroup[] = [];
  const groupMap: Record<string, WorkoutExercise[]> = {};
  const singleExercises: WorkoutExercise[] = [];
  
  // First pass - identify and categorize exercises
  exercises.forEach(exercise => {
    // Deep clone the exercise to avoid mutating the original
    const exerciseClone = { ...exercise };
    
    // Normalize exercise object to ensure workoutConfig exists
    if (!exerciseClone.workoutConfig) {
      exerciseClone.workoutConfig = {
        type: exerciseClone.groupType || 'single',
        groupId: exerciseClone.groupId,
        sets: []
      };
    }

    // Ensure sets array exists
    if (!exerciseClone.workoutConfig.sets) {
      exerciseClone.workoutConfig.sets = [];
    }

    // If no sets defined, create default sets based on exercise properties
    if (exerciseClone.workoutConfig.sets.length === 0 && exerciseClone.sets) {
      for (let i = 0; i < exerciseClone.sets; i++) {
        exerciseClone.workoutConfig.sets.push({
          reps: exerciseClone.reps,
          restTime: exerciseClone.restTime
        });
      }
    }

    // Check both formats for group information
    const isGroupExercise = 
      (exerciseClone.workoutConfig?.type === 'group' && exerciseClone.workoutConfig?.groupId) || 
      (exerciseClone.groupType === 'group' && exerciseClone.groupId);
    
    // Get groupId from either workoutConfig or direct property
    const groupId = exerciseClone.workoutConfig?.groupId || exerciseClone.groupId;

    if (isGroupExercise && groupId) {
      // Initialize group array if this is the first exercise in this group
      if (!groupMap[groupId]) {
        groupMap[groupId] = [];
      }
      
      // Add this exercise to its group
      groupMap[groupId].push(exerciseClone);
    } else {
      // Store as a single exercise
      singleExercises.push(exerciseClone);
    }
  });
  
  // Second pass - process groups and set up cross-references
  Object.keys(groupMap).forEach(groupId => {
    const exercisesInGroup = groupMap[groupId];
    
    // Update each exercise with information about its group
    exercisesInGroup.forEach((exercise, idx) => {
      if (!exercise.workoutConfig) {
        exercise.workoutConfig = {
          type: 'group',
          groupId: groupId,
          sets: []
        };
      } else {
        // Ensure type is set to 'group'
        exercise.workoutConfig.type = 'group';
      }
      
      // Store reference to all exercises in the same group
      exercise.workoutConfig.groupExercises = exercisesInGroup;
      
      // Set the position within the group (for isLastInSuperset calculation)
      exercise.workoutConfig.positionInGroup = idx;
      exercise.workoutConfig.isLastInGroup = idx === exercisesInGroup.length - 1;
    });
  });
  
  // Third pass - maintain original order for the output groups
  const processedExerciseIds = new Set<string>();
  
  exercises.forEach(exercise => {
    // Skip if we've already processed this exercise
    if (processedExerciseIds.has(exercise.id)) return;
    
    // Check both formats for group information
    const isGroupExercise = 
      (exercise.workoutConfig?.type === 'group' && exercise.workoutConfig?.groupId) || 
      (exercise.groupType === 'group' && exercise.groupId);
    
    // Get groupId from either source
    const groupId = exercise.workoutConfig?.groupId || exercise.groupId;
    
    // Handle single exercises
    if (!isGroupExercise) {
      const singleIndex = singleExercises.findIndex(e => e.id === exercise.id);
      if (singleIndex !== -1) {
        groups.push({
          type: 'single',
          exercises: [singleExercises[singleIndex]]
        });
        
        // Mark as processed
        processedExerciseIds.add(exercise.id);
        
        // Remove from singles so we don't add it twice
        singleExercises.splice(singleIndex, 1);
      }
    } 
    // Handle grouped exercises (supersets)
    else if (groupId && groupMap[groupId]) {
      // Only add each group once
      groups.push({
        type: 'superset',
        exercises: groupMap[groupId]
      });
      
      // Mark all exercises in this group as processed
      groupMap[groupId].forEach(ex => {
        processedExerciseIds.add(ex.id);
      });
      
      // Delete this group so we don't add it twice
      delete groupMap[groupId];
    }
  });
  
  // Add any remaining single exercises (should be rare, but just in case)
  singleExercises.forEach(exercise => {
    if (!processedExerciseIds.has(exercise.id)) {
      groups.push({
        type: 'single',
        exercises: [exercise]
      });
    }
  });
  
  return groups;
}