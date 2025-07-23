import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface EmptyWorkoutStateProps {
  onCreateWorkout: () => void;
  title?: string;
  description?: string;
}

const EmptyWorkoutState: React.FC<EmptyWorkoutStateProps> = ({
  onCreateWorkout,
  title = "No Workouts Yet",
  description = "Create your first workout to start building your fitness routine!"
}) => {
  return (
    <View style={styles.emptyContainer}>
      <Icon name="dumbbell" size={80} color="rgba(255, 255, 255, 0.3)" />
      <Text style={styles.emptyTitle}>{title}</Text>
      <Text style={styles.emptyText}>{description}</Text>
      <TouchableOpacity 
        style={styles.createButton}
        onPress={onCreateWorkout}
      >
        <Icon name="plus" size={20} color="#fff" />
        <Text style={styles.createButtonText}>Create Your First Workout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 20,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  emptyText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 30,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  createButton: {
    backgroundColor: '#5D3FD3',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
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
    fontWeight: 'bold',
    marginLeft: 8,
  },
});

export default EmptyWorkoutState; 