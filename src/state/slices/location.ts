import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserLocation } from '../../domain/entities/UserLocation';
import { DeliveryAddress } from '../../domain/entities/DeliveryAddress';
import { GPSService } from '../../infrastructure/location/GPSService';
import { GeocodingService } from '../../infrastructure/location/GeocodingService';

interface LocationState {
  currentLocation: UserLocation | null;
  selectedAddress: DeliveryAddress | null;
  defaultAddress: DeliveryAddress | null;
  savedAddresses: DeliveryAddress[];
  isLoadingLocation: boolean;
  isLoadingGeocoding: boolean;
  locationError: string | null;
  hasLocationPermission: boolean;
}

const initialState: LocationState = {
  currentLocation: null,
  selectedAddress: null,
  defaultAddress: null,
  savedAddresses: [],
  isLoadingLocation: false,
  isLoadingGeocoding: false,
  locationError: null,
  hasLocationPermission: false,
};

// Async thunks
export const fetchCurrentLocation = createAsyncThunk(
  'location/fetchCurrent',
  async (_, { rejectWithValue }) => {
    try {
      const gpsService = GPSService.getInstance();
      const geocodingService = GeocodingService.getInstance();

      const location = await gpsService.getCurrentLocation();
      if (!location) {
        return rejectWithValue('Không thể lấy vị trí hiện tại');
      }

      // Reverse geocode to get address
      const address = await geocodingService.reverseGeocode(
        location.latitude,
        location.longitude
      );

      return {
        latitude: location.latitude,
        longitude: location.longitude,
        address,
        timestamp: location.timestamp,
      };
    } catch (error) {
      console.error('[fetchCurrentLocation] Error:', error);
      return rejectWithValue('Lỗi khi lấy vị trí');
    }
  }
);

export const searchAddresses = createAsyncThunk(
  'location/searchAddresses',
  async (query: string, { rejectWithValue }) => {
    try {
      const geocodingService = GeocodingService.getInstance();
      return await geocodingService.searchAddress(query);
    } catch (error) {
      console.error('[searchAddresses] Error:', error);
      return rejectWithValue('Lỗi khi tìm kiếm địa chỉ');
    }
  }
);

export const reverseGeocodeLocation = createAsyncThunk(
  'location/reverseGeocode',
  async (
    { latitude, longitude }: { latitude: number; longitude: number },
    { rejectWithValue }
  ) => {
    try {
      const geocodingService = GeocodingService.getInstance();
      const address = await geocodingService.reverseGeocode(latitude, longitude);

      return DeliveryAddress.create(latitude, longitude, address);
    } catch (error) {
      console.error('[reverseGeocodeLocation] Error:', error);
      return rejectWithValue('Lỗi khi chuyển đổi tọa độ sang địa chỉ');
    }
  }
);

const locationSlice = createSlice({
  name: 'location',
  initialState,
  reducers: {
    setSelectedAddress: (state, action: PayloadAction<DeliveryAddress>) => {
      state.selectedAddress = action.payload;
    },
    
    setDefaultAddress: (state, action: PayloadAction<DeliveryAddress>) => {
      state.defaultAddress = action.payload;
    },

    clearSelectedAddress: (state) => {
      state.selectedAddress = null;
    },

    setSavedAddresses: (state, action: PayloadAction<DeliveryAddress[]>) => {
      state.savedAddresses = action.payload;
    },

    setLocationPermission: (state, action: PayloadAction<boolean>) => {
      state.hasLocationPermission = action.payload;
    },

    clearLocationError: (state) => {
      state.locationError = null;
    },
  },
  extraReducers: (builder) => {
    // fetchCurrentLocation
    builder
      .addCase(fetchCurrentLocation.pending, (state) => {
        state.isLoadingLocation = true;
        state.locationError = null;
      })
      .addCase(fetchCurrentLocation.fulfilled, (state, action) => {
        state.isLoadingLocation = false;
        state.currentLocation = new UserLocation(
          action.payload.latitude,
          action.payload.longitude,
          action.payload.address,
          action.payload.timestamp
        );
        state.hasLocationPermission = true;

        // Auto-set selected address if not already set
        if (!state.selectedAddress) {
          state.selectedAddress = DeliveryAddress.create(
            action.payload.latitude,
            action.payload.longitude,
            action.payload.address
          );
        }
      })
      .addCase(fetchCurrentLocation.rejected, (state, action) => {
        state.isLoadingLocation = false;
        state.locationError = action.payload as string;
        state.hasLocationPermission = false;
      });

    // reverseGeocodeLocation
    builder
      .addCase(reverseGeocodeLocation.pending, (state) => {
        state.isLoadingGeocoding = true;
      })
      .addCase(reverseGeocodeLocation.fulfilled, (state, action) => {
        state.isLoadingGeocoding = false;
        state.selectedAddress = action.payload;
      })
      .addCase(reverseGeocodeLocation.rejected, (state, action) => {
        state.isLoadingGeocoding = false;
        state.locationError = action.payload as string;
      });
  },
});

export const {
  setSelectedAddress,
  setDefaultAddress,
  clearSelectedAddress,
  setSavedAddresses,
  setLocationPermission,
  clearLocationError,
} = locationSlice.actions;

export default locationSlice.reducer;