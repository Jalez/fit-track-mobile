import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface MultiSelectHeaderProps {
  multiSelectMode: boolean;
  onToggle: () => void;
}

const MultiSelectHeader: React.FC<MultiSelectHeaderProps> = ({
  multiSelectMode,
  onToggle,
}) => {
  if (multiSelectMode) {
    return (
      <View style={styles.container}>
        <TouchableOpacity 
          style={styles.exitButton} 
          onPress={onToggle}
        >
          <Icon name="close" size={20} color="#fff" />
          <Text style={styles.exitButtonText}>Exit Selection</Text>
        </TouchableOpacity>
        <Text style={styles.helpText}>Select 2+ exercises to create a superset</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.createButton} 
        onPress={onToggle}
      >
        <Icon name="lightning-bolt" size={20} color="#fff" />
        <Text style={styles.createButtonText}>Create Superset</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    alignItems: 'center',
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#5D3FD3',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignSelf: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  exitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#8E8E93',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginBottom: 8,
  },
  exitButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 6,
  },
  helpText: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
});

export default MultiSelectHeader;