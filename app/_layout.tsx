import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { TamaguiProvider } from 'tamagui';
import { store, persistor } from '../src/application/store';
import { initializeApp } from '../src/App.init';
import config from '../tamagui.config';

// Prevent auto-hide splash screen
SplashScreen.preventAutoHideAsync();

/**
 * Root Layout - Stack Navigator
 * 
 * Kiến trúc: Root Stack bọc (tabs) và các màn Stack-only (login)
 * Tham chiếu: https://docs.expo.dev/router/advanced/nesting-navigators/
 * 
 * - index: Splash screen
 * - login: Stack-only route (không xuất hiện trên tab bar)
 * - (tabs): Bottom Tabs Navigator (5 tabs chính)
 */
export default function RootLayout() {
  const [appReady, setAppReady] = useState(false);
  const [fontsLoaded] = useFonts({
    'Phudu-Bold': require('../assets/fonts/Phudu-Bold.ttf'),
    'Phudu-Medium': require('../assets/fonts/Phudu-Medium.ttf'),
    'Phudu-SemiBold': require('../assets/fonts/Phudu-SemiBold.ttf'),
    'SpaceGrotesk-Bold': require('../assets/fonts/SpaceGrotesk-Bold.ttf'),
    'SpaceGrotesk-Medium': require('../assets/fonts/SpaceGrotesk-Medium.ttf'),
    'SpaceMono-Bold': require('../assets/fonts/SpaceMono-Bold.ttf'),
  });

  // Initialize app (database, DI, sync)
  useEffect(() => {
    async function prepare() {
      try {
        await initializeApp();
        setAppReady(true);
      } catch (error) {
        console.error('App initialization failed:', error);
        // Still set app ready to allow app to continue (graceful degradation)
        setAppReady(true);
      }
    }

    prepare();
  }, []);

  useEffect(() => {
    if (fontsLoaded && appReady) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, appReady]);

  if (!fontsLoaded || !appReady) {
    return null;
  }

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <SafeAreaProvider>
          <TamaguiProvider config={config}>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="index" />
              <Stack.Screen
                name="login"
                options={{
                  presentation: 'fullScreenModal', // iOS: modal từ dưới lên
                  animation: 'slide_from_bottom', // Android
                  gestureEnabled: true,           // Cho phép swipe down để dismiss
                  gestureDirection: 'vertical',   // Swipe vertical
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
          </TamaguiProvider>
        </SafeAreaProvider>
      </PersistGate>
    </Provider>
  );
}