import { getLocation, saveLocation, getEdge, saveEdge } from './firestoreService';
import { searchLocation } from './locationService';
import { getRoute } from './routingService';

export async function generateAdjacencyList(startNode, endNode) {
  console.log(`Generating adjacency list for ${startNode} to ${endNode}`);
  // object initialization for saving adjacency list
  const adjacencyList = {};

  // This function is used to search the location in the database, if not, it will search the location using the API, and save it to the database
  // And This function also used to make sure that every node in the graph has a valid coordinates
  async function getOrSaveLocation(nodeName) {
    console.log(`Getting or saving location for ${nodeName}`);
    let location = await getLocation(nodeName);
    if (!location || typeof location.latitude !== 'number' || typeof location.longitude !== 'number') {
      console.log(`Location ${nodeName} not found in database or has invalid coordinates, searching...`);
      const searchResults = await searchLocation(nodeName);
      if (searchResults.length > 0) {
        location = searchResults[0];
        console.log(`Found location ${nodeName}:`, location);
        if (typeof location.latitude !== 'number' || typeof location.longitude !== 'number') {
          throw new Error(`Koordinat tidak valid untuk lokasi: ${nodeName}`);
        }
      } else {
        console.warn(`Lokasi tidak ditemukan: ${nodeName}. Menggunakan koordinat default.`);
        location = {
          name: nodeName,
          latitude: -6.2868,
          longitude: 107.1701,
          type: 'Unknown',
          description: 'Default location',
          photo: 'https://example.com/default-image.jpg'
        };
      }
      await saveLocation(nodeName, location);
    }
    console.log(`Location for ${nodeName}:`, location);
    return location;
  }

  try {
    console.log('Getting start and end locations...');
    
    // Get or Saving the location for the first and last node
    // It is the crucial part, because it's make sure that both of the endpoints of the graph are exist and have a coordinates
    const startLocation = await getOrSaveLocation(startNode);
    const endLocation = await getOrSaveLocation(endNode);

    console.log('Start location:', startLocation);
    console.log('End location:', endLocation);

    if (!startLocation || !endLocation) {
      throw new Error('Cannot find start or end location');
    }

    console.log('Initializing adjacency list...');

    // Initialize the entry for the start node in the adjacency list
    // Each node in the graph has coordinates and edges objects that are initially empty.
    adjacencyList[startNode] = {
      coordinates: {
        latitude: startLocation.latitude,
        longitude: startLocation.longitude
      },
      edges: {}
    };

    // Initialize the entry for the end node in the adjacency list
    adjacencyList[endNode] = {
      coordinates: {
        latitude: endLocation.latitude,
        longitude: endLocation.longitude
      },
      edges: {}
    };

    console.log('Getting edge between start and end nodes...');

    // Get or save the edge between the start and end nodes
    // the edge is used to store the distance and duration of the route between the start and end nodes
    const edge = await getOrSaveEdge(startNode, endNode, adjacencyList[startNode].coordinates, adjacencyList[endNode].coordinates);
    if (edge) {
      // Save the edge in both directions (undirected graph)
      // This allows bidirectional navigation between nodes
      adjacencyList[startNode].edges[endNode] = edge;
      adjacencyList[endNode].edges[startNode] = edge;
    } else {
      throw new Error(`Cannot find route between ${startNode} and ${endNode}`);
    }
    // The adjacency list now contains two nodes (start and end) with one edge between them
    // This structure allows adding further nodes and edges if needed
    // A* algorithm will use this adjacency list to find the shortest path between the start and end nodes
    console.log('Generated Graph:', JSON.stringify(adjacencyList, null, 2));
    return adjacencyList;
  } catch (error) {
    console.error('Error generating adjacency list:', error);
    throw error;
  }
}

async function getOrSaveEdge(from, to, fromCoords, toCoords) {
  console.log(`Getting or saving edge from ${from} to ${to}`);
  const edgeId = `${from}-${to}`;
  let edge = await getEdge(from, to);
  if (!edge) {
    console.log(`Edge ${edgeId} not found, calculating route...`);
    try {
      const routeInfo = await getRoute(
        fromCoords.longitude,
        fromCoords.latitude,
        toCoords.longitude,
        toCoords.latitude
      );
      if (routeInfo) {
        edge = {
          distance: routeInfo.distance,
          duration: routeInfo.duration
        };
        console.log(`Saving edge ${edgeId}:`, edge);
        await saveEdge(from, to, edge.distance, edge.duration);
      } else {
        console.error(`No route found between ${from} and ${to}`);
        return null;
      }
    } catch (error) {
      console.error(`Error getting route between ${from} and ${to}:`, error);
      return null;
    }
  }
  console.log(`Edge from ${from} to ${to}:`, edge);
  return edge;
}
