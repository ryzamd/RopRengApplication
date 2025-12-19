export class UserLocation {
  constructor(
    public readonly latitude: number,
    public readonly longitude: number,
    public readonly address: string,
    public readonly timestamp: number = Date.now()
  ) {}

  static fromCoordinates(lat: number, lng: number, address: string = ''): UserLocation {
    return new UserLocation(lat, lng, address);
  }
}