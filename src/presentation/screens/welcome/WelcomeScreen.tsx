import { useAuthGuard } from '@/src/utils/hooks/useAuthGuard';
import { useHomeData } from '@/src/utils/hooks/useHomeData';
import { LinearGradient } from 'expo-linear-gradient';
import * as Location from 'expo-location';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, ListRenderItem, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { permissionService } from '../../../infrastructure/services/PermissionService';
import { AppIcon } from '../../components/shared/AppIcon';
import { BRAND_COLORS } from '../../theme/colors';
import { HEADER_ICONS } from '../../theme/iconConstants';
import { BrandSelector } from './components/BrandSelector';
import { CategoryItem, CategoryScroll } from './components/CategoryScroll';
import { LoginCard } from './components/LoginCard';
import { ProductCard, ProductCardData } from './components/ProductCard';
import { PromoBanner } from './components/PromoBanner';
import { QuickActions } from './components/QuickActions';
import { SearchBar } from './components/SearchBar';
import { WELCOME_TEXT } from './WelcomeConstants';

const DEFAULT_LOCATION = { lat: 10.9674038, lng: 107.207539 };
const PAGE_LIMIT = 10;
const LOAD_MORE_THRESHOLD = 0.5;

const CATEGORY_ICONS: Record<string, string> = {
  '1': 'cafe',
  '2': 'leaf-outline',
  '3': 'snow-outline',
};

export default function WelcomeScreen() {
  const insets = useSafeAreaInsets();
  
  const [currentLocation, setCurrentLocation] = useState(DEFAULT_LOCATION);
  const [isLocationReady, setIsLocationReady] = useState(false);

  useEffect(() => {
    const initLocation = async () => {
        try {
            const hasPermission = await permissionService.checkOrRequestLocation();
            if (hasPermission) {
                const location = await Location.getCurrentPositionAsync({
                    accuracy: Location.Accuracy.Balanced,
                });
                
                console.log('📍 Got real location:', location.coords.latitude, location.coords.longitude);
                
                setCurrentLocation({
                    lat: location.coords.latitude,
                    lng: location.coords.longitude
                });
            }
        } catch (e) {
            console.error('⚠️ Location Error Details:', e);
            console.log('WelcomeScreen: Using default location');
        } finally {
            setIsLocationReady(true);
        }
    };
    initLocation();
  }, []);

  const {
    products,
    isLoading,
    isLoadingMore,
    hasMore,
    error,
    refresh,
    loadMore,
    clearError,
  } = useHomeData({
    lat: currentLocation.lat,
    lng: currentLocation.lng,
    limit: PAGE_LIMIT,
    enabled: isLocationReady,
  });

  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  }, [refresh]);

  const handleRetry = useCallback(() => {
    clearError();
    refresh();
  }, [clearError, refresh]);

    const handleProductPress = useAuthGuard(
      (product: ProductCardData) => {
        console.log('[WelcomeScreen] Navigating to product:', product.id);
        // TODO: Navigate to product detail
      },
      'PURCHASE',
      (product: ProductCardData) => ({ productId: product.id })
    );

  const handleCategoryPress = useCallback((categoryId: string) => {
    setSelectedCategoryId((prev) => (prev === categoryId ? null : categoryId));
  }, []);

  const categories: CategoryItem[] = useMemo(() => {
    const map = new Map<string, CategoryItem>();
    products.forEach((p) => {
      if (!map.has(p.categoryId)) {
        map.set(p.categoryId, {
          id: p.categoryId,
          name: `Danh mục ${p.categoryId}`,
          icon: CATEGORY_ICONS[p.categoryId] || 'cafe-outline',
        });
      }
    });
    return Array.from(map.values());
  }, [products]);

  const filteredProducts = useMemo(() => {
    if (!selectedCategoryId) return products;
    return products.filter((p) => p.categoryId === selectedCategoryId);
  }, [products, selectedCategoryId]);

  const renderProduct: ListRenderItem<typeof products[0]> = useCallback(
    ({ item }) => <ProductCard product={item} onPress={handleProductPress} />,
    [handleProductPress]
  );

  const ListHeader = useCallback(
    () => (
      <>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{WELCOME_TEXT.BRAND_SECTION.TITLE}</Text>
          <BrandSelector />
        </View>
        <View style={styles.section}>
          <LoginCard />
        </View>
        <View style={styles.section}>
          <QuickActions />
        </View>
        <View style={styles.section}>
          <PromoBanner />
        </View>
        <View style={styles.section}>
          <SearchBar />
        </View>
        {categories.length > 0 && (
          <View style={styles.section}>
            <CategoryScroll
              categories={categories}
              selectedId={selectedCategoryId}
              onCategoryPress={handleCategoryPress}
            />
          </View>
        )}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {selectedCategoryId
              ? categories.find((c) => c.id === selectedCategoryId)?.name || 'Sản phẩm'
              : 'Tất cả sản phẩm'}
          </Text>
        </View>
      </>
    ),
    [categories, selectedCategoryId, handleCategoryPress]
  );

  const ListFooter = useCallback(
    () =>
      isLoadingMore ? (
        <View style={styles.loadingMore}>
          <ActivityIndicator size="small" color={BRAND_COLORS.primary.xanhReu} />
          <Text style={styles.loadingMoreText}>Đang tải thêm...</Text>
        </View>
      ) : !hasMore && products.length > 0 ? (
        <View style={styles.endList}>
          <Text style={styles.endListText}>Đã hiển thị tất cả</Text>
        </View>
      ) : (
        <View style={{ height: 32 }} />
      ),
    [isLoadingMore, hasMore, products.length]
  );

  const ListEmpty = useCallback(
    () =>
      error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
            <Text style={styles.retryText}>Thử lại</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Không có sản phẩm</Text>
        </View>
      ),
    [error, handleRetry]
  );

  const isInitialLoading = !isLocationReady || (isLoading && products.length === 0);

  return (
    <LinearGradient
      colors={[
        BRAND_COLORS.primary.xanhReu,
        BRAND_COLORS.primary.xanhBo,
        BRAND_COLORS.primary.beSua,
        '#FFFFFF',
      ]}
      style={[styles.container, { paddingTop: insets.top }]}
    >
      <View style={styles.header}>
        <View style={styles.greeting}>
          <AppIcon name={HEADER_ICONS.GREETING} size="lg" style={styles.greetingIcon} />
          <Text style={styles.greetingText}>{WELCOME_TEXT.HEADER.GREETING}</Text>
        </View>
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.iconButton}>
            <AppIcon name={HEADER_ICONS.NOTIFICATION} size="sm" />
          </TouchableOpacity>
        </View>
      </View>

      {isInitialLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={BRAND_COLORS.primary.xanhReu} />
          <Text style={styles.loadingText}>Đang tải...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredProducts}
          renderItem={renderProduct}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.productRow}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={ListHeader}
          ListFooterComponent={ListFooter}
          ListEmptyComponent={ListEmpty}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={[BRAND_COLORS.primary.xanhReu]}
              tintColor={BRAND_COLORS.primary.xanhReu}
            />
          }
          onEndReached={selectedCategoryId ? undefined : loadMore}
          onEndReachedThreshold={LOAD_MORE_THRESHOLD}
          showsVerticalScrollIndicator={false}
        />
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  greeting: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  greetingIcon: { color: BRAND_COLORS.primary.beSua },
  greetingText: {
    fontSize: 18,
    fontFamily: 'Phudu-Bold',
    color: BRAND_COLORS.primary.beSua,
  },
  headerIcons: { flexDirection: 'row', gap: 12 },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: BRAND_COLORS.primary.beSua,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: { paddingHorizontal: 16 },
  productRow: { justifyContent: 'space-between' },
  section: { marginBottom: 24 },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Phudu-Bold',
    color: BRAND_COLORS.primary.xanhReu,
    marginBottom: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    fontFamily: 'SpaceGrotesk-Medium',
    color: BRAND_COLORS.primary.xanhReu,
  },
  loadingMore: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    gap: 8,
  },
  loadingMoreText: {
    fontSize: 14,
    fontFamily: 'SpaceGrotesk-Regular',
    color: BRAND_COLORS.text.secondary,
  },
  endList: { paddingVertical: 20, alignItems: 'center' },
  endListText: {
    fontSize: 14,
    fontFamily: 'SpaceGrotesk-Regular',
    color: BRAND_COLORS.text.secondary,
  },
  errorContainer: { padding: 40, alignItems: 'center', gap: 12 },
  errorText: {
    fontSize: 14,
    fontFamily: 'SpaceGrotesk-Regular',
    color: '#FF3B30',
    textAlign: 'center',
  },
  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: BRAND_COLORS.primary.xanhReu,
    borderRadius: 8,
  },
  retryText: {
    fontSize: 14,
    fontFamily: 'SpaceGrotesk-Bold',
    color: '#FFFFFF',
  },
  emptyContainer: { padding: 40, alignItems: 'center' },
  emptyText: {
    fontSize: 14,
    fontFamily: 'SpaceGrotesk-Regular',
    color: BRAND_COLORS.text.secondary,
  },
});