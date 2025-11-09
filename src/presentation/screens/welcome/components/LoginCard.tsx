import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BRAND_COLORS } from '../../../theme/colors';
import { WELCOME_CONSTANTS } from '../constants';

export function LoginCard() {
  const router = useRouter();

  const handleLoginPress = () => {
    router.push('/login');
  };

  const handleLoyaltyPress = () => {
    console.log('Clicked: Rốp Rẻng Loyalty');
  };

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{WELCOME_CONSTANTS.LOGIN_CARD.TITLE}</Text>
      <Text style={styles.subtitle}>{WELCOME_CONSTANTS.LOGIN_CARD.SUBTITLE}</Text>
      
      <TouchableOpacity style={styles.button} onPress={handleLoginPress}>
        <Text style={styles.buttonText}>{WELCOME_CONSTANTS.LOGIN_CARD.BUTTON_TEXT}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.loyaltyRow} onPress={handleLoyaltyPress}>
        <Text style={styles.loyaltyText}>{WELCOME_CONSTANTS.LOGIN_CARD.LOYALTY_TITLE}</Text>
        <Text style={styles.arrow}>›</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: BRAND_COLORS.background.white,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Phudu-Bold',
    color: BRAND_COLORS.primary.xanhReu,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'SpaceGrotesk-Medium',
    color: BRAND_COLORS.primary.xanhReu,
    lineHeight: 20,
    marginBottom: 16,
  },
  button: {
    backgroundColor: BRAND_COLORS.secondary.nauEspresso,
    borderRadius: 24,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonText: {
    fontSize: 16,
    fontFamily: 'Phudu-Bold',
    color: BRAND_COLORS.background.white,
  },
  loyaltyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  loyaltyText: {
    fontSize: 14,
    fontFamily: 'SpaceGrotesk-Medium',
    color: BRAND_COLORS.primary.xanhReu,
  },
  arrow: {
    fontSize: 24,
    color: BRAND_COLORS.primary.xanhReu,
  },
});