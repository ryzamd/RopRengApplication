/**
 * Store Entity
 * Represents a physical store location
 */

import { Entity } from '../base/Entity';
import { StoreLocation } from './StoreLocation';

export interface StoreHours {
  [day: string]: {
    open: string;
    close: string;
    closed?: boolean;
  };
}

export interface StoreProps {
  id: string;
  name: string;
  address: string;
  location?: StoreLocation;
  phone?: string;
  hours?: StoreHours;
  operatingHours?: StoreHours; // Alias for hours (used in API/DB)
  isActive: boolean;
  createdAt?: number;
  updatedAt?: number;
  syncedAt?: number;
}

export class Store extends Entity<StoreProps> {
  private _name: string;
  private _address: string;
  private _location?: StoreLocation;
  private _phone?: string;
  private _hours?: StoreHours;
  private _isActive: boolean;
  private _syncedAt?: number;

  private constructor(props: StoreProps) {
    super(props.id, props.createdAt, props.updatedAt);
    this._name = props.name;
    this._address = props.address;
    this._location = props.location;
    this._phone = props.phone;
    this._hours = props.operatingHours ?? props.hours;
    this._isActive = props.isActive;
    this._syncedAt = props.syncedAt;
  }

  /**
   * Create store
   */
  public static create(
    name: string,
    address: string,
    options?: {
      location?: StoreLocation;
      phone?: string;
      hours?: StoreHours;
      isActive?: boolean;
    }
  ): Store {
    const id = this.generateId();

    return new Store({
      id,
      name,
      address,
      location: options?.location,
      phone: options?.phone,
      hours: options?.hours,
      isActive: options?.isActive ?? true,
    });
  }

  /**
   * Reconstitute from database
   */
  public static fromDatabase(props: StoreProps): Store {
    return new Store(props);
  }

  /**
   * Update store info
   */
  public update(data: {
    name?: string;
    address?: string;
    location?: StoreLocation;
    phone?: string;
    hours?: StoreHours;
  }): void {
    if (data.name) this._name = data.name;
    if (data.address) this._address = data.address;
    if (data.location) this._location = data.location;
    if (data.phone !== undefined) this._phone = data.phone;
    if (data.hours) this._hours = data.hours;

    this.touch();
  }

  /**
   * Activate store
   */
  public activate(): void {
    this._isActive = true;
    this.touch();
  }

  /**
   * Deactivate store
   */
  public deactivate(): void {
    this._isActive = false;
    this.touch();
  }

  /**
   * Check if open now
   */
  public isOpenNow(): boolean {
    if (!this._isActive || !this._hours) {
      return false;
    }

    const now = new Date();
    const dayOfWeek = now.toLocaleDateString('en-US', { weekday: 'long' });
    const dayHours = this._hours[dayOfWeek];

    if (!dayHours || dayHours.closed) {
      return false;
    }

    const currentTime = now.toTimeString().slice(0, 5); // HH:MM
    return currentTime >= dayHours.open && currentTime <= dayHours.close;
  }

  /**
   * Calculate distance from location
   */
  public distanceFrom(location: StoreLocation): number | null {
    if (!this._location) {
      return null;
    }

    return this._location.distanceTo(location);
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

  public get address(): string {
    return this._address;
  }

  public get location(): StoreLocation | undefined {
    return this._location;
  }

  public get phone(): string | undefined {
    return this._phone;
  }

  public get hours(): StoreHours | undefined {
    return this._hours;
  }

  public get operatingHours(): StoreHours | undefined {
    return this._hours;
  }

  public get isActive(): boolean {
    return this._isActive;
  }

  public get syncedAt(): number | undefined {
    return this._syncedAt;
  }

  /**
   * Convert to plain object
   */
  public toObject(): StoreProps {
    return {
      id: this._id,
      name: this._name,
      address: this._address,
      location: this._location,
      phone: this._phone,
      hours: this._hours,
      operatingHours: this._hours,
      isActive: this._isActive,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
      syncedAt: this._syncedAt,
    };
  }
}
