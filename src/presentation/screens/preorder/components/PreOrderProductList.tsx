import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BRAND_COLORS } from '../../../theme/colors';
import { TYPOGRAPHY } from '../../../theme/typography';
import { PREORDER_TEXT } from '../PreOrderConstants';
import { PreOrderProductListProps } from '../PreOrderInterfaces';
import { PREORDER_LAYOUT } from '../PreOrderLayout';
import { PreOrderProductItem } from './PreOrderProductItem';

export function PreOrderProductList({items, onEditProduct, onRemoveProduct, onAddMore}: PreOrderProductListProps) {
  return (
    <View style={styles.wrapper}>
      <View style={styles.header}>
        <Text style={styles.title}>{PREORDER_TEXT.PRODUCT_LIST_TITLE}</Text>
        <TouchableOpacity onPress={onAddMore} activeOpacity={0.7}>
          <Text style={styles.addButton}>{PREORDER_TEXT.ADD_MORE_BUTTON}</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.productList}>
        {items.map((item, index) => (
          <View key={item.product.id}>
            <PreOrderProductItem
              item={item}
              onEdit={() => onEditProduct(item.product.id)}
              onRemove={() => onRemoveProduct(item.product.id)}
            />
            {index < items.length - 1 && <View style={styles.divider} />}
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: BRAND_COLORS.background.primary,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BRAND_COLORS.border.light,
    padding: PREORDER_LAYOUT.ORDER_TYPE_PADDING,
    gap: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontFamily: TYPOGRAPHY.fontFamily.bodyBold,
    color: BRAND_COLORS.text.primary,
  },
  addButton: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontFamily: TYPOGRAPHY.fontFamily.bodyMedium,
    color: BRAND_COLORS.secondary.camNhat,
  },
  productList: {
    gap: 0,
  },
  divider: {
    height: 1,
    backgroundColor: BRAND_COLORS.border.light,
    marginVertical: 8,
  },
});