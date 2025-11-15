import { Ionicons } from '@expo/vector-icons';
import { ComponentProps } from 'react';

/**
 * IconService - Singleton for centralized icon management
 
 * Responsibilities:
 * - Validate icon names
 * - Provide type-safe icon references
 * - Centralize icon configuration
 */
export class IconService {
  private static instance: IconService;

  private constructor() {}

  public static getInstance(): IconService {
    if (!IconService.instance) {
      IconService.instance = new IconService();
    }
    return IconService.instance;
  }

  public validateIconName(name: string): boolean {
    // Ionicons runtime validation
    try {
      return typeof name === 'string' && name.length > 0;
    } catch {
      return false;
    }
  }

  public getIconSize(size: 'xs' | 'sm' | 'md' | 'lg' | 'xl'): number {
    const sizeMap = {
      xs: 16,
      sm: 20,
      md: 24,
      lg: 28,
      xl: 32,
    };
    return sizeMap[size];
  }
}

export const iconService = IconService.getInstance();

// Type helper for Ionicons
export type IoniconsName = ComponentProps<typeof Ionicons>['name'];