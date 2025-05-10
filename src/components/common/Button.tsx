import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  Animated,
  Easing,
  View
} from 'react-native';

type ButtonProps = {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  type?: 'primary' | 'secondary' | 'outline';
};

const Button = ({ 
  title, 
  onPress, 
  loading = false, 
  disabled = false,
  style,
  textStyle,
  type = 'primary',
}: ButtonProps) => {
  // Animation for press feedback
  const scaleAnim = React.useRef(new Animated.Value(1)).current;
  
  const handlePressIn = () => {
    Animated.timing(scaleAnim, {
      toValue: 0.95,
      duration: 150,
      useNativeDriver: true,
      easing: Easing.inOut(Easing.ease),
    }).start();
  };
  
  const handlePressOut = () => {
    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: 150,
      useNativeDriver: true,
      easing: Easing.inOut(Easing.ease),
    }).start();
  };

  const getButtonStyle = () => {
    if (type === 'secondary') return [styles.button, styles.buttonSecondary, style];
    if (type === 'outline') return [styles.button, styles.buttonOutline, style];
    return [styles.button, styles.buttonPrimary, style];
  };

  const getTextStyle = () => {
    if (type === 'secondary') return [styles.text, styles.textSecondary, textStyle];
    if (type === 'outline') return [styles.text, styles.textOutline, textStyle];
    return [styles.text, styles.textPrimary, textStyle];
  };

  const getLoadingColor = () => {
    if (type === 'outline') return '#5D3FD3';
    if (type === 'secondary') return '#5D3FD3';
    return 'white';
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity 
        style={[getButtonStyle(), (disabled || loading) && styles.buttonDisabled]} 
        onPress={onPress}
        disabled={disabled || loading}
        activeOpacity={0.8}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <View style={styles.contentContainer}>
          {loading ? (
            <ActivityIndicator color={getLoadingColor()} size="small" />
          ) : (
            <Text style={getTextStyle()}>
              {title}
            </Text>
          )}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonPrimary: {
    backgroundColor: '#5D3FD3',
    borderWidth: 0,
  },
  buttonSecondary: {
    backgroundColor: '#F5F5F5',
  },
  buttonOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: '#5D3FD3',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  textPrimary: {
    color: 'white',
  },
  textSecondary: {
    color: '#333',
  },
  textOutline: {
    color: '#5D3FD3',
  },
});

export default Button;