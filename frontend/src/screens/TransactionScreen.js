import React, { useEffect, useState } from 'react';
import { View, FlatList } from 'react-native';
import { Button, Card, Text } from 'react-native-paper';
import axios from 'axios';

const TransactionScreen = ({ navigation }) => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/transactions')
      .then(response => setTransactions(response.data))
      .catch(error => console.error(error));
  }, []);

  return (
    <View>
      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Card style={{ margin: 10, padding: 10 }}>
            <Text>Date: {item.date}</Text>
            <Text>Amount: ${item.amount}</Text>
            <Text>Description: {item.description}</Text>
          </Card>
        )}
      />
      <Button mode="contained" buttonColor='#4A90E2' onPress={() => navigation.navigate('AddTransaction')}>
        Add Transaction
      </Button>
    </View>
  );
};

export default TransactionScreen;
