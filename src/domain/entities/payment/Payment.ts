/**
 * Payment Aggregate Root
 * Represents a payment transaction
 */

import { AggregateRoot } from '../base/AggregateRoot';
import { Price } from '../product/Price';
import { PaymentMethod } from './PaymentMethod';
import { PaymentStatus, isTerminalPaymentStatus } from './PaymentStatus';

export interface PaymentProps {
  id: string;
  orderId: string;
  method: PaymentMethod;
  amount: Price;
  status: PaymentStatus;
  transactionId?: string;
  vnpayData?: any;
  errorMessage?: string;
  paidAt?: number;
  refundedAt?: number;
  createdAt?: number;
  updatedAt?: number;
  syncedAt?: number;
}

export class Payment extends AggregateRoot<PaymentProps> {
  private _orderId: string;
  private _method: PaymentMethod;
  private _amount: Price;
  private _status: PaymentStatus;
  private _transactionId?: string;
  private _vnpayData?: any;
  private _errorMessage?: string;
  private _paidAt?: number;
  private _refundedAt?: number;
  private _syncedAt?: number;

  private constructor(props: PaymentProps) {
    super(props.id, props.createdAt, props.updatedAt);
    this._orderId = props.orderId;
    this._method = props.method;
    this._amount = props.amount;
    this._status = props.status;
    this._transactionId = props.transactionId;
    this._vnpayData = props.vnpayData;
    this._errorMessage = props.errorMessage;
    this._paidAt = props.paidAt;
    this._refundedAt = props.refundedAt;
    this._syncedAt = props.syncedAt;
  }

  /**
   * Create payment
   */
  public static create(
    orderId: string,
    method: PaymentMethod,
    amount: Price,
    options?: {
      transactionId?: string;
      vnpayData?: any;
    }
  ): Payment {
    const id = this.generateId();

    const payment = new Payment({
      id,
      orderId,
      method,
      amount,
      status: PaymentStatus.PENDING,
      transactionId: options?.transactionId,
      vnpayData: options?.vnpayData,
    });

    payment.addDomainEvent({
      type: 'PAYMENT_INITIATED',
      paymentId: id,
      orderId,
      amount: amount.toValue(),
      method,
      timestamp: Date.now(),
    });

    return payment;
  }

  /**
   * Reconstitute from database
   */
  public static fromDatabase(props: PaymentProps): Payment {
    return new Payment(props);
  }

  /**
   * Mark as processing
   */
  public markProcessing(): void {
    if (this._status !== PaymentStatus.PENDING) {
      throw new Error('Only pending payments can be processed');
    }

    this._status = PaymentStatus.PROCESSING;
    this.touch();
  }

  /**
   * Mark as success
   */
  public markSuccess(transactionId: string): void {
    if (isTerminalPaymentStatus(this._status)) {
      throw new Error('Cannot modify terminal payment status');
    }

    this._status = PaymentStatus.SUCCESS;
    this._transactionId = transactionId;
    this._paidAt = Date.now();
    this.touch();

    this.addDomainEvent({
      type: 'PAYMENT_SUCCESS',
      paymentId: this._id,
      orderId: this._orderId,
      amount: this._amount.toValue(),
      method: this._method,
      transactionId,
      timestamp: Date.now(),
    });
  }

  /**
   * Mark as failed
   */
  public markFailed(errorMessage: string): void {
    if (isTerminalPaymentStatus(this._status)) {
      throw new Error('Cannot modify terminal payment status');
    }

    this._status = PaymentStatus.FAILED;
    this._errorMessage = errorMessage;
    this.touch();

    this.addDomainEvent({
      type: 'PAYMENT_FAILED',
      paymentId: this._id,
      orderId: this._orderId,
      amount: this._amount.toValue(),
      method: this._method,
      errorMessage,
      timestamp: Date.now(),
    });
  }

  /**
   * Process refund
   */
  public refund(): void {
    if (this._status !== PaymentStatus.SUCCESS) {
      throw new Error('Only successful payments can be refunded');
    }

    this._status = PaymentStatus.REFUNDED;
    this._refundedAt = Date.now();
    this.touch();

    this.addDomainEvent({
      type: 'PAYMENT_REFUNDED',
      paymentId: this._id,
      orderId: this._orderId,
      amount: this._amount.toValue(),
      timestamp: Date.now(),
    });
  }

  /**
   * Update VNPay data
   */
  public updateVNPayData(data: any): void {
    this._vnpayData = data;
    this.touch();
  }

  /**
   * Mark as synced
   */
  public markSynced(): void {
    this._syncedAt = Date.now();
  }

  // Getters
  public get orderId(): string {
    return this._orderId;
  }

  public get method(): PaymentMethod {
    return this._method;
  }

  public get amount(): Price {
    return this._amount;
  }

  public get status(): PaymentStatus {
    return this._status;
  }

  public get transactionId(): string | undefined {
    return this._transactionId;
  }

  public get vnpayData(): any {
    return this._vnpayData;
  }

  public get errorMessage(): string | undefined {
    return this._errorMessage;
  }

  public get paidAt(): number | undefined {
    return this._paidAt;
  }

  public get refundedAt(): number | undefined {
    return this._refundedAt;
  }

  public get syncedAt(): number | undefined {
    return this._syncedAt;
  }

  /**
   * Convert to plain object
   */
  public toObject(): PaymentProps {
    return {
      id: this._id,
      orderId: this._orderId,
      method: this._method,
      amount: this._amount,
      status: this._status,
      transactionId: this._transactionId,
      vnpayData: this._vnpayData,
      errorMessage: this._errorMessage,
      paidAt: this._paidAt,
      refundedAt: this._refundedAt,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
      syncedAt: this._syncedAt,
    };
  }
}
