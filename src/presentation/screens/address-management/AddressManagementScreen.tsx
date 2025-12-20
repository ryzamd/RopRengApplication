import { router } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DeliveryAddress } from '../../../domain/entities/DeliveryAddress';
import { LocationRepositorySQLite } from '../../../infrastructure/repositories/LocationRepositorySQLite';
import { useDb } from '../../../infrastructure/db/sqlite/provider';
import { AddressSearchModal } from '../../components/map/AddressSearchModal';
import { MapPicker } from '../../components/map/MapPicker';
import { AppIcon } from '../../components/shared/AppIcon';
import { BRAND_COLORS } from '../../theme/colors';
import { ADDRESS_MANAGEMENT_TEXT } from './AddressManagementConstants';
import { AddressManagementService } from './AddressManagementService';
import { AddressItem } from './components/AddressItem';
import { AddressLabelModal } from './components/AddressLabelModal';
import { ADDRESS_MANAGEMENT_LAYOUT } from './AddressManagementLayout';

export default function AddressManagementScreen() {
  const db = useDb();
  const repository = useMemo(() => new LocationRepositorySQLite(db), [db]);

  const [addresses, setAddresses] = useState<DeliveryAddress[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal states
  const [showAddressSearch, setShowAddressSearch] = useState(false);
  const [showMapPicker, setShowMapPicker] = useState(false);
  const [showLabelModal, setShowLabelModal] = useState(false);
  const [pendingAddress, setPendingAddress] = useState<DeliveryAddress | null>(null);
  const [editingAddress, setEditingAddress] = useState<DeliveryAddress | null>(null);

  const loadAddresses = useCallback(async () => {
    setIsLoading(true);
    try {
      const savedAddresses = await repository.getAllAddresses();
      const sorted = AddressManagementService.sortAddresses(savedAddresses);
      setAddresses(sorted);
    } catch (error) {
      console.error('[AddressManagement] Load error:', error);
      Alert.alert('Lỗi', ADDRESS_MANAGEMENT_TEXT.ERROR_LOAD);
    } finally {
      setIsLoading(false);
    }
  }, [repository]);

  useEffect(() => {
    loadAddresses();
  }, [loadAddresses]);

  const handleAddressSelected = useCallback((address: DeliveryAddress) => {
    setPendingAddress(address);
    setShowAddressSearch(false);
    setShowMapPicker(false);
    setShowLabelModal(true);
  }, []);

  const handleSaveLabel = useCallback(async (label: string) => {
    if (!pendingAddress) return;

    try {
      const addressToSave = new DeliveryAddress(
        pendingAddress.id,
        pendingAddress.latitude,
        pendingAddress.longitude,
        pendingAddress.formattedAddress,
        addresses.length === 0,
        label
      );

      await repository.saveAddress(addressToSave);
      
      Alert.alert('Thành công', ADDRESS_MANAGEMENT_TEXT.SAVE_SUCCESS);
      await loadAddresses();
      setPendingAddress(null);
    } catch (error) {
      console.error('[AddressManagement] Save error:', error);
      Alert.alert('Lỗi', ADDRESS_MANAGEMENT_TEXT.ERROR_SAVE);
    }
  }, [pendingAddress, addresses.length, repository, loadAddresses]);

  const handleSetDefault = useCallback(async (id: string) => {
    try {
      const address = addresses.find(a => a.id === id);
      if (!address) return;

      const updatedAddress = new DeliveryAddress(
        address.id,
        address.latitude,
        address.longitude,
        address.formattedAddress,
        true,
        address.label
      );

      await repository.saveDefaultAddress(updatedAddress);
      
      Alert.alert('Thành công', ADDRESS_MANAGEMENT_TEXT.SET_DEFAULT_SUCCESS);
      await loadAddresses();
    } catch (error) {
      console.error('[AddressManagement] Set default error:', error);
      Alert.alert('Lỗi', 'Không thể đặt làm mặc định');
    }
  }, [addresses, repository, loadAddresses]);

  const handleEdit = useCallback((address: DeliveryAddress) => {
    setEditingAddress(address);
    setShowLabelModal(true);
  }, []);

  const handleUpdateLabel = useCallback(async (label: string) => {
    if (!editingAddress) return;

    try {
      const updatedAddress = new DeliveryAddress(
        editingAddress.id,
        editingAddress.latitude,
        editingAddress.longitude,
        editingAddress.formattedAddress,
        editingAddress.isDefault,
        label
      );

      await repository.saveAddress(updatedAddress);
      
      Alert.alert('Thành công', ADDRESS_MANAGEMENT_TEXT.SAVE_SUCCESS);
      await loadAddresses();
      setEditingAddress(null);
    } catch (error) {
      console.error('[AddressManagement] Update error:', error);
      Alert.alert('Lỗi', ADDRESS_MANAGEMENT_TEXT.ERROR_SAVE);
    }
  }, [editingAddress, repository, loadAddresses]);

  const handleDelete = useCallback(async (id: string) => {
    try {
      await repository.deleteAddress(id);
      
      Alert.alert('Thành công', ADDRESS_MANAGEMENT_TEXT.DELETE_SUCCESS);
      await loadAddresses();
    } catch (error) {
      console.error('[AddressManagement] Delete error:', error);
      Alert.alert('Lỗi', ADDRESS_MANAGEMENT_TEXT.ERROR_DELETE);
    }
  }, [repository, loadAddresses]);

  const renderEmpty = useCallback(() => (
    <View style={styles.emptyContainer}>
      <AppIcon
        name="location-outline"
        size={ADDRESS_MANAGEMENT_LAYOUT.EMPTY_ICON_SIZE}
        color={BRAND_COLORS.text.tertiary}
      />
      <Text style={styles.emptyMessage}>{ADDRESS_MANAGEMENT_TEXT.EMPTY_MESSAGE}</Text>
      <Text style={styles.emptySubtitle}>{ADDRESS_MANAGEMENT_TEXT.EMPTY_SUBTITLE}</Text>
    </View>
  ), []);

  const renderItem = useCallback(({ item }: { item: DeliveryAddress }) => (
    <AddressItem
      address={item}
      onSetDefault={handleSetDefault}
      onEdit={handleEdit}
      onDelete={handleDelete}
    />
  ), [handleSetDefault, handleEdit, handleDelete]);

  const keyExtractor = useCallback((item: DeliveryAddress) => item.id, []);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <AppIcon name="chevron-back" size={24} color={BRAND_COLORS.primary.xanhReu} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>{ADDRESS_MANAGEMENT_TEXT.SCREEN_TITLE}</Text>

        <View style={styles.backButton} />
      </View>

      {/* Address List */}
      <FlatList
        data={addresses}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={!isLoading ? renderEmpty : null}
        refreshing={isLoading}
        onRefresh={loadAddresses}
      />

      {/* Add Button */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowAddressSearch(true)}
          activeOpacity={0.7}
        >
          <AppIcon name="add" size={24} color={BRAND_COLORS.background.default} />
          <Text style={styles.addButtonText}>{ADDRESS_MANAGEMENT_TEXT.ADD_ADDRESS_BUTTON}</Text>
        </TouchableOpacity>
      </View>

      {/* Modals */}
      <AddressSearchModal
        visible={showAddressSearch}
        onClose={() => setShowAddressSearch(false)}
        onSelectAddress={handleAddressSelected}
      />

      {showMapPicker && (
        <MapPicker
          onConfirm={handleAddressSelected}
          onCancel={() => setShowMapPicker(false)}
        />
      )}

      <AddressLabelModal
        visible={showLabelModal}
        initialLabel={editingAddress?.label || ''}
        onSave={editingAddress ? handleUpdateLabel : handleSaveLabel}
        onCancel={() => {
          setShowLabelModal(false);
          setPendingAddress(null);
          setEditingAddress(null);
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BRAND_COLORS.background.default,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: ADDRESS_MANAGEMENT_LAYOUT.HEADER_PADDING,
    paddingVertical: 12,
    backgroundColor: BRAND_COLORS.background.default,
    borderBottomWidth: 1,
    borderBottomColor: BRAND_COLORS.border.light,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: ADDRESS_MANAGEMENT_LAYOUT.HEADER_TITLE_FONT_SIZE,
    fontFamily: 'Phudu-Bold',
    color: BRAND_COLORS.primary.xanhReu,
  },
  listContent: {
    padding: ADDRESS_MANAGEMENT_LAYOUT.LIST_PADDING,
    gap: ADDRESS_MANAGEMENT_LAYOUT.LIST_GAP,
    paddingBottom: 100,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
    gap: 16,
  },
  emptyMessage: {
    fontSize: ADDRESS_MANAGEMENT_LAYOUT.EMPTY_MESSAGE_FONT_SIZE,
    fontFamily: 'Phudu-Bold',
    color: BRAND_COLORS.text.secondary,
  },
  emptySubtitle: {
    fontSize: ADDRESS_MANAGEMENT_LAYOUT.EMPTY_SUBTITLE_FONT_SIZE,
    fontFamily: 'SpaceGrotesk-Medium',
    color: BRAND_COLORS.text.tertiary,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: BRAND_COLORS.background.default,
    borderTopWidth: 1,
    borderTopColor: BRAND_COLORS.border.light,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: ADDRESS_MANAGEMENT_LAYOUT.ADD_BUTTON_HEIGHT,
    backgroundColor: BRAND_COLORS.primary.xanhReu,
    borderRadius: ADDRESS_MANAGEMENT_LAYOUT.ADD_BUTTON_BORDER_RADIUS,
  },
  addButtonText: {
    fontSize: 16,
    fontFamily: 'Phudu-Bold',
    color: BRAND_COLORS.background.default,
  },
});