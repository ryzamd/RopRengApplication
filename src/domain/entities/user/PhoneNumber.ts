/**
 * Phone Number Value Object
 * Encapsulates phone number validation and formatting
 */

import { ValueObject } from '../base/ValueObject';

export class PhoneNumber extends ValueObject<string> {
  private readonly value: string;

  private constructor(phoneNumber: string) {
    super();
    this.value = phoneNumber;
  }

  /**
   * Create phone number (factory method)
   */
  public static create(phoneNumber: string): PhoneNumber {
    // Remove all non-digit characters
    const cleaned = phoneNumber.replace(/\D/g, '');

    // Validate Vietnam phone number (10 digits)
    if (!this.isValid(cleaned)) {
      throw new Error(`Invalid phone number: ${phoneNumber}`);
    }

    return new PhoneNumber(cleaned);
  }

  /**
   * Validate phone number
   */
  private static isValid(phoneNumber: string): boolean {
    // Vietnam phone numbers: 10 digits, starts with 0
    return /^0\d{9}$/.test(phoneNumber);
  }

  /**
   * Format for display (0xxx xxx xxx)
   */
  public format(): string {
    return this.value.replace(/(\d{4})(\d{3})(\d{3})/, '$1 $2 $3');
  }

  /**
   * Get raw value
   */
  public toValue(): string {
    return this.value;
  }

  /**
   * Equality check
   */
  public equals(vo?: ValueObject<string>): boolean {
    if (!vo || !(vo instanceof PhoneNumber)) {
      return false;
    }

    return this.value === vo.value;
  }
}
