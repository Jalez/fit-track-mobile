import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { WorkoutStackParamList } from '../../navigation/WorkoutNavigator';
import { Workout } from '../../contexts/WorkoutContext';

type WorkoutNavigationProp = NativeStackNavigationProp<WorkoutStackParamList, 'WorkoutList'>;

interface WorkoutCardProps {
  workout: Workout;
}

const WorkoutCard: React.FC<WorkoutCardProps> = ({ workout }) => {
  const navigation = useNavigation<WorkoutNavigationProp>();

  const handlePress = () => {
    navigation.navigate('ActiveWorkout', { workoutId: workout.id });
  };

  return (
    <TouchableOpacity 
      style={styles.cardContainer}
      onPress={handlePress}
      activeOpacity={0.9}
    >
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.title}>{workout.name}</Text>
          {workout.difficulty && (
            <View style={[styles.difficultyBadge, 
              workout.difficulty === 'easy' ? styles.easyBadge : 
              workout.difficulty === 'medium' ? styles.mediumBadge : 
              styles.hardBadge
            ]}>
              <Text style={styles.difficultyText}>
                {workout.difficulty.charAt(0).toUpperCase() + workout.difficulty.slice(1)}
              </Text>
            </View>
          )}
        </View>

        <Text style={styles.description} numberOfLines={2}>
          {workout.description || 'No description available'}
        </Text>
        
        <View style={styles.statsContainer}>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{workout.duration || '0'}</Text>
            <Text style={styles.statLabel}>min</Text>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.stat}>
            <Text style={styles.statValue}>{workout.exercises ? workout.exercises.length : 0}</Text>
            <Text style={styles.statLabel}>exercises</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    marginHorizontal: 16,
    marginVertical: 8,
  },
  card: {
    padding: 16,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#5D3FD3',
    flex: 1,
  },
  description: {
    fontSize: 14,
    color: '#555',
    marginBottom: 12,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 8,
  },
  stat: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#5D3FD3',
  },
  statLabel: {
    fontSize: 12,
    color: '#888',
  },
  divider: {
    width: 1,
    backgroundColor: '#ddd',
    marginVertical: 5,
  },
  difficultyBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 10,
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

export default WorkoutCard;