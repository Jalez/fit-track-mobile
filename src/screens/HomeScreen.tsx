import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { WorkoutContext, Workout } from '../contexts/WorkoutContext';
import { RootStackParamList } from '../navigation/types';
import BackgroundContainer from '../components/common/BackgroundContainer';

const HomeScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { workouts } = useContext(WorkoutContext);
  const [todaysWorkout, setTodaysWorkout] = useState<Workout | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);

  useEffect(() => {
    // In a real app, this would be based on user's schedule or preferences
    // For now, just pick the first workout or a default one
    setTodaysWorkout(workouts[0] || {
      id: 'default',
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
        }
      ]
    });
  }, [workouts]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerActive) {
      interval = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerActive]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartWorkout = () => {
    if (todaysWorkout) {
      navigation.navigate('Workout', {
        screen: 'ActiveWorkout',
        params: { workoutId: todaysWorkout.id }
      });
    }
  };

  const handleCreateWorkout = () => {
    // Navigate to the Workout tab and then to CreateWorkout screen
    navigation.navigate('Workout', {
      screen: 'CreateWorkout'
    });
  };

  const toggleTimer = () => {
    setIsTimerActive(!isTimerActive);
  };

  if (!todaysWorkout) {
    return (
      <BackgroundContainer>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No workout planned for today</Text>
          <TouchableOpacity 
            style={styles.createButton}
            onPress={handleCreateWorkout}
          >
            <Text style={styles.createButtonText}>Create Workout</Text>
          </TouchableOpacity>
        </View>
      </BackgroundContainer>
    );
  }

  return (
    <BackgroundContainer>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.greeting}>Today's Workout</Text>
          <View style={styles.timerContainer}>
            <TouchableOpacity onPress={toggleTimer} style={styles.timerButton}>
              <Icon name={isTimerActive ? 'pause' : 'play'} size={20} color="#fff" />
              <Text style={styles.timerText}>{formatTime(elapsedTime)}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.workoutCard}>
          <Text style={styles.workoutName}>{todaysWorkout.name}</Text>
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
    </BackgroundContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  timerContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 20,
    padding: 8,
  },
  timerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  timerText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
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
  workoutName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
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
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  createButton: {
    backgroundColor: '#5D3FD3',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 30,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default HomeScreen;