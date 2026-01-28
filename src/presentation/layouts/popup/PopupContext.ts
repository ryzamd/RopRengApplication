import { createContext, Dispatch } from 'react';
import { PopupAction, PopupState } from './types';

export const initialState: PopupState = {
    queue: [],
    current: null,
    isVisible: false,
};

export const PopupContext = createContext<{
    state: PopupState;
    dispatch: Dispatch<PopupAction>;
}>({
    state: initialState,
    dispatch: () => null,
});

export function popupReducer(state: PopupState, action: PopupAction): PopupState {
    switch (action.type) {
        case 'SHOW_POPUP': {
            // If no current popup, set as current immediately
            if (!state.current) {
                return {
                    ...state,
                    current: { id: action.payload.id, config: action.payload.config },
                    isVisible: true,
                };
            }
            // Otherwise add to queue
            return {
                ...state,
                queue: [...state.queue, { id: action.payload.id, config: action.payload.config }],
            };
        }

        case 'HIDE_POPUP': {
            // If hiding specific popup (usually current)
            if (state.current?.id === action.payload.id) {
                const nextPopup = state.queue[0] || null;
                const remainingQueue = state.queue.slice(1);

                return {
                    ...state,
                    isVisible: !!nextPopup,
                    current: nextPopup,
                    queue: remainingQueue,
                };
            }
            return state;
        }

        case 'SHOW_LOADING': {
            const id = 'global-loading';
            const config = { type: 'loading', message: action.payload.message } as const;

            if (state.current?.config.type === 'loading') {
                return {
                    ...state,
                    current: { ...state.current, config },
                };
            }

            if (!state.current) {
                return {
                    ...state,
                    current: { id, config },
                    isVisible: true,
                };
            }

            // Loading should be high priority, maybe push to front? 
            // For simplicity now, add to queue or replace if needed.
            // Let's treat loading as just another popup but high priority in future.
            return {
                ...state,
                queue: [...state.queue, { id, config }],
            };
        }

        case 'HIDE_LOADING': {
            if (state.current?.config.type === 'loading') {
                const nextPopup = state.queue[0] || null;
                const remainingQueue = state.queue.slice(1);
                return {
                    ...state,
                    isVisible: !!nextPopup,
                    current: nextPopup,
                    queue: remainingQueue,
                };
            }
            // Remove from queue if present
            return {
                ...state,
                queue: state.queue.filter(p => p.config.type !== 'loading'),
            };
        }

        case 'SHOW_TOAST': {
            // Toasts might be handled differently (overlay on top of everything)
            // But for this architecture, let's queue them as well for simplicity
            const id = `toast-${Date.now()}`;
            const config = {
                type: 'toast',
                message: action.payload.message,
                toastType: action.payload.toastType || 'info',
                duration: action.payload.duration || 3000
            } as const;

            if (!state.current) {
                return {
                    ...state,
                    current: { id, config },
                    isVisible: true,
                };
            }
            return {
                ...state,
                queue: [...state.queue, { id, config }],
            };
        }

        default:
            return state;
    }
}
