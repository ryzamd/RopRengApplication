import { Stack } from "expo-router";
import { ORDER_HISTORY_STRINGS } from "../src/presentation/screens/OrderHistoryScreen/OrderHistoryConstants";
import OrderHistoryScreen from "../src/presentation/screens/OrderHistoryScreen/OrderHistoryScreen";

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
