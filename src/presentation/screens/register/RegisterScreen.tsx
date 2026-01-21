import { Ionicons } from '@expo/vector-icons';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { clearError, loginWithOtp, registerUser } from '../../../state/slices/authSlice';
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
  const otpModalRef = useRef<OtpVerificationRef>(null);

  const handleGoBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)');
    }
  };

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

  const isValidPhone = RegisterUIService.validatePhoneNumber(phoneNumber);

  const handleRegister = async () => {
    if (isValidPhone && !isLoading) {
      await dispatch(registerUser({ phone: phoneNumber }));
    }
  };

  const handleNavigateToLogin = () => {
    router.replace('/(auth)/login');
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
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleGoBack}
            activeOpacity={0.7}
          >
            <Ionicons
              name="arrow-back"
              size={24}
              color={BRAND_COLORS.primary.xanhReu}
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{REGISTER_TEXT.HEADER_TITLE}</Text>
          <View style={styles.headerRight} />
        </View>

        <KeyboardAvoidingView
          style={styles.keyboardAvoid}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.titleSection}>
              <Text style={styles.welcomeText}>
                {REGISTER_TEXT.WELCOME_TEXT}
              </Text>
              <Text style={styles.brandName}>{REGISTER_TEXT.BRAND_NAME}</Text>
              <Text style={styles.subtitle}>{REGISTER_TEXT.SUBTITLE}</Text>
            </View>

            {/* Form Section */}
            <View style={styles.formContainer}>
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
        </KeyboardAvoidingView>

        <OtpVerificationBottomSheet
          ref={otpModalRef}
          phoneNumber={phoneNumber}
          onVerifyOtp={handleVerifyOtp}
          onSuccess={handleOtpSuccess}
        />
      </SafeAreaView>
    </BottomSheetModalProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BRAND_COLORS.background.default,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: REGISTER_LAYOUT.HEADER_PADDING_HORIZONTAL,
    paddingVertical: REGISTER_LAYOUT.HEADER_PADDING_VERTICAL,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    width: REGISTER_LAYOUT.BACK_BUTTON_SIZE,
    height: REGISTER_LAYOUT.BACK_BUTTON_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: REGISTER_LAYOUT.HEADER_TITLE_FONT_SIZE,
    fontFamily: 'Phudu-Bold',
    color: BRAND_COLORS.primary.xanhReu,
  },
  headerRight: {
    width: REGISTER_LAYOUT.BACK_BUTTON_SIZE,
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: REGISTER_LAYOUT.FORM_PADDING_HORIZONTAL,
  },
  titleSection: {
    alignItems: 'center',
    paddingTop: REGISTER_LAYOUT.TITLE_SECTION_PADDING_TOP,
    paddingBottom: REGISTER_LAYOUT.TITLE_SECTION_PADDING_BOTTOM,
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
  subtitle: {
    fontSize: REGISTER_LAYOUT.SUBTITLE_FONT_SIZE,
    fontFamily: 'SpaceGrotesk-Medium',
    color: '#666666',
    textAlign: 'center',
  },
  formContainer: {
    flex: 1,
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