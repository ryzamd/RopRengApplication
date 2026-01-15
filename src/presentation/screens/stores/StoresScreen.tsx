import { selectStore } from '@/src/state/slices/homeSlice';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MOCK_STORES, Store } from '../../../data/mockStores';
import { setSelectedStore } from '../../../state/slices/orderCart';
import { useAppDispatch, useAppSelector } from '../../../utils/hooks';
import { BRAND_COLORS } from '../../theme/colors';
import { StoreSection } from './components/StoreSection';
import { StoresHeader } from './components/StoresHeader';
import { StoresSearchBar } from './components/StoresSearchBar';
import { STORES_TEXT } from './StoresConstants';
import { StoresUIService } from './StoresService';

export default function StoresScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const dispatch = useAppDispatch();
  
  const params = useLocalSearchParams<{ productId?: string; mode?: 'select' | 'browse' }>();
  
  const [searchQuery, setSearchQuery] = useState('');
  
  const selectedStore = useAppSelector((state) => state.orderCart.selectedStore);
  const totalItems = useAppSelector((state) => state.orderCart.totalItems);

  const apiStore = useAppSelector(selectStore);

  // TODO: Replace MOCK_STORES with API store list when backend ready
  // Expected endpoint: GET /stores/nearby?lat={lat}&lng={lng}&limit=20
  const baseStores = useMemo(() => {
    if (!apiStore) return MOCK_STORES;
    
    // Convert API Store to Mock Store UI format
    const uiStore: Store = {
      id: String(apiStore.id),
      name: apiStore.name,
      brandName: 'Rốp Rẻng',
      address: apiStore.address || 'Chưa có địa chỉ',
      imageUrl: 'https://via.placeholder.com/150',
      latitude: apiStore.location.coordinates[0],
      longitude: apiStore.location.coordinates[1],
      distanceKm: 0, // TODO: Calculate from user location
    };

    if (params.mode === 'select' && params.productId) {
      return [uiStore];
    }
    
    return [uiStore]; // TODO: Replace with full list from API
  }, [apiStore, params.mode, params.productId]);

  const filteredStores = useMemo(
    () => StoresUIService.filterStores(baseStores, searchQuery),
    [baseStores, searchQuery]
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
    
    // Check if switching stores with cart items
    if (selectedStore && selectedStore.id !== store.id && totalItems > 0) {
      Alert.alert(
        'Đổi cửa hàng',
        `Bạn đang có ${totalItems} sản phẩm trong giỏ hàng. Đổi cửa hàng sẽ xóa toàn bộ giỏ hàng hiện tại. Bạn có chắc chắn muốn tiếp tục?`,
        [
          {
            text: 'Không',
            style: 'cancel',
            onPress: () => console.log('[StoresScreen] User cancelled store switch'),
          },
          {
            text: 'Đồng ý',
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

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StoresHeader />
      
      <StoresSearchBar value={searchQuery} onChangeText={setSearchQuery} />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        {filteredStores.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>
              {params.mode === 'select' ? 'Không có cửa hàng nào có sản phẩm này' : 'Không tìm thấy cửa hàng'}
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