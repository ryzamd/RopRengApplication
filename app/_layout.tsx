import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { TamaguiProvider } from 'tamagui';
import { DatabaseProvider } from '../src/infrastructure/db/sqlite/provider';
import { store } from '../src/state/store';
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
      <SafeAreaProvider>
        <TamaguiProvider config={config}>
          <DatabaseProvider>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="index" />
              <Stack.Screen
                name="login"
                options={{
                  presentation: 'modal', // iOS: modal từ dưới lên
                  animation: 'slide_from_bottom', // Android
                  gestureEnabled: true,           // Cho phép swipe down để dismiss
                  gestureDirection: 'vertical',   // Swipe vertical
                }}
              />
              <Stack.Screen name="(tabs)" />
            </Stack>
          </DatabaseProvider>
        </TamaguiProvider>
      </SafeAreaProvider>
    </Provider>
  );
}