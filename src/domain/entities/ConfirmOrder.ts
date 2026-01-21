import { DeliveryAddress } from "../shared/types";
import { ConfirmOrderItem } from "./ConfirmOrderItem";

export interface ConfirmOrder {
  readonly id: number;
  readonly orderCode: string;
  readonly userId: number;
  readonly storeId: number;
  readonly source: string;
  readonly subtotal: number;
  readonly totalAmount: number;
  readonly deliveryFee: number;
  readonly discountAmount: number;
  readonly finalAmount: number;
  readonly paymentMethod: string;
  readonly paymentStatus: string;
  readonly orderStatus: string;
  readonly address: DeliveryAddress | null;
  readonly contactName: string | null;
  readonly contactPhone: string | null;
  readonly note: string | null;
  readonly items: ConfirmOrderItem[];
  readonly createdAt: Date;
  readonly updatedAt: Date;
}
