import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BRAND_COLORS } from '../../theme/colors';
import { AppIcon } from '../shared/AppIcon';
import { MAP_TEXT } from './MapConstants';
import { DeliveryAddressCardProps } from './MapInterfaces';
import { MAP_LAYOUT } from './MapLayout';

export function DeliveryAddressCard({
  address,
  onEdit,
  showEditButton = true,
}: DeliveryAddressCardProps) {
  if (!address) {
    return (
      <View style={[styles.card, styles.emptyCard]}>
        <AppIcon name="location" size={MAP_LAYOUT.CARD_ICON_SIZE} color={BRAND_COLORS.text.secondary} />
        <Text style={styles.emptyText}>{MAP_TEXT.GETTING_LOCATION}</Text>
      </View>
    );
  }

  return (
    <View style={styles.card}>
      <View style={styles.iconContainer}>
        <AppIcon name="location" size={MAP_LAYOUT.CARD_ICON_SIZE} color={BRAND_COLORS.primary.xanhReu} />
      </View>

      <View style={styles.textContainer}>
        {address.label && (
          <Text style={styles.label}>{address.label}</Text>
        )}
        <Text style={styles.address} numberOfLines={2}>
          {address.formattedAddress}
        </Text>
      </View>

      {showEditButton && (
        <TouchableOpacity
          style={styles.editButton}
          onPress={onEdit}
          activeOpacity={0.7}
        >
          <AppIcon name="create-outline" size={20} color={BRAND_COLORS.primary.xanhReu} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: BRAND_COLORS.background.default,
    borderRadius: MAP_LAYOUT.CARD_BORDER_RADIUS,
    padding: MAP_LAYOUT.CARD_PADDING,
    gap: MAP_LAYOUT.CARD_GAP,
    borderWidth: 1,
    borderColor: BRAND_COLORS.border.light,
  },
  emptyCard: {
    justifyContent: 'center',
    paddingVertical: 24,
  },
  emptyText: {
    fontSize: MAP_LAYOUT.CARD_ADDRESS_FONT_SIZE,
    fontFamily: 'SpaceGrotesk-Medium',
    color: BRAND_COLORS.text.secondary,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: BRAND_COLORS.primary.beSua,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
    gap: 4,
  },
  label: {
    fontSize: 12,
    fontFamily: 'Phudu-Bold',
    color: BRAND_COLORS.primary.xanhReu,
    textTransform: 'uppercase',
  },
  address: {
    fontSize: MAP_LAYOUT.CARD_ADDRESS_FONT_SIZE,
    fontFamily: 'SpaceGrotesk-Medium',
    color: BRAND_COLORS.text.primary,
    lineHeight: 20,
  },
  editButton: {
    width: MAP_LAYOUT.EDIT_BUTTON_SIZE,
    height: MAP_LAYOUT.EDIT_BUTTON_SIZE,
    borderRadius: MAP_LAYOUT.EDIT_BUTTON_SIZE / 2,
    backgroundColor: BRAND_COLORS.primary.beSua,
    justifyContent: 'center',
    alignItems: 'center',
  },
});