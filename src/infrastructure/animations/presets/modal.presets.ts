import { TransitionAnimationConfig } from '../core/animation.types';
import { SHARED_EASINGS, ANIMATION_DURATIONS } from './shared.presets';

/*
   Modal animation presets
 
   Naming convention:
   - MODAL_[TYPE]_[DIRECTION]
 */
export const MODAL_ANIMATION_PRESETS = {
  /* Slide from bottom (iOS default modal) */
  MODAL_SLIDE_BOTTOM: {
    enter: {
      duration: ANIMATION_DURATIONS.normal,
      easing: SHARED_EASINGS.decelerate,
    },
    exit: {
      duration: ANIMATION_DURATIONS.normal,
      easing: SHARED_EASINGS.accelerate,
    },
  } satisfies TransitionAnimationConfig,

  /* Slide from top (notifications, alerts) */
  MODAL_SLIDE_TOP: {
    enter: {
      duration: ANIMATION_DURATIONS.fast,
      easing: SHARED_EASINGS.decelerate,
    },
    exit: {
      duration: ANIMATION_DURATIONS.fast,
      easing: SHARED_EASINGS.accelerate,
    },
  } satisfies TransitionAnimationConfig,

  /* Fade in/out (overlays, tooltips) */
  MODAL_FADE: {
    enter: {
      duration: ANIMATION_DURATIONS.fast,
      easing: SHARED_EASINGS.linear,
    },
    exit: {
      duration: ANIMATION_DURATIONS.fast,
      easing: SHARED_EASINGS.linear,
    },
  } satisfies TransitionAnimationConfig,

  /* Scale from center (dialog, popup) */
  MODAL_SCALE: {
    enter: {
      duration: ANIMATION_DURATIONS.normal,
      easing: SHARED_EASINGS.standard,
    },
    exit: {
      duration: ANIMATION_DURATIONS.fast,
      easing: SHARED_EASINGS.accelerate,
    },
  } satisfies TransitionAnimationConfig,

   MODAL_BOTTOM_SHEET: {
    enter: {
      duration: ANIMATION_DURATIONS.normal,
      easing: SHARED_EASINGS.decelerate,
    },
    exit: {
      duration: ANIMATION_DURATIONS.normal,
      easing: SHARED_EASINGS.accelerate,
    },
    // Layout config
    layout: {
      heightPercentage: 0.9, // 90% of screen
      borderRadius: 20,      // Rounded top corners
    },
  } satisfies TransitionAnimationConfig & { layout: { heightPercentage: number; borderRadius: number } },
} as const;

/* Modal layout dimensions */
export const MODAL_LAYOUT_CONFIGS = {
  FULL_SCREEN: {
    heightPercentage: 1.0,
    borderRadius: 0,
  },
  BOTTOM_SHEET_90: {
    heightPercentage: 0.9,
    borderRadius: 20,
  },
  BOTTOM_SHEET_80: {
    heightPercentage: 0.8,
    borderRadius: 20,
  },
  BOTTOM_SHEET_70: {
    heightPercentage: 0.7,
    borderRadius: 20,
  },
} as const;
