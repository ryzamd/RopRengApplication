import React, { useCallback } from 'react';
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MOCK_COMBOS } from '../../../data/mockCombos';
import { MOCK_CATEGORIES, MOCK_PRODUCTS, Product } from '../../../data/mockProducts';
import { addToCart } from '../../../state/slices/orderCart';
import { useAppDispatch } from '../../../utils/hooks';
import { OrderCategoryScroll } from './components/OrderCategoryScroll';
import { OrderHeader } from './components/OrderHeader';
import { OrderProductSection } from './components/OrderProductSection';
import { OrderPromoSection } from './components/OrderPromoSection';
import { orderStyles } from './styles';

export default function OrderScreen() {
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();

  const handleAddToCart = useCallback(
    (product: Product) => {
      dispatch(addToCart(product));
    },
    [dispatch]
  );

  // Group products by category
  const productsByCategory = MOCK_CATEGORIES.map((category) => ({
    categoryName: category.name,
    products: MOCK_PRODUCTS.filter((p) => p.categoryId === category.id),
  }));

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
      </ScrollView>
    </View>
  );
}