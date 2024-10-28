import { db } from './firebaseConfig';
import { collection, doc, setDoc, getDoc, getDocs } from 'firebase/firestore';

const LOCATIONS_COLLECTION = 'locations';
const EDGES_COLLECTION = 'edges';

export async function saveLocation(name, location) {
  try {
    if (!location || typeof location.latitude !== 'number' || typeof location.longitude !== 'number') {
      console.error('Invalid location data:', location);
      throw new Error('Data lokasi tidak valid');
    }

    await setDoc(doc(db, LOCATIONS_COLLECTION, name), {
      name,
      coordinates: {
        latitude: location.latitude,
        longitude: location.longitude
      },
      type: location.type || 'Unknown',
      description: location.description || 'No Description',
      photo: location.photo || 'https://example.com/default-image.jpg'
    });
    console.log('Location saved successfully');
  } catch (error) {
    console.error('Error saving location:', error);
    throw error;
  }
}

export async function getLocation(name) {
  try {
    const docRef = doc(db, LOCATIONS_COLLECTION, name);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      console.log('Location not found');
      return null;
    }
  } catch (error) {
    console.error('Error getting location:', error);
    return null;
  }
}

export async function saveEdge(location1, location2, distance, duration) {
  const edgeId = `${location1}-${location2}`;
  try {
    await setDoc(doc(db, EDGES_COLLECTION, edgeId), {
      start_location: location1,
      end_location: location2,
      distance,
      duration
    });
    console.log('Edge saved successfully');
  } catch (error) {
    console.error('Error saving edge:', error);
  }
}

export async function getEdge(location1, location2) {
  const edgeId = `${location1}-${location2}`;
  try {
    const docRef = doc(db, EDGES_COLLECTION, edgeId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      console.log('Edge not found');
      return null;
    }
  } catch (error) {
    console.error('Error getting edge:', error);
    return null;
  }
}

export async function getAllLocations() {
  try {
    const querySnapshot = await getDocs(collection(db, LOCATIONS_COLLECTION));
    const locations = {};
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if (data && data.name) {
        locations[doc.id] = {
          name: data.name,
          latitude: data.coordinates?.latitude || 0,
          longitude: data.coordinates?.longitude || 0,
          type: data.type || 'Unknown',
          description: data.description || '',
          photo: data.photo || ''
        };
      }
    });
    return locations;
  } catch (error) {
    console.error('Error getting all locations:', error);
    return {};
  }
}

export async function getAllEdges() {
  try {
    const querySnapshot = await getDocs(collection(db, EDGES_COLLECTION));
    const edges = {};
    querySnapshot.forEach((doc) => {
      edges[doc.id] = doc.data();
    });
    return edges;
  } catch (error) {
    console.error('Error getting all edges:', error);
    return {};
  }
}

export async function initializeImportantLocations() {
  const importantLocations = [
    {
      name: "PT Mattel Indonesia, Kawasan Industri Jababeka, Jl. Jababeka Ⅴ Blok G No.kav. 4-6, Harja Mekar, Kec. Cikarang Utara, Kabupaten Bekasi, Jawa Barat 17530",
      latitude: -6.284252093692993,
      longitude: 107.14002649432398, 
      type: "Industry",
      description: "Manufacturer of toys and games",
      photo: "https://example.com/mattel.jpg"
    },
  ];

  for (const location of importantLocations) {
    await addImportantLocation(
      location.name,
      location.latitude,
      location.longitude,
      location.type,
      location.description,
      location.photo
    );
  }
}

async function addImportantLocation(name, latitude, longitude, type, description, photo) {
  try {
    await setDoc(doc(db, LOCATIONS_COLLECTION, name), {
      name,
      coordinates: { latitude, longitude },
      type,
      description,
      photo
    });
    console.log(`Important location ${name} added successfully`);
  } catch (error) {
    console.error(`Error adding important location ${name}:`, error);
  }
}
