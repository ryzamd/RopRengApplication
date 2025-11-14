import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
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
  const dispatch = useAppDispatch();
  const params = useLocalSearchParams<{ phoneNumber: string }>();
  
  const [digits, setDigits] = useState<string[]>(Array(OTP_CONFIG.CODE_LENGTH).fill(''));
  const [state, setState] = useState<OtpVerificationStateEnum>(OtpVerificationStateEnum.IDLE);
  const [timeRemaining, setTimeRemaining] = useState(OTP_CONFIG.TIMER_DURATION_SECONDS);
  const [retryCount, setRetryCount] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Bottom sheet animation
  const { modalHeight, animatedModalStyle, animatedBackdropStyle, dismiss } =
    useModalBottomSheetAnimation({
      heightPercentage: OTP_LAYOUT.MODAL_HEIGHT_PERCENTAGE,
      onExitComplete: () => router.back(),
    });

  // Shake animation for errors
  const { animatedStyle: shakeAnimatedStyle, shake } = useShakeAnimation();

  // Countdown timer
  useEffect(() => {
    if (timeRemaining <= 0) {
      setState(OtpVerificationStateEnum.EXPIRED);
      setErrorMessage(OTP_TEXT.ERROR_EXPIRED);
      return;
    }

    const interval = setInterval(() => {
      setTimeRemaining((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(interval);
  }, [timeRemaining]);

  const resetOtp = () => {
    setDigits(Array(OTP_CONFIG.CODE_LENGTH).fill(''));
    setTimeRemaining(OTP_CONFIG.TIMER_DURATION_SECONDS);
    setState(OtpVerificationStateEnum.IDLE);
    setErrorMessage(null);
  };

  const handleRetry = () => {
    if (!OtpVerificationService.canRetry(timeRemaining, retryCount)) {
      return;
    }
    
    const newRetryCount = retryCount + 1;
    setRetryCount(newRetryCount);
    resetOtp();
  };

  const handleOtpComplete = (code: string) => {
    if (state !== OtpVerificationStateEnum.IDLE) {
      return;
    }

    setState(OtpVerificationStateEnum.VERIFYING);

    // Simulate verification delay
    setTimeout(() => {
      const result = OtpVerificationService.verifyOtpCode(code);

      if (result.isValid && result.userType) {
        setState(OtpVerificationStateEnum.SUCCESS);
        
        // Dispatch login action
        dispatch(login({
          phoneNumber: params.phoneNumber || '',
          userId: `user_${Date.now()}`,
        }));

        // Navigate based on user type
        dismiss();
        setTimeout(() => {
          if (result.userType === 'existing') {
            router.replace('/(tabs)');
          } else {
            // TODO: Navigate to create account screen
            console.log('Navigate to create account (not implemented yet)');
            router.replace('/(tabs)');
          }
        }, 300);
      } else {
        // Invalid OTP
        setState(OtpVerificationStateEnum.ERROR);
        setErrorMessage(OTP_TEXT.ERROR_INVALID);
        shake();
        
        // Clear input after shake
        setTimeout(() => {
          setDigits(Array(OTP_CONFIG.CODE_LENGTH).fill(''));
          setState(OtpVerificationStateEnum.IDLE);
        }, OTP_LAYOUT.SHAKE_DURATION);
      }
    }, 500);
  };

  const handleOkPress = () => {
    dismiss();
  };

  const handleClose = () => {
    dismiss();
  };

  const canRetry = OtpVerificationService.canRetry(timeRemaining, retryCount);
  const isExpired = timeRemaining <= 0;
  const showMaxRetriesError = !canRetry && isExpired;

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

            {/* Timer */}
            {!isExpired && (
              <OtpTimer
                timeRemaining={timeRemaining}
                onRetry={handleRetry}
                canRetry={canRetry}
              />
            )}

            {/* Error message */}
            {errorMessage && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{errorMessage}</Text>
                {isExpired && canRetry && !showMaxRetriesError && (
                  <RetryButton onPress={handleRetry} />
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