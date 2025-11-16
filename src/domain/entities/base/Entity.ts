/**
 * Base Entity
 * Base class for all domain entities
 *
 * Key concepts:
 * - Entities have unique IDs
 * - Entities are mutable
 * - Identity equals ID equality
 */

export abstract class Entity<T> {
  protected readonly _id: string;
  protected _createdAt: number;
  protected _updatedAt: number;

  constructor(id: string, createdAt?: number, updatedAt?: number) {
    this._id = id;
    this._createdAt = createdAt ?? Date.now();
    this._updatedAt = updatedAt ?? Date.now();
  }

  /**
   * Get entity ID
   */
  public get id(): string {
    return this._id;
  }

  /**
   * Get created timestamp
   */
  public get createdAt(): number {
    return this._createdAt;
  }

  /**
   * Get updated timestamp
   */
  public get updatedAt(): number {
    return this._updatedAt;
  }

  /**
   * Update timestamp
   */
  protected touch(): void {
    this._updatedAt = Date.now();
  }

  /**
   * Equality based on ID
   */
  public equals(entity?: Entity<T>): boolean {
    if (!entity) {
      return false;
    }

    if (this === entity) {
      return true;
    }

    return this._id === entity._id;
  }

  /**
   * Convert to plain object
   */
  public abstract toObject(): T;

  /**
   * Generate unique ID
   */
  protected static generateId(): string {
    return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
