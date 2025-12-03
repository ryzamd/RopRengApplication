import { Ionicons } from '@expo/vector-icons';
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import { BottomSheetDefaultBackdropProps } from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types';
import React, { forwardRef, useCallback, useMemo } from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BRAND_COLORS } from '../../../theme/colors';
import { TYPOGRAPHY } from '../../../theme/typography';
import { ORDER_TYPE_LABELS, PREORDER_TEXT } from '../PreOrderConstants';
import { OrderType } from '../PreOrderEnums';
import { PREORDER_LAYOUT } from '../PreOrderLayout';
import { PreOrderService } from '../PreOrderService';

interface OrderTypeModalProps {
  selectedType: OrderType;
  onSelectType: (type: OrderType) => void;
}

const WINDOW_HEIGHT = Dimensions.get('window').height;

export const OrderTypeModal = forwardRef<BottomSheetModal, OrderTypeModalProps>(
  ({ selectedType, onSelectType }, ref) => {
    const snapPoints = useMemo(() => [WINDOW_HEIGHT * 0.6], []);
    const orderTypes = useMemo(() => [OrderType.DELIVERY, OrderType.TAKEAWAY, OrderType.DINE_IN], []);
    
    const renderBackdrop = useCallback(
      (props: BottomSheetDefaultBackdropProps) => (
        <BottomSheetBackdrop
          {...props}
          appearsOnIndex={0}
          disappearsOnIndex={-1}
          opacity={0.5}
          pressBehavior="close"
        />
      ),
      []
    );
    
    const handleClose = useCallback(() => {
      if (typeof ref === 'object' && ref?.current) {
        ref.current.dismiss();
      }
    }, [ref]);
    
    return (
      <BottomSheetModal
        ref={ref}
        snapPoints={snapPoints}
        backdropComponent={renderBackdrop}
        enablePanDownToClose={true}
        handleIndicatorStyle={styles.indicator}
        backgroundStyle={styles.background}
        stackBehavior="push"
      >
        <BottomSheetView style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>{PREORDER_TEXT.ORDER_TYPE_MODAL_TITLE}</Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <Text style={styles.closeText}>{PREORDER_TEXT.CLOSE_BUTTON}</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.optionsList}>
            {orderTypes.map((type) => {
              const isSelected = type === selectedType;
              const iconName = PreOrderService.getOrderTypeIcon(type);
              
              return (
                <TouchableOpacity
                  key={type}
                  style={[styles.option, isSelected && styles.optionSelected]}
                  onPress={() => onSelectType(type)}
                  activeOpacity={0.7}
                >
                  <View style={styles.optionContent}>
                    <Ionicons
                      name={iconName as any}
                      size={PREORDER_LAYOUT.ORDER_TYPE_ICON_SIZE}
                      color={isSelected ? BRAND_COLORS.primary.xanhReu : BRAND_COLORS.text.secondary}
                    />
                    <Text style={[styles.optionLabel, isSelected && styles.optionLabelSelected]}>
                      {ORDER_TYPE_LABELS[type]}
                    </Text>
                  </View>
                  {isSelected && (
                    <Ionicons name="checkmark-circle" size={24} color={BRAND_COLORS.primary.xanhReu} />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </BottomSheetView>
      </BottomSheetModal>
    );
  }
);

OrderTypeModal.displayName = 'OrderTypeModal';

const styles = StyleSheet.create({
  background: {
    backgroundColor: BRAND_COLORS.background.default,
    borderTopLeftRadius: PREORDER_LAYOUT.MODAL_BORDER_RADIUS,
    borderTopRightRadius: PREORDER_LAYOUT.MODAL_BORDER_RADIUS,
  },
  indicator: {
    backgroundColor: BRAND_COLORS.border.medium,
    width: 40,
    height: 4,
  },
  container: {
    flex: 1,
    backgroundColor: BRAND_COLORS.background.default,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: PREORDER_LAYOUT.MODAL_HEADER_HEIGHT,
    borderBottomWidth: 1,
    borderBottomColor: BRAND_COLORS.border.light,
    paddingHorizontal: PREORDER_LAYOUT.HEADER_PADDING_HORIZONTAL,
  },
  title: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontFamily: TYPOGRAPHY.fontFamily.bodyBold,
    color: BRAND_COLORS.text.primary,
  },
  closeButton: {
    position: 'absolute',
    right: PREORDER_LAYOUT.HEADER_PADDING_HORIZONTAL,
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeText: {
    fontSize: 24,
    fontFamily: TYPOGRAPHY.fontFamily.bodyRegular,
    color: BRAND_COLORS.text.secondary,
  },
  optionsList: {
    padding: PREORDER_LAYOUT.SECTION_PADDING_HORIZONTAL,
    gap: 12,
    marginTop: 12,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: PREORDER_LAYOUT.MODAL_OPTION_HEIGHT,
    padding: PREORDER_LAYOUT.MODAL_OPTION_PADDING,
    backgroundColor: BRAND_COLORS.background.primary,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: BRAND_COLORS.border.light,
  },
  optionSelected: {
    borderColor: BRAND_COLORS.primary.xanhReu,
    backgroundColor: `${BRAND_COLORS.primary.beSua}40`,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  optionLabel: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontFamily: TYPOGRAPHY.fontFamily.bodyMedium,
    color: BRAND_COLORS.text.primary,
  },
  optionLabelSelected: {
    fontFamily: TYPOGRAPHY.fontFamily.bodyBold,
    color: BRAND_COLORS.primary.xanhReu,
  },
});