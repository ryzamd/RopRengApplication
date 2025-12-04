import { AppIcon } from '@/src/presentation/components/shared/AppIcon';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Product } from '../../../../data/mockProducts';
import { BRAND_COLORS } from '../../../theme/colors';

interface ProductCardProps {
  product: Product;
  onPress?: (product: Product) => void;
}

export function ProductCard({ product, onPress }: ProductCardProps) {
  const handleAddPress = () => {
    if (onPress) {
      onPress(product);
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: product.imageUrl }} style={styles.image} />
        {product.badge && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{product.badge}</Text>
          </View>
        )}
        {product.discount && (
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>{product.discount}</Text>
          </View>
        )}
      </View>
      
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={2}>{product.name}</Text>
        <View style={styles.priceRow}>
          <View>
            <Text style={styles.price}>{product.price.toLocaleString('vi-VN')}đ</Text>
            {product.originalPrice && (
              <Text style={styles.originalPrice}>
                {product.originalPrice.toLocaleString('vi-VN')}đ
              </Text>
            )}
          </View>
          <TouchableOpacity style={styles.addButton} onPress={handleAddPress}>
            <AppIcon name="add" size={'xs'} style={styles.addIcon} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '48%',
    backgroundColor: BRAND_COLORS.background.default,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    aspectRatio: 1,
    backgroundColor: BRAND_COLORS.primary.beSua,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  image: {
    width: '100%',
    height: '100%',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  badge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: BRAND_COLORS.secondary.hongSua,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  badgeText: {
    fontSize: 11,
    fontFamily: 'Phudu-Bold',
    color: BRAND_COLORS.background.default,
  },
  discountBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: BRAND_COLORS.secondary.nauEspresso,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  discountText: {
    fontSize: 11,
    fontFamily: 'Phudu-Bold',
    color: BRAND_COLORS.background.default,
  },
  info: {
    padding: 12,
  },
  name: {
    fontSize: 14,
    fontFamily: 'SpaceGrotesk-Medium',
    color: BRAND_COLORS.primary.xanhReu,
    marginBottom: 8,
    minHeight: 40,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  price: {
    fontSize: 16,
    fontFamily: 'Phudu-Bold',
    color: BRAND_COLORS.primary.xanhReu,
  },
  originalPrice: {
    fontSize: 12,
    fontFamily: 'SpaceGrotesk-Medium',
    color: '#999999',
    textDecorationLine: 'line-through',
    marginTop: 2,
  },
  addButton: {
    width: 32,
    height: 32,
    backgroundColor: BRAND_COLORS.secondary.nauEspresso,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addIcon: {
    color: BRAND_COLORS.background.default,
  },
});