import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ILocationCoordinate } from '../../infrastructure/services/LocationService';

export interface DeliveryAddress {
  addressString: string;
  coordinates: ILocationCoordinate;
  placeId?: string;
  contactName?: string;
  contactPhone?: string;
}

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