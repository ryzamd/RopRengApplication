import { Menu } from './Menu';
import { Region } from './Region';

export class Store {
  constructor(
    public readonly id: number,
    public readonly regionId: number,
    public readonly name: string,
    public readonly slug: string | null,
    public readonly address: string | null,
    public readonly location: {
      type: string;
      coordinates: [number, number];
    },
    public readonly phone: string | null,
    public readonly email: string | null,
    public readonly timezone: string,
    public readonly isActive: number,
    public readonly createdAt: string,
    public readonly updatedAt: string | null,
    public readonly deletedAt: string | null,
    public readonly currentLoyaltyPoint: number,
    public readonly region?: Region,
    public readonly menus?: Menu[]
  ) {}

  get latitude(): number {
    return this.location.coordinates[1];
  }

  get longitude(): number {
    return this.location.coordinates[0];
  }

  get isActiveStore(): boolean {
    return this.isActive === 1;
  }

  get hasMenus(): boolean {
    return this.menus !== undefined && this.menus.length > 0;
  }

  get defaultMenu(): Menu | undefined {
    return this.menus?.find(menu => menu.isDefaultMenu);
  }

  getDistanceFrom(lat: number, lng: number): number {
    const R = 6371;
    const dLat = ((lat - this.latitude) * Math.PI) / 180;
    const dLon = ((lng - this.longitude) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((this.latitude * Math.PI) / 180) *
        Math.cos((lat * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  formatDistance(lat: number, lng: number): string {
    const distance = this.getDistanceFrom(lat, lng);
    if (distance < 1) {
      return `${Math.round(distance * 1000)}m`;
    }
    return `${distance.toFixed(1)}km`;
  }
}