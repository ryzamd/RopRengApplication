import React, { useRef, useState, useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, ViewStyle, TextStyle } from 'react-native';
import { CameraRef, Camera } from '@maplibre/maplibre-react-native';
import { useRouter } from 'expo-router';
import { GoongMapView } from '../../components/map/GoongMapView';
import { MapSearchBar } from '../../components/map/MapSearchBar';
import { GoongGeocodingRepository } from '../../../infrastructure/repositories/GoongGeocodingRepository';
import { IAddressSuggestion } from '../../../domain/models/LocationModel';
import { useAddressSearch } from '@/src/utils/hooks/useAddressSearch';
import { ILocationCoordinate } from '@/src/infrastructure/services/LocationService';

const repo = new GoongGeocodingRepository();
// const locationService = new LocationService(); // Comment out nếu chưa dùng để tránh warning

export default function AddressManagementScreen() {
  const router = useRouter();
  const cameraRef = useRef<CameraRef>(null);
  const { suggestions, isLoading, onSearch, onSelectAddress, sessionToken, refreshSessionToken } = useAddressSearch();
  const [selectedLocation, setSelectedLocation] = useState<ILocationCoordinate | null>(null);
  const [addressString, setAddressString] = useState('');
  const [isReverseGeocoding, setIsReverseGeocoding] = useState(false);

  const handleSelectSuggestion = async (item: IAddressSuggestion) => {
    try {
      setAddressString(item.description);
      onSelectAddress(item);

      const coords = await repo.getPlaceDetail(item.place_id, sessionToken);
      
      refreshSessionToken();

      setSelectedLocation(coords);
      
      cameraRef.current?.setCamera({
        centerCoordinate: [coords.longitude, coords.latitude],
        zoomLevel: 16,
        animationDuration: 1000,
      });

    } catch (e) {
      console.error(e);
      // Có thể show toast lỗi ở đây
    }
  };

  const onRegionDidChange = useCallback(async (feature: any) => {
    const [lng, lat] = feature.geometry.coordinates;
    
    setIsReverseGeocoding(true);
    try {
      const newAddress = await repo.reverseGeocode({ latitude: lat, longitude: lng });
      setAddressString(newAddress);
      setSelectedLocation({ latitude: lat, longitude: lng });
    } finally {
      setIsReverseGeocoding(false);
    }
  }, []);

  const onConfirm = () => {
    if (!selectedLocation) return;
    console.log("CONFIRM:", addressString, selectedLocation);
    // TODO: Dispatch Action / Save Global State
    router.back();
  };

  return (
    <View style={styles.container}>
      <GoongMapView
        onMapReady={() => {}}
        onRegionDidChange={onRegionDidChange}
      >
         <Camera ref={cameraRef} defaultSettings={{ zoomLevel: 14 }} />
      </GoongMapView>

      <View style={styles.centerMarkerContainer} pointerEvents="none">
         <Text style={{fontSize: 40, marginTop: -40}}>📍</Text>
      </View>

      {/* FIX: Pass props xuống SearchBar */}
      <MapSearchBar
        suggestions={suggestions}
        isLoading={isLoading}
        onSearch={onSearch}
        onSelectSuggestion={handleSelectSuggestion}
        initialValue={addressString}
      />

      <View style={styles.footer}>
        <View style={styles.addressPreview}>
           <Text style={styles.label}>ĐỊA CHỈ ĐÃ CHỌN</Text>
           <Text style={styles.addressText} numberOfLines={2}>
             {isReverseGeocoding ? 'Đang xác định vị trí...' : (addressString || 'Vui lòng chọn địa điểm')}
           </Text>
        </View>
        
        <TouchableOpacity
          style={[styles.btnConfirm, !selectedLocation && styles.btnDisabled]}
          onPress={onConfirm}
          disabled={!selectedLocation || isReverseGeocoding}
        >
          <Text style={styles.btnText}>Xác nhận địa chỉ này</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 } as ViewStyle,
  centerMarkerContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -10,
    marginTop: -20,
    zIndex: 5,
    alignItems: 'center',
    justifyContent: 'center',
  } as ViewStyle,
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
  } as ViewStyle,
  label: { fontSize: 12, color: '#888', fontWeight: 'bold', marginBottom: 4 } as TextStyle,
  addressText: { fontSize: 16, fontWeight: '600', color: '#000', marginBottom: 16 } as TextStyle,
  addressPreview: { marginBottom: 10 } as ViewStyle,
  btnConfirm: {
    backgroundColor: '#FF6600',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  } as ViewStyle,
  btnDisabled: { backgroundColor: '#ccc' } as ViewStyle,
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 } as TextStyle,
});