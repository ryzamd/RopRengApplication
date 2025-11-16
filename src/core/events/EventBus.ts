/**
 * Event Bus
 * Simple pub/sub event bus for domain events
 *
 * Features:
 * - Type-safe events
 * - Subscribe/unsubscribe
 * - Async event handlers
 * - Error handling
 */

import { EventType, DomainEvent } from './DomainEvents';

type EventHandler<T = any> = (event: DomainEvent<T>) => void | Promise<void>;

export class EventBus {
  private static instance: EventBus;
  private handlers: Map<EventType, Set<EventHandler>> = new Map();

  private constructor() {}

  /**
   * Get singleton instance
   */
  public static getInstance(): EventBus {
    if (!EventBus.instance) {
      EventBus.instance = new EventBus();
    }
    return EventBus.instance;
  }

  /**
   * Subscribe to an event
   */
  public on<T = any>(
    eventType: EventType,
    handler: EventHandler<T>
  ): () => void {
    if (!this.handlers.has(eventType)) {
      this.handlers.set(eventType, new Set());
    }

    this.handlers.get(eventType)!.add(handler);

    // Return unsubscribe function
    return () => this.off(eventType, handler);
  }

  /**
   * Subscribe to an event (one-time)
   */
  public once<T = any>(
    eventType: EventType,
    handler: EventHandler<T>
  ): void {
    const onceHandler = (event: DomainEvent<T>) => {
      handler(event);
      this.off(eventType, onceHandler);
    };

    this.on(eventType, onceHandler);
  }

  /**
   * Unsubscribe from an event
   */
  public off(eventType: EventType, handler: EventHandler): void {
    const handlers = this.handlers.get(eventType);
    if (handlers) {
      handlers.delete(handler);

      // Clean up empty sets
      if (handlers.size === 0) {
        this.handlers.delete(eventType);
      }
    }
  }

  /**
   * Emit an event
   */
  public async emit<T = any>(
    eventType: EventType,
    payload: T
  ): Promise<void> {
    const event: DomainEvent<T> = {
      type: eventType,
      payload,
      timestamp: Date.now(),
    };

    const handlers = this.handlers.get(eventType);
    if (!handlers || handlers.size === 0) {
      return;
    }

    console.log(`[EventBus] Emitting: ${eventType}`, payload);

    // Execute all handlers
    const promises: Promise<void>[] = [];

    for (const handler of handlers) {
      try {
        const result = handler(event);
        if (result instanceof Promise) {
          promises.push(result);
        }
      } catch (error) {
        console.error(`[EventBus] Handler error for ${eventType}:`, error);
      }
    }

    // Wait for all async handlers
    if (promises.length > 0) {
      await Promise.allSettled(promises);
    }
  }

  /**
   * Remove all handlers for an event type
   */
  public removeAllListeners(eventType?: EventType): void {
    if (eventType) {
      this.handlers.delete(eventType);
    } else {
      this.handlers.clear();
    }
  }

  /**
   * Get number of handlers for an event
   */
  public listenerCount(eventType: EventType): number {
    return this.handlers.get(eventType)?.size ?? 0;
  }

  /**
   * Get all event types with listeners
   */
  public eventNames(): EventType[] {
    return Array.from(this.handlers.keys());
  }
}

// Export singleton instance
export const eventBus = EventBus.getInstance();
