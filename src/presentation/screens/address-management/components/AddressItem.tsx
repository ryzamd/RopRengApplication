import React from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { AppIcon } from '../../../components/shared/AppIcon';
import { BRAND_COLORS } from '../../../theme/colors';
import { ADDRESS_MANAGEMENT_TEXT } from '../AddressManagementConstants';
import { AddressItemProps } from '../AddressManagementInterfaces';
import { ADDRESS_MANAGEMENT_LAYOUT } from '../AddressManagementLayout';

export function AddressItem({ address, onSetDefault, onEdit, onDelete }: AddressItemProps) {
  const handleDelete = () => {
    Alert.alert(
      ADDRESS_MANAGEMENT_TEXT.DELETE_CONFIRM_TITLE,
      ADDRESS_MANAGEMENT_TEXT.DELETE_CONFIRM_MESSAGE,
      [
        {
          text: ADDRESS_MANAGEMENT_TEXT.DELETE_CONFIRM_CANCEL,
          style: 'cancel',
        },
        {
          text: ADDRESS_MANAGEMENT_TEXT.DELETE_CONFIRM_OK,
          style: 'destructive',
          onPress: () => onDelete(address.id),
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Left: Icon + Address Info */}
      <View style={styles.leftSection}>
        <View style={styles.iconContainer}>
          <AppIcon name="location" size={ADDRESS_MANAGEMENT_LAYOUT.ICON_SIZE} color={BRAND_COLORS.primary.xanhReu} />
        </View>

        <View style={styles.textContainer}>
          <View style={styles.labelRow}>
            {address.label && (
              <Text style={styles.label}>{address.label}</Text>
            )}
            {address.isDefault && (
              <View style={styles.defaultBadge}>
                <Text style={styles.defaultBadgeText}>{ADDRESS_MANAGEMENT_TEXT.DEFAULT_BADGE}</Text>
              </View>
            )}
          </View>
          
          <Text style={styles.address} numberOfLines={2}>
            {address.formattedAddress}
          </Text>
        </View>
      </View>

      {/* Right: Action Buttons */}
      <View style={styles.actionsContainer}>
        {!address.isDefault && (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => onSetDefault(address.id)}
            activeOpacity={0.7}
          >
            <AppIcon name="checkmark-circle-outline" size={20} color={BRAND_COLORS.primary.xanhReu} />
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => onEdit(address)}
          activeOpacity={0.7}
        >
          <AppIcon name="create-outline" size={20} color={BRAND_COLORS.primary.xanhReu} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleDelete}
          activeOpacity={0.7}
        >
          <AppIcon name="trash-outline" size={20} color="#FF6B6B" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: BRAND_COLORS.background.default,
    borderRadius: ADDRESS_MANAGEMENT_LAYOUT.ITEM_BORDER_RADIUS,
    padding: ADDRESS_MANAGEMENT_LAYOUT.ITEM_PADDING,
    gap: ADDRESS_MANAGEMENT_LAYOUT.ITEM_GAP,
    borderWidth: 1,
    borderColor: BRAND_COLORS.border.light,
  },
  leftSection: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconContainer: {
    width: ADDRESS_MANAGEMENT_LAYOUT.ICON_CONTAINER_SIZE,
    height: ADDRESS_MANAGEMENT_LAYOUT.ICON_CONTAINER_SIZE,
    borderRadius: ADDRESS_MANAGEMENT_LAYOUT.ICON_CONTAINER_SIZE / 2,
    backgroundColor: BRAND_COLORS.primary.beSua,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
    gap: 6,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontFamily: 'Phudu-Bold',
    color: BRAND_COLORS.primary.xanhReu,
    textTransform: 'uppercase',
  },
  defaultBadge: {
    backgroundColor: BRAND_COLORS.primary.xanhReu,
    borderRadius: ADDRESS_MANAGEMENT_LAYOUT.BADGE_BORDER_RADIUS,
    paddingHorizontal: ADDRESS_MANAGEMENT_LAYOUT.BADGE_PADDING_HORIZONTAL,
    paddingVertical: ADDRESS_MANAGEMENT_LAYOUT.BADGE_PADDING_VERTICAL,
  },
  defaultBadgeText: {
    fontSize: ADDRESS_MANAGEMENT_LAYOUT.BADGE_FONT_SIZE,
    fontFamily: 'Phudu-Bold',
    color: BRAND_COLORS.background.default,
  },
  address: {
    fontSize: 14,
    fontFamily: 'SpaceGrotesk-Medium',
    color: BRAND_COLORS.text.secondary,
    lineHeight: 20,
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: BRAND_COLORS.background.default,
    justifyContent: 'center',
    alignItems: 'center',
  },
});