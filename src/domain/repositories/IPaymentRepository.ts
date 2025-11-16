/**
 * Payment Repository Interface
 * Contract for payment data access
 */

import { IRepository } from './IRepository';
import { Payment } from '../entities/payment/Payment';
import { PaymentStatus } from '../entities/payment/PaymentStatus';

export interface IPaymentRepository extends IRepository<Payment> {
  /**
   * Find payment by order ID
   */
  findByOrderId(orderId: string): Promise<Payment | null>;

  /**
   * Find payments by status
   */
  findByStatus(status: PaymentStatus): Promise<Payment[]>;

  /**
   * Find payment by transaction ID
   */
  findByTransactionId(transactionId: string): Promise<Payment | null>;
}
