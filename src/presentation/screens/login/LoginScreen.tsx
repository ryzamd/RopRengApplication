import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { login } from '../../../state/slices/auth';
import { useAppDispatch } from '../../../utils/hooks';
import { useModalFadeAnimation } from '../../hooks/animations';
import { BRAND_COLORS } from '../../theme/colors';
import { PhoneInput } from './components/PhoneInput';
import { SocialButton } from './components/SocialButton';
import { LOGIN_TEXT } from './LoginConstants';
import { LoginProvider } from './LoginEnums';
import { LOGIN_LAYOUT } from './LoginLayout';
import { LoginUIService } from './LoginService';

export default function LoginScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [phoneNumber, setPhoneNumber] = useState('');

  const { animatedModalStyle, animatedBackdropStyle, dismiss } = useModalFadeAnimation({
    onExitComplete: () => router.back(),
  });

  const isValidPhone = LoginUIService.validatePhoneNumber(phoneNumber);

  const handleLogin = () => {
    if (isValidPhone) {
      const formattedPhone = LoginUIService.formatPhoneDisplay(phoneNumber);
      const userId = LoginUIService.generateUserId();

      dispatch(login({ phoneNumber: formattedPhone, userId }));
      
      dismiss();
      setTimeout(() => router.replace('/(tabs)'), 200);
    }
  };

  const handleSocialLogin = (provider: LoginProvider) => {
    LoginUIService.handleSocialLogin(provider);
  };

  return (
    <View style={styles.container}>
      {/* Backdrop */}
      <Animated.View style={[styles.backdrop, animatedBackdropStyle]}>
        <TouchableWithoutFeedback onPress={dismiss}>
          <View style={styles.backdropTouchable} />
        </TouchableWithoutFeedback>
      </Animated.View>

      {/* Modal */}
      <Animated.View style={[styles.modalWrapper, animatedModalStyle]}>
        <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={styles.closeContainer}>
              <TouchableOpacity
                style={styles.closeButtonWrapper}
                onPress={dismiss}
                activeOpacity={0.7}
              >
                <Text style={styles.closeButton}>{LOGIN_TEXT.CLOSE_BUTTON}</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.heroContainer}>
              <Text style={styles.heroPlaceholder}>
                {LOGIN_TEXT.IMAGE_PLACEHOLDER}
              </Text>
            </View>

            <View style={styles.formContainer}>
              <Text style={styles.welcomeText}>{LOGIN_TEXT.WELCOME_TEXT}</Text>
              <Text style={styles.brandName}>{LOGIN_TEXT.BRAND_NAME}</Text>

              <PhoneInput
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                onSubmit={handleLogin}
                isValid={isValidPhone}
                autoFocusDelay={LOGIN_LAYOUT.KEYBOARD_FOCUS_DELAY}
              />

              <Text style={styles.divider}>{LOGIN_TEXT.DIVIDER_TEXT}</Text>

              <SocialButton
                provider={LoginProvider.FACEBOOK}
                label={LOGIN_TEXT.FACEBOOK_LOGIN}
                onPress={() => handleSocialLogin(LoginProvider.FACEBOOK)}
              />
              <SocialButton
                provider={LoginProvider.GOOGLE}
                label={LOGIN_TEXT.GOOGLE_LOGIN}
                onPress={() => handleSocialLogin(LoginProvider.GOOGLE)}
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
    top: LOGIN_LAYOUT.CLOSE_BUTTON_TOP,
    right: LOGIN_LAYOUT.CLOSE_BUTTON_RIGHT,
    zIndex: 10,
  },
  closeButtonWrapper: {
    width: LOGIN_LAYOUT.CLOSE_BUTTON_SIZE,
    height: LOGIN_LAYOUT.CLOSE_BUTTON_SIZE,
    borderRadius: LOGIN_LAYOUT.CLOSE_BUTTON_BORDER_RADIUS,
    marginTop: 12,
    backgroundColor: 'rgba(96, 106, 55, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    fontSize: LOGIN_LAYOUT.CLOSE_BUTTON_FONT_SIZE,
    marginBottom: 2,
    color: BRAND_COLORS.primary.xanhReu,
    fontFamily: 'SpaceGrotesk-Bold',
  },
  heroContainer: {
    height: LOGIN_LAYOUT.HERO_HEIGHT,
    backgroundColor: BRAND_COLORS.primary.beSua,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroPlaceholder: {
    fontSize: LOGIN_LAYOUT.HERO_FONT_SIZE,
    fontFamily: 'SpaceGrotesk-Medium',
    color: BRAND_COLORS.primary.xanhReu,
    textAlign: 'center',
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: LOGIN_LAYOUT.FORM_PADDING_HORIZONTAL,
    paddingTop: LOGIN_LAYOUT.FORM_PADDING_TOP,
  },
  welcomeText: {
    fontSize: LOGIN_LAYOUT.WELCOME_FONT_SIZE,
    fontFamily: 'SpaceGrotesk-Medium',
    color: BRAND_COLORS.primary.xanhReu,
    textAlign: 'center',
    marginBottom: LOGIN_LAYOUT.WELCOME_TEXT_MARGIN_BOTTOM,
  },
  brandName: {
    fontSize: LOGIN_LAYOUT.BRAND_NAME_FONT_SIZE,
    fontFamily: 'Phudu-Bold',
    color: BRAND_COLORS.primary.xanhReu,
    textAlign: 'center',
    marginBottom: LOGIN_LAYOUT.BRAND_NAME_MARGIN_BOTTOM,
    letterSpacing: LOGIN_LAYOUT.BRAND_NAME_LETTER_SPACING,
  },
  divider: {
    fontSize: LOGIN_LAYOUT.DIVIDER_FONT_SIZE,
    fontFamily: 'SpaceGrotesk-Medium',
    color: '#999999',
    textAlign: 'center',
    marginVertical: LOGIN_LAYOUT.DIVIDER_MARGIN_VERTICAL,
  },
});