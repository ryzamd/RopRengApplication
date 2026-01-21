import { Menu } from '../../domain/entities/Menu';
import { Region } from '../../domain/entities/Region';
import { Store } from '../../domain/entities/Store';
import { StoresResult } from '../../domain/repositories/StoreRepository';
import { GetStoresResponseDTO, MenuDTO, RegionDTO, StoreByProductDTO, StoreDetailDTO } from '../dto/StoreDTO';

export class StoreMapper {
  static toRegionEntity(dto: RegionDTO): Region {
    return {
      id: dto.id,
      parentId: dto.parent_id,
      name: dto.name,
      code: dto.code,
      level: dto.level,
      img: dto.img,
      createdAt: new Date(dto.created_at),
      updatedAt: dto.updated_at ? new Date(dto.updated_at) : null,
      deletedAt: dto.deleted_at ? new Date(dto.deleted_at) : null,
    };
  }

  static toMenuEntity(dto: MenuDTO): Menu {
    return {
      id: dto.id,
      storeId: dto.store_id,
      name: dto.name,
      isDefault: dto.is_default === 1,
      note: dto.note,
      createdAt: new Date(dto.created_at),
      updatedAt: dto.updated_at ? new Date(dto.updated_at) : null,
      deletedAt: dto.deleted_at ? new Date(dto.deleted_at) : null,
    };
  }

  static toStoreEntity(dto: StoreDetailDTO): Store {
    const region = StoreMapper.toRegionEntity(dto.region);
    const menus = dto.menus.map(menu => StoreMapper.toMenuEntity(menu));

    return {
      id: dto.id,
      regionId: dto.region_id,
      name: dto.name,
      slug: dto.slug,
      address: dto.address,
      location: dto.location,
      phone: dto.phone,
      email: dto.email,
      timezone: dto.timezone,
      isActive: dto.is_active === 1,
      createdAt: dto.created_at,
      updatedAt: dto.updated_at,
      deletedAt: dto.deleted_at,
      currentLoyaltyPoint: dto.current_loyalty_point,
      region,
      menus,
    };
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
    return {
      id: dto.store_id,
      regionId: 0, // regionId not provided
      name: dto.name,
      slug: null,
      address: dto.address,
      location: dto.location,
      phone: null,
      email: null,
      timezone: 'Asia/Ho_Chi_Minh',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: null,
      deletedAt: null,
      currentLoyaltyPoint: 0,
      region: undefined,
      menus: undefined,
    };
  }
}