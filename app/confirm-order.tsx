import { Stack } from "expo-router";
import { CONFIRM_ORDER_TEXT } from "../src/presentation/screens/confirm-order/ConfirmOrderConstants";
import ConfirmOrderScreen from "../src/presentation/screens/confirm-order/ConfirmOrderScreen";

export default function ConfirmOrderRoute() {
    return (
        <>
            <Stack.Screen
                options={{
                    headerShown: true,
                    title: CONFIRM_ORDER_TEXT.SCREEN_TITLE,
                    headerTitleAlign: "center",
                    animation: 'slide_from_right',
                }}
            />
            <ConfirmOrderScreen />
        </>
    );
}
