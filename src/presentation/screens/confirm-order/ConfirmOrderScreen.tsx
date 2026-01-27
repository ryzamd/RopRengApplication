import { router } from 'expo-router';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { clearConfirmedOrder, SerializableConfirmOrderItem, submitOrder } from '../../../state/slices/confirmOrderSlice';
import { selectSelectedAddress } from '../../../state/slices/deliverySlice';
import { clearCart } from '../../../state/slices/orderCartSlice';
import { useAppDispatch, useAppSelector } from '../../../utils/hooks';
import { OrderAddressCard, OrderDisplayItem, OrderFooter, OrderPriceSection, OrderProductList } from '../../components/order';
import { AppIcon } from '../../components/shared/AppIcon';
import { BaseAuthenticatedLayout } from '../../layouts/BaseAuthenticatedLayout';
import { popupService } from '../../layouts/popup/PopupService';
import { BRAND_COLORS } from '../../theme/colors';
import { TYPOGRAPHY } from '../../theme/typography';
import { PreOrderProductItemEditBottomSheet, PreOrderProductItemEditRef } from '../preorder/components/PreOrderProductItemEditBottomSheet';
import { OrderType, PaymentMethod } from '../preorder/PreOrderEnums';
import { PreOrderState } from '../preorder/PreOrderInterfaces';
import { PreOrderService } from '../preorder/PreOrderService';
import { CONFIRM_ORDER_TEXT, PAYMENT_METHOD_LABELS } from './ConfirmOrderConstants';

export default function ConfirmOrderScreen() {
    const insets = useSafeAreaInsets();
    const dispatch = useAppDispatch();
    const editProductModalRef = useRef<PreOrderProductItemEditRef>(null);

    const { confirmedOrder, isLoading, error } = useAppSelector((state) => state.confirmOrder);
    const deliveryAddress = useAppSelector(selectSelectedAddress);
    const cartItems = useAppSelector((state) => state.orderCart.items);
    const [isConfirming, setIsConfirming] = useState(false);

    const orderType = useMemo(() => {
        if (confirmedOrder?.address) {
            return OrderType.DELIVERY;
        }
        return OrderType.TAKEAWAY;
    }, [confirmedOrder]);

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

    const handleBack = useCallback(() => {
        router.back();
    }, []);

    const handleNavigateToAddress = useCallback(() => {
        router.push('/address-management');
    }, []);

    const handleAddMore = useCallback(() => {
        router.push('/(tabs)/order');
    }, []);

    const handleEditProduct = useCallback((displayItem: OrderDisplayItem) => {
        const cartItem = cartItems.find(item => {
            const originalItem = displayItem.originalItem as SerializableConfirmOrderItem | undefined;
            if (originalItem?.menuItemId) {
                return item.product.id === originalItem.menuItemId.toString();
            }
            return false;
        });

        if (cartItem) {
            editProductModalRef.current?.present(cartItem);
        } else {
            popupService.alert('Thông báo', { title: 'Không thể chỉnh sửa sản phẩm này' });
        }
    }, [cartItems]);

    const handlePromotionPress = useCallback(() => {
        popupService.alert(CONFIRM_ORDER_TEXT.VOUCHER_NOTICE, { title: 'Thông báo' });
    }, []);

    const user = useAppSelector(state => state.auth.user);
    const selectedStore = useAppSelector(state => state.home.store);

    const handleConfirmOrder = useCallback(async () => {
        if (!confirmedOrder || !user || !selectedStore) {
            popupService.alert('Thiếu thông tin đơn hàng', { type: 'error' });
            return;
        }

        setIsConfirming(true);
        popupService.loading(true, 'Đang xác nhận đơn hàng...');

        try {
            const currentPreOrderState: PreOrderState = {
                orderType: orderType,
                paymentMethod: (confirmedOrder.paymentMethod as PaymentMethod) || PaymentMethod.CASH,
                shippingFee: confirmedOrder.deliveryFee
            };

            const payload = PreOrderService.createPreOrderPayload(
                { uuid: user.uuid, displayName: user.displayName },
                selectedStore,
                deliveryAddress,
                cartItems,
                currentPreOrderState
            );

            await dispatch(submitOrder(payload)).unwrap();

            popupService.loading(false);

            await popupService.alert(CONFIRM_ORDER_TEXT.CONFIRM_SUCCESS_MESSAGE, {
                title: CONFIRM_ORDER_TEXT.CONFIRM_SUCCESS_TITLE,
                buttonText: 'OK'
            });

            dispatch(clearCart());
            dispatch(clearConfirmedOrder());
            router.replace('/order-history');

        } catch (err) {
            console.error(err);
            popupService.loading(false);
            popupService.alert((err as string) || 'Không thể xác nhận đơn hàng', {
                title: CONFIRM_ORDER_TEXT.CONFIRM_ERROR_TITLE,
                type: 'error'
            });
        } finally {
            setIsConfirming(false);
        }
    }, [confirmedOrder, dispatch, user, selectedStore, deliveryAddress, cartItems, orderType]);



    if (isLoading) {
        return (
            <BaseAuthenticatedLayout safeAreaEdges={['left', 'right']}>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={BRAND_COLORS.primary.xanhReu} />
                    <Text style={styles.loadingText}>{CONFIRM_ORDER_TEXT.LOADING_MESSAGE}</Text>
                </View>
            </BaseAuthenticatedLayout>
        );
    }

    if (!confirmedOrder || error) {
        return (
            <BaseAuthenticatedLayout safeAreaEdges={['left', 'right']}>
                <View style={styles.errorContainer}>
                    <Text style={styles.errorTitle}>{CONFIRM_ORDER_TEXT.NO_ORDER_TITLE}</Text>
                    <Text style={styles.errorMessage}>{error || CONFIRM_ORDER_TEXT.NO_ORDER_MESSAGE}</Text>
                    <TouchableOpacity style={styles.retryButton} onPress={handleBack}>
                        <Text style={styles.retryButtonText}>{CONFIRM_ORDER_TEXT.BACK_BUTTON}</Text>
                    </TouchableOpacity>
                </View>
            </BaseAuthenticatedLayout>
        );
    }

    return (
        <BaseAuthenticatedLayout safeAreaEdges={['left', 'right']}>
            <View style={{ flex: 1 }}>
                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={[styles.contentContainer, { paddingBottom: 200 }]}
                    showsVerticalScrollIndicator={false}
                >
                    <OrderAddressCard
                        orderType={orderType}
                        address={formattedAddress}
                        onChangeAddress={handleNavigateToAddress}
                        editable={true}
                    />

                    <OrderProductList
                        items={displayItems}
                        onItemPress={handleEditProduct}
                        onAddMore={handleAddMore}
                        showAddButton={true}
                        editable={true}
                    />

                    <OrderPriceSection
                        subtotal={totals.subtotal}
                        shippingFee={totals.shippingFee}
                        discountAmount={totals.discountAmount}
                        onPromotionPress={handlePromotionPress}
                        showPromotionButton={false}
                    />

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

                <View style={[styles.footerContainer]}>
                    <OrderFooter
                        orderType={orderType}
                        totalItems={totals.totalItems}
                        totalPrice={totals.finalAmount}
                        buttonText={CONFIRM_ORDER_TEXT.CONFIRM_BUTTON}
                        onButtonPress={handleConfirmOrder}
                        isLoading={isConfirming}
                    />
                </View>
            </View>

            <PreOrderProductItemEditBottomSheet ref={editProductModalRef} />
        </BaseAuthenticatedLayout>
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
        backgroundColor: BRAND_COLORS.background.default,
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
