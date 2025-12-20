import React, { useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useAppSelector } from '../../../../utils/hooks';
import { DeliveryAddressCard } from '../../../components/map/DeliveryAddressCard';
import { AppIcon } from '../../../components/shared/AppIcon';
import { BRAND_COLORS } from '../../../theme/colors';
import { selectDeliveryAddress, selectIsShippingOrder } from '../../../../state/selectors/preorder.selectors';
import { PREORDER_LAYOUT } from '../PreOrderLayout';
import { PREORDER_TEXT } from '../PreOrderConstants';

interface DeliveryAddressContainerProps {
  onEditAddress: () => void;
  onSearchAddress: () => void;
}

/**
 * DeliveryAddressContainer Component
 * 
 * Animated container that shows/hides based on orderType
 * - Always in DOM (for smooth animation)
 * - Height animates from 0 to auto
 * - Opacity fades in/out
 */
export function DeliveryAddressContainer({
  onEditAddress,
  onSearchAddress,
}: DeliveryAddressContainerProps) {
  const isShipping = useAppSelector(selectIsShippingOrder);
  const deliveryAddress = useAppSelector(selectDeliveryAddress);

  // Animation values
  const containerHeight = useSharedValue(0);
  const containerOpacity = useSharedValue(0);

  useEffect(() => {
    if (isShipping) {
      // Expand and fade in
      containerHeight.value = withTiming(1, { duration: 300 });
      containerOpacity.value = withTiming(1, { duration: 300 });
    } else {
      // Collapse and fade out
      containerHeight.value = withTiming(0, { duration: 300 });
      containerOpacity.value = withTiming(0, { duration: 300 });
    }
  }, [isShipping, containerHeight, containerOpacity]);

  const animatedContainerStyle = useAnimatedStyle(() => ({
    height: containerHeight.value === 0 ? 0 : 'auto',
    opacity: containerOpacity.value,
    overflow: 'hidden',
  }));

  return (
    <Animated.View style={[styles.container, animatedContainerStyle]}>
      <View style={styles.header}>
        <AppIcon name="location" size={20} color={BRAND_COLORS.primary.xanhReu} />
        <Text style={styles.title}>{PREORDER_TEXT.DELIVERY_ADDRESS_TITLE}</Text>
      </View>

      {deliveryAddress ? (
        <DeliveryAddressCard
          address={deliveryAddress}
          onEdit={onEditAddress}
          showEditButton={true}
        />
      ) : (
        <TouchableOpacity
          style={styles.addButton}
          onPress={onSearchAddress}
          activeOpacity={0.7}
        >
          <AppIcon name="add-circle-outline" size={24} color={BRAND_COLORS.primary.xanhReu} />
          <Text style={styles.addButtonText}>{PREORDER_TEXT.ADD_DELIVERY_ADDRESS}</Text>
        </TouchableOpacity>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: BRAND_COLORS.background.default,
    borderRadius: 12,
    padding: PREORDER_LAYOUT.SECTION_PADDING_HORIZONTAL,
    gap: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 16,
    fontFamily: 'Phudu-Bold',
    color: BRAND_COLORS.primary.xanhReu,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: BRAND_COLORS.primary.beSua,
    borderRadius: 12,
    paddingVertical: 16,
    borderWidth: 2,
    borderColor: BRAND_COLORS.primary.xanhReu,
    borderStyle: 'dashed',
  },
  addButtonText: {
    fontSize: 14,
    fontFamily: 'SpaceGrotesk-Medium',
    color: BRAND_COLORS.primary.xanhReu,
  },
});