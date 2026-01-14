export interface ProductDTO {
  menu_item_id: number;
  product_id: number;
  name: string;
  price: string;
  image_url: string;
  category_id: number;
  meta: Record<string, unknown> | null;
}

export interface StoreDTO {
  id: number;
  region_id: number;
  name: string;
  slug: string | null;
  address: string | null;
  location: {
    type: string;
    coordinates: [number, number];
  };
  phone: string | null;
  email: string | null;
  timezone: string;
  is_active: number;
  created_at: string;
  updated_at: string | null;
  deleted_at: string | null;
  current_loyalty_point: number;
}

export interface HomeMenuResponseDTO {
  code: number;
  message: string;
  data: {
    store_id: number;
    store: StoreDTO;
    menu_id: number;
    products: ProductDTO[];
  };
}

export const HOME_API_CODES = {
  SUCCESS: 1001,
} as const;