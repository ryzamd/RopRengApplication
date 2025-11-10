import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { BRAND_COLORS } from '../../../theme/colors';

interface SocialButtonProps {
  provider: 'facebook' | 'google';
  label: string;
  onPress: () => void;
}

export function SocialButton({ provider, label, onPress }: SocialButtonProps) {
  const isFacebook = provider === 'facebook';

  return (
    <TouchableOpacity
      style={[styles.button, isFacebook && styles.buttonFacebook]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {isFacebook ? (
        <Text style={styles.facebookIcon}>f</Text>
      ) : (
        <Text style={styles.googleIcon}>G</Text>
      )}
      <Text style={[styles.label, isFacebook && styles.labelFacebook]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: BRAND_COLORS.background.white,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 12,
    paddingVertical: 14,
    marginBottom: 12,
    gap: 12,
  },
  buttonFacebook: {
    backgroundColor: '#1877F2',
    borderColor: '#1877F2',
  },
  facebookIcon: {
    fontSize: 24,
    fontFamily: 'Phudu-Bold',
    color: BRAND_COLORS.background.white,
  },
  googleIcon: {
    fontSize: 20,
    fontFamily: 'Phudu-Bold',
    color: '#4285F4',
  },
  label: {
    fontSize: 16,
    fontFamily: 'SpaceGrotesk-Medium',
    color: BRAND_COLORS.primary.xanhReu,
  },
  labelFacebook: {
    color: BRAND_COLORS.background.white,
  },
});