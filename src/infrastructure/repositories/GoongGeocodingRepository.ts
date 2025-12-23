import { IGeocodingRepository, IAddressSuggestion } from '../../domain/models/LocationModel';
import { GOONG_CONFIG } from '../api/goong/GoongConfig';
import { NetworkError, QuotaExceededError, AppError, ApiError } from '../../core/errors/AppErrors';
import { ILocationCoordinate } from '../services/LocationService';

export class GoongGeocodingRepository implements IGeocodingRepository {
  private readonly VN_LOCATION = '16.047079,108.206230';
  private readonly VN_RADIUS = '1000';

  async searchAddress(query: string, sessionToken: string): Promise<IAddressSuggestion[]> {
    if (!query || query.trim().length < 2) return [];

    try {
      const params = new URLSearchParams({
        api_key: GOONG_CONFIG.API_KEY,
        input: query,
        sessiontoken: sessionToken,
        location: this.VN_LOCATION,
        radius: this.VN_RADIUS,
        limit: '10',
        more_compound: 'true'
      });

      const url = `${GOONG_CONFIG.BASE_URL}${GOONG_CONFIG.AUTOCOMPLETE_ENDPOINT}?${params.toString()}`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new NetworkError();
      }

      const data = await response.json();

      if (data.status === 'OVER_QUERY_LIMIT' || data.status === 'REQUEST_DENIED') {
        throw new QuotaExceededError();
      }

      if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
        console.error('Goong API Error:', data.error_message);
        return [];
      }

      return (data.predictions || []).map((item: any) => ({
        place_id: item.place_id,
        description: item.description,
        structured_formatting: {
          main_text: item.structured_formatting.main_text,
          secondary_text: item.structured_formatting.secondary_text,
        },
      }));

    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new NetworkError();
    }
  }

  async reverseGeocode(coordinate: ILocationCoordinate): Promise<string> {
    try {
      const url = `${GOONG_CONFIG.BASE_URL}/Geocode?latlng=${coordinate.latitude},${coordinate.longitude}&api_key=${GOONG_CONFIG.API_KEY}`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.status !== 'OK') throw new ApiError('Lỗi xác định vị trí');

      return data.results[0]?.formatted_address || 'Địa chỉ không xác định';
    } catch (error) {
       return '';
    }
  }

  async getPlaceDetail(placeId: string, sessionToken: string): Promise<ILocationCoordinate> {
    try {
      if (!placeId) throw new ApiError('Place ID is required');

      const params = new URLSearchParams({
        api_key: GOONG_CONFIG.API_KEY,
        place_id: placeId,
        sessiontoken: sessionToken,
      });

      const url = `${GOONG_CONFIG.BASE_URL}/Place/Detail?${params.toString()}`;
      
      const response = await fetch(url);
      
      if (!response.ok) throw new NetworkError();

      const data = await response.json();

      if (data.status !== 'OK') {
        throw new ApiError(data.error_message || 'Không thể lấy chi tiết địa điểm');
      }

      const { lat, lng } = data.result.geometry.location;
      
      return { latitude: lat, longitude: lng };

    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new NetworkError();
    }
  }
}