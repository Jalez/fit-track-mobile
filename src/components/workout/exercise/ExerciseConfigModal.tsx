import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  TextInput
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { WorkoutExercise } from '../../../models/Exercise';

interface ExerciseConfigModalProps {
  exercise: WorkoutExercise;
  onSave: (exercise: WorkoutExercise) => void;
  onClose: () => void;
}

const ExerciseConfigModal: React.FC<ExerciseConfigModalProps> = ({
  exercise,
  onSave,
  onClose,
}) => {
  const [config, setConfig] = useState(exercise.workoutConfig || {
    type: 'single' as const,
    sets: [{ reps: 12, weight: 0, restTime: 60 }],
  });
  
  const [measurementType, setMeasurementType] = useState(() => {
    const firstSet = exercise.workoutConfig?.sets[0];
    if (firstSet?.reps) return 'reps';
    if (firstSet?.time) return 'time';
    if (firstSet?.distance) return 'distance';
    return exercise.type === 'cardio' ? 'time' : 'reps';
  });

  const handleAddSet = () => {
    const lastSet = config.sets[config.sets.length - 1];
    const newSet = { ...lastSet };
    
    setConfig({
      ...config,
      sets: [...config.sets, newSet],
    });
  };

  const handleRemoveSet = (index: number) => {
    if (config.sets.length <= 1) return;
    
    const newSets = [...config.sets];
    newSets.splice(index, 1);
    setConfig({ ...config, sets: newSets });
  };

  const handleUpdateSet = (index: number, field: string, value: number) => {
    const newSets = [...config.sets];
    newSets[index] = { ...newSets[index], [field]: value };
    setConfig({ ...config, sets: newSets });
  };

  const handleMeasurementTypeChange = (type: string) => {
    setMeasurementType(type);
    
    // Update all sets with the new measurement type
    const newSets = config.sets.map(set => {
      const newSet = { ...set };
      // Remove existing measurement values
      delete newSet.reps;
      delete newSet.time;
      delete newSet.distance;
      
      // Add default value for the selected type
      if (type === 'reps') newSet.reps = 10;
      if (type === 'time') newSet.time = 30;
      if (type === 'distance') newSet.distance = 1;
      
      return newSet;
    });
    
    setConfig({
      ...config,
      sets: newSets
    });
  };

  const handleSave = () => {
    onSave({
      ...exercise,
      workoutConfig: config,
    });
  };

  return (
    <View style={styles.modalContainer}>
      <View style={styles.modalContent}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>{exercise.name}</Text>
          <TouchableOpacity onPress={onClose}>
            <Icon name="close" size={24} color="#666" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.modalScroll}>
          <View style={styles.configSection}>
            <Text style={styles.sectionTitle}>Measurement Type</Text>
            <View style={styles.typeButtons}>
              <TouchableOpacity
                style={[
                  styles.typeButton,
                  measurementType === 'reps' && styles.typeButtonActive,
                ]}
                onPress={() => handleMeasurementTypeChange('reps')}
              >
                <Icon name="repeat" size={18} color={measurementType === 'reps' ? "#fff" : "#666"} />
                <Text style={[
                  styles.typeButtonText,
                  measurementType === 'reps' && styles.typeButtonTextActive,
                ]}>
                  Reps
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.typeButton,
                  measurementType === 'time' && styles.typeButtonActive,
                ]}
                onPress={() => handleMeasurementTypeChange('time')}
              >
                <Icon name="clock-outline" size={18} color={measurementType === 'time' ? "#fff" : "#666"} />
                <Text style={[
                  styles.typeButtonText,
                  measurementType === 'time' && styles.typeButtonTextActive,
                ]}>
                  Time
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.typeButton,
                  measurementType === 'distance' && styles.typeButtonActive,
                ]}
                onPress={() => handleMeasurementTypeChange('distance')}
              >
                <Icon name="map-marker-distance" size={18} color={measurementType === 'distance' ? "#fff" : "#666"} />
                <Text style={[
                  styles.typeButtonText,
                  measurementType === 'distance' && styles.typeButtonTextActive,
                ]}>
                  Distance
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.configSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Sets</Text>
              <TouchableOpacity 
                style={styles.addButton}
                onPress={handleAddSet}
              >
                <Icon name="plus" size={20} color="#5D3FD3" />
              </TouchableOpacity>
            </View>

            {config.sets.map((set, index) => (
              <View key={index} style={styles.setContainer}>
                <View style={styles.setHeader}>
                  <Text style={styles.setNumber}>Set {index + 1}</Text>
                  {config.sets.length > 1 && (
                    <TouchableOpacity
                      onPress={() => handleRemoveSet(index)}
                      style={styles.removeSetButton}
                    >
                      <Icon name="minus-circle" size={20} color="#ff6b6b" />
                    </TouchableOpacity>
                  )}
                </View>
                <View style={styles.setInputs}>
                  {measurementType === 'reps' && (
                    <View style={styles.inputGroup}>
                      <Text style={styles.inputLabel}>Reps</Text>
                      <TextInput
                        style={styles.input}
                        value={set.reps?.toString()}
                        onChangeText={(value) => handleUpdateSet(index, 'reps', Number(value))}
                        keyboardType="numeric"
                        placeholder="0"
                      />
                    </View>
                  )}
                  
                  {measurementType === 'time' && (
                    <View style={styles.inputGroup}>
                      <Text style={styles.inputLabel}>Time (sec)</Text>
                      <TextInput
                        style={styles.input}
                        value={set.time?.toString()}
                        onChangeText={(value) => handleUpdateSet(index, 'time', Number(value))}
                        keyboardType="numeric"
                        placeholder="0"
                      />
                    </View>
                  )}
                  
                  {measurementType === 'distance' && (
                    <View style={styles.inputGroup}>
                      <Text style={styles.inputLabel}>Distance (km)</Text>
                      <TextInput
                        style={styles.input}
                        value={set.distance?.toString()}
                        onChangeText={(value) => handleUpdateSet(index, 'distance', Number(value))}
                        keyboardType="numeric"
                        placeholder="0"
                      />
                    </View>
                  )}
                  
                  {(exercise.type === 'strength' || measurementType === 'reps') && (
                    <View style={styles.inputGroup}>
                      <Text style={styles.inputLabel}>Weight (kg)</Text>
                      <TextInput
                        style={styles.input}
                        value={set.weight?.toString()}
                        onChangeText={(value) => handleUpdateSet(index, 'weight', Number(value))}
                        keyboardType="numeric"
                        placeholder="0"
                      />
                    </View>
                  )}
                  
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Rest (sec)</Text>
                    <TextInput
                      style={styles.input}
                      value={set.restTime?.toString()}
                      onChangeText={(value) => handleUpdateSet(index, 'restTime', Number(value))}
                      keyboardType="numeric"
                      placeholder="60"
                    />
                  </View>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>

        <TouchableOpacity 
          style={styles.saveButton}
          onPress={handleSave}
        >
          <Text style={styles.saveButtonText}>Save Configuration</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  modalScroll: {
    maxHeight: '70%',
  },
  configSection: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  typeButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: -4,
  },
  typeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 4,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  typeButtonActive: {
    backgroundColor: '#5D3FD3',
    borderColor: '#5D3FD3',
  },
  typeButtonText: {
    color: '#666',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 6,
  },
  typeButtonTextActive: {
    color: '#fff',
  },
  addButton: {
    padding: 8,
  },
  setContainer: {
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  setHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  setNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  removeSetButton: {
    padding: 4,
  },
  setInputs: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  inputGroup: {
    flex: 1,
    minWidth: '45%',
    margin: 4,
  },
  inputLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 6,
    fontSize: 14,
  },
  saveButton: {
    backgroundColor: '#5D3FD3',
    margin: 16,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ExerciseConfigModal;