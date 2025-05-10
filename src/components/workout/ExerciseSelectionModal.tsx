import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  Modal,
  TextInput,
  ActivityIndicator
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { WorkoutExercise } from '../../models/Exercise';
import { useExerciseStore } from '../../store/exerciseStore';

interface ExerciseSelectionModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectExercise: (exercise: WorkoutExercise) => void;
  selectedExercises: WorkoutExercise[];
}

const ExerciseSelectionModal: React.FC<ExerciseSelectionModalProps> = ({
  visible,
  onClose,
  onSelectExercise,
  selectedExercises
}) => {
  const { exercises, fetchExercises, isLoading } = useExerciseStore();
  const [searchQuery, setSearchQuery] = useState('');
  
  useEffect(() => {
    if (visible && exercises.length === 0) {
      fetchExercises();
    }
  }, [visible, exercises.length, fetchExercises]);

  const filteredExercises = exercises.filter(exercise => 
    exercise.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isExerciseSelected = (id: string) => {
    return selectedExercises.some(ex => ex.id === id);
  };

  const renderExerciseItem = ({ item }: { item: WorkoutExercise }) => (
    <TouchableOpacity 
      style={[
        styles.exerciseItem, 
        isExerciseSelected(item.id) && styles.selectedExerciseItem
      ]}
      onPress={() => onSelectExercise(item)}
      disabled={isExerciseSelected(item.id)}
    >
      <View style={styles.exerciseInfo}>
        <Text style={styles.exerciseName}>{item.name}</Text>
        <View style={styles.exerciseBadges}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{item.type}</Text>
          </View>
          {item.equipment && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{item.equipment}</Text>
            </View>
          )}
          {item.difficulty && (
            <View style={[
              styles.badge, 
              item.difficulty === 'beginner' ? styles.beginnerBadge : 
              item.difficulty === 'intermediate' ? styles.intermediateBadge : 
              styles.advancedBadge
            ]}>
              <Text style={styles.badgeText}>{item.difficulty}</Text>
            </View>
          )}
        </View>
      </View>
      
      {isExerciseSelected(item.id) ? (
        <Icon name="check-circle" size={24} color="#5D3FD3" />
      ) : (
        <Icon name="plus-circle-outline" size={24} color="#999" />
      )}
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.contentContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>Select Exercise</Text>
            <TouchableOpacity onPress={onClose}>
              <Icon name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.searchContainer}>
            <Icon name="magnify" size={20} color="#999" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search exercises..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#999"
            />
            {searchQuery !== '' && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Icon name="close-circle" size={18} color="#999" />
              </TouchableOpacity>
            )}
          </View>

          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#5D3FD3" />
              <Text style={styles.loadingText}>Loading exercises...</Text>
            </View>
          ) : (
            <FlatList
              data={filteredExercises}
              renderItem={renderExerciseItem}
              keyExtractor={item => item.id}
              contentContainerStyle={styles.listContainer}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Icon name="alert-circle-outline" size={48} color="#999" />
                  <Text style={styles.emptyText}>No exercises found</Text>
                </View>
              }
            />
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    width: '90%',
    maxHeight: '80%',
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    margin: 16,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    padding: 12,
    fontSize: 16,
    color: '#333',
  },
  listContainer: {
    padding: 16,
  },
  exerciseItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  selectedExerciseItem: {
    backgroundColor: '#f0eaff',
    borderColor: '#5D3FD3',
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  exerciseBadges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  badge: {
    backgroundColor: '#eee',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    marginRight: 8,
    marginTop: 4,
  },
  beginnerBadge: {
    backgroundColor: '#e6f7ee',
  },
  intermediateBadge: {
    backgroundColor: '#fdf3e0',
  },
  advancedBadge: {
    backgroundColor: '#fce8e8',
  },
  badgeText: {
    fontSize: 12,
    color: '#666',
  },
  loadingContainer: {
    padding: 32,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    marginTop: 12,
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginTop: 12,
  },
});

export default ExerciseSelectionModal;