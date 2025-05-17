import React from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

import BackgroundContainer from '../../../components/common/BackgroundContainer';
import ExerciseCard from './components/ExerciseCard';
import SupersetGroup from './components/SupersetGroup';
import RestTimer from './components/RestTimer';
import WorkoutCompleted from './components/WorkoutCompleted';
import WorkoutHeader from './components/WorkoutHeader';
import NavigationControls from './components/NavigationControls';

import { useActiveWorkout } from './hooks/useActiveWorkout';
import { ActiveWorkoutRouteProp, ActiveWorkoutNavigationProp } from './types';

const ActiveWorkoutScreen: React.FC = () => {
  const route = useRoute<ActiveWorkoutRouteProp>();
  const navigation = useNavigation<ActiveWorkoutNavigationProp>();
  const { workoutId } = route.params;
  
  const {
    workout,
    loading,
    exerciseGroups,
    currentGroupIndex,
    completedSetsMap,
    isResting,
    restTime,
    elapsedTime,
    workoutComplete,
    handleCompleteSet,
    skipRest,
    handlePreviousExerciseGroup,
    handleNextExerciseGroup,
    finishWorkout,
    // New state and handlers for superset navigation
    supersetExerciseIndex,
    handlePreviousSupersetExercise,
    handleNextSupersetExercise,
    updateSupersetExerciseIndex
  } = useActiveWorkout({ workoutId });

  if (loading || !workout || exerciseGroups.length === 0) {
    return (
      <BackgroundContainer>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#5D3FD3" />
          <Text style={styles.loadingText}>Loading workout...</Text>
        </View>
      </BackgroundContainer>
    );
  }

  if (workoutComplete) {
    return (
      <BackgroundContainer>
        <WorkoutCompleted
          elapsedTime={elapsedTime}
          exercisesCount={workout.exercises.length}
          onFinishWorkout={() => navigation.navigate('WorkoutList')}
        />
      </BackgroundContainer>
    );
  }

  const currentGroup = exerciseGroups[currentGroupIndex];
  const nextGroup = exerciseGroups[currentGroupIndex + 1];

  // Handle navigation logic
  const handlePrevious = () => {
    // If we're in a superset and not at the first exercise, go to previous exercise in superset
    if (
      currentGroup.type === 'superset' && 
      supersetExerciseIndex > 0
    ) {
      handlePreviousSupersetExercise();
    } else {
      // Otherwise go to previous group
      handlePreviousExerciseGroup();
    }
  };
  
  const handleNext = () => {
    // If we're in a superset and not at the last exercise, go to next exercise in superset
    if (
      currentGroup.type === 'superset' && 
      supersetExerciseIndex < currentGroup.exercises.length - 1
    ) {
      handleNextSupersetExercise();
    } else {
      // Otherwise go to next group
      handleNextExerciseGroup();
    }
  };

  const isFirstExercise = currentGroupIndex === 0 && 
    (currentGroup.type === 'single' || supersetExerciseIndex === 0);
  
  const isLastExercise = currentGroupIndex === exerciseGroups.length - 1 && 
    (currentGroup.type === 'single' || supersetExerciseIndex === currentGroup.exercises.length - 1);

  return (
    <BackgroundContainer>
      <WorkoutHeader
        workoutName={workout.name}
        elapsedTime={elapsedTime}
        currentGroupIndex={currentGroupIndex}
        totalGroups={exerciseGroups.length}
        onGoBack={() => navigation.goBack()}
      />

      {isResting ? (
        <RestTimer 
          restTime={restTime}
          nextGroup={nextGroup} 
          onSkipRest={skipRest}
        />
      ) : (
        <ScrollView 
          style={styles.container}
          showsVerticalScrollIndicator={false}
        >
          {/* === SINGLE EXERCISE === */}
          {currentGroup.type === 'single' && (
            <View style={styles.singleExerciseContainer}>
              <ExerciseCard 
                exercise={currentGroup.exercises[0]} 
                index={0} 
                completedSetsMap={completedSetsMap}
                onCompleteSet={handleCompleteSet}
              />
            </View>
          )}

          {/* === SUPERSET === */}
          {currentGroup.type === 'superset' && (
            <SupersetGroup 
              group={currentGroup} 
              completedSetsMap={completedSetsMap}
              onCompleteSet={handleCompleteSet}
              activeExerciseIndex={supersetExerciseIndex}
            />
          )}

          <NavigationControls 
            currentGroupIndex={currentGroupIndex}
            exerciseGroups={exerciseGroups}
            onPrevious={handlePrevious}
            onNext={handleNext}
            onFinish={finishWorkout}
            isFirstExercise={isFirstExercise}
            isLastExercise={isLastExercise}
          />
        </ScrollView>
      )}
    </BackgroundContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#fff',
  },
  singleExerciseContainer: {
    marginBottom: 20,
  }
});

export default ActiveWorkoutScreen;