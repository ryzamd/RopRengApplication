import { APP_DEFAULT_LOCATION } from "@/src/core/config/locationConstants";
import * as Location from "expo-location";
import { ILocationCoordinate } from "../../domain/shared/types";
import { PermissionService } from "./PermissionService";

export type { ILocationCoordinate } from "../../domain/shared/types";

const LOCATION_TIMEOUT_MS = 3000;

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

      const lastKnown = await Location.getLastKnownPositionAsync();
      if (lastKnown) {
        console.log("[LocationService] Using last known position:", {
          latitude: lastKnown.coords.latitude,
          longitude: lastKnown.coords.longitude,
        });
        return {
          latitude: lastKnown.coords.latitude,
          longitude: lastKnown.coords.longitude,
        };
      }

      console.log("[LocationService] Fetching GPS location with timeout...");

      const locationPromise = Location.getCurrentPositionAsync({
        accuracy,
      });

      const timeoutPromise = new Promise<null>((_, reject) => {
        setTimeout(() => {
          reject(new Error("LOCATION_TIMEOUT"));
        }, LOCATION_TIMEOUT_MS);
      });

      const location = await Promise.race([locationPromise, timeoutPromise]);

      if (location) {
        const coords = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        };
        console.log("[LocationService] ✅ GPS location:", coords);
        return coords;
      }

      // Should not reach here, but fallback just in case
      return APP_DEFAULT_LOCATION;

    } catch (error: any) {
      const errorMsg = error?.message || error;

      if (errorMsg === "LOCATION_TIMEOUT") {
        console.log("[LocationService] GPS timeout → Using fallback immediately");
      } else {
        console.warn("[LocationService] GPS Error:", errorMsg);
      }

      return APP_DEFAULT_LOCATION;
    }
  }

  async requestPermissions(): Promise<boolean> {
    console.warn("[LocationService] DEPRECATED: Use permissionService.checkOrRequestLocation()");
    return this.permissionService.checkOrRequestLocation();
  }
}
