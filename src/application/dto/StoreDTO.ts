export interface RegionDTO {
  id: number;
  parent_id: number | null;
  name: string;
  code: string;
  level: number;
  created_at: string;
  updated_at: string | null;
  deleted_at: string | null;
  img: string | null;
}

export interface MenuDTO {
  id: number;
  store_id: number;
  name: string;
  is_default: number;
  note: string | null;
  created_at: string;
  updated_at: string | null;
  deleted_at: string | null;
}

export interface StoreDetailDTO {
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
  region: RegionDTO;
  menus: MenuDTO[];
}

export interface GetStoresResponseDTO {
  stores: StoreDetailDTO[];
  page: number;
  limit: number;
  total: number;
  total_pages: number;
}

export interface StoreByProductDTO {
  store_id: number;
  name: string;
  address: string;
  location: {
    type: string;
    coordinates: [number, number];
  };
  menu_id: number;
  distance: number;
}

export interface GetStoresByProductResponseDTO {
  code: number;
  message: string;
  data: StoreByProductDTO[];
}