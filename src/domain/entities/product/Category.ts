/**
 * Category Entity
 * Represents a product category
 */

import { Entity } from '../base/Entity';

export interface CategoryProps {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  imageUrl?: string;
  isActive?: boolean;
  orderIndex: number;
  displayOrder?: number; // Alias for orderIndex (used in API/DB)
  createdAt?: number;
  updatedAt?: number;
  syncedAt?: number;
}

export class Category extends Entity<CategoryProps> {
  private _name: string;
  private _description?: string;
  private _icon?: string;
  private _imageUrl?: string;
  private _isActive: boolean;
  private _orderIndex: number;
  private _syncedAt?: number;

  private constructor(props: CategoryProps) {
    super(props.id, props.createdAt, props.updatedAt);
    this._name = props.name;
    this._description = props.description;
    this._icon = props.icon;
    this._imageUrl = props.imageUrl;
    this._isActive = props.isActive ?? true;
    this._orderIndex = props.displayOrder ?? props.orderIndex;
    this._syncedAt = props.syncedAt;
  }

  /**
   * Create category
   */
  public static create(
    name: string,
    orderIndex: number = 0,
    options?: {
      description?: string;
      icon?: string;
      imageUrl?: string;
      isActive?: boolean;
    }
  ): Category {
    const id = this.generateId();
    return new Category({
      id,
      name,
      orderIndex,
      description: options?.description,
      icon: options?.icon,
      imageUrl: options?.imageUrl,
      isActive: options?.isActive ?? true,
    });
  }

  /**
   * Reconstitute from database
   */
  public static fromDatabase(props: CategoryProps): Category {
    return new Category(props);
  }

  /**
   * Update category
   */
  public update(data: {
    name?: string;
    description?: string;
    icon?: string;
    imageUrl?: string;
    isActive?: boolean;
    orderIndex?: number;
  }): void {
    if (data.name) this._name = data.name;
    if (data.description !== undefined) this._description = data.description;
    if (data.icon !== undefined) this._icon = data.icon;
    if (data.imageUrl !== undefined) this._imageUrl = data.imageUrl;
    if (data.isActive !== undefined) this._isActive = data.isActive;
    if (data.orderIndex !== undefined) this._orderIndex = data.orderIndex;
    this.touch();
  }

  /**
   * Mark as synced
   */
  public markSynced(): void {
    this._syncedAt = Date.now();
  }

  // Getters
  public get name(): string {
    return this._name;
  }

  public get description(): string | undefined {
    return this._description;
  }

  public get icon(): string | undefined {
    return this._icon;
  }

  public get imageUrl(): string | undefined {
    return this._imageUrl;
  }

  public get isActive(): boolean {
    return this._isActive;
  }

  public get orderIndex(): number {
    return this._orderIndex;
  }

  public get syncedAt(): number | undefined {
    return this._syncedAt;
  }

  /**
   * Convert to plain object
   */
  public toObject(): CategoryProps {
    return {
      id: this._id,
      name: this._name,
      description: this._description,
      icon: this._icon,
      imageUrl: this._imageUrl,
      isActive: this._isActive,
      orderIndex: this._orderIndex,
      displayOrder: this._orderIndex,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
      syncedAt: this._syncedAt,
    };
  }
}
