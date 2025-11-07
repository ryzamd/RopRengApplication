import { Tabs } from 'expo-router';
import { StyleSheet, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BRAND_COLORS } from '../../src/presentation/theme/colors';

export default function MainLayout() {
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
        name="rewards"
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
  return <Text style={{ fontSize: 24, color }}>{icons[name] || '•'}</Text>;
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: BRAND_COLORS.background.white,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
    paddingTop: 8,
  },
  tabBarLabel: {
    fontSize: 12,
    fontFamily: 'SpaceGrotesk-Medium',
  },
});