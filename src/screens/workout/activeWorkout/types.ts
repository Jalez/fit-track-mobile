import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { WorkoutStackParamList } from '../../../navigation/WorkoutNavigator';
import { WorkoutExercise } from '../../../models/Exercise';

// Route and Navigation Props
export type ActiveWorkoutRouteProp = RouteProp<WorkoutStackParamList, 'ActiveWorkout'>;
export type ActiveWorkoutNavigationProp = StackNavigationProp<WorkoutStackParamList, 'ActiveWorkout'>;

// Interface for exercise groups (supersets/trisets/circuits)
export interface ExerciseGroup {
  type: 'single' | 'superset';
  exercises: WorkoutExercise[];
}

// Type for the completed sets tracking
export type CompletedSetsMap = Record<string, number>;