import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppSelector } from '../../../../utils/hooks';
import { BRAND_COLORS } from '../../../theme/colors';
import { TYPOGRAPHY } from '../../../theme/typography';
import { ORDER_TYPE_LABELS, ORDER_TYPE_SECTION_TITLES } from '../PreOrderConstants';
import { OrderTypeSelectorProps } from '../PreOrderInterfaces';
import { PREORDER_LAYOUT } from '../PreOrderLayout';
import { PreOrderService } from '../PreOrderService';

export function OrderTypeSelector({ selectedType, onPress }: OrderTypeSelectorProps) {
  const selectedStore = useAppSelector((state) => state.orderCart.selectedStore);
  
  const iconName = PreOrderService.getOrderTypeIcon(selectedType);
  const typeLabel = ORDER_TYPE_LABELS[selectedType];
  const sectionTitle = ORDER_TYPE_SECTION_TITLES[selectedType];
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{sectionTitle}</Text>
        <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
          <Text style={styles.changeButton}>Thay đổi</Text>
        </TouchableOpacity>
      </View>
      
      <TouchableOpacity
        style={styles.content}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <View style={styles.storeSection}>
          <Text style={styles.storeName}>{selectedStore?.name}</Text>
          <Text style={styles.storeAddress} numberOfLines={1}>
            {selectedStore?.address}
          </Text>
        </View>
        
        <View style={styles.divider} />
        
        <View style={styles.typeRow}>
          <Ionicons
            name={iconName as any}
            size={PREORDER_LAYOUT.ORDER_TYPE_ICON_SIZE}
            color={BRAND_COLORS.primary.xanhReu}
          />
          <View style={styles.typeInfo}>
            <Text style={styles.typeLabel}>{typeLabel}</Text>
            <Text style={styles.timeEstimate}>Càng sớm càng tốt</Text>
          </View>
          <Ionicons
            name="chevron-forward"
            size={20}
            color={BRAND_COLORS.text.tertiary}
          />
        </View>
      </TouchableOpacity>
    </View>
  );
}

// Styles remain the same
const styles = StyleSheet.create({
  container: {
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
  changeButton: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontFamily: TYPOGRAPHY.fontFamily.bodyMedium,
    color: BRAND_COLORS.secondary.camNhat,
  },
  content: {
    backgroundColor: BRAND_COLORS.background.primary,
    borderRadius: PREORDER_LAYOUT.ORDER_TYPE_BORDER_RADIUS,
    borderWidth: 1,
    borderColor: BRAND_COLORS.border.light,
    padding: PREORDER_LAYOUT.ORDER_TYPE_PADDING,
    gap: 12,
  },
  storeSection: {
    gap: 4,
  },
  storeName: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontFamily: TYPOGRAPHY.fontFamily.bodyBold,
    color: BRAND_COLORS.text.primary,
  },
  storeAddress: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontFamily: TYPOGRAPHY.fontFamily.bodyRegular,
    color: BRAND_COLORS.text.secondary,
  },
  divider: {
    height: PREORDER_LAYOUT.DIVIDER_HEIGHT,
    backgroundColor: BRAND_COLORS.border.light,
  },
  typeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  typeInfo: {
    flex: 1,
    gap: 2,
  },
  typeLabel: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontFamily: TYPOGRAPHY.fontFamily.bodyMedium,
    color: BRAND_COLORS.text.primary,
  },
  timeEstimate: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontFamily: TYPOGRAPHY.fontFamily.bodyRegular,
    color: BRAND_COLORS.text.tertiary,
  },
});