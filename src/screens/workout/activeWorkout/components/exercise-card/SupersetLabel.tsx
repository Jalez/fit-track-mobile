import React from 'react';
import { View, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { ExerciseGroup } from '../../types';
import { styles } from './ExerciseCardStyles';

interface SupersetLabelProps {
  group?: ExerciseGroup;
  index: number;
}

export const SupersetLabel: React.FC<SupersetLabelProps> = ({ group, index }) => {
  if (!group) return null;
  
  return (
    <View style={styles.supersetLabelContainer}>
      <View style={styles.supersetLabelContent}>
        <Icon name="lightning-bolt" size={12} color="#5D3FD3" />
        <Text style={styles.supersetLabel}>SUPERSET</Text>
        
        {/* Exercise progress indicator */}
        <View style={styles.exerciseProgressBar}>
          {group.exercises.map((_, i) => (
            <View
              key={i}
              style={[
                styles.progressDot,
                i === index && styles.activeProgressDot
              ]}
            />
          ))}
        </View>
      </View>
    </View>
  );
};