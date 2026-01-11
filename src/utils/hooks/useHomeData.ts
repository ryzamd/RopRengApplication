import { useCallback, useEffect, useRef } from 'react';
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

export function useHomeData({lat, lng, limit = 10, enabled = true}: UseHomeDataParams): UseHomeDataReturn {
  const dispatch = useAppDispatch();
  const isRefreshingRef = useRef(false);
  const isFetchingMoreRef = useRef(false);

  // Selectors
  const products = useAppSelector(selectProducts);
  const productsLoading = useAppSelector(selectProductsLoading);
  const productsLoadingMore = useAppSelector(selectProductsLoadingMore);
  const productsError = useAppSelector(selectProductsError);
  const hasMore = useAppSelector(selectHasMoreProducts);
  const currentPage = useAppSelector(selectCurrentPage);
  const storeId = useAppSelector(selectStoreId);
  const vouchers = useAppSelector(selectVouchers);

  useEffect(() => {
    if (!enabled || !lat || !lng) return;

    dispatch(resetHomeData());
    dispatch(fetchHomeMenu({ lat, lng, limit, page: 0 }));
    dispatch(fetchVouchers({ lat, lng, limit: 20, page: 0 }));
  }, [dispatch, lat, lng, limit, enabled]);

  // (pull-to-refresh)
  const refresh = useCallback(async () => {
    if (isRefreshingRef.current) return;
    isRefreshingRef.current = true;
    
    dispatch(clearHomeError());
    dispatch(resetHomeData());
    
    await Promise.all([
      dispatch(fetchHomeMenu({ lat, lng, limit, page: 0 })),
      dispatch(fetchVouchers({ lat, lng, limit: 20, page: 0 })),
    ]);

    isRefreshingRef.current = false;
  }, [dispatch, lat, lng, limit]);

  // infinite scroll
  const loadMore = useCallback(() => {
    // CRITICAL FIX: Ngăn chặn vòng lặp vô hạn
    // 1. isFetchingMoreRef.current: Đang fetch dở
    // 2. productsLoadingMore: Redux báo đang fetch
    // 3. !hasMore: Server báo hết hàng
    // 4. products.length === 0: QUAN TRỌNG NHẤT. Nếu list rỗng, không bao giờ loadMore.
    // 5. productsError: Nếu đang có lỗi (vd 404), ngừng load thêm.
    if (
        isFetchingMoreRef.current || 
        productsLoadingMore || 
        !hasMore || 
        products.length === 0 || 
        productsError
    ) {
        return;
    }

    isFetchingMoreRef.current = true;
    const nextPage = currentPage + 1;

    dispatch(fetchHomeMenuMore({ lat, lng, limit, page: nextPage })).finally(() => {
      isFetchingMoreRef.current = false;
    });
  }, [dispatch, lat, lng, limit, currentPage, hasMore, productsLoadingMore, products.length, productsError]);

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