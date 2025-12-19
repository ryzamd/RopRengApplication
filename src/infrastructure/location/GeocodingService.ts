import { TRACKASIA_CONFIG } from '../../config/trackasia.config';

interface GeocodingResponse {
  features: {
    place_name: string;
    center: [number, number];
    properties: {
      address?: string;
    };
  }[];
}

export class GeocodingService {
  private static instance: GeocodingService;
  private readonly baseUrl = TRACKASIA_CONFIG.BASE_API_URL;
  private readonly apiKey = TRACKASIA_CONFIG.API_KEY;

  private constructor() {}

  static getInstance(): GeocodingService {
    if (!GeocodingService.instance) {
      GeocodingService.instance = new GeocodingService();
    }
    return GeocodingService.instance;
  }

  async reverseGeocode(latitude: number, longitude: number): Promise<string> {
    try {
      const url = `${this.baseUrl}/reverse.json?key=${this.apiKey}&lat=${latitude}&lng=${longitude}`;
      
      const response = await fetch(url);
      const data: GeocodingResponse = await response.json();

      if (data.features && data.features.length > 0) {
        return data.features[0].place_name;
      }

      return `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
    } catch (error) {
      console.error('[GeocodingService] Reverse geocode error:', error);
      return `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
    }
  }

  async geocode(address: string): Promise<{ latitude: number; longitude: number } | null> {
    try {
      const url = `${this.baseUrl}/geocode.json?key=${this.apiKey}&q=${encodeURIComponent(address)}`;
      
      const response = await fetch(url);
      const data: GeocodingResponse = await response.json();

      if (data.features && data.features.length > 0) {
        const [longitude, latitude] = data.features[0].center;
        return { latitude, longitude };
      }

      return null;
    } catch (error) {
      console.error('[GeocodingService] Geocode error:', error);
      return null;
    }
  }

  async searchAddress(query: string): Promise<{ address: string; latitude: number; longitude: number }[]> {
    try {
      const url = `${this.baseUrl}/autocomplete.json?key=${this.apiKey}&q=${encodeURIComponent(query)}`;
      
      const response = await fetch(url);
      const data: GeocodingResponse = await response.json();

      return data.features.map((feature) => ({
        address: feature.place_name,
        latitude: feature.center[1],
        longitude: feature.center[0],
      }));
    } catch (error) {
      console.error('[GeocodingService] Search address error:', error);
      return [];
    }
  }
}