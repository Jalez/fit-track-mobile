import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import BackgroundContainer from '../../components/common/BackgroundContainer';
import useExercise from '../../hooks/useExercise';
import { ExerciseStackParamList } from '../../navigation/ExerciseNavigator';

type ExerciseDetailRouteProp = RouteProp<ExerciseStackParamList, 'ExerciseDetail'>;
type ExerciseDetailNavigationProp = StackNavigationProp<ExerciseStackParamList, 'ExerciseDetail'>;

interface Exercise {
  id: string;
  name: string;
  description: string;
  type: string;
  equipment?: string;
  difficulty?: string;
  muscles?: string[];
  instructions?: string[];
  tips?: string[];
  variations?: string[];
  imagePath?: string | null;
}

const ExerciseDetailScreen = () => {
  const route = useRoute<ExerciseDetailRouteProp>();
  const navigation = useNavigation<ExerciseDetailNavigationProp>();
  const { exerciseId } = route.params;
  const [loading, setLoading] = useState(true);
  const [exercise, setExercise] = useState<Exercise | null>(null);

  useEffect(() => {
    // Simulate loading the exercise data
    setTimeout(() => {
      // In a real app, you would fetch this from your API or hook
      // const fetchedExercise = getExerciseById(exerciseId);
      const fetchedExercise: Exercise = {
        id: exerciseId,
        name: 'Barbell Squat',
        description: 'A compound, full-body exercise that primarily targets the quadriceps, hamstrings, and glutes.',
        type: 'strength',
        equipment: 'barbell',
        difficulty: 'intermediate',
        muscles: ['quadriceps', 'hamstrings', 'glutes', 'lower back'],
        instructions: [
          'Stand with your feet shoulder-width apart, with a barbell across your upper back.',
          'Brace your core and maintain a neutral spine position.',
          'Bend your knees and hips to lower your body, as if sitting back into a chair.',
          'Lower until your thighs are at least parallel to the floor.',
          'Push through your heels to return to the starting position.',
          'Repeat for the prescribed number of repetitions.'
        ],
        tips: [
          'Keep your chest up and back straight throughout the movement.',
          'Don\'t let your knees cave inward; push them outward in line with your toes.',
          'Maintain weight on your heels and mid-foot, not on your toes.',
          'Breathe in as you lower, and exhale as you push back up.'
        ],
        variations: [
          'Front squat',
          'Goblet squat',
          'Bulgarian split squat',
          'Hack squat'
        ],
        imagePath: "https://training.fit/wp-content/uploads/2020/03/kniebeugen-langhantel.png" // In a real app, this would be an actual image path
      };
      
      setExercise(fetchedExercise);
      setLoading(false);
    }, 500);
  }, [exerciseId]);

  const getMuscleIcon = (muscle: string): string => {
    switch (muscle.toLowerCase()) {
      case 'quadriceps':
      case 'quads':
        return 'human-male';
      case 'hamstrings':
        return 'human-male';
      case 'glutes':
        return 'human-male';
      case 'lower back':
      case 'back':
        return 'human-male';
      case 'chest':
        return 'human-male';
      case 'shoulders':
        return 'arm-flex';
      case 'triceps':
        return 'arm-flex';
      case 'biceps':
        return 'arm-flex';
      case 'forearms':
        return 'arm-flex';
      case 'abs':
      case 'core':
        return 'human-male';
      case 'calves':
        return 'human-male';
      default:
        return 'human';
    }
  };

  const getEquipmentIcon = (equipment: string | undefined): string => {
    switch (equipment?.toLowerCase()) {
      case 'barbell':
        return 'weight-lifter';
      case 'dumbbell':
        return 'dumbbell';
      case 'kettlebell':
        return 'weight';
      case 'machine':
        return 'robot';
      case 'bodyweight':
        return 'human';
      case 'cable':
        return 'pulley';
      case 'resistance band':
        return 'yoga';
      case 'medicine ball':
        return 'basketball';
      default:
        return 'dumbbell';
    }
  };

  const getDifficultyColor = (difficulty: string | undefined): string => {
    switch (difficulty?.toLowerCase()) {
      case 'beginner':
        return '#4CAF50'; // Green
      case 'intermediate':
        return '#FF9800'; // Orange
      case 'advanced':
        return '#F44336'; // Red
      default:
        return '#2196F3'; // Blue
    }
  };

  if (loading) {
    return (
      <BackgroundContainer>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#5D3FD3" />
          <Text style={styles.loadingText}>Loading exercise details...</Text>
        </View>
      </BackgroundContainer>
    );
  }

  if (!exercise) {
    return (
      <BackgroundContainer>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Exercise not found</Text>
        </View>
      </BackgroundContainer>
    );
  }

  return (
    <BackgroundContainer>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Text style={styles.headerTitle}>Exercise Details</Text>
        </View>
        <TouchableOpacity 
          style={styles.favoriteButton}
          onPress={() => {/* Add to favorites logic */}}
        >
          <Icon name="heart-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.exerciseHeader}>
          <View style={styles.exerciseImageContainer}>
            {exercise.imagePath ? (
              <Image 
                source={{ uri: exercise.imagePath }}
                style={styles.exerciseImage} 
                resizeMode="cover"
              />
            ) : (
              <View style={styles.placeholderImage}>
                <Icon name="dumbbell" size={60} color="#5D3FD3" />
              </View>
            )}
          </View>
          <Text style={styles.exerciseName}>{exercise.name}</Text>
          
          <View style={styles.badgeContainer}>
            <View style={[
              styles.badge, 
              { backgroundColor: getDifficultyColor(exercise.difficulty) }
            ]}>
              <Text style={styles.badgeText}>
                {exercise.difficulty ? 
                  exercise.difficulty.charAt(0).toUpperCase() + exercise.difficulty.slice(1) 
                  : 'All Levels'}
              </Text>
            </View>
            <View style={styles.badge}>
              <Icon 
                name={getEquipmentIcon(exercise.equipment)} 
                size={14} 
                color="#fff" 
                style={styles.badgeIcon} 
              />
              <Text style={styles.badgeText}>
                {exercise.equipment ? 
                  exercise.equipment.charAt(0).toUpperCase() + exercise.equipment.slice(1) 
                  : 'Any Equipment'}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Icon name="information-outline" size={22} color="#5D3FD3" />
            <Text style={styles.sectionTitle}>Description</Text>
          </View>
          <Text style={styles.sectionText}>{exercise.description}</Text>
        </View>

        {exercise.muscles && exercise.muscles.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Icon name="muscle" size={22} color="#5D3FD3" />
              <Text style={styles.sectionTitle}>Target Muscles</Text>
            </View>
            <View style={styles.muscleContainer}>
              {exercise.muscles.map((muscle, index) => (
                <View key={index} style={styles.muscleItem}>
                  <Icon name={getMuscleIcon(muscle)} size={22} color="#5D3FD3" />
                  <Text style={styles.muscleText}>
                    {muscle.charAt(0).toUpperCase() + muscle.slice(1)}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {exercise.instructions && exercise.instructions.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Icon name="clipboard-list-outline" size={22} color="#5D3FD3" />
              <Text style={styles.sectionTitle}>Instructions</Text>
            </View>
            {exercise.instructions.map((instruction, index) => (
              <View key={index} style={styles.instructionItem}>
                <View style={styles.instructionNumber}>
                  <Text style={styles.instructionNumberText}>{index + 1}</Text>
                </View>
                <Text style={styles.instructionText}>{instruction}</Text>
              </View>
            ))}
          </View>
        )}

        {exercise.tips && exercise.tips.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Icon name="lightbulb-outline" size={22} color="#5D3FD3" />
              <Text style={styles.sectionTitle}>Tips</Text>
            </View>
            {exercise.tips.map((tip, index) => (
              <View key={index} style={styles.tipItem}>
                <Icon name="check-circle-outline" size={18} color="#5D3FD3" style={styles.tipIcon} />
                <Text style={styles.tipText}>{tip}</Text>
              </View>
            ))}
          </View>
        )}

        {exercise.variations && exercise.variations.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Icon name="shuffle-variant" size={22} color="#5D3FD3" />
              <Text style={styles.sectionTitle}>Variations</Text>
            </View>
            <View style={styles.variationsContainer}>
              {exercise.variations.map((variation, index) => (
                <TouchableOpacity 
                  key={index} 
                  style={styles.variationItem}
                  onPress={() => {/* Navigate to variation */}}
                >
                  <Text style={styles.variationText}>{variation}</Text>
                  <Icon name="chevron-right" size={20} color="#777" />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.addToWorkoutButton}
            onPress={() => {/* Add to workout logic */}}
          >
            <Icon name="playlist-plus" size={20} color="#fff" style={styles.buttonIcon} />
            <Text style={styles.buttonText}>Add to Workout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </BackgroundContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  favoriteButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  exerciseHeader: {
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  exerciseImageContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: 'hidden',
    marginBottom: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  exerciseImage: {
    width: '100%',
    height: '100%',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  exerciseName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  badgeContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#5D3FD3',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginHorizontal: 4,
    marginBottom: 4,
  },
  badgeIcon: {
    marginRight: 4,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  section: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 8,
  },
  sectionText: {
    fontSize: 15,
    color: '#555',
    lineHeight: 22,
  },
  muscleContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4,
  },
  muscleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 8,
  },
  muscleText: {
    fontSize: 15,
    color: '#444',
    marginLeft: 6,
  },
  instructionItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  instructionNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#5D3FD3',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  instructionNumberText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  instructionText: {
    flex: 1,
    fontSize: 15,
    color: '#555',
    lineHeight: 22,
  },
  tipItem: {
    flexDirection: 'row',
    marginBottom: 10,
    alignItems: 'flex-start',
  },
  tipIcon: {
    marginRight: 8,
    marginTop: 2,
  },
  tipText: {
    flex: 1,
    fontSize: 15,
    color: '#555',
    lineHeight: 22,
  },
  variationsContainer: {
    marginTop: 4,
  },
  variationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  variationText: {
    fontSize: 15,
    color: '#444',
  },
  buttonContainer: {
    marginHorizontal: 16,
    marginBottom: 30,
  },
  addToWorkoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#5D3FD3',
    paddingVertical: 16,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default ExerciseDetailScreen;