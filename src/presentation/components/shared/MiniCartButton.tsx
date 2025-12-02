import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppSelector } from '../../../utils/hooks';
import { BRAND_COLORS } from '../../theme/colors';

interface MiniCartButtonProps {
  onPress: () => void;
}

export function MiniCartButton({ onPress }: MiniCartButtonProps) {
  const insets = useSafeAreaInsets();
  const { totalItems, totalPrice } = useAppSelector((state) => state.orderCart);

  if (totalItems === 0) {
    return null;
  }

  return (
    <View style={[styles.container, { bottom: insets.bottom - 36}]}>
      <TouchableOpacity
        style={styles.button}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <View style={styles.content}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{totalItems}</Text>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.info}>
            <Text style={styles.label}>Giỏ hàng</Text>
            <Text style={styles.price}>{totalPrice.toLocaleString('vi-VN')}đ</Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 16,
    right: 16,
    zIndex: 1000,
  },
  button: {
    backgroundColor: BRAND_COLORS.background.white,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    gap: 16,
  },
  badge: {
    backgroundColor: BRAND_COLORS.secondary.hongSua,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    fontSize: 16,
    fontFamily: 'SpaceGrotesk-Bold',
    color: BRAND_COLORS.primary.xanhReu,
  },
  divider: {
    width: 1,
    height: 32,
    backgroundColor: BRAND_COLORS.background.default,
    opacity: 0.3,
  },
  info: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    fontFamily: 'SpaceGrotesk-Bold',
    color: BRAND_COLORS.primary.xanhReu,
  },
  price: {
    fontSize: 18,
    fontFamily: 'SpaceMono-Bold',
    color: BRAND_COLORS.primary.xanhReu,
  },
});