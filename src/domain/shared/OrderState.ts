import { OrderType, PaymentMethod } from './OrderEnums';

export interface PreOrderState {
    orderType: OrderType;
    paymentMethod: PaymentMethod;
    shippingFee: number;
}
