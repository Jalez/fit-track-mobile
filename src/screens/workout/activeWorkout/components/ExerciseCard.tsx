import React, { useState } from 'react';
import { View } from 'react-native';
import { WorkoutExercise } from '../../../../models/Exercise';
import { CompletedSetsMap, ExerciseGroup } from '../types';
import { styles } from './exercise-card/ExerciseCardStyles';
import { 
  ActionButtons, 
  ExerciseDetails, 
  ExerciseHeader, 
  SupersetLabel 
} from './exercise-card';

interface ExerciseCardProps {
  exercise: WorkoutExercise;
  index: number;
  isInSuperset?: boolean;
  completedSetsMap: CompletedSetsMap;
  onCompleteSet: (exerciseId: string, actualReps?: number, actualRestTime?: number) => void;
  group?: ExerciseGroup;
}

const ExerciseCard: React.FC<ExerciseCardProps> = ({
  exercise,
  index,
  isInSuperset = false,
  completedSetsMap,
  onCompleteSet,
  group
}) => {
  // Get total sets either from workoutConfig.sets or from exercise.sets
  const totalSets = exercise.workoutConfig?.sets?.length || exercise.sets || 0;
  const completedSets = completedSetsMap[exercise.id] || 0;
  const allSetsCompleted = completedSets >= totalSets;

  // Get reps either from workoutConfig sets or from exercise.reps
  const defaultReps = exercise.workoutConfig?.sets?.[0]?.reps || exercise.reps || 0;
  // Get rest time either from workoutConfig sets or from exercise.restTime
  const defaultRestTime = exercise.workoutConfig?.sets?.[0]?.restTime || exercise.restTime || 60;

  // State for editing reps and rest time
  const [reps, setReps] = useState(defaultReps.toString());
  const [restTime, setRestTime] = useState(defaultRestTime.toString());
  const [isEditing, setIsEditing] = useState(false);

  // Determine if this is the last exercise in a superset
  const isLastInSuperset = !isInSuperset || Boolean(exercise.workoutConfig?.isLastInGroup);

  const handleCompleteSet = () => {
    // Convert inputs to numbers
    const actualReps = parseInt(reps, 10) || defaultReps;
    const actualRestTime = parseInt(restTime, 10) || defaultRestTime;

    // Call the parent handler with the actual values
    onCompleteSet(exercise.id, actualReps, actualRestTime);

    // Reset editing state
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setReps(defaultReps.toString());
    setRestTime(defaultRestTime.toString());
    setIsEditing(false);
  };

  return (
    <View
      style={[
        styles.exerciseCard,
        isInSuperset && styles.supersetExerciseCard,
        allSetsCompleted && styles.completedExerciseCard
      ]}>
      
      {isInSuperset && <SupersetLabel group={group} index={index} />}

      <ExerciseHeader 
        exercise={exercise} 
        isInSuperset={isInSuperset} 
        index={index} 
      />

      <ExerciseDetails
        exercise={exercise}
        isInSuperset={isInSuperset}
        isLastInSuperset={!!isLastInSuperset}
        completedSets={completedSets}
        totalSets={totalSets}
        reps={reps}
        restTime={restTime}
        isEditing={isEditing}
        setReps={setReps}
        setRestTime={setRestTime}
      />

      <ActionButtons
        allSetsCompleted={allSetsCompleted}
        isEditing={isEditing}
        onEdit={() => setIsEditing(true)}
        onCancel={handleCancelEdit}
        onComplete={handleCompleteSet}
      />
    </View>
  );
};

export default ExerciseCard;