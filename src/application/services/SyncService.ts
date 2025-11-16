/**
 * Sync Service
 * Coordinates offline sync operations
 */

import { SyncEngine } from '../../core/sync/SyncEngine';
import { NetworkMonitor } from '../../core/sync/NetworkMonitor';
import { Logger } from '../../core/utils/Logger';
import { EventBus } from '../../core/events/EventBus';
import { EventType } from '../../core/events/DomainEvents';

export class SyncService {
  private static instance: SyncService;
  private syncEngine: SyncEngine;
  private networkMonitor: NetworkMonitor;
  private isSyncing: boolean = false;

  private constructor() {
    this.syncEngine = SyncEngine.getInstance();
    this.networkMonitor = NetworkMonitor.getInstance();

    this.setupNetworkListener();
  }

  public static getInstance(): SyncService {
    if (!SyncService.instance) {
      SyncService.instance = new SyncService();
    }
    return SyncService.instance;
  }

  /**
   * Initialize sync service
   */
  public async initialize(): Promise<void> {
    Logger.info('Initializing SyncService');

    // Start sync engine
    await this.syncEngine.start();

    // Trigger initial sync if online
    if (this.networkMonitor.isOnline()) {
      await this.sync();
    }
  }

  /**
   * Setup network status listener
   */
  private setupNetworkListener(): void {
    this.networkMonitor.subscribe(async (status) => {
      Logger.info('Network status changed', { status });

      // Emit network status event
      await EventBus.getInstance().emit(EventType.NETWORK_STATUS_CHANGED, {
        isOnline: status.status === 'online',
        timestamp: Date.now(),
      });

      // Trigger sync when coming online
      if (status.status === 'online' && !this.isSyncing) {
        await this.sync();
      }
    });
  }

  /**
   * Manually trigger sync
   */
  public async sync(): Promise<void> {
    if (this.isSyncing) {
      Logger.warn('Sync already in progress');
      return;
    }

    if (!this.networkMonitor.isOnline()) {
      Logger.warn('Cannot sync while offline');
      return;
    }

    try {
      this.isSyncing = true;

      Logger.info('Starting manual sync');

      await EventBus.getInstance().emit(EventType.SYNC_STARTED, {
        timestamp: Date.now(),
      });

      await this.syncEngine.sync();

      await EventBus.getInstance().emit(EventType.SYNC_COMPLETED, {
        timestamp: Date.now(),
      });

      Logger.info('Manual sync completed');
    } catch (error: any) {
      Logger.error('Manual sync failed', error);

      await EventBus.getInstance().emit(EventType.SYNC_FAILED, {
        error: error.message,
        timestamp: Date.now(),
      });
    } finally {
      this.isSyncing = false;
    }
  }

  /**
   * Check if currently syncing
   */
  public isSyncInProgress(): boolean {
    return this.isSyncing;
  }

  /**
   * Check network status
   */
  public isOnline(): boolean {
    return this.networkMonitor.isOnline();
  }

  /**
   * Get network connection type
   */
  public getConnectionType(): string {
    const state = this.networkMonitor.getNetworkState();
    return state.type || 'unknown';
  }

  /**
   * Stop sync service
   */
  public async stop(): Promise<void> {
    Logger.info('Stopping SyncService');
    await this.syncEngine.stop();
  }
}
