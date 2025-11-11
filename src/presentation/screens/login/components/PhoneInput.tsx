import React, { useEffect, useRef } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { BRAND_COLORS } from '../../../theme/colors';
import { LOGIN_PHONE_CONFIG, LOGIN_TEXT } from '../LoginConstants';
import { LOGIN_LAYOUT } from '../LoginLayout';
import { LoginUIService } from '../LoginService';

interface PhoneInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onSubmit: () => void;
  isValid: boolean;
  autoFocusDelay?: number; // NEW: delayed focus for modal animation
}

export function PhoneInput({ value, onChangeText, onSubmit, isValid, autoFocusDelay = 0}: PhoneInputProps) {
  const inputRef = useRef<TextInput>(null);

  // Fix: Delayed focus after modal animation completes
  useEffect(() => {
    if (autoFocusDelay > 0) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, autoFocusDelay);
      return () => clearTimeout(timer);
    }
  }, [autoFocusDelay]);

  const handleTextChange = (text: string) => {
    const formatted = LoginUIService.formatPhoneInput(text);
    onChangeText(formatted);
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <View style={styles.countryCode}>
          <Text style={styles.flag}>{LOGIN_PHONE_CONFIG.FLAG_EMOJI}</Text>
          <Text style={styles.code}>{LOGIN_PHONE_CONFIG.COUNTRY_CODE}</Text>
        </View>
        <TextInput
          ref={inputRef}
          style={styles.input}
          placeholder={LOGIN_TEXT.PHONE_PLACEHOLDER}
          placeholderTextColor="#CCCCCC"
          value={value}
          onChangeText={handleTextChange}
          keyboardType="phone-pad"
          maxLength={LOGIN_PHONE_CONFIG.MAX_LENGTH}
          returnKeyType="done"
          onSubmitEditing={onSubmit}
        />
      </View>

      <TouchableOpacity
        style={[styles.button, isValid && styles.buttonActive]}
        onPress={onSubmit}
        disabled={!isValid}
        activeOpacity={0.8}
      >
        <Text style={[styles.buttonText, isValid && styles.buttonTextActive]}>
          {LOGIN_TEXT.LOGIN_BUTTON}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: LOGIN_LAYOUT.INPUT_GAP,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: BRAND_COLORS.background.white,
    borderWidth: LOGIN_LAYOUT.INPUT_BORDER_WIDTH,
    borderColor: '#E5E5E5',
    borderRadius: LOGIN_LAYOUT.INPUT_BORDER_RADIUS,
    paddingHorizontal: LOGIN_LAYOUT.INPUT_PADDING_HORIZONTAL,
    paddingVertical: LOGIN_LAYOUT.INPUT_PADDING_VERTICAL,
    gap: LOGIN_LAYOUT.INPUT_GAP,
  },
  countryCode: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  flag: {
    fontSize: LOGIN_LAYOUT.FLAG_EMOJI_FONT_SIZE,
  },
  code: {
    fontSize: LOGIN_LAYOUT.PHONE_INPUT_FONT_SIZE,
    fontFamily: 'SpaceGrotesk-Medium',
    color: BRAND_COLORS.primary.xanhReu,
  },
  input: {
    flex: 1,
    fontSize: LOGIN_LAYOUT.PHONE_INPUT_FONT_SIZE,
    fontFamily: 'SpaceGrotesk-Medium',
    color: BRAND_COLORS.primary.xanhReu,
  },
  button: {
    backgroundColor: '#E5E5E5',
    borderRadius: LOGIN_LAYOUT.BUTTON_BORDER_RADIUS,
    paddingVertical: LOGIN_LAYOUT.BUTTON_PADDING_VERTICAL,
    alignItems: 'center',
  },
  buttonActive: {
    backgroundColor: BRAND_COLORS.secondary.nauEspresso,
  },
  buttonText: {
    fontSize: LOGIN_LAYOUT.BUTTON_FONT_SIZE,
    fontFamily: 'Phudu-Bold',
    color: '#999999',
  },
  buttonTextActive: {
    color: BRAND_COLORS.background.white,
  },
});