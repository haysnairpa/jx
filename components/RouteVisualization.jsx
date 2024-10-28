import React from 'react';
import { View, Text } from 'react-native';
import MapView, { Polyline, Marker } from 'react-native-maps';

export function RouteVisualization({ route, startLocation, endLocation }) {
  if (!route || route.length < 2 || !startLocation || !endLocation) {
    return <Text>Tidak ada rute yang valid ditemukan</Text>;
  }

  const routeCoordinates = route.filter(node => 
    node && typeof node.latitude === 'number' && typeof node.longitude === 'number'
  );

  if (routeCoordinates.length < 2) {
    return <Text>Tidak cukup koordinat valid untuk menampilkan rute</Text>;
  }

  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={{ flex: 1 }}
        initialRegion={{
          latitude: startLocation.latitude,
          longitude: startLocation.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        <Polyline
          coordinates={routeCoordinates}
          strokeColor="#000"
          strokeWidth={3}
        />
        <Marker coordinate={routeCoordinates[0]} title="Start" />
        <Marker coordinate={routeCoordinates[routeCoordinates.length - 1]} title="End" />
      </MapView>
    </View>
  );
}
