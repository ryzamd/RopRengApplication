import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MOCK_STORES, Store } from '../../../data/mockStores';
import { BRAND_COLORS } from '../../theme/colors';
import { StoreSection } from './components/StoreSection';
import { StoresHeader } from './components/StoresHeader';
import { StoresSearchBar } from './components/StoresSearchBar';
import { STORES_TEXT } from './StoresConstants';
import { StoresUIService } from './StoresService';

export default function StoresScreen() {
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredStores = useMemo(
    () => StoresUIService.filterStores(MOCK_STORES, searchQuery),
    [searchQuery]
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
    // TODO: Navigate to store detail or show info
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StoresHeader />
      <StoresSearchBar value={searchQuery} onChangeText={setSearchQuery} />
      
      <ScrollView showsVerticalScrollIndicator={false}>
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
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BRAND_COLORS.background.default,
  },
});