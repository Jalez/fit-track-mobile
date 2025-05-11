import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { ExerciseGroup, CompletedSetsMap } from '../types';
import ExerciseCard from './ExerciseCard';

const { width } = Dimensions.get('window');

interface SupersetGroupProps {
  group: ExerciseGroup;
  completedSetsMap: CompletedSetsMap;
  onCompleteSet: (exerciseId: string) => void;
}

const SupersetGroup: React.FC<SupersetGroupProps> = ({ 
  group, 
  completedSetsMap, 
  onCompleteSet
}) => {
  const [activeExerciseIndex, setActiveExerciseIndex] = useState(0);

  const handlePrevExercise = () => {
    if (activeExerciseIndex > 0) {
      setActiveExerciseIndex(activeExerciseIndex - 1);
    }
  };

  const handleNextExercise = () => {
    if (activeExerciseIndex < group.exercises.length - 1) {
      setActiveExerciseIndex(activeExerciseIndex + 1);
    }
  };

  return (
    <View style={styles.supersetContainer}>
      {/* Superset Header */}
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

      {/* Navigation Controls */}
      <View style={styles.navigationContainer}>
        <TouchableOpacity 
          style={[styles.navButton, activeExerciseIndex === 0 && styles.navButtonDisabled]}
          onPress={handlePrevExercise}
          disabled={activeExerciseIndex === 0}
        >
          <Icon name="chevron-left" size={28} color={activeExerciseIndex === 0 ? "#ccc" : "#5D3FD3"} />
        </TouchableOpacity>
        
        <View style={styles.navInfoContainer}>
          <Text style={styles.navInfoText}>
            Exercise {activeExerciseIndex + 1} of {group.exercises.length}
          </Text>
        </View>
        
        <TouchableOpacity 
          style={[styles.navButton, activeExerciseIndex === group.exercises.length - 1 && styles.navButtonDisabled]}
          onPress={handleNextExercise}
          disabled={activeExerciseIndex === group.exercises.length - 1}
        >
          <Icon name="chevron-right" size={28} color={activeExerciseIndex === group.exercises.length - 1 ? "#ccc" : "#5D3FD3"} />
        </TouchableOpacity>
      </View>

      {/* Visual Exercise Connector Bar */}
      <View style={styles.exerciseConnectorBar}>
        {group.exercises.map((exercise, index) => (
          <React.Fragment key={`connector-${exercise.id}`}>
            <TouchableOpacity 
              style={[styles.exerciseIndicator, index === activeExerciseIndex && styles.activeExerciseIndicator]}
              onPress={() => setActiveExerciseIndex(index)}
            >
              <Text style={[styles.exerciseIndicatorText, index === activeExerciseIndex && styles.activeExerciseIndicatorText]}>
                {index + 1}
              </Text>
            </TouchableOpacity>
            
            {index < group.exercises.length - 1 && (
              <View style={styles.connectorLine} />
            )}
          </React.Fragment>
        ))}
      </View>

      {/* Active Exercise Card */}
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

      {/* Pagination dots */}
      <View style={styles.paginationDotsContainer}>
        {group.exercises.map((_, index) => (
          <TouchableOpacity 
            key={index}
            style={[
              styles.paginationDot,
              index === activeExerciseIndex && styles.activePaginationDot
            ]}
            onPress={() => setActiveExerciseIndex(index)}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  supersetContainer: {
    marginBottom: 24,
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
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  navButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  navButtonDisabled: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  navInfoContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  navInfoText: {
    color: '#5D3FD3',
    fontWeight: '600',
    fontSize: 14,
  },
  exerciseConnectorBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  exerciseIndicator: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  activeExerciseIndicator: {
    backgroundColor: '#5D3FD3',
    width: 40,
    height: 40,
    borderRadius: 20,
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  exerciseIndicatorText: {
    fontSize: 16,
    color: '#666',
    fontWeight: 'bold',
  },
  activeExerciseIndicatorText: {
    color: '#fff',
    fontSize: 18,
  },
  connectorLine: {
    height: 2,
    flex: 1,
    backgroundColor: 'rgba(93, 63, 211, 0.3)',
    marginHorizontal: 5,
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
  },
  paginationDotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(93, 63, 211, 0.3)',
    marginHorizontal: 4,
  },
  activePaginationDot: {
    backgroundColor: '#5D3FD3',
    width: 12,
    height: 12,
    borderRadius: 6,
  },
});

export default SupersetGroup;