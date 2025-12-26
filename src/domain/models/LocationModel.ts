import { ILocationCoordinate } from "@/src/infrastructure/services/LocationService";

export interface IAddressSuggestion {
  place_id: string;
  description: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
  };
}

export interface IGeocodingRepository {
  searchAddress(query: string, sessionToken: string): Promise<IAddressSuggestion[]>;
  getPlaceDetail(placeId: string, sessionToken: string): Promise<ILocationCoordinate>;
  reverseGeocode(coordinate: ILocationCoordinate): Promise<string>;
}