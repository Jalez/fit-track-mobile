import { isEmpty, isNumeric } from 'lodash';

export const validateExerciseName = (name: string): boolean => {
  return !isEmpty(name) && name.length <= 50;
};

export const validateSets = (sets: number): boolean => {
  return isNumeric(sets) && sets > 0 && sets <= 10;
};

export const validateReps = (reps: number): boolean => {
  return isNumeric(reps) && reps > 0 && reps <= 50;
};

export const validateRestTime = (restTime: number): boolean => {
  return isNumeric(restTime) && restTime >= 0 && restTime <= 300;
};