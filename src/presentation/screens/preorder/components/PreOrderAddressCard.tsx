import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { selectSelectedAddress } from '../../../../state/slices/deliverySlice';
import { useAppSelector } from '../../../../utils/hooks';
import { AppIcon } from '../../../components/shared/AppIcon';
import { BRAND_COLORS } from '../../../theme/colors';
import { OrderType } from '../PreOrderEnums';

interface PreOrderAddressCardProps {
  orderType: OrderType;
  onNavigateToMap: () => void;
}

export const PreOrderAddressCard: React.FC<PreOrderAddressCardProps> = ({ orderType, onNavigateToMap }) => {
  const deliveryAddress = useAppSelector(selectSelectedAddress);

  if (orderType !== OrderType.DELIVERY) return null;

  const getShortName = (fullAddress: string): string => {
    const parts = fullAddress.split(',');
    return parts[0]?.trim() || fullAddress;
  };

  const hasAddress = !!deliveryAddress?.addressString;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Giao tới</Text>
        <TouchableOpacity onPress={onNavigateToMap} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Text style={styles.changeText}>Thay đổi</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.card}
        onPress={onNavigateToMap}
        activeOpacity={0.7}
      >
        <View style={[styles.iconContainer, hasAddress && styles.iconContainerActive]}>
          <AppIcon
            name="location"
            size={20}
            color={hasAddress ? BRAND_COLORS.primary.xanhReu : '#999999'}
          />
        </View>

        <View style={styles.contentContainer}>
          {hasAddress ? (
            <>
              <Text style={styles.addressName} numberOfLines={1}>
                {getShortName(deliveryAddress.addressString!)}
              </Text>
              <Text style={styles.addressFull} numberOfLines={1}>
                {deliveryAddress.addressString!}
              </Text>
            </>
          ) : (
            <Text style={styles.placeholder}>Chọn địa chỉ giao hàng</Text>
          )}
        </View>

        <View style={styles.arrowContainer}>
          <AppIcon name="chevron-forward" size={20} color="#CCCCCC" />
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666666',
  },
  changeText: {
    fontSize: 14,
    fontWeight: '600',
    color: BRAND_COLORS.secondary.camNhat,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 0.5,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  iconContainerActive: {
    backgroundColor: '#E8F5E9',
  },
  contentContainer: {
    flex: 1,
    marginRight: 8,
  },
  addressName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 2,
  },
  addressFull: {
    fontSize: 13,
    color: '#888888',
    lineHeight: 18,
  },
  placeholder: {
    fontSize: 15,
    color: '#999999',
    fontStyle: 'italic',
  },
  arrowContainer: {
    padding: 4,
  },
});