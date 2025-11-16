/**
 * Payment Repository Implementation
 * SQLite implementation of payment data access
 */

import { database } from '../../core/database/Database';
import { Payment } from '../../domain/entities/payment/Payment';
import { PaymentMethod } from '../../domain/entities/payment/PaymentMethod';
import { PaymentStatus } from '../../domain/entities/payment/PaymentStatus';
import { Price } from '../../domain/entities/product/Price';
import { IPaymentRepository } from '../../domain/repositories/IPaymentRepository';
import { BaseRepository } from './base/BaseRepository';

export class PaymentRepository
  extends BaseRepository<Payment>
  implements IPaymentRepository
{
  constructor() {
    super('payments');
  }

  /**
   * Find payment by order ID
   */
  public async findByOrderId(orderId: string): Promise<Payment | null> {
    const row = await database.getFirstAsync<any>(
      'SELECT * FROM payments WHERE order_id = ?',
      [orderId]
    );

    if (!row) {
      return null;
    }

    return this.mapToEntity(row);
  }

  /**
   * Find payments by status
   */
  public async findByStatus(status: PaymentStatus): Promise<Payment[]> {
    const rows = await database.getAllAsync<any>(
      'SELECT * FROM payments WHERE status = ? ORDER BY created_at DESC',
      [status]
    );

    return rows.map((row) => this.mapToEntity(row));
  }

  /**
   * Find payment by transaction ID
   */
  public async findByTransactionId(
    transactionId: string
  ): Promise<Payment | null> {
    const row = await database.getFirstAsync<any>(
      'SELECT * FROM payments WHERE transaction_id = ?',
      [transactionId]
    );

    if (!row) {
      return null;
    }

    return this.mapToEntity(row);
  }

  /**
   * Find pending payments (for retry logic)
   */
  public async findPending(limit: number = 10): Promise<Payment[]> {
    const rows = await database.getAllAsync<any>(
      'SELECT * FROM payments WHERE status = ? ORDER BY created_at DESC LIMIT ?',
      [PaymentStatus.PENDING, limit]
    );

    return rows.map((row) => this.mapToEntity(row));
  }

  /**
   * Find failed payments that can be retried
   */
  public async findRetryable(maxAge: number = 24 * 60 * 60 * 1000): Promise<Payment[]> {
    const cutoffTime = Date.now() - maxAge;

    const rows = await database.getAllAsync<any>(
      `SELECT * FROM payments
       WHERE status = ? AND created_at >= ?
       ORDER BY created_at DESC`,
      [PaymentStatus.FAILED, cutoffTime]
    );

    return rows.map((row) => this.mapToEntity(row));
  }

  /**
   * Find payments by user (through orders)
   */
  public async findByUserId(userId: string): Promise<Payment[]> {
    const rows = await database.getAllAsync<any>(
      `SELECT p.* FROM payments p
       INNER JOIN orders o ON p.order_id = o.id
       WHERE o.user_id = ?
       ORDER BY p.created_at DESC`,
      [userId]
    );

    return rows.map((row) => this.mapToEntity(row));
  }

  /**
   * Map database row to Payment entity
   */
  protected mapToEntity(row: any): Payment {
    return Payment.fromDatabase({
      id: row.id,
      orderId: row.order_id,
      amount: Price.create(row.amount),
      method: row.method as PaymentMethod,
      status: row.status as PaymentStatus,
      transactionId: row.transaction_id || undefined,
      vnpayData: row.vnpay_data ? JSON.parse(row.vnpay_data) : undefined,
      errorMessage: row.error_message || undefined,
      paidAt: row.paid_at || undefined,
      refundedAt: row.refunded_at || undefined,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      syncedAt: row.synced_at,
    });
  }

  /**
   * Map Payment entity to database row
   */
  protected mapFromEntity(payment: Payment): any {
    const props = payment.toObject();

    return {
      id: props.id,
      order_id: props.orderId,
      amount: props.amount.toValue(),
      method: props.method,
      status: props.status,
      transaction_id: props.transactionId || null,
      vnpay_data: props.vnpayData ? JSON.stringify(props.vnpayData) : null,
      error_message: props.errorMessage || null,
      paid_at: props.paidAt || null,
      refunded_at: props.refundedAt || null,
      created_at: props.createdAt,
      updated_at: props.updatedAt,
      synced_at: props.syncedAt,
      is_synced: props.syncedAt ? 1 : 0,
    };
  }
}
