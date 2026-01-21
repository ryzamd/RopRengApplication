export interface PreOrder {
  readonly preorderId: number;
  readonly subtotal: number;
  readonly discountAmount: number;
  readonly deliveryFee: number;
  readonly finalAmount: number;
  readonly createdAt: Date;
}

export interface PreOrderItem {
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
}