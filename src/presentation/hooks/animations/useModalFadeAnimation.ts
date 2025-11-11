import { useEffect, useCallback } from 'react';
import { useSharedValue, useAnimatedStyle } from 'react-native-reanimated';
import { animationService } from '../../../infrastructure/animations/core/AnimationService';

interface UseModalFadeAnimationOptions {
  onEnterComplete?: () => void;
  onExitComplete?: () => void;
}

/**
 * Hook cho Modal Fade Animation (pure fade in/out)
 * 
 * Features:
 * - Fade in on enter
 * - Fade out on exit
 * - Backdrop fade in/out
 * - Haptic feedback
 * 
 * Usage:
 * ```typescript
 * const { animatedModalStyle, animatedBackdropStyle, dismiss } = useModalFadeAnimation({
 *   onExitComplete: () => router.back()
 * });
 * ```
 */
export function useModalFadeAnimation(options?: UseModalFadeAnimationOptions) {
  const modalOpacity = useSharedValue(0);
  const backdropOpacity = useSharedValue(0);

  // Dismiss function
  const dismiss = useCallback(() => {
    animationService.fadeModalOut(modalOpacity, {
      onStart: () => animationService.triggerHaptic(),
    });
    
    animationService.fadeModalOut(backdropOpacity, {
      onComplete: options?.onExitComplete,
    });
  }, [modalOpacity, backdropOpacity, options?.onExitComplete]);

  // Enter animation on mount
  useEffect(() => {
    animationService.fadeModalIn(modalOpacity, {
      onComplete: options?.onEnterComplete,
    });
    
    animationService.fadeModalIn(backdropOpacity);
  }, [modalOpacity, backdropOpacity, options?.onEnterComplete]);

  // Animated styles
  const animatedModalStyle = useAnimatedStyle(() => ({
    opacity: modalOpacity.value,
  }));

  const animatedBackdropStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }));

  return {
    modalOpacity,
    backdropOpacity,
    animatedModalStyle,
    animatedBackdropStyle,
    dismiss,
  };
}