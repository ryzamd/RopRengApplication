import { IBackgroundService, IServiceMetadata, ServicePriority } from './appLifecycle.types';

export function BackgroundService(config: { name: string; priority: ServicePriority; runOnForeground?: boolean }) {
    return function <T extends new (...args: any[]) => object>(constructor: T) {
        return class extends constructor implements IBackgroundService {
            readonly metadata: IServiceMetadata = {
                name: config.name,
                priority: config.priority,
                runOnForeground: config.runOnForeground ?? false,
            };

            async startup(): Promise<void> {
                if ('startup' in this && typeof (this as any).startup === 'function') {
                    return (this as any).startup();
                }
            }

            async onForeground(): Promise<void> {
                if ('onForeground' in this && typeof (this as any).onForeground === 'function') {
                    return (this as any).onForeground();
                }
            }

            async onBackground(): Promise<void> {
                if ('onBackground' in this && typeof (this as any).onBackground === 'function') {
                    return (this as any).onBackground();
                }
            }

            async cleanup(): Promise<void> {
                if ('cleanup' in this && typeof (this as any).cleanup === 'function') {
                    return (this as any).cleanup();
                }
            }
        };
    };
}

export abstract class BaseBackgroundService implements IBackgroundService {
    abstract readonly metadata: IServiceMetadata;

    abstract startup(): Promise<void>;

    async onForeground(): Promise<void> { }

    async onBackground(): Promise<void> { }

    async cleanup(): Promise<void> { }
}
