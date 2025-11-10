import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { BRAND_COLORS } from '../../../theme/colors';
import { WELCOME_CONSTANTS } from '../constants';

export function QuickActions() {
  const handleActionPress = (actionId: string, label: string) => {
    console.log(`Clicked: ${label} (${actionId})`);
  };

  return (
    <View style={styles.container}>
      {WELCOME_CONSTANTS.QUICK_ACTIONS.map((action) => (
        <TouchableOpacity
          key={action.id}
          style={styles.actionItem}
          onPress={() => handleActionPress(action.id, action.label)}
        >
          <View style={styles.iconContainer}>
            <Text style={styles.icon}>{action.icon}</Text>
          </View>
          <Text style={styles.label}>{action.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: BRAND_COLORS.background.white,
    borderRadius: 16,
    padding: 16,
    justifyContent: 'space-around',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionItem: {
    alignItems: 'center',
    gap: 8,
  },
  iconContainer: {
    width: 60,
    height: 60,
    backgroundColor: BRAND_COLORS.primary.beSua,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    fontSize: 24,
  },
  label: {
    fontSize: 12,
    fontFamily: 'SpaceGrotesk-Medium',
    color: BRAND_COLORS.primary.xanhReu,
    textAlign: 'center',
  },
});