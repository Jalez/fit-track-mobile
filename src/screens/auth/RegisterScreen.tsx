import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { AuthContext } from '../../contexts/AuthContext';
import BackgroundContainer from '../../components/common/BackgroundContainer';

const { width } = Dimensions.get('window');

const RegisterScreen = () => {
  const navigation = useNavigation();
  const { register } = useContext(AuthContext);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    if (!name || !email || !password) {
      setError('Please fill out all fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      await register(email, password, name);
    } catch (err) {
      setError('Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <BackgroundContainer>
      <View style={styles.formContainer}>
        <Text style={styles.title}>Create Account</Text>
        {error ? <Text style={styles.error}>{error}</Text> : null}
        
        <Input
          label="Full Name"
          placeholder="Your full name"
          value={name}
          onChangeText={setName}
        />
        
        <Input
          label="Email"
          placeholder="your.email@example.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        
        <Input
          label="Password"
          placeholder="Choose a secure password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        
        <Input
          label="Confirm Password"
          placeholder="Enter password again"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />
        
        <Button
          title={isLoading ? "Creating account..." : "Register"}
          onPress={handleRegister} 
          loading={isLoading}
          disabled={isLoading}
        />
        
        <TouchableOpacity 
          style={styles.loginLink}
          onPress={() => navigation.navigate('Login' as never)} 
        >
          <Text style={styles.loginText}>Already have an account? Login</Text>
        </TouchableOpacity>
      </View>
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
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#5D3FD3',
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
  loginLink: {
    marginTop: 15,
    alignItems: 'center',
  },
  loginText: {
    color: '#5D3FD3',
    fontSize: 14,
  },
});

export default RegisterScreen;