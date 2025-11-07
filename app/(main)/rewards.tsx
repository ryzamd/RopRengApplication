import { View, Text, StyleSheet } from 'react-native';
import { BRAND_COLORS } from '../../src/presentation/theme/colors';

export default function RewardsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Ưu đãi Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BRAND_COLORS.background.default,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontFamily: 'Phudu-Bold',
    fontSize: 20,
    color: BRAND_COLORS.primary.xanhReu,
  },
});