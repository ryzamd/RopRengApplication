import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DeliveryAddress } from '../../domain/entities/DeliveryAddress';

export type OrderType = 'Pickup' | 'Shipping';
export type PaymentType = 'Cash' | 'Card' | 'Momo' | 'ZaloPay';

interface PreOrderItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  size?: string;
  iceLevel?: string;
  sweetness?: string;
  toppings?: string[];
}

interface PreOrderState {
  preOrderId: string | null;
  storeId: string | null;
  storeName: string | null;
  storeAddress: string | null;
  storeLongitude: number | null;
  storeLatitude: number | null;
  
  orderType: OrderType;
  paymentType: PaymentType;
  
  deliveryAddress: DeliveryAddress | null;
  
  items: PreOrderItem[];
  totalAmount: number;
  shippingFee: number;
  
  isCalculatingShipping: boolean;
  note: string;
}

const initialState: PreOrderState = {
  preOrderId: null,
  storeId: null,
  storeName: null,
  storeAddress: null,
  storeLongitude: null,
  storeLatitude: null,
  
  orderType: 'Pickup',
  paymentType: 'Cash',
  
  deliveryAddress: null,
  
  items: [],
  totalAmount: 0,
  shippingFee: 0,
  
  isCalculatingShipping: false,
  note: '',
};

const preorderSlice = createSlice({
  name: 'preorder',
  initialState,
  reducers: {
    initializePreOrder: (
      state,
      action: PayloadAction<{
        storeId: string;
        storeName: string;
        storeAddress: string;
        storeLongitude: number;
        storeLatitude: number;
      }>
    ) => {
      const userId = 'user_temp'; // TODO: Get from auth state
      const timestamp = Date.now();
      
      state.preOrderId = `preOrder-1-${userId}-${timestamp}`;
      state.storeId = action.payload.storeId;
      state.storeName = action.payload.storeName;
      state.storeAddress = action.payload.storeAddress;
      state.storeLongitude = action.payload.storeLongitude;
      state.storeLatitude = action.payload.storeLatitude;
    },

    setOrderType: (state, action: PayloadAction<OrderType>) => {
      state.orderType = action.payload;
      
      // Clear delivery address if switching to Pickup
      if (action.payload === 'Pickup') {
        state.deliveryAddress = null;
        state.shippingFee = 0;
      }
    },

    setPaymentType: (state, action: PayloadAction<PaymentType>) => {
      state.paymentType = action.payload;
    },

    setDeliveryAddress: (state, action: PayloadAction<DeliveryAddress>) => {
      state.deliveryAddress = action.payload;
      // Trigger shipping fee recalculation (handled by UI)
    },

    clearDeliveryAddress: (state) => {
      state.deliveryAddress = null;
      state.shippingFee = 0;
    },

    setShippingFee: (state, action: PayloadAction<number>) => {
      state.shippingFee = action.payload;
    },

    setIsCalculatingShipping: (state, action: PayloadAction<boolean>) => {
      state.isCalculatingShipping = action.payload;
    },

    addItem: (state, action: PayloadAction<PreOrderItem>) => {
      // Check if item with same config exists
      const existingIndex = state.items.findIndex(
        (item) =>
          item.productId === action.payload.productId &&
          item.size === action.payload.size &&
          item.iceLevel === action.payload.iceLevel &&
          item.sweetness === action.payload.sweetness &&
          JSON.stringify(item.toppings) === JSON.stringify(action.payload.toppings)
      );

      if (existingIndex >= 0) {
        state.items[existingIndex].quantity += action.payload.quantity;
      } else {
        state.items.push(action.payload);
      }

      // Recalculate total
      state.totalAmount = state.items.reduce(
        (sum, item) => sum + item.unitPrice * item.quantity,
        0
      );
    },

    updateItemQuantity: (
      state,
      action: PayloadAction<{ index: number; quantity: number }>
    ) => {
      const { index, quantity } = action.payload;
      
      if (quantity <= 0) {
        state.items.splice(index, 1);
      } else {
        state.items[index].quantity = quantity;
      }

      // Recalculate total
      state.totalAmount = state.items.reduce(
        (sum, item) => sum + item.unitPrice * item.quantity,
        0
      );
    },

    removeItem: (state, action: PayloadAction<number>) => {
      state.items.splice(action.payload, 1);
      
      // Recalculate total
      state.totalAmount = state.items.reduce(
        (sum, item) => sum + item.unitPrice * item.quantity,
        0
      );
    },

    setNote: (state, action: PayloadAction<string>) => {
      state.note = action.payload;
    },

    clearPreOrder: (state) => {
      return initialState;
    },
  },
});

export const {
  initializePreOrder,
  setOrderType,
  setPaymentType,
  setDeliveryAddress,
  clearDeliveryAddress,
  setShippingFee,
  setIsCalculatingShipping,
  addItem,
  updateItemQuantity,
  removeItem,
  setNote,
  clearPreOrder,
} = preorderSlice.actions;

export default preorderSlice.reducer;