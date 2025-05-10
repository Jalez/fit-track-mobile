/**
 * Reanimated Setup Helper
 * This file helps ensure Reanimated is properly configured
 */

import { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';

// This export ensures Reanimated gets initialized properly
export const testWorklet = () => {
  'worklet';
  return true;
};

// Helper hook for basic animation
export const useBasicAnimation = () => {
  const opacity = useSharedValue(0);
  
  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });
  
  return {
    opacity,
    animatedStyle,
  };
};