import { Camera, MapView, PointAnnotation, UserLocation, MapViewRef } from '@track-asia/trackasia-react-native';
import React, { useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { TRACKASIA_CONFIG } from '../../../config/trackasia.config';
import { MAP_CONFIG } from './MapConstants';
import { MapViewProps } from './MapInterfaces';
import { MAP_LAYOUT } from './MapLayout';

export function MapViewComponent({
  latitude,
  longitude,
  onRegionChange,
  showUserLocation = false,
  zoomLevel = MAP_CONFIG.DEFAULT_ZOOM,
}: MapViewProps) {
   const mapRef = useRef<MapViewRef>(null);

  const handleRegionDidChange = async () => {
    if (onRegionChange && mapRef.current) {
      const center = await mapRef.current.getCenter();
      onRegionChange({
        latitude: center[1],
        longitude: center[0],
      });
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        mapStyle={TRACKASIA_CONFIG.STYLE_MAP_URL}
        zoomEnabled={true}
        scrollEnabled={true}
        pitchEnabled={false}
        rotateEnabled={false}
        onRegionDidChange={handleRegionDidChange}
      >
        <Camera
          zoomLevel={zoomLevel}
          centerCoordinate={[longitude, latitude]}
          animationMode="flyTo"
          animationDuration={1000}
        />

        {showUserLocation && (
          <UserLocation
            visible={true}
            showsUserHeadingIndicator={true}
          />
        )}

        {/* Marker at center */}
        <PointAnnotation
          id="delivery-marker"
          coordinate={[longitude, latitude]}
        >
          <View style={styles.markerContainer}>
            <View style={styles.marker} />
          </View>
        </PointAnnotation>
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: MAP_LAYOUT.MAP_HEIGHT,
    borderRadius: MAP_LAYOUT.MAP_BORDER_RADIUS,
    overflow: 'hidden',
  },
  map: {
    flex: 1,
  },
  markerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  marker: {
    width: MAP_LAYOUT.MARKER_SIZE,
    height: MAP_LAYOUT.MARKER_SIZE,
    borderRadius: MAP_LAYOUT.MARKER_SIZE / 2,
    backgroundColor: '#FF6B6B',
    borderWidth: 3,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
});