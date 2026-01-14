import React from 'react';
import { View } from 'react-native';
import { UTILITIES } from '../MoreConstants';
import { styles } from '../styles';
import { UtilityItem } from './UtilityItem';

interface UtilityGridProps {
  onItemPress?: (id: string) => void;
}

export function UtilityGrid({ onItemPress }: UtilityGridProps) {
  const handlePress = (id: string) => {
    if (onItemPress) {
      onItemPress(id);
    }
  };

  return (
    <View style={styles.sectionContainer}>
      <View style={styles.gridContainer}>
        {UTILITIES.map((item) => (
          <UtilityItem key={item.id} item={item} onPress={handlePress} />
        ))}
      </View>
    </View>
  );
};