import { TransitionAnimationConfig } from '../core/animation.types';
import { ANIMATION_DURATIONS, SHARED_EASINGS } from './shared.presets';

export const SHAKE_ANIMATION_PRESETS = {
  /**
   * Shake animation for input errors
   */
  SHAKE_ERROR: {
    enter: {
      duration: ANIMATION_DURATIONS.fast,
      easing: SHARED_EASINGS.sharp,
    },
    exit: {
      duration: ANIMATION_DURATIONS.fast,
      easing: SHARED_EASINGS.sharp,
    },
  } satisfies TransitionAnimationConfig,
} as const;

export const SHAKE_CONFIG = {
  AMPLITUDE: 10,
  ITERATIONS: 3,
  DURATION: 500,
} as const;