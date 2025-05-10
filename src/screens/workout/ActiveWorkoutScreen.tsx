import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { WorkoutContext, Workout } from '../../contexts/WorkoutContext';
import { WorkoutStackParamList } from '../../navigation/WorkoutNavigator';
import BackgroundContainer from '../../components/common/BackgroundContainer';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { ActiveWorkoutScreenstyles } from './ActiveWorkoutScreenStyles';

type ActiveWorkoutRouteProp = RouteProp<WorkoutStackParamList, 'ActiveWorkout'>;
type ActiveWorkoutNavigationProp = StackNavigationProp<WorkoutStackParamList, 'ActiveWorkout'>;

const ActiveWorkoutScreen: React.FC = () => {
  const route = useRoute<ActiveWorkoutRouteProp>();
  const navigation = useNavigation<ActiveWorkoutNavigationProp>();
  const { workoutId } = route.params;
  const { workouts } = useContext(WorkoutContext);
  const [loading, setLoading] = useState(true);
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [isResting, setIsResting] = useState(false);
  const [restTime, setRestTime] = useState(60);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [workoutComplete, setWorkoutComplete] = useState(false);
  const [completedSets, setCompletedSets] = useState(0);

  useEffect(() => {
    // Simulate loading the workout data
    setTimeout(() => {
      // In a real app, you would fetch this from your API or context
      const foundWorkout = workouts.find(w => w.id.toString() === workoutId?.toString()) || {
        id: workoutId,
        name: 'Full Body Workout',
        description: 'A comprehensive workout targeting all major muscle groups',
        duration: 60,
        difficulty: 'medium',
        exercises: [
          {
            id: '1',
            name: 'Barbell Squat',
            type: 'strength',
            sets: 4,
            reps: 10,
            restTime: 90
          },
          {
            id: '2',
            name: 'Bench Press',
            type: 'strength',
            sets: 3,
            reps: 12,
            restTime: 60
          },
          {
            id: '3',
            name: 'Pull-ups',
            type: 'strength',
            sets: 3,
            reps: 8,
            restTime: 60
          },
          {
            id: '4',
            name: 'Deadlift',
            type: 'strength',
            sets: 4,
            reps: 8,
            restTime: 120
          }
        ]
      };
      
      setWorkout(foundWorkout);
      setLoading(false);
    }, 500);
  }, [workoutId, workouts]);

  // Reset completed sets when changing exercises
  useEffect(() => {
    setCompletedSets(0);
  }, [currentExerciseIndex]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;
    if (isResting && workout) {
      intervalId = setInterval(() => {
        setRestTime(prev => {
          if (prev <= 1) {
            if (intervalId) clearInterval(intervalId);
            setIsResting(false);
            return 60; // Reset for next rest period
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isResting]);

  useEffect(() => {
    // Overall workout timer
    let intervalId: NodeJS.Timeout | null = null;
    if (!workoutComplete) {
      intervalId = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [workoutComplete]);

  const formatTime = (timeInSeconds: number): string => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleCompleteSet = () => {
    if (!workout) return;
    
    const currentExercise = workout.exercises[currentExerciseIndex];
    // Increment completed sets
    const newCompletedSets = completedSets + 1;
    setCompletedSets(newCompletedSets);
    
    // If we've completed all sets for this exercise
    if (newCompletedSets >= currentExercise.sets) {
      // If there's another exercise, start rest period
      if (currentExerciseIndex < workout.exercises.length - 1) {
        setIsResting(true);
        setRestTime(currentExercise.restTime || 60);
      } else {
        // If this was the last exercise, complete workout
        setWorkoutComplete(true);
      }
    } else {
      // If there are more sets to complete for this exercise,
      // start a rest period between sets
      setIsResting(true);
      setRestTime(currentExercise.restTime || 60);
    }
  };

  const skipRest = () => {
    setIsResting(false);
    // Only move to next exercise if all sets of the current exercise are completed
    if (completedSets >= (workout?.exercises[currentExerciseIndex]?.sets || 0)) {
      setCurrentExerciseIndex(prev => prev + 1);
    }
  };

  const handleNextExercise = () => {
    if (workout && currentExerciseIndex < workout.exercises.length - 1) {
      // Reset completed sets and move to next exercise
      setCompletedSets(0);
      setCurrentExerciseIndex(prev => prev + 1);
    } else {
      setWorkoutComplete(true);
    }
  };

  const handlePreviousExercise = () => {
    if (currentExerciseIndex > 0) {
      setCurrentExerciseIndex(prev => prev - 1);
    }
  };

  const finishWorkout = () => {
    setWorkoutComplete(true);
    navigation.navigate('WorkoutList');
  };

  const getExerciseIcon = (type: string | undefined): string => {
    switch (type?.toLowerCase()) {
      case 'cardio':
        return 'run';
      case 'strength':
        return 'dumbbell';
      case 'flexibility':
        return 'yoga';
      case 'balance':
        return 'human-handsup';
      default:
        return 'arm-flex';
    }
  };

  if (loading || !workout) {
    return (
      <BackgroundContainer>
        <View style={ActiveWorkoutScreenstyles.loadingContainer}>
          <ActivityIndicator size="large" color="#5D3FD3" />
          <Text style={ActiveWorkoutScreenstyles.loadingText}>Loading workout...</Text>
        </View>
      </BackgroundContainer>
    );
  }

  if (workoutComplete) {
    return (
      <BackgroundContainer>
        <View style={ActiveWorkoutScreenstyles.completedContainer}>
          <Icon name="trophy" size={80} color="gold" />
          <Text style={ActiveWorkoutScreenstyles.completedTitle}>Workout Complete!</Text>
          <View style={ActiveWorkoutScreenstyles.statsCard}>
            <View style={ActiveWorkoutScreenstyles.statRow}>
              <Text style={ActiveWorkoutScreenstyles.statLabel}>Total Time</Text>
              <Text style={ActiveWorkoutScreenstyles.statValue}>{formatTime(elapsedTime)}</Text>
            </View>
            <View style={ActiveWorkoutScreenstyles.statRow}>
              <Text style={ActiveWorkoutScreenstyles.statLabel}>Exercises</Text>
              <Text style={ActiveWorkoutScreenstyles.statValue}>{workout.exercises.length}</Text>
            </View>
          </View>
          <TouchableOpacity 
            style={ActiveWorkoutScreenstyles.finishButton} 
            onPress={finishWorkout}
          >
            <Text style={ActiveWorkoutScreenstyles.finishButtonText}>Back to Workouts</Text>
          </TouchableOpacity>
        </View>
      </BackgroundContainer>
    );
  }

  const currentExercise = workout.exercises[currentExerciseIndex];

  return (
    <BackgroundContainer>
      <View style={ActiveWorkoutScreenstyles.header}>
        <TouchableOpacity 
          style={ActiveWorkoutScreenstyles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <View style={ActiveWorkoutScreenstyles.titleContainer}>
          <Text style={ActiveWorkoutScreenstyles.workoutName}>{workout.name}</Text>
        </View>
        <View style={ActiveWorkoutScreenstyles.timerContainer}>
          <Icon name="clock-outline" size={18} color="#fff" />
          <Text style={ActiveWorkoutScreenstyles.timerText}>{formatTime(elapsedTime)}</Text>
        </View>
      </View>

      <View style={ActiveWorkoutScreenstyles.progressContainer}>
        <View style={ActiveWorkoutScreenstyles.progressBar}>
          <View 
            style={[
              ActiveWorkoutScreenstyles.progressFill, 
              { width: `${((currentExerciseIndex) / workout.exercises.length) * 100}%` }
            ]} 
          />
        </View>
        <Text style={ActiveWorkoutScreenstyles.progressText}>
          {currentExerciseIndex + 1}/{workout.exercises.length}
        </Text>
      </View>

      {isResting ? (
        <View style={ActiveWorkoutScreenstyles.restContainer}>
          <Text style={ActiveWorkoutScreenstyles.restTitle}>Rest Time</Text>
          <Text style={ActiveWorkoutScreenstyles.restTimer}>{restTime}</Text>
          <Text style={ActiveWorkoutScreenstyles.restNextExercise}>
            Next: {workout.exercises[currentExerciseIndex + 1]?.name || 'Finish Workout'}
          </Text>
          <TouchableOpacity 
            style={ActiveWorkoutScreenstyles.skipButton}
            onPress={skipRest}
          >
            <Text style={ActiveWorkoutScreenstyles.skipButtonText}>Skip Rest</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView style={ActiveWorkoutScreenstyles.container} showsVerticalScrollIndicator={false}>
          <View style={ActiveWorkoutScreenstyles.exerciseHeader}>
            <View style={ActiveWorkoutScreenstyles.exerciseIconContainer}>
              <Icon 
                name={getExerciseIcon(currentExercise.type)} 
                size={32} 
                color="#5D3FD3" 
              />
            </View>
            <Text style={ActiveWorkoutScreenstyles.exerciseName}>{currentExercise.name}</Text>
          </View>

          <View style={ActiveWorkoutScreenstyles.detailsCard}>
            <View style={ActiveWorkoutScreenstyles.detailRow}>
              <View style={ActiveWorkoutScreenstyles.detailItem}>
                <Text style={ActiveWorkoutScreenstyles.detailValue}>{completedSets}/{currentExercise.sets}</Text>
                <Text style={ActiveWorkoutScreenstyles.detailLabel}>SET PROGRESS</Text>
              </View>
              <View style={ActiveWorkoutScreenstyles.detailSeparator} />
              <View style={ActiveWorkoutScreenstyles.detailItem}>
                <Text style={ActiveWorkoutScreenstyles.detailValue}>{currentExercise.reps}</Text>
                <Text style={ActiveWorkoutScreenstyles.detailLabel}>REPS</Text>
              </View>
              <View style={ActiveWorkoutScreenstyles.detailSeparator} />
              <View style={ActiveWorkoutScreenstyles.detailItem}>
                <Text style={ActiveWorkoutScreenstyles.detailValue}>{currentExercise.restTime}s</Text>
                <Text style={ActiveWorkoutScreenstyles.detailLabel}>REST</Text>
              </View>
            </View>
          </View>

          <TouchableOpacity 
            style={ActiveWorkoutScreenstyles.completeButton}
            onPress={handleCompleteSet}
          >
            <Text style={ActiveWorkoutScreenstyles.completeButtonText}>Complete Set</Text>
          </TouchableOpacity>

          <View style={ActiveWorkoutScreenstyles.navigationButtons}>
            <TouchableOpacity 
              style={[ActiveWorkoutScreenstyles.navButton, currentExerciseIndex === 0 ? ActiveWorkoutScreenstyles.navButtonDisabled : null]}
              onPress={handlePreviousExercise}
              disabled={currentExerciseIndex === 0}
            >
              <Icon 
                name="arrow-left" 
                size={24} 
                color={currentExerciseIndex === 0 ? "#aaa" : "#5D3FD3"} 
              />
              <Text 
                style={[
                  ActiveWorkoutScreenstyles.navButtonText, 
                  currentExerciseIndex === 0 ? ActiveWorkoutScreenstyles.navButtonTextDisabled : null
                ]}
              >
                Previous
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={ActiveWorkoutScreenstyles.navButton}
              onPress={handleNextExercise}
            >
              <Text style={ActiveWorkoutScreenstyles.navButtonText}>Next</Text>
              <Icon name="arrow-right" size={24} color="#5D3FD3" />
            </TouchableOpacity>
          </View>

          {currentExerciseIndex < workout.exercises.length - 1 && (
            <View style={ActiveWorkoutScreenstyles.nextExerciseContainer}>
              <Text style={ActiveWorkoutScreenstyles.nextExerciseLabel}>NEXT EXERCISE</Text>
              <Text style={ActiveWorkoutScreenstyles.nextExerciseName}>
                {workout.exercises[currentExerciseIndex + 1]?.name}
              </Text>
            </View>
          )}

          <TouchableOpacity 
            style={ActiveWorkoutScreenstyles.finishWorkoutButton}
            onPress={finishWorkout}
          >
            <Text style={ActiveWorkoutScreenstyles.finishWorkoutText}>Finish Workout</Text>
          </TouchableOpacity>
        </ScrollView>
      )}
    </BackgroundContainer>
  );
};

export default ActiveWorkoutScreen;