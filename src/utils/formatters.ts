export const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
};

export const formatSetsAndReps = (sets: number, reps: number): string => {
  return `${sets} set${sets > 1 ? 's' : ''} of ${reps} rep${reps > 1 ? 's' : ''}`;
};

export const formatExerciseName = (name: string): string => {
  return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
};