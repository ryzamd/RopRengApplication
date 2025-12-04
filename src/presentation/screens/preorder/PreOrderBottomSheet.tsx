import { BottomSheetBackdrop, BottomSheetFooter, BottomSheetModal, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { BottomSheetDefaultBackdropProps } from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types';
import { BottomSheetFooterProps } from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheetFooter/types';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Alert, Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { clearCart, removeItem } from '../../../state/slices/orderCart';
import { useAppDispatch, useAppSelector } from '../../../utils/hooks';
import { AppIcon } from '../../components/shared/AppIcon';
import { BRAND_COLORS } from '../../theme/colors';
import { TYPOGRAPHY } from '../../theme/typography';
import { PREORDER_TEXT } from './PreOrderConstants';
import { OrderType, PaymentMethod } from './PreOrderEnums';
import { PreOrderBottomSheetProps, PreOrderState } from './PreOrderInterfaces';
import { PREORDER_LAYOUT } from './PreOrderLayout';
import { PreOrderService } from './PreOrderService';
import { OrderTypeModal } from './components/OrderTypeModal';
import { OrderTypeSelector } from './components/OrderTypeSelector';
import { PaymentTypeModal } from './components/PaymentTypeModal';
import { PaymentTypeSelector } from './components/PaymentTypeSelector';
import { PreOrderFooter } from './components/PreOrderFooter';
import { PreOrderProductList } from './components/PreOrderProductList';
import { PreOrderTotalPrice } from './components/PreOrderTotalPrice';

const WINDOW_HEIGHT = Dimensions.get('window').height;
const MODAL_HEIGHT = WINDOW_HEIGHT;

export default function PreOrderBottomSheet({visible, onClose, onOrderSuccess}: PreOrderBottomSheetProps) {
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();
  const router = useRouter();
  
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const orderTypeModalRef = useRef<BottomSheetModal>(null);
  const paymentModalRef = useRef<BottomSheetModal>(null);
  
  const { items, totalItems, totalPrice, selectedStore } = useAppSelector(
    (state) => state.orderCart
  );
  
  const [preOrderState, setPreOrderState] = useState<PreOrderState>({
    orderType: OrderType.TAKEAWAY,
    paymentMethod: PaymentMethod.CASH,
    shippingFee: 0,
  });

  const finalTotal = PreOrderService.calculateTotalPrice(
    totalPrice,
    preOrderState.shippingFee
  );
  
  const snapPoints = useMemo(() => [MODAL_HEIGHT], []);
  
  useEffect(() => {
    if (visible) {
      bottomSheetRef.current?.present();
    } else {
      bottomSheetRef.current?.dismiss();
    }
  }, [visible]);
  
  const renderBackdrop = useCallback(
    (props: BottomSheetDefaultBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        opacity={0.5}
        pressBehavior="close"
      />
    ),
    []
  );

  const handleSheetChanges = useCallback((index: number) => {
    if (index === -1) {
      onClose();
    }
  }, [onClose]);
  
  const handleOrderTypeChange = useCallback((type: OrderType) => {
    const shippingFee = PreOrderService.calculateShippingFee(type, totalPrice);
    setPreOrderState((prev) => ({ ...prev, orderType: type, shippingFee }));
    orderTypeModalRef.current?.dismiss();
  }, [totalPrice]);
  
  const handlePaymentMethodChange = useCallback((method: PaymentMethod) => {
    setPreOrderState((prev) => ({ ...prev, paymentMethod: method }));
    paymentModalRef.current?.dismiss();
  }, []);
  
  const handleClearCart = useCallback(() => {
    Alert.alert(
      PREORDER_TEXT.CONFIRM_CLEAR_TITLE,
      PREORDER_TEXT.CONFIRM_CLEAR_MESSAGE,
      [
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
      ]
    );
  }, [dispatch]);
  
  const handleEditProduct = useCallback((productId: string) => {
    Alert.alert('Chỉnh sửa', `Editing product ${productId}`);
  }, []);
  
  const handleRemoveProduct = useCallback((productId: string) => {
    dispatch(removeItem(productId));
    if (totalItems <= 1) {
      bottomSheetRef.current?.dismiss();
    }
  }, [dispatch, totalItems]);
  
  const handleAddMore = useCallback(() => {
    bottomSheetRef.current?.dismiss();
    router.push('/(tabs)/order');
  }, [router]);
  
  const handlePromotionPress = useCallback(() => {
    Alert.alert('Coming Soon', PREORDER_TEXT.COMING_SOON_MESSAGE);
  }, []);

  const handlePlaceOrder = useCallback(() => {
    const validation = PreOrderService.validateOrder(
      totalItems,
      selectedStore?.id || null,
      preOrderState.paymentMethod
    );
    
    if (!validation.valid) {
      Alert.alert('Lỗi', validation.error);
      return;
    }
    
    Alert.alert(
      PREORDER_TEXT.ORDER_SUCCESS_TITLE,
      PREORDER_TEXT.ORDER_SUCCESS_MESSAGE,
      [
        {
          text: 'OK',
          onPress: () => {
            dispatch(clearCart());
            bottomSheetRef.current?.dismiss();
            onOrderSuccess();
          },
        },
      ]
    );
  }, [totalItems, selectedStore, preOrderState, dispatch, onOrderSuccess]);

  const renderFooter = useCallback(
    (props: BottomSheetFooterProps) => (
      <BottomSheetFooter {...props} bottomInset={0}>
        <PreOrderFooter
          orderType={preOrderState.orderType}
          totalItems={totalItems}
          totalPrice={finalTotal}
          onPlaceOrder={handlePlaceOrder}
        />
      </BottomSheetFooter>
    ),
    [preOrderState.orderType, totalItems, finalTotal, handlePlaceOrder]
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
        keyboardBehavior="interactive"
        keyboardBlurBehavior="restore"
        android_keyboardInputMode="adjustResize"
        stackBehavior="push"
      >
        <View style={styles.header}>
          <TouchableOpacity
            onPress={handleClearCart}
            
            activeOpacity={0.7}
          >
            <Text style={styles.clearText}>{PREORDER_TEXT.CLEAR_BUTTON}</Text>
          </TouchableOpacity>
          
          <Text style={styles.title}>{PREORDER_TEXT.TITLE}</Text>
          
          <TouchableOpacity
            onPress={() => bottomSheetRef.current?.dismiss()}
            style={styles.closeButton}
            activeOpacity={0.7}
          >
             <AppIcon name="close" size={PREORDER_LAYOUT.HEADER_BUTTON_SIZE} color={BRAND_COLORS.text.secondary} />
          </TouchableOpacity>
        </View>
        
        <BottomSheetScrollView
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.sections}>
            <OrderTypeSelector
              selectedType={preOrderState.orderType}
              onPress={() => orderTypeModalRef.current?.present()}
            />
            
            <PreOrderProductList
              items={items}
              onEditProduct={handleEditProduct}
              onRemoveProduct={handleRemoveProduct}
              onAddMore={handleAddMore}
            />
            
            <PreOrderTotalPrice
              subtotal={totalPrice}
              shippingFee={preOrderState.shippingFee}
              onPromotionPress={handlePromotionPress}
            />
            
            <PaymentTypeSelector
              selectedMethod={preOrderState.paymentMethod}
              onPress={() => paymentModalRef.current?.present()}
            />
          </View>
        </BottomSheetScrollView>
      </BottomSheetModal>
      
      <OrderTypeModal
        ref={orderTypeModalRef}
        selectedType={preOrderState.orderType}
        onSelectType={handleOrderTypeChange}
      />
      
      <PaymentTypeModal
        ref={paymentModalRef}
        selectedMethod={preOrderState.paymentMethod}
        onSelectMethod={handlePaymentMethodChange}
      />
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
  closeText: {
    fontSize: 28,
    fontFamily: TYPOGRAPHY.fontFamily.bodyRegular,
    color: BRAND_COLORS.text.secondary,
    lineHeight: 28,
  },
  content: {
    flex: 1,
    backgroundColor: BRAND_COLORS.background.default,
  },
  contentContainer: {
    paddingBottom: 200,
  },
  sections: {
    padding: PREORDER_LAYOUT.SECTION_PADDING_HORIZONTAL,
    gap: PREORDER_LAYOUT.SECTION_MARGIN_TOP,
  },
});