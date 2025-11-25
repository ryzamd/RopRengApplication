import React from 'react';
import { Text, View } from 'react-native';
import { MenuSectionData } from '../MoreInterfaces';
import { styles } from '../styles';
import { MenuItem } from './MenuItem';

interface Props { section: MenuSectionData; onItemPress: (id: string) => void; }

export const MenuSection = ({ section, onItemPress }: Props) => {
  return (
    <View style={styles.sectionContainer}>
      {section.title && <Text style={styles.sectionTitle}>{section.title}</Text>}
      {section.items.map((item, index) => (
        <MenuItem
          key={item.id}
          item={item}
          isLast={index === section.items.length - 1}
          onPress={onItemPress}
        />
      ))}
    </View>
  );
};