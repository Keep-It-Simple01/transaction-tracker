import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Platform,
  StyleSheet,
  ScrollView,
  StatusBar,
  Alert
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';

const RegisterScreen = ({ navigation }) => {
  const [data, setData] = useState({
    username: '',
    password: '',
    confirm_password: '',
    check_textInputChange: false,
    secureTextEntry: true,
    confirm_secureTextEntry: true,
  });

  const [loading, setLoading] = useState(false);  // Prevent multiple sign-ups

  const textInputChange = (val) => {
    setData(prev => ({
      ...prev,
      username: val,
      check_textInputChange: val.length !== 0
    }));
  };

  const handlePasswordChange = (val) => {
    setData(prev => ({
      ...prev,
      password: val
    }));
  };

  const handleConfirmPasswordChange = (val) => {
    setData(prev => ({
      ...prev,
      confirm_password: val
    }));
  };

  const updateSecureTextEntry = () => {
    setData(prev => ({
      ...prev,
      secureTextEntry: !prev.secureTextEntry
    }));
  };

  const updateConfirmSecureTextEntry = () => {
    setData(prev => ({
      ...prev,
      confirm_secureTextEntry: !prev.confirm_secureTextEntry
    }));
  };

  const handleSignUp = async () => {
    if (loading) return;  // Prevent multiple clicks
    setLoading(true);

    if (data.username.length < 4) {
      Alert.alert('Invalid Username', 'Username must be at least 4 characters long.');
      setLoading(false);
      return;
    }
    if (data.password.length < 8) {
      Alert.alert('Weak Password', 'Password must be at least 8 characters long.');
      setLoading(false);
      return;
    }
    if (data.password !== data.confirm_password) {
      Alert.alert('Password Mismatch', 'Passwords do not match.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('https://your-backend-api.com/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: data.username,
          password: data.password
        })
      });

      const result = await response.json();

      if (response.ok) {
        Alert.alert('Success', 'You have registered successfully!');
        navigation.navigate('Login');
      } else if (response.status === 409) {
        Alert.alert('Username Taken', 'This username is already in use.');
      } else {
        Alert.alert('Error', result.message || 'Registration failed');
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor='#4A90E2' barStyle="light-content" />
      <View style={styles.header}>
        <Text style={styles.text_header}>Register Now!</Text>
      </View>
      <Animatable.View animation="fadeInUpBig" style={styles.footer}>
        <ScrollView>
          <Text style={styles.text_footer}>Username</Text>
          <View style={styles.action}>
            <FontAwesome name="user-o" color="#05375a" size={20} />
            <TextInput
              placeholder="Your Username"
              style={styles.textInput}
              autoCapitalize="none"
              value={data.username}
              onChangeText={textInputChange}
            />
            {data.check_textInputChange ?
              <Animatable.View animation="bounceIn">
                <Feather name="check-circle" color="green" size={20} />
              </Animatable.View>
              : null}
          </View>

          <Text style={[styles.text_footer, { marginTop: 35 }]}>Password</Text>
          <View style={styles.action}>
            <Feather name="lock" color="#05375a" size={20} />
            <TextInput
              placeholder="Your Password"
              secureTextEntry={data.secureTextEntry}
              style={styles.textInput}
              autoCapitalize="none"
              value={data.password}
              onChangeText={handlePasswordChange}
            />
            <TouchableOpacity onPress={updateSecureTextEntry}>
              <Feather name={data.secureTextEntry ? "eye-off" : "eye"} color="grey" size={20} />
            </TouchableOpacity>
          </View>

          <Text style={[styles.text_footer, { marginTop: 35 }]}>Confirm Password</Text>
          <View style={styles.action}>
            <Feather name="lock" color="#05375a" size={20} />
            <TextInput
              placeholder="Confirm Your Password"
              secureTextEntry={data.confirm_secureTextEntry}
              style={styles.textInput}
              autoCapitalize="none"
              value={data.confirm_password}
              onChangeText={handleConfirmPasswordChange}
            />
            <TouchableOpacity onPress={updateConfirmSecureTextEntry}>
              <Feather name={data.confirm_secureTextEntry ? "eye-off" : "eye"} color="grey" size={20} />
            </TouchableOpacity>
          </View>

          <View style={styles.textPrivate}>
            <Text style={styles.color_textPrivate}>By signing up you agree to our</Text>
            <Text style={[styles.color_textPrivate, { fontWeight: 'bold' }]}> Terms of service</Text>
            <Text style={styles.color_textPrivate}> and</Text>
            <Text style={[styles.color_textPrivate, { fontWeight: 'bold' }]}> Privacy policy</Text>
          </View>

          <View style={styles.button}>
            <TouchableOpacity style={[styles.signIn, {
              borderColor: '#4A90E2',
              backgroundColor: '#4A90E2',
              borderWidth: 1,
              marginTop: 5
            }]} onPress={handleSignUp} disabled={loading}>
              <Text style={[styles.textSign, { color: '#fff' }]}>{loading ? 'Registering...' : 'Sign Up'}</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.signInText}>Don't have an account? <Text style={styles.signInLink}>  Sign In</Text></Text>
      </TouchableOpacity>
        </ScrollView>
      </Animatable.View>
    </View>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4A90E2'
  },
  signInText: {
    textAlign: "center",
    marginTop: 15,
    fontSize: 14,
  },
  signInLink: {
    color: "#4A90E2",
    fontWeight: "bold",
  },
  header: { flex: 1, justifyContent: 'flex-end', paddingHorizontal: 20, paddingBottom: 50 },
  footer: { flex: Platform.OS === 'ios' ? 3 : 5, backgroundColor: '#fff', borderTopLeftRadius: 30, borderTopRightRadius: 30, paddingHorizontal: 20, paddingVertical: 30 },
  text_header: { color: '#fff', fontWeight: 'bold', fontSize: 30 },
  text_footer: { color: '#05375a', fontSize: 18 },
  action: { flexDirection: 'row', marginTop: 10, borderBottomWidth: 1, borderBottomColor: '#f2f2f2', paddingBottom: 5 },
  textInput: { flex: 1, paddingLeft: 10, color: '#05375a' },
  button: { alignItems: 'center', marginTop: 30 },
  signIn: { width: '100%', height: 50, justifyContent: 'center', alignItems: 'center', borderRadius: 10 },
  textSign: { fontSize: 18, fontWeight: 'bold' },
  textPrivate: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 20 },
  color_textPrivate: { color: '#4A90E2' }
});
