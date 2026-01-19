import { setSelectedStore } from '@/src/state/slices/orderCart';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Store } from '../../../data/mockStores';
import { clearStoresError, fetchStores, fetchStoresByProduct } from '../../../state/slices/storesSlice';
import { useAppDispatch, useAppSelector } from '../../../utils/hooks';
import { BRAND_COLORS } from '../../theme/colors';
import { StoreSection } from './components/StoreSection';
import { StoresHeader } from './components/StoresHeader';
import { StoresSearchBar } from './components/StoresSearchBar';
import { STORES_TEXT } from './StoresConstants';
import { StoresUIService } from './StoresService';
import { APP_DEFAULT_LOCATION } from '@/src/core/config/locationConstants';
import { locationService } from '@/src/infrastructure/services';

export default function StoresScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const dispatch = useAppDispatch();
  
  const params = useLocalSearchParams<{ productId?: string; mode?: 'select' | 'browse' }>();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  
  const selectedStore = useAppSelector((state) => state.orderCart.selectedStore);
  const totalItems = useAppSelector((state) => state.orderCart.totalItems);
  const { stores: apiStores, loading, error } = useAppSelector((state) => state.stores);

  useEffect(() => {
    const initData = async () => {
      try {
        const location = await locationService.getCurrentPosition();
        
        setUserLocation({
          lat: location.latitude,
          lng: location.longitude,
        });

        if (params.mode === 'select' && params.productId) {
          dispatch(
            fetchStoresByProduct({
              lat: location.latitude,
              lng: location.longitude,
              productId: Number(params.productId),
              page: 0,
              limit: 20,
              refresh: true,
            })
          );
        } else {
          dispatch(fetchStores({ page: 1, refresh: true }));
        }
      } catch (error) {
        console.log('[StoresScreen] Error:', error);
        setUserLocation({
          lat: APP_DEFAULT_LOCATION.latitude,
          lng: APP_DEFAULT_LOCATION.longitude,
        });
        dispatch(fetchStores({ page: 1, refresh: true }));
      }
    };

    initData();
  }, [dispatch, params.mode, params.productId]);

  const uiStores = useMemo<Store[]>(() => {
    return apiStores.map(apiStore =>
      StoresUIService.mapApiStoreToUIStore(apiStore, userLocation)
    );
  }, [apiStores, userLocation]);

  const filteredStores = useMemo(
    () => StoresUIService.filterStores(uiStores, searchQuery),
    [uiStores, searchQuery]
  );

  const nearestStore = useMemo(
    () => StoresUIService.getNearestStore(filteredStores),
    [filteredStores]
  );

  const otherStores = useMemo(
    () => StoresUIService.getOtherStores(filteredStores),
    [filteredStores]
  );

  const handleStorePress = useCallback((store: Store) => {
    console.log(`[StoresScreen] Store pressed: ${store.name}`);
    
    if (selectedStore && selectedStore.id !== store.id && totalItems > 0) {
      Alert.alert(
        STORES_TEXT.ALERT_TITLE,
        STORES_TEXT.ALERT_MESSAGE(totalItems),
        [
          {
            text: STORES_TEXT.ALERT_CANCEL,
            style: 'cancel',
            onPress: () => console.log('[StoresScreen] User cancelled store switch'),
          },
          {
            text: STORES_TEXT.ALERT_CONFIRM,
            style: 'destructive',
            onPress: () => {
              console.log('[StoresScreen] User confirmed, clearing cart and switching store');
              dispatch(setSelectedStore(store));
              
              if (params.mode === 'select') {
                router.replace('/(tabs)/order');
              }
            },
          },
        ]
      );
      return;
    }
    
    if (params.mode === 'select') {
      console.log('[StoresScreen] Setting store and navigating to Order');
      dispatch(setSelectedStore(store));
      router.replace('/(tabs)/order');
    }
  }, [selectedStore, totalItems, dispatch, router, params.mode]);

  useEffect(() => {
    const loadStores = async () => {
      if (params.mode === 'select' && params.productId && userLocation) {
        dispatch(fetchStoresByProduct({
          productId: Number(params.productId),
          lat: userLocation.lat,
          lng: userLocation.lng,
          limit: 20,
        }));
      } else {
        dispatch(fetchStores({ page: 1, refresh: true }));
      }
    };

    loadStores();
  }, [dispatch, params.mode, params.productId, userLocation]);

  const handleRetry = useCallback(() => {
    dispatch(clearStoresError());
    
    if (params.mode === 'select' && params.productId && userLocation) {
      dispatch(
        fetchStoresByProduct({
          lat: userLocation.lat,
          lng: userLocation.lng,
          productId: Number(params.productId),
          page: 0,
          limit: 20,
          refresh: true,
        })
      );
    } else {
      dispatch(fetchStores({ page: 1, refresh: true }));
    }
  }, [dispatch, params.mode, params.productId, userLocation]);

  if (loading) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <StoresHeader />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={BRAND_COLORS.primary.xanhReu} />
          <Text style={styles.loadingText}>{STORES_TEXT.LOADING_MESSAGE}</Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <StoresHeader />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <Text style={styles.retryButton} onPress={handleRetry}>
            {STORES_TEXT.RETRY_BUTTON}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StoresHeader />
      
      <StoresSearchBar value={searchQuery} onChangeText={setSearchQuery} />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        {filteredStores.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>
              {params.mode === 'select' 
                ? STORES_TEXT.EMPTY_MESSAGE_SELECT 
                : STORES_TEXT.EMPTY_MESSAGE_BROWSE}
            </Text>
          </View>
        ) : (
          <>
            {nearestStore && (
              <StoreSection
                title={STORES_TEXT.SECTION_NEARBY}
                stores={[nearestStore]}
                onStorePress={handleStorePress}
              />
            )}
            
            <StoreSection
              title={STORES_TEXT.SECTION_OTHERS}
              stores={otherStores}
              onStorePress={handleStorePress}
            />
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BRAND_COLORS.background.default,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
  },
  loadingText: {
    fontSize: 16,
    fontFamily: 'SpaceGrotesk-Medium',
    color: BRAND_COLORS.primary.xanhReu,
    marginTop: 12,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
    paddingHorizontal: 24,
  },
  errorText: {
    fontSize: 16,
    fontFamily: 'SpaceGrotesk-Medium',
    color: '#D32F2F',
    textAlign: 'center',
    marginBottom: 12,
  },
  retryButton: {
    fontSize: 16,
    fontFamily: 'SpaceGrotesk-Bold',
    color: BRAND_COLORS.primary.xanhReu,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
    paddingHorizontal: 24,
  },
  emptyText: {
    fontSize: 16,
    fontFamily: 'SpaceGrotesk-Medium',
    color: BRAND_COLORS.primary.xanhReu,
    textAlign: 'center',
  },
});