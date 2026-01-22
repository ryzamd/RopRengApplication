import { DeliveryAddress } from '../../domain/shared/types';

export interface ConfirmOrderRequestDTO {
  user_id: string;
  store_id: number;
  items: ConfirmOrderItemDTO[];
  voucher_code: ConfirmOrderVoucherDTO[];
  address: ConfirmOrderAddressDTO;
  contact_name?: string | null;
  contact_phone?: string | null;
  note?: string | null;
}

export interface ConfirmOrderItemDTO {
  menu_item_id: number;
  product_id: number;
  name: string;
  qty: number;
  unit_price: number;
  options: {
    toppings: { id: number }[];
  };
}

export interface ConfirmOrderVoucherDTO {
  promotionId: string;
}

export interface ConfirmOrderAddressDTO {
  lat: number;
  lng: number;
  detail: string;
}

export interface ConfirmOrderResponseDTO {
  order: {
    id: number;
    order_code: string;
    user_id: number;
    store_id: number;
    staff_user_id: number | null;
    pos_id: number | null;
    source: string;
    subtotal: string;
    total_amount: string;
    delivery_fee: string;
    discount_amount: string;
    final_amount: string;
    payment_method: string;
    payment_status: string;
    order_status: string;
    address: DeliveryAddress | null;
    contact_name: string | null;
    contact_phone: string | null;
    note: string | null;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    order_items: ConfirmOrderItemResponseDTO[];
  };
}

export interface ConfirmOrderItemResponseDTO {
  id: number;
  order_id: number;
  product_id: number | null;
  menu_item_id: number;
  name: string;
  qty: number;
  unit_price: string;
  total_price: string;
  options: {
    ice: string;
    size: string;
    toppings: Array<{ id: string; name?: string; price?: number }>;
    sweetness: string;
  };
  created_at: string;
}