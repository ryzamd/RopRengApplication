import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { useAuth } from '../../hooks/useAuth';
import { SPLASH_CONSTANTS } from './constants';
import { splashStyles } from './styles';

export default function SplashScreen() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const [checkComplete, setCheckComplete] = useState(false);

  useEffect(() => {
    // Wait for minimum splash duration
    const timer = setTimeout(() => {
      setCheckComplete(true);
    }, SPLASH_CONSTANTS.DISPLAY_DURATION);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Navigate after check is complete
    if (checkComplete) {
      if (isAuthenticated && user) {
        router.replace('/(tabs)');
      } else {
        router.replace('/login');
      }
    }
  }, [checkComplete, isAuthenticated, user, router]);

  return (
    <View style={splashStyles.container}>
      <View style={splashStyles.logoContainer}>
        <View style={splashStyles.logoPlaceholder}>
          <Text style={splashStyles.logoText}>LOGO{'\n'}RỐP RẺNG</Text>
        </View>
        <Text
          style={[
            splashStyles.brandName,
            { fontFamily: 'Phudu-Bold' }
          ]}
        >
          {SPLASH_CONSTANTS.BRAND_NAME}
        </Text>
        <Text
          style={[
            splashStyles.tagline,
            { fontFamily: 'SpaceGrotesk-Medium' }
          ]}
        >
          {SPLASH_CONSTANTS.TAGLINE}
        </Text>
      </View>
    </View>
  );
}