import React, { useCallback } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MOCK_COLLECTIONS } from '../../../data/mockCollections';
import { MOCK_COMBOS } from '../../../data/mockCombos';
import { MOCK_CATEGORIES, MOCK_PRODUCTS } from '../../../data/mockProducts';
import { useAppSelector } from '../../../utils/hooks';
import { AppIcon } from '../../components/shared/AppIcon';
import { BRAND_COLORS } from '../../theme/colors';
import { HEADER_ICONS } from '../../theme/iconConstants';
import { ProductSection } from '../welcome/components/ProductSection';
import { AuthenticatedPromoBanner } from './components/AuthenticatedPromoBanner';
import { CollectionSection } from './components/CollectionSection';
import { ComboHotSale } from './components/ComboHotSale';
import { HomeBrandSelector } from './components/HomeBrandSelector';
import { HomeCategoryScroll } from './components/HomeCategoryScroll';
import { HomeQuickActions } from './components/HomeQuickActions';
import { HomeSearchBar } from './components/HomeSearchBar';
import { MiniCartButton } from '../../components/shared/MiniCartButton';
import { HOME_TEXT } from './HomeConstants';
import { ComboType } from './HomeEnums';
import { HOME_LAYOUT } from './HomeLayout';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { phoneNumber } = useAppSelector((state) => state.auth);

  const userName = phoneNumber?.replace('+84', '0') || 'User';
  const voucherCount = 17;
  const notificationCount = 2;

  const groupedProducts = MOCK_CATEGORIES.map((category) => ({
    category,
    products: MOCK_PRODUCTS.filter((p) => p.categoryId === category.id),
  }));

  const dailyCombos = MOCK_COMBOS.filter((c) => c.type === ComboType.DAILY);
  const hourlyCombos = MOCK_COMBOS.filter((c) => c.type === ComboType.HOURLY);

  const handleMiniCartPress = useCallback(() => {
    console.log('[HomeScreen] Mini cart pressed');
    // TODO: Open CartModalScreen
    Alert.alert('Giỏ hàng', 'Cart modal coming soon!');
  }, []);

  const handleProductPress = useCallback(() => {
    console.log('[HomeScreen] Product pressed, navigating to order');
    router.push('/(tabs)/order');
  }, [router]);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>

        <View style={styles.greeting}>
          <AppIcon name={HEADER_ICONS.GREETING} size="lg" />
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
        
        <HomeCategoryScroll />
        
        {dailyCombos.map((combo) => (
          <ComboHotSale key={combo.id} combo={combo} />
        ))}

        {hourlyCombos.map((combo) => (
          <ComboHotSale key={combo.id} combo={combo} />
        ))}

        <CollectionSection collections={MOCK_COLLECTIONS} />

        <View style={styles.section}>
          {groupedProducts.map(({ category, products }) => (
            <ProductSection
              key={category.id}
              category={category}
              products={products}
              onProductPress={handleProductPress}
            />
          ))}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      <MiniCartButton onPress={handleMiniCartPress} />
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: HOME_LAYOUT.HEADER_PADDING_HORIZONTAL,
    paddingVertical: HOME_LAYOUT.HEADER_PADDING_VERTICAL,
    backgroundColor: BRAND_COLORS.background.default,
    borderBottomWidth: HOME_LAYOUT.HEADER_BORDER_BOTTOM_WIDTH,
    borderBottomColor: '#F0F0F0',
  },
  greeting: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: HOME_LAYOUT.GREETING_GAP,
    flex: 1,
  },
  greetingText: {
    fontSize: HOME_LAYOUT.GREETING_TEXT_SIZE,
    fontFamily: 'Phudu-Bold',
    color: BRAND_COLORS.primary.xanhReu,
    flexShrink: 1,
  },
  headerIcons: {
    flexDirection: 'row',
    gap: 12,
  },
  voucherBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: BRAND_COLORS.background.white,
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
    color: BRAND_COLORS.primary.xanhReu,
  },
  iconButton: {
    width: HOME_LAYOUT.HEADER_ICON_SIZE,
    height: HOME_LAYOUT.HEADER_ICON_SIZE,
    backgroundColor: BRAND_COLORS.background.white,
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
    color: BRAND_COLORS.background.white,
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
    color: BRAND_COLORS.primary.xanhReu,
    marginBottom: HOME_LAYOUT.SECTION_TITLE_MARGIN_BOTTOM,
  },
});