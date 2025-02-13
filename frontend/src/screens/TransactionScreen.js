import React, { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, RefreshControl, Alert } from 'react-native';
import { Text, Card, ActivityIndicator, Snackbar, IconButton, Searchbar, FAB, Portal, Modal, Button } from 'react-native-paper';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FlashList } from '@shopify/flash-list';
import { Swipeable } from 'react-native-gesture-handler';

const TransactionScreen = ({ navigation }) => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortModalVisible, setSortModalVisible] = useState(false);
  const [sortOption, setSortOption] = useState('Newest First');

  const API_URL = 'https://transaction-tracker-t2ar.onrender.com';

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('Unauthorized', 'Please log in again.');
        navigation.navigate('Login');
        return;
      }
      const response = await axios.get(`${API_URL}/transactions`, { headers: { Authorization: `Bearer ${token}` } });
      setTransactions(response.data);
      setFilteredTransactions(sortTransactions(response.data, sortOption));
    } catch (error) {
      setSnackbarMessage('Error loading transactions');
      setSnackbarVisible(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchTransactions().finally(() => setRefreshing(false));
  }, []);

  const handleDelete = async (id) => {
    Alert.alert("Delete Transaction", "Are you sure you want to delete this transaction?", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", onPress: async () => {
          try {
            const token = await AsyncStorage.getItem('token');
            await axios.delete(`${API_URL}/transactions/${id}`, { headers: { Authorization: `Bearer ${token}` } });
            const updatedTransactions = transactions.filter(t => t.id !== id);
            setTransactions(updatedTransactions);
            setFilteredTransactions(sortTransactions(updatedTransactions, sortOption));
            setSnackbarMessage("Transaction deleted successfully");
            setSnackbarVisible(true);
          } catch (error) {
            setSnackbarMessage("Error deleting transaction");
            setSnackbarVisible(true);
          }
        },
      },
    ]);
  };

  const sortTransactions = (data, option) => {
    let sortedData = [...data];
    if (option === 'Newest First') sortedData.sort((a, b) => new Date(b.date) - new Date(a.date));
    else if (option === 'Oldest First') sortedData.sort((a, b) => new Date(a.date) - new Date(b.date));
    else if (option === 'Amount High to Low') sortedData.sort((a, b) => b.amount - a.amount);
    else if (option === 'Amount Low to High') sortedData.sort((a, b) => a.amount - b.amount);
    return sortedData;
  };

  const handleSortChange = (option) => {
    setSortOption(option);
    setFilteredTransactions(sortTransactions(transactions, option));
    setSortModalVisible(false);
  };

  if (loading) return <ActivityIndicator animating={true} size="large" style={styles.loader} />;

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>Transactions</Text>
      <Searchbar
        placeholder="Search transactions..."
        value={searchQuery}
        onChangeText={(query) => {
          setSearchQuery(query);
          setFilteredTransactions(transactions.filter(t => t.description.toLowerCase().includes(query.toLowerCase())));
        }}
        style={styles.searchBar}
      />
      <Button mode="outlined" onPress={() => setSortModalVisible(true)} style={styles.sortButton}>
        Sort: {sortOption}
      </Button>
      <Portal>
        <Modal visible={sortModalVisible} onDismiss={() => setSortModalVisible(false)} contentContainerStyle={styles.modalContainer}>
          {['Newest First', 'Oldest First', 'Amount High to Low', 'Amount Low to High'].map((option) => (
            <Button key={option} onPress={() => handleSortChange(option)}>{option}</Button>
          ))}
        </Modal>
      </Portal>
      <FlashList
        data={filteredTransactions}
        renderItem={({ item }) => (
          <Swipeable
            renderRightActions={() => (
              <View style={styles.deleteAction}><IconButton icon="delete" color="white" onPress={() => handleDelete(item.id)} /></View>
            )}
          >
            <Card style={[styles.card, { borderLeftColor: item.amount > 0 ? 'green' : 'red' }]}> 
              <Card.Content>
                <Text variant="titleMedium">{item.description}</Text>
                <Text>Date: {item.date}</Text>
                <Text style={{ fontWeight: 'bold' }}>Amount: ${item.amount}</Text>
              </Card.Content>
            </Card>
          </Swipeable>
        )}
        keyExtractor={(item) => item.id.toString()}
        estimatedItemSize={100}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />
      <FAB style={styles.fab} icon="plus" onPress={() => navigation.navigate('AddTransaction')} />
      <Snackbar visible={snackbarVisible} onDismiss={() => setSnackbarVisible(false)} duration={3000}>{snackbarMessage}</Snackbar>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },
  title: { textAlign: 'center', fontWeight: 'bold', marginBottom: 10 },
  searchBar: { marginBottom: 10 },
  sortButton: { borderRadius: 8, borderColor: '#4A90E2', marginBottom: 10 },
  modalContainer: { backgroundColor: 'white', padding: 20, margin: 20, borderRadius: 8 },
  card: { marginBottom: 10, backgroundColor: 'white', borderLeftWidth: 5, elevation: 2, borderRadius: 8 },
  deleteAction: { backgroundColor: 'red', justifyContent: 'center', alignItems: 'center', padding: 10 },
  fab: { position: 'absolute', right: 20, bottom: 30, backgroundColor: '#4A90E2' },
});

export default TransactionScreen;
