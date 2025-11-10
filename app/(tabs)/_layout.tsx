import { Tabs } from 'expo-router';
import { StyleSheet, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BRAND_COLORS } from '../../src/presentation/theme/colors';

/**
 * Bottom Tabs Layout - 5 tabs chính
 * 
 * Chỉ 5 tabs hiển thị:
 * 1. Trang chủ (index)
 * 2. Đặt hàng (order)
 * 3. Cửa hàng (stores)
 * 4. Ưu đãi (deals)
 * 5. Khác (more)
 * 
 * Routes phụ (welcome, search, login) dùng href: null để ẩn khỏi tab bar
 * Tham chiếu: https://docs.expo.dev/router/advanced/tabs/#hiding-a-tab
 */
export default function TabsLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: BRAND_COLORS.secondary.nauEspresso,
        tabBarInactiveTintColor: '#999999',
        tabBarStyle: {
          ...styles.tabBar,
          height: 60 + insets.bottom,
          paddingBottom: insets.bottom,
        },
        tabBarLabelStyle: styles.tabBarLabel,
      }}
    >
      {/* 5 TABS CHÍNH */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Trang chủ',
          tabBarIcon: ({ color }) => <TabIcon name="home" color={color} />,
        }}
      />
      <Tabs.Screen
        name="order"
        options={{
          title: 'Đặt hàng',
          tabBarIcon: ({ color }) => <TabIcon name="coffee" color={color} />,
        }}
      />
      <Tabs.Screen
        name="stores"
        options={{
          title: 'Cửa hàng',
          tabBarIcon: ({ color }) => <TabIcon name="store" color={color} />,
        }}
      />
      <Tabs.Screen
        name="deals"
        options={{
          title: 'Ưu đãi',
          tabBarIcon: ({ color }) => <TabIcon name="ticket" color={color} />,
        }}
      />
      <Tabs.Screen
        name="more"
        options={{
          title: 'Khác',
          tabBarIcon: ({ color }) => <TabIcon name="menu" color={color} />,
        }}
      />

      {/* ROUTES PHỤ - ẨN KHỎI TAB BAR */}
      <Tabs.Screen
        name="welcome"
        options={{
          href: null, // Ẩn khỏi tab bar
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          href: null, // Ẩn khỏi tab bar
        }}
      />
    </Tabs>
  );
}

function TabIcon({ name, color }: { name: string; color: string }) {
  const icons: Record<string, string> = {
    home: '🏠',
    coffee: '☕',
    store: '🏪',
    ticket: '🎫',
    menu: '☰',
  };
  return <Text style={{ fontSize: 18, color }}>{icons[name] || '•'}</Text>;
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: BRAND_COLORS.background.white,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
    paddingTop: 4,
  },
  tabBarLabel: {
    fontSize: 10,
    fontFamily: 'SpaceGrotesk-Medium',
  },
});