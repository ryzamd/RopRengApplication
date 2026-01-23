import React from 'react';
import { View, StyleSheet } from 'react-native';

interface OrderHistoryLayoutProps {
  children: React.ReactNode;
}

export function OrderHistoryLayout({ children }: OrderHistoryLayoutProps) {
  return <View style={styles.container}>{children}</View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
});