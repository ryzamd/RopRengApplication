import { useCallback } from 'react';
import { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { animationService } from '../../../infrastructure/animations/core/AnimationService';
import { AnimationCallbacks } from '../../../infrastructure/animations/core/animation.types';

interface UseShakeAnimationOptions {
  onShakeStart?: () => void;
  onShakeComplete?: () => void;
}

export function useShakeAnimation(options?: UseShakeAnimationOptions) {
  const translateX = useSharedValue(0);

  const shake = useCallback(() => {
    const callbacks: AnimationCallbacks = {
      onStart: options?.onShakeStart,
      onComplete: options?.onShakeComplete,
    };
    
    animationService.shake(translateX, callbacks);
  }, [translateX, options?.onShakeStart, options?.onShakeComplete]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return {
    translateX,
    animatedStyle,
    shake,
  };
}