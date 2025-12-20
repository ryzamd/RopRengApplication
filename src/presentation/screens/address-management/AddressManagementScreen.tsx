import { Stack } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MapSearchBar } from '../../components/map/MapSearchBar';
import CustomMapView from '../../components/map/MapView';
import { BRAND_COLORS } from '../../theme/colors';

type LocationData = {
  lat: number;
  lng: number;
  address: string;
};

export default function AddressManagementScreen() {
  const insets = useSafeAreaInsets();
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(null);

  const handleSearchSelect = useCallback((location: LocationData) => {
    setSelectedLocation(location);
  }, []);

  const handleMapLocationSelect = useCallback((location: LocationData) => {
    setSelectedLocation(location);
  }, []);

  const handleConfirmAddress = () => {
    if (!selectedLocation) return;
    
    console.log('Confirmed Address:', selectedLocation);
    // Logic lưu địa chỉ hoặc back về màn trước
    // router.back();
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Map Layer */}
      <View style={styles.mapContainer}>
        <CustomMapView
          currentLocation={selectedLocation}
          onLocationSelect={handleMapLocationSelect}
        />
      </View>

      {/* Search Layer */}
      <MapSearchBar
        onLocationSelect={handleSearchSelect}
        initialAddress={selectedLocation?.address}
      />

      {/* Footer Layer */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
        <View style={styles.addressInfo}>
          <Text style={styles.label}>Vị trí đã chọn:</Text>
          <Text style={styles.addressText} numberOfLines={2}>
            {selectedLocation?.address || 'Vui lòng tìm kiếm hoặc chọn trên bản đồ'}
          </Text>
        </View>

        <TouchableOpacity
          style={[
            styles.confirmButton,
            !selectedLocation && styles.disabledButton
          ]}
          onPress={handleConfirmAddress}
          disabled={!selectedLocation}
        >
          <Text style={styles.confirmButtonText}>Xác nhận địa chỉ này</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BRAND_COLORS.background.default,
  },
  mapContainer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: BRAND_COLORS.background.default,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 16,
    paddingTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
    zIndex: 100,
  },
  addressInfo: {
    marginBottom: 16,
  },
  label: {
    fontSize: 12,
    color: BRAND_COLORS.text.secondary,
    fontFamily: 'SpaceGrotesk-Medium',
    marginBottom: 4,
  },
  addressText: {
    fontSize: 16,
    color: BRAND_COLORS.text.primary,
    fontFamily: 'SpaceGrotesk-Bold',
  },
  confirmButton: {
    backgroundColor: BRAND_COLORS.primary.xanhReu,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#E0E0E0',
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Phudu-SemiBold',
  },
});