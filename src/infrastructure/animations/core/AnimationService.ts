import * as Haptics from 'expo-haptics';
import { Dimensions } from 'react-native';
import { SharedValue, withTiming } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import { MODAL_ANIMATION_PRESETS, PAGE_ANIMATION_PRESETS, SHARED_EASINGS } from '../presets';
import { SHAKE_CONFIG } from '../presets/shake.presets';
import { AnimationCallbacks, AnimationConfig } from './animation.types';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

/**
 * AnimationService - Singleton service quản lý tất cả animations
 
 * Responsibilities:
 * - Centralized animation orchestration
 * - Preset management
 * - Haptic feedback integration
 * - Cross-platform consistency
 
 * Usage:
 * ```typescript
 * const animService = AnimationService.getInstance();
 * animService.slideModalIn(translateY, opacity, callbacks);
 * ```
 */
export class AnimationService {
  private static instance: AnimationService;

  private constructor() {}

  public static getInstance(): AnimationService {
    if (!AnimationService.instance) {
      AnimationService.instance = new AnimationService();
    }
    return AnimationService.instance;
  }

  // ==================== MODAL ANIMATIONS ====================

  /* Modal slide from bottom → top (enter) */
  public slideModalIn(
    translateY: SharedValue<number>,
    opacity?: SharedValue<number>,
    callbacks?: AnimationCallbacks
  ): void {
    const config = MODAL_ANIMATION_PRESETS.MODAL_SLIDE_BOTTOM.enter;

    if (callbacks?.onStart) {
      scheduleOnRN(callbacks.onStart);
    }

    translateY.value = withTiming(0, {
      duration: config.duration,
      easing: config.easing,
    });

    if (opacity) {
      opacity.value = withTiming(1, {
        duration: config.duration,
        easing: SHARED_EASINGS.linear,
      }, (finished) => {
        if (finished && callbacks?.onComplete) {
          scheduleOnRN(callbacks.onComplete);
        }
      });
    }
  }

  /* Modal slide from top → bottom (exit) */
  public slideModalOut(
    translateY: SharedValue<number>,
    opacity?: SharedValue<number>,
    callbacks?: AnimationCallbacks
  ): void {
    const config = MODAL_ANIMATION_PRESETS.MODAL_SLIDE_BOTTOM.exit;

    if (callbacks?.onStart) {
      scheduleOnRN(callbacks.onStart);
    }

    // Haptic feedback
    scheduleOnRN(Haptics.impactAsync, Haptics.ImpactFeedbackStyle.Light);

    translateY.value = withTiming(SCREEN_HEIGHT, {
      duration: config.duration,
      easing: config.easing,
    });

    if (opacity) {
      opacity.value = withTiming(0, {
        duration: config.duration,
        easing: SHARED_EASINGS.linear,
      }, (finished) => {
        if (finished && callbacks?.onComplete) {
          scheduleOnRN(callbacks.onComplete);
        }
      });
    }
  }

  /* Modal fade in */
  public fadeModalIn(
    opacity: SharedValue<number>,
    callbacks?: AnimationCallbacks
  ): void {
    const config = MODAL_ANIMATION_PRESETS.MODAL_FADE.enter;

    if (callbacks?.onStart) {
      scheduleOnRN(callbacks.onStart);
    }

    opacity.value = withTiming(1, {
      duration: config.duration,
      easing: config.easing,
    }, (finished) => {
      if (finished && callbacks?.onComplete) {
        scheduleOnRN(callbacks.onComplete);
      }
    });
  }

  /* Modal fade out */
  public fadeModalOut(
    opacity: SharedValue<number>,
    callbacks?: AnimationCallbacks
  ): void {
    const config = MODAL_ANIMATION_PRESETS.MODAL_FADE.exit;

    if (callbacks?.onStart) {
      scheduleOnRN(callbacks.onStart);
    }

    opacity.value = withTiming(0, {
      duration: config.duration,
      easing: config.easing,
    }, (finished) => {
      if (finished && callbacks?.onComplete) {
        scheduleOnRN(callbacks.onComplete);
      }
    });
  }

  // ==================== PAGE ANIMATIONS ====================

  /* Page slide from right (iOS push) */
  public slidePageFromRight(
    translateX: SharedValue<number>,
    callbacks?: AnimationCallbacks
  ): void {
    const config = PAGE_ANIMATION_PRESETS.PAGE_SLIDE_RIGHT.enter;

    if (callbacks?.onStart) {
      scheduleOnRN(callbacks.onStart);
    }

    translateX.value = withTiming(0, {
      duration: config.duration,
      easing: config.easing,
    }, (finished) => {
      if (finished && callbacks?.onComplete) {
        scheduleOnRN(callbacks.onComplete);
      }
    });
  }

  /* Page slide to right (back navigation) */
  public slidePageToRight(
    translateX: SharedValue<number>,
    callbacks?: AnimationCallbacks
  ): void {
    const config = PAGE_ANIMATION_PRESETS.PAGE_SLIDE_RIGHT.exit;

    if (callbacks?.onStart) {
      scheduleOnRN(callbacks.onStart);
    }

    translateX.value = withTiming(SCREEN_WIDTH, {
      duration: config.duration,
      easing: config.easing,
    }, (finished) => {
      if (finished && callbacks?.onComplete) {
        scheduleOnRN(callbacks.onComplete);
      }
    });
  }

  // ==================== GENERIC ANIMATION ====================

  /*
    Generic animation với custom config
    Dùng cho custom cases không có preset
  */
  public animate(
    sharedValue: SharedValue<number>,
    toValue: number,
    config: AnimationConfig,
    callbacks?: AnimationCallbacks
  ): void {
    if (callbacks?.onStart) {
      scheduleOnRN(callbacks.onStart);
    }

    sharedValue.value = withTiming(toValue, {
      duration: config.duration,
      easing: config.easing || SHARED_EASINGS.standard,
    }, (finished) => {
      if (finished && callbacks?.onComplete) {
        scheduleOnRN(callbacks.onComplete);
      }
    });
  }

  // ==================== UTILITIES ====================

  /* Get screen dimensions */
  public getScreenDimensions() {
    return { width: SCREEN_WIDTH, height: SCREEN_HEIGHT };
  }

  /* Trigger haptic feedback */
  public triggerHaptic(style: Haptics.ImpactFeedbackStyle = Haptics.ImpactFeedbackStyle.Light) {
    Haptics.impactAsync(style);
  }

  // ==================== SHAKE ANIMATIONS ====================

  /**
   * Shake animation for error feedback
   */
  public shake(translateX: SharedValue<number>, callbacks?: AnimationCallbacks) : void 
  {
    'worklet';
    
    if (callbacks?.onStart) {
      scheduleOnRN(callbacks.onStart);
    }

    const { AMPLITUDE, ITERATIONS, DURATION } = SHAKE_CONFIG;
    const singleShakeDuration = DURATION / (ITERATIONS * 2);

    // Haptic feedback
    scheduleOnRN(Haptics.impactAsync, Haptics.ImpactFeedbackStyle.Medium);

    // Shake back and forth
    for (let i = 0; i < ITERATIONS; i++) {
      translateX.value = withTiming(
        i % 2 === 0 ? AMPLITUDE : -AMPLITUDE,
        { duration: singleShakeDuration, easing: SHARED_EASINGS.sharp }
      );
    }

    // Return to center
    translateX.value = withTiming(
      0,
      { duration: singleShakeDuration, easing: SHARED_EASINGS.sharp },
      (finished) => {
        if (finished && callbacks?.onComplete) {
          scheduleOnRN(callbacks.onComplete);
        }
      }
    );
  }
}

// Export singleton instance
export const animationService = AnimationService.getInstance();