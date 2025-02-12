import React, { useState } from 'react';
import { View, StyleSheet, StatusBar, Alert, TouchableOpacity } from 'react-native';
import { Button, TextInput, Text } from 'react-native-paper';
import * as Animatable from 'react-native-animatable';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [secureTextEntry, setSecureTextEntry] = useState(true);

  const handleLogin = () => {
    if (!username || !password) {
      Alert.alert('Error', 'Username and password cannot be empty.', [{ text: 'Okay' }]);
      return;
    }

    if (username === 'test' && password === 'password') {
      Alert.alert('Success', 'Logged in successfully!', [{ text: 'OK' }]);
      // Navigate to the Transaction List screen
      navigation.replace('Transaction');
    } else {
      Alert.alert('Invalid Credentials', 'Incorrect username or password.', [{ text: 'Okay' }]);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#4A90E2" barStyle="light-content" />
      <View style={styles.header}>
        <Text style={styles.textHeader}>Welcome to Transaction Tracker</Text>
      </View>
      <Animatable.View animation="fadeInUpBig" style={styles.footer}>
        <Text style={styles.textLabel}>Username</Text>
        <View style={styles.inputContainer}>
          <FontAwesome name="user-o" color="#05375a" size={20} />
          <TextInput
            placeholder="Enter username"
            mode="outlined"
            style={styles.textInput}
            value={username}
            onChangeText={setUsername}
          />
        </View>

        <Text style={[styles.textLabel, { marginTop: 20 }]}>Password</Text>
        <View style={styles.inputContainer}>
          <Feather name="lock" color="#05375a" size={20} />
          <TextInput
            placeholder="Enter password"
            mode="outlined"
            secureTextEntry={secureTextEntry}
            style={styles.textInput}
            value={password}
            onChangeText={setPassword}
          />
          <Feather
            name={secureTextEntry ? 'eye-off' : 'eye'}
            color="grey"
            size={20}
            onPress={() => setSecureTextEntry(!secureTextEntry)}
          />
        </View>

        <TouchableOpacity onPress={() => Alert.alert('Feature Coming Soon', 'Password reset functionality will be added later.')}>
          <Text style={styles.forgotPassword}>Forgot Password?</Text>
        </TouchableOpacity>

        <View style={styles.buttonContainer}>
          <Button mode="contained" buttonColor="#4A90E2" onPress={handleLogin} style={styles.signIn}>
            Sign In
          </Button>
        </View>

        <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
          <Text style={styles.signUpText}>
            Don't have an account? <Text style={styles.signUpLink}>Sign Up</Text>
          </Text>
        </TouchableOpacity>
      </Animatable.View>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4A90E2',
  },
  header: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  textHeader: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 24,
  },
  footer: {
    flex: 3,
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  textLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#05375a',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    marginBottom: 10,
    paddingBottom: 5,
  },
  textInput: {
    flex: 1,
    marginLeft: 10,
  },
  buttonContainer: {
    marginTop: 40,
    alignItems: 'center',
  },
  signIn: {
    width: '100%',
    marginBottom: 10,
    borderRadius: 10,
  },
  forgotPassword: {
    color: '#4A90E2',
    textAlign: 'right',
    marginTop: 10,
    marginBottom: 20,
  },
  signUpText: {
    textAlign: 'center',
    fontSize: 14,
    marginTop: 10,
  },
  signUpLink: {
    color: '#4A90E2',
    fontWeight: 'bold',
  },
});
