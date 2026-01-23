import { Stack } from "expo-router";
import { ORDER_HISTORY_STRINGS } from "../src/presentation/screens/order-history/OrderHistoryConstants";
import OrderHistoryScreen from "../src/presentation/screens/order-history/OrderHistoryScreen";

export default function OrderHistoryRoute() {
  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          title: ORDER_HISTORY_STRINGS.TITLE,
          headerTitleAlign: "center",
        }}
      />
      <OrderHistoryScreen />
    </>
  );
}
