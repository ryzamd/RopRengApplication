import { useCallback, useRef } from 'react';
import { updateDataTimestamp } from '../../state/slices/appSlice';
import {
  clearHomeError, fetchHomeMenu, fetchHomeMenuMore, fetchVouchers, resetHomeData, selectCurrentPage,
  selectHasMoreProducts, selectProducts, selectProductsError, selectProductsLoading, selectProductsLoadingMore,
  selectStoreId, selectVouchers,
} from '../../state/slices/homeSlice';
import { useAppDispatch, useAppSelector } from '../../utils/hooks';

interface UseHomeDataParams {
  lat: number;
  lng: number;
  limit?: number;
  enabled?: boolean;
}

interface UseHomeDataReturn {
  products: ReturnType<typeof selectProducts>;
  vouchers: ReturnType<typeof selectVouchers>;
  storeId: number | null;
  isLoading: boolean;
  isLoadingMore: boolean;
  isRefreshing: boolean;
  hasMore: boolean;
  currentPage: number;
  error: string | null;
  refresh: () => Promise<void>;
  loadMore: () => void;
  clearError: () => void;
}

export function useHomeData({ lat, lng, limit = 10, enabled = true }: UseHomeDataParams): UseHomeDataReturn {
  const dispatch = useAppDispatch();
  const isRefreshingRef = useRef(false);
  const isFetchingMoreRef = useRef(false);

  const products = useAppSelector(selectProducts);
  const productsLoading = useAppSelector(selectProductsLoading);
  const productsLoadingMore = useAppSelector(selectProductsLoadingMore);
  const productsError = useAppSelector(selectProductsError);
  const hasMore = useAppSelector(selectHasMoreProducts);
  const currentPage = useAppSelector(selectCurrentPage);
  const storeId = useAppSelector(selectStoreId);
  const vouchers = useAppSelector(selectVouchers);

  // Pull-to-refresh
  const refresh = useCallback(async () => {
    if (isRefreshingRef.current || !enabled) return;
    isRefreshingRef.current = true;

    dispatch(clearHomeError());
    dispatch(resetHomeData());

    await Promise.all([
      dispatch(fetchHomeMenu({ lat, lng, limit, page: 0 })),
      dispatch(fetchVouchers({ lat, lng, limit: 20, page: 0 })),
    ]);

    dispatch(updateDataTimestamp(Date.now()));
    isRefreshingRef.current = false;
  }, [dispatch, lat, lng, limit, enabled]);

  // Infinite scroll - load more products
  const loadMore = useCallback(() => {
    if (isFetchingMoreRef.current || productsLoadingMore || !hasMore || products.length === 0 || productsError || !enabled) {
      return;
    }

    isFetchingMoreRef.current = true;
    const nextPage = currentPage + 1;

    dispatch(fetchHomeMenuMore({ lat, lng, limit, page: nextPage })).finally(() => {
      isFetchingMoreRef.current = false;
    });
  }, [dispatch, lat, lng, limit, currentPage, hasMore, productsLoadingMore, products.length, productsError, enabled]);

  // Clear error
  const clearError = useCallback(() => {
    dispatch(clearHomeError());
  }, [dispatch]);

  return {
    products,
    vouchers,
    storeId,
    isLoading: productsLoading && products.length === 0,
    isLoadingMore: productsLoadingMore,
    isRefreshing: isRefreshingRef.current,
    hasMore,
    currentPage,
    error: productsError,
    refresh,
    loadMore,
    clearError,
  };
}