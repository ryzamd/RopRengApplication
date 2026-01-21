import { Menu } from './Menu';
import { Region } from './Region';

export interface Store {
  readonly id: number;
  readonly regionId: number;
  readonly name: string;
  readonly slug: string | null;
  readonly address: string | null;
  readonly location: {
    type: string;
    coordinates: [number, number]; // [longitude, latitude]
  };
  readonly phone: string | null;
  readonly email: string | null;
  readonly timezone: string;
  readonly isActive: boolean;
  readonly createdAt: string;
  readonly updatedAt: string | null;
  readonly deletedAt: string | null;
  readonly currentLoyaltyPoint: number;
  readonly region?: Region;
  readonly menus?: Menu[];
}