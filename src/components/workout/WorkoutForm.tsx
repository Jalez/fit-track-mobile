import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  TouchableOpacity,
  Modal,
  Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { WorkoutExercise } from '../../models/Exercise';
import ExerciseSelectionModal from './ExerciseSelectionModal';
import { useExerciseStore } from '../../store/exerciseStore';

// Import extracted components
import MultiSelectHeader from './exercise/MultiSelectHeader';
import GroupActionsBar from './exercise/GroupActionsBar';
import ExerciseList from './exercise/ExerciseList';
import ExerciseConfigModal from './exercise/ExerciseConfigModal';

interface WorkoutFormProps {
  name: string;
  onNameChange: (name: string) => void;
  exercises: WorkoutExercise[];
  onExercisesChange: (exercises: WorkoutExercise[]) => void;
}

const WorkoutForm: React.FC<WorkoutFormProps> = ({
  name,
  onNameChange,
  exercises,
  onExercisesChange,
}) => {
  // State management
  const [selectedExercise, setSelectedExercise] = useState<WorkoutExercise | null>(null);
  const [configModalVisible, setConfigModalVisible] = useState(false);
  const [selectionModalVisible, setSelectionModalVisible] = useState(false);
  const [multiSelectMode, setMultiSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  
  // Zustand store
  const { 
    addExerciseToWorkout,
    removeExerciseFromWorkout,
    updateExerciseConfig, 
    createSuperset,
    createTriset,
    createCircuit,
    removeFromGroup
  } = useExerciseStore();

  // Exercise configuration handlers
  const handleExerciseConfigured = (exercise: WorkoutExercise) => {
    updateExerciseConfig(exercise.id, exercise.workoutConfig);
    setConfigModalVisible(false);
    setSelectedExercise(null);
  };

  // Exercise interaction handlers
  const handleExercisePress = (exercise: WorkoutExercise) => {
    if (multiSelectMode) {
      // In multi-select mode, toggle selection
      if (selectedIds.includes(exercise.id)) {
        setSelectedIds(selectedIds.filter(id => id !== exercise.id));
      } else {
        setSelectedIds([...selectedIds, exercise.id]);
      }
    } else {
      // Normal mode - open config modal
      setSelectedExercise(exercise);
      setConfigModalVisible(true);
    }
  };

  const handleAddExercise = (exercise: WorkoutExercise) => {
    addExerciseToWorkout(exercise);
  };

  const handleRemoveExercise = (exerciseId: string) => {
    Alert.alert(
      "Remove Exercise",
      "Are you sure you want to remove this exercise from your workout?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Remove", 
          style: "destructive",
          onPress: () => {
            removeExerciseFromWorkout(exerciseId);
          }
        }
      ]
    );
  };

  // Multi-select and grouping handlers
  const handleToggleMultiSelect = () => {
    setMultiSelectMode(!multiSelectMode);
    setSelectedIds([]);
  };

  const handleCreateSuperset = () => {
    if (selectedIds.length < 2) {
      Alert.alert("Superset Error", "Select at least 2 exercises to create a superset");
      return;
    }
    createSuperset(selectedIds);
    setSelectedIds([]);
    setMultiSelectMode(false);
  };

  const handleCreateTriset = () => {
    if (selectedIds.length < 3) {
      Alert.alert("Triset Error", "Select at least 3 exercises to create a triset");
      return;
    }
    createTriset(selectedIds);
    setSelectedIds([]);
    setMultiSelectMode(false);
  };

  const handleCreateCircuit = () => {
    if (selectedIds.length < 3) {
      Alert.alert("Circuit Error", "Select at least 3 exercises to create a circuit");
      return;
    }
    createCircuit(selectedIds);
    setSelectedIds([]);
    setMultiSelectMode(false);
  };

  const handleResetGroup = () => {
    selectedIds.forEach(id => {
      removeFromGroup(id);
    });
    setSelectedIds([]);
    setMultiSelectMode(false);
  };

  // Drag and drop handler
  const handleDragEnd = ({ data }: { data: WorkoutExercise[] }) => {
    // Update the onExercisesChange prop to maintain compatibility
    onExercisesChange(data);
  };

  return (
    <View style={styles.container}>
      {/* Workout name input */}
      <TextInput
        style={styles.nameInput}
        placeholder="Workout Name"
        value={name}
        onChangeText={onNameChange}
        placeholderTextColor="rgba(255, 255, 255, 0.6)"
      />

      {/* Multi-select toggle */}
      {exercises.length > 0 && (
        <MultiSelectHeader
          multiSelectMode={multiSelectMode}
          onToggle={handleToggleMultiSelect}
        />
      )}

      {/* Group actions bar */}
      {multiSelectMode && selectedIds.length > 0 && (
        <GroupActionsBar
          onCreateSuperset={handleCreateSuperset}
          onCreateTriset={handleCreateTriset}
          onCreateCircuit={handleCreateCircuit}
          onResetGroup={handleResetGroup}
        />
      )}

      {/* Exercise list */}
      <View style={styles.exerciseList}>
        <ExerciseList
          exercises={exercises}
          selectedIds={selectedIds}
          multiSelectMode={multiSelectMode}
          onDragEnd={handleDragEnd}
          onExercisePress={handleExercisePress}
          onRemoveExercise={handleRemoveExercise}
        />
      </View>

      {/* Add exercise button */}
      <TouchableOpacity 
        style={styles.addExerciseButton}
        onPress={() => setSelectionModalVisible(true)}
      >
        <Icon name="plus" size={24} color="#fff" />
        <Text style={styles.addExerciseText}>Add Exercise</Text>
      </TouchableOpacity>

      {/* Exercise selection modal */}
      <ExerciseSelectionModal
        visible={selectionModalVisible}
        onClose={() => setSelectionModalVisible(false)}
        onSelectExercise={handleAddExercise}
        selectedExercises={exercises}
      />

      {/* Exercise configuration modal */}
      <Modal
        visible={configModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setConfigModalVisible(false)}
      >
        {selectedExercise && (
          <ExerciseConfigModal
            exercise={selectedExercise}
            onSave={handleExerciseConfigured}
            onClose={() => setConfigModalVisible(false)}
          />
        )}
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  nameInput: {
    height: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#fff',
    marginBottom: 16,
  },
  exerciseList: {
    flex: 1,
    marginBottom: 16,
  },
  addExerciseButton: {
    backgroundColor: '#5D3FD3',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  addExerciseText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default WorkoutForm;