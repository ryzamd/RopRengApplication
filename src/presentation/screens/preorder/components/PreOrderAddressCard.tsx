import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../state/store';
import { OrderType } from '../PreOrderEnums';

interface PreOrderAddressCardProps {
  orderType: OrderType;
}

export const PreOrderAddressCard: React.FC<PreOrderAddressCardProps> = ({ orderType }) => {
  const router = useRouter();
  const deliveryAddress = useSelector((state: RootState) => state.delivery.selectedAddress);

  const handlePress = () => {
    router.push('/address-management');
  };

  if (orderType !== OrderType.DELIVERY) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Giao tới</Text>
        <TouchableOpacity onPress={handlePress}>
          <Text style={styles.actionText}>Thay đổi</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.card}
        onPress={handlePress}
        activeOpacity={0.7}
      >
        <View style={styles.iconBox}>
           <Text style={{fontSize: 20}}>📍</Text>
        </View>

        <View style={styles.contentBox}>
          {deliveryAddress ? (
            <>
              <Text style={styles.addressTitle} numberOfLines={1}>
                {deliveryAddress.addressString.split(',')[0]}
              </Text>
              <Text style={styles.addressSub} numberOfLines={1}>
                {deliveryAddress.addressString}
              </Text>
            </>
          ) : (
            <Text style={styles.placeholder}>Chọn địa chỉ giao hàng</Text>
          )}
        </View>
        
        <Text style={styles.arrow}>{'>'}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  title: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  actionText: {
    color: '#FF6600',
    fontWeight: '600',
    fontSize: 14,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFF5EB',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  contentBox: {
    flex: 1,
  },
  addressTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginBottom: 2,
  },
  addressSub: {
    fontSize: 13,
    color: '#888',
  },
  placeholder: {
    fontSize: 15,
    color: '#999',
    fontStyle: 'italic',
  },
  arrow: {
    fontSize: 18,
    color: '#CCC',
    marginLeft: 8,
  },
});