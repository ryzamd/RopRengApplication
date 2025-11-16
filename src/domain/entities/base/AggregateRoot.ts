/**
 * Aggregate Root
 * Base class for aggregate roots in DDD
 *
 * Key concepts:
 * - Aggregates enforce consistency boundaries
 * - Only aggregate roots can be referenced from outside
 * - Aggregates can raise domain events
 */

import { Entity } from './Entity';

export abstract class AggregateRoot<T> extends Entity<T> {
  private _domainEvents: any[] = [];

  /**
   * Add domain event
   */
  protected addDomainEvent(event: any): void {
    this._domainEvents.push(event);
  }

  /**
   * Get domain events
   */
  public getDomainEvents(): any[] {
    return [...this._domainEvents];
  }

  /**
   * Clear domain events
   */
  public clearDomainEvents(): void {
    this._domainEvents = [];
  }
}
