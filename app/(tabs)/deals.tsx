import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BRAND_COLORS } from '../../src/presentation/theme/colors';

/**
 * Deals Screen (Ưu đãi) - thay thế rewards.tsx
 */
export default function DealsScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.content}>
        <Text style={styles.text}>Ưu đãi</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BRAND_COLORS.background.white,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontFamily: 'Phudu-Bold',
    fontSize: 20,
    color: BRAND_COLORS.primary.xanhReu,
  },
});