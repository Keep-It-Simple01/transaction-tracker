import React, { useState } from 'react';
import { View, StyleSheet, StatusBar, Alert, TouchableOpacity } from 'react-native';
import { Button, TextInput, Text } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [loading, setLoading] = useState(false);

  const API_URL = 'https://transaction-tracker-t2ar.onrender.com';

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      Alert.alert('Error', 'Please enter both username and password');
      return;
    }
  
    setLoading(true);
  
    try {
      const response = await axios.post(`${API_URL}/login`, 
        { username: username.trim(), password: password.trim() }, 
        { headers: { 'Content-Type': 'application/json' } }
      );
  
      console.log("Server Response:", response.data);
  
      if (response.data.token) { 
        await AsyncStorage.setItem('token', response.data.token);
        navigation.navigate('Transaction');
      } else {
        Alert.alert('Login failed', response.data.message || 'Invalid credentials');
      }
    } catch (error) {
      console.error("Login Error:", error.response?.data || error.message);
      Alert.alert('Error', error.response?.data?.message || 'Unable to connect to server');
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#4A90E2" barStyle="light-content" />
      <View style={styles.header}>
        <Text style={styles.textHeader}>Welcome to TransTracker</Text>
      </View>

      <View style={styles.footer}>
        <Text style={styles.textLabel}>Username</Text>
        <TextInput
          placeholder="Enter username"
          mode="outlined"
          style={styles.textInput}
          value={username}
          onChangeText={setUsername}
        />

        <Text style={[styles.textLabel, { marginTop: 20 }]}>Password</Text>
        <TextInput
          placeholder="Enter password"
          mode="outlined"
          secureTextEntry={secureTextEntry}
          style={styles.textInput}
          value={password}
          onChangeText={setPassword}
          right={
            <TextInput.Icon 
              icon={secureTextEntry ? "eye-off" : "eye"} 
              onPress={() => setSecureTextEntry(!secureTextEntry)}
            />
          }
        />

        <TouchableOpacity onPress={() => Alert.alert('Feature Coming Soon', 'Password reset functionality will be added later.')}>
          <Text style={styles.forgotPassword}>Forgot Password?</Text>
        </TouchableOpacity>

        <Button 
          mode="contained" 
          buttonColor="#4A90E2" 
          onPress={handleLogin} 
          style={styles.signIn} 
          loading={loading} 
          disabled={loading}
        >
          Sign In
        </Button>

        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={styles.signUpText}>
            Don't have an account? <Text style={styles.signUpLink}>Sign Up</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#4A90E2' },
  header: { flex: 1, justifyContent: 'flex-end', paddingHorizontal: 20, paddingBottom: 30 },
  textHeader: { color: '#fff', fontWeight: 'bold', fontSize: 24 },
  footer: { flex: 3, backgroundColor: '#fff', borderTopLeftRadius: 30, borderTopRightRadius: 30, paddingHorizontal: 20, paddingVertical: 30 },
  textLabel: { fontSize: 18, fontWeight: 'bold', color: '#05375a' },
  textInput: { marginBottom: 15 },
  signIn: { marginTop: 20, borderRadius: 10 },
  forgotPassword: { color: '#4A90E2', textAlign: 'right', marginTop: 10, marginBottom: 20 },
  signUpText: { textAlign: 'center', fontSize: 14, marginTop: 10 },
  signUpLink: { color: '#4A90E2', fontWeight: 'bold' },
});
