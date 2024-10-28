import React, { useState, useEffect } from 'react';
import { View, FlatList, Text, TouchableOpacity, Alert } from 'react-native';
import { CustomMapView } from '@/components/CustomMapView';
import { SearchBar } from '@/components/SearchBar';
import { searchLocation } from '@/utils/locationService';
import { getAllLocations, saveLocation, initializeImportantLocations } from '@/utils/firestoreService';
import { generateAdjacencyList } from '@/utils/adjencyList';
import { aStar } from '@/utils/pathFinding';
import { RouteVisualization } from '@/components/RouteVisualization';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HistoryStack from '../../utils/HistoryStack';

const historyStack = new HistoryStack();

export default function ExploreScreen() {
  const [searchResults, setSearchResults] = useState([]);
  const [selectedResult, setSelectedResult] = useState(null);
  const [route, setRoute] = useState(null);
  const [graph, setGraph] = useState(null);
  const [startNode, setStartNode] = useState('President University');
  const [cachedLocations, setCachedLocations] = useState({});

  useEffect(() => {
    const initializeApp = async () => {
      await loadCachedLocations();
      await initializeImportantLocations();
    };
    
    initializeApp();
  }, []);

  const loadCachedLocations = async () => {
    try {
      const locations = await getAllLocations();
      setCachedLocations(locations);
    } catch (error) {
      console.error('Error loading cached locations:', error);
    }
  };

  const saveSearchHistory = async (query) => {
    try {
      historyStack.push(query);
      const currentHistory = await AsyncStorage.getItem('searchHistory');
      let newHistory = currentHistory ? JSON.parse(currentHistory) : [];
      newHistory.push(query);
      if (newHistory.length > 20) {
        newHistory.shift();
      }
      await AsyncStorage.setItem('searchHistory', JSON.stringify(newHistory));
    } catch (error) {
      console.error('Error saving search history:', error);
    }
  };
  
  const handleSearch = async (query) => {
    await saveSearchHistory(query)
    console.log('Searching for:', query);
    
    // Check if location exists in cache
    const cachedLocationsArray = Object.values(cachedLocations);
    const cachedResults = cachedLocationsArray.filter(
      loc => loc && loc.name && typeof loc.name === 'string' && loc.name.toLowerCase().includes(query.toLowerCase())
    );

    if (cachedResults.length > 0) {
      setSearchResults(cachedResults);
      return;
    }

    try {
      const results = await searchLocation(query);
      console.log('Search results:', results);
      
      if (results.length === 0) {
        Alert.alert(
          "Tidak ada hasil",
          "Lokasi tidak ditemukan di area Jababeka. Coba kata kunci lain atau pastikan lokasi berada di dalam Jababeka.",
          [{ text: "OK" }]
        );
      } else {
        setSearchResults(results);
        // Save new locations to Firestore
        for (const result of results) {
          if (result && result.name && typeof result.latitude === 'number' && typeof result.longitude === 'number') {
            try {
              await saveLocation(result.name, result);
              console.log(`Location ${result.name} saved successfully`);
            } catch (error) {
              console.error(`Error saving location ${result.name}:`, error);
            }
          } else {
            console.warn('Invalid result data:', result);
          }
        }
      }
    } catch (error) {
      console.error('Error searching location:', error);
      console.error('Error details:', error.message);
      Alert.alert(
        "Error",
        `Terjadi kesalahan saat mencari lokasi: ${error.message}. Silakan coba lagi.`,
        [{ text: "OK" }]
      );
    }
  };

  const handleSelectResult = async (result) => {
    console.log('Selected result:', result);
    setSelectedResult(result);
    setSearchResults([]);

    const startNode = 'President University';
    const endNode = result.name;

    try {
      console.log('Generating adjacency list...');
      const newGraph = await generateAdjacencyList(startNode, endNode);
      console.log('Generated graph:', JSON.stringify(newGraph, null, 2));
      
      if (!newGraph[startNode] || !newGraph[endNode]) {
        throw new Error(`Node tidak ditemukan: ${!newGraph[startNode] ? startNode : endNode}`);
      }
      
      setGraph(newGraph);
      
      const heuristic = (a, b) => {
        console.log(`Calculating heuristic for ${a} to ${b}`);
        const aNode = newGraph[a];
        const bNode = newGraph[b];
        if (!aNode || !bNode || !aNode.coordinates || !bNode.coordinates) {
          console.error(`Missing node or coordinates for ${!aNode ? a : b}`);
          return 0;
        }
        const aCoords = aNode.coordinates;
        const bCoords = bNode.coordinates;
        const distance = Math.sqrt(
          Math.pow(aCoords.latitude - bCoords.latitude, 2) +
          Math.pow(aCoords.longitude - bCoords.longitude, 2)
        );
        console.log(`Calculated heuristic distance: ${distance}`);
        return distance;
      };

      console.log('Running A* algorithm...');
      const path = aStar(newGraph, startNode, endNode, heuristic);
      console.log('A* result:', path);
      
      if (path && path.length > 0) {
        const routeCoordinates = path.map(nodeName => {
          const node = newGraph[nodeName];
          if (!node || !node.coordinates || typeof node.coordinates.latitude !== 'number' || typeof node.coordinates.longitude !== 'number') {
            console.error(`Invalid coordinates for node: ${nodeName}`);
            return null;
          }
          return {
            latitude: node.coordinates.latitude,
            longitude: node.coordinates.longitude
          };
        }).filter(coord => coord !== null);

        if (routeCoordinates.length > 0) {
          setRoute(routeCoordinates);
        } else {
          throw new Error('Tidak dapat menghasilkan koordinat rute yang valid');
        }
      } else {
        throw new Error('Tidak dapat menemukan rute');
      }
    } catch (error) {
      console.error('Error generating route:', error);
      Alert.alert(
        "Error",
        `Terjadi kesalahan: ${error.message}. Silakan coba lagi.`,
        [{ text: "OK" }]
      );
    }
  };

  return (
    <View style={{ flex: 1, width: '100%', height: '100%' }} className="bg-gray-100">
      <View style={{ paddingTop: 55, paddingBottom: 4, paddingLeft: 4, paddingRight: 4, backgroundColor: 'white', shadowColor: 'black', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2 }}>
        <SearchBar onSearch={handleSearch} />
      </View>
      {searchResults.length > 0 && (
        <FlatList
          data={searchResults}
          keyExtractor={(item) => item.name}
          renderItem={({ item }) => (
            <TouchableOpacity 
              onPress={() => handleSelectResult(item)}
              style={{ padding: 4, borderBottomWidth: 1, borderBottomColor: '#e0e0e0', backgroundColor: 'white' }}
            >
              <Text style={{ color: 'gray', fontWeight: 'medium' }}>{item.name}</Text>
            </TouchableOpacity>
          )}
          style={{ maxHeight: 60 }}
        />
      )}
      {route && graph && (
        <RouteVisualization 
          route={route} 
          startLocation={graph[startNode]?.coordinates}
          endLocation={graph[selectedResult?.name]?.coordinates}
        />
      )}
    </View>
  );
}
