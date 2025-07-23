import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { getDaysInMonth, getDayHeaders, formatDate } from '../../utils/calendarUtils';

interface CompactCalendarGridProps {
  monthDate: Date;
  getWorkoutCountForDate: (date: Date) => number;
  onDatePress: (date: Date) => void;
  zoomLevel: number;
  hideDayHeaders?: boolean;
}

const CompactCalendarGrid: React.FC<CompactCalendarGridProps> = ({
  monthDate,
  getWorkoutCountForDate,
  onDatePress,
  zoomLevel,
  hideDayHeaders = false
}) => {
  const days = getDaysInMonth(monthDate);
  const dayHeaders = getDayHeaders();

  const getDayStyle = (date: Date | null, workoutCount: number) => {
    if (!date) return styles.emptyDay;
    
    const baseStyle = [styles.day];
    
    // Add workout indicator based on count
    if (workoutCount > 0) {
      baseStyle.push(styles.hasWorkout as any);
      if (workoutCount >= 2) {
        baseStyle.push(styles.multipleWorkouts as any);
      }
    }
    
    return baseStyle;
  };

  const getDayTextStyle = (date: Date | null, workoutCount: number) => {
    if (!date) return styles.emptyDayText;
    
    const baseStyle = [styles.dayText];
    
    if (workoutCount > 0) {
      baseStyle.push(styles.workoutDayText as any);
    }
    
    return baseStyle;
  };

  const getWorkoutIndicator = (workoutCount: number) => {
    if (workoutCount === 0) return null;
    
    const indicatorSize = zoomLevel === 1 ? 8 : 6;
    const textSize = zoomLevel === 1 ? 6 : 4;
    
    return (
      <View style={[
        styles.workoutIndicator,
        workoutCount >= 2 && styles.multipleWorkoutIndicator,
        { 
          width: indicatorSize, 
          height: indicatorSize,
          borderRadius: indicatorSize / 2
        }
      ]}>
        <Text style={[styles.workoutCountText, { fontSize: textSize }]}>{workoutCount}</Text>
      </View>
    );
  };

  // Calculate responsive day size based on container width
  const containerWidth = 300; // Approximate container width, will be made dynamic
  const daySize = Math.min(
    zoomLevel === 1 ? 35 : 20,
    (containerWidth - 32) / 7 // Account for margins and padding
  );
  const fontSize = zoomLevel === 1 ? 14 : 10;

  return (
    <View style={styles.calendar}>
      {/* Day headers - only show if not hidden */}
      {!hideDayHeaders && (
        <View style={styles.dayHeaders}>
          {dayHeaders.map((day, index) => (
            <View key={`header-${index}`} style={[styles.dayHeaderContainer, { width: `${100 / 7}%` }]}>
              <Text style={[styles.dayHeader, { fontSize }]}>{day}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Calendar days */}
      <View style={styles.daysGrid}>
        {Array.from({ length: Math.ceil(days.length / 7) }, (_, weekIndex) => (
          <View key={weekIndex} style={styles.weekRow}>
            {days.slice(weekIndex * 7, (weekIndex + 1) * 7).map((date, dayIndex) => {
              const workoutCount = date ? getWorkoutCountForDate(date) : 0;
              
              return (
                <TouchableOpacity
                  key={weekIndex * 7 + dayIndex}
                  style={[
                    getDayStyle(date, workoutCount),
                    { 
                      width: `${100 / 7}%`,
                      aspectRatio: 1
                    }
                  ]}
                  onPress={() => date && onDatePress(date)}
                  disabled={!date}
                >
                  {date && (
                    <>
                      <Text style={[
                        getDayTextStyle(date, workoutCount),
                        { fontSize }
                      ]}>
                        {date.getDate()}
                      </Text>
                      {getWorkoutIndicator(workoutCount)}
                    </>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  calendar: {
    flex: 1,
    width: '100%',
  },
  dayHeaders: {
    flexDirection: 'row',
  },
  dayHeaderContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayHeader: {
    textAlign: 'center',
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.7)',
  },
  daysGrid: {
    flexDirection: 'column',
  },
  weekRow: {
    flexDirection: 'row',
    width: '100%',
  },
  day: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    position: 'relative',
  },
  emptyDay: {
    backgroundColor: 'transparent',
  },
  dayText: {
    color: '#fff',
    fontWeight: '500',
  },
  emptyDayText: {
    color: 'transparent',
  },
  hasWorkout: {
    backgroundColor: 'rgba(93, 63, 211, 0.3)',
    borderColor: '#5D3FD3',
  },
  multipleWorkouts: {
    backgroundColor: 'rgba(93, 63, 211, 0.6)',
  },
  workoutDayText: {
    color: '#fff',
    fontWeight: '600',
  },
  workoutIndicator: {
    position: 'absolute',
    top: 1,
    right: 1,
    backgroundColor: '#5D3FD3',
    justifyContent: 'center',
    alignItems: 'center',
  },
  multipleWorkoutIndicator: {
    // Size is set dynamically based on zoom level
  },
  workoutCountText: {
    color: '#fff',
    fontSize: 6,
    fontWeight: 'bold',
  },
});

export default CompactCalendarGrid; 