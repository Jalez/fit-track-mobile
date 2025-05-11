import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { ExerciseGroup } from '../types';

interface NavigationControlsProps {
  currentGroupIndex: number;
  exerciseGroups: ExerciseGroup[];
  onPrevious: () => void;
  onNext: () => void;
  onFinish: () => void;
}

const NavigationControls: React.FC<NavigationControlsProps> = ({
  currentGroupIndex,
  exerciseGroups,
  onPrevious,
  onNext,
  onFinish
}) => {
  const nextGroup = exerciseGroups[currentGroupIndex + 1];

  return (
    <>
      {/* Navigation buttons for exercise groups */}
      <View style={styles.navigationButtons}>
        <TouchableOpacity 
          style={[styles.navButton, currentGroupIndex === 0 ? styles.navButtonDisabled : null]}
          onPress={onPrevious}
          disabled={currentGroupIndex === 0}
        >
          <Icon 
            name="arrow-left" 
            size={24} 
            color={currentGroupIndex === 0 ? "#aaa" : "#5D3FD3"} 
          />
          <Text 
            style={[
              styles.navButtonText, 
              currentGroupIndex === 0 ? styles.navButtonTextDisabled : null
            ]}
          >
            Previous
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.navButton}
          onPress={onNext}
        >
          <Text style={styles.navButtonText}>Next</Text>
          <Icon name="arrow-right" size={24} color="#5D3FD3" />
        </TouchableOpacity>
      </View>

      {/* Next exercise preview */}
      {currentGroupIndex < exerciseGroups.length - 1 && (
        <View style={styles.nextExerciseContainer}>
          <Text style={styles.nextExerciseLabel}>NEXT UP</Text>
          <Text style={styles.nextExerciseName}>
            {nextGroup.type === 'superset' 
              ? `Superset: ${nextGroup.exercises.map(e => e.name).join(' + ')}` 
              : nextGroup.exercises[0]?.name}
          </Text>
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
  nextExerciseName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#5D3FD3',
    marginTop: 4,
  },
  finishWorkoutButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    paddingVertical: 14,
    borderRadius: 30,
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