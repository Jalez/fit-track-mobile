import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// Import screens
import WorkoutListScreen from '../screens/workout/WorkoutListScreen';
import CreateWorkoutScreen from '../screens/workout/CreateWorkoutScreen';
import ActiveWorkoutScreen from '../screens/workout/ActiveWorkoutScreen';

// Define the param list for type safety
export type WorkoutStackParamList = {
  WorkoutList: undefined;
  CreateWorkout: undefined;
  ActiveWorkout: { workoutId: string };
};

const Stack = createStackNavigator<WorkoutStackParamList>();

const WorkoutNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: 'transparent' },
        cardOverlayEnabled: true,
        cardStyleInterpolator: ({ current: { progress } }) => ({
          cardStyle: {
            opacity: progress.interpolate({
              inputRange: [0, 0.5, 0.9, 1],
              outputRange: [0, 0.25, 0.7, 1],
            }),
          },
          overlayStyle: {
            opacity: progress.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 0.5],
              extrapolate: 'clamp',
            }),
          },
        }),
      }}
    >
      <Stack.Screen name="WorkoutList" component={WorkoutListScreen} />
      <Stack.Screen name="CreateWorkout" component={CreateWorkoutScreen} />
      <Stack.Screen name="ActiveWorkout" component={ActiveWorkoutScreen} />
    </Stack.Navigator>
  );
};

export default WorkoutNavigator;

