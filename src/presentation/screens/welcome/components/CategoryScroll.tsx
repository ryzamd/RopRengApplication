import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MOCK_CATEGORIES } from '../../../../data/mockProducts';
import { AppIcon } from '../../../components/shared/AppIcon';
import { BRAND_COLORS } from '../../../theme/colors';

export function CategoryScroll() {
  const router = useRouter();

  const handleCategoryPress = (categoryId: string) => {
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
          onPress={() => handleCategoryPress(category.id)}
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
    paddingRight: 16,
    gap: 16,
  },
  categoryItem: {
    alignItems: 'center',
    width: 80,
  },
  iconContainer: {
    width: 60,
    height: 60,
    backgroundColor: BRAND_COLORS.primary.beSua,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  label: {
    fontSize: 11,
    fontFamily: 'SpaceGrotesk-Medium',
    color: BRAND_COLORS.primary.xanhReu,
    textAlign: 'center',
  },
});