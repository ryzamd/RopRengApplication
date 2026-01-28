import React, { useEffect, useReducer } from 'react';
import { PopupContext, initialState, popupReducer } from './PopupContext';
import { PopupRenderer } from './PopupRenderer';
import { popupService } from './PopupService';

export function PopupProvider({ children }: { children: React.ReactNode }) {
    const [state, dispatch] = useReducer(popupReducer, initialState);

    // Initialize service with dispatch
    useEffect(() => {
        popupService.initialize(dispatch);
    }, []);

    return (
        <PopupContext.Provider value={{ state, dispatch }}>
            {children}
            <PopupRenderer />
        </PopupContext.Provider>
    );
}
