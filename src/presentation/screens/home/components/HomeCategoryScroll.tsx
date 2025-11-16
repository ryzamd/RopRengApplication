import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MOCK_CATEGORIES } from '../../../../data/mockProducts';
import { AppIcon } from '../../../components/shared/AppIcon';
import { BRAND_COLORS } from '../../../theme/colors';
import { HOME_LAYOUT } from '../HomeLayout';

export function HomeCategoryScroll() {
  const router = useRouter();

  const handleCategoryPress = (categoryId: string, categoryName: string) => {
    console.log(`[HomeCategoryScroll] Selected category: ${categoryName} (${categoryId})`);
    router.push({
      pathname: '../(tabs)/search',
      params: { categoryId },
    });
  };

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      {MOCK_CATEGORIES.map((category) => (
        <TouchableOpacity
          key={category.id}
          style={styles.categoryItem}
          onPress={() => handleCategoryPress(category.id, category.name)}
        >
          <View style={styles.iconContainer}>
            <AppIcon name={category.icon} size="lg" />
          </View>
          <Text style={styles.label} numberOfLines={2}>
            {category.name}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: HOME_LAYOUT.SECTION_PADDING_HORIZONTAL,
    gap: HOME_LAYOUT.HOME_CATEGORY_SCROLL_GAP,
  },
  categoryItem: {
    alignItems: 'center',
    width: HOME_LAYOUT.HOME_CATEGORY_ITEM_WIDTH,
  },
  iconContainer: {
    width: HOME_LAYOUT.HOME_CATEGORY_ICON_SIZE,
    height: HOME_LAYOUT.HOME_CATEGORY_ICON_SIZE,
    backgroundColor: BRAND_COLORS.primary.beSua,
    borderRadius: HOME_LAYOUT.HOME_CATEGORY_ICON_BORDER_RADIUS,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: HOME_LAYOUT.HOME_CATEGORY_ICON_MARGIN_BOTTOM,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  label: {
    fontSize: HOME_LAYOUT.HOME_CATEGORY_LABEL_SIZE,
    fontFamily: 'SpaceGrotesk-Medium',
    color: BRAND_COLORS.primary.xanhReu,
    textAlign: 'center',
  },
});