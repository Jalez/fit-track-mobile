import React from 'react';
import { 
  ImageBackground, 
  StyleSheet, 
  View, 
  KeyboardAvoidingView, 
  Platform,
  SafeAreaView,
  StatusBar,
  ViewStyle
} from 'react-native';

type BackgroundContainerProps = {
  children: React.ReactNode;
  style?: ViewStyle;
  overlayOpacity?: number;
  disableKeyboardAvoiding?: boolean;
};

/**
 * A reusable background container component that provides consistent styling
 * throughout the app, including the fitness background image that extends
 * behind the status bar and navigation bar.
 */
const BackgroundContainer: React.FC<BackgroundContainerProps> = ({ 
  children, 
  style,
  overlayOpacity = 0.3,
  disableKeyboardAvoiding = false
}) => {
  const content = (
    <View style={[styles.overlay, { backgroundColor: `rgba(0, 0, 0, ${overlayOpacity})` }]}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <SafeAreaView style={[styles.container, style]}>
        {children}
      </SafeAreaView>
    </View>
  );

  return (
    <ImageBackground 
      source={require('../../../image.png')} 
      style={styles.backgroundImage}
      imageStyle={styles.imageStyle}
      resizeMode="cover"
    >
      {disableKeyboardAvoiding ? (
        content
      ) : (
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoidingView}
        >
          {content}
        </KeyboardAvoidingView>
      )}
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  imageStyle: {
    width: '100%',
    height: '100%',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    // Apply padding to account for the status bar
    paddingTop: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight,
  },
  container: {
    flex: 1,
  },
});

export default BackgroundContainer;