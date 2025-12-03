import React from 'react';
import { Text as RNText, TextProps as RNTextProps, StyleSheet } from 'react-native';
import { BRAND_COLORS } from '../../theme/colors';
import { FONT_FAMILIES } from '../../theme/typography';

interface GlobalTextProps extends RNTextProps {
  variant?: 'heading' | 'body' | 'mono';
  weight?: 'medium' | 'semiBold' | 'bold';
  color?: string;
}

export function GlobalText({
  variant = 'body',
  weight = 'medium',
  color = BRAND_COLORS.primary.xanhReu,
  style,
  ...props
}: GlobalTextProps) {
  const getFontFamily = () => {
    switch (variant) {
      case 'heading':
        return FONT_FAMILIES.phudu[weight] || FONT_FAMILIES.phudu.bold;
      case 'mono':
        return FONT_FAMILIES.spaceMono.bold;
      case 'body':
      default:
        return FONT_FAMILIES.spaceGrotesk.medium || FONT_FAMILIES.spaceGrotesk.medium;
    }
  };

  return (
    <RNText
      style={[
        styles.base,
        { fontFamily: getFontFamily(), color },
        style
      ]}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  base: {
    fontSize: 16,
    lineHeight: 24,
  },
});