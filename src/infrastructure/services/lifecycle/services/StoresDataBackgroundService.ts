import { fetchStores } from '@/src/state/slices/storesSlice';
import { store } from '@/src/state/store';
import { BaseBackgroundService } from '../BackgroundService.base';
import { IServiceMetadata, ServicePriority } from '../appLifecycle.types';

export class StoresDataBackgroundService extends BaseBackgroundService {
    readonly metadata: IServiceMetadata = {
        name: 'StoresDataService',
        priority: ServicePriority.HIGH,
        runOnForeground: false,
    };

    async startup(): Promise<void> {
        await this.fetchStoresData();
    }

    async onForeground(): Promise<void> {
        console.log('[StoresDataBackgroundService] App returned to foreground, refreshing stores...');
        await this.fetchStoresData();
    }

    private async fetchStoresData(): Promise<void> {
        console.log('[StoresDataBackgroundService] Fetching stores data...');

        try {
            await store.dispatch(fetchStores({ page: 1, limit: 20, refresh: true }));
            console.log('[StoresDataBackgroundService] Stores data fetched and cached');
        } catch (error) {
            console.error('[StoresDataBackgroundService] Failed to fetch stores:', error);
            throw error;
        }
    }
}
