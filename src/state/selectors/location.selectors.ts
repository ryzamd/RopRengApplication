import { RootState } from '../store';

export const selectCurrentLocation = (state: RootState) => state.location.currentLocation;

export const selectSelectedAddress = (state: RootState) => state.location.selectedAddress;

export const selectDefaultAddress = (state: RootState) => state.location.defaultAddress;

export const selectHasLocationPermission = (state: RootState) =>
  state.location.hasLocationPermission;

export const selectIsLoadingLocation = (state: RootState) =>
  state.location.isLoadingLocation;

export const selectLocationError = (state: RootState) => state.location.locationError;