import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { ScaleDecorator } from 'react-native-draggable-flatlist';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { WorkoutExercise } from '../../../models/Exercise';

interface ExerciseItemProps {
  item: WorkoutExercise;
  drag: () => void;
  isActive: boolean;
  isSelected: boolean;
  multiSelectMode: boolean;
  onPress: (exercise: WorkoutExercise) => void;
  onRemove: (exerciseId: string) => void;
  inGroup?: boolean;
  sequence?: number;
}

const ExerciseItem: React.FC<ExerciseItemProps> = ({
  item,
  drag,
  isActive,
  isSelected,
  multiSelectMode,
  onPress,
  onRemove,
  inGroup = false,
  sequence,
}) => {
  const measurementText = getMeasurementTypeText(item);

  return (
    <ScaleDecorator>
      <TouchableOpacity
        activeOpacity={0.7}
        onLongPress={multiSelectMode || inGroup ? undefined : drag}
        onPress={() => onPress(item)}
        disabled={isActive}
        style={[
          styles.exerciseItem,
          isActive && styles.draggingItem,
          isSelected && styles.selectedItem,
          // Keep most styling the same for group items with just minor adjustments
          inGroup && styles.groupedExerciseItem,
        ]}
      >
        {/* Sequence number for exercises in a group */}
        {inGroup && sequence !== undefined && (
          <View style={styles.sequenceBadge}>
            <Text style={styles.sequenceText}>{sequence}</Text>
          </View>
        )}
        
        <View style={styles.exerciseContent}>
          <View style={styles.exerciseHeader}>
            <Text style={styles.exerciseName}>{item.name}</Text>
            {!multiSelectMode && (
              <TouchableOpacity 
                style={styles.deleteButton}
                onPress={() => onRemove(item.id)}
              >
                <Icon name="close-circle" size={22} color="#ff6b6b" />
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.exerciseDetails}>
            {renderExerciseConfig(item)}
            {measurementText ? (
              <Text style={styles.measurementText}>{measurementText}</Text>
            ) : null}
          </View>
        </View>
        
        {multiSelectMode ? (
          <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
            {isSelected && <Icon name="check" size={16} color="#fff" />}
          </View>
        ) : (
          // Always show chevron regardless of whether it's in a group
          <Icon name="chevron-right" size={24} color="#666" />
        )}
      </TouchableOpacity>
    </ScaleDecorator>
  );
};

// Helper functions
const renderExerciseConfig = (exercise: WorkoutExercise) => {
  const config = exercise.workoutConfig;
  const setCount = config.sets.length;
  
  return (
    <View style={styles.configBadges}>
      <View style={styles.badge}>
        <Text style={styles.badgeText}>{setCount} sets</Text>
      </View>
    </View>
  );
};

const getMeasurementTypeText = (exercise: WorkoutExercise) => {
  const firstSet = exercise.workoutConfig.sets[0];
  if (!firstSet) return '';

  if (firstSet.reps) return `${firstSet.reps} reps`;
  if (firstSet.time) return `${firstSet.time} sec`;
  if (firstSet.distance) return `${firstSet.distance} km`;
  return '';
};

const styles = StyleSheet.create({
  exerciseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    width:"90%",
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  draggingItem: {
    opacity: 0.9,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 8,
  },
  selectedItem: {
    backgroundColor: '#f0eaff',
    borderColor: '#5D3FD3',
    borderWidth: 1,
  },
  groupedExerciseItem: {
    // Maintain most of the original styling except marginBottom
    marginBottom: 0,
    // Keep shadow, background, etc. the same as normal items
  },
  sequenceBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(93, 63, 211, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  sequenceText: {
    color: '#5D3FD3',
    fontSize: 14,
    fontWeight: 'bold',
  },
  exerciseContent: {
    flex: 1,
  },
  exerciseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
    flex: 1,
  },
  deleteButton: {
    padding: 4,
  },
  exerciseDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  configBadges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4,
    flex: 1,
  },
  badge: {
    backgroundColor: '#5D3FD3',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 4,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  measurementText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 'auto',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#5D3FD3',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxSelected: {
    backgroundColor: '#5D3FD3',
  },
});

export default ExerciseItem;