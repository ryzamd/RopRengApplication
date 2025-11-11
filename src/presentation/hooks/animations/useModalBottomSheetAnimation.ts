import { useEffect, useCallback } from 'react';
import { useSharedValue, useAnimatedStyle } from 'react-native-reanimated';
import { animationService } from '../../../infrastructure/animations/core/AnimationService';
import { MODAL_LAYOUT_CONFIGS } from '../../../infrastructure/animations/presets/modal.presets';

interface UseModalBottomSheetAnimationOptions {
  heightPercentage?: number; // Default 0.9 (90%)
  onEnterComplete?: () => void;
  onExitComplete?: () => void;
}

/**
 * Hook cho Bottom Sheet Modal Animation
 
 * Features:
 * - Slide from bottom với height % tuỳ chỉnh
 * - Background visible → no white flash
 * - Rounded top corners
 * - Backdrop fade
 
 * Usage:
 * ```typescript
 * const { animatedModalStyle, animatedBackdropStyle, dismiss } = useModalBottomSheetAnimation({
 *   heightPercentage: 0.9,
 *   onExitComplete: () => router.back()
 * });
 * ```
 */
export function useModalBottomSheetAnimation(options?: UseModalBottomSheetAnimationOptions) {
  const { height: SCREEN_HEIGHT } = animationService.getScreenDimensions();
  
  const heightPercentage = options?.heightPercentage || MODAL_LAYOUT_CONFIGS.BOTTOM_SHEET_90.heightPercentage;
  const modalHeight = SCREEN_HEIGHT * heightPercentage;
  
  const translateY = useSharedValue(SCREEN_HEIGHT);
  const backdropOpacity = useSharedValue(0);

  // Dismiss function
  const dismiss = useCallback(() => {
    animationService.slideModalOut(translateY, backdropOpacity, {
      onComplete: options?.onExitComplete,
    });
  }, [translateY, backdropOpacity, options?.onExitComplete]);

  // Enter animation on mount
  useEffect(() => {
    animationService.slideModalIn(translateY, backdropOpacity, {
      onComplete: options?.onEnterComplete,
    });
  }, [translateY, backdropOpacity, options?.onEnterComplete]);

  // Animated styles
  const animatedModalStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const animatedBackdropStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }));

  return {
    translateY,
    backdropOpacity,
    modalHeight,
    animatedModalStyle,
    animatedBackdropStyle,
    dismiss,
  };
}