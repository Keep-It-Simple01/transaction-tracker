import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { Text, TextInput, Button, Snackbar } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';

const API_URL = 'http://localhost:5000/transactions'; // Change for real devices

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
      await axios.post(API_URL, {
        amount: parseFloat(amount),
        description,
        date: date.toISOString().split('T')[0],
      });

      setSuccessMessage("Transaction saved successfully!");
      setSnackbarVisible(true);

      setTimeout(() => {
        navigation.goBack();
      }, 2000);
    } catch (error) {
      setSuccessMessage("Error saving transaction.");
      setSnackbarVisible(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>Add Transaction</Text>

      <TextInput
        label="Amount"
        mode="outlined"
        keyboardType="numeric"
        value={amount}
        onChangeText={(text) => setAmount(text.replace(/[^0-9.]/g, ''))}
        style={styles.input}
      />

      <TextInput
        label="Description"
        mode="outlined"
        value={description}
        onChangeText={setDescription}
        style={styles.input}
      />

      <Button mode="outlined" onPress={() => setShowDatePicker(true)} style={styles.dateButton}>
        📅 {date.toISOString().split('T')[0]}
      </Button>

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

      <Button mode="contained" onPress={handleConfirmSave} style={styles.button} disabled={loading}>
        {loading ? "Saving..." : "Save"}
      </Button>

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
      >
        {successMessage}
      </Snackbar>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5', justifyContent: 'center' },
  title: { textAlign: 'center', marginBottom: 20, fontWeight: 'bold' },
  input: { marginBottom: 15, backgroundColor: 'white', borderRadius: 8, elevation: 2 },
  dateButton: { marginBottom: 15 },
  button: { marginTop: 10 },
});

export default AddTransactionScreen;
