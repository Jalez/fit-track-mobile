import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const EmptyStateView: React.FC = () => {
  return (
    <View style={styles.emptyState}>
      <Icon name="dumbbell" size={60} color="rgba(255, 255, 255, 0.3)" />
      <Text style={styles.emptyStateText}>No exercises added yet</Text>
      <Text style={styles.emptyStateSubText}>
        Tap the button below to add exercises to your workout
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 16,
  },
  emptyStateSubText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 32,
  },
});

export default EmptyStateView;