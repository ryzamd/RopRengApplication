/**
 * Category Entity
 * Represents a product category
 */

import { Entity } from '../base/Entity';

export interface CategoryProps {
  id: string;
  name: string;
  icon?: string;
  orderIndex: number;
  createdAt?: number;
  updatedAt?: number;
}

export class Category extends Entity<CategoryProps> {
  private _name: string;
  private _icon?: string;
  private _orderIndex: number;

  private constructor(props: CategoryProps) {
    super(props.id, props.createdAt, props.updatedAt);
    this._name = props.name;
    this._icon = props.icon;
    this._orderIndex = props.orderIndex;
  }

  /**
   * Create category
   */
  public static create(
    name: string,
    orderIndex: number = 0,
    icon?: string
  ): Category {
    const id = this.generateId();
    return new Category({ id, name, icon, orderIndex });
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
  public update(data: { name?: string; icon?: string; orderIndex?: number }): void {
    if (data.name) this._name = data.name;
    if (data.icon !== undefined) this._icon = data.icon;
    if (data.orderIndex !== undefined) this._orderIndex = data.orderIndex;
    this.touch();
  }

  // Getters
  public get name(): string {
    return this._name;
  }

  public get icon(): string | undefined {
    return this._icon;
  }

  public get orderIndex(): number {
    return this._orderIndex;
  }

  /**
   * Convert to plain object
   */
  public toObject(): CategoryProps {
    return {
      id: this._id,
      name: this._name,
      icon: this._icon,
      orderIndex: this._orderIndex,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
    };
  }
}
