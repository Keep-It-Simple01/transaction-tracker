import React, { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, RefreshControl, Alert, TextInput } from 'react-native';
import { Text, Card, ActivityIndicator, Snackbar, IconButton, Menu, Button, FAB } from 'react-native-paper';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FlashList } from '@shopify/flash-list';
import { Swipeable } from 'react-native-gesture-handler';

const TransactionScreen = ({ navigation }) => {
  const [transactions, setTransactions] = useState([]);
  const [sortedTransactions, setSortedTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [menuVisible, setMenuVisible] = useState(false);
  const [sortOption, setSortOption] = useState('Newest First');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('token'); // Get JWT token
      if (!token) {
        Alert.alert('Unauthorized', 'Please log in again.');
        navigation.navigate('Login');
        return;
      }

      const response = await axios.get('http://localhost:5000/transactions', {
        headers: { Authorization: `Bearer ${token}` }, // Attach token
      });

      setTransactions(response.data);
      const sortedData = sortTransactions(response.data, sortOption);
      setSortedTransactions(sortedData);
      setFilteredTransactions(sortedData);
    } catch (error) {
      console.error(error);
      if (error.response && error.response.status === 401) {
        Alert.alert('Session Expired', 'Please log in again.');
        navigation.navigate('Login');
      } else {
        setSnackbarMessage('Error loading transactions');
        setSnackbarVisible(true);
      }
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
            await axios.delete(`http://localhost:5000/transactions/${id}`, {
              headers: { Authorization: `Bearer ${token}` }, // Send token with delete request
            });

            const updatedTransactions = transactions.filter(t => t.id !== id);
            setTransactions(updatedTransactions);
            const sortedData = sortTransactions(updatedTransactions, sortOption);
            setSortedTransactions(sortedData);
            setFilteredTransactions(sortedData);
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
    switch (option) {
      case 'Newest First':
        sortedData.sort((a, b) => new Date(b.date) - new Date(a.date));
        break;
      case 'Oldest First':
        sortedData.sort((a, b) => new Date(a.date) - new Date(b.date));
        break;
      case 'Amount High to Low':
        sortedData.sort((a, b) => b.amount - a.amount);
        break;
      case 'Amount Low to High':
        sortedData.sort((a, b) => a.amount - b.amount);
        break;
      default:
        break;
    }
    return sortedData;
  };

  const handleSortChange = (option) => {
    setSortOption(option);
    const sortedData = sortTransactions(transactions, option);
    setSortedTransactions(sortedData);
    setFilteredTransactions(sortedData);
    setMenuVisible(false);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setFilteredTransactions(sortedTransactions);
    } else {
      const filteredData = sortedTransactions.filter((transaction) =>
        transaction.description.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredTransactions(filteredData);
    }
  };

  if (loading) return <ActivityIndicator animating={true} size="large" style={styles.loader} />;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineMedium" style={styles.title}>Transactions</Text>
        
        <Menu
          visible={menuVisible}
          onDismiss={() => setMenuVisible(false)}
          anchor={
            <Button mode="outlined" onPress={() => setMenuVisible(true)} style={styles.sortButton}>
              Sort: {sortOption}
            </Button>
          }
        >
          <Menu.Item onPress={() => handleSortChange('Newest First')} title="Newest First" />
          <Menu.Item onPress={() => handleSortChange('Oldest First')} title="Oldest First" />
          <Menu.Item onPress={() => handleSortChange('Amount High to Low')} title="Amount High to Low" />
          <Menu.Item onPress={() => handleSortChange('Amount Low to High')} title="Amount Low to High" />
        </Menu>
      </View>

      <TextInput
        placeholder="Search transactions..."
        value={searchQuery}
        onChangeText={handleSearch}
        style={styles.searchInput}
      />

      {filteredTransactions.length === 0 ? (
        <Text style={styles.emptyMessage}>No transactions found.</Text>
      ) : (
        <FlashList
          data={filteredTransactions}
          renderItem={({ item }) => (
            <Swipeable
              renderRightActions={() => (
                <IconButton icon="delete" color="red" onPress={() => handleDelete(item.id)} />
              )}
            >
              <Card style={styles.card}>
                <Card.Content>
                  <Text variant="titleMedium">{item.description}</Text>
                  <Text>Date: {item.date}</Text>
                  <Text>Amount: ${item.amount}</Text>
                </Card.Content>
              </Card>
            </Swipeable>
          )}
          keyExtractor={(item) => item.id.toString()}
          estimatedItemSize={100}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        />
      )}

      {/* Floating Add Transaction Button */}
      <FAB 
        style={styles.fab} 
        icon="plus" 
        onPress={() => navigation.navigate('AddTransactionScreen')} 
      />

      <Snackbar visible={snackbarVisible} onDismiss={() => setSnackbarVisible(false)} duration={3000}>
        {snackbarMessage}
      </Snackbar>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  title: { fontWeight: 'bold' },
  searchInput: {
    height: 40,
    backgroundColor: 'white',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  card: { marginBottom: 10, backgroundColor: 'white', elevation: 2, borderRadius: 8 },
  loader: { flex: 1, justifyContent: 'center' },
  emptyMessage: { textAlign: 'center', fontSize: 16, color: 'gray', marginTop: 20 },
  sortButton: { borderRadius: 8, borderWidth: 1, borderColor: '#4A90E2' },
  fab: { position: 'absolute', right: 20, bottom: 30, backgroundColor: '#4A90E2' },
});

export default TransactionScreen;
