export interface Exercise {
  id: string;
  name: string;
  description: string;
  type: string;
  equipment?: string;
  difficulty?: string;
  muscles?: string[];
  instructions?: string[];
  tips?: string[];
  variations?: string[];
  imagePath?: string | null;
}

export interface WorkoutExercise extends Exercise {
  workoutConfig: {
    type: 'single' | 'group';
    groupId?:string;
    sets: Array<{
      restTime: number;
      reps?: number;
      time?: number;
      weight?: number;
      distance?: number;
    }>;
  };
}