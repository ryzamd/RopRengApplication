/**
 * useStores Hook
 * Custom hook for store operations
 */

import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../application/store/hooks';
import {
  fetchNearbyStores,
  refreshStores,
  setSelectedStore,
  clearSelectedStore,
  setUserLocation,
  clearStoreError,
  selectStores,
  selectSelectedStore,
  selectUserLocation,
  selectStoresLoading,
} from '../../application/store';
import { Store } from '../../domain/entities/store/Store';

export function useStores() {
  const dispatch = useAppDispatch();
  const stores = useAppSelector(selectStores);
  const selectedStore = useAppSelector(selectSelectedStore);
  const userLocation = useAppSelector(selectUserLocation);
  const isLoading = useAppSelector(selectStoresLoading);

  // Fetch nearby stores
  const loadNearbyStores = useCallback(
    async (
      latitude: number,
      longitude: number,
      radiusKm: number = 10,
      forceRefresh?: boolean
    ) => {
      await dispatch(
        fetchNearbyStores({ latitude, longitude, radiusKm, forceRefresh })
      ).unwrap();
    },
    [dispatch]
  );

  // Refresh stores
  const handleRefresh = useCallback(async () => {
    if (userLocation) {
      await dispatch(
        refreshStores({
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
          radiusKm: 10,
        })
      ).unwrap();
    }
  }, [dispatch, userLocation]);

  // Select store
  const selectStore = useCallback(
    (store: Store | null) => {
      dispatch(setSelectedStore(store));
    },
    [dispatch]
  );

  // Clear selected store
  const clearSelected = useCallback(() => {
    dispatch(clearSelectedStore());
  }, [dispatch]);

  // Set user location
  const updateUserLocation = useCallback(
    (latitude: number, longitude: number) => {
      dispatch(setUserLocation({ latitude, longitude }));
    },
    [dispatch]
  );

  // Clear error
  const clearError = useCallback(() => {
    dispatch(clearStoreError());
  }, [dispatch]);

  // Get distance to store
  const getDistanceToStore = useCallback(
    (store: Store) => {
      if (!userLocation) return null;

      const storeLocation = store.toObject().location;
      if (!storeLocation) return null;

      const userLat = userLocation.latitude;
      const userLon = userLocation.longitude;
      const storeLat = storeLocation.toValue().latitude;
      const storeLon = storeLocation.toValue().longitude;

      // Haversine formula
      const toRad = (deg: number) => (deg * Math.PI) / 180;
      const R = 6371; // Earth radius in km

      const dLat = toRad(storeLat - userLat);
      const dLon = toRad(storeLon - userLon);
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(userLat)) *
          Math.cos(toRad(storeLat)) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = R * c;

      return Math.round(distance * 10) / 10; // Round to 1 decimal
    },
    [userLocation]
  );

  return {
    // State
    stores,
    selectedStore,
    userLocation,
    isLoading,

    // Actions
    loadNearbyStores,
    refresh: handleRefresh,
    selectStore,
    clearSelectedStore: clearSelected,
    setUserLocation: updateUserLocation,
    clearError,

    // Utilities
    getDistanceToStore,
  };
}
