import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PreOrderTotalPriceProps } from '../PreOrderInterfaces';
import { PREORDER_TEXT } from '../PreOrderConstants';
import { PREORDER_LAYOUT } from '../PreOrderLayout';
import { PreOrderService } from '../PreOrderService';
import { BRAND_COLORS } from '../../../theme/colors';
import { TYPOGRAPHY } from '../../../theme/typography';

export function PreOrderTotalPrice({
  subtotal,
  shippingFee,
  onPromotionPress,
  isCalculatingShipping = false,
}: PreOrderTotalPriceProps) {
  const totalPrice = PreOrderService.calculateTotalPrice(subtotal, shippingFee);
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{PREORDER_TEXT.TOTAL_SECTION_TITLE}</Text>
      
      <View style={styles.content}>
        <View style={styles.row}>
          <Text style={styles.label}>{PREORDER_TEXT.SUBTOTAL_LABEL}</Text>
          <Text style={styles.value}>{PreOrderService.formatCurrency(subtotal)}</Text>
        </View>
        
        <View style={styles.row}>
          <Text style={styles.label}>{PREORDER_TEXT.SHIPPING_FEE_LABEL}</Text>
          {isCalculatingShipping ? (
            <ActivityIndicator size="small" color={BRAND_COLORS.primary.xanhReu} />
          ) : (
            <Text style={styles.value}>
              {shippingFee === 0 ? PREORDER_TEXT.FREE : PreOrderService.formatCurrency(shippingFee)}
            </Text>
          )}
        </View>
        
        <TouchableOpacity
          style={styles.promotionRow}
          onPress={onPromotionPress}
          activeOpacity={0.7}
        >
          <Text style={styles.promotionLabel}>{PREORDER_TEXT.PROMOTION_LABEL}</Text>
          <Ionicons name="chevron-forward" size={20} color={BRAND_COLORS.text.tertiary} />
        </TouchableOpacity>
        
        <View style={styles.divider} />
        
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>{PREORDER_TEXT.FINAL_TOTAL_LABEL}</Text>
          <Text style={styles.totalValue}>{PreOrderService.formatCurrency(totalPrice)}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  title: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontFamily: TYPOGRAPHY.fontFamily.bodyBold,
    color: BRAND_COLORS.text.primary,
  },
  content: {
    gap: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontFamily: TYPOGRAPHY.fontFamily.bodyRegular,
    color: BRAND_COLORS.text.secondary,
  },
  value: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontFamily: TYPOGRAPHY.fontFamily.monoBold,
    color: BRAND_COLORS.text.primary,
  },
  promotionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  promotionLabel: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontFamily: TYPOGRAPHY.fontFamily.bodyRegular,
    color: BRAND_COLORS.primary.xanhReu,
  },
  divider: {
    height: 1,
    backgroundColor: BRAND_COLORS.border.light,
    marginVertical: 4,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
  },
  totalLabel: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontFamily: TYPOGRAPHY.fontFamily.bodyBold,
    color: BRAND_COLORS.text.primary,
  },
  totalValue: {
    fontSize: PREORDER_LAYOUT.TOTAL_FINAL_VALUE_FONT_SIZE,
    fontFamily: TYPOGRAPHY.fontFamily.monoBold,
    color: BRAND_COLORS.primary.xanhReu,
  },
});