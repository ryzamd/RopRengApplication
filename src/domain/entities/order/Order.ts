/**
 * Order Aggregate Root
 * Represents a customer order
 */

import { AggregateRoot } from '../base/AggregateRoot';
import { Price } from '../product/Price';
import { OrderItem } from './OrderItem';
import { OrderStatus, getNextStatuses, isTerminalStatus } from './OrderStatus';

export interface OrderProps {
  id: string;
  userId: string;
  storeId: string;
  status: OrderStatus;
  items: OrderItem[];
  subtotal: Price;
  deliveryFee: Price;
  discount: Price;
  total: Price;
  deliveryAddress?: string;
  deliveryTime?: number;
  notes?: string;
  createdAt?: number;
  updatedAt?: number;
  syncedAt?: number;
}

export class Order extends AggregateRoot<OrderProps> {
  private _userId: string;
  private _storeId: string;
  private _status: OrderStatus;
  private _items: OrderItem[];
  private _subtotal: Price;
  private _deliveryFee: Price;
  private _discount: Price;
  private _total: Price;
  private _deliveryAddress?: string;
  private _deliveryTime?: number;
  private _notes?: string;
  private _syncedAt?: number;

  private constructor(props: OrderProps) {
    super(props.id, props.createdAt, props.updatedAt);
    this._userId = props.userId;
    this._storeId = props.storeId;
    this._status = props.status;
    this._items = props.items;
    this._subtotal = props.subtotal;
    this._deliveryFee = props.deliveryFee;
    this._discount = props.discount;
    this._total = props.total;
    this._deliveryAddress = props.deliveryAddress;
    this._deliveryTime = props.deliveryTime;
    this._notes = props.notes;
    this._syncedAt = props.syncedAt;
  }

  /**
   * Create order
   */
  public static create(
    userId: string,
    storeId: string,
    items: OrderItem[],
    options?: {
      deliveryAddress?: string;
      deliveryFee?: Price;
      discount?: Price;
      notes?: string;
    }
  ): Order {
    if (items.length === 0) {
      throw new Error('Order must have at least one item');
    }

    const id = this.generateId();

    // Calculate subtotal
    const subtotal = items.reduce(
      (sum, item) => sum.add(item.getSubtotal()),
      Price.create(0)
    );

    const deliveryFee = options?.deliveryFee ?? Price.create(0);
    const discount = options?.discount ?? Price.create(0);

    // Calculate total
    const total = subtotal.add(deliveryFee).subtract(discount);

    const order = new Order({
      id,
      userId,
      storeId,
      status: OrderStatus.PENDING,
      items,
      subtotal,
      deliveryFee,
      discount,
      total,
      deliveryAddress: options?.deliveryAddress,
      notes: options?.notes,
    });

    order.addDomainEvent({
      type: 'ORDER_CREATED',
      orderId: id,
      userId,
      total: total.toValue(),
      timestamp: Date.now(),
    });

    return order;
  }

  /**
   * Reconstitute from database
   */
  public static fromDatabase(props: OrderProps): Order {
    return new Order(props);
  }

  /**
   * Update status
   */
  public updateStatus(newStatus: OrderStatus): void {
    // Check if transition is allowed
    const allowedStatuses = getNextStatuses(this._status);

    if (!allowedStatuses.includes(newStatus)) {
      throw new Error(
        `Cannot transition from ${this._status} to ${newStatus}`
      );
    }

    const oldStatus = this._status;
    this._status = newStatus;
    this.touch();

    this.addDomainEvent({
      type: 'ORDER_STATUS_CHANGED',
      orderId: this._id,
      oldStatus,
      newStatus,
      timestamp: Date.now(),
    });
  }

  /**
   * Cancel order
   */
  public cancel(): void {
    if (isTerminalStatus(this._status)) {
      throw new Error('Cannot cancel completed or already cancelled order');
    }

    this._status = OrderStatus.CANCELLED;
    this.touch();

    this.addDomainEvent({
      type: 'ORDER_CANCELLED',
      orderId: this._id,
      timestamp: Date.now(),
    });
  }

  /**
   * Complete order
   */
  public complete(): void {
    if (this._status !== OrderStatus.DELIVERING && this._status !== OrderStatus.READY) {
      throw new Error('Order must be ready or delivering to complete');
    }

    this._status = OrderStatus.COMPLETED;
    this.touch();

    this.addDomainEvent({
      type: 'ORDER_COMPLETED',
      orderId: this._id,
      userId: this._userId,
      total: this._total.toValue(),
      timestamp: Date.now(),
    });
  }

  /**
   * Add item to order
   */
  public addItem(item: OrderItem): void {
    if (isTerminalStatus(this._status)) {
      throw new Error('Cannot modify completed or cancelled order');
    }

    this._items.push(item);
    this.recalculateTotal();
  }

  /**
   * Remove item from order
   */
  public removeItem(itemId: string): void {
    if (isTerminalStatus(this._status)) {
      throw new Error('Cannot modify completed or cancelled order');
    }

    this._items = this._items.filter(item => item.id !== itemId);

    if (this._items.length === 0) {
      throw new Error('Order must have at least one item');
    }

    this.recalculateTotal();
  }

  /**
   * Recalculate order total
   */
  private recalculateTotal(): void {
    this._subtotal = this._items.reduce(
      (sum, item) => sum.add(item.getSubtotal()),
      Price.create(0)
    );

    this._total = this._subtotal.add(this._deliveryFee).subtract(this._discount);
    this.touch();
  }

  /**
   * Apply discount
   */
  public applyDiscount(discount: Price): void {
    this._discount = discount;
    this.recalculateTotal();
  }

  /**
   * Mark as synced
   */
  public markSynced(): void {
    this._syncedAt = Date.now();
  }

  // Getters
  public get userId(): string {
    return this._userId;
  }

  public get storeId(): string {
    return this._storeId;
  }

  public get status(): OrderStatus {
    return this._status;
  }

  public get items(): OrderItem[] {
    return [...this._items];
  }

  public get subtotal(): Price {
    return this._subtotal;
  }

  public get deliveryFee(): Price {
    return this._deliveryFee;
  }

  public get discount(): Price {
    return this._discount;
  }

  public get total(): Price {
    return this._total;
  }

  public get deliveryAddress(): string | undefined {
    return this._deliveryAddress;
  }

  public get deliveryTime(): number | undefined {
    return this._deliveryTime;
  }

  public get notes(): string | undefined {
    return this._notes;
  }

  public get syncedAt(): number | undefined {
    return this._syncedAt;
  }

  /**
   * Convert to plain object
   */
  public toObject(): OrderProps {
    return {
      id: this._id,
      userId: this._userId,
      storeId: this._storeId,
      status: this._status,
      items: this._items,
      subtotal: this._subtotal,
      deliveryFee: this._deliveryFee,
      discount: this._discount,
      total: this._total,
      deliveryAddress: this._deliveryAddress,
      deliveryTime: this._deliveryTime,
      notes: this._notes,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
      syncedAt: this._syncedAt,
    };
  }
}
