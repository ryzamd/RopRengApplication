import { useEffect, useCallback } from 'react';
import { useSharedValue, useAnimatedStyle } from 'react-native-reanimated';
import { animationService } from '../../../infrastructure/animations/core/AnimationService';

interface UseModalSlideAnimationOptions {
  onEnterComplete?: () => void;
  onExitComplete?: () => void;
}

export function useModalSlideAnimation(options?: UseModalSlideAnimationOptions) {
  const { height: SCREEN_HEIGHT } = animationService.getScreenDimensions();
  
  const translateY = useSharedValue(SCREEN_HEIGHT);
  const backdropOpacity = useSharedValue(0);

  // Dismiss function - useCallback để stable reference
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

  // Animated styles - stable references
  const animatedModalStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const animatedBackdropStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }));

  return {
    translateY,
    backdropOpacity,
    animatedModalStyle,
    animatedBackdropStyle,
    dismiss,
  };
}