import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

interface GroupActionsBarProps {
  onCreateSuperset: () => void;
  onCreateTriset: () => void;
  onCreateCircuit: () => void;
  onResetGroup: () => void;
}

const GroupActionsBar: React.FC<GroupActionsBarProps> = ({
  onCreateSuperset,
  onCreateTriset,
  onCreateCircuit,
  onResetGroup,
}) => {
  return (
    <View style={styles.groupActions}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <TouchableOpacity 
          style={[styles.groupActionButton, styles.supersetButton]} 
          onPress={onCreateSuperset}
        >
          <Text style={styles.groupActionText}>Create Superset</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.groupActionButton, styles.trisetButton]} 
          onPress={onCreateTriset}
        >
          <Text style={styles.groupActionText}>Create Triset</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.groupActionButton, styles.circuitButton]} 
          onPress={onCreateCircuit}
        >
          <Text style={styles.groupActionText}>Create Circuit</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.groupActionButton, styles.resetButton]} 
          onPress={onResetGroup}
        >
          <Text style={styles.groupActionText}>Reset to Single</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  groupActions: {
    marginBottom: 12,
  },
  groupActionButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 8,
  },
  supersetButton: {
    backgroundColor: '#5D3FD3',
  },
  trisetButton: {
    backgroundColor: '#FF9500',
  },
  circuitButton: {
    backgroundColor: '#34C759',
  },
  resetButton: {
    backgroundColor: '#8E8E93',
  },
  groupActionText: {
    color: '#fff',
    fontWeight: '500',
  },
});

export default GroupActionsBar;