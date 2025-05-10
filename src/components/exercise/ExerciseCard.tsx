import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { StackNavigationProp } from '@react-navigation/stack';
import { ExerciseStackParamList } from '../../navigation/ExerciseNavigator';
import { Exercise } from '../../models/Exercise';

// Add additional props that may be needed but don't exist in the model
interface ExtendedExercise extends Exercise {
  type?: string;
  muscle?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
}

interface ExerciseProps {
  exercise: ExtendedExercise;
}

type ExerciseNavigationProp = StackNavigationProp<ExerciseStackParamList, 'ExerciseList'>;

const ExerciseCard: React.FC<ExerciseProps> = ({ exercise }) => {
  const navigation = useNavigation<ExerciseNavigationProp>();

  const handlePress = () => {
    navigation.navigate('ExerciseDetail', { exerciseId: exercise.id });
  };

  // Function to get the appropriate icon for the exercise type
  const getExerciseIcon = (type?: string): string => {
    switch (type?.toLowerCase()) {
      case 'cardio':
        return 'run';
      case 'strength':
        return 'dumbbell';
      case 'flexibility':
        return 'yoga';
      case 'balance':
        return 'human-handsup';
      default:
        return 'arm-flex';
    }
  };

  // Get the number of sets if available
  const setCount = exercise.sets?.length || 0;
  // Get the first set's reps if available
  const reps = exercise.sets && exercise.sets.length > 0 ? exercise.sets[0].reps : undefined;
  // Get the first set's rest time if available
  const restTime = exercise.sets && exercise.sets.length > 0 ? exercise.sets[0].restTime : undefined;

  return (
    <TouchableOpacity 
      style={styles.cardContainer}
      onPress={handlePress}
      activeOpacity={0.9}
    >
      <View style={styles.card}>
        <View style={styles.iconContainer}>
          <Icon 
            name={getExerciseIcon(exercise.type)} 
            size={24} 
            color="#5D3FD3" 
          />
        </View>
        
        <View style={styles.contentContainer}>
          <Text style={styles.title}>{exercise.name}</Text>
          
          {exercise.muscle && (
            <Text style={styles.subtitle}>{exercise.muscle}</Text>
          )}
          
          <View style={styles.detailsRow}>
            {setCount > 0 && (
              <View style={styles.detail}>
                <Text style={styles.detailValue}>{setCount}</Text>
                <Text style={styles.detailLabel}>SETS</Text>
              </View>
            )}
            
            {reps !== undefined && (
              <View style={styles.detail}>
                <Text style={styles.detailValue}>{reps}</Text>
                <Text style={styles.detailLabel}>REPS</Text>
              </View>
            )}
            
            {restTime !== undefined && (
              <View style={styles.detail}>
                <Text style={styles.detailValue}>{restTime}s</Text>
                <Text style={styles.detailLabel}>REST</Text>
              </View>
            )}
          </View>
        </View>
        
        {exercise.difficulty && (
          <View style={[
            styles.difficultyBadge,
            exercise.difficulty === 'easy' ? styles.easyBadge : 
            exercise.difficulty === 'medium' ? styles.mediumBadge : 
            styles.hardBadge
          ]}>
            <Text style={styles.difficultyText}>
              {exercise.difficulty.charAt(0).toUpperCase()}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    marginHorizontal: 16,
    marginVertical: 6,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    position: 'relative',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(93, 63, 211, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  contentContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 12,
    color: '#777',
    marginBottom: 6,
  },
  detailsRow: {
    flexDirection: 'row',
    marginTop: 4,
  },
  detail: {
    marginRight: 16,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#5D3FD3',
  },
  detailLabel: {
    fontSize: 10,
    color: '#888',
    letterSpacing: 0.5,
  },
  difficultyBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 12,
    right: 12,
  },
  easyBadge: {
    backgroundColor: 'rgba(76, 175, 80, 0.2)',
  },
  mediumBadge: {
    backgroundColor: 'rgba(255, 193, 7, 0.2)',
  },
  hardBadge: {
    backgroundColor: 'rgba(244, 67, 54, 0.2)',
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: '600',
  }
});

export default ExerciseCard;