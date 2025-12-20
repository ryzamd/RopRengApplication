import { RootState } from '../store';

export const selectPreOrderId = (state: RootState) =>
  state.persistedReducer.preorder.preOrderId;

export const selectOrderType = (state: RootState) =>
  state.persistedReducer.preorder.orderType;

export const selectIsShippingOrder = (state: RootState) =>
  state.persistedReducer.preorder.orderType === 'Shipping';

export const selectDeliveryAddress = (state: RootState) =>
  state.persistedReducer.preorder.deliveryAddress;

export const selectShippingFee = (state: RootState) =>
  state.persistedReducer.preorder.shippingFee;

export const selectPreOrderTotal = (state: RootState) =>
  state.persistedReducer.preorder.totalAmount + state.persistedReducer.preorder.shippingFee;

export const selectPreOrderItems = (state: RootState) =>
  state.persistedReducer.preorder.items;

export const selectPreOrderItemCount = (state: RootState) =>
  state.persistedReducer.preorder.items.reduce(
    (sum: number, item: { quantity: number }) => sum + item.quantity, 0
  );