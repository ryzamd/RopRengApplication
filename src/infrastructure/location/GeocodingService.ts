import { TRACKASIA_CONFIG } from '../../config/trackasia.config';

export interface GeocodingFeature {
  id: string;
  place_name: string;
  center: [number, number];
  geometry: {
    type: string;
    coordinates: [number, number];
  };
  properties: {
    name: string;
    label?: string;
    housenumber?: string;
    street?: string;
  };
}

export interface GeocodingResponse {
  features: GeocodingFeature[];
}

class GeocodingService {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = TRACKASIA_CONFIG.API_KEY;
    this.baseUrl = TRACKASIA_CONFIG.BASE_API_URL;
  }

  async searchAddress(query: string, focusPoint?: { lat: number; lng: number }): Promise<GeocodingFeature[]> {
    if (!query || query.length < 2) return [];

    try {
      let url = `${this.baseUrl}/autocomplete?text=${encodeURIComponent(query)}&key=${this.apiKey}`;
      
      if (focusPoint) {
        url += `&focus.point.lat=${focusPoint.lat}&focus.point.lon=${focusPoint.lng}`;
      }

      url += `&boundary.country=VN`;

      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data: GeocodingResponse = await response.json();
      return data.features || [];

    } catch (error) {
      console.error('GeocodingService search error:', error);
      return [];
    }
  }

  async reverseGeocode(lat: number, lng: number): Promise<GeocodingFeature | null> {
    try {
      const url = `${this.baseUrl}/reverse?lat=${lat}&lng=${lng}&key=${this.apiKey}`;
      const response = await fetch(url);

      if (!response.ok) throw new Error('Reverse geocoding failed');

      const data: GeocodingResponse = await response.json();
      if (data.features && data.features.length > 0) {
        return data.features[0];
      }
      return null;
    } catch (error) {
      console.error('GeocodingService reverse error:', error);
      return null;
    }
  }
}

export const geocodingService = new GeocodingService();