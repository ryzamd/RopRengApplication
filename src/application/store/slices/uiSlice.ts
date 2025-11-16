/**
 * UI Slice
 * Redux slice for UI state (modals, loading, etc.)
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Modal types
export enum ModalType {
  NONE = 'NONE',
  LOGIN = 'LOGIN',
  PRODUCT_DETAIL = 'PRODUCT_DETAIL',
  CART = 'CART',
  STORE_SELECTOR = 'STORE_SELECTOR',
  ORDER_DETAIL = 'ORDER_DETAIL',
  PAYMENT_SUCCESS = 'PAYMENT_SUCCESS',
  PAYMENT_FAILED = 'PAYMENT_FAILED',
}

// Toast/Notification types
export interface Toast {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  duration?: number;
}

// State interface
export interface UIState {
  // Modal state
  activeModal: ModalType;
  modalData: any;

  // Toast notifications
  toasts: Toast[];

  // Loading states
  globalLoading: boolean;

  // Network status
  isOnline: boolean;

  // Bottom sheet
  bottomSheetVisible: boolean;
  bottomSheetContent: any;
}

// Initial state
const initialState: UIState = {
  activeModal: ModalType.NONE,
  modalData: null,
  toasts: [],
  globalLoading: false,
  isOnline: true,
  bottomSheetVisible: false,
  bottomSheetContent: null,
};

// Slice
const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    // Modal actions
    openModal(state, action: PayloadAction<{ type: ModalType; data?: any }>) {
      state.activeModal = action.payload.type;
      state.modalData = action.payload.data || null;
    },
    closeModal(state) {
      state.activeModal = ModalType.NONE;
      state.modalData = null;
    },

    // Toast actions
    addToast(
      state,
      action: PayloadAction<Omit<Toast, 'id'>>
    ) {
      const id = Date.now().toString();
      state.toasts.push({
        id,
        ...action.payload,
      });
    },
    removeToast(state, action: PayloadAction<string>) {
      state.toasts = state.toasts.filter((toast) => toast.id !== action.payload);
    },
    clearToasts(state) {
      state.toasts = [];
    },

    // Loading actions
    setGlobalLoading(state, action: PayloadAction<boolean>) {
      state.globalLoading = action.payload;
    },

    // Network status
    setOnlineStatus(state, action: PayloadAction<boolean>) {
      state.isOnline = action.payload;
    },

    // Bottom sheet actions
    openBottomSheet(state, action: PayloadAction<any>) {
      state.bottomSheetVisible = true;
      state.bottomSheetContent = action.payload;
    },
    closeBottomSheet(state) {
      state.bottomSheetVisible = false;
      state.bottomSheetContent = null;
    },
  },
});

export const {
  openModal,
  closeModal,
  addToast,
  removeToast,
  clearToasts,
  setGlobalLoading,
  setOnlineStatus,
  openBottomSheet,
  closeBottomSheet,
} = uiSlice.actions;

export default uiSlice.reducer;
