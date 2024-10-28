import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HistoryStack from '../../utils/HistoryStack';
import { Ionicons } from '@expo/vector-icons';

const historyStack = new HistoryStack();

const History = () => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const savedHistory = await AsyncStorage.getItem('searchHistory');
      if (savedHistory !== null) {
        const parsedHistory = JSON.parse(savedHistory);
        parsedHistory.forEach(item => historyStack.push(item));
        setHistory(parsedHistory.reverse());
      }
    } catch (error) {
      console.error('Error loading history:', error);
    }
  };

  const clearHistory = async () => {
    try {
      await AsyncStorage.removeItem('searchHistory');
      historyStack.clear();
      setHistory([]);
    } catch (error) {
      console.error('Error clearing history:', error);
    }
  };

  const renderHistoryItem = ({ item }) => (
    <View style={styles.historyItem}>
      <Ionicons name="location-outline" size={24} color="#2A86FF" style={styles.icon} />
      <Text style={styles.historyText}>{item}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Search History</Text>
        <TouchableOpacity onPress={clearHistory} style={styles.clearButton}>
          <Text style={styles.clearButtonText}>Delete All</Text>
        </TouchableOpacity>
      </View>
      {history.length > 0 ? (
        <FlatList
          data={history}
          renderItem={renderHistoryItem}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        <Text style={styles.emptyText}>No History Found</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    paddingTop: 55,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 20,
    color: '#111827',
    fontFamily: 'Aeonik-Black',
  },
  clearButton: {
    padding: 8,
  },
  clearButtonText: {
    color: 'red',
    fontSize: 14,
    fontFamily: 'Aeonik-Medium',
  },
  listContainer: {
    paddingHorizontal: 16,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  icon: {
    marginRight: 12,
  },
  historyText: {
    fontSize: 16,
    color: '#374151',
    fontFamily: 'Aeonik-Medium',
  },
  emptyText: {
    fontSize: 16,
    color: '#374151',
    textAlign: 'center',
    marginTop: 24,
    fontFamily: 'Aeonik-Medium',
  },
});

export default History;
