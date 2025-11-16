import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { BANNER_ANIMATION_PRESETS } from '../../../../infrastructure/animations/presets/banner.presets';
import { BRAND_COLORS } from '../../../theme/colors';
import { WELCOME_TEXT } from '../../welcome/WelcomeConstants';
import { HOME_LAYOUT } from '../HomeLayout';

const { width } = Dimensions.get('window');
const BANNER_WIDTH = width - 32;

export function AuthenticatedPromoBanner() {
  const scrollRef = useRef<ScrollView>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isUserInteracting, setIsUserInteracting] = useState(false);

  const autoScrollTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const resumeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Auto-scroll logic
  useEffect(() => {
    if (isUserInteracting) return;

    autoScrollTimerRef.current = setInterval(() => {
      setActiveIndex((prev) => {
        const nextIndex = (prev + 1) % WELCOME_TEXT.PROMOS.length;
        scrollRef.current?.scrollTo({
          x: nextIndex * BANNER_WIDTH,
          animated: true,
        });
        return nextIndex;
      });
    }, HOME_LAYOUT.PROMO_AUTO_SWIPE_INTERVAL);

    return () => {
      if (autoScrollTimerRef.current) clearInterval(autoScrollTimerRef.current);
    };
  }, [isUserInteracting]);

  const handleScroll = (event: any) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / BANNER_WIDTH);
    setActiveIndex(index);
  };

  const handleScrollBeginDrag = () => {
    setIsUserInteracting(true);
    if (autoScrollTimerRef.current) clearInterval(autoScrollTimerRef.current);
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
  };

  const handleScrollEndDrag = () => {
    resumeTimerRef.current = setTimeout(() => {
      setIsUserInteracting(false);
    }, HOME_LAYOUT.PROMO_RESUME_DELAY);
  };

  const handleBannerPress = (promoId: string) => {
    console.log(`[AuthenticatedPromoBanner] Clicked: Promo ${promoId}`);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        onScrollBeginDrag={handleScrollBeginDrag}
        onScrollEndDrag={handleScrollEndDrag}
        scrollEventThrottle={16}
        contentContainerStyle={styles.scrollContent}
      >
        {WELCOME_TEXT.PROMOS.map((promo) => (
          <TouchableOpacity
            key={promo.id}
            style={[styles.banner, { backgroundColor: promo.backgroundColor, width: BANNER_WIDTH }]}
            onPress={() => handleBannerPress(promo.id)}
            activeOpacity={0.8}
          >
            <View style={styles.bannerContent}>
              <Text style={styles.bannerTitle}>{promo.title}</Text>
              <Text style={styles.bannerSubtitle}>{promo.subtitle}</Text>
            </View>

            {/* Pagination Dots (INSIDE banner) */}
            <View style={styles.pagination}>
              {WELCOME_TEXT.PROMOS.map((_, index) => (
                <PaginationDot key={index} isActive={index === activeIndex} index={index} />
              ))}
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

function PaginationDot({ isActive }: { isActive: boolean; index: number }) {
  const width = useSharedValue(HOME_LAYOUT.PROMO_DOT_INACTIVE_WIDTH);

  React.useEffect(() => {
    width.value = withTiming(
      isActive ? HOME_LAYOUT.PROMO_DOT_ACTIVE_WIDTH : HOME_LAYOUT.PROMO_DOT_INACTIVE_WIDTH,
      {
        duration: BANNER_ANIMATION_PRESETS.BANNER_DOT_EXPAND.duration,
        easing: BANNER_ANIMATION_PRESETS.BANNER_DOT_EXPAND.easing,
      }
    );
  }, [isActive]);

  const animatedStyle = useAnimatedStyle(() => ({
    width: width.value,
  }));

  return (
    <Animated.View
      style={[
        styles.paginationDot,
        isActive && styles.paginationDotActive,
        animatedStyle,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  scrollContent: {
    paddingRight: 0,
    paddingLeft: 0,
  },
  banner: {
    borderRadius: 16,
    padding: 20,
    minHeight: 120,
    justifyContent: 'center',
    position: 'relative',
  },
  bannerContent: {
    gap: 8,
    marginBottom: 20,
  },
  bannerTitle: {
    fontSize: 18,
    fontFamily: 'Phudu-Bold',
    color: BRAND_COLORS.primary.xanhReu,
  },
  bannerSubtitle: {
    fontSize: 14,
    fontFamily: 'SpaceGrotesk-Medium',
    color: BRAND_COLORS.primary.xanhReu,
    lineHeight: 20,
  },
  pagination: {
    position: 'absolute',
    bottom: HOME_LAYOUT.PROMO_DOT_BOTTOM,
    left: HOME_LAYOUT.PROMO_DOT_CONTAINER_PADDING_HORIZONTAL,
    right: HOME_LAYOUT.PROMO_DOT_CONTAINER_PADDING_HORIZONTAL,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: HOME_LAYOUT.PROMO_DOT_GAP,
  },
  paginationDot: {
    height: HOME_LAYOUT.PROMO_DOT_HEIGHT,
    borderRadius: HOME_LAYOUT.PROMO_DOT_BORDER_RADIUS,
    backgroundColor: 'rgba(22, 21, 21, 0.5)',
  },
  paginationDotActive: {
    backgroundColor: BRAND_COLORS.background.white,
  },
});