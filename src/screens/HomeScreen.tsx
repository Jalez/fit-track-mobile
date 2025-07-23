import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { RootStackParamList } from '../navigation/types';
import EmptyWorkoutState from '../components/common/EmptyWorkoutState';
import { useWorkoutScheduling } from '../hooks/useWorkoutScheduling';

const HomeScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { 
    getTodayScheduledWorkout, 
    getTodayWorkout 
  } = useWorkoutScheduling();
  
  // Get today's scheduled workout and workout details directly from context
  const todaysScheduledWorkout = getTodayScheduledWorkout();
  const todaysWorkout = getTodayWorkout();

  const handleStartWorkout = () => {
    if (todaysWorkout) {
      navigation.navigate('Workouts', {
        screen: 'ActiveWorkout',
        params: { workoutId: todaysWorkout.id }
      });
    }
  };

  const handleCreateWorkout = () => {
    // Navigate to the Workouts tab and then to CreateWorkout screen
    navigation.navigate('Workouts', {
      screen: 'CreateWorkout'
    });
  };

  const handleScheduleWorkout = () => {
    // Navigate to the Calendar tab
    navigation.navigate('Calendar');
  };

  if (!todaysWorkout) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.greeting}>Today's Workout</Text>
        </View>
        
        <EmptyWorkoutState
          onCreateWorkout={handleScheduleWorkout}
          title="No Workout Scheduled"
          description="Schedule a workout for today to start your fitness journey!"
        />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Today's Workout</Text>
      </View>

        <View style={styles.workoutCard}>
          <View style={styles.workoutHeader}>
            <Text style={styles.workoutName}>{todaysWorkout.name}</Text>
          </View>
          <Text style={styles.workoutDescription}>{todaysWorkout.description}</Text>
          
          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Icon name="clock-outline" size={24} color="#5D3FD3" />
              <Text style={styles.statValue}>{todaysWorkout.duration} min</Text>
              <Text style={styles.statLabel}>Duration</Text>
            </View>
            <View style={styles.stat}>
              <Icon name="dumbbell" size={24} color="#5D3FD3" />
              <Text style={styles.statValue}>{todaysWorkout.exercises.length}</Text>
              <Text style={styles.statLabel}>Exercises</Text>
            </View>
            <View style={styles.stat}>
              <Icon name="fire" size={24} color="#5D3FD3" />
              <Text style={styles.statValue}>{todaysWorkout.difficulty || 'Med'}</Text>
              <Text style={styles.statLabel}>Intensity</Text>
            </View>
          </View>

          <TouchableOpacity 
            style={styles.startButton}
            onPress={handleStartWorkout}
          >
            <Icon name="play-circle" size={24} color="#fff" />
            <Text style={styles.startButtonText}>Start Workout</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.exercisesPreview}>
          <Text style={styles.sectionTitle}>Exercises</Text>
          {todaysWorkout.exercises.map((exercise, index) => (
            <View key={exercise.id} style={styles.exerciseItem}>
              <View style={styles.exerciseInfo}>
                <Text style={styles.exerciseName}>{exercise.name}</Text>
                <Text style={styles.exerciseDetail}>
                  {exercise.sets} sets × {exercise.reps} reps
                </Text>
              </View>
              <Icon 
                name={exercise.type === 'cardio' ? 'run' : 'dumbbell'} 
                size={24} 
                color="#5D3FD3" 
              />
            </View>
          ))}
        </View>
      </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    backgroundColor: 'transparent',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  workoutCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderRadius: 16,
    padding: 16,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  workoutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  workoutName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  workoutDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  stat: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  startButton: {
    backgroundColor: '#5D3FD3',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 30,
    marginTop: 8,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  exercisesPreview: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  exerciseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  exerciseDetail: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
});

export default HomeScreen;