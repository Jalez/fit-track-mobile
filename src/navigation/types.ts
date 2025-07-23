import { ExerciseStackParamList } from './ExerciseNavigator';
import { WorkoutStackParamList } from './WorkoutNavigator';

export type RootStackParamList = {
  Home: undefined;
  Exercise: { screen?: keyof ExerciseStackParamList; params?: any };
  Workouts: { screen?: keyof WorkoutStackParamList; params?: any };
  Calendar: undefined;
  Profile: undefined;
} & ExerciseStackParamList & WorkoutStackParamList;