import { Easing } from 'react-native-reanimated';

/* Shared easing functions cho consistency */
export const SHARED_EASINGS = {
  // Smooth & natural
  standard: Easing.bezier(0.4, 0.0, 0.2, 1),
  
  // Entrance animations
  decelerate: Easing.out(Easing.cubic),
  
  // Exit animations
  accelerate: Easing.in(Easing.cubic),
  
  // Sharp movements
  sharp: Easing.bezier(0.4, 0.0, 0.6, 1),
  
  // Linear
  linear: Easing.linear,
} as const;

/* Standard durations theo Material Design */
export const ANIMATION_DURATIONS = {
  fastest: 100,
  fast: 200,
  normal: 300,
  slow: 400,
  slowest: 500,
} as const;