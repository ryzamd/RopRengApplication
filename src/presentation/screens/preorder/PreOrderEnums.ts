export enum OrderType {
  DELIVERY = 'DELIVERY',
  TAKEAWAY = 'TAKEAWAY',
  DINE_IN = 'DINE_IN',
}

export enum PaymentMethod {
  CASH = 'CASH',
  VNPAY = 'VNPAY',
  MOMO = 'MOMO',
}

export enum PreOrderStep {
  REVIEW = 'REVIEW',
  ORDER_TYPE_SELECT = 'ORDER_TYPE_SELECT',
  PAYMENT_SELECT = 'PAYMENT_SELECT',
}