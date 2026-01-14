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
    public readonly currentLoyaltyPoint: number
  ) {}

  get latitude(): number {
    return this.location.coordinates[1];
  }

  get longitude(): number {
    return this.location.coordinates[0];
  }

  get isActiveBoolean(): boolean {
    return this.isActive === 1;
  }
}