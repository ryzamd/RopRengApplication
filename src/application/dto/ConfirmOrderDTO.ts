export interface ConfirmOrderRequestDTO {
  user_id: string;
  store_id: number;
  items: ConfirmOrderItemDTO[];
  voucher_code: ConfirmOrderVoucherDTO[];
  address: ConfirmOrderAddressDTO;
  contact_name: string;
  contact_phone: string;
  note: string;
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