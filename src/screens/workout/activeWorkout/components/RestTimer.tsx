import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ExerciseGroup, CompletedSetsMap } from '../types';
import { formatTime } from '../utils';
import { WorkoutExercise } from '../../../../models/Exercise';

interface RestTimerProps {
  restTime: number;
  nextGroup: ExerciseGroup | undefined;
  onSkipRest: () => void;
  currentGroup: ExerciseGroup;
  completedSetsMap: CompletedSetsMap;
}

const RestTimer: React.FC<RestTimerProps> = ({ 
  restTime, 
  nextGroup,
  onSkipRest,
  currentGroup,
  completedSetsMap
}) => {
  // Determine what comes next after the rest period
  const getNextExerciseText = (): string => {
    // Check if all exercises in the current group have all sets completed
    const allSetsInGroupCompleted = currentGroup.exercises.every(ex => {
      const totalSets = ex.workoutConfig?.sets?.length || ex.sets || 0;
      const completedSets = completedSetsMap[ex.id] || 0;
      return completedSets >= totalSets;
    });

    if (allSetsInGroupCompleted) {
      // If moving to the next group
      if (nextGroup) {
        if (nextGroup.type === 'superset') {
          return `Next Group: Superset with ${nextGroup.exercises.length} exercises`;
        } else {
          return `Next Group: ${nextGroup.exercises[0]?.name}`;
        }
      } else {
        return 'Finish Workout'; // No next group means we're at the end
      }
    } else {
      // Still have sets in the current group
      const isSuperset = currentGroup.type === 'superset';
      
      if (isSuperset) {
        // Find the first exercise that still has sets to complete
        const nextExercise = currentGroup.exercises.find(ex => {
          const totalSets = ex.workoutConfig?.sets?.length || ex.sets || 0;
          const completedSets = completedSetsMap[ex.id] || 0;
          return completedSets < totalSets;
        });
        
        if (nextExercise) {
          // Show which set number is coming up
          const completedSets = completedSetsMap[nextExercise.id] || 0;
          const totalSets = nextExercise.workoutConfig?.sets?.length || nextExercise.sets || 0;
          return `Continue: ${nextExercise.name} (Set ${completedSets + 1}/${totalSets})`;
        }
      } else {
        // For single exercises, show the next set number
        const exercise = currentGroup.exercises[0];
        const completedSets = completedSetsMap[exercise.id] || 0;
        const totalSets = exercise.workoutConfig?.sets?.length || exercise.sets || 0;
        return `Continue: ${exercise.name} (Set ${completedSets + 1}/${totalSets})`;
      }
    }
    
    return 'Next Exercise'; // Fallback
  };

  return (
    <View style={styles.restContainer}>
      <Text style={styles.restTitle}>Rest Time</Text>
      <Text style={styles.restTimer}>{formatTime(restTime)}</Text>
      <Text style={styles.restNextExercise}>
        {getNextExerciseText()}
      </Text>
      <TouchableOpacity 
        style={styles.skipButton}
        onPress={onSkipRest}
      >
        <Text style={styles.skipButtonText}>Skip Rest</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  restContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  restTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
    textAlign: 'center',
  },
  restTimer: {
    fontSize: 64,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 32,
  },
  restNextExercise: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 48,
    textAlign: 'center',
    opacity: 0.8,
  },
  skipButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#fff',
  },
  skipButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default RestTimer;