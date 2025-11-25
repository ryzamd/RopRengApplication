import React from 'react';
import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MORE_STRINGS } from '../MoreConstants';
import { styles } from '../styles';

export const MoreHeader = () => {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.headerContainer, { paddingTop: insets.top }]}>
      <Text style={styles.headerTitle}>{MORE_STRINGS.HEADER_TITLE}</Text>
    </View>
  );
};