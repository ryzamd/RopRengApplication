export interface CreatePreOrderRequestDTO {
  user_id: string;
  user_lat: number;
  user_lng: number;
  user_address: string;
  store_id: number;
  store_lat: number;
  store_lng: number;
  store_address: string;
  user_name: string;
  shipping_type: string;
  payment_method: string;
  items: {
    menuItemId: string;
    quantity: number;
    size: string;
    ice: string;
    sweetness: string;
    toppings: {
      id: string;
      name: string;
      price: number;
    }[];
  }[];
  vouchers: number[];
  promotions: { promotionId: string }[];
  dateTimeCreated: string;
  dateTimeUpdated: string;
}

export interface CreatePreOrderResponseDTO {
  order: {
    subtotal: number;
    discount_amount: number;
    delivery_fee: number;
    total: number;
  };
}

export type ConfirmOrderRequestDTO = CreatePreOrderRequestDTO;

export interface ConfirmOrderResponseDTO {
  order: {
    order_id: number;
    subtotal: number;
    discount_amount: number;
    delivery_fee: number;
    total: number;
  };
}