import { ExerciseStackParamList } from './ExerciseNavigator';
import { WorkoutStackParamList } from './WorkoutNavigator';

export type RootStackParamList = {
  Home: undefined;
  Exercise: { screen?: keyof ExerciseStackParamList; params?: any };
  Workout: { screen?: keyof WorkoutStackParamList; params?: any };
  Profile: undefined;
} & ExerciseStackParamList & WorkoutStackParamList;