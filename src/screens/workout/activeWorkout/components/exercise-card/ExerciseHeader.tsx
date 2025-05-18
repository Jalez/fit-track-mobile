import React from 'react';
import { View, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { WorkoutExercise } from '../../../../../models/Exercise';
import { styles } from './ExerciseCardStyles';
import { getExerciseIcon } from '../../utils';

interface ExerciseHeaderProps {
  exercise: WorkoutExercise;
  isInSuperset: boolean;
  index: number;
}

export const ExerciseHeader: React.FC<ExerciseHeaderProps> = ({ 
  exercise, 
  isInSuperset, 
  index 
}) => {
  return (
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
  );
};