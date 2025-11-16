/**
 * useUI Hook
 * Custom hook for UI state operations
 */

import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../application/store/hooks';
import {
  openModal,
  closeModal,
  addToast,
  removeToast,
  clearToasts,
  setGlobalLoading,
  setOnlineStatus,
  openBottomSheet,
  closeBottomSheet,
  selectActiveModal,
  selectModalData,
  selectToasts,
  selectGlobalLoading,
  selectIsOnline,
  selectBottomSheetVisible,
  selectBottomSheetContent,
  ModalType,
  Toast,
} from '../../application/store';

export function useUI() {
  const dispatch = useAppDispatch();
  const activeModal = useAppSelector(selectActiveModal);
  const modalData = useAppSelector(selectModalData);
  const toasts = useAppSelector(selectToasts);
  const globalLoading = useAppSelector(selectGlobalLoading);
  const isOnline = useAppSelector(selectIsOnline);
  const bottomSheetVisible = useAppSelector(selectBottomSheetVisible);
  const bottomSheetContent = useAppSelector(selectBottomSheetContent);

  // Modal actions
  const handleOpenModal = useCallback(
    (type: ModalType, data?: any) => {
      dispatch(openModal({ type, data }));
    },
    [dispatch]
  );

  const handleCloseModal = useCallback(() => {
    dispatch(closeModal());
  }, [dispatch]);

  // Toast actions
  const showToast = useCallback(
    (toast: Omit<Toast, 'id'>) => {
      dispatch(addToast(toast));

      // Auto-remove toast after duration
      const duration = toast.duration || 3000;
      if (duration > 0) {
        setTimeout(() => {
          // Toast will be auto-removed by id
        }, duration);
      }
    },
    [dispatch]
  );

  const showSuccess = useCallback(
    (message: string, duration?: number) => {
      showToast({ type: 'success', message, duration });
    },
    [showToast]
  );

  const showError = useCallback(
    (message: string, duration?: number) => {
      showToast({ type: 'error', message, duration });
    },
    [showToast]
  );

  const showInfo = useCallback(
    (message: string, duration?: number) => {
      showToast({ type: 'info', message, duration });
    },
    [showToast]
  );

  const showWarning = useCallback(
    (message: string, duration?: number) => {
      showToast({ type: 'warning', message, duration });
    },
    [showToast]
  );

  const hideToast = useCallback(
    (id: string) => {
      dispatch(removeToast(id));
    },
    [dispatch]
  );

  const hideAllToasts = useCallback(() => {
    dispatch(clearToasts());
  }, [dispatch]);

  // Loading actions
  const setLoading = useCallback(
    (loading: boolean) => {
      dispatch(setGlobalLoading(loading));
    },
    [dispatch]
  );

  // Network status
  const updateOnlineStatus = useCallback(
    (online: boolean) => {
      dispatch(setOnlineStatus(online));
    },
    [dispatch]
  );

  // Bottom sheet actions
  const handleOpenBottomSheet = useCallback(
    (content: any) => {
      dispatch(openBottomSheet(content));
    },
    [dispatch]
  );

  const handleCloseBottomSheet = useCallback(() => {
    dispatch(closeBottomSheet());
  }, [dispatch]);

  return {
    // State
    activeModal,
    modalData,
    toasts,
    globalLoading,
    isOnline,
    bottomSheetVisible,
    bottomSheetContent,

    // Modal actions
    openModal: handleOpenModal,
    closeModal: handleCloseModal,

    // Toast actions
    showToast,
    showSuccess,
    showError,
    showInfo,
    showWarning,
    hideToast,
    hideAllToasts,

    // Loading
    setLoading,

    // Network
    updateOnlineStatus,

    // Bottom sheet
    openBottomSheet: handleOpenBottomSheet,
    closeBottomSheet: handleCloseBottomSheet,
  };
}
