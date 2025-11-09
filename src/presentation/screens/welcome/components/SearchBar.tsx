import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { BRAND_COLORS } from '../../../theme/colors';

export function SearchBar() {
  const router = useRouter();

  const handleSearchPress = () => {
    router.push('../(tabs)/search');
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handleSearchPress} activeOpacity={0.8}>
      <Text style={styles.icon}>🔍</Text>
      <Text style={styles.placeholder}>Tìm kiếm</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: BRAND_COLORS.background.white,
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  icon: {
    fontSize: 20,
  },
  placeholder: {
    fontSize: 16,
    fontFamily: 'SpaceGrotesk-Medium',
    color: '#999999',
  },
});