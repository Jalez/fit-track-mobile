import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface MultiSelectHeaderProps {
  multiSelectMode: boolean;
  onToggle: () => void;
}

const MultiSelectHeader: React.FC<MultiSelectHeaderProps> = ({
  multiSelectMode,
  onToggle,
}) => {
  return (
    <View style={styles.multiSelectToggle}>
      <TouchableOpacity 
        style={[styles.multiSelectButton, multiSelectMode && styles.multiSelectButtonActive]} 
        onPress={onToggle}
      >
        <Icon 
          name={multiSelectMode ? "checkbox-multiple-marked" : "checkbox-multiple-blank-outline"} 
          size={20} 
          color={multiSelectMode ? "#fff" : "#5D3FD3"} 
        />
        <Text 
          style={[styles.multiSelectButtonText, multiSelectMode && styles.multiSelectButtonTextActive]}
        >
          {multiSelectMode ? "Exit Selection" : "Select Multiple"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  multiSelectToggle: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 12,
  },
  multiSelectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  multiSelectButtonActive: {
    backgroundColor: '#5D3FD3',
  },
  multiSelectButtonText: {
    color: '#5D3FD3',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 6,
  },
  multiSelectButtonTextActive: {
    color: '#fff',
  },
});

export default MultiSelectHeader;