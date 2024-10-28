const OSRM_BASE_URL = 'https://router.project-osrm.org/route/v1/driving/';

export async function getRoute(startLon, startLat, endLon, endLat) {
  try {
    const url = `${OSRM_BASE_URL}${startLon},${startLat};${endLon},${endLat}?overview=false`;
    console.log('Fetching route from URL:', url);
    
    const response = await fetch(url, { timeout: 10000 }); // Tambahkan timeout 10 detik
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Route data:', data);
    
    if (data.code !== 'Ok') {
      throw new Error(`OSRM error: ${data.code}`);
    }

    if (data.routes && data.routes.length > 0) {
      const { distance, duration } = data.routes[0];
      return {
        distance: distance / 1000, // Convert to kilometers
        duration: Math.round(duration / 60) // Convert to minutes
      };
    } else {
      throw new Error('No route found in OSRM response');
    }
  } catch (error) {
    console.error('Error getting route:', error);
    // Jika terjadi error, gunakan perhitungan jarak sederhana sebagai fallback
    return calculateSimpleDistance(startLat, startLon, endLat, endLon);
  }
}

function calculateSimpleDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius bumi dalam kilometer
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;
  return {
    distance: distance,
    duration: Math.round(distance / 0.833) // Asumsi kecepatan rata-rata 50 km/jam
  };
}

function deg2rad(deg) {
  return deg * (Math.PI/180);
}
