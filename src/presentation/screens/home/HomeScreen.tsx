import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MOCK_COLLECTIONS } from '../../../data/mockCollections';
import { MOCK_COMBOS } from '../../../data/mockCombos';
import { MOCK_CATEGORIES, MOCK_PRODUCTS, Product } from '../../../data/mockProducts';
import { useAppSelector } from '../../../utils/hooks';
import { useAddToCart } from '../../../utils/hooks/useAddToCart';
import { AppIcon } from '../../components/shared/AppIcon';
import { MiniCartButton } from '../../components/shared/MiniCartButton';
import { BRAND_COLORS } from '../../theme/colors';
import { HEADER_ICONS } from '../../theme/iconConstants';
import PreOrderBottomSheet from '../preorder/PreOrderBottomSheet';
import { ProductSection } from '../welcome/components/ProductSection';
import { AuthenticatedPromoBanner } from './components/AuthenticatedPromoBanner';
import { CollectionModal } from './components/CollectionModal';
import { CollectionSection } from './components/CollectionSection';
import { ComboHotSale } from './components/ComboHotSale';
import { HomeBrandSelector } from './components/HomeBrandSelector';
import { HomeCategoryScroll } from './components/HomeCategoryGrid';
import { HomeQuickActions } from './components/HomeQuickActions';
import { HomeSearchBar } from './components/HomeSearchBar';
import { HOME_TEXT } from './HomeConstants';
import { ComboType } from './HomeEnums';
import { Collection } from './HomeInterfaces';
import { HOME_LAYOUT } from './HomeLayout';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const handleAddToCart = useAddToCart();
  
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const totalItems = useAppSelector((state) => state.orderCart.totalItems);
  const { phoneNumber } = useAppSelector((state) => state.auth);
  const userName = phoneNumber?.replace('+84', '0') || 'User';
  const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null);
  const [showPreOrder, setShowPreOrder] = useState(false);

  const voucherCount = 17;
  const notificationCount = 2;

  const handleProductPress = useCallback((product: Product) => {
    handleAddToCart(product);
  }, [handleAddToCart]);

  const handleMiniCartPress = useCallback(() => {
    console.log('[HomeScreen] Opening PreOrder sheet');
    setShowPreOrder(true);
  }, []);

  const handlePreOrderClose = useCallback(() => {
    setShowPreOrder(false);
  }, []);

  const handleOrderSuccess = useCallback(() => {
    console.log('[HomeScreen] Order placed successfully, redirecting to Home');
    router.replace('../(tabs)/');
  }, []);

  const handleCollectionPress = useCallback((collection: Collection) => {
    setSelectedCollection(collection);
  }, []);

  const showMiniCart = isAuthenticated && totalItems > 0;

  return (
    <LinearGradient
      colors={[
        BRAND_COLORS.primary.xanhReu,
        BRAND_COLORS.primary.xanhBo,
        BRAND_COLORS.primary.beSua,
        '#FFFFFF'
      ]}
      style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <View style={styles.greeting}>
          <AppIcon name={HEADER_ICONS.GREETING} size="lg" style={styles.greetingIcon}/>
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
            {notificationCount > 0 && (
              <View style={styles.notificationBadge}>
                <Text style={styles.notificationCount}>{notificationCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
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
        
        <HomeCategoryScroll categories={MOCK_CATEGORIES} />
        
        <ComboHotSale
          type={ComboType.DAILY}
          combos={MOCK_COMBOS}
        />

        <ComboHotSale
          type={ComboType.HOURLY}
          combos={MOCK_COMBOS}
        />

        <CollectionSection
          collections={MOCK_COLLECTIONS}
          onCollectionPress={handleCollectionPress}
        />

        <View style={styles.section}>
          <ProductSection
            title={HOME_TEXT.PRODUCT_SECTION_TITLE}
            products={MOCK_PRODUCTS}
            onProductPress={handleProductPress}
          />
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {showMiniCart && (
        <MiniCartButton onPress={handleMiniCartPress} />
      )}

      {selectedCollection && (
        <CollectionModal
          collection={selectedCollection}
          onClose={() => setSelectedCollection(null)}
        />
      )}

      <PreOrderBottomSheet
        visible={showPreOrder}
        onClose={handlePreOrderClose}
        onOrderSuccess={handleOrderSuccess}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BRAND_COLORS.background.default,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: HOME_LAYOUT.HEADER_PADDING_HORIZONTAL,
    paddingVertical: HOME_LAYOUT.HEADER_PADDING_VERTICAL,
    backgroundColor: 'transparent',
  },
  greeting: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: HOME_LAYOUT.GREETING_GAP,
    flex: 1,
  },
  greetingIcon: {
    color: BRAND_COLORS.primary.beSua,
  },
  greetingText: {
    fontSize: HOME_LAYOUT.GREETING_TEXT_SIZE,
    fontFamily: 'Phudu-Bold',
    color: BRAND_COLORS.primary.beSua,
    flexShrink: 1,
  },
  headerIcons: {
    flexDirection: 'row',
    gap: 12,
  },
  voucherBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: BRAND_COLORS.primary.beSua,
    paddingHorizontal: HOME_LAYOUT.VOUCHER_BADGE_PADDING_HORIZONTAL,
    paddingVertical: HOME_LAYOUT.VOUCHER_BADGE_PADDING_VERTICAL,
    borderRadius: HOME_LAYOUT.VOUCHER_BADGE_BORDER_RADIUS,
    gap: HOME_LAYOUT.VOUCHER_BADGE_GAP,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  voucherCount: {
    fontSize: HOME_LAYOUT.VOUCHER_BADGE_FONT_SIZE,
    fontFamily: 'Phudu-Bold',
    color: BRAND_COLORS.text.primary,
  },
  iconButton: {
    width: HOME_LAYOUT.HEADER_ICON_SIZE,
    height: HOME_LAYOUT.HEADER_ICON_SIZE,
    backgroundColor: BRAND_COLORS.primary.beSua,
    borderRadius: HOME_LAYOUT.HEADER_ICON_BORDER_RADIUS,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  notificationBadge: {
    position: 'absolute',
    top: HOME_LAYOUT.NOTIFICATION_BADGE_TOP,
    right: HOME_LAYOUT.NOTIFICATION_BADGE_RIGHT,
    backgroundColor: '#FF0000',
    width: HOME_LAYOUT.NOTIFICATION_BADGE_SIZE,
    height: HOME_LAYOUT.NOTIFICATION_BADGE_SIZE,
    borderRadius: HOME_LAYOUT.NOTIFICATION_BADGE_SIZE / 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationCount: {
    fontSize: HOME_LAYOUT.NOTIFICATION_BADGE_FONT_SIZE,
    fontFamily: 'Phudu-Bold',
    color: BRAND_COLORS.background.default,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  section: {
    paddingHorizontal: HOME_LAYOUT.SECTION_PADDING_HORIZONTAL,
    marginBottom: HOME_LAYOUT.SECTION_MARGIN_BOTTOM,
  },
  sectionTitle: {
    fontSize: HOME_LAYOUT.SECTION_TITLE_SIZE,
    fontFamily: 'Phudu-Bold',
    color: BRAND_COLORS.primary.beSua,
    marginBottom: HOME_LAYOUT.SECTION_TITLE_MARGIN_BOTTOM,
  },
});