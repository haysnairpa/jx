# J-Explorer

A Simple Mobile app for exploring Jababeka area using React Native & Expo.

## Features
- Location Search
- Route Navigation
- Search History
- Firebase Integration

## Data Structures & Algorithms
### Path Finding
- **Algorithm**: A* (A-Star) Search Algorithm
- **Use Case**: Finding optimal routes between locations
- **Implementation**: `utils/pathFinding.js`
- **Time Complexity**:
  - Worst case: O(b^d)
  - Average case: O(b^d)
  - Best case: O(b.d)
  - b: branching factor
  - d: depth
- **Key Components**:
  - Priority Queue: For selecting node with smallest f(n)
  - Heuristic function: h(n) = Euclidean distance
  - f(n) = g(n) + h(n) where:
    - g(n) = actual distance from start to node n
    - h(n) = estimated distance from node n to goal

### Search History
- **Data Structure**: Stack
- **Use Case**: Managing user's search history
- **Implementation**: `utils/HistoryStack.js` 
- **Time Complexity**: O(1) for all operations (push, pop, clear)
- **Features**:
  - LIFO (Last-In-First-Out) principle
  - Persistent storage using AsyncStorage

### Location Graph
- **Data Structure**: Adjacency List
- **Use Case**: Representing location connections
- **Implementation**: `utils/adjacencyList.js`
- **Space Complexity**: O(V + E) where V is vertices (locations) and E is edges (connections)
- **Features**:
  - Dynamic graph generation
  - Weighted edges based on real distances
  - Integration with Firebase Firestore

## Setup
1. Clone repo
2. Copy .env.example to .env and fill in the credentials
3. Install dependencies: `npm install`
4. Run: `npm start`

## Tech Stack
- React Native
- Expo
- Firebase
- React Navigation
