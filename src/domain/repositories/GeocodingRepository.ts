import { IAddressSuggestion, ILocationCoordinate } from '../shared/types';

export interface IGeocodingRepository {
    searchAddress(query: string, sessionToken: string): Promise<IAddressSuggestion[]>;
    getPlaceDetail(placeId: string, sessionToken: string): Promise<ILocationCoordinate>;
    reverseGeocode(coordinate: ILocationCoordinate): Promise<string>;
    getPlaceDetail(placeId: string, sessionToken: string): Promise<ILocationCoordinate>;
    reverseGeocode(coordinate: ILocationCoordinate): Promise<string>;
}
