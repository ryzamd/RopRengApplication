import { Stack } from 'expo-router';
import { ORDER_DETAIL_STRINGS } from '../src/presentation/screens/OrderDetailScreen/OrderDetailConstants';
import OrderDetailScreen from '../src/presentation/screens/OrderDetailScreen/OrderDetailScreen';

export default function OrderDetailRoute() {
  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          title: ORDER_DETAIL_STRINGS.TITLE,
          // headerBackTitle: 'Quay lại',
        }}
      />
      <OrderDetailScreen />
    </>
  );
}