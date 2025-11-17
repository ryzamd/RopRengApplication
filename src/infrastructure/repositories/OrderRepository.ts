/**
 * Order Repository Implementation
 * SQLite implementation of order data access
 */

import { database } from '../../core/database/Database';
import { Order } from '../../domain/entities/order/Order';
import { OrderItem } from '../../domain/entities/order/OrderItem';
import { OrderStatus } from '../../domain/entities/order/OrderStatus';
import { Price } from '../../domain/entities/product/Price';
import { IOrderRepository } from '../../domain/repositories/IOrderRepository';
import { BaseRepository } from './base/BaseRepository';

export class OrderRepository
  extends BaseRepository<Order>
  implements IOrderRepository
{
  constructor() {
    super('orders');
  }

  /**
   * Find orders by user ID
   */
  public async findByUserId(userId: string): Promise<Order[]> {
    const rows = await database.getAllAsync<any>(
      'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
    );

    const orders = await Promise.all(
      rows.map(async (row) => {
        const items = await this.getOrderItems(row.id);
        return this.mapToEntity(row, items);
      })
    );

    return orders;
  }

  /**
   * Find orders by status
   */
  public async findByStatus(status: OrderStatus): Promise<Order[]> {
    const rows = await database.getAllAsync<any>(
      'SELECT * FROM orders WHERE status = ? ORDER BY created_at DESC',
      [status]
    );

    const orders = await Promise.all(
      rows.map(async (row) => {
        const items = await this.getOrderItems(row.id);
        return this.mapToEntity(row, items);
      })
    );

    return orders;
  }

  /**
   * Find active orders (not completed or cancelled)
   */
  public async findActive(): Promise<Order[]> {
    const activeStatuses = [
      OrderStatus.PENDING,
      OrderStatus.CONFIRMED,
      OrderStatus.PREPARING,
      OrderStatus.READY,
      OrderStatus.DELIVERING,
    ];

    const placeholders = activeStatuses.map(() => '?').join(', ');
    const rows = await database.getAllAsync<any>(
      `SELECT * FROM orders WHERE status IN (${placeholders}) ORDER BY created_at DESC`,
      activeStatuses
    );

    const orders = await Promise.all(
      rows.map(async (row) => {
        const items = await this.getOrderItems(row.id);
        return this.mapToEntity(row, items);
      })
    );

    return orders;
  }

  /**
   * Find recent orders (last 30 days)
   */
  public async findRecent(userId: string, limit: number = 10): Promise<Order[]> {
    const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;

    const rows = await database.getAllAsync<any>(
      `SELECT * FROM orders
       WHERE user_id = ? AND created_at >= ?
       ORDER BY created_at DESC
       LIMIT ?`,
      [userId, thirtyDaysAgo, limit]
    );

    const orders = await Promise.all(
      rows.map(async (row) => {
        const items = await this.getOrderItems(row.id);
        return this.mapToEntity(row, items);
      })
    );

    return orders;
  }

  /**
   * Override findById to include order items
   */
  public async findById(id: string): Promise<Order | null> {
    const row = await database.getFirstAsync<any>(
      'SELECT * FROM orders WHERE id = ?',
      [id]
    );

    if (!row) {
      return null;
    }

    const items = await this.getOrderItems(id);
    return this.mapToEntity(row, items);
  }

  /**
   * Override save to handle order items
   */
  public async save(entity: Order): Promise<void> {
    const data = this.mapFromEntity(entity);
    const exists = await this.exists(data.id);

    await database.withTransactionAsync(async () => {
      if (exists) {
        await this.update(data.order);
      } else {
        await this.insert(data.order);
      }

      // Delete existing items and re-insert
      await database.runAsync('DELETE FROM order_items WHERE order_id = ?', [
        data.id,
      ]);

      for (const item of data.items) {
        await this.insertOrderItem(item);
      }
    });
  }

  /**
   * Get order items for an order
   */
  private async getOrderItems(orderId: string): Promise<any[]> {
    return database.getAllAsync<any>(
      'SELECT * FROM order_items WHERE order_id = ? ORDER BY created_at ASC',
      [orderId]
    );
  }

  /**
   * Insert order item
   */
  private async insertOrderItem(item: any): Promise<void> {
    const keys = Object.keys(item);
    const values = Object.values(item);
    const placeholders = keys.map(() => '?').join(', ');

    await database.runAsync(
      `INSERT INTO order_items (${keys.join(', ')})
       VALUES (${placeholders})`,
      values
    );
  }

  /**
   * Map database row to Order entity
   */
  protected mapToEntity(row: any, items?: any[]): Order {
    const orderItems =
      items?.map((item) =>
        OrderItem.fromDatabase({
          id: item.id,
          productId: item.product_id,
          productName: item.product_name,
          quantity: item.quantity,
          price: Price.create(item.unit_price),
          unitPrice: item.unit_price,
          subtotal: item.subtotal,
          selectedOptions: item.selected_options
            ? JSON.parse(item.selected_options)
            : undefined,
          createdAt: item.created_at,
          updatedAt: item.updated_at,
        })
      ) || [];

    return Order.fromDatabase({
      id: row.id,
      userId: row.user_id,
      storeId: row.store_id,
      items: orderItems,
      subtotal: Price.create(row.subtotal),
      deliveryFee: Price.create(row.delivery_fee),
      discount: Price.create(row.discount),
      total: Price.create(row.total),
      status: row.status as OrderStatus,
      deliveryAddress: row.delivery_address
        ? JSON.parse(row.delivery_address)
        : undefined,
      deliveryTime: row.delivery_time || undefined,
      notes: row.notes || undefined,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      syncedAt: row.synced_at,
    });
  }

  /**
   * Map Order entity to database row
   */
  protected mapFromEntity(order: Order): any {
    const props = order.toObject();

    const orderData = {
      id: props.id,
      user_id: props.userId,
      store_id: props.storeId,
      subtotal: props.subtotal.toValue(),
      delivery_fee: props.deliveryFee.toValue(),
      discount: props.discount.toValue(),
      total: props.total.toValue(),
      status: props.status,
      delivery_address: props.deliveryAddress
        ? JSON.stringify(props.deliveryAddress)
        : null,
      delivery_time: props.deliveryTime || null,
      notes: props.notes || null,
      created_at: props.createdAt,
      updated_at: props.updatedAt,
      synced_at: props.syncedAt,
      is_synced: props.syncedAt ? 1 : 0,
    };

    const itemsData = props.items.map((item) => ({
      id: item.id,
      order_id: props.id,
      product_id: item.productId,
      product_name: item.productName,
      quantity: item.quantity,
      unit_price: item.unitPrice,
      subtotal: item.subtotal,
      selected_options: item.selectedOptions
        ? JSON.stringify(item.selectedOptions)
        : null,
      created_at: item.createdAt,
      updated_at: item.updatedAt,
    }));

    return {
      id: props.id,
      order: orderData,
      items: itemsData,
    };
  }
}
