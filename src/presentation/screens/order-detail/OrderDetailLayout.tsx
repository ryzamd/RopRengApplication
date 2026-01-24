import React from 'react';
import { StyleSheet, View } from 'react-native';

interface OrderDetailLayoutProps {
  children: React.ReactNode;
}

export function OrderDetailLayout({ children }: OrderDetailLayoutProps) {
  return <View style={styles.container}>{children}</View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
});