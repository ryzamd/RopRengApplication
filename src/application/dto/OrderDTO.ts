export interface OrderHistoryResponseDTO {
  success: boolean;
  message: string;
  page: number;
  limit: number;
  total: number;
  total_pages: number;
  orders: OrderDTO[];
}

export interface OrderDTO {
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
  address: string | null;
  contact_name: string | null;
  contact_phone: string | null;
  note: string | null;
  created_at: string;
  updated_at: string | null;
  deleted_at: string | null;
  order_items: OrderItemDTO[];
}

export interface OrderItemDTO {
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
    toppings: string[];
    sweetness: string;
  };
  created_at: string;
}