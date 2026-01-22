import { useAddToCart } from '@/src/utils/hooks/useAddToCart';
import { router } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Alert, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MOCK_COMBOS } from '../../../data/mockCombos';
import { clearPendingAction } from '../../../state/slices/authSlice';
import { selectProducts } from '../../../state/slices/homeSlice';
import { addToCart } from '../../../state/slices/orderCartSlice';
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
  const handleAddToCart = useAddToCart();
  const [showPreOrder, setShowPreOrder] = useState(false);

  const pendingAction = useAppSelector((state) => state.auth.pendingAction);
  const selectedStore = useAppSelector((state) => state.orderCart.selectedStore);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const totalItems = useAppSelector((state) => state.orderCart.totalItems);

  // Use cached products from Redux instead of mock data
  const products = useAppSelector(selectProducts);
  const processedActionRef = useRef<string | null>(null);

  useEffect(() => {
    console.log('[OrderScreen] Store or Action changed, checking conditions...');
    console.log(`[OrderScreen] selectedStore: ${selectedStore?.name || 'null'}`);
    console.log(`[OrderScreen] pendingAction: ${pendingAction ? JSON.stringify(pendingAction) : 'null'}`);

    if (!pendingAction) {
      console.log('[OrderScreen] No pending action');
      return;
    }

    if (pendingAction.type !== 'PURCHASE') {
      console.log('[OrderScreen] Action is not PURCHASE');
      return;
    }

    if (!pendingAction.context.productId) {
      console.log('[OrderScreen] No productId in action');
      return;
    }

    if (!selectedStore) {
      console.log('[OrderScreen] No store selected, waiting...');
      return;
    }

    const actionKey = `${pendingAction.context.productId}-${pendingAction.timestamp}`;
    if (processedActionRef.current === actionKey) {
      console.log('[OrderScreen] Action already processed, skipping');
      return;
    }

    console.log(`[OrderScreen] All conditions met! Auto-adding product: ${pendingAction.context.productId}`);

    const product = products.find((p) => p.id === pendingAction.context.productId);

    if (!product) {
      console.error(`[OrderScreen] Product not found: ${pendingAction.context.productId}`);
      Alert.alert('Lỗi', 'Sản phẩm trong yêu cầu không tồn tại');
      dispatch(clearPendingAction());
      processedActionRef.current = actionKey;
      return;
    }

    console.log(`[OrderScreen] Found product: ${product.name}, adding to cart...`);
    dispatch(addToCart(product));

    console.log('[OrderScreen] Product added, clearing pending action');
    dispatch(clearPendingAction());

    processedActionRef.current = actionKey;

    Alert.alert('Thành công', `Đã thêm ${product.name} vào giỏ hàng`);
  }, [selectedStore, pendingAction, dispatch, products]);

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

  const productsByCategory = useMemo(() => {
    const categoryMap = new Map<string, { categoryName: string; products: typeof products }>();

    products.forEach(product => {
      const categoryId = product.categoryId;
      if (!categoryMap.has(categoryId)) {
        categoryMap.set(categoryId, { categoryName: `Danh mục ${categoryId}`, products: [] });
      }
      categoryMap.get(categoryId)!.products.push(product);
    });

    return Array.from(categoryMap.values());
  }, [products]);

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

      {showMiniCart && <MiniCartButton onPress={handleMiniCartPress} />}

      <PreOrderBottomSheet visible={showPreOrder} onClose={handlePreOrderClose} onOrderSuccess={handleOrderSuccess} />
    </View>
  );
}