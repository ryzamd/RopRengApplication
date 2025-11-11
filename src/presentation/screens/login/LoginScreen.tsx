import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import Animated from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { login } from '../../../state/slices/auth';
import { useAppDispatch } from '../../../utils/hooks';
import { useModalFadeAnimation } from '../../hooks/animations';
import { BRAND_COLORS } from '../../theme/colors';
import { PhoneInput } from './components/PhoneInput';
import { SocialButton } from './components/SocialButton';
import { LOGIN_CONSTANTS } from './constants';

export default function LoginScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [phoneNumber, setPhoneNumber] = useState('');

  // Use FADE animation cho login
  const { animatedModalStyle, animatedBackdropStyle, dismiss } = useModalFadeAnimation({
    onExitComplete: () => router.back(),
  });

  const isValidPhone = /^\d{10}$/.test(phoneNumber);

  const handleLogin = () => {
    if (isValidPhone) {
      dispatch(login({
        phoneNumber: `+84${phoneNumber}`,
        userId: `user_${Date.now()}`,
      }));
      
      dismiss();
      setTimeout(() => router.replace('/(tabs)'), 200);
    }
  };

  return (
    <View style={styles.container}>
      {/* Backdrop */}
      <Animated.View style={[styles.backdrop, animatedBackdropStyle]}>
        <TouchableWithoutFeedback onPress={dismiss}>
          <View style={styles.backdropTouchable} />
        </TouchableWithoutFeedback>
      </Animated.View>

      {/* Modal with FADE animation */}
      <Animated.View style={[styles.modalWrapper, animatedModalStyle]}>
        <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={styles.closeContainer}>
              <TouchableOpacity
                style={styles.closeButtonWrapper}
                onPress={dismiss}
                activeOpacity={0.7}
              >
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.heroContainer}>
              <Text style={styles.heroPlaceholder}>
                {LOGIN_CONSTANTS.IMAGE_PLACEHOLDER}
              </Text>
            </View>

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
                onPress={() => console.log('Facebook')}
              />
              <SocialButton
                provider="google"
                label={LOGIN_CONSTANTS.GOOGLE_LOGIN}
                onPress={() => console.log('Google')}
              />
            </View>
          </ScrollView>
        </SafeAreaView>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  backdropTouchable: {
    flex: 1,
  },
  modalWrapper: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: BRAND_COLORS.background.white,
  },
  safeArea: {
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
  closeButtonWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginTop: 12,
    backgroundColor: 'rgba(96, 106, 55, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    fontSize: 14,
    marginBottom: 2,
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
    marginBottom: 20,
    letterSpacing: 1,
  },
  divider: {
    fontSize: 12,
    fontFamily: 'SpaceGrotesk-Medium',
    color: '#999999',
    textAlign: 'center',
    marginVertical: 20,
  },
});