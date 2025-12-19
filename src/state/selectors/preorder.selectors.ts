import { RootState } from '../store';

export const selectPreOrderId = (state: RootState) => state.preorder.preOrderId;

export const selectOrderType = (state: RootState) => state.preorder.orderType;

export const selectIsShippingOrder = (state: RootState) =>
  state.preorder.orderType === 'Shipping';

export const selectDeliveryAddress = (state: RootState) => state.preorder.deliveryAddress;

export const selectShippingFee = (state: RootState) => state.preorder.shippingFee;

export const selectPreOrderTotal = (state: RootState) =>
  state.preorder.totalAmount + state.preorder.shippingFee;

export const selectPreOrderItems = (state: RootState) => state.preorder.items;

export const selectPreOrderItemCount = (state: RootState) =>
  state.preorder.items.reduce((sum, item) => sum + item.quantity, 0);