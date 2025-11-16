/**
 * Order API
 * API endpoints for order-related operations
 */

import { apiClient } from '../ApiClient';
import {
  OrderDTO,
  CreateOrderRequest,
  CreateOrderResponse,
  UpdateOrderStatusRequest,
  UpdateOrderStatusResponse,
  GetOrdersRequest,
  GetOrdersResponse,
  CancelOrderRequest,
  CancelOrderResponse,
} from '../dto';

export class OrderApi {
  private static readonly BASE_PATH = '/orders';

  /**
   * Create new order
   */
  public static async createOrder(
    request: CreateOrderRequest
  ): Promise<CreateOrderResponse> {
    const response = await apiClient.post<CreateOrderResponse>(
      this.BASE_PATH,
      request
    );
    return response.data;
  }

  /**
   * Get order by ID
   */
  public static async getOrderById(orderId: string): Promise<OrderDTO> {
    const response = await apiClient.get<OrderDTO>(
      `${this.BASE_PATH}/${orderId}`
    );
    return response.data;
  }

  /**
   * Get orders with filters
   */
  public static async getOrders(
    request?: GetOrdersRequest
  ): Promise<GetOrdersResponse> {
    const response = await apiClient.get<GetOrdersResponse>(this.BASE_PATH, {
      params: request,
    });
    return response.data;
  }

  /**
   * Get user's orders
   */
  public static async getUserOrders(userId: string): Promise<GetOrdersResponse> {
    const response = await apiClient.get<GetOrdersResponse>(
      `${this.BASE_PATH}/user/${userId}`
    );
    return response.data;
  }

  /**
   * Get current user's orders
   */
  public static async getMyOrders(): Promise<GetOrdersResponse> {
    const response = await apiClient.get<GetOrdersResponse>(
      `${this.BASE_PATH}/me`
    );
    return response.data;
  }

  /**
   * Update order status
   */
  public static async updateOrderStatus(
    orderId: string,
    request: UpdateOrderStatusRequest
  ): Promise<UpdateOrderStatusResponse> {
    const response = await apiClient.patch<UpdateOrderStatusResponse>(
      `${this.BASE_PATH}/${orderId}/status`,
      request
    );
    return response.data;
  }

  /**
   * Cancel order
   */
  public static async cancelOrder(
    orderId: string,
    request?: CancelOrderRequest
  ): Promise<CancelOrderResponse> {
    const response = await apiClient.post<CancelOrderResponse>(
      `${this.BASE_PATH}/${orderId}/cancel`,
      request
    );
    return response.data;
  }

  /**
   * Get active orders
   */
  public static async getActiveOrders(): Promise<GetOrdersResponse> {
    const response = await apiClient.get<GetOrdersResponse>(
      `${this.BASE_PATH}/active`
    );
    return response.data;
  }

  /**
   * Get order history
   */
  public static async getOrderHistory(
    limit: number = 10
  ): Promise<GetOrdersResponse> {
    const response = await apiClient.get<GetOrdersResponse>(
      `${this.BASE_PATH}/history`,
      {
        params: { limit },
      }
    );
    return response.data;
  }
}
