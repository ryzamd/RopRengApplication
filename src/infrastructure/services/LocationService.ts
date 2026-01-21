import { APP_DEFAULT_LOCATION } from "@/src/core/config/locationConstants";
import * as Location from "expo-location";
import { ILocationCoordinate } from "../../domain/shared/types";
import { PermissionService } from "./PermissionService";

export type { ILocationCoordinate } from "../../domain/shared/types";

export class LocationService {
  private permissionService: PermissionService;

  constructor(permissionService: PermissionService) {
    this.permissionService = permissionService;
  }

  async getCurrentPosition(accuracy: Location.Accuracy = Location.Accuracy.Balanced): Promise<ILocationCoordinate> {
    try {
      const hasPermission = await this.permissionService.checkOrRequestLocation();

      if (!hasPermission) {
        console.log("[LocationService] Permission denied → Using fallback");
        return APP_DEFAULT_LOCATION;
      }

      console.log("[LocationService] Fetching GPS location...");

      const location = await Location.getCurrentPositionAsync({
        accuracy,
        timeInterval: 5000,
        distanceInterval: 10,
      });

      const coords = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };

      console.log("[LocationService] ✅ GPS location:", coords);
      return coords;
    } catch (error: any) {
      console.warn("[LocationService] GPS Error:", error?.message || error);

      if (
        error?.message?.includes("DEADLINE_EXCEEDED") ||
        error?.message?.includes("No address associated") ||
        error?.message?.includes("Location provider") ||
        error?.message?.includes("Network")
      ) {
        console.log("[LocationService] Network/GPS issue → Using fallback");
      }

      return APP_DEFAULT_LOCATION;
    }
  }

  async requestPermissions(): Promise<boolean> {
    console.warn("[LocationService] DEPRECATED: Use permissionService.checkOrRequestLocation()");
    return this.permissionService.checkOrRequestLocation();
  }
}
