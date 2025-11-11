import { EasingFunction, EasingFunctionFactory } from 'react-native-reanimated';

/* Base animation configuration */
export interface AnimationConfig {
  duration: number;
  easing?: EasingFunction | EasingFunctionFactory;
}

/* Animation với enter/exit states */
export interface TransitionAnimationConfig {
  enter: AnimationConfig;
  exit: AnimationConfig;
}

/* Callbacks cho animation lifecycle */
export interface AnimationCallbacks {
  onStart?: () => void;
  onComplete?: () => void;
}

/* Animation directions */
export enum AnimationDirection {
  UP = 'up',
  DOWN = 'down',
  LEFT = 'left',
  RIGHT = 'right',
}

/* Modal animation types */
export enum ModalAnimationType {
  SLIDE_FROM_BOTTOM = 'slide_from_bottom',
  SLIDE_FROM_TOP = 'slide_from_top',
  FADE = 'fade',
  SCALE = 'scale',
}

/* Page transition types */
export enum PageTransitionType {
  SLIDE_FROM_RIGHT = 'slide_from_right',
  SLIDE_FROM_LEFT = 'slide_from_left',
  FADE = 'fade',
  PUSH = 'push',
}