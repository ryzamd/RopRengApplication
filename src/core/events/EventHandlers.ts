/**
 * Event Handlers
 * Pre-configured event handlers for common scenarios
 */

import { eventBus } from './EventBus';
import { EventType, UserLoggedInEvent, OrderCreatedEvent } from './DomainEvents';
import { syncEngine } from '../sync/SyncEngine';

/**
 * Setup global event handlers
 */
export function setupEventHandlers(): void {
  // Trigger sync when user logs in
  eventBus.on<UserLoggedInEvent>(EventType.USER_LOGGED_IN, async (event) => {
    console.log('[EventHandlers] User logged in, triggering sync...');
    await syncEngine.sync();
  });

  // Handle order creation
  eventBus.on<OrderCreatedEvent>(EventType.ORDER_CREATED, async (event) => {
    console.log('[EventHandlers] Order created:', event.payload.orderId);
    // Could trigger notifications, analytics, etc.
  });

  // Handle network status changes
  eventBus.on(EventType.NETWORK_ONLINE, () => {
    console.log('[EventHandlers] Network online, starting sync...');
    syncEngine.sync();
  });

  eventBus.on(EventType.NETWORK_OFFLINE, () => {
    console.log('[EventHandlers] Network offline');
  });

  console.log('[EventHandlers] Global event handlers setup complete');
}
