import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { TamaguiProvider } from 'tamagui';
import { DatabaseProvider } from '../src/infrastructure/db/sqlite/provider';
import { persistor, store } from '../src/state/store';
import config from '../tamagui.config';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    'Phudu-Bold': require('../assets/fonts/Phudu-Bold.ttf'),
    'Phudu-Medium': require('../assets/fonts/Phudu-Medium.ttf'),
    'Phudu-SemiBold': require('../assets/fonts/Phudu-SemiBold.ttf'),
    'SpaceGrotesk-Bold': require('../assets/fonts/SpaceGrotesk-Bold.ttf'),
    'SpaceGrotesk-Medium': require('../assets/fonts/SpaceGrotesk-Medium.ttf'),
    'SpaceMono-Bold': require('../assets/fonts/SpaceMono-Bold.ttf'),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <SafeAreaProvider>
          <TamaguiProvider config={config}>
            <DatabaseProvider>
              <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="index" />
                <Stack.Screen
                  name="login"
                  options={{
                    presentation: 'fullScreenModal',
                    animation: 'slide_from_bottom',
                    gestureEnabled: true,
                    gestureDirection: 'vertical',
                  }}
                />
                <Stack.Screen
                  name="otp-verification"
                  options={{
                    presentation: 'transparentModal',
                    animation: 'none',
                    gestureEnabled: false,
                  }}
                />
                <Stack.Screen name="(tabs)" />
              </Stack>
            </DatabaseProvider>
          </TamaguiProvider>
        </SafeAreaProvider>
      </PersistGate>
    </Provider>
  );
}