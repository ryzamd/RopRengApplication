import { ILocationCoordinate, LocationService } from '@/src/infrastructure/services/LocationService';
import { useAddressSearch } from '@/src/utils/hooks/useAddressSearch';
import { Camera, CameraRef, UserLocation } from '@maplibre/maplibre-react-native';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch } from 'react-redux';
import { IAddressSuggestion } from '../../../domain/models/LocationModel';
import { GoongGeocodingRepository } from '../../../infrastructure/repositories/GoongGeocodingRepository';
import { setDeliveryAddress } from '../../../state/slices/delivery';
import { GoongMapView } from '../../components/map/GoongMapView';
import { MapSearchBar } from '../../components/map/MapSearchBar';

const repo = new GoongGeocodingRepository();
const locationService = new LocationService();

export default function AddressManagementScreen() {
  const router = useRouter();
  const dispatch = useDispatch();
  const cameraRef = useRef<CameraRef>(null);
  const { suggestions, isLoading, onSearch, onSelectAddress, sessionToken, refreshSessionToken } = useAddressSearch();
  const [selectedLocation, setSelectedLocation] = useState<ILocationCoordinate | null>(null);
  const [addressString, setAddressString] = useState('');
  const [isReverseGeocoding, setIsReverseGeocoding] = useState(false);
  const [initialRegion, setInitialRegion] = useState<[number, number] | undefined>(undefined);

  useEffect(() => {
    const initLocation = async () => {
      try {
        const hasPermission = await locationService.requestPermissions();
        if (hasPermission) {
          const loc = await locationService.getCurrentPosition();
          setInitialRegion([loc.longitude, loc.latitude]);
          
          setTimeout(() => {
             cameraRef.current?.setCamera({
               centerCoordinate: [loc.longitude, loc.latitude],
               zoomLevel: 15,
               animationDuration: 1000,
             });
          }, 500);
        } else {
            setInitialRegion([105.804817, 21.028511]);
        }
      } catch (e) {
        console.log("GPS Error", e);
        setInitialRegion([105.804817, 21.028511]);
      }
    };
    initLocation();
  }, []);
  
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
    }
  };

  const onRegionDidChange = useCallback(async (feature: any) => {
    const [lng, lat] = feature.geometry.coordinates;

    if (selectedLocation) {
        const dist = Math.sqrt(Math.pow(lng - selectedLocation.longitude, 2) + Math.pow(lat - selectedLocation.latitude, 2));
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
  }, [selectedLocation]);

  const onGoToMyLocation = async () => {
    try {
      const location = await locationService.getCurrentPosition();
      cameraRef.current?.setCamera({
        centerCoordinate: [location.longitude, location.latitude],
        zoomLevel: 15,
        animationDuration: 1000,
      });
    } catch (error) {
       console.log('Error getting location', error);
    }
  };

  const onConfirm = () => {
    if (!selectedLocation) return;
    
    dispatch(setDeliveryAddress({
      addressString: addressString,
      coordinates: selectedLocation,
    }));

    router.back();
  };

  const onBack = () => {
      router.back();
  };

  return (
    <View style={styles.container}>
      {initialRegion && (
          <GoongMapView
            style={styles.map}
            onRegionDidChange={onRegionDidChange}
          >
             <Camera
                ref={cameraRef}
                defaultSettings={{ centerCoordinate: initialRegion, zoomLevel: 14 }}
             />
             <UserLocation visible={true} />
          </GoongMapView>
      )}

      <View style={styles.centerMarkerContainer} pointerEvents="none">
         <Text style={{fontSize: 40, marginTop: -40}}>📍</Text>
      </View>

      <TouchableOpacity style={styles.backButton} onPress={onBack}>
         <Text style={{fontSize: 20}}>⬅️</Text>
      </TouchableOpacity>

      <MapSearchBar
        suggestions={suggestions}
        isLoading={isLoading}
        onSearch={onSearch}
        onSelectSuggestion={handleSelectSuggestion}
        initialValue={addressString}
      />

      <TouchableOpacity style={styles.myLocationBtn} onPress={onGoToMyLocation}>
         <Text style={{fontSize: 20}}>🎯</Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <View style={styles.addressPreview}>
           <Text style={styles.label}>ĐỊA CHỈ ĐÃ CHỌN</Text>
           <Text style={styles.addressText} numberOfLines={2}>
             {isReverseGeocoding ? 'Đang xác định vị trí...' : (addressString || 'Di chuyển bản đồ để chọn')}
           </Text>
        </View>
        
        <TouchableOpacity
          style={[styles.btnConfirm, (!selectedLocation || isReverseGeocoding) && styles.btnDisabled]}
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
  container: { flex: 1 },
  map: { flex: 1 },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 16,
    zIndex: 20,
    width: 40,
    height: 40,
    backgroundColor: '#fff',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: {width: 0, height: 2}
  },
  centerMarkerContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -10,
    marginTop: -20,
    zIndex: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
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
  },
  label: { fontSize: 12, color: '#888', fontWeight: 'bold', marginBottom: 4 },
  addressText: { fontSize: 16, fontWeight: '600', color: '#000', marginBottom: 16 },
  addressPreview: { marginBottom: 10 },
  btnConfirm: {
    backgroundColor: '#FF6600',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  btnDisabled: { backgroundColor: '#ccc' },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  myLocationBtn: {
    position: 'absolute',
    bottom: 180,
    right: 20,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    zIndex: 10,
  },
});