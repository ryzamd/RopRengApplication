import { router } from 'expo-router';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { clearConfirmedOrder, SerializableConfirmOrderItem } from '../../../state/slices/confirmOrder';
import { clearCart } from '../../../state/slices/orderCart';
import { RootState } from '../../../state/store';
import { useAppDispatch, useAppSelector } from '../../../utils/hooks';
import { AppIcon } from '../../components/shared/AppIcon';
import { BRAND_COLORS } from '../../theme/colors';
import { TYPOGRAPHY } from '../../theme/typography';
import { OrderType } from '../preorder/PreOrderEnums';

// Shared order components
import {
    OrderAddressCard,
    OrderDisplayItem,
    OrderFooter,
    OrderPriceSection,
    OrderProductList,
} from '../../components/order';

// Screen-specific
import { CONFIRM_ORDER_TEXT, PAYMENT_METHOD_LABELS } from './ConfirmOrderConstants';
import { ConfirmOrderLayout } from './ConfirmOrderLayout';

// Edit bottom sheet (reuse from preorder)
import { PreOrderProductItemEditBottomSheet, PreOrderProductItemEditRef } from '../preorder/components/PreOrderProductItemEditBottomSheet';

/**
 * Confirm Order Screen
 * Full-screen display of order details from Confirm Order API response.
 * Allows editing products and address, then confirming the order.
 */
export default function ConfirmOrderScreen() {
    const insets = useSafeAreaInsets();
    const dispatch = useAppDispatch();
    const editProductModalRef = useRef<PreOrderProductItemEditRef>(null);

    // Get confirmed order from Redux state
    const { confirmedOrder, isLoading, error } = useAppSelector((state) => state.confirmOrder);
    const deliveryAddress = useSelector((state: RootState) => state.delivery.selectedAddress);
    const cartItems = useAppSelector((state) => state.orderCart.items);

    const [isConfirming, setIsConfirming] = useState(false);

    // Determine order type from payment method or default
    const orderType = useMemo(() => {
        if (confirmedOrder?.address) {
            return OrderType.DELIVERY;
        }
        return OrderType.TAKEAWAY;
    }, [confirmedOrder]);

    // Transform confirmed order items to OrderDisplayItem format
    const displayItems: OrderDisplayItem[] = useMemo(() => {
        if (!confirmedOrder?.items) return [];

        return confirmedOrder.items.map((item: SerializableConfirmOrderItem) => ({
            id: item.id,
            name: item.name || `Sản phẩm #${item.menuItemId}`,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: item.totalPrice,
            options: {
                size: item.options.size,
                ice: item.options.ice,
                sweetness: item.options.sweetness,
                toppings: item.options.toppings.map(t => ({
                    id: t.id,
                    name: t.name || '',
                    price: t.price,
                })),
            },
            originalItem: item,
        }));
    }, [confirmedOrder]);

    // Format address for display
    const formattedAddress = useMemo(() => {
        if (deliveryAddress?.addressString) {
            const parts = deliveryAddress.addressString.split(',');
            return {
                name: parts[0]?.trim() || deliveryAddress.addressString,
                full: deliveryAddress.addressString,
            };
        }
        if (confirmedOrder?.address?.detail) {
            const parts = confirmedOrder.address.detail.split(',');
            return {
                name: parts[0]?.trim() || confirmedOrder.address.detail,
                full: confirmedOrder.address.detail,
            };
        }
        return null;
    }, [deliveryAddress, confirmedOrder]);

    // Calculate totals
    const totals = useMemo(() => {
        if (!confirmedOrder) {
            return { subtotal: 0, shippingFee: 0, discountAmount: 0, finalAmount: 0, totalItems: 0 };
        }
        return {
            subtotal: confirmedOrder.subtotal,
            shippingFee: confirmedOrder.deliveryFee,
            discountAmount: confirmedOrder.discountAmount,
            finalAmount: confirmedOrder.finalAmount,
            totalItems: displayItems.reduce((sum, item) => sum + item.quantity, 0),
        };
    }, [confirmedOrder, displayItems]);

    // Handle back navigation
    const handleBack = useCallback(() => {
        router.back();
    }, []);

    // Handle address change
    const handleNavigateToAddress = useCallback(() => {
        router.push('/address-management');
    }, []);

    // Handle add more products
    const handleAddMore = useCallback(() => {
        router.push('/(tabs)/order');
    }, []);

    // Handle edit product - find corresponding cart item
    const handleEditProduct = useCallback((displayItem: OrderDisplayItem) => {
        // Find matching cart item to edit
        const cartItem = cartItems.find(item => {
            // Match by menu item ID if available
            const originalItem = displayItem.originalItem as SerializableConfirmOrderItem | undefined;
            if (originalItem?.menuItemId) {
                return item.product.id === originalItem.menuItemId.toString();
            }
            return false;
        });

        if (cartItem) {
            editProductModalRef.current?.present(cartItem);
        } else {
            Alert.alert('Thông báo', 'Không thể chỉnh sửa sản phẩm này');
        }
    }, [cartItems]);

    // Handle promotion press - show notice that voucher cannot be changed
    const handlePromotionPress = useCallback(() => {
        Alert.alert('Thông báo', CONFIRM_ORDER_TEXT.VOUCHER_NOTICE);
    }, []);

    // Handle confirm order - navigate to Order History (TODO: bank payment)
    const handleConfirmOrder = useCallback(async () => {
        if (!confirmedOrder) return;

        setIsConfirming(true);

        try {
            // TODO: Call bank payment API when ready
            // For now, just navigate to Order History

            Alert.alert(
                CONFIRM_ORDER_TEXT.CONFIRM_SUCCESS_TITLE,
                CONFIRM_ORDER_TEXT.CONFIRM_SUCCESS_MESSAGE,
                [
                    {
                        text: 'OK',
                        onPress: () => {
                            dispatch(clearCart());
                            dispatch(clearConfirmedOrder());
                            router.replace('/order-history');
                        },
                    },
                ]
            );
        } catch (err) {
            Alert.alert(CONFIRM_ORDER_TEXT.CONFIRM_ERROR_TITLE, 'Không thể xác nhận đơn hàng');
        } finally {
            setIsConfirming(false);
        }
    }, [confirmedOrder, dispatch]);

    // Loading state
    if (isLoading) {
        return (
            <ConfirmOrderLayout>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={BRAND_COLORS.primary.xanhReu} />
                    <Text style={styles.loadingText}>{CONFIRM_ORDER_TEXT.LOADING_MESSAGE}</Text>
                </View>
            </ConfirmOrderLayout>
        );
    }

    // Error or no order state
    if (!confirmedOrder || error) {
        return (
            <ConfirmOrderLayout>
                <View style={styles.header}>
                    <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                        <AppIcon name="arrow-back" size={24} color={BRAND_COLORS.text.primary} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>{CONFIRM_ORDER_TEXT.SCREEN_TITLE}</Text>
                    <View style={styles.headerRight} />
                </View>
                <View style={styles.errorContainer}>
                    <Text style={styles.errorTitle}>{CONFIRM_ORDER_TEXT.NO_ORDER_TITLE}</Text>
                    <Text style={styles.errorMessage}>{error || CONFIRM_ORDER_TEXT.NO_ORDER_MESSAGE}</Text>
                    <TouchableOpacity style={styles.retryButton} onPress={handleBack}>
                        <Text style={styles.retryButtonText}>{CONFIRM_ORDER_TEXT.BACK_BUTTON}</Text>
                    </TouchableOpacity>
                </View>
            </ConfirmOrderLayout>
        );
    }

    return (
        <ConfirmOrderLayout>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                    <AppIcon name="arrow-back" size={24} color={BRAND_COLORS.text.primary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{CONFIRM_ORDER_TEXT.SCREEN_TITLE}</Text>
                <View style={styles.headerRight} />
            </View>

            {/* Scrollable Content */}
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={[styles.contentContainer, { paddingBottom: 200 }]}
                showsVerticalScrollIndicator={false}
            >
                {/* Address Card (only for delivery) */}
                <OrderAddressCard
                    orderType={orderType}
                    address={formattedAddress}
                    onChangeAddress={handleNavigateToAddress}
                    editable={true}
                />

                {/* Product List */}
                <OrderProductList
                    items={displayItems}
                    onItemPress={handleEditProduct}
                    onAddMore={handleAddMore}
                    showAddButton={true}
                    editable={true}
                />

                {/* Price Section */}
                <OrderPriceSection
                    subtotal={totals.subtotal}
                    shippingFee={totals.shippingFee}
                    discountAmount={totals.discountAmount}
                    onPromotionPress={handlePromotionPress}
                    showPromotionButton={false}
                />

                {/* Payment Method Display */}
                <View style={styles.paymentSection}>
                    <Text style={styles.paymentTitle}>{CONFIRM_ORDER_TEXT.PAYMENT_SECTION_TITLE}</Text>
                    <View style={styles.paymentCard}>
                        <AppIcon name="card-outline" size={24} color={BRAND_COLORS.primary.xanhReu} />
                        <Text style={styles.paymentMethod}>
                            {PAYMENT_METHOD_LABELS[confirmedOrder.paymentMethod] || confirmedOrder.paymentMethod}
                        </Text>
                    </View>
                </View>
            </ScrollView>

            {/* Footer */}
            <View style={[styles.footerContainer, { paddingBottom: insets.bottom }]}>
                <OrderFooter
                    orderType={orderType}
                    totalItems={totals.totalItems}
                    totalPrice={totals.finalAmount}
                    buttonText={CONFIRM_ORDER_TEXT.CONFIRM_BUTTON}
                    onButtonPress={handleConfirmOrder}
                    isLoading={isConfirming}
                />
            </View>

            {/* Edit Product Modal */}
            <PreOrderProductItemEditBottomSheet ref={editProductModalRef} />
        </ConfirmOrderLayout>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 56,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: BRAND_COLORS.border.light,
        backgroundColor: BRAND_COLORS.background.primary,
    },
    backButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    headerTitle: {
        fontSize: TYPOGRAPHY.fontSize.md,
        fontFamily: TYPOGRAPHY.fontFamily.bodyBold,
        color: BRAND_COLORS.text.primary,
    },
    headerRight: {
        width: 40,
    },
    scrollView: {
        flex: 1,
    },
    contentContainer: {
        padding: 16,
        gap: 20,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 12,
        fontSize: TYPOGRAPHY.fontSize.base,
        fontFamily: TYPOGRAPHY.fontFamily.bodyRegular,
        color: BRAND_COLORS.text.secondary,
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 32,
    },
    errorTitle: {
        fontSize: TYPOGRAPHY.fontSize.lg,
        fontFamily: TYPOGRAPHY.fontFamily.bodyBold,
        color: BRAND_COLORS.text.primary,
        marginBottom: 8,
    },
    errorMessage: {
        fontSize: TYPOGRAPHY.fontSize.base,
        fontFamily: TYPOGRAPHY.fontFamily.bodyRegular,
        color: BRAND_COLORS.text.secondary,
        textAlign: 'center',
        marginBottom: 24,
    },
    retryButton: {
        paddingHorizontal: 24,
        paddingVertical: 12,
        backgroundColor: BRAND_COLORS.primary.xanhReu,
        borderRadius: 12,
    },
    retryButtonText: {
        fontSize: TYPOGRAPHY.fontSize.base,
        fontFamily: TYPOGRAPHY.fontFamily.bodyMedium,
        color: BRAND_COLORS.text.inverse,
    },
    paymentSection: {
        gap: 12,
    },
    paymentTitle: {
        fontSize: TYPOGRAPHY.fontSize.md,
        fontFamily: TYPOGRAPHY.fontFamily.bodyBold,
        color: BRAND_COLORS.text.primary,
    },
    paymentCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: BRAND_COLORS.background.primary,
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: BRAND_COLORS.border.light,
        gap: 12,
    },
    paymentMethod: {
        fontSize: TYPOGRAPHY.fontSize.base,
        fontFamily: TYPOGRAPHY.fontFamily.bodyMedium,
        color: BRAND_COLORS.text.primary,
    },
    footerContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
    },
});
