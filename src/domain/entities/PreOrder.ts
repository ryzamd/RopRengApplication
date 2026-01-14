export class PreOrder {
  constructor(
    public readonly preorderId: number,
    public readonly subtotal: number,
    public readonly discountAmount: number,
    public readonly deliveryFee: number,
    public readonly finalAmount: number,
    public readonly createdAt: Date
  ) {}
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