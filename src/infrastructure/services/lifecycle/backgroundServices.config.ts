import { serviceRegistry } from './BackgroundServiceRegistry';
import { HomeDataBackgroundService } from './services/HomeDataBackgroundService';
import { LocationBackgroundService } from './services/LocationBackgroundService';
import { StoresDataBackgroundService } from './services/StoresDataBackgroundService';

export function registerAllBackgroundServices(): void {
    serviceRegistry.register(new LocationBackgroundService());
    serviceRegistry.register(new HomeDataBackgroundService());
    serviceRegistry.register(new StoresDataBackgroundService());
}
