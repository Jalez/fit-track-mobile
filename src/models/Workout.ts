export interface Workout {
  id: string;
  name: string;
  exercises: Array<{
    exerciseId: string;
    sets: number;
    reps: number;
    restTime: number; // in seconds
  }>;
  createdAt: Date;
  updatedAt: Date;
}