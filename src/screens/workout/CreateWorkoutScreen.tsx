import React, { useState, useContext, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { WorkoutContext } from '../../contexts/WorkoutContext';
import { WorkoutStackParamList } from '../../navigation/WorkoutNavigator';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import WorkoutForm from '../../components/workout/WorkoutForm';
import BackgroundContainer from '../../components/common/BackgroundContainer';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { WorkoutExercise } from '../../models/Exercise';
import { Exercise as WorkoutContextExercise } from '../../contexts/WorkoutContext';
import { useExerciseStore } from '../../store/exerciseStore';

type CreateWorkoutNavigationProp = StackNavigationProp<WorkoutStackParamList, 'CreateWorkout'>;

const CreateWorkoutScreen = () => {
  const { addWorkout } = useContext(WorkoutContext);
  const navigation = useNavigation<CreateWorkoutNavigationProp>();
  const [workoutName, setWorkoutName] = useState('');
  
  // Use our Zustand store for exercise management
  const { 
    selectedExercises: exercises, 
    clearSelectedExercises,
    fetchExercises
  } = useExerciseStore();
  
  // Load exercises data when the screen mounts
  useEffect(() => {
    fetchExercises();
    
    // Clear selected exercises when unmounting
    return () => {
      clearSelectedExercises();
    };
  }, [fetchExercises, clearSelectedExercises]);

  const handleSave = () => {
    if (!workoutName || exercises.length === 0) {
      return;
    }
    
    // Convert WorkoutExercise[] to Exercise[] format expected by WorkoutContext
    const contextExercises: WorkoutContextExercise[] = exercises.map(ex => {
      // Default values if sets is empty
      const defaultReps = 0;
      const defaultRestTime = 60;
      
      // Get values from the first set if available
      const firstSet = ex.workoutConfig.sets[0] || {};
      
      return {
        id: ex.id,
        name: ex.name,
        type: ex.type,
        // Use appropriate measurement type (reps, time, distance)
        sets: ex.workoutConfig.sets.length,
        reps: firstSet.reps || 0,
        time: firstSet.time || 0,
        distance: firstSet.distance || 0,
        weight: firstSet.weight || 0,
        restTime: firstSet.restTime || defaultRestTime,
        // Include grouping info
        groupType: ex.workoutConfig.type,
      };
    });

    // Calculate workout duration estimation (sum of sets * rest time)
    const totalRestTime = exercises.reduce((total, ex) => {
      return total + ex.workoutConfig.sets.reduce((setTotal, set) => {
        return setTotal + (set.restTime || 0);
      }, 0);
    }, 0);
    
    // Estimate workout time in minutes (rest time + active time)
    // Assume about 30 seconds per set for the exercise itself
    const activeTime = exercises.reduce((total, ex) => {
      return total + ex.workoutConfig.sets.length * 30;
    }, 0);
    
    const estimatedDuration = Math.ceil((totalRestTime + activeTime) / 60);

    const newWorkout = {
      name: workoutName,
      description: `Workout with ${exercises.length} exercises`,
      exercises: contextExercises,
      duration: estimatedDuration || 0,
      createdAt: new Date().toISOString(),
    };

    addWorkout(newWorkout);
    
    // Clear the selected exercises from the store
    clearSelectedExercises();
    
    navigation.navigate('WorkoutList');
  };

  return (
    <BackgroundContainer>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Workout</Text>
        <TouchableOpacity 
          style={[
            styles.saveButton,
            (!workoutName || exercises.length === 0) && styles.saveButtonDisabled
          ]}
          onPress={handleSave}
          disabled={!workoutName || exercises.length === 0}
        >
          <Icon 
            name="check" 
            size={24} 
            color={!workoutName || exercises.length === 0 ? '#999' : '#5D3FD3'} 
          />
        </TouchableOpacity>
      </View>

      <WorkoutForm
        name={workoutName}
        onNameChange={setWorkoutName}
        exercises={exercises}
        onExercisesChange={(newExercises) => {
          // This is handled by the Zustand store now
          // We're keeping this prop to maintain compatibility with the WorkoutForm component
        }}
      />
    </BackgroundContainer>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  saveButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  saveButtonDisabled: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
});

export default CreateWorkoutScreen;