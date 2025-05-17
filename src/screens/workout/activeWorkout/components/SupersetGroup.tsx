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
    <View style={styles.supersetContainer}>
      {/* Superset Header - simplified with just a border indicator */}
      <View style={styles.supersetHeaderContainer}>
        <View style={styles.supersetBadge}>
          <Icon name="lightning-bolt" size={20} color="#fff" />
        </View>
        <Text style={styles.supersetHeaderText}>SUPERSET</Text>
        <View style={styles.supersetCountBadge}>
          <Text style={styles.supersetCountText}>
            {group.exercises.length} Exercises
          </Text>
        </View>
      </View>

      {/* Exercise progress indicator - simplified */}
      <View style={styles.exerciseProgressBar}>
        {group.exercises.map((_, index) => (
          <View 
            key={index}
            style={[
              styles.progressDot,
              index === activeExerciseIndex && styles.activeProgressDot
            ]}
          />
        ))}
      </View>

      {/* Current Exercise Card */}
      <View style={styles.activeExerciseContainer}>
        <ExerciseCard
          exercise={group.exercises[activeExerciseIndex]}
          index={activeExerciseIndex}
          isInSuperset={true}
          completedSetsMap={completedSetsMap}
          onCompleteSet={onCompleteSet}
        />

        {/* Next Exercise Preview (if available) */}
        {activeExerciseIndex < group.exercises.length - 1 && (
          <View style={styles.nextExercisePreview}>
            <Text style={styles.nextExerciseLabel}>NEXT IN SUPERSET</Text>
            <View style={styles.nextExerciseInfo}>
              <Icon 
                name={group.exercises[activeExerciseIndex + 1].type === 'cardio' ? 'run' : 'dumbbell'} 
                size={18} 
                color="#5D3FD3" 
              />
              <Text style={styles.nextExerciseName}>{group.exercises[activeExerciseIndex + 1].name}</Text>
            </View>
          </View>
        )}
      </View>
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
  supersetHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(93, 63, 211, 0.1)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
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
  },
  nextExercisePreview: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderRadius: 12,
    padding: 12,
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  nextExerciseLabel: {
    fontSize: 10,
    color: '#666',
    fontWeight: '600',
    marginBottom: 4,
  },
  nextExerciseInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nextExerciseName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 8,
  }
});

export default SupersetGroup;