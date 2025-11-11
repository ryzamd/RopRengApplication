import { useEffect, useCallback } from 'react';
import { useSharedValue, useAnimatedStyle } from 'react-native-reanimated';
import { animationService } from '../../../infrastructure/animations/core/AnimationService';
import { AnimationDirection } from '../../../infrastructure/animations/core/animation.types';

interface UsePageTransitionAnimationOptions {
  direction?: AnimationDirection;
  onEnterComplete?: () => void;
  onExitComplete?: () => void;
}

export function usePageTransitionAnimation(options?: UsePageTransitionAnimationOptions) {
  const { width: SCREEN_WIDTH } = animationService.getScreenDimensions();
  
  const direction = options?.direction || AnimationDirection.RIGHT;
  const translateX = useSharedValue(
    direction === AnimationDirection.RIGHT ? SCREEN_WIDTH : -SCREEN_WIDTH
  );

  // Exit function - useCallback để stable reference
  const exit = useCallback(() => {
    if (direction === AnimationDirection.RIGHT) {
      animationService.slidePageToRight(translateX, {
        onComplete: options?.onExitComplete,
      });
    }
  }, [direction, translateX, options?.onExitComplete]);

  // Enter animation on mount
  useEffect(() => {
    if (direction === AnimationDirection.RIGHT) {
      animationService.slidePageFromRight(translateX, {
        onComplete: options?.onEnterComplete,
      });
    }
  }, [direction, translateX, options?.onEnterComplete]);

  // Animated style - stable reference
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return {
    translateX,
    animatedStyle,
    exit,
  };
}