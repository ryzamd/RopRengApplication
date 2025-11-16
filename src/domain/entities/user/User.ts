/**
 * User Aggregate Root
 * Represents a user in the system
 */

import { AggregateRoot } from '../base/AggregateRoot';
import { PhoneNumber } from './PhoneNumber';

export interface UserProps {
  id: string;
  phone: PhoneNumber;
  name?: string;
  email?: string;
  avatarUrl?: string;
  createdAt?: number;
  updatedAt?: number;
  syncedAt?: number;
}

export class User extends AggregateRoot<UserProps> {
  private _phone: PhoneNumber;
  private _name?: string;
  private _email?: string;
  private _avatarUrl?: string;
  private _syncedAt?: number;

  private constructor(props: UserProps) {
    super(props.id, props.createdAt, props.updatedAt);
    this._phone = props.phone;
    this._name = props.name;
    this._email = props.email;
    this._avatarUrl = props.avatarUrl;
    this._syncedAt = props.syncedAt;
  }

  /**
   * Create new user (factory method)
   */
  public static create(
    phone: PhoneNumber,
    options?: {
      name?: string;
      email?: string;
      avatarUrl?: string;
    }
  ): User {
    const id = this.generateId();

    const user = new User({
      id,
      phone,
      name: options?.name,
      email: options?.email,
      avatarUrl: options?.avatarUrl,
    });

    // Domain event: UserCreated
    user.addDomainEvent({
      type: 'USER_CREATED',
      userId: id,
      timestamp: Date.now(),
    });

    return user;
  }

  /**
   * Reconstitute user from database
   */
  public static fromDatabase(props: UserProps): User {
    return new User(props);
  }

  /**
   * Update user profile
   */
  public updateProfile(data: {
    name?: string;
    email?: string;
    avatarUrl?: string;
  }): void {
    if (data.name !== undefined) {
      this._name = data.name;
    }

    if (data.email !== undefined) {
      this._email = data.email;
    }

    if (data.avatarUrl !== undefined) {
      this._avatarUrl = data.avatarUrl;
    }

    this.touch();

    // Domain event: UserUpdated
    this.addDomainEvent({
      type: 'USER_UPDATED',
      userId: this._id,
      timestamp: Date.now(),
    });
  }

  /**
   * Mark as synced
   */
  public markSynced(): void {
    this._syncedAt = Date.now();
  }

  // Getters
  public get phone(): PhoneNumber {
    return this._phone;
  }

  public get name(): string | undefined {
    return this._name;
  }

  public get email(): string | undefined {
    return this._email;
  }

  public get avatarUrl(): string | undefined {
    return this._avatarUrl;
  }

  public get syncedAt(): number | undefined {
    return this._syncedAt;
  }

  /**
   * Convert to plain object
   */
  public toObject(): UserProps {
    return {
      id: this._id,
      phone: this._phone,
      name: this._name,
      email: this._email,
      avatarUrl: this._avatarUrl,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
      syncedAt: this._syncedAt,
    };
  }
}
