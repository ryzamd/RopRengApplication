import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { AppIcon } from '../../../components/shared/AppIcon';
import { BRAND_COLORS } from '../../../theme/colors';
import { UtilityItemData } from '../MoreInterfaces';
import { MORE_LAYOUT } from '../MoreLayout';
import { styles } from '../styles';

interface Props {
  item: UtilityItemData;
  onPress?: (id: string) => void;
}

export const UtilityItem = ({ item, onPress }: Props) => {
  return (
    <TouchableOpacity style={styles.gridItem} onPress={() => onPress?.(item.id)}>
      <View style={styles.iconContainer}>
        <AppIcon
          name={item.icon}
          size={MORE_LAYOUT.GRID_ICON_SIZE}
          color={BRAND_COLORS.primary.xanhReu}
        />
        {item.badge ? (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{item.badge}</Text>
          </View>
        ) : null}
      </View>
      <Text style={styles.gridLabel}>{item.label}</Text>
    </TouchableOpacity>
  );
};