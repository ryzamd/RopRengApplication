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
    address?: string;
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

  async searchAddress(query: string): Promise<GeocodingFeature[]> {
    if (!query || query.length < 2) return [];

    try {
      const url = `${this.baseUrl}/autocomplete?text=${encodeURIComponent(query)}&key=${this.apiKey}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data: GeocodingResponse = await response.json();
      return data.features || [];
    } catch (error) {
      console.error('Error searching address:', error);
      return [];
    }
  }

  async reverseGeocode(lat: number, lng: number): Promise<GeocodingFeature | null> {
    try {
      const url = `${this.baseUrl}/reverse?lat=${lat}&lng=${lng}&key=${this.apiKey}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data: GeocodingResponse = await response.json();
      if (data.features && data.features.length > 0) {
        return data.features[0];
      }
      return null;
    } catch (error) {
      console.error('Error reverse geocoding:', error);
      return null;
    }
  }
}

export const geocodingService = new GeocodingService();