/**
 * Sync Engine
 * Main orchestrator for offline-first sync
 *
 * Responsibilities:
 * - Process sync queue
 * - Handle network changes
 * - Coordinate sync strategies
 * - Manage retry logic
 * - Resolve conflicts
 */

import { ENV } from '../../config/env';
import { networkMonitor, NetworkState } from './NetworkMonitor';
import { syncQueue, SyncQueueItem } from './SyncQueue';
import { SyncMode, SyncStrategy, SyncStrategyConfig } from './SyncStrategy';

export interface SyncEngineConfig {
  enabled: boolean;
  strategy: SyncStrategyConfig;
  maxRetries: number;
  retryDelayMs: number;
  batchSize: number;
}

export class SyncEngine {
  private static instance: SyncEngine;
  private config: SyncEngineConfig;
  private strategy: SyncStrategy;
  private isSyncing: boolean = false;
  private syncIntervalId: ReturnType<typeof setInterval> | null = null;
  private networkUnsubscribe: (() => void) | null = null;

  private constructor(config?: Partial<SyncEngineConfig>) {
    this.config = {
      enabled: ENV.ENABLE_OFFLINE_SYNC,
      strategy: {
        mode: SyncMode.AUTO,
        intervalMs: 5 * 60 * 1000, // 5 minutes
        enabled: true,
      },
      maxRetries: 3,
      retryDelayMs: 2000,
      batchSize: 20,
      ...config,
    };

    this.strategy = new SyncStrategy(this.config.strategy);
  }

  /**
   * Get singleton instance
   */
  public static getInstance(config?: Partial<SyncEngineConfig>): SyncEngine {
    if (!SyncEngine.instance) {
      SyncEngine.instance = new SyncEngine(config);
    }
    return SyncEngine.instance;
  }

  /**
   * Start sync engine
   */
  public async start(): Promise<void> {
    if (!this.config.enabled) {
      console.log('[SyncEngine] Disabled, skipping start');
      return;
    }

    console.log('[SyncEngine] Starting...');

    // Subscribe to network changes
    this.networkUnsubscribe = networkMonitor.subscribe((state) => {
      this.handleNetworkChange(state);
    });

    // Setup auto sync if enabled
    if (this.config.strategy.mode === SyncMode.AUTO) {
      this.startAutoSync();
    }

    // Run initial sync if online
    if (networkMonitor.isOnline()) {
      await this.sync();
    }

    console.log('[SyncEngine] Started');
  }

  /**
   * Stop sync engine
   */
  public stop(): void {
    console.log('[SyncEngine] Stopping...');


  }

  /**
   * Manually trigger sync
   */
  public async sync(): Promise<void> {
    if (this.isSyncing) {
      console.log('[SyncEngine] Sync already in progress, skipping');
      return;
    }

    if (!networkMonitor.isOnline()) {
      console.log('[SyncEngine] Offline, skipping sync');
      return;
    }

    this.isSyncing = true;

    try {
      console.log('[SyncEngine] Starting sync...');

      // Get pending items
      const pendingItems = await syncQueue.getPending(this.config.batchSize);
      console.log(`[SyncEngine] Found ${pendingItems.length} pending items`);

      // Process each item
      for (const item of pendingItems) {
        await this.processSyncItem(item);
      }

      // Update last sync time
      await this.updateLastSyncTime();

      // Cleanup old synced items
      await syncQueue.cleanupOldItems(7);

      console.log('[SyncEngine] Sync completed successfully');
    } catch (error) {
      console.error('[SyncEngine] Sync failed:', error);
    } finally {
      this.isSyncing = false;
    }
  }

  /**
   * Process a single sync item
   */
  private async processSyncItem(item: SyncQueueItem): Promise<void> {
    try {
      console.log(`[SyncEngine] Processing: ${item.entity_type} ${item.operation}`);

      // Check retry limit
      if (item.retry_count >= this.config.maxRetries) {
        console.warn(`[SyncEngine] Max retries reached for item ${item.id}, skipping`);
        return;
      }

      // Parse payload
      const payload = JSON.parse(item.payload_json);

      // TODO: Call appropriate API endpoint based on entity_type and operation
      // For now, simulate API call
      await this.simulateApiCall(item, payload);

      // Mark as synced
      await syncQueue.markSynced(item.id);
      console.log(`[SyncEngine] Successfully synced: ${item.id}`);
    } catch (error) {
      console.error(`[SyncEngine] Failed to sync item ${item.id}:`, error);

      // Mark as failed and increment retry count
      await syncQueue.markFailed(
        item.id,
        error instanceof Error ? error.message : 'Unknown error'
      );

      // Wait before next retry (exponential backoff)
      const delay = this.config.retryDelayMs * Math.pow(2, item.retry_count);
      await this.sleep(delay);
    }
  }

  /**
   * Simulate API call (will be replaced with real API calls)
   */
  private async simulateApiCall(item: SyncQueueItem, payload: any): Promise<void> {
    // Simulate network delay
    await this.sleep(100);

    // Simulate success
    console.log(`[SyncEngine] API call simulated for ${item.entity_type}`);
  }

  /**
   * Handle network state changes
   */
  private handleNetworkChange(state: NetworkState): void {
    console.log('[SyncEngine] Network state changed:', state.status);

  }

  /**
   * Start auto sync interval
   */
  private startAutoSync(): void {
    const interval = this.config.strategy.intervalMs ?? 5 * 60 * 1000;

    this.syncIntervalId = setInterval(() => {
      if (networkMonitor.isOnline()) {
        this.sync();
      }
    }, interval);

    console.log(`[SyncEngine] Auto sync started (interval: ${interval}ms)`);
  }

  /**
   * Stop auto sync interval
   */
  private stopAutoSync(): void {
  }

  /**
   * Update last sync time
   */
  private async updateLastSyncTime(): Promise<void> {
    // TODO: Store last sync time in database
    const now = Date.now();
    console.log(`[SyncEngine] Last sync time updated: ${new Date(now).toISOString()}`);
  }

  /**
   * Get sync statistics
   */
  public async getStats(): Promise<{
    pending: number;
    synced: number;
    failed: number;
    isOnline: boolean;
    isSyncing: boolean;
  }> {
    const queueStats = await syncQueue.getStats();

    return {
      ...queueStats,
      isOnline: networkMonitor.isOnline(),
      isSyncing: this.isSyncing,
    };
  }

  /**
   * Update configuration
   */
  public updateConfig(config: Partial<SyncEngineConfig>): void {
    this.config = { ...this.config, ...config };

  }

  /**
   * Sleep utility
   */
  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

// Export singleton instance
export const syncEngine = SyncEngine.getInstance();
