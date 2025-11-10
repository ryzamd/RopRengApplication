import { useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BRAND_COLORS } from '../src/presentation/theme/colors';

/**
 * Login Screen - Stack-only route (ngoài tabs)
 * 
 * Kiến trúc: Route này nằm ngoài (tabs) để:
 * - Tab bar tự động ẩn khi navigate tới /login
 * - Giữ đúng back-stack semantics (back về màn trước)
 * - Không làm lộ tab bar khi đang auth flow
 * 
 * Tham chiếu: https://docs.expo.dev/router/advanced/nesting-navigators/
 */
export default function LoginScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.content}>
        <Text style={styles.title}>Đăng nhập</Text>
        <Text style={styles.subtitle}>Demo Auth Flow</Text>
        
        {/* Demo: Giả lập login thành công */}
        <TouchableOpacity 
          style={styles.button}
          onPress={() => {
            // TODO: Implement real auth logic here
            // Sau khi login thành công, quay về màn trước
            router.back();
          }}
        >
          <Text style={styles.buttonText}>Đăng nhập (Demo)</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, styles.buttonSecondary]}
          onPress={() => router.back()}
        >
          <Text style={[styles.buttonText, styles.buttonTextSecondary]}>
            Quay lại
          </Text>
        </TouchableOpacity>
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
    paddingHorizontal: 24,
  },
  title: {
    fontFamily: 'Phudu-Bold',
    fontSize: 32,
    color: BRAND_COLORS.primary.xanhReu,
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: 'SpaceGrotesk-Medium',
    fontSize: 16,
    color: '#666',
    marginBottom: 48,
  },
  button: {
    backgroundColor: BRAND_COLORS.secondary.nauEspresso,
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 12,
    width: '100%',
    marginBottom: 16,
  },
  buttonSecondary: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: BRAND_COLORS.secondary.nauEspresso,
  },
  buttonText: {
    fontFamily: 'SpaceGrotesk-Bold',
    fontSize: 16,
    color: BRAND_COLORS.background.white,
    textAlign: 'center',
  },
  buttonTextSecondary: {
    color: BRAND_COLORS.secondary.nauEspresso,
  },
});