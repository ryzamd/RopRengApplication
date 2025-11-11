import { TransitionAnimationConfig } from '../core/animation.types';
import { SHARED_EASINGS, ANIMATION_DURATIONS } from './shared.presets';

/*
  Page transition animation presets
  Naming convention:
  - PAGE_[TYPE]_[DIRECTION]
*/
export const PAGE_ANIMATION_PRESETS = {
  /* Slide from right (iOS default push) */
  PAGE_SLIDE_RIGHT: {
    enter: {
      duration: ANIMATION_DURATIONS.normal,
      easing: SHARED_EASINGS.standard,
    },
    exit: {
      duration: ANIMATION_DURATIONS.normal,
      easing: SHARED_EASINGS.standard,
    },
  } satisfies TransitionAnimationConfig,

  /* Slide from left (back navigation) */
  PAGE_SLIDE_LEFT: {
    enter: {
      duration: ANIMATION_DURATIONS.normal,
      easing: SHARED_EASINGS.standard,
    },
    exit: {
      duration: ANIMATION_DURATIONS.normal,
      easing: SHARED_EASINGS.standard,
    },
  } satisfies TransitionAnimationConfig,

  /* Fade transition (cross-fade) */
  PAGE_FADE: {
    enter: {
      duration: ANIMATION_DURATIONS.normal,
      easing: SHARED_EASINGS.linear,
    },
    exit: {
      duration: ANIMATION_DURATIONS.normal,
      easing: SHARED_EASINGS.linear,
    },
  } satisfies TransitionAnimationConfig,

  /* Push down (hierarchical navigation) */
  PAGE_PUSH_DOWN: {
    enter: {
      duration: ANIMATION_DURATIONS.slow,
      easing: SHARED_EASINGS.decelerate,
    },
    exit: {
      duration: ANIMATION_DURATIONS.slow,
      easing: SHARED_EASINGS.accelerate,
    },
  } satisfies TransitionAnimationConfig,
} as const;