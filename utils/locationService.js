const NOMINATIM_BASE_URL = 'https://nominatim.openstreetmap.org/search';
const JABABEKA_BOUNDS = {
  minLat: -6.3368,
  maxLat: -6.2368,
  minLon: 107.1201,
  maxLon: 107.2201
};

export async function searchLocation(query) {
  console.log(`Searching for: ${query}`);
  const searchQueries = [
    `${query} Jababeka Cikarang`,
    query,
    query.split(',')[0] // Coba hanya nama tempat tanpa alamat lengkap
  ];

  for (const searchQuery of searchQueries) {
    try {
      const encodedQuery = encodeURIComponent(searchQuery);
      const url = `${NOMINATIM_BASE_URL}?q=${encodedQuery}&format=json&limit=5&viewbox=107.1201,-6.3368,107.2201,-6.2368&bounded=1`;
      console.log(`Fetching URL: ${url}`);

      const response = await fetch(url, {
        headers: {
          'User-Agent': 'JExplorer/1.0'
        }
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const data = await response.json();
      console.log('API response:', data);

      if (data.length > 0) {
        const results = data.map(item => {
          const lat = parseFloat(item.lat);
          const lon = parseFloat(item.lon);
          if (isNaN(lat) || isNaN(lon)) {
            console.warn(`Invalid coordinates for ${item.display_name}`);
            return null;
          }
          return {
            name: item.display_name,
            latitude: lat,
            longitude: lon,
            type: item.type,
            description: 'No Description',
            photo: 'https://example.com/default-image.jpg'
          };
        }).filter(item => item !== null);

        if (results.length > 0) {
          console.log('Mapped results:', results);
          return results;
        }
      }
    } catch (error) {
      console.error(`Error searching location for "${searchQuery}":`, error);
    }
  }

  console.log('No valid results found for any search query');
  return [];
}

export async function geocode(address) {
  try {
    const url = `${NOMINATIM_BASE_URL}?q=${encodeURIComponent(address)}&format=json&limit=1`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error('Gagal melakukan geocoding');
    }

    const data = await response.json();
    
    if (data.length > 0) {
      return {
        latitude: parseFloat(data[0].lat),
        longitude: parseFloat(data[0].lon)
      };
    } else {
      throw new Error('Lokasi tidak ditemukan');
    }
  } catch (error) {
    console.error('Error geocoding:', error);
    return null;
  }
}

export async function getLocation(name) {
  try {
    const location = await AsyncStorage.getItem(`location:${name}`);
    if (location) {
      const parsedLocation = JSON.parse(location);
      console.log(`Retrieved location for ${name}:`, parsedLocation);
      return parsedLocation;
    }
    return null;
  } catch (error) {
    console.error('Error getting location:', error);
    return null;
  }
}

export async function saveLocation(name, location) {
  console.log(`Saving location: ${name}`, location);
  try {
    if (!location || typeof location.latitude !== 'number' || typeof location.longitude !== 'number') {
      console.error('Invalid location data:', location);
      throw new Error('Data lokasi tidak valid');
    }

    const locationRef = doc(db, 'locations', name);
    await setDoc(locationRef, {
      name,
      coordinates: {
        latitude: location.latitude,
        longitude: location.longitude
      },
      type: location.type || 'Unknown',
      description: location.description || 'No Description',
      photo: location.photo || 'https://example.com/default-image.jpg',
      timestamp: serverTimestamp()
    });
    console.log(`Location saved successfully: ${name}`);
  } catch (error) {
    console.error('Error saving location:', error);
    throw error;
  }
}
