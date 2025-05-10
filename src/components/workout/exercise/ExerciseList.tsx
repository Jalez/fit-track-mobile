import React from 'react';
import { View, StyleSheet } from 'react-native';
import DraggableFlatList from 'react-native-draggable-flatlist';
import { WorkoutExercise } from '../../../models/Exercise';
import ExerciseItem from './ExerciseItem';
import EmptyStateView from './EmptyStateView';

interface ExerciseListProps {
  exercises: WorkoutExercise[];
  selectedIds: string[];
  multiSelectMode: boolean;
  onDragEnd: ({ data }: { data: WorkoutExercise[] }) => void;
  onExercisePress: (exercise: WorkoutExercise) => void;
  onRemoveExercise: (exerciseId: string) => void;
}

const ExerciseList: React.FC<ExerciseListProps> = ({
  exercises,
  selectedIds,
  multiSelectMode,
  onDragEnd,
  onExercisePress,
  onRemoveExercise,
}) => {
  // Render exercise list item
  const renderExerciseItem = ({ item, drag, isActive }: { 
    item: WorkoutExercise,
    drag: () => void,
    isActive: boolean
  }) => {
    const isSelected = selectedIds.includes(item.id);
    
    return (
      <ExerciseItem
        item={item}
        drag={drag}
        isActive={isActive}
        isSelected={isSelected}
        multiSelectMode={multiSelectMode}
        onPress={onExercisePress}
        onRemove={onRemoveExercise}
      />
    );
  };

  if (exercises.length === 0) {
    return <EmptyStateView />;
  }

  return (
    <DraggableFlatList
      data={exercises}
      onDragEnd={onDragEnd}
      keyExtractor={item => item.id}
      renderItem={renderExerciseItem}
      contentContainerStyle={styles.listContainer}
      showsVerticalScrollIndicator={false}
      activationDistance={10}
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {
    paddingBottom: 16,
  },
});

export default ExerciseList;