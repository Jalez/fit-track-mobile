import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { formatTime } from '../utils';

interface WorkoutCompletedProps {
  elapsedTime: number;
  exercisesCount: number;
  onFinishWorkout: () => void;
}

const WorkoutCompleted: React.FC<WorkoutCompletedProps> = ({
  elapsedTime,
  exercisesCount,
  onFinishWorkout
}) => {
  return (
    <View style={styles.completedContainer}>
      <Icon name="trophy" size={80} color="gold" />
      <Text style={styles.completedTitle}>Workout Complete!</Text>
      <View style={styles.statsCard}>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Total Time</Text>
          <Text style={styles.statValue}>{formatTime(elapsedTime)}</Text>
        </View>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Exercises</Text>
          <Text style={styles.statValue}>{exercisesCount}</Text>
        </View>
      </View>
      <TouchableOpacity 
        style={styles.finishButton} 
        onPress={onFinishWorkout}
      >
        <Text style={styles.finishButtonText}>Back to Workouts</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  completedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  completedTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 16,
    marginBottom: 32,
  },
  statsCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  statLabel: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
  },
  statValue: {
    fontSize: 16,
    color: '#5D3FD3',
    fontWeight: 'bold',
  },
  finishButton: {
    backgroundColor: '#5D3FD3',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  finishButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default WorkoutCompleted;