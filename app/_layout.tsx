import { permissionService } from "@/src/infrastructure/services/PermissionService";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { Platform } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
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

  useEffect(() => {
    const initAppPermissions = async () => {
      const permissions = await permissionService.requestInitialPermissions();
      console.log('App Permissions Status:', permissions);
      
      // TODO: Nếu permissions.location là false, có thể set state global để disable tính năng map
      if (!permissions.location) {
         // Handle location limited functionality
         return;
      }
    };

    initAppPermissions();
  }, []);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <TamaguiProvider config={config}>
            <BottomSheetModalProvider>
              <DatabaseProvider>
                <StatusBar style={Platform.OS === 'ios' ? 'dark' : 'auto'} />
                <Stack screenOptions={{ headerShown: false }}>
                  <Stack.Screen name="index" />
                  <Stack.Screen name="(auth)" />
                  <Stack.Screen name="(tabs)" />
                  <Stack.Screen
                    name="address-management"
                    options={{
                      headerShown: false,
                      presentation: 'fullScreenModal',
                      animation: 'slide_from_bottom'
                    }}
                  />
                </Stack>
              </DatabaseProvider>
            </BottomSheetModalProvider>
          </TamaguiProvider>
        </PersistGate>
      </Provider>
    </GestureHandlerRootView>
  );
}