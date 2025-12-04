import { useRouter } from 'expo-router';
import { Product } from '../../data/mockProducts';
import { addToCart } from '../../state/slices/orderCart';
import { useAppDispatch, useAppSelector } from '../hooks';
import { useAuthGuard } from './useAuthGuard';

export const useAddToCart = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const selectedStore = useAppSelector((state) => state.orderCart.selectedStore);

  const handleAddToCart = useAuthGuard(
    (product: Product) => {
      if (!selectedStore) {
        console.log(`[useAddToCart] No store selected. Redirecting for product: ${product.id}`);
        router.push({
          pathname: '/(tabs)/stores',
          params: {
            mode: 'select',
            productId: product.id,
          },
        });
        return;
      }

      console.log(`[useAddToCart] Adding ${product.name} to cart`);
      dispatch(addToCart(product));
    },
    (product: Product) => ({
      intent: 'PURCHASE',
      context: { productId: product.id },
    })
  );

  return handleAddToCart;
};