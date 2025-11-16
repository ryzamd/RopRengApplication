/**
 * Price Value Object
 * Encapsulates price with validation
 */

import { ValueObject } from '../base/ValueObject';

export class Price extends ValueObject<number> {
  private readonly amount: number;
  private readonly currency: string = 'VND';

  private constructor(amount: number) {
    super();
    this.amount = amount;
  }

  /**
   * Create price (factory method)
   */
  public static create(amount: number): Price {
    if (amount < 0) {
      throw new Error('Price cannot be negative');
    }

    return new Price(amount);
  }

  /**
   * Add to price
   */
  public add(other: Price): Price {
    return new Price(this.amount + other.amount);
  }

  /**
   * Subtract from price
   */
  public subtract(other: Price): Price {
    const result = this.amount - other.amount;
    if (result < 0) {
      throw new Error('Result price cannot be negative');
    }
    return new Price(result);
  }

  /**
   * Multiply price
   */
  public multiply(factor: number): Price {
    if (factor < 0) {
      throw new Error('Multiplier cannot be negative');
    }
    return new Price(this.amount * factor);
  }

  /**
   * Format for display
   */
  public format(): string {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: this.currency,
    }).format(this.amount);
  }

  /**
   * Get raw value
   */
  public toValue(): number {
    return this.amount;
  }

  /**
   * Equality check
   */
  public equals(vo?: ValueObject<number>): boolean {
    if (!vo || !(vo instanceof Price)) {
      return false;
    }
    return this.amount === vo.amount;
  }
}
