import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { BackHandler, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../hooks/useAuth';
import { useUI } from '../../hooks/useUI';
import { useModalBottomSheetAnimation, useShakeAnimation } from '../../hooks/animations';
import { BRAND_COLORS } from '../../theme/colors';
import { OtpInput } from './components/OtpInput';
import { OtpTimer } from './components/OtpTimer';
import { RetryButton } from './components/RetryButton';
import { OTP_CONFIG, OTP_TEXT } from './OtpVerificationConstants';
import { OtpVerificationStateEnum } from './OtpVerificationEnums';
import { OTP_LAYOUT } from './OtpVerificationLayout';
import { OtpVerificationService } from './OtpVerificationService';

export default function OtpVerificationScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ phoneNumber: string }>();
  const { verifyOTP, sendOTP, isLoading, clearError } = useAuth();
  const { showError } = useUI();

  const [digits, setDigits] = useState<string[]>(Array(OTP_CONFIG.CODE_LENGTH).fill(''));
  const [state, setState] = useState<OtpVerificationStateEnum>(OtpVerificationStateEnum.IDLE);
  const [timeRemaining, setTimeRemaining] = useState(OTP_CONFIG.TIMER_DURATION_SECONDS);
  const [hasClickedResendThisCycle, setHasClickedResendThisCycle] = useState(false);
  const [totalRetryCount, setTotalRetryCount] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Track navigation intent to prevent conflicting navigation commands
  const navigationIntentRef = React.useRef<'back' | 'success' | null>(null);

  // Bottom sheet animation
  const { modalHeight, animatedModalStyle, animatedBackdropStyle, dismiss } =
    useModalBottomSheetAnimation({
      heightPercentage: OTP_LAYOUT.MODAL_HEIGHT_PERCENTAGE,
      onExitComplete: () => {
        // Handle navigation based on intent
        if (navigationIntentRef.current === 'success') {
          // Success flow: Tabs already mounted and visible
          // Now cleanup login modal from stack underneath
          // Stack is: [index, login (modal), tabs (current)]
          // After dismissAll: [index, tabs (current)]
          router.dismissAll(); // Dismisses all modals (login) but keeps tabs
          navigationIntentRef.current = null;
        } else if (navigationIntentRef.current === 'back') {
          // Normal dismiss: just go back
          if (router.canGoBack()) {
            router.back();
          }
          navigationIntentRef.current = null;
        }
      },
    });

  // Shake animation for errors
  const { animatedStyle: shakeAnimatedStyle, shake } = useShakeAnimation();

  // Calculate derived state values
  const canClickResend = OtpVerificationService.canClickResend(timeRemaining, hasClickedResendThisCycle);
  const canShowRetryIcon = OtpVerificationService.canShowRetryIcon(timeRemaining, totalRetryCount);
  const isExpired = timeRemaining <= 0;
  const showMaxRetriesError = totalRetryCount >= OTP_CONFIG.MAX_RETRY_COUNT && isExpired;

  // Countdown timer with proper cleanup
  useEffect(() => {
    if (timeRemaining <= 0) {
      setState(OtpVerificationStateEnum.EXPIRED);
      setErrorMessage(OTP_TEXT.ERROR_EXPIRED);
      return;
    }

    const interval = setInterval(() => {
      setTimeRemaining((prev) => Math.max(0, prev - 1));
    }, 1000);

    // Cleanup interval on unmount or when dependencies change
    return () => clearInterval(interval);
  }, [timeRemaining]);

  // Android back button handler
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      // Prevent back during verification or if max retries reached
      if (state === OtpVerificationStateEnum.VERIFYING || showMaxRetriesError) {
        return true; // Prevent default back behavior
      }

      // Handle back press with animation
      navigationIntentRef.current = 'back';
      dismiss();
      return true; // Prevent default back behavior
    });

    return () => backHandler.remove();
  }, [state, showMaxRetriesError, dismiss]);

  const resetOtp = () => {
    setDigits(Array(OTP_CONFIG.CODE_LENGTH).fill(''));
    setTimeRemaining(OTP_CONFIG.TIMER_DURATION_SECONDS);
    setState(OtpVerificationStateEnum.IDLE);
    setErrorMessage(null);
    setHasClickedResendThisCycle(false); // Reset resend state for new cycle
  };

  const handleResendClick = async () => {
    if (!OtpVerificationService.canClickResend(timeRemaining, hasClickedResendThisCycle)) {
      return;
    }

    try {
      clearError();

      // Extract raw phone number (remove formatting)
      const rawPhone = (params.phoneNumber || '').replace(/\D/g, '');

      // Resend OTP using new architecture
      await sendOTP(rawPhone);

      setHasClickedResendThisCycle(true);
      setTotalRetryCount((prev) => prev + 1);
      setTimeRemaining(OTP_CONFIG.TIMER_DURATION_SECONDS);
      setState(OtpVerificationStateEnum.IDLE);
      setErrorMessage(null);
    } catch (error: any) {
      showError(error.message || 'Không thể gửi lại OTP. Vui lòng thử lại.');
    }
  };

  const handleRetryIconClick = () => {
    if (!OtpVerificationService.canShowRetryIcon(timeRemaining, totalRetryCount)) {
      return;
    }
    
    setTotalRetryCount((prev) => prev + 1);
    resetOtp();
  };

  const handleOtpComplete = async (code: string) => {
    if (state !== OtpVerificationStateEnum.IDLE || isLoading) {
      return;
    }

    setState(OtpVerificationStateEnum.VERIFYING);

    try {
      clearError();

      // Extract raw phone number (remove formatting)
      const rawPhone = (params.phoneNumber || '').replace(/\D/g, '');

      // Verify OTP using new architecture
      await verifyOTP(rawPhone, code);

      setState(OtpVerificationStateEnum.SUCCESS);

      // Option 1: Navigate BEFORE dismiss animation
      // Strategy: Mount tabs behind modal, then animate modal out
      // This ensures tabs are ready when modal disappears - zero void state

      // Step 1: Navigate immediately - tabs mount behind modal
      router.replace('/(tabs)');

      // Step 2: Start dismiss animation - modal slides down over tabs
      navigationIntentRef.current = 'success';
      dismiss(); // 300ms slide-out animation

      // Result: When animation completes, tabs are already mounted and visible
      // No setTimeout needed, no gap, no void state
    } catch (error: any) {
      // Invalid OTP or verification failed
      setState(OtpVerificationStateEnum.ERROR);
      setErrorMessage(error.message || OTP_TEXT.ERROR_INVALID);
      shake();

      // Clear input after shake
      setTimeout(() => {
        setDigits(Array(OTP_CONFIG.CODE_LENGTH).fill(''));
        setState(OtpVerificationStateEnum.IDLE);
      }, OTP_LAYOUT.SHAKE_DURATION);
    }
  };

  const handleOkPress = () => {
    navigationIntentRef.current = 'back';
    dismiss();
  };

  const handleClose = () => {
    navigationIntentRef.current = 'back';
    dismiss();
  };

  return (
    <View style={styles.container}>
      {/* Backdrop */}
      <Animated.View style={[styles.backdrop, animatedBackdropStyle]}>
        <TouchableWithoutFeedback onPress={handleClose}>
          <View style={styles.backdropTouchable} />
        </TouchableWithoutFeedback>
      </Animated.View>

      {/* Modal */}
      <Animated.View
        style={[
          styles.modalWrapper,
          { height: modalHeight },
          animatedModalStyle,
        ]}
      >
        <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
          {/* Close button */}
          <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
            <Text style={styles.closeButtonText}>{OTP_TEXT.CLOSE_BUTTON}</Text>
          </TouchableOpacity>

          {/* Content */}
          <View style={styles.content}>
            <Text style={styles.title}>{OTP_TEXT.TITLE}</Text>
            
            <Text style={styles.subtitle}>
              {OTP_TEXT.SUBTITLE_PREFIX}{' '}
              {OtpVerificationService.formatPhoneForDisplay(params.phoneNumber || '')}
            </Text>

            <Text style={styles.inputLabel}>{OTP_TEXT.INPUT_LABEL}</Text>

            {/* OTP Input */}
            <OtpInput
              digits={digits}
              onDigitsChange={setDigits}
              onComplete={handleOtpComplete}
              shakeAnimatedStyle={shakeAnimatedStyle}
              disabled={state === OtpVerificationStateEnum.VERIFYING || showMaxRetriesError}
            />

            {/* Timer - Always show when not at max retries */}
            {!showMaxRetriesError && (
              <OtpTimer
                timeRemaining={timeRemaining}
                onResend={handleResendClick}
                canClickResend={canClickResend}
              />
            )}

            {/* Error message */}
            {errorMessage && !showMaxRetriesError && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{errorMessage}</Text>
                {isExpired && canShowRetryIcon && (
                  <RetryButton onPress={handleRetryIconClick} />
                )}
              </View>
            )}

            {/* Max retries - OK button */}
            {showMaxRetriesError && (
              <TouchableOpacity style={styles.okButton} onPress={handleOkPress}>
                <Text style={styles.okButtonText}>{OTP_TEXT.BUTTON_OK}</Text>
              </TouchableOpacity>
            )}
          </View>
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
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: BRAND_COLORS.background.white,
    borderTopLeftRadius: OTP_LAYOUT.MODAL_BORDER_RADIUS,
    borderTopRightRadius: OTP_LAYOUT.MODAL_BORDER_RADIUS,
  },
  safeArea: {
    flex: 1,
  },
  closeButton: {
    position: 'absolute',
    top: OTP_LAYOUT.CLOSE_BUTTON_TOP,
    right: OTP_LAYOUT.CLOSE_BUTTON_RIGHT,
    width: OTP_LAYOUT.CLOSE_BUTTON_SIZE,
    height: OTP_LAYOUT.CLOSE_BUTTON_SIZE,
    borderRadius: OTP_LAYOUT.CLOSE_BUTTON_BORDER_RADIUS,
    backgroundColor: 'rgba(96, 106, 55, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  closeButtonText: {
    fontSize: OTP_LAYOUT.CLOSE_BUTTON_FONT_SIZE,
    color: BRAND_COLORS.primary.xanhReu,
    fontFamily: 'SpaceGrotesk-Bold',
  },
  content: {
    flex: 1,
    paddingHorizontal: OTP_LAYOUT.CONTENT_PADDING_HORIZONTAL,
    paddingTop: OTP_LAYOUT.CONTENT_PADDING_TOP,
  },
  title: {
    fontSize: OTP_LAYOUT.TITLE_FONT_SIZE,
    fontFamily: 'Phudu-Bold',
    color: BRAND_COLORS.primary.xanhReu,
    textAlign: 'center',
    marginBottom: OTP_LAYOUT.TITLE_MARGIN_BOTTOM,
  },
  subtitle: {
    fontSize: OTP_LAYOUT.SUBTITLE_FONT_SIZE,
    fontFamily: 'SpaceGrotesk-Medium',
    color: BRAND_COLORS.primary.xanhReu,
    textAlign: 'center',
    lineHeight: OTP_LAYOUT.SUBTITLE_LINE_HEIGHT,
    marginBottom: OTP_LAYOUT.SUBTITLE_MARGIN_BOTTOM,
  },
  inputLabel: {
    fontSize: OTP_LAYOUT.INPUT_LABEL_FONT_SIZE,
    fontFamily: 'SpaceGrotesk-Medium',
    color: BRAND_COLORS.primary.xanhReu,
    textAlign: 'center',
    marginBottom: OTP_LAYOUT.INPUT_LABEL_MARGIN_BOTTOM,
  },
  errorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: OTP_LAYOUT.ERROR_MARGIN_TOP,
  },
  errorText: {
    fontSize: OTP_LAYOUT.ERROR_FONT_SIZE,
    fontFamily: 'SpaceGrotesk-Medium',
    color: '#FF0000',
    lineHeight: OTP_LAYOUT.ERROR_LINE_HEIGHT,
    textAlign: 'center',
  },
  okButton: {
    marginTop: OTP_LAYOUT.OK_BUTTON_MARGIN_TOP,
    backgroundColor: BRAND_COLORS.secondary.nauEspresso,
    borderRadius: OTP_LAYOUT.OK_BUTTON_BORDER_RADIUS,
    paddingVertical: OTP_LAYOUT.OK_BUTTON_PADDING_VERTICAL,
    alignItems: 'center',
  },
  okButtonText: {
    fontSize: OTP_LAYOUT.OK_BUTTON_FONT_SIZE,
    fontFamily: 'Phudu-Bold',
    color: BRAND_COLORS.background.white,
  },
});