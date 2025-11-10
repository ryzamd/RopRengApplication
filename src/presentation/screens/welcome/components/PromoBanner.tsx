import React, { useRef, useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BRAND_COLORS } from '../../../theme/colors';
import { WELCOME_CONSTANTS } from '../constants';

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
    <View>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        contentContainerStyle={styles.scrollContent}
      >
        {WELCOME_CONSTANTS.PROMOS.map((promo) => (
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
          </TouchableOpacity>
        ))}
      </ScrollView>
      
      <View style={styles.pagination}>
        {WELCOME_CONSTANTS.PROMOS.map((_, index) => (
          <View
            key={index}
            style={[
              styles.paginationDot,
              index === activeIndex && styles.paginationDotActive,
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingRight: 0,
    paddingLeft: 0,
  },
  banner: {
    borderRadius: 16,
    padding: 20,
    minHeight: 120,
    justifyContent: 'center',
  },
  bannerContent: {
    gap: 8,
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
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#D9D9D9',
  },
  paginationDotActive: {
    width: 24,
    backgroundColor: BRAND_COLORS.secondary.nauEspresso,
  },
});