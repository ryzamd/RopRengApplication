export { persistor, store } from './store';
export type { AppDispatch, RootState } from './store';

// Note: Selectors, actions, and async thunks should be imported directly from their slice files
// Example: import { selectUser, loginWithOtp } from '@/state/slices/auth';
// This avoids naming conflicts (multiple slices have selectError, selectIsLoading, etc.)

