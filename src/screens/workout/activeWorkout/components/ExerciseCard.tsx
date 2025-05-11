import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { WorkoutExercise } from '../../../../models/Exercise';
import { getExerciseIcon } from '../utils';
import { CompletedSetsMap } from '../types';

interface ExerciseCardProps {
  exercise: WorkoutExercise;
  index: number;
  isInSuperset?: boolean;
  completedSetsMap: CompletedSetsMap;
  onCompleteSet: (exerciseId: string) => void;
}

const ExerciseCard: React.FC<ExerciseCardProps> = ({
  exercise,
  index,
  isInSuperset = false,
  completedSetsMap,
  onCompleteSet
}) => {
  // Get total sets either from workoutConfig.sets or from exercise.sets
  const totalSets = exercise.workoutConfig?.sets?.length || exercise.sets || 0;
  const completedSets = completedSetsMap[exercise.id] || 0;
  const allSetsCompleted = completedSets >= totalSets;

  // Get reps either from workoutConfig sets or from exercise.reps
  const reps = exercise.workoutConfig?.sets?.[0]?.reps || exercise.reps || 0;
  // Get rest time either from workoutConfig sets or from exercise.restTime
  const restTime = exercise.workoutConfig?.sets?.[0]?.restTime || exercise.restTime || 60;

  // Determine if this is the last exercise in a superset
  // We'll show "TRANSITION" for exercises in the middle of a superset
  // and "REST" for the last exercise in a superset or single exercises
  const isLastInSuperset = !isInSuperset || exercise.workoutConfig?.isLastInGroup;

  return (
    <View
      style={[
        styles.exerciseCard, 
        isInSuperset && styles.supersetExerciseCard,
        allSetsCompleted && styles.completedExerciseCard
      ]}>
      {isInSuperset && (
        <View style={styles.supersetLabelContainer}>
          <Icon name="lightning-bolt" size={12} color="#fff" />
          <Text style={styles.supersetLabel}>SUPERSET</Text>
        </View>
      )}
      
      <View style={styles.cardHeader}>
        <View style={[
          styles.exerciseIconContainer,
          isInSuperset && styles.supersetExerciseIconContainer
        ]}>
          <Icon 
            name={getExerciseIcon(exercise.type)} 
            size={isInSuperset ? 24 : 32} 
            color="#5D3FD3" 
          />
        </View>

        <View style={styles.exerciseInfoContainer}>
          <Text style={[
            styles.exerciseName,
            isInSuperset && styles.supersetExerciseName
          ]}>
            {exercise.name}
          </Text>
          
          {isInSuperset && (
            <View style={styles.supersetNumberBadge}>
              <Text style={styles.supersetNumberText}>{index + 1}</Text>
            </View>
          )}
        </View>
      </View>
      
      <View style={styles.detailsCard}>
        <View style={styles.detailRow}>
          <View style={styles.detailItem}>
            <Text style={styles.detailValue}>
              {completedSets}/{totalSets}
            </Text>
            <Text style={styles.detailLabel}>SET PROGRESS</Text>
          </View>
          <View style={styles.detailSeparator} />
          <View style={styles.detailItem}>
            <Text style={styles.detailValue}>
              {reps}
            </Text>
            <Text style={styles.detailLabel}>REPS</Text>
          </View>
          <View style={styles.detailSeparator} />
          <View style={styles.detailItem}>
            <Text style={styles.detailValue}>
              {restTime}s
            </Text>
            <Text style={styles.detailLabel}>
              {isInSuperset && !isLastInSuperset ? 'TRANSITION' : 'REST'}
            </Text>
          </View>
        </View>
      </View>

      <TouchableOpacity 
        style={[
          styles.completeButton,
          allSetsCompleted && styles.completeButtonDisabled
        ]}
        onPress={() => onCompleteSet(exercise.id)}
        disabled={allSetsCompleted}
      >
        <Text style={styles.completeButtonText}>
          {allSetsCompleted 
            ? 'All Sets Completed' 
            : 'Complete Set'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  exerciseCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    position: 'relative',
  },
  supersetExerciseCard: {
    borderWidth: 2,
    borderColor: '#5D3FD3',
  },
  completedExerciseCard: {
    borderColor: '#4CAF50',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  supersetLabelContainer: {
    position: 'absolute',
    top: -10,
    right: 16,
    backgroundColor: '#5D3FD3',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
    zIndex: 1,
  },
  supersetLabel: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 10,
    marginLeft: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  exerciseIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(93, 63, 211, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  supersetExerciseIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  exerciseInfoContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  exerciseName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  supersetExerciseName: {
    fontSize: 18,
  },
  supersetNumberBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#5D3FD3',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  supersetNumberText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  detailsCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  detailItem: {
    alignItems: 'center',
    flex: 1,
  },
  detailValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#5D3FD3',
  },
  detailLabel: {
    fontSize: 10,
    color: '#666',
    marginTop: 4,
    fontWeight: '600',
  },
  detailSeparator: {
    width: 1,
    height: '100%',
    backgroundColor: '#ddd',
  },
  completeButton: {
    backgroundColor: '#5D3FD3',
    paddingVertical: 12,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  completeButtonText: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  completeButtonDisabled: {
    backgroundColor: '#4CAF50',
  },
});

export default ExerciseCard;