import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Category, Product } from '../../../../data/mockProducts';
import { BRAND_COLORS } from '../../../theme/colors';
import { ProductCard } from './ProductCard';

interface ProductSectionProps {
  category?: Category;
  title?: string;
  products: Product[];
  onProductPress?: (product: Product) => void;
}

export function ProductSection({ category, title, products, onProductPress }: ProductSectionProps) {
  if (products.length === 0) return null;

  const displayTitle = title || category?.name || '';

  return (
    <View style={styles.section}>
      <Text style={styles.title}>{displayTitle}</Text>
      <View style={styles.grid}>
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onPress={onProductPress}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontFamily: 'Phudu-Bold',
    color: BRAND_COLORS.primary.xanhReu,
    marginBottom: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
});