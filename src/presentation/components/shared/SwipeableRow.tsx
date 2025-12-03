import React, { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

interface SwipeableRowProps {
  children: ReactNode;
  renderActions: () => ReactNode;
  actionsWidth?: number;
  onSwipeableWillOpen?: () => void;
  onSwipeableWillClose?: () => void;
}

const SWIPE_THRESHOLD = -80;
const SPRING_CONFIG = {
  damping: 20,
  stiffness: 200,
};

export function SwipeableRow({children, renderActions, actionsWidth = 150, onSwipeableWillOpen, onSwipeableWillClose}: SwipeableRowProps) {
  const translateX = useSharedValue(0);
  const isOpen = useSharedValue(false);

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      const newTranslateX = event.translationX;
      
      // Only allow swiping left (negative values)
      if (newTranslateX < 0) {
        translateX.value = Math.max(newTranslateX, -actionsWidth);
      } else if (isOpen.value) {
        // Allow closing gesture when already open
        translateX.value = Math.max(-actionsWidth + newTranslateX, -actionsWidth);
      }
    })
    .onEnd(() => {
      if (translateX.value < SWIPE_THRESHOLD) {
        // Open actions
        translateX.value = withSpring(-actionsWidth, SPRING_CONFIG);
        if (!isOpen.value && onSwipeableWillOpen) {
          scheduleOnRN(onSwipeableWillOpen);
        }
        isOpen.value = true;
      } else {
        // Close actions
        translateX.value = withSpring(0, SPRING_CONFIG);
        if (isOpen.value && onSwipeableWillClose) {
          scheduleOnRN(onSwipeableWillClose);
        }
        isOpen.value = false;
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const actionsStyle = useAnimatedStyle(() => ({
    opacity: withTiming(isOpen.value ? 1 : 0, { duration: 200 }),
  }));

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.actionsContainer, actionsStyle, { width: actionsWidth }]}>
        {renderActions()}
      </Animated.View>
      
      <GestureDetector gesture={panGesture}>
        <Animated.View style={[styles.content, animatedStyle]}>
          {children}
        </Animated.View>
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    overflow: 'hidden',
  },
  actionsContainer: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  content: {
    backgroundColor: '#FFFFFF',
  },
});