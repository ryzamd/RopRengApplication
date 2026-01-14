export interface ProductDTO {
  menu_item_id: number;
  product_id: number;
  name: string;
  price: string;
  image_url: string;
  category_id: number;
  meta: Record<string, unknown> | null;
}

export interface HomeMenuResponseDTO {
  code: number;
  message: string;
  data: {
    store_id: number;
    menu_id: number;
    products: ProductDTO[];
  };
}

export const HOME_API_CODES = {
  SUCCESS: 1001,
} as const;