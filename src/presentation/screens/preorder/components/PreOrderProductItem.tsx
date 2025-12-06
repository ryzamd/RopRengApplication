import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
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
  
  const iceLabel = item.customizations.ice === 'normal' ? 'Đá bình thường' :
                   item.customizations.ice === 'less' ? 'Ít đá' : 'Đá riêng';
  
  const sweetnessLabel = item.customizations.sweetness === 'normal' ? 'Đường bình thường' :
                         item.customizations.sweetness === 'less' ? 'Ít đường' : 'Nhiều đường';
  
  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        pressed && { opacity: 0.7 }
      ]}
      onPress={() => { onPress(item); console.log('PreOrderProductItem pressed'); }}
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
        <Text style={styles.productSize}>{sizeLabel} · {iceLabel} · {sweetnessLabel}</Text>
          {item.customizations.toppings.length > 0 && (
            <Text style={styles.productTopping}>
              + {item.customizations.toppings.map(t => t.name).join(', ')}
            </Text>
          )}
      </View>

      <Text style={styles.productPrice}>
        {PreOrderService.formatPrice(item.finalPrice)}
      </Text>
    </Pressable>
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
  productTopping: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontFamily: TYPOGRAPHY.fontFamily.bodyRegular,
    color: BRAND_COLORS.secondary.nauEspresso,
    marginTop: 2,
  },
});