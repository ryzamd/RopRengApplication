export class DeliveryAddress {
  constructor(
    public readonly id: string,
    public readonly latitude: number,
    public readonly longitude: number,
    public readonly formattedAddress: string,
    public readonly isDefault: boolean = false,
    public readonly label?: string // "Nhà", "Công ty", etc.
  ) {}

  static create(
    latitude: number,
    longitude: number,
    formattedAddress: string,
    label?: string
  ): DeliveryAddress {
    return new DeliveryAddress(
      `addr_${Date.now()}_${Math.random()}`,
      latitude,
      longitude,
      formattedAddress,
      false,
      label
    );
  }
}