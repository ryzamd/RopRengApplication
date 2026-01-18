import { GetStoresParams, StoreRepository, StoresResult } from '../../domain/repositories/StoreRepository';

export class GetStoresUseCase {
  constructor(private readonly repository: StoreRepository) {}

  async execute(params?: GetStoresParams): Promise<StoresResult> {
    return this.repository.getStores({
      page: params?.page ?? 1,
      limit: params?.limit ?? 10,
    });
  }
}