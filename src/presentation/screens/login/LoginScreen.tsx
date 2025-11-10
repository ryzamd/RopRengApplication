import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppDispatch } from '../../../utils/hooks';
import { login } from '../../../state/slices/auth';
import { BRAND_COLORS } from '../../theme/colors';
import { PhoneInput } from './components/PhoneInput';
import { SocialButton } from './components/SocialButton';
import { LOGIN_CONSTANTS } from './constants';

export default function LoginScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [phoneNumber, setPhoneNumber] = useState('');

  const isValidPhone = /^\d{10}$/.test(phoneNumber);

  const handleLogin = () => {
    if (isValidPhone) {
      // TODO: Call real auth API
      // Mock login
      dispatch(login({
        phoneNumber: `+84${phoneNumber}`,
        userId: `user_${Date.now()}`,
      }));
      
      // Navigate to authenticated home
      router.replace('/(tabs)');
    }
  };

  const handleFacebookLogin = () => {
    console.log('Facebook login clicked');
    // TODO: Implement Facebook OAuth
    // On success: dispatch(login({...})) and router.replace
  };

  const handleGoogleLogin = () => {
    console.log('Google login clicked');
    // TODO: Implement Google OAuth
    // On success: dispatch(login({...})) and router.replace
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Close button to go back to guest mode */}
        <View style={styles.closeContainer}>
          <Text 
            style={styles.closeButton}
            onPress={() => router.back()}
          >
            ✕
          </Text>
        </View>

        {/* Hero Image Placeholder */}
        <View style={styles.heroContainer}>
          <Text style={styles.heroPlaceholder}>
            {LOGIN_CONSTANTS.IMAGE_PLACEHOLDER}
          </Text>
        </View>

        {/* Login Form */}
        <View style={styles.formContainer}>
          <Text style={styles.welcomeText}>{LOGIN_CONSTANTS.WELCOME_TEXT}</Text>
          <Text style={styles.brandName}>{LOGIN_CONSTANTS.BRAND_NAME}</Text>

          <PhoneInput
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            onSubmit={handleLogin}
            isValid={isValidPhone}
          />

          <Text style={styles.divider}>{LOGIN_CONSTANTS.DIVIDER_TEXT}</Text>

          <SocialButton
            provider="facebook"
            label={LOGIN_CONSTANTS.FACEBOOK_LOGIN}
            onPress={handleFacebookLogin}
          />
          <SocialButton
            provider="google"
            label={LOGIN_CONSTANTS.GOOGLE_LOGIN}
            onPress={handleGoogleLogin}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BRAND_COLORS.background.white,
  },
  scrollContent: {
    flexGrow: 1,
  },
  closeContainer: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 10,
  },
  closeButton: {
    fontSize: 24,
    color: BRAND_COLORS.primary.xanhReu,
    fontFamily: 'SpaceGrotesk-Bold',
  },
  heroContainer: {
    height: 280,
    backgroundColor: BRAND_COLORS.primary.beSua,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroPlaceholder: {
    fontSize: 16,
    fontFamily: 'SpaceGrotesk-Medium',
    color: BRAND_COLORS.primary.xanhReu,
    textAlign: 'center',
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  welcomeText: {
    fontSize: 16,
    fontFamily: 'SpaceGrotesk-Medium',
    color: BRAND_COLORS.primary.xanhReu,
    textAlign: 'center',
    marginBottom: 8,
  },
  brandName: {
    fontSize: 28,
    fontFamily: 'Phudu-Bold',
    color: BRAND_COLORS.primary.xanhReu,
    textAlign: 'center',
    marginBottom: 40,
    letterSpacing: 1,
  },
  divider: {
    fontSize: 14,
    fontFamily: 'SpaceGrotesk-Medium',
    color: '#999999',
    textAlign: 'center',
    marginVertical: 24,
  },
});