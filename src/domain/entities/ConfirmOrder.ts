import { ConfirmOrderItem } from "./ConfirmOrderItem";

export interface DeliveryAddress {
  lat: number;
  lng: number;
  detail: string;
}

export class ConfirmOrder {
  constructor(
    public readonly id: number,
    public readonly orderCode: string,
    public readonly userId: number,
    public readonly storeId: number,
    public readonly source: string,
    public readonly subtotal: number,
    public readonly totalAmount: number,
    public readonly deliveryFee: number,
    public readonly discountAmount: number,
    public readonly finalAmount: number,
    public readonly paymentMethod: string,
    public readonly paymentStatus: string,
    public readonly orderStatus: string,
    public readonly address: DeliveryAddress | null,
    public readonly contactName: string | null,
    public readonly contactPhone: string | null,
    public readonly note: string | null,
    public readonly items: ConfirmOrderItem[],
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  get hasDeliveryAddress(): boolean {
    return this.address !== null && this.address.detail.length > 0;
  }

  get hasDiscount(): boolean {
    return this.discountAmount > 0;
  }

  get totalItemsCount(): number {
    return this.items.reduce((sum, item) => sum + item.quantity, 0);
  }

  canConfirm(): { valid: boolean; error: string | null } {
    if (this.items.length === 0) {
      return { valid: false, error: "Đơn hàng không có sản phẩm" };
    }

    if (this.finalAmount <= 0) {
      return { valid: false, error: "Giá trị đơn hàng không hợp lệ" };
    }

    return { valid: true, error: null };
  }

  canRemoveItem(): boolean {
    return this.items.length > 1;
  }

  withUpdatedItems(newItems: ConfirmOrderItem[]): ConfirmOrder {
    const newSubtotal = newItems.reduce((sum, item) => sum + item.totalPrice, 0);
    const newFinalAmount = Math.max(0, newSubtotal + this.deliveryFee - this.discountAmount);

    return new ConfirmOrder(
      this.id,
      this.orderCode,
      this.userId,
      this.storeId,
      this.source,
      newSubtotal,
      newSubtotal,
      this.deliveryFee,
      this.discountAmount,
      newFinalAmount,
      this.paymentMethod,
      this.paymentStatus,
      this.orderStatus,
      this.address,
      this.contactName,
      this.contactPhone,
      this.note,
      newItems,
      this.createdAt,
      this.updatedAt,
    );
  }
}
