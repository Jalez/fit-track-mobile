import React from 'react';
import { View, Text, TextInput } from 'react-native';
import { WorkoutExercise } from '../../../../../models/Exercise';
import { styles } from './ExerciseCardStyles';

interface ExerciseDetailsProps {
  exercise: WorkoutExercise;
  isInSuperset: boolean;
  isLastInSuperset: boolean;
  completedSets: number;
  totalSets: number;
  reps: string;
  restTime: string;
  isEditing: boolean;
  setReps: (value: string) => void;
  setRestTime: (value: string) => void;
}

export const ExerciseDetails: React.FC<ExerciseDetailsProps> = ({
  exercise,
  isInSuperset,
  isLastInSuperset,
  completedSets,
  totalSets,
  reps,
  restTime,
  isEditing,
  setReps,
  setRestTime
}) => {
  return (
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
          {isEditing ? (
            <TextInput
              value={reps}
              onChangeText={setReps}
              keyboardType="number-pad"
              style={styles.editInput}
              selectTextOnFocus={true}
            />
          ) : (
            <Text style={styles.detailValue}>
              {reps}
            </Text>
          )}
          <Text style={styles.detailLabel}>REPS</Text>
        </View>
        <View style={styles.detailSeparator} />
        <View style={styles.detailItem}>
          {isEditing ? (
            <TextInput
              value={restTime}
              onChangeText={setRestTime}
              keyboardType="number-pad"
              style={styles.editInput}
              selectTextOnFocus={true}
            />
          ) : (
            <Text style={styles.detailValue}>
              {restTime}s
            </Text>
          )}
          <Text style={styles.detailLabel}>
            {isInSuperset && !isLastInSuperset ? 'TRANSITION' : 'REST'}
          </Text>
        </View>
      </View>
    </View>
  );
};