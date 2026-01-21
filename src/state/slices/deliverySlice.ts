import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DeliveryAddress } from '../../domain/shared/types';

interface DeliveryState {
  selectedAddress: DeliveryAddress | null;
}

const initialState: DeliveryState = {
  selectedAddress: null,
};

const deliverySlice = createSlice({
  name: 'delivery',
  initialState,
  reducers: {
    setDeliveryAddress: (state, action: PayloadAction<DeliveryAddress>) => {
      state.selectedAddress = action.payload;
    },
    clearDeliveryAddress: (state) => {
      state.selectedAddress = null;
    },
  },
});

export const { setDeliveryAddress, clearDeliveryAddress } = deliverySlice.actions;
export default deliverySlice.reducer;

export const selectSelectedAddress = (state: { delivery: DeliveryState }) => state.delivery.selectedAddress;
