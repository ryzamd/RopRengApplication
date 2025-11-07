import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BRAND_COLORS } from '../../../theme/colors';
import { Product, Category } from '../../../../data/mockProducts';
import { ProductCard } from './ProductCard';

interface ProductSectionProps {
  category: Category;
  products: Product[];
}

export function ProductSection({ category, products }: ProductSectionProps) {
  if (products.length === 0) return null;

  return (
    <View style={styles.section}>
      <Text style={styles.title}>{category.name}</Text>
      <View style={styles.grid}>
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
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