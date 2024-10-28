import React, { useState, useRef, useEffect } from 'react';
import { View, Dimensions, Alert } from 'react-native';
import MapView, { PROVIDER_OSMDROID, Marker } from 'react-native-maps';
import { getEdge, saveEdge } from '../utils/firestoreService';
import { getRoute } from '../utils/routingService';

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.1; // Memperbesar area yang dapat dilihat
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const JABABEKA_REGION = {
  latitude: -6.2868,
  longitude: 107.1701,
  latitudeDelta: LATITUDE_DELTA,
  longitudeDelta: LONGITUDE_DELTA,
};

const JABABEKA_BOUNDS = {
  minLat: -6.3368,
  maxLat: -6.2368,
  minLon: 107.1201,
  maxLon: 107.2201
};

export function CustomMapView({ searchResult }) {
  const [region, setRegion] = useState(JABABEKA_REGION);
  const [route, setRoute] = useState(null);
  const mapRef = useRef(null);

  const onRegionChangeComplete = (newRegion) => {
    let adjustedRegion = { ...newRegion };

    if (newRegion.latitude < JABABEKA_BOUNDS.minLat) {
      adjustedRegion.latitude = JABABEKA_BOUNDS.minLat;
    } else if (newRegion.latitude > JABABEKA_BOUNDS.maxLat) {
      adjustedRegion.latitude = JABABEKA_BOUNDS.maxLat;
    }

    if (newRegion.longitude < JABABEKA_BOUNDS.minLon) {
      adjustedRegion.longitude = JABABEKA_BOUNDS.minLon;
    } else if (newRegion.longitude > JABABEKA_BOUNDS.maxLon) {
      adjustedRegion.longitude = JABABEKA_BOUNDS.maxLon;
    }

    if (adjustedRegion !== newRegion) {
      mapRef.current.animateToRegion(adjustedRegion, 100);
    }

    setRegion(adjustedRegion);
  };

  useEffect(() => {
    if (searchResult) {
      const newRegion = {
        latitude: searchResult.latitude,
        longitude: searchResult.longitude,
        latitudeDelta: LATITUDE_DELTA / 2,
        longitudeDelta: LONGITUDE_DELTA / 2,
      };
      setRegion(newRegion);
      mapRef.current.animateToRegion(newRegion, 1000);
      calculateRoute();
    }
  }, [searchResult]);

  const calculateRoute = async () => {
    if (!searchResult) return;

    const startLocation = 'President University';
    const endLocation = searchResult.name;

    // Check if edge exists in Firestore
    const existingEdge = await getEdge(startLocation, endLocation);
    if (existingEdge) {
      setRoute(existingEdge);
      return;
    }

    // If edge doesn't exist, calculate new route
    const routeInfo = await getRoute(
      JABABEKA_REGION.longitude,
      JABABEKA_REGION.latitude,
      searchResult.longitude,
      searchResult.latitude
    );

    if (routeInfo) {
      setRoute(routeInfo);
      // Save new edge to Firestore
      saveEdge(startLocation, endLocation, routeInfo.distance, routeInfo.duration);
    }
  };

  return (
    <View style={{ flex: 1, width: '100%', height: '100%' }}>
      <MapView
        ref={mapRef}
        style={{ flex: 1 }}
        provider={PROVIDER_OSMDROID}
        region={region}
        onRegionChangeComplete={onRegionChangeComplete}
        minZoomLevel={12}
        maxZoomLevel={18}
      >
        {searchResult && (
          <Marker
            coordinate={{
              latitude: searchResult.latitude,
              longitude: searchResult.longitude,
            }}
            title={searchResult.name}
          />
        )}
      </MapView>
    </View>
  );
}
