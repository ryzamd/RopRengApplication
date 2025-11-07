import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { BRAND_COLORS } from '../../../theme/colors';
import { WELCOME_CONSTANTS } from '../constants';

export function BrandSelector() {
  const handleBrandPress = (brandId: string, brandName: string) => {
    console.log(`Clicked: ${brandName} (${brandId})`);
  };

  return (
    <View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {WELCOME_CONSTANTS.BRAND_SECTION.BRANDS.map((brand) => (
          <TouchableOpacity
            key={brand.id}
            style={styles.brandCard}
            onPress={() => handleBrandPress(brand.id, brand.name)}
          >
            <View style={styles.brandPlaceholder}>
              <Text style={styles.brandPlaceholderText}>{brand.name}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingRight: 16,
    gap: 12,
  },
  brandCard: {
    width: 140,
    height: 140,
    backgroundColor: BRAND_COLORS.background.white,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  brandPlaceholder: {
    flex: 1,
    backgroundColor: BRAND_COLORS.primary.beSua,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  brandPlaceholderText: {
    fontSize: 14,
    fontFamily: 'Phudu-Bold',
    color: BRAND_COLORS.primary.xanhReu,
    textAlign: 'center',
  },
});