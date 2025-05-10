import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import BackgroundContainer from '../../components/common/BackgroundContainer';
import ExerciseForm from '../../components/exercise/ExerciseForm';
import { ExerciseStackParamList } from '../../navigation/ExerciseNavigator';

type AddExerciseNavigationProp = StackNavigationProp<ExerciseStackParamList, 'AddExercise'>;

interface ExerciseFormData {
  name: string;
  sets: number;
  reps: number;
  restTime: number;
}

const AddExerciseScreen = () => {
  const navigation = useNavigation<AddExerciseNavigationProp>();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (exerciseData: ExerciseFormData) => {
    setLoading(true);
    try {
      // In a real app, you would add API call here to save the exercise
      // For example: await createExercise(exerciseData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Navigate back to the exercise list after successful creation
      navigation.goBack();
    } catch (error) {
      console.error('Error creating exercise:', error);
      // Here you would show an error message
    } finally {
      setLoading(false);
    }
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
        <View style={styles.titleContainer}>
          <Text style={styles.headerTitle}>Add Exercise</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>
      
      <View style={styles.formContainer}>
        <ExerciseForm 
          onSubmit={handleSubmit} 
          initialData={null} 
        />
      </View>
    </BackgroundContainer>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  titleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  formContainer: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
    marginTop: 10,
  },
});

export default AddExerciseScreen;