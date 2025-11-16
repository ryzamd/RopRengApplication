import { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useAppSelector } from '../../src/utils/hooks';
import WelcomeScreen from '../../src/presentation/screens/welcome/WelcomeScreen';
import HomeScreen from '../../src/presentation/screens/home/HomeScreen';
import { BRAND_COLORS } from '../../src/presentation/theme/colors';

export default function IndexScreen() {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const [isReady, setIsReady] = useState(false);

  // Brief delay to ensure Redux state has settled
  // This prevents flickering between WelcomeScreen and HomeScreen
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 50); // Minimal delay, just enough for Redux to settle

    return () => clearTimeout(timer);
  }, []);

  // Show minimal loading state while settling
  if (!isReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: BRAND_COLORS.background.white }}>
        <ActivityIndicator size="large" color={BRAND_COLORS.secondary.nauEspresso} />
      </View>
    );
  }

  return isAuthenticated ? <HomeScreen /> : <WelcomeScreen />;
}