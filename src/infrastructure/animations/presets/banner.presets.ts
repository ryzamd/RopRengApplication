import { ANIMATION_DURATIONS, SHARED_EASINGS } from './shared.presets';

export const BANNER_ANIMATION_PRESETS = {
  /**
   * Auto-scroll banner animation
   */
  BANNER_AUTO_SCROLL: {
    duration: ANIMATION_DURATIONS.normal,
    easing: SHARED_EASINGS.standard,
  },

  /**
   * Pagination dot expansion animation
   */
  BANNER_DOT_EXPAND: {
    duration: ANIMATION_DURATIONS.fast,
    easing: SHARED_EASINGS.standard,
  },

  /**
   * Pagination dot color transition animation (smooth fade)
   */
  BANNER_DOT_COLOR_TRANSITION: {
    duration: ANIMATION_DURATIONS.fast,
    easing: SHARED_EASINGS.standard,
  },
} as const;