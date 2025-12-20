import { OrderType } from "@/src/presentation/screens/preorder/PreOrderEnums";

interface CalculateShippingRequest {
  lng_store: number;
  lat_store: number;
  lng_user: number;
  lat_user: number;
  orderType: OrderType.TAKEAWAY | OrderType.DELIVERY;
}

interface CalculateShippingResponse {
  shippingFee: number;
  estimatedTime?: string;
  distance?: number;
}

export class PreOrderAPI {
  private static instance: PreOrderAPI;
  private readonly baseUrl = 'https://api.ropreng.vn'; // Mock URL

  private constructor() {}

  static getInstance(): PreOrderAPI {
    if (!PreOrderAPI.instance) {
      PreOrderAPI.instance = new PreOrderAPI();
    }
    return PreOrderAPI.instance;
  }

  async calculateShipping(params: CalculateShippingRequest): Promise<CalculateShippingResponse> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Return 0 for TAKEAWAY orders
    if (params.orderType === 'TAKEAWAY') {
      return {
        shippingFee: 0,
        estimatedTime: '0 phút',
        distance: 0,
      };
    }

    // Calculate Haversine distance
    const distance = this.calculateHaversineDistance(
      params.lat_store,
      params.lng_store,
      params.lat_user,
      params.lng_user
    );

    // Mock pricing logic
    let shippingFee = 0;
    if (distance < 3) {
      shippingFee = 15000;
    } else if (distance <= 5) {
      shippingFee = 25000;
    } else {
      const extraKm = Math.ceil(distance - 5);
      shippingFee = 35000 + (extraKm * 5000);
    }

    const estimatedTime = Math.ceil(distance * 3); // 3 minutes per km

    console.log('[PreOrderAPI] Mock shipping calculation:', {
      distance: distance.toFixed(2),
      shippingFee,
      estimatedTime,
    });

    return {
      shippingFee,
      estimatedTime: `${estimatedTime} phút`,
      distance: parseFloat(distance.toFixed(2)),
    };
  }

  private calculateHaversineDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6371; // Earth's radius in km
    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) *
        Math.cos(this.toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRad(degrees: number): number {
    return degrees * (Math.PI / 180);
  }
}