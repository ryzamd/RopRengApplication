import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MOCK_PRODUCTS, Product } from '../../../data/mockProducts';
import { AppIcon } from '../../components/shared/AppIcon';
import { BRAND_COLORS } from '../../theme/colors';
import { HEADER_ICONS } from '../../theme/iconConstants';
import { SEARCH_TEXT } from './SearchConstants';
import { SearchFilterMode } from './SearchEnums';
import { SEARCH_LAYOUT } from './SearchLayout';
import { SearchUIService } from './SearchService';

export default function SearchScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(MOCK_PRODUCTS);
  
  const filterMode: SearchFilterMode = params.categoryId ? SearchFilterMode.CATEGORY : SearchFilterMode.ALL;

  // Debounced search handler
  const debouncedSearch = useMemo(
    () => SearchUIService.createDebounce(
      (query: string) => {
        const filtered = SearchUIService.applyFilters(
          MOCK_PRODUCTS,
          filterMode,
          query,
          params.categoryId as string | undefined
        );
        setFilteredProducts(filtered);
      },
      SEARCH_LAYOUT.SEARCH_DEBOUNCE_MS
    ),
    [filterMode, params.categoryId]
  );

  const handleSearch = useCallback((text: string) => {
    setSearchQuery(text);
    debouncedSearch(text);
  }, [debouncedSearch]);

  // Initial filter by category
  useEffect(() => {
    if (filterMode === SearchFilterMode.CATEGORY && params.categoryId) {
      const filtered = SearchUIService.filterByCategory(
        MOCK_PRODUCTS,
        params.categoryId as string
      );
      setFilteredProducts(filtered);
    }
  }, [params.categoryId, filterMode]);

  const handleAddPress = () => {
    router.push('/login');
  };

  const renderItem = ({ item }: { item: Product }) => (
    <View style={styles.productItem}>
      <View style={styles.productImage}>
        <Text style={styles.imagePlaceholder}>{SEARCH_TEXT.IMAGE_PLACEHOLDER}</Text>
        {item.badge && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{item.badge}</Text>
          </View>
        )}
      </View>
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productPrice}>{item.price.toLocaleString('vi-VN')}đ</Text>
      </View>
      <TouchableOpacity style={styles.addButton} onPress={handleAddPress}>
        <Text style={styles.addIcon}>+</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.searchBar}>
          <AppIcon name={HEADER_ICONS.SEARCH} size="sm" color="#999999" />
          <TextInput
            style={styles.searchInput}
            placeholder={SEARCH_TEXT.PLACEHOLDER}
            placeholderTextColor="#999999"
            value={searchQuery}
            onChangeText={handleSearch}
            autoFocus
          />
        </View>
        <TouchableOpacity style={styles.cancelButton} onPress={() => router.back()}>
          <Text style={styles.cancelText}>{SEARCH_TEXT.CANCEL_BUTTON}</Text>
        </TouchableOpacity>
      </View>

      {/* Product List */}
      <FlatList
        data={filteredProducts}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BRAND_COLORS.background.default,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SEARCH_LAYOUT.HEADER_PADDING_HORIZONTAL,
    paddingVertical: SEARCH_LAYOUT.HEADER_PADDING_VERTICAL,
    gap: SEARCH_LAYOUT.HEADER_GAP,
    backgroundColor: BRAND_COLORS.background.default,
    borderBottomWidth: SEARCH_LAYOUT.HEADER_BORDER_BOTTOM_WIDTH,
    borderBottomColor: '#F0F0F0',
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
    borderRadius: SEARCH_LAYOUT.SEARCH_BAR_BORDER_RADIUS,
    paddingHorizontal: SEARCH_LAYOUT.SEARCH_BAR_PADDING_HORIZONTAL,
    gap: SEARCH_LAYOUT.SEARCH_BAR_GAP,
  },
  searchIcon: {
    fontSize: SEARCH_LAYOUT.SEARCH_ICON_FONT_SIZE,
  },
  searchInput: {
    flex: 1,
    fontSize: SEARCH_LAYOUT.SEARCH_INPUT_FONT_SIZE,
    fontFamily: 'SpaceGrotesk-Medium',
    color: BRAND_COLORS.primary.xanhReu,
    paddingVertical: 8,
  },
  cancelButton: {
    paddingVertical: 8,
  },
  cancelText: {
    fontSize: SEARCH_LAYOUT.CANCEL_BUTTON_FONT_SIZE,
    fontFamily: 'SpaceGrotesk-Medium',
    color: BRAND_COLORS.secondary.nauEspresso,
  },
  listContent: {
    padding: SEARCH_LAYOUT.LIST_PADDING,
  },
  productItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: BRAND_COLORS.background.default,
    borderRadius: SEARCH_LAYOUT.ITEM_BORDER_RADIUS,
    padding: SEARCH_LAYOUT.ITEM_PADDING,
    marginBottom: SEARCH_LAYOUT.ITEM_MARGIN_BOTTOM,
    gap: SEARCH_LAYOUT.ITEM_GAP,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  productImage: {
    position: 'relative',
    width: SEARCH_LAYOUT.IMAGE_SIZE,
    height: SEARCH_LAYOUT.IMAGE_SIZE,
    backgroundColor: BRAND_COLORS.primary.beSua,
    borderRadius: SEARCH_LAYOUT.IMAGE_BORDER_RADIUS,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholder: {
    fontSize: SEARCH_LAYOUT.IMAGE_PLACEHOLDER_FONT_SIZE,
    fontFamily: 'Phudu-Bold',
    color: BRAND_COLORS.primary.xanhReu,
  },
  badge: {
    position: 'absolute',
    top: SEARCH_LAYOUT.BADGE_TOP,
    right: SEARCH_LAYOUT.BADGE_RIGHT,
    backgroundColor: BRAND_COLORS.secondary.hongSua,
    borderRadius: SEARCH_LAYOUT.BADGE_BORDER_RADIUS,
    paddingHorizontal: SEARCH_LAYOUT.BADGE_PADDING_HORIZONTAL,
    paddingVertical: SEARCH_LAYOUT.BADGE_PADDING_VERTICAL,
  },
  badgeText: {
    fontSize: SEARCH_LAYOUT.BADGE_FONT_SIZE,
    fontFamily: 'Phudu-Bold',
    color: BRAND_COLORS.background.default,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: SEARCH_LAYOUT.PRODUCT_NAME_FONT_SIZE,
    fontFamily: 'SpaceGrotesk-Medium',
    color: BRAND_COLORS.primary.xanhReu,
    marginBottom: 4,
  },
  productPrice: {
    fontSize: SEARCH_LAYOUT.PRODUCT_PRICE_FONT_SIZE,
    fontFamily: 'Phudu-Bold',
    color: BRAND_COLORS.primary.xanhReu,
  },
  addButton: {
    width: SEARCH_LAYOUT.ADD_BUTTON_SIZE,
    height: SEARCH_LAYOUT.ADD_BUTTON_SIZE,
    backgroundColor: BRAND_COLORS.secondary.nauEspresso,
    borderRadius: SEARCH_LAYOUT.ADD_BUTTON_BORDER_RADIUS,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addIcon: {
    fontSize: SEARCH_LAYOUT.ADD_ICON_FONT_SIZE,
    color: BRAND_COLORS.background.default,
    fontWeight: 'bold',
  },
});