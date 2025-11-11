import { useAppSelector } from '../../src/utils/hooks';
import WelcomeScreen from '../../src/presentation/screens/welcome/WelcomeScreen';
import HomeScreen from '../../src/presentation/screens/home/HomeScreen';

export default function IndexScreen() {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  
  return isAuthenticated ? <HomeScreen /> : <WelcomeScreen />;
}