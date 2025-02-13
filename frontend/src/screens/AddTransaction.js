import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, Alert, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Text, TextInput, Button, Snackbar, HelperText } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Animated, { FadeIn } from 'react-native-reanimated';

const API_URL = 'https://transaction-tracker-t2ar.onrender.com/transactions';

const AddTransactionScreen = ({ navigation }) => {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleConfirmSave = () => {
    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      setSuccessMessage("Enter a valid amount.");
      setSnackbarVisible(true);
      return;
    }
    if (!description.trim()) {
      setSuccessMessage("Description cannot be empty.");
      setSnackbarVisible(true);
      return;
    }

    Alert.alert(
      "Confirm Transaction",
      `Are you sure you want to save this transaction?\n\n💰 Amount: $${amount}\n📝 Description: ${description}\n📅 Date: ${date.toISOString().split('T')[0]}`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Save", onPress: handleAddTransaction }
      ]
    );
  };

  const handleAddTransaction = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('Unauthorized', 'Please log in again.');
        navigation.navigate('Login');
        return;
      }

      await axios.post(API_URL, {
        amount: parseFloat(amount),
        description,
        date: date.toISOString().split('T')[0],
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      setSuccessMessage("Transaction saved successfully!");
      setSnackbarVisible(true);

      setTimeout(() => {
        navigation.goBack();
      }, 2000);
    } catch (error) {
      console.error(error);
      setSuccessMessage(error.response?.data?.message || "Error saving transaction.");
      setSnackbarVisible(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <Animated.View entering={FadeIn.duration(600)}>
        <Text variant="headlineMedium" style={styles.title}>Add Transaction</Text>

        <TextInput
          label="Amount"
          mode="outlined"
          keyboardType="numeric"
          value={amount}
          onChangeText={(text) => {
            const formattedText = text.replace(/[^0-9.]/g, "");
            setAmount(formattedText.startsWith(".") ? `0${formattedText}` : formattedText);
          }}
          style={styles.input}
        />
        <HelperText type="error" visible={!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0}>
          Enter a valid amount
        </HelperText>

        <TextInput
          label="Description"
          mode="outlined"
          value={description}
          onChangeText={setDescription}
          style={styles.input}
        />
        <HelperText type="error" visible={!description.trim()}>
          Description cannot be empty
        </HelperText>

        <TextInput
          label="Date"
          mode="outlined"
          value={date.toISOString().split('T')[0]}
          right={<TextInput.Icon icon="calendar" onPress={() => setShowDatePicker(true)} />}
          style={styles.input}
          editable={false}
        />

        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowDatePicker(false);
              if (selectedDate) setDate(selectedDate);
            }}
          />
        )}

        <TouchableOpacity activeOpacity={0.8} onPress={handleConfirmSave} disabled={loading}>
          <Button mode="contained" buttonColor='#4A90E2' style={styles.button} disabled={loading}>
            {loading ? <ActivityIndicator color="#fff" /> : "Save"}
          </Button>
        </TouchableOpacity>

        <Snackbar
          visible={snackbarVisible}
          onDismiss={() => setSnackbarVisible(false)}
          duration={3000}
        >
          {successMessage}
        </Snackbar>
      </Animated.View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5', justifyContent: 'center' },
  title: { textAlign: 'center', marginBottom: 20, fontWeight: 'bold' },
  input: { marginBottom: 15, backgroundColor: 'white', borderRadius: 8, elevation: 2 },
  button: { marginTop: 10 },
});

export default AddTransactionScreen;
