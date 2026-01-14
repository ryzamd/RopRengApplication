import { LocationPermissionError, LocationServiceError } from '@/src/core/errors/AppErrors';
import { HomeRepository, HomeMenuParams, HomeMenuResult } from '../../domain/repositories/HomeRepository';

export class GetHomeMenuUseCase {
  constructor(private readonly repository: HomeRepository) {}

  async execute(params: HomeMenuParams): Promise<HomeMenuResult> {
    if (!params.lat || !params.lng) {
      throw new LocationPermissionError();
    }

    if (params.lat < -90 || params.lat > 90) {
      throw new LocationServiceError();
    }
    if (params.lng < -180 || params.lng > 180) {
      throw new LocationServiceError();
    }

    return this.repository.getHomeMenu({
      lat: params.lat,
      lng: params.lng,
      limit: params.limit ?? 10,
      page: params.page ?? 0,
    });
  }
}