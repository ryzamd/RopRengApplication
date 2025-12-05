import { StyleSheet } from 'react-native';
import { BRAND_COLORS } from '../../theme/colors';
import { MORE_LAYOUT } from './MoreLayout';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BRAND_COLORS.background.paper,
  },
  // Header
  headerContainer: {
    backgroundColor: BRAND_COLORS.primary.xanhReu,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: BRAND_COLORS.primary.xanhBo,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontFamily: 'Phudu-Bold',
    fontSize: 18,
    color: BRAND_COLORS.text.inverse,
  },

  // Sections Wrapper
  sectionContainer: {
    backgroundColor: BRAND_COLORS.background.default,
    marginBottom: MORE_LAYOUT.SECTION_SPACING,
    paddingVertical: 16,
  },
  sectionTitle: {
    fontFamily: 'Phudu-Bold',
    fontSize: 16,
    color: '#333',
    marginLeft: 16,
    marginBottom: 8,
  },

  // Utility Grid
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  gridItem: {
    width: `${100 / MORE_LAYOUT.GRID_COLUMNS}%`,
    height: MORE_LAYOUT.GRID_ITEM_HEIGHT,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    backgroundColor: BRAND_COLORS.primary.xanhBo,
    borderColor: BRAND_COLORS.primary.xanhReu,
    borderWidth: 2,
  },
  gridLabel: {
    fontFamily: 'SpaceGrotesk-Regular',
    fontSize: 11,
    color: '#333',
    textAlign: 'center',
    lineHeight: 14,
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: 'red',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#FFF',
  },
  badgeText: {
    color: '#FFF',
    fontSize: 9,
    fontWeight: 'bold',
  },

  // Menu List
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: MORE_LAYOUT.MENU_ITEM_HEIGHT,
    backgroundColor: BRAND_COLORS.background.default,
  },
  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
    marginLeft: 56, // Thụt vào thẳng hàng với text
  },
  menuIcon: {
    width: 24,
    marginRight: 16,
  },
  menuLabel: {
    flex: 1,
    fontFamily: 'SpaceGrotesk-Medium',
    fontSize: 15,
    color: '#333',
  },
  destructiveText: {
    color: '#D32F2F', // Màu đỏ cho logout
  },

  // Footer
  footerContainer: {
    paddingVertical: 24,
    alignItems: 'center',
  },
  versionText: {
    fontFamily: 'SpaceMono-Regular',
    fontSize: 12,
    color: '#999',
  },
});