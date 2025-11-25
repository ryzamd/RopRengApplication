import React from 'react';
import { View } from 'react-native';
import { UTILITIES } from '../MoreConstants';
import { styles } from '../styles';
import { UtilityItem } from './UtilityItem';

export const UtilityGrid = () => {
  const handlePress = (id: string) => {
    console.log('Utility pressed:', id);
    // Xử lý navigate tại đây nếu cần
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