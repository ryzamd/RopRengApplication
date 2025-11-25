import React from 'react';
import { ScrollView, TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { MOCK_CATEGORIES } from '../../../../data/mockProducts';
import { AppIcon } from '../../../components/shared/AppIcon';
import { BRAND_COLORS } from '../../../theme/colors';
import { ORDER_LAYOUT } from '../OrderLayout';

export function OrderCategoryScroll() {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      {MOCK_CATEGORIES.map((category) => (
        <TouchableOpacity key={category.id} style={styles.item}>
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
    paddingHorizontal: ORDER_LAYOUT.CATEGORY_SCROLL_PADDING,
    gap: ORDER_LAYOUT.CATEGORY_SCROLL_GAP,
    paddingVertical: 12,
  },
  item: {
    alignItems: 'center',
    width: ORDER_LAYOUT.CATEGORY_ITEM_WIDTH,
  },
  iconContainer: {
    width: ORDER_LAYOUT.CATEGORY_ICON_SIZE,
    height: ORDER_LAYOUT.CATEGORY_ICON_SIZE,
    backgroundColor: BRAND_COLORS.primary.beSua,
    borderRadius: ORDER_LAYOUT.CATEGORY_ICON_SIZE / 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: ORDER_LAYOUT.CATEGORY_LABEL_SIZE,
    fontFamily: 'SpaceGrotesk-Medium',
    color: BRAND_COLORS.primary.xanhReu,
    textAlign: 'center',
  },
});