import { useAddToCart } from '@/src/utils/hooks/useAddToCart';
import { useIsFocused } from '@react-navigation/native';
import { router } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { Alert, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MOCK_COMBOS } from '../../../data/mockCombos';
import { MOCK_CATEGORIES, MOCK_PRODUCTS } from '../../../data/mockProducts';
import { clearPendingIntent } from '../../../state/slices/auth';
import { addToCart } from '../../../state/slices/orderCart';
import { useAppDispatch, useAppSelector } from '../../../utils/hooks';
import { MiniCartButton } from '../../components/shared/MiniCartButton';
import PreOrderBottomSheet from '../preorder/PreOrderBottomSheet';
import { OrderCategoryScroll } from './components/OrderCategoryScroll';
import { OrderHeader } from './components/OrderHeader';
import { OrderProductSection } from './components/OrderProductSection';
import { OrderPromoSection } from './components/OrderPromoSection';
import { orderStyles } from './styles';

export default function OrderScreen() {
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();
  const isFocused = useIsFocused();
  const handleAddToCart = useAddToCart();
  const [showPreOrder, setShowPreOrder] = useState(false);
  
  const pendingIntent = useAppSelector((state) => state.auth.pendingIntent);
  const selectedStore = useAppSelector((state) => state.orderCart.selectedStore);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const totalItems = useAppSelector((state) => state.orderCart.totalItems);

  useEffect(() => {
    if (!isFocused) return;

    if (!pendingIntent || pendingIntent.intent !== 'PURCHASE') return;
    if (!pendingIntent.context.productId) return;
    if (!selectedStore) return;

    console.log(`[OrderScreen] Auto-adding product from intent: ${pendingIntent.context.productId}`);

    const product = MOCK_PRODUCTS.find((p) => p.id === pendingIntent.context.productId);
    
    if (!product) {
      Alert.alert('Lỗi', 'Sản phẩm trong yêu cầu không tồn tại');
      dispatch(clearPendingIntent());
      return;
    }

    dispatch(addToCart(product));
    console.log(`[OrderScreen] Added ${product.name} to cart`);

    dispatch(clearPendingIntent());

    Alert.alert('Thành công', `Đã thêm ${product.name} vào giỏ hàng`);
  }, [pendingIntent, selectedStore, dispatch, isFocused]);

  const handleMiniCartPress = useCallback(() => {
    console.log('[OrderScreen] Opening PreOrder sheet');
    setShowPreOrder(true);
  }, []);

  const handlePreOrderClose = useCallback(() => {
    setShowPreOrder(false);
  }, []);

  const handleOrderSuccess = useCallback(() => {
    console.log('[OrderScreen] Order placed successfully, redirecting to Home');
    router.replace('../(tabs)/');
  }, []);

  const productsByCategory = MOCK_CATEGORIES.map((category) => ({
    categoryName: category.name,
    products: MOCK_PRODUCTS.filter((p) => p.categoryId === category.id),
  }));

  const showMiniCart = isAuthenticated && totalItems > 0;

  return (
    <View style={[orderStyles.container, { paddingTop: insets.top }]}>
      <OrderHeader />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        <OrderCategoryScroll />
        
        {MOCK_COMBOS.map((combo) => (
          <OrderPromoSection
            key={combo.id}
            title={combo.title}
            expiresAt={combo.expiresAt}
            products={combo.products}
            onProductPress={handleAddToCart}
          />
        ))}
        
        {productsByCategory.map((section, index) => (
          <OrderProductSection
            key={index}
            title={section.categoryName}
            products={section.products}
            onAddPress={handleAddToCart}
          />
        ))}
        
        <View style={{ height: 100 }} />
      </ScrollView>

      {showMiniCart && (
        <MiniCartButton onPress={handleMiniCartPress} />
      )}

      <PreOrderBottomSheet
        visible={showPreOrder}
        onClose={handlePreOrderClose}
        onOrderSuccess={handleOrderSuccess}
      />
    </View>
  );
}