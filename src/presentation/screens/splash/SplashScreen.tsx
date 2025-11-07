import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { SPLASH_CONSTANTS } from './constants';
import { splashStyles } from './styles';

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/(main)/welcome');
    }, SPLASH_CONSTANTS.DISPLAY_DURATION);

    return () => clearTimeout(timer);
  }, [router]);

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