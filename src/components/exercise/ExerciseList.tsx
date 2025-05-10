import React from 'react';
import { View, FlatList } from 'react-native';
import ExerciseCard from './ExerciseCard';
import { Exercise } from '../../models/Exercise';

interface ExerciseListProps {
  exercises: Exercise[];
}

const ExerciseList: React.FC<ExerciseListProps> = ({ exercises }) => {
  const renderItem = ({ item }: { item: Exercise }) => (
    <ExerciseCard exercise={item} />
  );

  return (
    <View>
      <FlatList
        data={exercises}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

export default ExerciseList;