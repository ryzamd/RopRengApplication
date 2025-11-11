import { useEffect, useCallback } from 'react';
import { useSharedValue, useAnimatedStyle } from 'react-native-reanimated';
import { animationService } from '../../../infrastructure/animations/core/AnimationService';

interface UseFadeAnimationOptions {
  autoStart?: boolean;
  onFadeInComplete?: () => void;
  onFadeOutComplete?: () => void;
}

export function useFadeAnimation(options?: UseFadeAnimationOptions) {
  const opacity = useSharedValue(0);

  const fadeIn = useCallback(() => {
    animationService.fadeModalIn(opacity, {
      onComplete: options?.onFadeInComplete,
    });
  }, [opacity, options?.onFadeInComplete]);

  const fadeOut = useCallback(() => {
    animationService.fadeModalOut(opacity, {
      onComplete: options?.onFadeOutComplete,
    });
  }, [opacity, options?.onFadeOutComplete]);

  useEffect(() => {
    if (options?.autoStart) {
      fadeIn();
    }
  }, [options?.autoStart, fadeIn]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return {
    opacity,
    animatedStyle,
    fadeIn,
    fadeOut,
  };
}