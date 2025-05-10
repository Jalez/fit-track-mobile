import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import ExerciseCard from '../../components/exercise/ExerciseCard';
import { fetchExercises } from '../../api/exerciseApi';
import BackgroundContainer from '../../components/common/BackgroundContainer';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Exercise } from '../../models/Exercise';
import { ExerciseStackParamList } from '../../navigation/ExerciseNavigator';

// This interface is needed to match what ExerciseCard expects
interface ExtendedExercise extends Exercise {
  type: string;
  muscle?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
}

type ExerciseScreenNavigationProp = StackNavigationProp<ExerciseStackParamList, 'ExerciseList'>;

const ExerciseListScreen = () => {
  const [exercises, setExercises] = useState<ExtendedExercise[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<ExerciseScreenNavigationProp>();

  useEffect(() => {
    const loadExercises = async () => {
      try {
        const data = await fetchExercises();
        // Convert the Exercise objects to ExtendedExercise by mapping difficulty to allowed values
        const extendedExercises = (data as Exercise[]).map(exercise => {
          // Map string difficulty to expected enum values
          let mappedDifficulty: 'easy' | 'medium' | 'hard' | undefined;
          
          if (exercise.difficulty) {
            if (exercise.difficulty.toLowerCase() === 'beginner') {
              mappedDifficulty = 'easy';
            } else if (exercise.difficulty.toLowerCase() === 'intermediate') {
              mappedDifficulty = 'medium';
            } else if (exercise.difficulty.toLowerCase() === 'advanced') {
              mappedDifficulty = 'hard';
            }
          }
          
          // Map the first muscle to the muscle property if available
          const primaryMuscle = exercise.muscles && exercise.muscles.length > 0 
            ? exercise.muscles[0] 
            : undefined;
            
          return {
            ...exercise,
            difficulty: mappedDifficulty,
            muscle: primaryMuscle
          };
        });
        
        setExercises(extendedExercises);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadExercises();
  }, []);

  const handleAddExercise = () => {
    // Navigate to add exercise screen
    // You might need to create this screen or use a form modal
    navigation.navigate('AddExercise');
  };

  return (
    <BackgroundContainer>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Exercise Library</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={handleAddExercise}
        >
          <Icon name="plus" size={24} color="#5D3FD3" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#5D3FD3" />
          <Text style={styles.loadingText}>Loading exercises...</Text>
        </View>
      ) : (
        <FlatList
          data={exercises}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <ExerciseCard exercise={item} />}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Icon name="arm-flex" size={60} color="rgba(93, 63, 211, 0.3)" />
              <Text style={styles.emptyText}>No exercises found</Text>
              <Text style={styles.emptySubtext}>Add exercises to your library</Text>
              <TouchableOpacity 
                style={styles.createButton}
                onPress={handleAddExercise}
              >
                <Text style={styles.createButtonText}>Add Exercise</Text>
              </TouchableOpacity>
            </View>
          }
        />
      )}
    </BackgroundContainer>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  listContainer: {
    paddingTop: 4,
    paddingBottom: 20,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    marginTop: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 16,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  emptySubtext: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 8,
    textAlign: 'center',
    marginBottom: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  createButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: 'rgba(93, 63, 211, 0.8)',
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  }
});

export default ExerciseListScreen;