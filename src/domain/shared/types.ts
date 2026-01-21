export interface ILocationCoordinate {
    latitude: number;
    longitude: number;
}

export interface IAddressSuggestion {
    placeId: string;
    description: string;
    mainText: string;
    secondaryText: string;
}

/**
 * Unified delivery address structure used across the app
 * Combines UI state (addressString, placeId) with API requirements (lat, lng, detail)
 */
export interface DeliveryAddress {
    // Core location data (required by API)
    lat: number;
    lng: number;
    detail: string;

    // UI/UX additional data (optional)
    addressString?: string;
    placeId?: string;
    contactName?: string;
    contactPhone?: string;
}