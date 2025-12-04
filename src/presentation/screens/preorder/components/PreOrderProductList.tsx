import React, { useRef } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAppSelector } from '../../../../utils/hooks';
import { BRAND_COLORS } from '../../../theme/colors';
import { TYPOGRAPHY } from '../../../theme/typography';
import { PreOrderProductItem } from './PreOrderProductItem';
import { PreOrderProductItemEditBottomSheet, PreOrderProductItemEditRef } from './PreOrderProductItemEditBottomSheet';
import { CartItem } from '../../order/OrderInterfaces';
import { PREORDER_TEXT } from '../PreOrderConstants';

interface PreOrderProductListProps {
  handleAddMore: () => void;
}
export function PreOrderProductList({ handleAddMore }: PreOrderProductListProps) {
  const cartItems = useAppSelector((state) => state.orderCart.items);
  const editModalRef = useRef<PreOrderProductItemEditRef>(null);
  
  
  const handleItemPress = (item: CartItem) => {
    editModalRef.current?.present(item);
  };

  if (cartItems.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Chưa có sản phẩm nào</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{PREORDER_TEXT.PRODUCT_LIST_TITLE}</Text>
        <TouchableOpacity onPress={handleAddMore} activeOpacity={0.7}>
          <Text style={styles.addButton}>{PREORDER_TEXT.ADD_MORE_BUTTON}</Text>
        </TouchableOpacity>
      </View>
     
      {cartItems.map((item) => (
        <PreOrderProductItem key={item.id} item={item} onPress={handleItemPress} />
      ))}

      <PreOrderProductItemEditBottomSheet ref={editModalRef} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    backgroundColor: BRAND_COLORS.background.primary,
    borderColor: BRAND_COLORS.border.light,
    borderWidth: 1,
    paddingVertical: 8,
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontFamily: TYPOGRAPHY.fontFamily.bodyBold,
    color: BRAND_COLORS.text.primary,
  },
  addButton: {
   fontSize: TYPOGRAPHY.fontSize.base,
    fontFamily: TYPOGRAPHY.fontFamily.bodyMedium,
    color: BRAND_COLORS.secondary.camNhat,
  },
  emptyContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontFamily: TYPOGRAPHY.fontFamily.bodyRegular,
    color: BRAND_COLORS.text.tertiary,
  },
});