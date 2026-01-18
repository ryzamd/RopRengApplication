import { Menu } from '../../domain/entities/Menu';
import { Region } from '../../domain/entities/Region';
import { Store } from '../../domain/entities/Store';
import { StoresResult } from '../../domain/repositories/StoreRepository';
import { GetStoresResponseDTO, MenuDTO, RegionDTO, StoreByProductDTO, StoreDetailDTO } from '../dto/StoreDTO';

export class StoreMapper {
  static toRegionEntity(dto: RegionDTO): Region {
    return new Region(
      dto.id,
      dto.parent_id,
      dto.name,
      dto.code,
      dto.level,
      dto.img,
      new Date(dto.created_at),
      dto.updated_at ? new Date(dto.updated_at) : null,
      dto.deleted_at ? new Date(dto.deleted_at) : null
    );
  }

  static toMenuEntity(dto: MenuDTO): Menu {
    return new Menu(
      dto.id,
      dto.store_id,
      dto.name,
      dto.is_default,
      dto.note,
      new Date(dto.created_at),
      dto.updated_at ? new Date(dto.updated_at) : null,
      dto.deleted_at ? new Date(dto.deleted_at) : null
    );
  }

  static toStoreEntity(dto: StoreDetailDTO): Store {
    const region = StoreMapper.toRegionEntity(dto.region);
    const menus = dto.menus.map(menu => StoreMapper.toMenuEntity(menu));

    return new Store(
      dto.id,
      dto.region_id,
      dto.name,
      dto.slug,
      dto.address,
      dto.location,
      dto.phone,
      dto.email,
      dto.timezone,
      dto.is_active,
      dto.created_at,
      dto.updated_at,
      dto.deleted_at,
      dto.current_loyalty_point,
      region,
      menus
    );
  }

  static toStoresResult(response: GetStoresResponseDTO): StoresResult {
    return {
      stores: response.stores.map(store => StoreMapper.toStoreEntity(store)),
      page: response.page,
      limit: response.limit,
      total: response.total,
      totalPages: response.total_pages,
    };
  }

  static toSerializableStore(store: Store) {
    return {
      id: store.id,
      regionId: store.regionId,
      name: store.name,
      slug: store.slug,
      address: store.address,
      location: store.location,
      phone: store.phone,
      email: store.email,
      timezone: store.timezone,
      isActive: store.isActive,
      createdAt: store.createdAt,
      updatedAt: store.updatedAt,
      deletedAt: store.deletedAt,
      currentLoyaltyPoint: store.currentLoyaltyPoint,
      region: store.region
        ? {
            id: store.region.id,
            parentId: store.region.parentId,
            name: store.region.name,
            code: store.region.code,
            level: store.region.level,
            img: store.region.img,
            createdAt: store.region.createdAt.toISOString(),
            updatedAt: store.region.updatedAt?.toISOString() ?? null,
            deletedAt: store.region.deletedAt?.toISOString() ?? null,
          }
        : undefined,
      menus: store.menus?.map(menu => ({
        id: menu.id,
        storeId: menu.storeId,
        name: menu.name,
        isDefault: menu.isDefault,
        note: menu.note,
        createdAt: menu.createdAt.toISOString(),
        updatedAt: menu.updatedAt?.toISOString() ?? null,
        deletedAt: menu.deletedAt?.toISOString() ?? null,
      })),
    };
  }

  static toStoreFromProductDTO(dto: StoreByProductDTO): Store {
    return new Store(
      dto.store_id,
      0, // regionId not provided
      dto.name,
      null,
      dto.address,
      dto.location,
      null,
      null,
      'Asia/Ho_Chi_Minh',
      1,
      new Date().toISOString(),
      null,
      null,
      0,
      undefined, // region
      undefined  // menus will be fetched separately if needed
    );
  }
}