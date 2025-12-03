import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BRAND_COLORS } from '../../../theme/colors';
import { TYPOGRAPHY } from '../../../theme/typography';
import { ORDER_TYPE_LABELS, PREORDER_TEXT } from '../PreOrderConstants';
import { PreOrderFooterProps } from '../PreOrderInterfaces';
import { PREORDER_LAYOUT } from '../PreOrderLayout';
import { PreOrderService } from '../PreOrderService';

export function PreOrderFooter({orderType, totalItems, totalPrice, onPlaceOrder}: PreOrderFooterProps) {
  const insets = useSafeAreaInsets();
  const orderTypeLabel = ORDER_TYPE_LABELS[orderType];
  
  return (
    <View
      style={[
        styles.container,
        { paddingBottom: Math.max(insets.bottom, 16)},
      ]}
    >
      <View style={styles.info}>
        <Text style={styles.infoText}>
          {orderTypeLabel} : {totalItems} sản phẩm
        </Text>
        <Text style={styles.totalPrice}>
          {PreOrderService.formatPrice(totalPrice)}
        </Text>
      </View>
      
      <TouchableOpacity
        style={styles.button}
        onPress={onPlaceOrder}
        activeOpacity={0.8}
      >
        <Text style={styles.buttonText}>{PREORDER_TEXT.PLACE_ORDER_BUTTON}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: BRAND_COLORS.secondary.vangNhat,
    paddingTop: 16,
    paddingHorizontal: PREORDER_LAYOUT.FOOTER_PADDING,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: BRAND_COLORS.shadow.heavy,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 16,
  },
  info: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoText: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontFamily: TYPOGRAPHY.fontFamily.bodyMedium,
    color: BRAND_COLORS.text.primary,
  },
  totalPrice: {
    fontSize: TYPOGRAPHY.fontSize.xl,
    fontFamily: TYPOGRAPHY.fontFamily.monoBold,
    color: BRAND_COLORS.text.primary,
  },
  button: {
    height: 56,
    backgroundColor: BRAND_COLORS.primary.xanhReu,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: BRAND_COLORS.shadow.heavy,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  buttonText: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontFamily: TYPOGRAPHY.fontFamily.bodyBold,
    color: BRAND_COLORS.text.inverse,
    letterSpacing: 1,
  },
});