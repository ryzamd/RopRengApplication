import React, { useRef, useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { BANNER_ANIMATION_PRESETS } from '../../../../infrastructure/animations/presets/banner.presets';
import { BRAND_COLORS } from '../../../theme/colors';
import { WELCOME_TEXT } from '../WelcomeConstants';
import { WELCOME_LAYOUT } from '../WelcomeLayout';

const { width } = Dimensions.get('window');
const BANNER_WIDTH = width - 32;

export function PromoBanner() {
  const scrollRef = useRef<ScrollView>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = (event: any) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / BANNER_WIDTH);
    setActiveIndex(index);
  };

  const handleBannerPress = (promoId: string) => {
    console.log(`Clicked: Promo ${promoId}`);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
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
  const width = useSharedValue(WELCOME_LAYOUT.PROMO_DOT_INACTIVE_WIDTH);

  React.useEffect(() => {
    width.value = withTiming(
      isActive ? WELCOME_LAYOUT.PROMO_DOT_ACTIVE_WIDTH : WELCOME_LAYOUT.PROMO_DOT_INACTIVE_WIDTH,
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
    borderRadius: WELCOME_LAYOUT.PROMO_BANNER_BORDER_RADIUS,
    padding: WELCOME_LAYOUT.PROMO_BANNER_PADDING,
    minHeight: WELCOME_LAYOUT.PROMO_BANNER_MIN_HEIGHT,
    justifyContent: 'center',
    position: 'relative',
  },
  bannerContent: {
    gap: WELCOME_LAYOUT.PROMO_BANNER_GAP,
    marginBottom: 20,
  },
  bannerTitle: {
    fontSize: WELCOME_LAYOUT.PROMO_BANNER_TITLE_SIZE,
    fontFamily: 'Phudu-Bold',
    color: BRAND_COLORS.primary.xanhReu,
  },
  bannerSubtitle: {
    fontSize: WELCOME_LAYOUT.PROMO_BANNER_SUBTITLE_SIZE,
    fontFamily: 'SpaceGrotesk-Medium',
    color: BRAND_COLORS.primary.xanhReu,
    lineHeight: WELCOME_LAYOUT.PROMO_BANNER_SUBTITLE_LINE_HEIGHT,
  },
  pagination: {
    position: 'absolute',
    bottom: WELCOME_LAYOUT.PROMO_DOT_BOTTOM,
    left: WELCOME_LAYOUT.PROMO_DOT_CONTAINER_PADDING_HORIZONTAL,
    right: WELCOME_LAYOUT.PROMO_DOT_CONTAINER_PADDING_HORIZONTAL,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: WELCOME_LAYOUT.PROMO_DOT_GAP,
  },
  paginationDot: {
    height: WELCOME_LAYOUT.PROMO_DOT_HEIGHT,
    borderRadius: WELCOME_LAYOUT.PROMO_DOT_BORDER_RADIUS,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  paginationDotActive: {
    backgroundColor: BRAND_COLORS.background.white,
  },
});