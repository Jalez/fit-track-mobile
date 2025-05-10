import React, { useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { AuthContext } from '../../contexts/AuthContext';
import { WorkoutContext } from '../../contexts/WorkoutContext';
import BackgroundContainer from '../../components/common/BackgroundContainer';

const ProfileScreen = () => {
  const { user } = useContext(AuthContext);
  const { workouts } = useContext(WorkoutContext);

  const totalWorkouts = workouts.length;
  const completedExercises = workouts.reduce((total, workout) => 
    total + workout.exercises.length, 0);

  return (
    <BackgroundContainer>
      <ScrollView style={styles.container}>
        {/* User Info Section */}
        <View style={styles.userSection}>
          <View style={styles.avatarContainer}>
            <Icon name="account-circle" size={80} color="#5D3FD3" />
          </View>
          <Text style={styles.userName}>{user?.name || 'User'}</Text>
          <Text style={styles.userEmail}>{user?.email || ''}</Text>
        </View>

        {/* Stats Section */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Icon name="dumbbell" size={24} color="#5D3FD3" />
            <Text style={styles.statNumber}>{totalWorkouts}</Text>
            <Text style={styles.statLabel}>Workouts</Text>
          </View>
          <View style={styles.statItem}>
            <Icon name="arm-flex" size={24} color="#5D3FD3" />
            <Text style={styles.statNumber}>{completedExercises}</Text>
            <Text style={styles.statLabel}>Exercises</Text>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.actionButton}>
            <Icon name="pencil" size={24} color="#5D3FD3" />
            <Text style={styles.actionText}>Edit Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Icon name="cog" size={24} color="#5D3FD3" />
            <Text style={styles.actionText}>Settings</Text>
          </TouchableOpacity>
        </View>

        {/* Recent Activity */}
        <View style={styles.recentActivityContainer}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          {workouts.slice(0, 3).map((workout, index) => (
            <View key={index} style={styles.activityItem}>
              <Icon name="calendar-check" size={24} color="#5D3FD3" />
              <View style={styles.activityInfo}>
                <Text style={styles.activityTitle}>{workout.name}</Text>
                <Text style={styles.activitySubtitle}>
                  {workout.exercises.length} exercises
                </Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </BackgroundContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  userSection: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 16,
    color: 'rgb(255, 255, 255)',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
    marginHorizontal: 20,

    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderRadius: 10,
    marginBottom: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 5,
  },
  statLabel: {
    fontSize: 14,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  actionText: {
    marginLeft: 10,
    fontSize: 16,
  },
  recentActivityContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  activityInfo: {
    marginLeft: 15,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#fff',
  },
  activitySubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
  },
});

export default ProfileScreen;