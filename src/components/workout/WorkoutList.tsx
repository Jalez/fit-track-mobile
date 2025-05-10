import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useWorkout } from '../../contexts/WorkoutContext';
import WorkoutCard from './WorkoutCard';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const WorkoutList = () => {
  const { workouts } = useWorkout();

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Your Workouts</Text>
      
      {workouts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Icon name="dumbbell" size={60} color="rgba(93, 63, 211, 0.3)" />
          <Text style={styles.emptyText}>No workouts available</Text>
          <Text style={styles.emptySubtext}>Please create a new workout</Text>
        </View>
      ) : (
        <FlatList
          data={workouts}
          renderItem={({ item }) => (
            <WorkoutCard workout={item} />
          )}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 12,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  listContainer: {
    paddingBottom: 20,
  },
  emptyContainer: {
    flex: 1,
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
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});

export default WorkoutList;