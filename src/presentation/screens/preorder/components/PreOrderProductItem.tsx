import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BRAND_COLORS } from '../../../theme/colors';
import { TYPOGRAPHY } from '../../../theme/typography';
import { PreOrderService } from '../PreOrderService';
import { CartItem } from '../../order/OrderInterfaces';
import { AppIcon } from '@/src/presentation/components/shared/AppIcon';

interface PreOrderProductItemProps {
  item: CartItem;
  onPress: (item: CartItem) => void;
}

export function PreOrderProductItem({ item, onPress }: PreOrderProductItemProps) {
  const sizeLabel = item.customizations.size === 'medium' ? 'Vừa' :
                    item.customizations.size === 'large' ? 'Lớn' : 'Nhỏ';
  
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress(item)}
      activeOpacity={0.7}
    >
      <View>
         <AppIcon name="create-outline" size={20} color={BRAND_COLORS.secondary.nauEspresso} />
      </View>
      <View style={styles.quantityContainer}>
        <Text style={styles.quantityText}>{item.quantity}x</Text>
      </View>

      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={1}>
          {item.product.name}
        </Text>
        <Text style={styles.productSize}>{sizeLabel}</Text>
      </View>

      <Text style={styles.productPrice}>
        {PreOrderService.formatPrice(item.finalPrice)}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 64,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: BRAND_COLORS.background.primary,
    gap: 12,
  },
  quantityContainer: {
    minWidth: 32,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  quantityText: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontFamily: TYPOGRAPHY.fontFamily.bodyBold,
    color: BRAND_COLORS.text.primary,
  },
  productInfo: {
    flex: 1,
    gap: 4,
  },
  productName: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontFamily: TYPOGRAPHY.fontFamily.bodyMedium,
    color: BRAND_COLORS.text.primary,
  },
  productSize: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontFamily: TYPOGRAPHY.fontFamily.bodyRegular,
    color: BRAND_COLORS.text.tertiary,
  },
  productPrice: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontFamily: TYPOGRAPHY.fontFamily.monoBold,
    color: BRAND_COLORS.text.primary,
  },
});