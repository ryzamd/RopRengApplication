import { ILocationCoordinate, LocationService } from '@/src/infrastructure/services/LocationService';
import { useAddressSearch } from '@/src/utils/hooks/useAddressSearch';
import { Camera, CameraRef, UserLocation } from '@maplibre/maplibre-react-native';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { IAddressSuggestion } from '../../../domain/models/LocationModel';
import { GoongGeocodingRepository } from '../../../infrastructure/repositories/GoongGeocodingRepository';
import { setDeliveryAddress } from '../../../state/slices/delivery';
import { RootState } from '../../../state/store';
import { GoongMapView } from '../../components/map/GoongMapView';
import { MapSearchBar } from '../../components/map/MapSearchBar';
import { AppIcon } from '../../components/shared/AppIcon';
import { BRAND_COLORS } from '../../theme/colors';

const repo = new GoongGeocodingRepository();
const locationService = new LocationService();

const DEFAULT_COORDS: [number, number] = [106.6297, 10.8231];

export default function AddressManagementScreen() {
  const router = useRouter();
  const dispatch = useDispatch();
  const cameraRef = useRef<CameraRef>(null);
  
  const savedAddress = useSelector((state: RootState) => state.delivery.selectedAddress);
  
  const { suggestions, isLoading, onSearch, onSelectAddress, sessionToken, refreshSessionToken } = useAddressSearch();
  const [selectedLocation, setSelectedLocation] = useState<ILocationCoordinate | null>(null);
  const [addressString, setAddressString] = useState('');
  const [isReverseGeocoding, setIsReverseGeocoding] = useState(false);
  const [initialRegion, setInitialRegion] = useState<[number, number] | undefined>(undefined);
  const [isMapReady, setIsMapReady] = useState(false);

  useEffect(() => {
    const initLocation = async () => {
      try {
        if (savedAddress?.coordinates) {
          const coords: [number, number] = [
            savedAddress.coordinates.longitude,
            savedAddress.coordinates.latitude,
          ];
          console.log('[AddressManagement] INIT from Redux:', {
            lat: savedAddress.coordinates.latitude,
            lng: savedAddress.coordinates.longitude,
            address: savedAddress.addressString,
          });
          setInitialRegion(coords);
          setSelectedLocation(savedAddress.coordinates);
          setAddressString(savedAddress.addressString);
          return;
        }

        const hasPermission = await locationService.requestPermissions();
        if (hasPermission) {
          const loc = await locationService.getCurrentPosition();
          console.log('[AddressManagement] INIT from GPS:', {
            lat: loc.latitude,
            lng: loc.longitude,
          });
          const coords: [number, number] = [loc.longitude, loc.latitude];
          setInitialRegion(coords);
          setSelectedLocation(loc);
          
          setIsReverseGeocoding(true);
          const address = await repo.reverseGeocode(loc);
          console.log('[AddressManagement] Reverse geocode result:', address);
          setAddressString(address);
          setIsReverseGeocoding(false);
        } else {
          console.log('[AddressManagement] INIT fallback to HCM (no permission)');
          setInitialRegion(DEFAULT_COORDS);
        }
      } catch (error) {
        console.log('[AddressManagement] GPS Error:', error);
        setInitialRegion(DEFAULT_COORDS);
      }
    };

    initLocation();
  }, [savedAddress]);

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
    } catch (error) {
      console.error('Select suggestion error:', error);
    }
  };

  const onRegionDidChange = useCallback(
    async (feature: any) => {
      if (!isMapReady) return;
      
      const [lng, lat] = feature.geometry.coordinates;

      if (selectedLocation) {
        const dist = Math.sqrt(
          Math.pow(lng - selectedLocation.longitude, 2) + Math.pow(lat - selectedLocation.latitude, 2)
        );
        if (dist < 0.0001) return;
      }

      setIsReverseGeocoding(true);

      try {
        const newAddress = await repo.reverseGeocode({ latitude: lat, longitude: lng });
        setAddressString(newAddress);
        setSelectedLocation({ latitude: lat, longitude: lng });
      } finally {
        setIsReverseGeocoding(false);
      }
    },
    [selectedLocation, isMapReady]
  );

  const onGoToMyLocation = async () => {
    try {
      const location = await locationService.getCurrentPosition();
      cameraRef.current?.setCamera({
        centerCoordinate: [location.longitude, location.latitude],
        zoomLevel: 15,
        animationDuration: 1000,
      });
    } catch (error) {
      console.log('Error getting location:', error);
    }
  };

  const onConfirm = () => {
    if (!selectedLocation) return;

    dispatch(
      setDeliveryAddress({
        addressString: addressString,
        coordinates: selectedLocation,
      })
    );

    router.back();
  };

  const onBack = () => {
    router.back();
  };

  const handleMapReady = () => {
    setIsMapReady(true);
  };

  return (
    <View style={styles.container}>
      {initialRegion && (
        <GoongMapView
          style={styles.map}
          onRegionDidChange={onRegionDidChange}
          onMapReady={handleMapReady}
        >
          <Camera
            ref={cameraRef}
            defaultSettings={{ centerCoordinate: initialRegion, zoomLevel: 15 }}
          />
          <UserLocation visible={true} />
        </GoongMapView>
      )}

      <View style={styles.centerMarkerContainer} pointerEvents="none">
        <View style={styles.markerPin}>
          <AppIcon name="location" size={32} color={BRAND_COLORS.primary.beSua} />
        </View>
        <View style={styles.markerShadow} />
      </View>

      <TouchableOpacity style={styles.backButton} onPress={onBack} activeOpacity={0.8}>
        <AppIcon name="arrow-back" size={20} color={BRAND_COLORS.text.primary} />
      </TouchableOpacity>

      <MapSearchBar
        suggestions={suggestions}
        isLoading={isLoading}
        onSearch={onSearch}
        onSelectSuggestion={handleSelectSuggestion}
        initialValue={addressString}
      />

      <TouchableOpacity style={styles.myLocationBtn} onPress={onGoToMyLocation} activeOpacity={0.8}>
        <AppIcon name="location" size={22} color={BRAND_COLORS.primary.xanhReu} />
      </TouchableOpacity>

      <View style={styles.footer}>
        <View style={styles.addressPreview}>
          <Text style={styles.label}>ĐỊA CHỈ GIAO HÀNG</Text>
          <Text style={styles.addressText} numberOfLines={2}>
            {isReverseGeocoding
              ? 'Đang xác định vị trí...'
              : addressString || 'Di chuyển bản đồ để chọn địa chỉ'}
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.btnConfirm, (!selectedLocation || isReverseGeocoding) && styles.btnDisabled]}
          onPress={onConfirm}
          disabled={!selectedLocation || isReverseGeocoding}
          activeOpacity={0.8}
        >
          <Text style={styles.btnText}>Xác nhận địa chỉ này</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  map: {
    flex: 1,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 16,
    zIndex: 20,
    width: 44,
    height: 44,
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
  },
  centerMarkerContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -16,
    marginTop: -48,
    zIndex: 5,
    alignItems: 'center',
  },
  markerPin: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: BRAND_COLORS.primary.xanhReu,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
  },
  markerShadow: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'rgba(0,0,0,0.2)',
    marginTop: 4,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 34,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: -4 },
  },
  addressPreview: {
    marginBottom: 16,
  },
  label: {
    fontSize: 12,
    color: '#888888',
    fontWeight: '600',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  addressText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    lineHeight: 22,
  },
  btnConfirm: {
    backgroundColor: BRAND_COLORS.primary.xanhReu,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  btnDisabled: {
    backgroundColor: '#CCCCCC',
  },
  btnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
  },
  myLocationBtn: {
    position: 'absolute',
    bottom: 200,
    right: 20,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    zIndex: 10,
  },
});