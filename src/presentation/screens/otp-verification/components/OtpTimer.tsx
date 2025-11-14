import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { BRAND_COLORS } from '../../../theme/colors';
import { OTP_TEXT } from '../OtpVerificationConstants';
import { OTP_LAYOUT } from '../OtpVerificationLayout';
import { OtpVerificationService } from '../OtpVerificationService';

interface OtpTimerProps {
  timeRemaining: number;
  onRetry: () => void;
  canRetry: boolean;
}

export function OtpTimer({ timeRemaining, onRetry, canRetry }: OtpTimerProps) {
  const timerState = OtpVerificationService.getTimerState(timeRemaining);
  const formattedTime = OtpVerificationService.formatTimeRemaining(timeRemaining);

  if (timerState.isExpired) {
    return null; // Error message handled in main screen
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        {OTP_TEXT.RESEND_PROMPT}{' '}
        <Text style={styles.link} onPress={canRetry ? onRetry : undefined}>
          {OTP_TEXT.RESEND_BUTTON}
        </Text>
        {' '}
        <Text style={styles.timer}>({formattedTime})</Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: OTP_LAYOUT.TIMER_MARGIN_TOP,
    alignItems: 'center',
  },
  text: {
    fontSize: OTP_LAYOUT.TIMER_FONT_SIZE,
    fontFamily: 'SpaceGrotesk-Medium',
    color: BRAND_COLORS.primary.xanhReu,
    lineHeight: OTP_LAYOUT.TIMER_LINE_HEIGHT,
  },
  link: {
    color: BRAND_COLORS.secondary.nauEspresso,
    fontFamily: 'SpaceGrotesk-Bold',
  },
  timer: {
    color: BRAND_COLORS.secondary.nauEspresso,
  },
});