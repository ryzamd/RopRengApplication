import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SwipeableRow } from '../../../components/shared/SwipeableRow';
import { BRAND_COLORS } from '../../../theme/colors';
import { TYPOGRAPHY } from '../../../theme/typography';
import { PREORDER_TEXT } from '../PreOrderConstants';
import { PreOrderProductItemProps } from '../PreOrderInterfaces';
import { PREORDER_LAYOUT } from '../PreOrderLayout';
import { PreOrderService } from '../PreOrderService';

export function PreOrderProductItem({ item, onEdit, onRemove }: PreOrderProductItemProps) {
  const renderActions = () => (
    <>
      <TouchableOpacity
        style={[styles.actionButton, styles.editButton]}
        onPress={onEdit}
        activeOpacity={0.7}
      >
        <Ionicons name="create-outline" size={20} color={BRAND_COLORS.text.inverse} />
        <Text style={styles.actionText}>{PREORDER_TEXT.SWIPE_EDIT}</Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[styles.actionButton, styles.deleteButton]}
        onPress={onRemove}
        activeOpacity={0.7}
      >
        <Ionicons name="trash-outline" size={20} color={BRAND_COLORS.text.inverse} />
        <Text style={styles.actionText}>{PREORDER_TEXT.SWIPE_DELETE}</Text>
      </TouchableOpacity>
    </>
  );
  
  return (
    <SwipeableRow renderActions={renderActions} actionsWidth={PREORDER_LAYOUT.PRODUCT_SWIPE_ACTIONS_WIDTH}>
      <View style={styles.container}>
        <View style={styles.quantityContainer}>
          <Text style={styles.quantityText}>{item.quantity}x</Text>
        </View>
        
        <View style={styles.productInfo}>
          <Text style={styles.productName} numberOfLines={1}>
            {item.product.name}
          </Text>
          <Text style={styles.productSize}>Vừa</Text>
        </View>
        
        <Text style={styles.productPrice}>
          {PreOrderService.formatPrice(item.product.price * item.quantity)}
        </Text>
      </View>
    </SwipeableRow>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 64,
    paddingVertical: 12,
    paddingHorizontal: 0,
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
  actionButton: {
    width: PREORDER_LAYOUT.PRODUCT_SWIPE_BUTTON_WIDTH,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
  editButton: {
    backgroundColor: BRAND_COLORS.primary.xanhBo,
  },
  deleteButton: {
    backgroundColor: BRAND_COLORS.semantic.error,
  },
  actionText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontFamily: TYPOGRAPHY.fontFamily.bodyMedium,
    color: BRAND_COLORS.text.inverse,
  },
});