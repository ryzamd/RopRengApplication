import { useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import { Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Category } from '../../../../data/mockProducts';
import { AppIcon } from '../../../components/shared/AppIcon';
import { BRAND_COLORS } from '../../../theme/colors';
import { HOME_LAYOUT } from '../HomeLayout';

interface HomeCategoryScrollProps {
  categories: Category[];
}

export function HomeCategoryScroll({ categories }: HomeCategoryScrollProps) {
  const router = useRouter();

  const handleCategoryPress = (categoryId: string, categoryName: string) => {
    console.log(`[HomeCategoryScroll] Selected category: ${categoryName} (${categoryId})`);
    router.push({
      pathname: '../(tabs)/search',
      params: { categoryId },
    });
  };

  const chunkedCategories = useMemo(() => {
    const chunkSize = 2;
    const chunks = [];
    for (let i = 0; i < categories.length; i += chunkSize) {
      chunks.push(categories.slice(i, i + chunkSize));
    }
    return chunks;
  }, [categories]);

  return (
    <View style={styles.gridContainer}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        bounces={false}
        contentContainerStyle={styles.scrollContent}
        overScrollMode="never"
        decelerationRate={Platform.OS === 'ios' ? 0.8 : 'normal'}
      >
        {chunkedCategories.map((column, colIndex) => (
          <View key={`col-${colIndex}`} style={styles.columnWrapper}>
            {column.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={styles.categoryItem}
                onPress={() => handleCategoryPress(category.id, category.name)}
                activeOpacity={0.7}
              >
                <View style={styles.iconContainer}>
                  <AppIcon name={category.icon} size="md" />
                </View>
                <Text style={styles.label} numberOfLines={2}>
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  gridContainer: {
    borderWidth: 2,
    borderColor: BRAND_COLORS.primary.xanhReu,
    backgroundColor: 'transparent',
    padding: 10,
    borderRadius: 12,
    marginHorizontal: HOME_LAYOUT.SECTION_PADDING_HORIZONTAL,
    marginBottom: HOME_LAYOUT.SECTION_MARGIN_BOTTOM,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  scrollContent: {
    gap: 15,
  },
  columnWrapper: {
    gap: 15,
    justifyContent: 'space-between',
  },
  categoryItem: {
    alignItems: 'center',
    width: 70,
    justifyContent: 'flex-start',
  },
  iconContainer: {
    width: 64,
    height: 64,
    backgroundColor: BRAND_COLORS.primary.beSua,
    borderWidth: 2,
    borderColor: BRAND_COLORS.primary.xanhReu,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  label: {
    fontSize: 11,
    fontFamily: 'SpaceGrotesk-Medium',
    color: BRAND_COLORS.primary.xanhReu,
    textAlign: 'center',
    lineHeight: 14,
  },
});