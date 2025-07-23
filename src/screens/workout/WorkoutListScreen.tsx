import React, { useContext } from 'react';
import { View, FlatList, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { WorkoutContext } from '../../contexts/WorkoutContext';
import { WorkoutStackParamList } from '../../navigation/WorkoutNavigator';
import WorkoutCard from '../../components/workout/WorkoutCard';

import EmptyWorkoutState from '../../components/common/EmptyWorkoutState';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type WorkoutListNavigationProp = StackNavigationProp<WorkoutStackParamList, 'WorkoutList'>;

const WorkoutListScreen = () => {
  const { workouts } = useContext(WorkoutContext);
  const navigation = useNavigation<WorkoutListNavigationProp>();

  const handleCreateWorkout = () => {
    navigation.navigate('CreateWorkout');
  };

  const handleScheduleWorkout = () => {
    // For now, just create a workout since we can't navigate to Calendar from here
    handleCreateWorkout();
  };

  return (
    <View style={{ flex: 1, backgroundColor: 'transparent' }}>
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
          <EmptyWorkoutState
            onCreateWorkout={handleScheduleWorkout}
            title="No Workouts Yet"
            description="Create your first workout to start building your fitness routine!"
          />
        }
      />
    </View>
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
    backgroundColor: 'transparent',
  },
});

export default WorkoutListScreen;