import { createContext, Dispatch } from 'react';
import { PopupAction, PopupState } from './types';

export const initialState: PopupState = {
    queue: [],
    current: null,
    isVisible: false,
    isAnimating: false,
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
            if (state.isAnimating) {
                return {
                    ...state,
                    queue: [...state.queue, { id: action.payload.id, config: action.payload.config }],
                };
            }
            if (!state.current) {
                return {
                    ...state,
                    current: { id: action.payload.id, config: action.payload.config },
                    isVisible: true,
                    isAnimating: false,
                };
            }
            return {
                ...state,
                queue: [...state.queue, { id: action.payload.id, config: action.payload.config }],
            };
        }

        case 'HIDE_POPUP': {
            if (state.current?.id === action.payload.id) {
                return {
                    ...state,
                    isVisible: false,
                    isAnimating: true,
                };
            }
            return state;
        }

        case 'ANIMATION_COMPLETE': {
            const nextPopup = state.queue[0] || null;
            const remainingQueue = state.queue.slice(1);

            return {
                ...state,
                isAnimating: false,
                isVisible: !!nextPopup,
                current: nextPopup,
                queue: remainingQueue,
            };
        }

        case 'SHOW_LOADING': {
            const id = 'global-loading';
            const config = { type: 'loading', message: action.payload.message } as const;

            if (state.isAnimating) {
                return {
                    ...state,
                    queue: [{ id, config }, ...state.queue],
                };
            }

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
                    isAnimating: false,
                };
            }

            return {
                ...state,
                queue: [{ id, config }, ...state.queue],
            };
        }

        case 'HIDE_LOADING': {
            if (state.current?.config.type === 'loading') {
                return {
                    ...state,
                    isVisible: false,
                    isAnimating: true,
                };
            }
            return {
                ...state,
                queue: state.queue.filter(p => p.config.type !== 'loading'),
            };
        }

        case 'SHOW_TOAST': {
            const id = `toast-${Date.now()}`;
            const config = {
                type: 'toast',
                message: action.payload.message,
                toastType: action.payload.toastType || 'info',
                duration: action.payload.duration || 3000
            } as const;

            if (state.isAnimating) {
                return {
                    ...state,
                    queue: [...state.queue, { id, config }],
                };
            }

            if (!state.current) {
                return {
                    ...state,
                    current: { id, config },
                    isVisible: true,
                    isAnimating: false,
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
