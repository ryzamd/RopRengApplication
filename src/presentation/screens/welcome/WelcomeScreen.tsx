import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MOCK_CATEGORIES, MOCK_PRODUCTS } from '../../../data/mockProducts';
import { AppIcon } from '../../components/shared/AppIcon';
import { BRAND_COLORS } from '../../theme/colors';
import { HEADER_ICONS } from '../../theme/iconConstants';
import { BrandSelector } from './components/BrandSelector';
import { CategoryScroll } from './components/CategoryScroll';
import { LoginCard } from './components/LoginCard';
import { ProductSection } from './components/ProductSection';
import { PromoBanner } from './components/PromoBanner';
import { QuickActions } from './components/QuickActions';
import { SearchBar } from './components/SearchBar';
import { WELCOME_TEXT } from './WelcomeConstants';

export default function WelcomeScreen() {
  const insets = useSafeAreaInsets();

  const groupedProducts = MOCK_CATEGORIES.map((category) => ({
    category,
    products: MOCK_PRODUCTS.filter((p) => p.categoryId === category.id),
  }));

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Sticky Header */}
      <View style={styles.header}>
        <View style={styles.greeting}>
          <AppIcon name={HEADER_ICONS.GREETING} size="lg" />
          <Text style={styles.greetingText}>{WELCOME_TEXT.HEADER.GREETING}</Text>
        </View>
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.iconButton}>
            <AppIcon name={HEADER_ICONS.VOUCHER} size="sm" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <AppIcon name={HEADER_ICONS.NOTIFICATION} size="sm" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Scrollable Content */}
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.section}>
          <LoginCard />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{WELCOME_TEXT.BRAND_SECTION.TITLE}</Text>
          <BrandSelector />
        </View>

        <View style={styles.section}>
          <QuickActions />
        </View>

        <View style={styles.section}>
          <PromoBanner />
        </View>

        <View style={styles.section}>
          <View style={styles.searchContainer}>
            <SearchBar />
          </View>
        </View>

        <View style={styles.section}>
          <CategoryScroll />
        </View>

        {/* Product Sections */}
        <View style={styles.section}>
          {groupedProducts.map(({ category, products }) => (
            <ProductSection key={category.id} category={category} products={products} />
          ))}
        </View>
      </ScrollView>
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: BRAND_COLORS.background.default,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  greeting: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  greetingText: {
    fontSize: 18,
    fontFamily: 'Phudu-Bold',
    color: BRAND_COLORS.primary.xanhReu,
  },
  headerIcons: {
    flexDirection: 'row',
    gap: 12,
  },
  iconButton: {
    width: 40,
    height: 40,
    backgroundColor: BRAND_COLORS.background.default,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Phudu-Bold',
    color: BRAND_COLORS.primary.xanhReu,
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    gap: 12,
  },
});