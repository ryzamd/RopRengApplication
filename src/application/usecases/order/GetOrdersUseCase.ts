/**
 * Get Orders Use Case
 * Retrieves user's orders
 */

import { Order } from '../../../domain/entities/order/Order';
import { OrderStatus } from '../../../domain/entities/order/OrderStatus';
import { OrderRepository } from '../../../infrastructure/repositories/OrderRepository';
import { UserRepository } from '../../../infrastructure/repositories/UserRepository';
import { OrderApi } from '../../../infrastructure/api/endpoints/OrderApi';
import { MockApiService } from '../../../infrastructure/mock/MockApiService';
import { ENV } from '../../../config/env';
import { Logger } from '../../../core/utils/Logger';
import { Price } from '../../../domain/entities/product/Price';
import { OrderItem } from '../../../domain/entities/order/OrderItem';

export interface GetOrdersInput {
  status?: OrderStatus;
  forceRefresh?: boolean;
}

export interface GetOrdersOutput {
  orders: Order[];
  total: number;
}

export class GetOrdersUseCase {
  constructor(
    private orderRepository: OrderRepository,
    private userRepository: UserRepository
  ) {}

  public async execute(input: GetOrdersInput = {}): Promise<GetOrdersOutput> {
    try {
      Logger.info('Getting orders', input);

      // Get current user
      const user = await this.userRepository.getCurrentUser();
      if (!user) {
        throw new Error('Vui lòng đăng nhập để xem đơn hàng');
      }

      // Try to get from local database first (offline-first)
      if (!input.forceRefresh) {
        const localOrders = input.status
          ? await this.orderRepository.findByStatus(input.status)
          : await this.orderRepository.findByUserId(user.id);

        if (localOrders.length > 0) {
          Logger.info('Orders retrieved from local database', {
            count: localOrders.length,
          });

          return {
            orders: localOrders,
            total: localOrders.length,
          };
        }
      }

      // Fetch from API if local database is empty or force refresh
      const result = ENV.USE_MOCK_DATA
        ? await MockApiService.getOrders()
        : await OrderApi.getMyOrders();

      // Convert DTOs to domain entities
      const orders = result.orders.map((dto) => {
        const items = dto.items.map((itemDto) =>
          OrderItem.fromDatabase({
            id: `${dto.id}-item-${itemDto.productId}`,
            productId: itemDto.productId,
            productName: itemDto.productName,
            quantity: itemDto.quantity,
            unitPrice: Price.create(itemDto.unitPrice),
            subtotal: Price.create(itemDto.subtotal),
            selectedOptions: itemDto.selectedOptions,
            createdAt: dto.createdAt,
            updatedAt: dto.updatedAt,
          })
        );

        return Order.fromDatabase({
          id: dto.id,
          userId: dto.userId,
          storeId: dto.storeId,
          items,
          subtotal: Price.create(dto.subtotal),
          deliveryFee: Price.create(dto.deliveryFee),
          discount: Price.create(dto.discount),
          total: Price.create(dto.total),
          status: dto.status,
          deliveryAddress: dto.deliveryAddress,
          deliveryTime: dto.deliveryTime,
          notes: dto.notes,
          createdAt: dto.createdAt,
          updatedAt: dto.updatedAt,
          syncedAt: Date.now(),
        });
      });

      // Save to local database for offline access
      await Promise.all(
        orders.map((order) => this.orderRepository.save(order))
      );

      Logger.info('Orders retrieved from API and cached', {
        count: orders.length,
      });

      return {
        orders,
        total: result.total,
      };
    } catch (error: any) {
      Logger.error('Get orders failed', error);

      // Fallback to local database on error
      const user = await this.userRepository.getCurrentUser();
      if (user) {
        const localOrders = await this.orderRepository.findByUserId(user.id);

        if (localOrders.length > 0) {
          Logger.warn('Using cached orders due to API error');
          return {
            orders: localOrders,
            total: localOrders.length,
          };
        }
      }

      throw new Error(
        error.message || 'Không thể tải đơn hàng. Vui lòng thử lại.'
      );
    }
  }
}
