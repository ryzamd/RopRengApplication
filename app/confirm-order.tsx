import { Stack } from "expo-router";
import { CONFIRM_ORDER_TEXT } from "../src/presentation/screens/ConfirmOrderScreen/ConfirmOrderConstants";
import ConfirmOrderScreen from "../src/presentation/screens/ConfirmOrderScreen/ConfirmOrderScreen";

export default function ConfirmOrderRoute() {
    return (
        <>
            <Stack.Screen
                options={{
                    headerShown: true,
                    title: CONFIRM_ORDER_TEXT.SCREEN_TITLE,
                    animation: 'slide_from_right',
                }}
            />
            <ConfirmOrderScreen />
        </>
    );
}
