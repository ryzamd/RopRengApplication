/**
 * Create Order Use Case
 * Creates a new order with validation
 */

import { Order } from '../../../domain/entities/order/Order';
import { OrderItem } from '../../../domain/entities/order/OrderItem';
import { Price } from '../../../domain/entities/product/Price';
import { OrderRepository } from '../../../infrastructure/repositories/OrderRepository';
import { ProductRepository } from '../../../infrastructure/repositories/ProductRepository';
import { UserRepository } from '../../../infrastructure/repositories/UserRepository';
import { OrderApi } from '../../../infrastructure/api/endpoints/OrderApi';
import { MockApiService } from '../../../infrastructure/mock/MockApiService';
import { ENV } from '../../../config/env';
import { Logger } from '../../../core/utils/Logger';
import { SyncQueue } from '../../../core/sync/SyncQueue';
import { EntityType, SyncOperation, SyncPriority } from '../../../config/constants';
import { EventBus } from '../../../core/events/EventBus';
import { EventType } from '../../../core/events/DomainEvents';

export interface CreateOrderItem {
  productId: string;
  quantity: number;
  selectedOptions?: Record<string, string>;
}

export interface CreateOrderInput {
  storeId: string;
  items: CreateOrderItem[];
  deliveryAddress?: {
    street: string;
    ward: string;
    district: string;
    city: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  deliveryTime?: number;
  notes?: string;
  voucherCode?: string;
}

export interface CreateOrderOutput {
  order: Order;
  paymentUrl?: string;
}

export class CreateOrderUseCase {
  constructor(
    private orderRepository: OrderRepository,
    private productRepository: ProductRepository,
    private userRepository: UserRepository
  ) {}

  public async execute(input: CreateOrderInput): Promise<CreateOrderOutput> {
    try {
      Logger.info('Creating order', input);

      // Get current user
      const user = await this.userRepository.getCurrentUser();
      if (!user) {
        throw new Error('Vui lòng đăng nhập để đặt hàng');
      }

      // Validate and build order items
      const orderItems: OrderItem[] = [];

      for (const item of input.items) {
        const product = await this.productRepository.findById(item.productId);

        if (!product) {
          throw new Error(`Sản phẩm ${item.productId} không tồn tại`);
        }

        if (!product.toObject().isAvailable) {
          throw new Error(`Sản phẩm ${product.toObject().name} hiện không có sẵn`);
        }

        const orderItem = OrderItem.create({
          productId: item.productId,
          productName: product.toObject().name,
          quantity: item.quantity,
          unitPrice: product.toObject().price,
          selectedOptions: item.selectedOptions,
        });

        orderItems.push(orderItem);
      }

      // Create order locally first (optimistic update)
      const order = Order.create({
        userId: user.id,
        storeId: input.storeId,
        items: orderItems,
        deliveryAddress: input.deliveryAddress,
        deliveryTime: input.deliveryTime,
        notes: input.notes,
      });

      // Save to local database
      await this.orderRepository.save(order);

      Logger.info('Order created locally', { orderId: order.id });

      // Try to sync with server
      let paymentUrl: string | undefined;

      try {
        const result = ENV.USE_MOCK_DATA
          ? await MockApiService.createOrder({
              storeId: input.storeId,
              items: input.items,
              deliveryAddress: input.deliveryAddress,
              deliveryTime: input.deliveryTime,
              notes: input.notes,
              voucherCode: input.voucherCode,
            })
          : await OrderApi.createOrder({
              storeId: input.storeId,
              items: input.items,
              deliveryAddress: input.deliveryAddress,
              deliveryTime: input.deliveryTime,
              notes: input.notes,
              voucherCode: input.voucherCode,
            });

        paymentUrl = result.paymentUrl;

        Logger.info('Order synced with server', { orderId: order.id });

        // Emit order created event
        await EventBus.getInstance().emit(EventType.ORDER_CREATED, {
          orderId: order.id,
          userId: user.id,
          total: order.toObject().total.toValue(),
          timestamp: Date.now(),
        });
      } catch (error: any) {
        Logger.warn('Order sync failed, queued for later', error);

        // Add to sync queue for later
        await SyncQueue.getInstance().enqueue(
          EntityType.ORDER,
          order.id,
          SyncOperation.CREATE,
          SyncPriority.CRITICAL,
          order.toObject()
        );
      }

      return {
        order,
        paymentUrl,
      };
    } catch (error: any) {
      Logger.error('Create order failed', error);
      throw new Error(
        error.message || 'Tạo đơn hàng thất bại. Vui lòng thử lại.'
      );
    }
  }
}
