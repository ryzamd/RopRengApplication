import { Camera, MapView, UserLocation } from '@track-asia/trackasia-react-native';
import * as Crypto from 'expo-crypto';
import * as Location from 'expo-location';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { TRACKASIA_CONFIG } from '../../../config/trackasia.config';
import { DeliveryAddress } from '../../../domain/entities/DeliveryAddress';
import { GeocodingService } from '../../../infrastructure/location/GeocodingService';
import { BRAND_COLORS } from '../../theme/colors';
import { MAP_CONFIG, MAP_TEXT } from './MapConstants';
import { MapPickerProps } from './MapInterfaces';
import { MAP_LAYOUT } from './MapLayout';

export function MapPicker({
  initialLatitude = MAP_CONFIG.DEFAULT_LATITUDE,
  initialLongitude = MAP_CONFIG.DEFAULT_LONGITUDE,
  onConfirm,
  onCancel,
}: MapPickerProps) {
  const [centerCoordinate, setCenterCoordinate] = useState<[number, number]>([
    initialLongitude,
    initialLatitude,
  ]);
  const [isGeocodingLoading, setIsGeocodingLoading] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<DeliveryAddress | null>(null);

  useEffect(() => {
    // Reverse geocode initial position
    reverseGeocodePosition(initialLatitude, initialLongitude);
  }, [initialLatitude, initialLongitude]);

  const reverseGeocodePosition = async (lat: number, lng: number) => {
    setIsGeocodingLoading(true);
    try {
      const result = await GeocodingService.getInstance().reverseGeocode(lat, lng);
      
      const address = new DeliveryAddress(
        Crypto.randomUUID(),
        lat,
        lng,
        result,
        false,
        ''
      );
      
      setSelectedAddress(address);
    } catch (error) {
      console.error('[MapPicker] Reverse geocode error:', error);
      Alert.alert(MAP_TEXT.LOCATION_ERROR, 'Không thể lấy địa chỉ tại vị trí này');
    } finally {
      setIsGeocodingLoading(false);
    }
  };

  const handleRegionDidChange = useCallback(async (feature: any) => {
    const [lng, lat] = feature.geometry.coordinates;
    setCenterCoordinate([lng, lat]);
    await reverseGeocodePosition(lat, lng);
  }, []);

  const handleUseCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(MAP_TEXT.PERMISSION_DENIED);
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setCenterCoordinate([location.coords.longitude, location.coords.latitude]);
      await reverseGeocodePosition(location.coords.latitude, location.coords.longitude);
    } catch (error) {
      console.error('[MapPicker] Get location error:', error);
      Alert.alert(MAP_TEXT.LOCATION_ERROR);
    }
  };

  const handleConfirm = () => {
    if (selectedAddress) {
      onConfirm(selectedAddress);
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        mapStyle={TRACKASIA_CONFIG.STYLE_MAP_URL}
        logoEnabled={false}
        compassEnabled={true}
        onRegionDidChange={handleRegionDidChange}
      >
        <Camera
          zoomLevel={MAP_CONFIG.DEFAULT_ZOOM}
          centerCoordinate={centerCoordinate}
          animationMode="flyTo"
          animationDuration={500}
        />

        <UserLocation visible={true} />
      </MapView>

      {/* Center Marker (fixed position) */}
      <View style={styles.centerMarkerContainer}>
        <View style={styles.centerMarker} />
      </View>

      {/* Address Info Overlay */}
      <View style={styles.addressOverlay}>
        {isGeocodingLoading ? (
          <ActivityIndicator size="small" color={BRAND_COLORS.primary.xanhReu} />
        ) : (
          <Text style={styles.addressText} numberOfLines={2}>
            {selectedAddress?.formattedAddress || MAP_TEXT.GETTING_LOCATION}
          </Text>
        )}
      </View>

      {/* Bottom Controls */}
      <View style={styles.controls}>
        <TouchableOpacity
          style={styles.currentLocationButton}
          onPress={handleUseCurrentLocation}
          activeOpacity={0.7}
        >
          <Text style={styles.currentLocationText}>{MAP_TEXT.CURRENT_LOCATION}</Text>
        </TouchableOpacity>

        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={onCancel}
            activeOpacity={0.7}
          >
            <Text style={styles.cancelButtonText}>{MAP_TEXT.CANCEL}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.confirmButton]}
            onPress={handleConfirm}
            disabled={!selectedAddress}
            activeOpacity={0.7}
          >
            <Text style={styles.confirmButtonText}>{MAP_TEXT.CONFIRM_ADDRESS}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BRAND_COLORS.background.default,
  },
  map: {
    flex: 1,
  },
  centerMarkerContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -20,
    marginTop: -40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerMarker: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FF6B6B',
    borderWidth: 3,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  addressOverlay: {
    position: 'absolute',
    top: 20,
    left: 16,
    right: 16,
    backgroundColor: BRAND_COLORS.background.default,
    borderRadius: 12,
    padding: 16,
    minHeight: 60,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  addressText: {
    fontSize: MAP_LAYOUT.CARD_ADDRESS_FONT_SIZE,
    fontFamily: 'SpaceGrotesk-Medium',
    color: BRAND_COLORS.primary.xanhReu,
  },
  controls: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: BRAND_COLORS.background.default,
    padding: MAP_LAYOUT.CONFIRM_BUTTON_MARGIN,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: BRAND_COLORS.border.light,
  },
  currentLocationButton: {
    backgroundColor: BRAND_COLORS.primary.beSua,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  currentLocationText: {
    fontSize: 14,
    fontFamily: 'SpaceGrotesk-Medium',
    color: BRAND_COLORS.primary.xanhReu,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    height: MAP_LAYOUT.CONFIRM_BUTTON_HEIGHT,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: BRAND_COLORS.border.light,
  },
  confirmButton: {
    backgroundColor: BRAND_COLORS.primary.xanhReu,
  },
  cancelButtonText: {
    fontSize: 16,
    fontFamily: 'Phudu-Bold',
    color: BRAND_COLORS.text.secondary,
  },
  confirmButtonText: {
    fontSize: 16,
    fontFamily: 'Phudu-Bold',
    color: BRAND_COLORS.background.default,
  },
});