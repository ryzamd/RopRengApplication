import { StyleSheet } from 'react-native';
import { BRAND_COLORS } from '../../theme/colors';

export const welcomeStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BRAND_COLORS.background.default,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  greeting: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  greetingIcon: {
    fontSize: 28,
  },
  greetingText: {
    fontSize: 20,
    fontFamily: 'Phudu-Bold',
    color: BRAND_COLORS.primary.xanhReu,
  },
  headerIcons: {
    flexDirection: 'row',
    gap: 12,
  },
  iconButton: {
    width: 48,
    height: 48,
    backgroundColor: BRAND_COLORS.background.white,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconText: {
    fontSize: 24,
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Phudu-Bold',
    color: BRAND_COLORS.primary.xanhReu,
    marginBottom: 16,
  },
});