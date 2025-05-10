import React, { useContext } from 'react';
import { View, FlatList, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { WorkoutContext } from '../../contexts/WorkoutContext';
import { WorkoutStackParamList } from '../../navigation/WorkoutNavigator';
import WorkoutCard from '../../components/workout/WorkoutCard';
import BackgroundContainer from '../../components/common/BackgroundContainer';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type WorkoutListNavigationProp = StackNavigationProp<WorkoutStackParamList, 'WorkoutList'>;

const WorkoutListScreen = () => {
  const { workouts } = useContext(WorkoutContext);
  const navigation = useNavigation<WorkoutListNavigationProp>();

  const handleCreateWorkout = () => {
    navigation.navigate('CreateWorkout');
  };

  return (
    <BackgroundContainer>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Workouts</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={handleCreateWorkout}
        >
          <Icon name="plus" size={24} color="#5D3FD3" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={workouts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <WorkoutCard workout={item} />}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="dumbbell" size={60} color="rgba(93, 63, 211, 0.3)" />
            <Text style={styles.emptyText}>No workouts yet</Text>
            <Text style={styles.emptySubtext}>Create your first workout to get started</Text>
            <TouchableOpacity 
              style={styles.createButton}
              onPress={handleCreateWorkout}
            >
              <Text style={styles.createButtonText}>Create Workout</Text>
            </TouchableOpacity>
          </View>
        }
      />
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
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 20,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 16,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  emptySubtext: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 8,
    marginBottom: 24,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  createButton: {
    backgroundColor: '#5D3FD3',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  createButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
});

export default WorkoutListScreen;