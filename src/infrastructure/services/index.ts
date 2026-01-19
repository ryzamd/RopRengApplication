import { LocationService } from "./LocationService";
import { permissionService } from "./PermissionService";

export const locationService = new LocationService(permissionService);

export type { ILocationCoordinate } from "./LocationService";
export { permissionService };

