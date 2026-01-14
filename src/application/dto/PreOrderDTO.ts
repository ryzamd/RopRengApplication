export interface CreatePreOrderRequestDTO {
  user_id: string;
  dateTimeCreated: string;
  dateTimeUpdated: string;
  orderType: 'DELIVERY' | 'TAKEAWAY';
  orderStatus: 'PENDING_PAYMENT';
  paymentMethod: string;
  store_id: number;
  items: {
    menuItemId: string;
    quantity: number;
    size: 'small' | 'medium' | 'large';
    ice: 'normal' | 'separate' | 'less';
    sweetness: 'normal' | 'less' | 'more';
    toppings: {
      id: string;
      name: string;
      price: number;
    }[];
  }[];
  promotions: { promotionId: string }[];
}

export interface CreatePreOrderResponseDTO {
  preorder_id: number;
  subtotal: number;
  discount_amount: number;
  delivery_fee: number;
  final_amount: number;
}