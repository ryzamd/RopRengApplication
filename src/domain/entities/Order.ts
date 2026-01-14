export class Order {
  constructor(
    public readonly id: number,
    public readonly orderCode: string,
    public readonly userId: number,
    public readonly storeId: number,
    public readonly source: string,
    public readonly subtotal: string,
    public readonly totalAmount: string,
    public readonly deliveryFee: string,
    public readonly discountAmount: string,
    public readonly finalAmount: string,
    public readonly paymentMethod: string,
    public readonly paymentStatus: string,
    public readonly orderStatus: string,
    public readonly address: string | null,
    public readonly contactName: string | null,
    public readonly contactPhone: string | null,
    public readonly note: string | null,
    public readonly createdAt: string,
    public readonly updatedAt: string | null,
    public readonly deletedAt: string | null,
    public readonly items: OrderItem[]
  ) {}
}

export class OrderItem {
  constructor(
    public readonly id: number,
    public readonly orderId: number,
    public readonly productId: number | null,
    public readonly menuItemId: number,
    public readonly name: string,
    public readonly qty: number,
    public readonly unitPrice: string,
    public readonly totalPrice: string,
    public readonly options: OrderItemOptions,
    public readonly createdAt: string
  ) {}
}

export interface OrderItemOptions {
  ice: string;
  size: string;
  toppings: string[];
  sweetness: string;
}