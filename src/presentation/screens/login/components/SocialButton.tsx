import { SOCIAL_ICONS } from '@/src/presentation/theme/iconConstants';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { AppIcon } from '../../../components/shared/AppIcon';
import { BRAND_COLORS } from '../../../theme/colors';
import { LoginProvider } from '../LoginEnums';
import { LOGIN_LAYOUT } from '../LoginLayout';

interface SocialButtonProps {
  provider: LoginProvider;
  label: string;
  onPress: () => void;
}

export function SocialButton({ provider, label, onPress }: SocialButtonProps) {
  const isFacebook = provider === LoginProvider.FACEBOOK;

  return (
    <TouchableOpacity
      style={[styles.button, isFacebook && styles.buttonFacebook]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {isFacebook ? (
        <AppIcon name={SOCIAL_ICONS.FACEBOOK} size="lg" style={styles.facebookIcon} />
      ) : (
        <AppIcon name={SOCIAL_ICONS.GOOGLE} size="lg" style={styles.googleIcon} />
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
    borderWidth: LOGIN_LAYOUT.INPUT_BORDER_WIDTH,
    borderColor: '#E5E5E5',
    borderRadius: LOGIN_LAYOUT.BUTTON_BORDER_RADIUS,
    paddingVertical: LOGIN_LAYOUT.INPUT_PADDING_VERTICAL,
    marginBottom: LOGIN_LAYOUT.SOCIAL_BUTTON_MARGIN_BOTTOM,
    gap: LOGIN_LAYOUT.SOCIAL_BUTTON_GAP,
  },
  buttonFacebook: {
    backgroundColor: BRAND_COLORS.primary.xanhReu,
    borderColor: BRAND_COLORS.primary.xanhReu,
  },
  facebookIcon: {
    fontSize: LOGIN_LAYOUT.SOCIAL_ICON_FONT_SIZE,
    fontFamily: 'Phudu-Bold',
    color: BRAND_COLORS.background.white,
  },
  googleIcon: {
    fontSize: LOGIN_LAYOUT.SOCIAL_ICON_FONT_SIZE,
    fontFamily: 'Phudu-Bold',
    // color: '#f44242ff',
  },
  label: {
    fontSize: LOGIN_LAYOUT.BUTTON_FONT_SIZE,
    fontFamily: 'SpaceGrotesk-Medium',
    color: BRAND_COLORS.primary.xanhReu,
  },
  labelFacebook: {
    color: BRAND_COLORS.background.white,
  },
});