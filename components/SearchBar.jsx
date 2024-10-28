import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export function SearchBar({ onSearch }) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = () => {
    if (searchQuery.trim()) {
      onSearch(searchQuery);
    } else {
      Alert.alert(
        "Input kosong",
        "Silakan masukkan kata kunci pencarian.",
        [{ text: "OK" }]
      );
    }
  };

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: 'gray', borderRadius: 10, padding: 4}}>
      <TextInput
        style={{ flex: 1, marginLeft: 8, color: 'white', fontFamily: 'Aeonik-Medium' }}
        placeholder="Found Jababeka Location..."
        placeholderTextColor="white"
        value={searchQuery}
        onChangeText={setSearchQuery}
        onSubmitEditing={handleSearch}
      />
      <TouchableOpacity onPress={handleSearch} className="p-2">
        <Ionicons name="search" size={24} color="#3b82f6" />
      </TouchableOpacity>
    </View>
  );
}
