import { CartItem } from '../order/OrderInterfaces';
import { OrderType, PaymentMethod } from './PreOrderEnums';

export interface PreOrderState {
  orderType: OrderType;
  paymentMethod: PaymentMethod;
  shippingFee: number;
}

export interface PreOrderBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  onOrderSuccess: () => void;
}

export interface OrderTypeSelectorProps {
  selectedType: OrderType;
  onPress: () => void;
}

export interface PreOrderProductListProps {
  items: CartItem[];
  onEditProduct: (productId: string) => void;
  onRemoveProduct: (productId: string) => void;
  onAddMore: () => void;
}

export interface PreOrderProductItemProps {
  item: CartItem;
  onEdit: () => void;
  onRemove: () => void;
}

export interface PreOrderTotalPriceProps {
  subtotal: number;
  shippingFee: number;
  onPromotionPress: () => void;
}

export interface PaymentTypeSelectorProps {
  selectedMethod: PaymentMethod;
  onPress: () => void;
}

// TODO: API Integration - Define Order creation DTO
export interface CreateOrderDTO {
  storeId: string;
  orderType: OrderType;
  paymentMethod: PaymentMethod;
  items: { productId: string; quantity: number }[];
  totalPrice: number;
  shippingFee: number;
}