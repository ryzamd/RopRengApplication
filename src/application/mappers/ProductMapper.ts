import { Product, ProductBadge } from '../../domain/entities/Product';
import { Store } from '../../domain/entities/Store';
import { HomeMenuResult } from '../../domain/repositories/HomeRepository';
import { HomeMenuResponseDTO, ProductDTO, StoreDTO } from '../dto/HomeMenuDTO';

export class ProductMapper {
  static toEntity(dto: ProductDTO): Product {
    const price = parseFloat(dto.price);
    const badge = ProductMapper.parseBadge(dto.meta);

    return new Product(
      String(dto.product_id),
      dto.menu_item_id,
      dto.product_id,
      dto.name,
      price,
      dto.image_url,
      String(dto.category_id),
      undefined,
      badge,
      undefined,
      'AVAILABLE'
    );
  }

  static toEntityList(dtos: ProductDTO[]): Product[] {
    return dtos.map(dto => ProductMapper.toEntity(dto));
  }

  static toStoreEntity(dto: StoreDTO): Store {
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
      dto.current_loyalty_point
    );
  }

  static toHomeMenuResult(response: HomeMenuResponseDTO): HomeMenuResult {
    return {
      storeId: response.data.store_id,
      store: ProductMapper.toStoreEntity(response.data.store),
      menuId: response.data.menu_id,
      products: ProductMapper.toEntityList(response.data.products),
    };
  }

  private static parseBadge(meta: Record<string, unknown> | null): ProductBadge | undefined {
    if (!meta) return undefined;
    if (meta.isNew === true) return 'NEW';
    if (meta.isHot === true) return 'HOT';
    return undefined;
  }
}