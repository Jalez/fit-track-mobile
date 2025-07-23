import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { View, Text, Dimensions } from 'react-native';

// Import screens
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import ExerciseNavigator from './ExerciseNavigator';
import WorkoutNavigator from './WorkoutNavigator';
import CalendarScreen from '../screens/CalendarScreen';

const Tab = createMaterialTopTabNavigator();

const TabNavigator = () => {
  const { width: screenWidth } = Dimensions.get('window');
  const tabCount = 5; // Number of tabs
  const tabWidth = screenWidth / tabCount;
  const iconSize = Math.max(14, Math.min(18, screenWidth * 0.04)); // Responsive icon size
  const fontSize = Math.max(9, Math.min(12, screenWidth * 0.025)); // Responsive font size
  return (
    <Tab.Navigator
      style={{ backgroundColor: 'transparent' }}
      sceneContainerStyle={{ backgroundColor: 'transparent' }}
      tabBarPosition="top"
      screenOptions={({ route }: { route: any }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: 'transparent',
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 0,
          paddingTop: 0, // Remove extra padding since BackgroundContainer handles status bar
          minHeight: Math.max(50, screenWidth * 0.12),
        },
        tabBarContentContainerStyle: {
          backgroundColor: 'transparent',
        },
        tabBarPressColor: 'transparent',
        tabBarPressOpacity: 0.8,
        tabBarLabelStyle: {
          fontSize,
          fontWeight: '500',
          textTransform: 'none',
          marginTop: 0,
          marginBottom: 0,
          numberOfLines: 1,
          ellipsizeMode: 'tail',
        },
        tabBarItemStyle: {
          width: tabWidth,
          minWidth: Math.max(50, screenWidth * 0.12),
          maxWidth: Math.min(100, screenWidth * 0.25),
        },
        tabBarActiveTintColor: '#5D3FD3',
        tabBarInactiveTintColor: 'rgba(255, 255, 255, 0.6)',
        tabBarIndicatorStyle: {
          backgroundColor: '#5D3FD3',
          height: 3,
        },
        tabBarIcon: ({ focused, color }: { focused: boolean; color: string }) => {
          let iconName = 'home';

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Workouts') {
            iconName = focused ? 'dumbbell' : 'dumbbell';
          } else if (route.name === 'Calendar') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'Exercise') {
            iconName = focused ? 'arm-flex' : 'arm-flex-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'account' : 'account-outline';
          }

          return <Icon name={iconName} size={iconSize} color={color} />;
        },
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{ 
          tabBarStyle: { backgroundColor: 'transparent' },
          sceneStyle: { backgroundColor: 'transparent' }
        }}
      />
      <Tab.Screen 
        name="Workouts" 
        component={WorkoutNavigator}
        options={{ 
          tabBarStyle: { backgroundColor: 'transparent' },
          sceneStyle: { backgroundColor: 'transparent' }
        }}
      />
      <Tab.Screen 
        name="Calendar" 
        component={CalendarScreen}
        options={{ 
          tabBarStyle: { backgroundColor: 'transparent' },
          sceneStyle: { backgroundColor: 'transparent' }
        }}
      />
      <Tab.Screen 
        name="Exercise" 
        component={ExerciseNavigator}
        options={{ 
          tabBarStyle: { backgroundColor: 'transparent' },
          sceneStyle: { backgroundColor: 'transparent' }
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{ 
          tabBarStyle: { backgroundColor: 'transparent' },
          sceneStyle: { backgroundColor: 'transparent' }
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;