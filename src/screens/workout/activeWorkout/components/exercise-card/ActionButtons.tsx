import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { styles } from './ExerciseCardStyles';

interface ActionButtonsProps {
  allSetsCompleted: boolean;
  isEditing: boolean;
  onEdit: () => void;
  onCancel: () => void;
  onComplete: () => void;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  allSetsCompleted,
  isEditing,
  onEdit,
  onCancel,
  onComplete
}) => {
  if (allSetsCompleted) {
    return (
      <View style={styles.completedButtonContainer}>
        <Icon name="check-circle" size={24} color="#4CAF50" style={styles.completedIcon} />
        <Text style={styles.completedButtonText}>All Sets Completed</Text>
      </View>
    );
  }

  if (isEditing) {
    return (
      <View style={styles.actionButtonsContainer}>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={onCancel}
        >
          <Icon name="close" size={16} color="#fff" />
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.saveButton}
          onPress={onComplete}
        >
          <Icon name="content-save" size={16} color="#fff" />
          <Text style={styles.saveButtonText}>Save & Complete</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.actionButtonsContainer}>
      <TouchableOpacity
        style={styles.editButton}
        onPress={onEdit}
      >
        <Icon name="pencil" size={16} color="#fff" />
        <Text style={styles.editButtonText}>Edit Values</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.completeSetButton}
        onPress={onComplete}
      >
        <Icon name="check" size={16} color="#fff" />
        <Text style={styles.completeButtonText}>Complete Set</Text>
      </TouchableOpacity>
    </View>
  );
};