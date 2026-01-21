import { selectSelectedAddress } from '@/src/state/slices/deliverySlice';
import { BottomSheetBackdrop, BottomSheetFooter, BottomSheetModal, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { BottomSheetDefaultBackdropProps } from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types';
import { BottomSheetFooterProps } from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheetFooter/types';
import { router, useFocusEffect } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PreOrderItem } from '../../../domain/entities/PreOrder';
import { confirmOrder } from '../../../state/slices/confirmOrderSlice';
import { clearCart } from '../../../state/slices/orderCartSlice';
import { createPreOrder } from '../../../state/slices/preOrderSlice';
import { useAppDispatch, useAppSelector } from '../../../utils/hooks';
import { AppIcon } from '../../components/shared/AppIcon';
import { Toast } from '../../components/shared/Toast';
import { BRAND_COLORS } from '../../theme/colors';
import { TYPOGRAPHY } from '../../theme/typography';
import { CartItem } from '../order/OrderInterfaces';
import { PREORDER_TEXT } from './PreOrderConstants';
import { OrderType, PaymentMethod } from './PreOrderEnums';
import { PreOrderBottomSheetProps, PreOrderState } from './PreOrderInterfaces';
import { PREORDER_LAYOUT } from './PreOrderLayout';
import { PreOrderService } from './PreOrderService';
import { OrderTypeModal } from './components/OrderTypeModal';
import { OrderTypeSelector } from './components/OrderTypeSelector';
import { PaymentTypeModal } from './components/PaymentTypeModal';
import { PaymentTypeSelector } from './components/PaymentTypeSelector';
import { PreOrderAddressCard } from './components/PreOrderAddressCard';
import { PreOrderFooter } from './components/PreOrderFooter';
import { PreOrderProductItemEditBottomSheet, PreOrderProductItemEditRef } from './components/PreOrderProductItemEditBottomSheet';
import { PreOrderProductList } from './components/PreOrderProductList';
import { PreOrderTotalPrice } from './components/PreOrderTotalPrice';

export default function PreOrderBottomSheet({ visible, onClose, onOrderSuccess }: PreOrderBottomSheetProps) {
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const orderTypeModalRef = useRef<BottomSheetModal>(null);
  const paymentModalRef = useRef<BottomSheetModal>(null);
  const editProductModalRef = useRef<PreOrderProductItemEditRef>(null);
  const { totalItems, totalPrice, selectedStore } = useAppSelector((state) => state.orderCart);
  const deliveryAddress = useAppSelector(selectSelectedAddress);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  const user = useAppSelector((state) => state.auth.user);
  const cartItems = useAppSelector((state) => state.orderCart.items);
  const { isLoading: isCreatingOrder } = useAppSelector((state) => state.preOrder);

  const [preOrderState, setPreOrderState] = useState<PreOrderState>({
    orderType: OrderType.TAKEAWAY,
    paymentMethod: PaymentMethod.CASH,
    shippingFee: 0,
  });

  const [isNavigatingToAddress, setIsNavigatingToAddress] = useState(false);
  const finalTotal = PreOrderService.calculateTotalPrice(totalPrice, preOrderState.shippingFee);
  const snapPoints = useMemo(() => ['90%'], []);

  useEffect(() => {
    if (visible && !isNavigatingToAddress) {
      bottomSheetRef.current?.present();
    } else if (!visible) {
      bottomSheetRef.current?.dismiss();
    }
  }, [visible, isNavigatingToAddress]);

  useFocusEffect(
    useCallback(() => {
      if (isNavigatingToAddress && visible) {
        const timer = setTimeout(() => {
          bottomSheetRef.current?.present();
          setIsNavigatingToAddress(false);
        }, 100);
        return () => clearTimeout(timer);
      }
    }, [isNavigatingToAddress, visible])
  );

  const handleNavigateToAddress = useCallback(() => {
    setIsNavigatingToAddress(true);
    bottomSheetRef.current?.dismiss();

    setTimeout(() => {
      router.push('/address-management');
    }, 200);
  }, []);

  const renderBackdrop = useCallback(
    (props: BottomSheetDefaultBackdropProps) => (
      <BottomSheetBackdrop {...props} appearsOnIndex={0} disappearsOnIndex={-1} opacity={0.5} pressBehavior="close" />
    ),
    []
  );

  const handleSheetChanges = useCallback(
    (index: number) => {
      if (index === -1 && !isNavigatingToAddress) {
        onClose();
      }
    },
    [onClose, isNavigatingToAddress]
  );

  const handleOrderTypeChange = useCallback(
    (type: OrderType) => {
      const shippingFee = PreOrderService.calculateShippingFee(type, totalPrice);
      setPreOrderState((prev) => ({ ...prev, orderType: type, shippingFee }));
      orderTypeModalRef.current?.dismiss();
    },
    [totalPrice]
  );

  const handlePaymentMethodChange = useCallback((method: PaymentMethod) => {
    setPreOrderState((prev) => ({ ...prev, paymentMethod: method }));
    paymentModalRef.current?.dismiss();
  }, []);

  const handleClearCart = useCallback(() => {
    Alert.alert(PREORDER_TEXT.CONFIRM_CLEAR_TITLE, PREORDER_TEXT.CONFIRM_CLEAR_MESSAGE, [
      {
        text: PREORDER_TEXT.CONFIRM_CLEAR_CANCEL,
        style: 'cancel',
      },
      {
        text: PREORDER_TEXT.CONFIRM_CLEAR_CONFIRM,
        style: 'destructive',
        onPress: () => {
          dispatch(clearCart());
          bottomSheetRef.current?.dismiss();
        },
      },
    ]);
  }, [dispatch]);

  const handlePromotionPress = useCallback(() => {
    Alert.alert('Coming Soon', PREORDER_TEXT.COMING_SOON_MESSAGE);
  }, []);

  const handlePlaceOrder = useCallback(async () => {
    console.log('=== PRE-ORDER DEBUG ===');
    console.log('User:', JSON.stringify(user, null, 2));
    console.log('User UUID:', user?.uuid);
    console.log('Selected Store:', selectedStore);
    console.log('Cart Items Count:', cartItems.length);

    if (preOrderState.orderType === OrderType.DELIVERY && !deliveryAddress) {
      Toast({ message: 'Vui lòng chọn địa chỉ giao hàng', onHide: () => { } });
      return;
    }

    const validation = PreOrderService.validateOrder(
      totalItems,
      selectedStore?.id || null,
      preOrderState.paymentMethod
    );

    if (!validation.valid) {
      Alert.alert('Lỗi', validation.error);
      return;
    }

    if (!user?.uuid) {
      Alert.alert(
        'Debug User Info',
        `User: ${JSON.stringify(user, null, 2)}\n\nAuth: ${isAuthenticated}`
      );
      return;
    }

    if (!selectedStore) {
      Alert.alert('Lỗi', 'Không tìm thấy thông tin cửa hàng');
      return;
    }

    try {
      const items: PreOrderItem[] = cartItems.map(item => ({
        menuItemId: item.product.id,
        quantity: item.quantity,
        size: item.customizations.size,
        ice: item.customizations.ice,
        sweetness: item.customizations.sweetness,
        toppings: item.customizations.toppings,
      }));

      const preOrderPayload = {
        userId: user.uuid,
        orderType: (preOrderState.orderType === OrderType.DELIVERY ? 'DELIVERY' : 'TAKEAWAY') as 'DELIVERY' | 'TAKEAWAY',
        paymentMethod: preOrderState.paymentMethod,
        storeId: typeof selectedStore.id === 'string' ? parseInt(selectedStore.id, 10) : selectedStore.id,
        items,
        promotions: [],
      };

      console.log('=== PRE-ORDER PAYLOAD ===');
      console.log(JSON.stringify(preOrderPayload, null, 2));

      // Step 1: Create pre-order and get preorder_id
      const preOrderResult = await dispatch(createPreOrder(preOrderPayload)).unwrap();

      console.log('=== PRE-ORDER RESPONSE ===');
      console.log(JSON.stringify(preOrderResult, null, 2));

      const preorderId = preOrderResult.preorderId;
      if (!preorderId) {
        throw new Error('Không nhận được mã đơn hàng từ server');
      }

      // Step 2: Call Confirm Order API
      console.log('=== CALLING CONFIRM ORDER API ===');
      console.log('Preorder ID:', preorderId);

      const confirmResult = await dispatch(confirmOrder({ preorderId })).unwrap();

      console.log('=== CONFIRM ORDER RESPONSE ===');
      console.log(JSON.stringify(confirmResult, null, 2));

      // Step 3: Dismiss bottom sheet and navigate to Confirm Order screen
      // All payment types go to confirm screen for double-checking before final submission
      bottomSheetRef.current?.dismiss();

      // Navigate to Confirm Order screen for all orders
      // User will review and confirm the order on this screen
      router.push('../confirm-order');

      onOrderSuccess();
    } catch (error) {
      console.error('=== ORDER ERROR ===', error);
      Alert.alert('Lỗi', (error as string) || 'Không thể tạo đơn hàng');
    }
  }, [totalItems, selectedStore, preOrderState, dispatch, onOrderSuccess, deliveryAddress, user, cartItems, isAuthenticated]);

  const handleAddMore = useCallback(() => {
    bottomSheetRef.current?.dismiss();
    router.push('/(tabs)/order');
  }, []);

  const handleEditProduct = useCallback((item: CartItem) => {
    editProductModalRef.current?.present(item);
  }, []);

  const renderFooter = useCallback(
    (props: BottomSheetFooterProps) => (
      <BottomSheetFooter {...props} bottomInset={0}>
        <PreOrderFooter
          orderType={preOrderState.orderType}
          totalItems={totalItems}
          totalPrice={finalTotal}
          onPlaceOrder={handlePlaceOrder}
          isLoading={isCreatingOrder}
        />
      </BottomSheetFooter>
    ),
    [preOrderState.orderType, totalItems, finalTotal, handlePlaceOrder, isCreatingOrder]
  );

  return (
    <>
      <BottomSheetModal
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        backdropComponent={renderBackdrop}
        onChange={handleSheetChanges}
        enablePanDownToClose={true}
        enableDismissOnClose={true}
        enableDynamicSizing={false}
        enableContentPanningGesture={false}
        enableHandlePanningGesture={true}
        animateOnMount={true}
        handleIndicatorStyle={styles.indicator}
        backgroundStyle={styles.background}
        topInset={insets.top}
        bottomInset={0}
        footerComponent={renderFooter}
        stackBehavior="push"
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={handleClearCart} activeOpacity={0.7}>
            <Text style={styles.clearText}>{PREORDER_TEXT.CLEAR_BUTTON}</Text>
          </TouchableOpacity>

          <Text style={styles.title}>{PREORDER_TEXT.TITLE}</Text>

          <TouchableOpacity onPress={() => bottomSheetRef.current?.dismiss()} style={styles.closeButton} activeOpacity={0.7}>
            <AppIcon name="close" size={PREORDER_LAYOUT.HEADER_BUTTON_SIZE} color={BRAND_COLORS.text.secondary} />
          </TouchableOpacity>
        </View>

        <BottomSheetScrollView contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
          <OrderTypeSelector
            selectedType={preOrderState.orderType}
            onPress={() => orderTypeModalRef.current?.present()}
          />

          <PreOrderAddressCard
            orderType={preOrderState.orderType}
            onNavigateToMap={handleNavigateToAddress}
          />

          <PreOrderProductList
            handleAddMore={handleAddMore}
            onItemPress={handleEditProduct}
          />

          <PreOrderTotalPrice
            subtotal={totalPrice}
            shippingFee={preOrderState.shippingFee}
            onPromotionPress={handlePromotionPress}
          />

          <PaymentTypeSelector selectedMethod={preOrderState.paymentMethod} onPress={() => paymentModalRef.current?.present()} />
        </BottomSheetScrollView>
      </BottomSheetModal>

      <OrderTypeModal ref={orderTypeModalRef} selectedType={preOrderState.orderType} onSelectType={handleOrderTypeChange} />

      <PaymentTypeModal ref={paymentModalRef} selectedMethod={preOrderState.paymentMethod} onSelectMethod={handlePaymentMethodChange} />

      <PreOrderProductItemEditBottomSheet ref={editProductModalRef} />
    </>
  );
}

const styles = StyleSheet.create({
  background: {
    backgroundColor: BRAND_COLORS.background.default,
    borderTopLeftRadius: PREORDER_LAYOUT.SHEET_BORDER_RADIUS,
    borderTopRightRadius: PREORDER_LAYOUT.SHEET_BORDER_RADIUS,
  },
  indicator: {
    backgroundColor: BRAND_COLORS.border.medium,
    width: 40,
    height: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: PREORDER_LAYOUT.HEADER_HEIGHT,
    paddingHorizontal: PREORDER_LAYOUT.HEADER_PADDING_HORIZONTAL,
    borderBottomWidth: 1,
    borderBottomColor: BRAND_COLORS.border.light,
  },
  clearText: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontFamily: TYPOGRAPHY.fontFamily.bodyMedium,
    color: BRAND_COLORS.text.secondary,
  },
  title: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontFamily: TYPOGRAPHY.fontFamily.bodyBold,
    color: BRAND_COLORS.text.primary,
  },
  closeButton: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    padding: PREORDER_LAYOUT.SECTION_PADDING_HORIZONTAL,
    paddingBottom: 200,
    gap: PREORDER_LAYOUT.SECTION_MARGIN_TOP,
  },
});