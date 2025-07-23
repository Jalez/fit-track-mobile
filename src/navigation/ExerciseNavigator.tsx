import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// Import screens
import ExerciseListScreen from '../screens/exercise/ExerciseListScreen';
import ExerciseDetailScreen from '../screens/exercise/ExerciseDetailScreen';
import AddExerciseScreen from '../screens/exercise/AddExerciseScreen';

// Define the param list for type safety
export type ExerciseStackParamList = {
  ExerciseList: undefined;
  ExerciseDetail: { exerciseId: string };
  AddExercise: undefined;
};

const Stack = createStackNavigator<ExerciseStackParamList>();

const ExerciseNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: 'transparent' },
        cardOverlayEnabled: false,
      }}
    >
      <Stack.Screen name="ExerciseList" component={ExerciseListScreen} />
      <Stack.Screen name="ExerciseDetail" component={ExerciseDetailScreen} />
      <Stack.Screen name="AddExercise" component={AddExerciseScreen} />
    </Stack.Navigator>
  );
};

export default ExerciseNavigator;