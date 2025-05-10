import React, { useState, useContext, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Alert,
  Animated
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { AuthContext } from '../../contexts/AuthContext';
import BackgroundContainer from '../../components/common/BackgroundContainer';
import Logger from '../../utils/logger';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const { width } = Dimensions.get('window');

const LoginScreen = () => {
  const navigation = useNavigation();
  const { login, isAuthenticated } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const fadeAnim = useState(new Animated.Value(0))[0];
  const [tapCount, setTapCount] = useState(0);

  useEffect(() => {
    // Reset tap count after a delay
    if (tapCount > 0) {
      const timer = setTimeout(() => {
        setTapCount(0);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [tapCount]);

  useEffect(() => {
    // Fade in animation when screen loads
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
    
    // Log screen mount for debugging
    Logger.info('LoginScreen mounted');
  }, []);

  useEffect(() => {
    // Navigate to main app if authenticated
    if (isAuthenticated) {
      Logger.info('User authenticated, navigating to Main');
      navigation.navigate('Main' as never);
    }
  }, [isAuthenticated, navigation]);

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please enter both email and password');
      Logger.warn('Login attempted with missing fields');
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      
      Logger.info('Login attempt', { email });
      
      // Call login function from AuthContext
      await login(email, password);
      
      // Success message (this will show briefly before navigation)
      Alert.alert('Success', 'Login successful!');
      
    } catch (err) {
      Logger.error('Login failed', err);
      setError('Invalid credentials. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle debug gesture (multiple taps on title)
  const handleDebugPress = () => {
    const newCount = tapCount + 1;
    setTapCount(newCount);
    
    // After 3 taps, open the log viewer
    if (newCount >= 3) {
      // Navigate to log viewer
      Logger.info('Debug gesture activated, opening LogViewer');
      navigation.navigate('LogViewer' as never);
      setTapCount(0);
    }
  };

  return (
    <BackgroundContainer>
      <Animated.View 
        style={[
          styles.formContainer, 
          { opacity: fadeAnim, transform: [{ translateY: fadeAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [50, 0],
          }) }] }
        ]}
      >
        {/* Multiple tap on title area to open logs */}
        <TouchableOpacity 
          onPress={handleDebugPress} 
          style={styles.titleContainer}
          activeOpacity={0.8}
        >
          <Text style={styles.title}>FitTrack</Text>
          <Text style={styles.subtitle}>Train with purpose</Text>
        </TouchableOpacity>
        
        {error ? <Text style={styles.error}>{error}</Text> : null}
        
        <Input
          label="Email"
          placeholder="your.email@example.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        
        <Input
          label="Password"
          placeholder="Your password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        
        <Button 
          title={isLoading ? "Logging in..." : "Login"} 
          onPress={handleLogin}
          loading={isLoading}
          disabled={isLoading}
        />
        
        <TouchableOpacity 
          style={styles.registerLink}
          onPress={() => navigation.navigate('Register' as never)}
        >
          <Text style={styles.registerText}>Don't have an account? Sign up</Text>
        </TouchableOpacity>
        
        {/* Debug Button - More visible way to access logs */}
        <TouchableOpacity 
          style={styles.debugButton}
          onPress={() => navigation.navigate('LogViewer' as never)}
        >
          <Icon name="bug-outline" size={16} color="#5D3FD3" />
          <Text style={styles.debugText}>View Logs</Text>
        </TouchableOpacity>
      </Animated.View>
    </BackgroundContainer>
  );
};

const styles = StyleSheet.create({
  formContainer: {
    width: width * 0.85,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    padding: 25,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    elevation: 10,
    marginVertical: 20,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 15,
    padding: 5,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#5D3FD3',
    alignSelf: 'center',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
    color: '#666',
    alignSelf: 'center',
  },
  error: {
    color: '#D32F2F',
    backgroundColor: 'rgba(211, 47, 47, 0.1)',
    padding: 10,
    borderRadius: 4,
    marginBottom: 15,
    textAlign: 'center',
  },
  registerLink: {
    marginTop: 15,
    alignItems: 'center',
  },
  registerText: {
    color: '#5D3FD3',
    fontSize: 14,
  },
  debugButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15,
    padding: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(93, 63, 211, 0.1)',
  },
  debugText: {
    fontSize: 12,
    color: '#5D3FD3',
    marginLeft: 4,
    opacity: 0.7
  }
});

export default LoginScreen;