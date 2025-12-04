import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MOCK_STORES, Store } from '../../../data/mockStores';
import { setSelectedStore } from '../../../state/slices/orderCart';
import { useAppDispatch } from '../../../utils/hooks';
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

  const baseStores = useMemo(() => {
    if (params.mode === 'select' && params.productId) {
      return StoresUIService.getAvailableStoresForProduct(MOCK_STORES, params.productId);
    }
    return MOCK_STORES;
  }, [params.mode, params.productId]);

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

  const handleStorePress = (store: Store) => {
    console.log(`[StoresScreen] Store pressed: ${store.name}`);
    
    if (params.mode === 'select') {
      console.log(`[StoresScreen] Select mode - setting store and navigating to Order`);
      
      dispatch(setSelectedStore(store));
      
      console.log(`[StoresScreen] Navigating to OrderScreen...`);
      router.replace('/(tabs)/order');
    } else {
      // Browse mode logic (Future impl)
      // router.push(`/store-detail/${store.id}`);
    }
  };

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
  productContext: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: BRAND_COLORS.primary.beSua,
    borderBottomWidth: 1,
    borderBottomColor: BRAND_COLORS.secondary.nauCaramel,
  },
  productContextLabel: {
    fontSize: 14,
    fontFamily: 'SpaceGrotesk-Medium',
    color: BRAND_COLORS.secondary.reuDam,
    marginBottom: 4,
  },
  storeCount: {
    fontSize: 14,
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