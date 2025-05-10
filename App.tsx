/**
 * Main entry point for FitTrack
 */

import React, { useState, useEffect } from 'react';
import { StatusBar, View, StyleSheet, LogBox, Text, SafeAreaView, ScrollView } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';
import { AuthProvider } from './src/contexts/AuthContext';
import { WorkoutProvider } from './src/contexts/WorkoutContext';
import ErrorBoundary from './src/components/common/ErrorBoundary';
import Logger from './src/utils/logger';
// Ensure Reanimated is correctly set up
import { GestureHandlerRootView } from 'react-native-gesture-handler';
// Import our Reanimated setup helper
import { testWorklet } from './src/utils/reanimatedSetup';

// Define types for global ErrorUtils
declare global {
  namespace NodeJS {
    interface Global {
      ErrorUtils: {
        getGlobalHandler: () => (error: Error, isFatal?: boolean) => void;
        setGlobalHandler: (callback: (error: Error, isFatal?: boolean) => void) => void;
      }
    }
  }
}

// Get access to ErrorUtils in a type-safe way
const ErrorUtils = (global as any).ErrorUtils;

// Ignore specific warnings that might be noise
LogBox.ignoreLogs([
  'Sending `onAnimatedValueUpdate` with no listeners registered',
  '[react-native-gesture-handler] Seems like you\'re using an old API'
]);

const DEBUG_MODE = true; // Set to true for detailed error information

// Type definitions for error display props
interface ErrorDisplayProps {
  error: Error | null | unknown;
  componentStack?: string | null;
}

// Component for displaying errors
const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error, componentStack }) => (
  <SafeAreaView style={styles.errorContainer}>
    <Text style={styles.errorTitle}>Error Detected</Text>
    <ScrollView style={styles.errorScrollView}>
      <Text style={styles.errorText}>
        {error instanceof Error ? error.message : 'Unknown error'}
      </Text>
      <Text style={styles.errorStack}>
        {componentStack || (error instanceof Error ? error.stack : 'No stack trace available')}
      </Text>
    </ScrollView>
  </SafeAreaView>
);

// Define types for error boundary
interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

// Custom error boundary to catch errors
class CustomErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error, errorInfo: null };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    // Only log the error, don't try to display it here to avoid loops
    Logger.error('React error boundary caught error', { 
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack
    });
    
    this.setState({ errorInfo });
  }

  render(): React.ReactNode {
    if (this.state.hasError && DEBUG_MODE) {
      return (
        <ErrorDisplay 
          error={this.state.error} 
          componentStack={this.state.errorInfo?.componentStack} 
        />
      );
    }
    return this.props.children;
  }
}

// Modified App component with try-catch and detailed logging
const App = () => {
  const [startupError, setStartupError] = useState<Error | null>(null);
  const [reanimatedReady, setReanimatedReady] = useState(false);

  // Set up global error handlers
  useEffect(() => {
    if (!DEBUG_MODE) return;

    // Store original handlers
    const originalErrorHandler = ErrorUtils.getGlobalHandler();

    // Set up global error handler
    ErrorUtils.setGlobalHandler((error: Error, isFatal?: boolean) => {
      // Only log the error, don't try to display it in console
      Logger.error(`Global JS Error (${isFatal ? 'Fatal' : 'Non-fatal'})`, {
        message: error.message,
        stack: error.stack
      });
      
      if (isFatal) {
        setStartupError(error);
      }
      
      // Call original handler
      originalErrorHandler(error, isFatal);
    });
    
    Logger.info('App started', { 
      timestamp: new Date().toISOString(),
      debug: DEBUG_MODE 
    });

    return () => {
      // Reset to original handler on cleanup
      ErrorUtils.setGlobalHandler(originalErrorHandler);
    };
  }, []);

  // Test Reanimated worklet initialization
  useEffect(() => {
    try {
      const isWorkletReady = testWorklet();
      setReanimatedReady(true);
      Logger.info('Reanimated worklet initialized successfully');
    } catch (error) {
      if (error instanceof Error) {
        Logger.error('Reanimated worklet initialization failed', { 
          message: error.message, 
          stack: error.stack 
        });
      }
    }
  }, []);

  // If startup error occurred
  if (startupError) {
    return <ErrorDisplay error={startupError} componentStack={startupError.stack} />;
  }

  // Wrap the entire app in a try-catch as a last resort
  try {
    return (
      <CustomErrorBoundary>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <View style={styles.container}>
            <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
            <AuthProvider>
              <WorkoutProvider>
                <AppNavigator />
              </WorkoutProvider>
            </AuthProvider>
          </View>
        </GestureHandlerRootView>
      </CustomErrorBoundary>
    );
  } catch (error) {
    Logger.error('Critical error in App render', error);
    return <ErrorDisplay error={error} componentStack={error instanceof Error ? error.stack : undefined} />;
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  errorContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8d7da',
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#721c24',
    marginBottom: 15,
  },
  errorScrollView: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.05)',
    padding: 12,
    borderRadius: 8,
  },
  errorText: {
    fontSize: 16,
    color: '#721c24',
    marginBottom: 12,
    fontWeight: 'bold',
  },
  errorStack: {
    fontSize: 14,
    color: '#721c24',
    fontFamily: 'Courier',
    marginTop: 8,
  }
});

export default App;
