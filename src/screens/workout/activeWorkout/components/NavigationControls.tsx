import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { ExerciseGroup } from '../types';
import { WorkoutExercise } from '../../../../models/Exercise';

interface NavigationControlsProps {
  currentGroupIndex: number;
  exerciseGroups: ExerciseGroup[];
  onPrevious: () => void;
  onNext: () => void;
  onFinish: () => void;
  isFirstExercise?: boolean;
  isLastExercise?: boolean;
  inSuperset?: boolean;
  activeExerciseIndex?: number;
  completedSetsMap?: Record<string, number>;
}

const NavigationControls: React.FC<NavigationControlsProps> = ({
  currentGroupIndex,
  exerciseGroups,
  onPrevious,
  onNext,
  onFinish,
  isFirstExercise = false,
  isLastExercise = false,
  inSuperset = false,
  activeExerciseIndex = 0,
  completedSetsMap = {}
}) => {
  const currentGroup = exerciseGroups[currentGroupIndex];
  const nextGroup = exerciseGroups[currentGroupIndex + 1];
  
  // Get the next exercise to show in preview
  const getNextExercisePreview = (): { name: string, type: string } | null => {
    // Case 1: In a superset with more exercises
    if (inSuperset && currentGroup.type === 'superset') {
      const currentExercises = currentGroup.exercises;
      
      // If we have more exercises in the superset
      if (activeExerciseIndex < currentExercises.length - 1) {
        return {
          name: currentExercises[activeExerciseIndex + 1].name,
          type: 'superset-next'
        };
      }
      
      // Check if any exercise in the superset still has uncompleted sets
      const hasUncompletedSets = currentExercises.some(exercise => {
        const totalSets = exercise.workoutConfig?.sets?.length || exercise.sets || 0;
        const completedSets = completedSetsMap[exercise.id] || 0;
        return completedSets < totalSets;
      });
      
      // If we have uncompleted sets, loop back to the first exercise in the superset
      if (hasUncompletedSets) {
        return {
          name: currentExercises[0].name,
          type: 'superset-loop'
        };
      }
    }
    
    // Case 2: Moving to the next exercise group
    if (!isLastExercise && currentGroupIndex < exerciseGroups.length - 1) {
      if (nextGroup.type === 'superset') {
        return {
          name: `Superset: ${nextGroup.exercises.map(e => e.name).join(' + ')}`,
          type: 'next-group-superset'
        };
      } else {
        return {
          name: nextGroup.exercises[0]?.name,
          type: 'next-group-single'
        };
      }
    }
    
    return null;
  };
  
  const nextExerciseInfo = getNextExercisePreview();
  const showNextPreview = nextExerciseInfo !== null;

  return (
    <>
      <View style={styles.navigationButtons}>
        <TouchableOpacity 
          style={[styles.navButton, isFirstExercise ? styles.navButtonDisabled : null]}
          onPress={onPrevious}
          disabled={isFirstExercise}
        >
          <Icon 
            name="arrow-left" 
            size={24} 
            color={isFirstExercise ? "#aaa" : "#5D3FD3"} 
          />
          <Text 
            style={[
              styles.navButtonText, 
              isFirstExercise ? styles.navButtonTextDisabled : null
            ]}
          >
            Previous
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.navButton, isLastExercise ? styles.navButtonDisabled : null]}
          onPress={onNext}
          disabled={isLastExercise}
        >
          <Text style={[
            styles.navButtonText,
            isLastExercise ? styles.navButtonTextDisabled : null
          ]}>Next</Text>
          <Icon 
            name="arrow-right" 
            size={24} 
            color={isLastExercise ? "#aaa" : "#5D3FD3"} 
          />
        </TouchableOpacity>
      </View>

      {showNextPreview && (
        <View style={styles.nextExerciseContainer}>
          <Text style={styles.nextExerciseLabel}>
            NEXT
          </Text>
          <View style={styles.nextExerciseContent}>
            {nextExerciseInfo.type.includes('superset') && (
              <Icon name="lightning-bolt" size={16} color="#5D3FD3" style={styles.supersetIcon} />
            )}
            <Text style={styles.nextExerciseName}>
              {nextExerciseInfo.name}
            </Text>
          </View>
        </View>
      )}

      <TouchableOpacity 
        style={styles.finishWorkoutButton}
        onPress={onFinish}
      >
        <Text style={styles.finishWorkoutText}>Finish Workout</Text>
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 16,
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  navButtonDisabled: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  navButtonText: {
    fontSize: 16,
    color: '#5D3FD3',
    marginHorizontal: 4,
    fontWeight: '600',
  },
  navButtonTextDisabled: {
    color: '#aaa',
  },
  nextExerciseContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    padding: 16,
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  nextExerciseLabel: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
    letterSpacing: 1,
  },
  nextExerciseContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  supersetIcon: {
    marginRight: 6,
  },
  nextExerciseName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#5D3FD3',
  },
  finishWorkoutButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  finishWorkoutText: {
    fontSize: 16,
    color: '#5D3FD3',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default NavigationControls;