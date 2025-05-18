import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { ExerciseGroup, CompletedSetsMap } from '../types';
import ExerciseCard from './ExerciseCard';

interface SupersetGroupProps {
  group: ExerciseGroup;
  completedSetsMap: CompletedSetsMap;
  onCompleteSet: (exerciseId: string, actualReps?: number, actualRestTime?: number) => void;
  activeExerciseIndex: number;
}

const SupersetGroup: React.FC<SupersetGroupProps> = ({ 
  group, 
  completedSetsMap, 
  onCompleteSet,
  activeExerciseIndex
}) => {
  return (

      <View style={styles.activeExerciseContainer}>
        <ExerciseCard
          exercise={group.exercises[activeExerciseIndex]}
          index={activeExerciseIndex}
          isInSuperset={true}
          completedSetsMap={completedSetsMap}
          onCompleteSet={onCompleteSet }
          group={group} 

        />
      </View>

  );
};

const styles = StyleSheet.create({
  supersetContainer: {
    marginBottom: 24,
    borderWidth: 2,
    borderRadius: 16,
    borderColor: '#5D3FD3',
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },

  supersetBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#5D3FD3',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  supersetHeaderText: {
    color: '#5D3FD3',
    fontSize: 18,
    fontWeight: 'bold',
  },
  supersetCountBadge: {
    marginLeft: 'auto',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: 'rgba(93, 63, 211, 0.15)',
  },
  supersetCountText: {
    color: '#5D3FD3',
    fontWeight: '600',
    fontSize: 14,
  },
  exerciseProgressBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(93, 63, 211, 0.3)',
    marginHorizontal: 4,
  },
  activeProgressDot: {
    backgroundColor: '#5D3FD3',
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  activeExerciseContainer: {
    position: 'relative',
  }
});

export default SupersetGroup;