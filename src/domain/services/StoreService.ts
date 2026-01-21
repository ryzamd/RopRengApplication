import { Menu } from '../entities/Menu';
import { Store } from '../entities/Store';

export class StoreService {
    static getLatitude(store: Store): number {
        return store.location.coordinates[1];
    }

    static getLongitude(store: Store): number {
        return store.location.coordinates[0];
    }

    static isActiveStore(store: Store): boolean {
        return store.isActive === true;
    }

    static hasMenus(store: Store): boolean {
        return store.menus !== undefined && store.menus.length > 0;
    }

    static getDefaultMenu(store: Store): Menu | undefined {
        return store.menus?.find(menu => menu.isDefault);
    }

    static getDistanceFrom(store: Store, lat: number, lng: number): number {
        const R = 6371;
        const storeLat = this.getLatitude(store);
        const storeLng = this.getLongitude(store);

        const dLat = ((lat - storeLat) * Math.PI) / 180;
        const dLon = ((lng - storeLng) * Math.PI) / 180;
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos((storeLat * Math.PI) / 180) *
            Math.cos((lat * Math.PI) / 180) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }
}
