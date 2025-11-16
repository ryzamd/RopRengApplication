/**
 * Order Item Entity
 * Represents a product in an order
 */

import { Entity } from '../base/Entity';
import { Price } from '../product/Price';

export interface OrderItemProps {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  price: Price;
  options?: Record<string, any>;
  notes?: string;
  createdAt?: number;
}

export class OrderItem extends Entity<OrderItemProps> {
  private _productId: string;
  private _productName: string;
  private _quantity: number;
  private _price: Price;
  private _options?: Record<string, any>;
  private _notes?: string;

  private constructor(props: OrderItemProps) {
    super(props.id, props.createdAt);
    this._productId = props.productId;
    this._productName = props.productName;
    this._quantity = props.quantity;
    this._price = props.price;
    this._options = props.options;
    this._notes = props.notes;
  }

  /**
   * Create order item
   */
  public static create(
    productId: string,
    productName: string,
    quantity: number,
    price: Price,
    options?: {
      options?: Record<string, any>;
      notes?: string;
    }
  ): OrderItem {
    if (quantity <= 0) {
      throw new Error('Quantity must be positive');
    }

    const id = this.generateId();

    return new OrderItem({
      id,
      productId,
      productName,
      quantity,
      price,
      options: options?.options,
      notes: options?.notes,
    });
  }

  /**
   * Reconstitute from database
   */
  public static fromDatabase(props: OrderItemProps): OrderItem {
    return new OrderItem(props);
  }

  /**
   * Calculate subtotal
   */
  public getSubtotal(): Price {
    return this._price.multiply(this._quantity);
  }

  /**
   * Update quantity
   */
  public updateQuantity(quantity: number): void {
    if (quantity <= 0) {
      throw new Error('Quantity must be positive');
    }
    this._quantity = quantity;
  }

  // Getters
  public get productId(): string {
    return this._productId;
  }

  public get productName(): string {
    return this._productName;
  }

  public get quantity(): number {
    return this._quantity;
  }

  public get price(): Price {
    return this._price;
  }

  public get options(): Record<string, any> | undefined {
    return this._options;
  }

  public get notes(): string | undefined {
    return this._notes;
  }

  /**
   * Convert to plain object
   */
  public toObject(): OrderItemProps {
    return {
      id: this._id,
      productId: this._productId,
      productName: this._productName,
      quantity: this._quantity,
      price: this._price,
      options: this._options,
      notes: this._notes,
      createdAt: this._createdAt,
    };
  }
}
