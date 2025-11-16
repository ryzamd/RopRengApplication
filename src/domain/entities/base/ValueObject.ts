/**
 * Value Object
 * Base class for value objects
 *
 * Key concepts:
 * - Value objects have no identity
 * - Value objects are immutable
 * - Equality based on value, not identity
 */

export abstract class ValueObject<T> {
  /**
   * Equality based on value
   */
  public abstract equals(vo?: ValueObject<T>): boolean;

  /**
   * Convert to plain value
   */
  public abstract toValue(): T;
}
