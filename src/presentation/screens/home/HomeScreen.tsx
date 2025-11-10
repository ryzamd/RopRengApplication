import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppDispatch, useAppSelector } from '../../../utils/hooks';
import { logout } from '../../../state/slices/auth';
import { BRAND_COLORS } from '../../theme/colors';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();
  const { phoneNumber } = useAppSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    // Navigation will auto-handle by root layout
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.greeting}>
          <Text style={styles.greetingIcon}>👋</Text>
          <View>
            <Text style={styles.greetingText}>Xin chào!</Text>
            <Text style={styles.phoneText}>{phoneNumber}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Đăng xuất</Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Trang chủ (Authenticated)</Text>
          <Text style={styles.sectionText}>
            Đây là trang chủ dành cho người dùng đã đăng nhập.{'\n\n'}
            TODO: Implement real home features
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BRAND_COLORS.background.default,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: BRAND_COLORS.background.default,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  greeting: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  greetingIcon: {
    fontSize: 32,
  },
  greetingText: {
    fontSize: 18,
    fontFamily: 'Phudu-Bold',
    color: BRAND_COLORS.primary.xanhReu,
  },
  phoneText: {
    fontSize: 12,
    fontFamily: 'SpaceGrotesk-Medium',
    color: '#666666',
    marginTop: 2,
  },
  logoutButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: BRAND_COLORS.secondary.nauEspresso,
    borderRadius: 8,
  },
  logoutText: {
    fontSize: 12,
    fontFamily: 'SpaceGrotesk-Bold',
    color: BRAND_COLORS.background.white,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  section: {
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontFamily: 'Phudu-Bold',
    color: BRAND_COLORS.primary.xanhReu,
    marginBottom: 16,
  },
  sectionText: {
    fontSize: 16,
    fontFamily: 'SpaceGrotesk-Medium',
    color: BRAND_COLORS.primary.xanhReu,
    lineHeight: 24,
  },
});