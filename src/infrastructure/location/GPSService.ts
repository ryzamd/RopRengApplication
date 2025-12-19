import * as Location from 'expo-location';
import { UserLocation } from '../../domain/entities/UserLocation';

export class GPSService {
  private static instance: GPSService;

  private constructor() {}

  static getInstance(): GPSService {
    if (!GPSService.instance) {
      GPSService.instance = new GPSService();
    }
    return GPSService.instance;
  }

  async requestPermissions(): Promise<boolean> {
    const { status } = await Location.requestForegroundPermissionsAsync();
    return status === 'granted';
  }

  async getCurrentLocation(): Promise<UserLocation | null> {
    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) {
        console.warn('[GPSService] Location permission denied');
        return null;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      return UserLocation.fromCoordinates(
        location.coords.latitude,
        location.coords.longitude,
        '' // Address will be filled by GeocodingService
      );
    } catch (error) {
      console.error('[GPSService] Error getting location:', error);
      return null;
    }
  }

  async watchLocation(callback: (location: UserLocation) => void): Promise<() => void> {
    const hasPermission = await this.requestPermissions();
    if (!hasPermission) {
      throw new Error('Location permission denied');
    }

    const subscription = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.Balanced,
        timeInterval: 10000,
        distanceInterval: 100,
      },
      (location) => {
        const userLocation = UserLocation.fromCoordinates(
          location.coords.latitude,
          location.coords.longitude
        );
        callback(userLocation);
      }
    );

    return () => subscription.remove();
  }
}