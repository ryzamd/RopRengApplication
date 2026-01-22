import { AppLifecycleEvent, IBackgroundService } from './appLifecycle.types';
import { appLifecycle } from './AppLifecycleManager';

class BackgroundServiceRegistry {
    private services = new Map<string, IBackgroundService>();
    private isStarted = false;

    register(service: IBackgroundService): void {
        if (this.services.has(service.metadata.name)) {
            console.warn(`[ServiceRegistry] Service "${service.metadata.name}" already registered`);
            return;
        }
        this.services.set(service.metadata.name, service);
        console.log(`[ServiceRegistry] Registered: ${service.metadata.name} (priority: ${service.metadata.priority})`);
    }

    async runStartup(): Promise<{ success: boolean; errors: string[] }> {
        if (this.isStarted) {
            console.warn('[ServiceRegistry] Already started');
            return { success: true, errors: [] };
        }

        const errors: string[] = [];
        const sorted = this.getSortedServices();

        console.log(`[ServiceRegistry] Starting ${sorted.length} services...`);

        for (const service of sorted) {
            try {
                console.log(`[ServiceRegistry] Starting ${service.metadata.name}...`);
                await service.startup();
                console.log(`[ServiceRegistry] ✓ ${service.metadata.name} ready`);
            } catch (error) {
                const msg = `${service.metadata.name}: ${error instanceof Error ? error.message : 'Unknown error'}`;
                errors.push(msg);
                console.error(`[ServiceRegistry] ✗ ${msg}`);
            }
        }

        this.isStarted = true;
        this.subscribeToLifecycle();

        console.log(`[ServiceRegistry] Startup complete. Errors: ${errors.length}`);
        return { success: errors.length === 0, errors };
    }

    private getSortedServices(): IBackgroundService[] {
        return [...this.services.values()].sort(
            (a, b) => a.metadata.priority - b.metadata.priority
        );
    }

    private subscribeToLifecycle(): void {
        appLifecycle.subscribe(async (event, prevEvent) => {
            if (event === AppLifecycleEvent.FOREGROUND && prevEvent === AppLifecycleEvent.BACKGROUND) {
                await this.handleForeground();
            } else if (event === AppLifecycleEvent.BACKGROUND) {
                await this.handleBackground();
            }
        });
    }

    private async handleForeground(): Promise<void> {
        console.log('[ServiceRegistry] App returned to foreground');
        for (const service of this.getSortedServices()) {
            if (service.metadata.runOnForeground && service.onForeground) {
                try {
                    await service.onForeground();
                } catch (error) {
                    console.error(`[ServiceRegistry] ${service.metadata.name}.onForeground failed:`, error);
                }
            }
        }
    }

    private async handleBackground(): Promise<void> {
        console.log('[ServiceRegistry] App went to background');
        for (const service of this.getSortedServices()) {
            if (service.onBackground) {
                try {
                    await service.onBackground();
                } catch (error) {
                    console.error(`[ServiceRegistry] ${service.metadata.name}.onBackground failed:`, error);
                }
            }
        }
    }
}

export const serviceRegistry = new BackgroundServiceRegistry();
