import MapboxGL, { CameraRef } from '@track-asia/trackasia-react-native';
import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { TRACKASIA_CONFIG } from '../../../config/trackasia.config';
import { geocodingService } from '../../../infrastructure/location/GeocodingService';
import { BRAND_COLORS } from '../../theme/colors';

MapboxGL.setAccessToken(TRACKASIA_CONFIG.API_KEY);

interface CustomMapViewProps {
  currentLocation: { lat: number; lng: number } | null;
  onLocationSelect: (location: { lat: number; lng: number; address: string }) => void;
}

const CustomMapView: React.FC<CustomMapViewProps> = ({ currentLocation, onLocationSelect }) => {
  const cameraRef = useRef<CameraRef>(null);
  
  const [markerCoordinate, setMarkerCoordinate] = useState<[number, number] | null>(null);

  // Sync prop currentLocation vào internal state và di chuyển Camera
  useEffect(() => {
    if (currentLocation) {
      const newCoord: [number, number] = [currentLocation.lng, currentLocation.lat];
      setMarkerCoordinate(newCoord);

      // Di chuyển camera tới vị trí search được
      if (cameraRef.current) {
        cameraRef.current.setCamera({
          centerCoordinate: newCoord,
          zoomLevel: 16,
          animationDuration: 1000,
        });
      }
    }
  }, [currentLocation]);

  const handlePress = async (event: any) => {
    const { geometry } = event;
    const [lng, lat] = geometry.coordinates;
    
    setMarkerCoordinate([lng, lat]);

    try {
      const feature = await geocodingService.reverseGeocode(lat, lng);
      onLocationSelect({
        lat,
        lng,
        address: feature?.properties?.name || feature?.place_name || 'Vị trí đã chọn',
      });
    } catch (error) {
      console.warn('Reverse geocode failed', error);
    }
  };

  return (
    <View style={styles.container}>
      <MapboxGL.MapView
        style={styles.map}
        mapStyle={TRACKASIA_CONFIG.STYLE_URL_FULL}
        onPress={handlePress}
        rotateEnabled={false}
        logoEnabled={false}
        attributionEnabled={false}
        surfaceView={true}
      >
        <MapboxGL.Camera
          ref={cameraRef}
          defaultSettings={{
            centerCoordinate: TRACKASIA_CONFIG.DEFAULT_CENTER,
            zoomLevel: TRACKASIA_CONFIG.DEFAULT_ZOOM,
          }}
        />

        {/* Marker Layer */}
        {markerCoordinate && (
          <MapboxGL.PointAnnotation
            id="selected-location-marker"
            coordinate={markerCoordinate}
          >
            {/* Custom Marker UI */}
            <View style={styles.markerContainer}>
              <View style={styles.markerDot} />
              <View style={styles.markerPin} />
            </View>
          </MapboxGL.PointAnnotation>
        )}

        {/* User Location (Blue dot) */}
        <MapboxGL.UserLocation visible={true} />
      </MapboxGL.MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    width: '100%',
    backgroundColor: '#F5F5F5',
  },
  map: {
    flex: 1,
  },
  markerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
  },
  markerDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: BRAND_COLORS.primary.xanhReu,
    borderWidth: 3,
    borderColor: 'white',
    zIndex: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  markerPin: {
    position: 'absolute',
    bottom: 2, // Căn chỉnh chân pin
    width: 4,
    height: 20,
    backgroundColor: BRAND_COLORS.primary.xanhReu,
    borderRadius: 2,
    zIndex: 1,
  }
});

export default CustomMapView;