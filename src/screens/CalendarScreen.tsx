import React, { useState, useRef, useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { GestureHandlerRootView, TapGestureHandler, State } from 'react-native-gesture-handler';
import { useWorkoutScheduling } from '../hooks/useWorkoutScheduling';
import { getMonthName, formatDate, getDayHeaders } from '../utils/calendarUtils';

import CompactCalendarGrid from '../components/workout/CompactCalendarGrid';



const CalendarScreen = () => {
  const { 
    workouts, 
    getScheduledWorkoutForDate, 
    scheduleWorkoutForDate,
    unscheduleWorkoutForDate,
    getWorkoutById
  } = useWorkoutScheduling();
  
      const [selectedDate, setSelectedDate] = useState(new Date());
  const [showWorkoutModal, setShowWorkoutModal] = useState(false);
  const [forceUpdate, setForceUpdate] = useState(0);
 
  const scrollViewRef = useRef<ScrollView>(null);
  const monthContainerRef = useRef<View>(null);
  const [calendarHeight, setCalendarHeight] = useState(286); // Default fallback
  
  // Generate months for the last 2 years and next 2 years
  const months = useMemo(() => {
    const months = [];
    const currentDate = new Date(); // Always use current date
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    
    console.log('Generating months around:', currentMonth + 1, currentYear);
    
    // Generate 24 months before current month (2 years)
    for (let i = 24; i >= 1; i--) {
      const monthsBack = i;
      const targetMonth = currentMonth - monthsBack;
      const year = currentYear + Math.floor(targetMonth / 12);
      const month = ((targetMonth % 12) + 12) % 12;
      months.push(new Date(year, month, 1));
    }
    
    // Add current month
    months.push(new Date(currentYear, currentMonth, 1));
    
    // Generate 24 months after current month (2 years)
    for (let i = 1; i <= 24; i++) {
      const monthsForward = i;
      const targetMonth = currentMonth + monthsForward;
      const year = currentYear + Math.floor(targetMonth / 12);
      const month = targetMonth % 12;
      months.push(new Date(year, month, 1));
    }
    
    return months;
  }, [forceUpdate]); // Re-generate when forceUpdate changes
  
  // Debug: Log the generated months to check for duplicates
  console.log('Generated months:', months.map(m => `${m.getFullYear()}-${m.getMonth() + 1}`));
  console.log('Array length:', months.length);
  console.log('Current month should be at index 24 (middle of array)');
  
  // Find current month index for debugging
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();
  const debugCurrentIndex = months.findIndex(monthDate => 
    monthDate.getFullYear() === currentYear && monthDate.getMonth() === currentMonth
  );
  console.log('Debug - Current month found at index:', debugCurrentIndex);

  const handleDatePress = (date: Date) => {
    setSelectedDate(date);
    setShowWorkoutModal(true);
  };

  const handleScheduleWorkout = (workoutId: string) => {
    const dateStr = formatDate(selectedDate);
    scheduleWorkoutForDate(workoutId, dateStr);
    setShowWorkoutModal(false);
  };

  const handleUnscheduleWorkout = () => {
    const scheduled = getScheduledWorkoutForDate(formatDate(selectedDate));
    if (scheduled) {
      unscheduleWorkoutForDate(scheduled.id);
    }
    setShowWorkoutModal(false);
  };

  const handleCloseModal = () => {
    setShowWorkoutModal(false);
  };

  const measureCalendarHeight = useCallback(() => {
    if (monthContainerRef.current) {
      monthContainerRef.current.measure((x, y, width, height, pageX, pageY) => {
        setCalendarHeight(height);
        console.log('Measured calendar height:', height);
      });
    }
  }, []);

  const handleDoubleTap = useCallback(() => {
    // Force a re-render to update the months array with current date
    setForceUpdate(prev => prev + 1);
    
    // Use setTimeout to ensure the months array is updated before scrolling
    setTimeout(() => {
      // Find the current month dynamically
      const now = new Date();
      const currentYear = now.getFullYear();
      const currentMonth = now.getMonth();
      
      console.log('Current date:', now.toDateString());
      console.log('Looking for month:', currentMonth + 1, currentYear);
      
      // Calculate the current month index directly
      // Array starts with 24 months before current, then current month, then 24 months after
      // So current month should be at index 24
      const currentMonthIndex = 22;
      
      // Debug: Log all months to see the array structure
      console.log('All months in array:', months.map((m, i) => `${i}: ${m.getFullYear()}-${m.getMonth() + 1}`));
      
      console.log('Using current month index:', currentMonthIndex);
      console.log('Calendar height:', calendarHeight);
      
      // Debug: Check what month is at the calculated index
      const targetMonth = months[currentMonthIndex];
      console.log('Target month at index', currentMonthIndex, ':', targetMonth.getFullYear() + '-' + (targetMonth.getMonth() + 1));
      
      // Scroll to the current month using measured height
      scrollViewRef.current?.scrollTo({
        y: currentMonthIndex * calendarHeight,
        animated: true
      });
      console.log('Scroll position:', currentMonthIndex * calendarHeight);
    }, 0);
  }, [months, calendarHeight]);

  const onDoubleTap = useCallback((event: any) => {
    if (event.nativeEvent.state === State.ACTIVE) {
      handleDoubleTap();
    }
  }, [handleDoubleTap]);

  const getWorkoutCountForDate = useCallback((date: Date): number => {
    const dateStr = formatDate(date);
    const scheduled = getScheduledWorkoutForDate(dateStr);
    return scheduled ? 1 : 0;
  }, [getScheduledWorkoutForDate]);

  const scheduledWorkout = getScheduledWorkoutForDate(formatDate(selectedDate));
  const selectedWorkout = scheduledWorkout ? getWorkoutById(scheduledWorkout.workoutId) : null;

  return (
      <GestureHandlerRootView style={styles.container}>
        <TapGestureHandler
          numberOfTaps={2}
          onHandlerStateChange={onDoubleTap}
        >
          <View style={styles.container}>
            {/* Fixed Day Header */}
            <View style={styles.fixedDayHeader}>
              {/* Month label to match month name space */}
              <View style={styles.monthLabelContainer}>
                <View style={styles.monthLabelWrapper}>
                  <Text style={styles.monthLabelText}>M</Text>
                </View>
              </View>
              {getDayHeaders().map((day, index) => (
                <View key={index} style={[styles.dayHeaderContainer, { width: `${100 / 7}%` }]}>
                  <Text style={styles.dayHeaderText}>{day}</Text>
                </View>
              ))}
            </View>

            {/* Vertical Scrollable Calendar */}
            <ScrollView
              ref={scrollViewRef}
              showsVerticalScrollIndicator={false}
              style={styles.calendarScrollView}
              contentContainerStyle={styles.calendarContent}
            >
              <View style={styles.calendarContainer}>
                {useMemo(() => 
                  months.map((monthDate, index) => (
                    <View 
                      key={index} 
                      style={styles.monthContainer}
                      ref={index === 0 ? monthContainerRef : undefined}
                      onLayout={index === 0 ? measureCalendarHeight : undefined}
                    >
                      {/* Month Name - Vertical on the left */}
                      <View style={styles.monthNameContainer}>
                        <View style={styles.monthNameWrapper}>
                          <Text style={styles.monthNameText}>
                            {getMonthName(monthDate)} {monthDate.getFullYear()}
                          </Text>
                        </View>
                      </View>
                      
                      {/* Compact Calendar Grid */}
                      <View style={styles.calendarGridContainer}>
                        <CompactCalendarGrid
                          monthDate={monthDate}
                          getWorkoutCountForDate={getWorkoutCountForDate}
                          onDatePress={handleDatePress}
                          zoomLevel={1}
                          hideDayHeaders={true}
                        />
                      </View>
                    </View>
                  )), [months, getWorkoutCountForDate, handleDatePress]
                )}
              </View>
            </ScrollView>
          </View>
        </TapGestureHandler>

        {/* Workout Selection Modal */}
        <Modal
          visible={showWorkoutModal}
          transparent
          animationType="fade"
          onRequestClose={handleCloseModal}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>
                  {selectedDate.toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </Text>
                <TouchableOpacity onPress={handleCloseModal} style={styles.closeButton}>
                  <Icon name="close" size={24} color="#fff" />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
                {scheduledWorkout && selectedWorkout ? (
                  <View style={styles.scheduledWorkout}>
                    <Text style={styles.scheduledTitle}>Scheduled Workout:</Text>
                    <View style={styles.workoutInfo}>
                      <Text style={styles.workoutName}>{selectedWorkout.name}</Text>
                      <Text style={styles.workoutDescription}>{selectedWorkout.description}</Text>
                    </View>
                    <TouchableOpacity 
                      style={styles.unscheduleButton}
                      onPress={handleUnscheduleWorkout}
                    >
                      <Text style={styles.unscheduleButtonText}>Unschedule Workout</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View style={styles.availableWorkouts}>
                    <Text style={styles.availableTitle}>Available Workouts:</Text>
                    {workouts.map(workout => (
                      <TouchableOpacity
                        key={workout.id}
                        style={styles.workoutOption}
                        onPress={() => handleScheduleWorkout(workout.id)}
                      >
                        <Text style={styles.workoutOptionName}>{workout.name}</Text>
                        <Text style={styles.workoutOptionDescription}>{workout.description}</Text>
                        <Text style={styles.workoutOptionDuration}>{workout.duration} min</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </ScrollView>
            </View>
          </View>
        </Modal>
      </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },

  calendarContainer: {
    flex: 1,
  },

  calendarScrollView: {
    flex: 1,
  },
  calendarContent: {
    paddingBottom: 20,
  },
  monthRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  monthContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    
  },
  monthNameContainer: {
    alignItems: 'center',
    justifyContent: 'center',


  },
  monthNameText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    flexShrink: 0,
    width: 120,
    height: 20,
  },
  monthNameWrapper: {
    transform: [{ rotate: '-90deg' }],
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  monthLabelContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  monthLabelText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    width: 20,
    height: 20,
  },
  monthLabelWrapper: {
    transform: [{ rotate: '-90deg' }],
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fixedDayHeader: {
    flexDirection: 'row',
    paddingVertical: 14,
    zIndex: 1000,
  },

  dayHeaderContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayHeaderText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
  },
  calendarGridContainer: {
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    borderRadius: 20,
    width: '100%',
    maxHeight: '70%',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
  },
  closeButton: {
    padding: 5,
  },
  modalBody: {
    padding: 20,
  },
  scheduledWorkout: {
    marginBottom: 20,
  },
  scheduledTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  workoutInfo: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  workoutName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  workoutDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 5,
  },
  unscheduleButton: {
    backgroundColor: '#dc3545',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  unscheduleButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  availableWorkouts: {
    marginBottom: 20,
  },
  availableTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
  },
  workoutOption: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  workoutOptionName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  workoutOptionDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 5,
  },
  workoutOptionDuration: {
    fontSize: 14,
    color: '#5D3FD3',
    fontWeight: '600',
  },
});

export default CalendarScreen; 