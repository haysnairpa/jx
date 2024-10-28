import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

const Home = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Welcome to J-Explorer</Text>
      </View>
      <ScrollView style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Explore Jababeka</Text>
          <Text style={styles.cardDescription}>Discover interesting places around Jababeka.</Text>
          <TouchableOpacity style={styles.button} onPress={() => router.push('/explore')}>
            <Text style={styles.buttonText}>Start Exploring</Text>
            <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Search History</Text>
          <Text style={styles.cardDescription}>Review places you've previously searched for.</Text>
          <TouchableOpacity style={styles.button} onPress={() => router.push('/history')}>
            <Text style={styles.buttonText}>View History</Text>
            <Ionicons name="time-outline" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>About J-Explorer</Text>
          <Text style={styles.cardDescription}>Learn more about this app and its features.</Text>
          <TouchableOpacity style={styles.button} onPress={() => {}}>
            <Text style={styles.buttonText}>More Info</Text>
            <Ionicons name="information-circle-outline" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  header: {
    paddingTop: 55,
    paddingBottom: 16,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 24,
    color: '#111827',
    fontFamily: 'Aeonik-Black',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    color: '#111827',
    marginBottom: 8,
    fontFamily: 'Aeonik-Black',
  },
  cardDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
    fontFamily: 'Aeonik-Medium',
  },
  button: {
    backgroundColor: '#3B82F6',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 16,
    color: '#FFFFFF',
    marginRight: 8,
    fontFamily: 'Aeonik-Medium',
  },
});

export default Home;
