import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { ActiveWorkoutScreenstyles } from '../../ActiveWorkoutScreenStyles';
import { formatTime } from '../utils';

interface WorkoutHeaderProps {
  workoutName: string;
  elapsedTime: number;
  currentGroupIndex: number;
  totalGroups: number;
  onGoBack: () => void;
}

const WorkoutHeader: React.FC<WorkoutHeaderProps> = ({
  workoutName,
  elapsedTime,
  currentGroupIndex,
  totalGroups,
  onGoBack
}) => {
  return (
    <>
      <View style={ActiveWorkoutScreenstyles.header}>
        <TouchableOpacity 
          style={ActiveWorkoutScreenstyles.backButton}
          onPress={onGoBack}
        >
          <Icon name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <View style={ActiveWorkoutScreenstyles.titleContainer}>
          <Text style={ActiveWorkoutScreenstyles.workoutName}>{workoutName}</Text>
        </View>
        <View style={ActiveWorkoutScreenstyles.timerContainer}>
          <Icon name="clock-outline" size={18} color="#fff" />
          <Text style={ActiveWorkoutScreenstyles.timerText}>{formatTime(elapsedTime)}</Text>
        </View>
      </View>

      <View style={ActiveWorkoutScreenstyles.progressContainer}>
        <View style={ActiveWorkoutScreenstyles.progressBar}>
          <View 
            style={[
              ActiveWorkoutScreenstyles.progressFill, 
              { width: `${((currentGroupIndex) / totalGroups) * 100}%` }
            ]} 
          />
        </View>
        <Text style={ActiveWorkoutScreenstyles.progressText}>
          {currentGroupIndex + 1}/{totalGroups}
        </Text>
      </View>
    </>
  );
};

export default WorkoutHeader;