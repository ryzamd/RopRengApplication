/**
 * Product Aggregate Root
 * Represents a product in the system
 */

import { AggregateRoot } from '../base/AggregateRoot';
import { Price } from './Price';

export interface ProductProps {
  id: string;
  name: string;
  description?: string;
  price: Price;
  categoryId: string;
  imageUrl?: string;
  isAvailable: boolean;
  createdAt?: number;
  updatedAt?: number;
  syncedAt?: number;
}

export class Product extends AggregateRoot<ProductProps> {
  private _name: string;
  private _description?: string;
  private _price: Price;
  private _categoryId: string;
  private _imageUrl?: string;
  private _isAvailable: boolean;
  private _syncedAt?: number;

  private constructor(props: ProductProps) {
    super(props.id, props.createdAt, props.updatedAt);
    this._name = props.name;
    this._description = props.description;
    this._price = props.price;
    this._categoryId = props.categoryId;
    this._imageUrl = props.imageUrl;
    this._isAvailable = props.isAvailable;
    this._syncedAt = props.syncedAt;
  }

  /**
   * Create product
   */
  public static create(
    name: string,
    price: Price,
    categoryId: string,
    options?: {
      description?: string;
      imageUrl?: string;
      isAvailable?: boolean;
    }
  ): Product {
    const id = this.generateId();

    const product = new Product({
      id,
      name,
      price,
      categoryId,
      description: options?.description,
      imageUrl: options?.imageUrl,
      isAvailable: options?.isAvailable ?? true,
    });

    product.addDomainEvent({
      type: 'PRODUCT_CREATED',
      productId: id,
      timestamp: Date.now(),
    });

    return product;
  }

  /**
   * Reconstitute from database
   */
  public static fromDatabase(props: ProductProps): Product {
    return new Product(props);
  }

  /**
   * Update product
   */
  public update(data: {
    name?: string;
    description?: string;
    price?: Price;
    imageUrl?: string;
  }): void {
    if (data.name) this._name = data.name;
    if (data.description !== undefined) this._description = data.description;
    if (data.price) this._price = data.price;
    if (data.imageUrl !== undefined) this._imageUrl = data.imageUrl;

    this.touch();

    this.addDomainEvent({
      type: 'PRODUCT_UPDATED',
      productId: this._id,
      timestamp: Date.now(),
    });
  }

  /**
   * Set availability
   */
  public setAvailability(isAvailable: boolean): void {
    this._isAvailable = isAvailable;
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

  public get price(): Price {
    return this._price;
  }

  public get categoryId(): string {
    return this._categoryId;
  }

  public get imageUrl(): string | undefined {
    return this._imageUrl;
  }

  public get isAvailable(): boolean {
    return this._isAvailable;
  }

  public get syncedAt(): number | undefined {
    return this._syncedAt;
  }

  /**
   * Convert to plain object
   */
  public toObject(): ProductProps {
    return {
      id: this._id,
      name: this._name,
      description: this._description,
      price: this._price,
      categoryId: this._categoryId,
      imageUrl: this._imageUrl,
      isAvailable: this._isAvailable,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
      syncedAt: this._syncedAt,
    };
  }
}
