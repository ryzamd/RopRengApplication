/**
 * Order Data Transfer Objects
 * DTOs for order-related API requests/responses
 */

import { OrderStatus } from '../../../domain/entities/order/OrderStatus';

/**
 * Order item in request/response
 */
export interface OrderItemDTO {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  selectedOptions?: Record<string, string>;
}

/**
 * Delivery address
 */
export interface DeliveryAddressDTO {
  street: string;
  ward: string;
  district: string;
  city: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

/**
 * Order response from API
 */
export interface OrderDTO {
  id: string;
  userId: string;
  storeId: string;
  items: OrderItemDTO[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  status: OrderStatus;
  deliveryAddress?: DeliveryAddressDTO;
  deliveryTime?: number;
  notes?: string;
  createdAt: number;
  updatedAt: number;
}

/**
 * Create order request
 */
export interface CreateOrderRequest {
  storeId: string;
  items: {
    productId: string;
    quantity: number;
    selectedOptions?: Record<string, string>;
  }[];
  deliveryAddress?: DeliveryAddressDTO;
  deliveryTime?: number;
  notes?: string;
  voucherCode?: string;
}

/**
 * Create order response
 */
export interface CreateOrderResponse {
  order: OrderDTO;
  paymentUrl?: string; // For VNPay redirect
}

/**
 * Update order status request
 */
export interface UpdateOrderStatusRequest {
  status: OrderStatus;
  notes?: string;
}

/**
 * Update order status response
 */
export interface UpdateOrderStatusResponse {
  order: OrderDTO;
}

/**
 * Get orders request
 */
export interface GetOrdersRequest {
  userId?: string;
  status?: OrderStatus;
  limit?: number;
  offset?: number;
}

/**
 * Get orders response
 */
export interface GetOrdersResponse {
  orders: OrderDTO[];
  total: number;
}

/**
 * Cancel order request
 */
export interface CancelOrderRequest {
  reason?: string;
}

/**
 * Cancel order response
 */
export interface CancelOrderResponse {
  order: OrderDTO;
}
