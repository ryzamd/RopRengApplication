import { BottomSheetBackdrop, BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import { useRouter } from 'expo-router';
import React, { forwardRef, useCallback, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAnimatedStyle, useSharedValue, withSequence, withSpring, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TokenStorage } from '../../../infrastructure/storage/tokenStorage';
import { clearPendingIntent, login } from '../../../state/slices/auth';
import { useAppDispatch, useAppSelector } from '../../../utils/hooks';
import { BRAND_COLORS } from '../../theme/colors';
import { OtpInput } from './components/OtpInput';
import { OtpTimer } from './components/OtpTimer';
import { RetryButton } from './components/RetryButton';
import { OTP_CONFIG, OTP_TEXT } from './OtpVerificationConstants';
import { OtpVerificationStateEnum } from './OtpVerificationEnums';
import { OTP_LAYOUT } from './OtpVerificationLayout';
import { OtpVerificationService } from './OtpVerificationService';

export interface OtpVerificationRef {
  present: () => void;
  dismiss: () => void;
}

interface OtpVerificationScreenProps {
  phoneNumber: string;
}

export const OtpVerificationBottomSheet = forwardRef<OtpVerificationRef, OtpVerificationScreenProps>(
  ({ phoneNumber }, ref) => {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const insets = useSafeAreaInsets();
    const pendingIntent = useAppSelector((state) => state.auth.pendingIntent);

    const [digits, setDigits] = useState<string[]>(Array(OTP_CONFIG.CODE_LENGTH).fill(''));
    const [state, setState] = useState<OtpVerificationStateEnum>(OtpVerificationStateEnum.IDLE);
    const [timeRemaining, setTimeRemaining] = useState(OTP_CONFIG.TIMER_DURATION_SECONDS);
    const [hasClickedResendThisCycle, setHasClickedResendThisCycle] = useState(false);
    const [totalRetryCount, setTotalRetryCount] = useState(0);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const sheetRef = useRef<BottomSheetModal>(null);
    const isLoginSuccessRef = useRef(false);
    const timerIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const shakeTranslateX = useSharedValue(0);
    const snapPoints = useMemo(() => ['90%'], []);

    useImperativeHandle(ref, () => ({
      present: () => {
        setDigits(Array(OTP_CONFIG.CODE_LENGTH).fill(''));
        setState(OtpVerificationStateEnum.IDLE);
        setTimeRemaining(OTP_CONFIG.TIMER_DURATION_SECONDS);
        setHasClickedResendThisCycle(false);
        setTotalRetryCount(0);
        setErrorMessage(null);
        isLoginSuccessRef.current = false;
        sheetRef.current?.present();
      },
      dismiss: () => {
        sheetRef.current?.dismiss();
      },
    }));

    const processPendingIntent = useCallback(() => {
      if (!pendingIntent) {
        router.replace('/(tabs)');
        return;
      }

      const now = Date.now();
      if (now >= pendingIntent.expiresAt) {
        dispatch(clearPendingIntent());
        router.replace('/(tabs)');
        return;
      }

      const { intent, context } = pendingIntent;

      try {
        switch (intent) {
          case 'PURCHASE':
            if (!context.productId) throw new Error('Missing productId');
            router.replace({
              pathname: '/(tabs)/stores',
              params: { productId: context.productId, mode: 'select' },
            });
            break;
          case 'VIEW_STORE':
            dispatch(clearPendingIntent());
            router.replace({ pathname: '/(tabs)/stores', params: { storeId: context.storeId } });
            break;
          case 'BROWSE_CATEGORY':
            dispatch(clearPendingIntent());
            router.replace({ pathname: '/(tabs)/search', params: { categoryId: context.categoryId } });
            break;
          default:
            dispatch(clearPendingIntent());
            router.replace('/(tabs)');
        }
      } catch (error) {
        console.error('[OTP] Error processing intent:', error);
        dispatch(clearPendingIntent());
        router.replace('/(tabs)');
      }
    }, [pendingIntent, dispatch, router]);

    const triggerShake = useCallback(() => {
      shakeTranslateX.value = withSequence(
        withTiming(-6, { duration: 20 }),
        withTiming(6, { duration: 25 }),
        withTiming(0, { duration: 20 })
      );
    }, [shakeTranslateX]);

    const shakeAnimatedStyle = useAnimatedStyle(() => ({
      transform: [{ translateX: shakeTranslateX.value }],
    }));

    const handleDismiss = useCallback(() => {
      // Clear timer
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }

      if (isLoginSuccessRef.current) {
        processPendingIntent();
      } else {
        if (router.canGoBack()) {
          router.back();
        }
      }
    }, [processPendingIntent, router]);

    const handleClose = useCallback(() => {
      dispatch(clearPendingIntent());
      sheetRef.current?.dismiss();
    }, [dispatch]);

    // Timer effect
    React.useEffect(() => {
      if (timeRemaining <= 0) {
        setState(OtpVerificationStateEnum.EXPIRED);
        setErrorMessage(OTP_TEXT.ERROR_EXPIRED);
        if (timerIntervalRef.current) {
          clearInterval(timerIntervalRef.current);
          timerIntervalRef.current = null;
        }
        return;
      }

      timerIntervalRef.current = setInterval(() => {
        setTimeRemaining((prev) => Math.max(0, prev - 1));
      }, 1000);

      return () => {
        if (timerIntervalRef.current) {
          clearInterval(timerIntervalRef.current);
          timerIntervalRef.current = null;
        }
      };
    }, [timeRemaining]);

    const handleResendClick = () => {
      if (!OtpVerificationService.canClickResend(timeRemaining, hasClickedResendThisCycle)) return;
      setHasClickedResendThisCycle(true);
      setTotalRetryCount((prev) => prev + 1);
      setTimeRemaining(OTP_CONFIG.TIMER_DURATION_SECONDS);
      setState(OtpVerificationStateEnum.IDLE);
      setErrorMessage(null);
    };

    const handleOtpComplete = async (code: string) => {
      if (state !== OtpVerificationStateEnum.IDLE) return;

      setState(OtpVerificationStateEnum.VERIFYING);

      setTimeout(async () => {
        const result = OtpVerificationService.verifyOtpCode(code);

        if (result.isValid && result.userType) {
          isLoginSuccessRef.current = true;
          setState(OtpVerificationStateEnum.SUCCESS);

          await TokenStorage.saveTokens(`jwt_${Date.now()}`, `refresh_${Date.now()}`, `user_${Date.now()}`);

          dispatch(
            login({
              phoneNumber: phoneNumber,
              userId: `user_${Date.now()}`,
            })
          );

          sheetRef.current?.dismiss();
        } else {
          setState(OtpVerificationStateEnum.ERROR);
          setErrorMessage(OTP_TEXT.ERROR_INVALID);
          triggerShake();

          setTimeout(() => {
            setDigits(Array(OTP_CONFIG.CODE_LENGTH).fill(''));
            setState(OtpVerificationStateEnum.IDLE);
          }, OTP_LAYOUT.SHAKE_DURATION);
        }
      }, 500);
    };

    const renderBackdrop = useCallback(
      (props: any) => (
        <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} opacity={0.5} pressBehavior="close" />
      ),
      []
    );

    const canClickResend = OtpVerificationService.canClickResend(timeRemaining, hasClickedResendThisCycle);
    const showMaxRetriesError = totalRetryCount >= OTP_CONFIG.MAX_RETRY_COUNT && timeRemaining <= 0;

    return (
      <BottomSheetModal
        ref={sheetRef}
        snapPoints={snapPoints}
        enablePanDownToClose={true}
        enableDynamicSizing={false}
        backdropComponent={renderBackdrop}
        onDismiss={handleDismiss}
        backgroundStyle={styles.bottomSheetBackground}
        handleIndicatorStyle={styles.indicator}
      >
        <BottomSheetView style={styles.contentWrapper}>
          <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
            <Text style={styles.closeButtonText}>{OTP_TEXT.CLOSE_BUTTON}</Text>
          </TouchableOpacity>

          <View style={[styles.content, { paddingBottom: insets.bottom + 24 }]}>
            <Text style={styles.title}>{OTP_TEXT.TITLE}</Text>

            <Text style={styles.subtitle}>
              {OTP_TEXT.SUBTITLE_PREFIX}{' '}
              {OtpVerificationService.formatPhoneForDisplay(phoneNumber)}
            </Text>

            <Text style={styles.inputLabel}>{OTP_TEXT.INPUT_LABEL}</Text>

            <OtpInput
              digits={digits}
              onDigitsChange={setDigits}
              onComplete={handleOtpComplete}
              shakeAnimatedStyle={shakeAnimatedStyle}
              disabled={state === OtpVerificationStateEnum.VERIFYING || showMaxRetriesError}
            />

            {!showMaxRetriesError && (
              <OtpTimer timeRemaining={timeRemaining} onResend={handleResendClick} canClickResend={canClickResend} />
            )}

            {errorMessage && !showMaxRetriesError && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{errorMessage}</Text>
                {timeRemaining <= 0 && (
                  <RetryButton
                    onPress={() => {
                      setTotalRetryCount((c) => c + 1);
                      setDigits(Array(OTP_CONFIG.CODE_LENGTH).fill(''));
                      setTimeRemaining(OTP_CONFIG.TIMER_DURATION_SECONDS);
                      setState(OtpVerificationStateEnum.IDLE);
                      setErrorMessage(null);
                    }}
                  />
                )}
              </View>
            )}

            {showMaxRetriesError && (
              <TouchableOpacity style={styles.okButton} onPress={handleClose}>
                <Text style={styles.okButtonText}>{OTP_TEXT.BUTTON_OK}</Text>
              </TouchableOpacity>
            )}
          </View>
        </BottomSheetView>
      </BottomSheetModal>
    );
  }
);

OtpVerificationBottomSheet.displayName = 'OtpVerificationBottomSheet';

const styles = StyleSheet.create({
  bottomSheetBackground: {
    backgroundColor: BRAND_COLORS.background.default,
    borderTopLeftRadius: OTP_LAYOUT.MODAL_BORDER_RADIUS,
    borderTopRightRadius: OTP_LAYOUT.MODAL_BORDER_RADIUS,
  },
  indicator: {
    backgroundColor: '#DDDDDD',
    width: 40,
  },
  contentWrapper: {
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
    color: BRAND_COLORS.background.default,
  },
});