import React from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { BRAND_COLORS } from '../../../theme/colors';
import { LOGIN_CONSTANTS } from '../constants';

interface PhoneInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onSubmit: () => void;
  isValid: boolean;
}

export function PhoneInput({
  value,
  onChangeText,
  onSubmit,
  isValid,
}: PhoneInputProps) {
  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <View style={styles.countryCode}>
          <Text style={styles.flag}>{LOGIN_CONSTANTS.FLAG_EMOJI}</Text>
          <Text style={styles.code}>{LOGIN_CONSTANTS.COUNTRY_CODE}</Text>
        </View>
        <TextInput
          style={styles.input}
          placeholder={LOGIN_CONSTANTS.PHONE_PLACEHOLDER}
          placeholderTextColor="#CCCCCC"
          value={value}
          onChangeText={(text) => onChangeText(text.replace(/\D/g, ''))}
          keyboardType="phone-pad"
          maxLength={10}
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
          {LOGIN_CONSTANTS.LOGIN_BUTTON}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: BRAND_COLORS.background.white,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  countryCode: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  flag: {
    fontSize: 20,
  },
  code: {
    fontSize: 16,
    fontFamily: 'SpaceGrotesk-Medium',
    color: BRAND_COLORS.primary.xanhReu,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'SpaceGrotesk-Medium',
    color: BRAND_COLORS.primary.xanhReu,
  },
  button: {
    backgroundColor: '#E5E5E5',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  buttonActive: {
    backgroundColor: BRAND_COLORS.secondary.nauEspresso,
  },
  buttonText: {
    fontSize: 16,
    fontFamily: 'Phudu-Bold',
    color: '#999999',
  },
  buttonTextActive: {
    color: BRAND_COLORS.background.white,
  },
});