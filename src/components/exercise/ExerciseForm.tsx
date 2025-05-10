import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, ScrollView, Platform, Animated, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const EXERCISE_TYPES = {
  STRENGTH: 'strength',
  CARDIO: 'cardio',
  FLEXIBILITY: 'flexibility',
  BALANCE: 'balance'
};

const EQUIPMENT_TYPES = [
  'barbell',
  'dumbbell',
  'kettlebell',
  'machine',
  'bodyweight',
  'cable',
  'resistance band',
  'medicine ball'
];

const DIFFICULTY_LEVELS = [
  'beginner',
  'intermediate',
  'advanced'
];

const MUSCLE_GROUPS = [
  'chest',
  'back',
  'shoulders',
  'biceps',
  'triceps',
  'forearms',
  'abs',
  'quadriceps',
  'hamstrings',
  'calves',
  'glutes'
];

interface ExerciseFormData {
  name: string;
  description: string;
  type: string;
  equipment?: string;
  difficulty?: string;
  muscles: string[];
  instructions: string[];
  tips: string[];
  variations: string[];
}

interface ExerciseFormProps {
  onSubmit: (exerciseData: ExerciseFormData) => void;
  initialData?: ExerciseFormData | null;
}

interface PickerItem {
  label: string;
  value: string;
}

// Define the type for activeField to handle both single and multi-select cases
interface ActiveFieldBase {
  label: string; 
  items: PickerItem[];
}

interface SingleSelectField extends ActiveFieldBase {
  onSelect: (value: string) => void;
  multiSelect?: false;
  selected?: string;
}

interface MultiSelectField extends ActiveFieldBase {
  onSelect: (value: string[]) => void;
  multiSelect: true;
  selected?: string[];
}

type ActiveField = SingleSelectField | MultiSelectField;

const ExerciseForm: React.FC<ExerciseFormProps> = ({ onSubmit, initialData }) => {
  const [name, setName] = useState(initialData?.name || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [type, setType] = useState(initialData?.type || EXERCISE_TYPES.STRENGTH);
  const [equipment, setEquipment] = useState(initialData?.equipment || '');
  const [difficulty, setDifficulty] = useState(initialData?.difficulty || '');
  const [muscles, setMuscles] = useState<string[]>(initialData?.muscles || []);
  const [instructions, setInstructions] = useState<string[]>(initialData?.instructions || ['']);
  const [tips, setTips] = useState<string[]>(initialData?.tips || ['']);
  const [variations, setVariations] = useState<string[]>(initialData?.variations || ['']);

  const [modalVisible, setModalVisible] = useState(false);
  const [activeField, setActiveField] = useState<ActiveField | null>(null);
  const [slideAnim] = useState(new Animated.Value(0));

  React.useEffect(() => {
    if (modalVisible) {
      slideAnim.setValue(500);
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 65,
        friction: 11
      }).start();
    }
  }, [modalVisible]);

  const handleAddListItem = (list: string[], setList: (items: string[]) => void) => {
    setList([...list, '']);
  };

  const handleUpdateListItem = (index: number, value: string, list: string[], setList: (items: string[]) => void) => {
    const newList = [...list];
    newList[index] = value;
    setList(newList);
  };

  const handleRemoveListItem = (index: number, list: string[], setList: (items: string[]) => void) => {
    const newList = list.filter((_, i) => i !== index);
    setList(newList);
  };

  const handleSubmit = () => {
    // Filter out empty strings from arrays
    const filteredInstructions = instructions.filter(i => i.trim());
    const filteredTips = tips.filter(t => t.trim());
    const filteredVariations = variations.filter(v => v.trim());

    const exerciseData = {
      name,
      description,
      type,
      equipment,
      difficulty,
      muscles,
      instructions: filteredInstructions,
      tips: filteredTips,
      variations: filteredVariations,
    };
    onSubmit(exerciseData);
  };

  // Properly typed functions to handle single and multi-select
  const handleSingleSelect = (setValue: React.Dispatch<React.SetStateAction<string>>) => {
    return (value: string | string[]) => {
      if (typeof value === 'string') {
        setValue(value);
      }
    };
  };

  const handleMultiSelect = (setValue: React.Dispatch<React.SetStateAction<string[]>>) => {
    return (value: string | string[]) => {
      if (Array.isArray(value)) {
        setValue(value);
      }
    };
  };

  const renderPickerField = (
    label: string, 
    value: string | string[], 
    onValueChange: (value: string | string[]) => void, 
    items: PickerItem[],
    multiSelect?: boolean
  ) => (
    <View style={styles.pickerFieldContainer}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity
        style={styles.selectButton}
        onPress={() => {
          if (multiSelect) {
            // For multi-select, explicitly set multiSelect as true
            setActiveField({ 
              label, 
              items, 
              onSelect: onValueChange as (value: string[]) => void,
              multiSelect: true,
              selected: value as string[]
            });
          } else {
            // For single-select, omit multiSelect (it will be undefined/false by default)
            setActiveField({ 
              label, 
              items, 
              onSelect: onValueChange as (value: string) => void,
              selected: value as string
            });
          }
          setModalVisible(true);
        }}
      >
        <Text style={styles.selectButtonText}>
          {multiSelect 
            ? (Array.isArray(value) && value.length > 0 
              ? `${value.length} selected` 
              : 'Select...')
            : (value && items.find(item => item.value === value)?.label || 'Select...')}
        </Text>
        <Icon name="chevron-down" size={24} color="#666" />
      </TouchableOpacity>
    </View>
  );

  const renderListInput = (
    label: string,
    items: string[],
    setItems: (items: string[]) => void,
    placeholder: string
  ) => (
    <View style={styles.listInputContainer}>
      <View style={styles.listHeader}>
        <Text style={styles.label}>{label}</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => handleAddListItem(items, setItems)}
        >
          <Icon name="plus" size={20} color="#5D3FD3" />
        </TouchableOpacity>
      </View>
      {items.map((item, index) => (
        <View key={index} style={styles.listItemContainer}>
          <TextInput
            style={styles.listItemInput}
            value={item}
            onChangeText={(text) => handleUpdateListItem(index, text, items, setItems)}
            placeholder={`${placeholder} #${index + 1}`}
            placeholderTextColor="#999"
            multiline
          />
          <TouchableOpacity
            style={styles.removeButton}
            onPress={() => handleRemoveListItem(index, items, setItems)}
          >
            <Icon name="close" size={20} color="#666" />
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );

  // Improved type safety for the modal selection handling
  const handleSelectOption = (item: PickerItem) => {
    if (!activeField) return;
    
    if (activeField.multiSelect === true) {
      // Handle multi-select case with proper type assertion
      const currentSelection = (activeField.selected || []) as string[];
      const newSelection = currentSelection.includes(item.value)
        ? currentSelection.filter(v => v !== item.value)
        : [...currentSelection, item.value];
      
      (activeField.onSelect as (value: string[]) => void)(newSelection);
    } else {
      // Handle single-select case with proper type assertion
      (activeField.onSelect as (value: string) => void)(item.value);
      setModalVisible(false);
    }
  };

  // Refactor modal content to use the new handleSelectOption function
  const renderModalContent = () => {
    if (!activeField) return null;
    
    return (
      <ScrollView>
        {activeField.items.map(item => (
          <TouchableOpacity
            key={item.value}
            style={styles.modalItem}
            onPress={() => handleSelectOption(item)}
          >
            <Text style={styles.modalItemText}>{item.label}</Text>
            {activeField.multiSelect === true ? (
              Array.isArray(activeField.selected) && 
              activeField.selected.includes(item.value) && (
                <Icon name="check" size={20} color="#5D3FD3" />
              )
            ) : (
              activeField.selected === item.value && (
                <Icon name="check" size={20} color="#5D3FD3" />
              )
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Exercise Name</Text>
        <TextInput 
          style={styles.input} 
          value={name} 
          onChangeText={setName}
          placeholder="Enter exercise name"
          placeholderTextColor="#999"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Description</Text>
        <TextInput 
          style={[styles.input, styles.textArea]} 
          value={description} 
          onChangeText={setDescription}
          placeholder="Describe the exercise"
          placeholderTextColor="#999"
          multiline
          numberOfLines={4}
        />
      </View>

      <View style={styles.rowContainer}>
        {renderPickerField(
          'Exercise Type',
          type,
          handleSingleSelect(setType),
          Object.entries(EXERCISE_TYPES).map(([key, value]) => ({
            label: value.charAt(0).toUpperCase() + value.slice(1),
            value
          }))
        )}

        {renderPickerField(
          'Equipment',
          equipment,
          handleSingleSelect(setEquipment),
          EQUIPMENT_TYPES.map(eq => ({
            label: eq.charAt(0).toUpperCase() + eq.slice(1),
            value: eq
          }))
        )}
      </View>

      <View style={styles.rowContainer}>
        {renderPickerField(
          'Difficulty',
          difficulty,
          handleSingleSelect(setDifficulty),
          DIFFICULTY_LEVELS.map(level => ({
            label: level.charAt(0).toUpperCase() + level.slice(1),
            value: level
          }))
        )}

        {renderPickerField(
          'Target Muscles',
          muscles,
          handleMultiSelect(setMuscles),
          MUSCLE_GROUPS.map(muscle => ({
            label: muscle.charAt(0).toUpperCase() + muscle.slice(1),
            value: muscle
          })),
          true
        )}
      </View>

      {renderListInput(
        'Instructions',
        instructions,
        setInstructions,
        'Add instruction step'
      )}

      {renderListInput(
        'Tips',
        tips,
        setTips,
        'Add helpful tip'
      )}

      {renderListInput(
        'Variations',
        variations,
        setVariations,
        'Add exercise variation'
      )}
      
      <View style={styles.buttonContainer}>
        <Button title="Save Exercise" onPress={handleSubmit} color="#5D3FD3" />
      </View>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <Animated.View 
            style={[
              styles.modalContent,
              { 
                transform: [{ 
                  translateY: slideAnim
                }] 
              }
            ]}
          >
            <View style={styles.modalHeader}>
              <Text style={styles.modalHeaderText}>{activeField?.label}</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Icon name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            {renderModalContent()}
          </Animated.View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  formGroup: {
    marginBottom: 16,
  },
  rowContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -8,
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
    color: '#444',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    color: '#333',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  pickerFieldContainer: {
    flex: 1,
    marginHorizontal: 8,
    marginBottom: 16,
  },
  selectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    height: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  selectButtonText: {
    fontSize: 16,
    color: '#333',
  },
  listInputContainer: {
    marginBottom: 16,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  listItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  listItemInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    color: '#333',
    marginRight: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  addButton: {
    padding: 8,
  },
  removeButton: {
    padding: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    maxHeight: '70%',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalHeaderText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  modalItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  modalItemText: {
    fontSize: 16,
    color: '#333',
  },
  buttonContainer: {
    marginTop: 16,
    marginBottom: 24,
  },
});

export default ExerciseForm;