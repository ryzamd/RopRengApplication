import React from 'react';
import { Text, View } from 'react-native';
import { MORE_STRINGS } from '../MoreConstants';
import { styles } from '../styles';

export const VersionFooter = () => {
  return (
    <View style={styles.footerContainer}>
      <Text style={styles.versionText}>{MORE_STRINGS.VERSION}</Text>
    </View>
  );
};