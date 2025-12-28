import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { scheduleOnRN } from 'react-native-worklets';
import { clearError, loginWithOtp, registerUser } from '../../../state/slices/auth';
import { useAppDispatch, useAppSelector } from '../../../utils/hooks';
import { BRAND_COLORS } from '../../theme/colors';
import { OtpVerificationBottomSheet, OtpVerificationRef } from '../otp-verification/OtpVerificationBottomSheet';
import { RegisterPhoneInput } from './components/RegisterPhoneInput';
import { REGISTER_TEXT } from './RegisterConstants';
import { REGISTER_LAYOUT } from './RegisterLayout';
import { RegisterUIService } from './RegisterService';

export default function RegisterScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isLoading, error, otpSent, otpPhone } = useAppSelector(
    (state) => state.auth
  );

  const [phoneNumber, setPhoneNumber] = useState('');
  const [pendingOtp, setPendingOtp] = useState<string | null>(null);
  const otpModalRef = useRef<OtpVerificationRef>(null);

  const opacity = useSharedValue(0);
  const contentScale = useSharedValue(0.95);

  const startEntranceAnimation = useCallback(() => {
    opacity.value = withTiming(1, { duration: 300 });
    contentScale.value = withTiming(1, { duration: 300 });
  }, [contentScale, opacity]);

  const handleDismiss = useCallback(() => {
    opacity.value = withTiming(0, { duration: 200 }, (finished) => {
      if (finished) {
        scheduleOnRN(router.back);
      }
    });
    contentScale.value = withTiming(0.95, { duration: 200 });
  }, [router, contentScale, opacity]);

  useEffect(() => {
    startEntranceAnimation();
  }, [startEntranceAnimation]);

  // Handle error from Redux
  useEffect(() => {
    if (error) {
      if (RegisterUIService.isPhoneExistedError(error)) {
        Alert.alert(
          REGISTER_TEXT.PHONE_EXISTED_TITLE,
          REGISTER_TEXT.PHONE_EXISTED_MESSAGE,
          [
            {
              text: REGISTER_TEXT.PHONE_EXISTED_OK,
              onPress: () => {
                dispatch(clearError());
              },
            },
          ]
        );
      } else {
        Alert.alert('Lỗi', error, [
          {
            text: 'OK',
            onPress: () => {
              dispatch(clearError());
            },
          },
        ]);
      }
    }
  }, [error, dispatch]);

  // Handle OTP sent success
  useEffect(() => {
    if (otpSent && otpPhone === phoneNumber) {
      otpModalRef.current?.present();
    }
  }, [otpSent, otpPhone, phoneNumber]);

  const animatedBackdropStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const animatedModalStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: contentScale.value }],
  }));

  const isValidPhone = RegisterUIService.validatePhoneNumber(phoneNumber);

  const handleRegister = async () => {
    if (isValidPhone && !isLoading) {
      await dispatch(registerUser({ phone: phoneNumber }));
    }
  };

  const handleNavigateToLogin = () => {
    router.replace('../(auth)/login');
  };

  // Custom verify function for OTP - calls /auth/login after OTP verification
  const handleVerifyOtp = async (
    phone: string,
    otp: string
  ): Promise<boolean> => {
    const result = await dispatch(loginWithOtp({ phone, otp }));
    return !loginWithOtp.rejected.match(result);
  };

  // Handle OTP verification success - navigate to home without pending intent
  const handleOtpSuccess = () => {
    router.dismissAll();
    router.replace('/(tabs)');
  };

  return (
    <BottomSheetModalProvider>
      <View style={styles.container}>
        {/* Backdrop */}
        <Animated.View style={[styles.backdrop, animatedBackdropStyle]}>
          <TouchableWithoutFeedback onPress={handleDismiss}>
            <View style={styles.backdropTouchable} />
          </TouchableWithoutFeedback>
        </Animated.View>

        {/* Modal Content */}
        <Animated.View style={[styles.modalWrapper, animatedModalStyle]}>
          <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
              <View style={styles.closeContainer}>
                <TouchableOpacity
                  style={styles.closeButtonWrapper}
                  onPress={handleDismiss}
                  activeOpacity={0.7}
                >
                  <Text style={styles.closeButton}>
                    {REGISTER_TEXT.CLOSE_BUTTON}
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.heroContainer}>
                <Text style={styles.heroPlaceholder}>
                  {REGISTER_TEXT.IMAGE_PLACEHOLDER}
                </Text>
              </View>

              <View style={styles.formContainer}>
                <Text style={styles.welcomeText}>
                  {REGISTER_TEXT.WELCOME_TEXT}
                </Text>
                <Text style={styles.brandName}>{REGISTER_TEXT.BRAND_NAME}</Text>

                <RegisterPhoneInput
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                  onSubmit={handleRegister}
                  isValid={isValidPhone}
                  isLoading={isLoading}
                  autoFocusDelay={REGISTER_LAYOUT.KEYBOARD_FOCUS_DELAY}
                />

                {/* Login Link */}
                <View style={styles.loginLinkContainer}>
                  <Text style={styles.hasAccountText}>
                    {REGISTER_TEXT.HAS_ACCOUNT}
                  </Text>
                  <TouchableOpacity
                    onPress={handleNavigateToLogin}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.loginLinkText}>
                      {REGISTER_TEXT.LOGIN_LINK}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </SafeAreaView>
        </Animated.View>

        <OtpVerificationBottomSheet
          ref={otpModalRef}
          phoneNumber={phoneNumber}
          onVerifyOtp={handleVerifyOtp}
          onSuccess={handleOtpSuccess}
        />
      </View>
    </BottomSheetModalProvider>
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
    flex: 1,
    backgroundColor: BRAND_COLORS.background.default,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: 50,
    overflow: 'hidden',
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  closeContainer: {
    position: 'absolute',
    top: REGISTER_LAYOUT.CLOSE_BUTTON_TOP,
    right: REGISTER_LAYOUT.CLOSE_BUTTON_RIGHT,
    zIndex: 10,
  },
  closeButtonWrapper: {
    width: REGISTER_LAYOUT.CLOSE_BUTTON_SIZE,
    height: REGISTER_LAYOUT.CLOSE_BUTTON_SIZE,
    borderRadius: REGISTER_LAYOUT.CLOSE_BUTTON_BORDER_RADIUS,
    backgroundColor: 'rgba(96, 106, 55, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    fontSize: REGISTER_LAYOUT.CLOSE_BUTTON_FONT_SIZE,
    color: BRAND_COLORS.primary.xanhReu,
    fontFamily: 'SpaceGrotesk-Bold',
  },
  heroContainer: {
    height: REGISTER_LAYOUT.HERO_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: BRAND_COLORS.primary.beSua,
  },
  heroPlaceholder: {
    fontSize: REGISTER_LAYOUT.HERO_FONT_SIZE,
    fontFamily: 'SpaceGrotesk-Medium',
    color: BRAND_COLORS.primary.xanhReu,
    textAlign: 'center',
  },
  formContainer: {
    paddingHorizontal: REGISTER_LAYOUT.FORM_PADDING_HORIZONTAL,
    paddingTop: REGISTER_LAYOUT.FORM_PADDING_TOP,
  },
  welcomeText: {
    fontSize: REGISTER_LAYOUT.WELCOME_FONT_SIZE,
    fontFamily: 'SpaceGrotesk-Medium',
    color: BRAND_COLORS.primary.xanhReu,
    textAlign: 'center',
    marginBottom: REGISTER_LAYOUT.WELCOME_MARGIN_BOTTOM,
  },
  brandName: {
    fontSize: REGISTER_LAYOUT.BRAND_NAME_FONT_SIZE,
    fontFamily: 'Phudu-Bold',
    color: BRAND_COLORS.primary.xanhReu,
    textAlign: 'center',
    marginBottom: REGISTER_LAYOUT.BRAND_NAME_MARGIN_BOTTOM,
  },
  loginLinkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: REGISTER_LAYOUT.LINK_MARGIN_TOP,
    gap: 4,
  },
  hasAccountText: {
    fontSize: REGISTER_LAYOUT.LINK_FONT_SIZE,
    fontFamily: 'SpaceGrotesk-Medium',
    color: BRAND_COLORS.primary.xanhReu,
  },
  loginLinkText: {
    fontSize: REGISTER_LAYOUT.LINK_FONT_SIZE,
    fontFamily: 'SpaceGrotesk-Bold',
    color: BRAND_COLORS.primary.xanhReu,
    textDecorationLine: 'underline',
  },
});