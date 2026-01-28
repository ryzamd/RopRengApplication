import { Dispatch } from 'react';
import { CustomPopupProps, PopupAction, PopupConfig } from './types';

class PopupService {
    private static instance: PopupService;
    private dispatch: Dispatch<PopupAction> | null = null;
    private resolvers: Map<string, (value: any) => void> = new Map();

    static getInstance(): PopupService {
        if (!PopupService.instance) {
            PopupService.instance = new PopupService();
        }
        return PopupService.instance;
    }

    // Initialize with dispatch from PopupProvider
    initialize(dispatch: Dispatch<PopupAction>): void {
        this.dispatch = dispatch;
    }

    // Generate unique ID
    private generateId(): string {
        return Math.random().toString(36).substring(2, 9);
    }

    // Show alert popup
    async alert(
        message: string,
        options?: {
            title?: string;
            buttonText?: string;
            type?: 'info' | 'success' | 'warning' | 'error';
        }
    ): Promise<void> {
        const { type, ...rest } = options || {};
        return this.show({
            type: 'alert',
            message,
            popupType: type,
            ...rest,
        });
    }

    // Show confirm popup, returns user decision
    async confirm(
        message: string,
        options?: {
            title?: string;
            confirmText?: string;
            cancelText?: string;
            confirmStyle?: 'default' | 'destructive';
        }
    ): Promise<boolean> {
        return this.show({
            type: 'confirm',
            message,
            ...options,
        });
    }

    // Show/hide global loading
    loading(show: boolean, message?: string): void {
        if (show) {
            this.dispatch?.({ type: 'SHOW_LOADING', payload: { message } });
        } else {
            this.dispatch?.({ type: 'HIDE_LOADING' });
        }
    }

    // Show toast notification
    toast(
        message: string,
        type: 'success' | 'error' | 'info' | 'warning' = 'info',
        duration: number = 3000
    ): void {
        this.dispatch?.({
            type: 'SHOW_TOAST',
            payload: { message, toastType: type, duration },
        });
    }

    // Show custom popup with arbitrary component
    async custom<T>(
        component: React.ComponentType<CustomPopupProps<T>>,
        props: Omit<CustomPopupProps<T>, 'onResolve' | 'onDismiss'>
    ): Promise<T | null> {
        return this.show({
            type: 'custom',
            component,
            props,
        });
    }

    // Generic show method
    private async show<T>(config: PopupConfig): Promise<T> {
        const id = this.generateId();

        return new Promise((resolve) => {
            this.resolvers.set(id, resolve);
            this.dispatch?.({
                type: 'SHOW_POPUP',
                payload: { id, config },
            });
        });
    }

    // Resolve popup with value
    resolve(id: string, value: any): void {
        const resolver = this.resolvers.get(id);
        if (resolver) {
            resolver(value);
            this.resolvers.delete(id);
        }
        this.dispatch?.({ type: 'HIDE_POPUP', payload: { id } });
    }

    // Dismiss popup without value
    dismiss(id: string): void {
        this.resolve(id, null);
    }
}

export const popupService = PopupService.getInstance();
