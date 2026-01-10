import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View, ListRenderItem } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppSelector } from '../../../utils/hooks';
import { AppIcon } from '../../components/shared/AppIcon';
import { MiniCartButton } from '../../components/shared/MiniCartButton';
import { ProductCard, } from '../welcome/components/ProductCard';
import PreOrderBottomSheet from '../preorder/PreOrderBottomSheet';
import { AuthenticatedPromoBanner } from './components/AuthenticatedPromoBanner';
import { HomeBrandSelector } from './components/HomeBrandSelector';
import { HomeCategoryScroll } from './components/HomeCategoryGrid';
import { HomeQuickActions } from './components/HomeQuickActions';
import { HomeSearchBar } from './components/HomeSearchBar';
import { BRAND_COLORS } from '../../theme/colors';
import { HEADER_ICONS } from '../../theme/iconConstants';
import { HOME_TEXT } from './HomeConstants';
import { HOME_LAYOUT } from './HomeLayout';
import { useHomeData } from '@/src/utils/hooks/useHomeData';
import { Product } from '@/src/domain/entities/Product';

const DEFAULT_LOCATION = { lat: 10.9674038, lng: 107.207539 };
const PAGE_LIMIT = 10;
const LOAD_MORE_THRESHOLD = 0.5;

// Category icons (client-side mapping)
const CATEGORY_ICONS: Record<string, string> = {
  '1': 'cafe',
  '2': 'leaf-outline',
  '3': 'snow-outline',
};

export default function HomeScreen() {
  const insets = useSafeAreaInsets();

  const {
    products,
    vouchers,
    isLoading,
    isLoadingMore,
    hasMore,
    error,
    refresh,
    loadMore,
    clearError,
  } = useHomeData({
    lat: DEFAULT_LOCATION.lat,
    lng: DEFAULT_LOCATION.lng,
    limit: PAGE_LIMIT,
  });

  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const totalItems = useAppSelector((state) => state.orderCart.totalItems);
  const { phoneNumber } = useAppSelector((state) => state.auth);
  const userName = phoneNumber?.replace('+84', '0') || 'User';
  const [showPreOrder, setShowPreOrder] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  }, [refresh]);

  const handleProductPress = useCallback((product: Product) => {
    console.log('[HomeScreen] Product pressed:', product.id);
  }, []);

  const handleRetry = useCallback(() => {
    clearError();
    refresh();
  }, [clearError, refresh]);

  // Build categories from products
  const categories = React.useMemo(() => {
    const map = new Map<string, { id: string; name: string; icon: string }>();
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

  const voucherCount = vouchers.length;
  const showMiniCart = isAuthenticated && totalItems > 0;

  const renderProduct: ListRenderItem<typeof products[0]> = useCallback(
    ({ item }) => <ProductCard product={item} onPress={handleProductPress} />,
    [handleProductPress]
  );

  const ListHeader = useCallback(
    () => (
      <>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Lựa chọn thương hiệu</Text>
          <HomeBrandSelector />
        </View>
        <View style={styles.section}>
          <HomeQuickActions />
        </View>
        <View style={styles.section}>
          <AuthenticatedPromoBanner />
        </View>
        <View style={styles.section}>
          <HomeSearchBar />
        </View>
        {categories.length > 0 && (
          <HomeCategoryScroll categories={categories as any} />
        )}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{HOME_TEXT.PRODUCT_SECTION_TITLE}</Text>
        </View>
      </>
    ),
    [categories]
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
          <Text style={styles.endListText}>Đã hiển thị tất cả sản phẩm</Text>
        </View>
      ) : (
        <View style={{ height: 100 }} />
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
          <Text style={styles.greetingText} numberOfLines={1}>
            {userName}
            {HOME_TEXT.HEADER.GREETING_SUFFIX}
          </Text>
        </View>
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.voucherBadge}>
            <AppIcon name={HEADER_ICONS.VOUCHER} size="sm" />
            <Text style={styles.voucherCount}>{voucherCount}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <AppIcon name={HEADER_ICONS.NOTIFICATION} size="sm" />
          </TouchableOpacity>
        </View>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={BRAND_COLORS.primary.xanhReu} />
          <Text style={styles.loadingText}>Đang tải menu...</Text>
        </View>
      ) : (
        <FlatList
          data={products}
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
          onEndReached={loadMore}
          onEndReachedThreshold={LOAD_MORE_THRESHOLD}
          showsVerticalScrollIndicator={false}
        />
      )}

      {showMiniCart && <MiniCartButton onPress={() => setShowPreOrder(true)} />}

      <PreOrderBottomSheet
        visible={showPreOrder}
        onClose={() => setShowPreOrder(false)}
        onOrderSuccess={() => router.replace('../(tabs)/')}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: HOME_LAYOUT.HEADER_PADDING_HORIZONTAL,
    paddingVertical: HOME_LAYOUT.HEADER_PADDING_VERTICAL,
  },
  greeting: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: HOME_LAYOUT.GREETING_GAP,
    flex: 1,
  },
  greetingIcon: { color: BRAND_COLORS.primary.beSua },
  greetingText: {
    fontSize: HOME_LAYOUT.GREETING_TEXT_SIZE,
    fontFamily: 'SpaceGrotesk-Medium',
    color: BRAND_COLORS.primary.beSua,
  },
  headerIcons: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  voucherBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: BRAND_COLORS.primary.beSua,
    paddingHorizontal: HOME_LAYOUT.VOUCHER_BADGE_PADDING_HORIZONTAL,
    paddingVertical: HOME_LAYOUT.VOUCHER_BADGE_PADDING_VERTICAL,
    borderRadius: HOME_LAYOUT.VOUCHER_BADGE_BORDER_RADIUS,
    gap: HOME_LAYOUT.VOUCHER_BADGE_GAP,
  },
  voucherCount: {
    fontSize: HOME_LAYOUT.VOUCHER_BADGE_FONT_SIZE,
    fontFamily: 'SpaceGrotesk-Bold',
    color: BRAND_COLORS.primary.xanhReu,
  },
  iconButton: {
    width: HOME_LAYOUT.HEADER_ICON_SIZE,
    height: HOME_LAYOUT.HEADER_ICON_SIZE,
    borderRadius: HOME_LAYOUT.HEADER_ICON_BORDER_RADIUS,
    backgroundColor: BRAND_COLORS.primary.beSua,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: { paddingHorizontal: 16 },
  productRow: { justifyContent: 'space-between' },
  section: { marginBottom: HOME_LAYOUT.SECTION_MARGIN_BOTTOM },
  sectionTitle: {
    fontSize: HOME_LAYOUT.SECTION_TITLE_SIZE,
    fontFamily: 'Phudu-Bold',
    color: BRAND_COLORS.primary.xanhReu,
    marginBottom: HOME_LAYOUT.SECTION_TITLE_MARGIN_BOTTOM,
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
  endList: {
    paddingVertical: 20,
    alignItems: 'center',
  },
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