import React, { useMemo } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Platform } from 'react-native';
import DraggableFlatList from 'react-native-draggable-flatlist';
import { WorkoutExercise } from '../../../models/Exercise';
import ExerciseItem from './ExerciseItem';
import EmptyStateView from './EmptyStateView';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface ExerciseListProps {
  exercises: WorkoutExercise[];
  selectedIds: string[];
  multiSelectMode: boolean;
  onDragEnd: ({ data }: { data: WorkoutExercise[] }) => void;
  onExercisePress: (exercise: WorkoutExercise) => void;
  onRemoveExercise: (exerciseId: string) => void;
  onAddExercisePress: () => void;
}

const ExerciseList: React.FC<ExerciseListProps> = ({
  exercises,
  selectedIds,
  multiSelectMode,
  onDragEnd,
  onExercisePress,
  onRemoveExercise,
  onAddExercisePress
}) => {
  // Process exercises into items that can be either:
  // 1. A single exercise 
  // 2. A group of exercises (superset/triset/circuit)
  const listItems = useMemo(() => {
    // Create a map to track groups
    const groups: Record<string, WorkoutExercise[]> = {};
    const singles: WorkoutExercise[] = [];

    // First pass: categorize exercises by their group
    exercises.forEach(exercise => {
      const { type, groupId } = exercise.workoutConfig;
      if (type !== 'single' && groupId) {
        if (!groups[groupId]) {
          groups[groupId] = [];
        }
        groups[groupId].push(exercise);
      } else {
        singles.push(exercise);
      }
    });

    // Second pass: create list items
    const result: Array<WorkoutExercise | {
      id: string;
      type: 'group';
      groupType: string; // 'super', 'tri', or 'circuit'
      exercises: WorkoutExercise[];
    }> = [];

    // Add single exercises
    singles.forEach(exercise => {
      result.push(exercise);
    });

    // Add group items
    Object.entries(groups).forEach(([groupId, groupExercises]) => {
      // Sort the exercises if needed
      // For now, we'll keep them in their original order
      result.push({
        id: groupId,
        type: 'group',
        groupType: groupExercises[0]?.workoutConfig.type || 'super',
        exercises: groupExercises
      });
    });

    return result;
  }, [exercises]);

  // Renders an individual exercise
  const renderExercise = (
    exercise: WorkoutExercise, 
    inGroup: boolean = false,
    sequenceNumber?: number
  ) => {
    const isSelected = selectedIds.includes(exercise.id);
    
    return (
      <ExerciseItem
        key={exercise.id}
        item={exercise}
        drag={() => {}} // When in a group, individual drag is disabled
        isActive={false}
        isSelected={isSelected}
        multiSelectMode={multiSelectMode}
        onPress={onExercisePress}
        onRemove={onRemoveExercise}
        inGroup={inGroup}
        sequence={sequenceNumber}
      />
    );
  };

  // Renders a group of exercises (superset/triset/circuit)
  const renderGroup = (
    group: {
      id: string;
      groupType: string;
      exercises: WorkoutExercise[];
    }
  ) => {
    const { groupType, exercises } = group;
    
    // Determine the color and title based on group type
    let color: string;
    let title: string;
    let icon: string;
    
    switch(groupType) {
      case 'tri':
        color = '#FF9500';
        title = 'Triset';
        icon = 'triangle-outline';
        break;
      case 'circuit':
        color = '#34C759';
        title = 'Circuit';
        icon = 'sync';
        break;
      case 'super':
      default:
        color = '#5D3FD3';
        title = 'Superset';
        icon = 'lightning-bolt';
        break;
    }
    
    return (
      <View style={[styles.groupContainerOuterWrapper]}>
        {/* Title bar outside of main container for visual emphasis */}
        <View style={[styles.groupTitleBar, { backgroundColor: color }]}>
          <Icon name={icon} size={18} color="#fff" />
          <Text style={styles.groupTitleText}>{title}</Text>
        </View>
      
        {/* Main container with exercises */}
        <View style={[styles.groupContainer, { borderColor: color }]}>
          <View style={styles.groupContent}>
            {exercises.map((exercise, index) => (
              <View key={exercise.id} style={styles.groupExerciseContainer}>
                {index > 0 && (
                  <View style={[styles.exerciseDivider, { backgroundColor: color }]} />
                )}
                <View style={styles.exerciseNumberWrapper}>
                  <View style={[styles.exerciseNumber, { backgroundColor: color }]}>
                    <Text style={styles.exerciseNumberText}>{index + 1}</Text>
                  </View>
                  {renderExercise(exercise, true, index + 1)}
                </View>
              </View>
            ))}
          </View>
        </View>
      </View>
    );
  };

  // Custom render function for draggable flat list
  const renderItem = ({ item, drag, isActive }: {
    item: any;
    drag: () => void;
    isActive: boolean;
  }) => {
    if (item.type === 'group') {
      // For group items
      return (
        <TouchableOpacity 
          activeOpacity={0.9}
          onLongPress={drag}
          disabled={isActive || multiSelectMode}
          style={[
            styles.dragWrapper,
            isActive && styles.draggingItem
          ]}
        >
          {renderGroup(item)}
        </TouchableOpacity>
      );
    } else {
      // For single exercise items
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
    }
  };

  const renderAddExercisePlaceholder = () => (
    <TouchableOpacity
      style={styles.addExercisePlaceholder}
      onPress={onAddExercisePress}
    >
      <Icon name="plus-circle-outline" size={24} color="#5D3FD3" />
      <Text style={styles.addExerciseText}>Add Exercise</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {renderAddExercisePlaceholder()}
      
      {exercises.length === 0 ? (
        <EmptyStateView />
      ) : (
        <DraggableFlatList
          data={listItems}
          onDragEnd={({ data }) => {
            // Convert the grouped data back to a flat list of exercises
            const flattenedData: WorkoutExercise[] = [];
            data.forEach(item => {
           
                flattenedData.push(item as WorkoutExercise);
              
            });
            onDragEnd({ data: flattenedData });
          }}
          keyExtractor={item => {
            if ('type' in item && item.type === 'group') {
              return `group-${item.id}`;
            }
            return (item as WorkoutExercise).id;
          }}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          activationDistance={10}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContainer: {
    paddingBottom: 16,
  },
  addExercisePlaceholder: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(93, 63, 211, 0.1)',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#5D3FD3',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  addExerciseText: {
    color: '#5D3FD3',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  dragWrapper: {
    marginBottom: 12,
  },
  draggingItem: {
    opacity: 0.9,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 8,
  },
  groupContainerOuterWrapper: {
    marginBottom: 20,
  },
  groupTitleBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    marginBottom: -1, // Overlap with container for seamless look
    zIndex: 10,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  groupTitleText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  groupContainer: {
    borderWidth: 4,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#fff',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  groupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  groupHeaderText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  groupContent: {
    padding: 16,
    backgroundColor: 'rgba(245, 245, 250, 0.8)',
  },
  groupExerciseContainer: {
    position: 'relative',
    marginBottom: 8,
  },
  exerciseDivider: {
    height: 2,
    marginVertical: 10,
  },
  exerciseNumberWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  exerciseNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  exerciseNumberText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default ExerciseList;