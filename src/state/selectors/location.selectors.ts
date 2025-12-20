import { RootState } from '../store';

export const selectCurrentLocation = (state: RootState) =>
  state.persistedReducer.location.currentLocation;

export const selectSelectedAddress = (state: RootState) =>
  state.persistedReducer.location.selectedAddress;

export const selectDefaultAddress = (state: RootState) =>
  state.persistedReducer.location.defaultAddress;

export const selectHasLocationPermission = (state: RootState) =>
  state.persistedReducer.location.hasLocationPermission;

export const selectIsLoadingLocation = (state: RootState) =>
  state.persistedReducer.location.isLoadingLocation;

export const selectLocationError = (state: RootState) =>
  state.persistedReducer.location.locationError;