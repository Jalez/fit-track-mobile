import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ExerciseGroup } from '../types';

interface RestTimerProps {
  restTime: number;
  nextGroup: ExerciseGroup | undefined;
  onSkipRest: () => void;
}

const RestTimer: React.FC<RestTimerProps> = ({ 
  restTime, 
  nextGroup,
  onSkipRest 
}) => {
  return (
    <View style={styles.restContainer}>
      <Text style={styles.restTitle}>Rest Time</Text>
      <Text style={styles.restTimer}>{restTime}</Text>
      <Text style={styles.restNextExercise}>
        Next: {nextGroup ? 
          (nextGroup.type === 'superset' ? `Superset with ${nextGroup.exercises.length} exercises` : nextGroup.exercises[0]?.name) 
          : 'Finish Workout'}
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