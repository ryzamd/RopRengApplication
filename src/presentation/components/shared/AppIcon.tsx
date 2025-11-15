import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleProp, TextStyle } from 'react-native';
import { iconService, IoniconsName } from '../../../infrastructure/icons';
import { BRAND_COLORS } from '../../theme/colors';

export type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number;

interface AppIconProps {
  name: IoniconsName;
  size?: IconSize;
  color?: string;
  style?: StyleProp<TextStyle>;
}

/**
 * AppIcon - Centralized icon wrapper component
 
 * Features:
 * - Auto-applies theme colors
 * - Predefined size tokens
 * - Type-safe icon names
 * - Consistent styling
 
 * Usage:
 * ```tsx
 * <AppIcon name="home-outline" size="md" />
 * <AppIcon name="cafe" size={24} color="#custom" />
 * ```
 */
export function AppIcon({ name, size = 'md', color = BRAND_COLORS.primary.xanhReu, style}: AppIconProps) {
  const iconSize = typeof size === 'number' ? size : iconService.getIconSize(size);

  return (
    <Ionicons
      name={name}
      size={iconSize}
      color={color}
      style={style}
    />
  );
}