/**
 * Sync Strategy
 * Defines different sync modes and behaviors
 */

export enum SyncMode {
  MANUAL = 'MANUAL',             // User-triggered sync
  AUTO = 'AUTO',                 // Background sync every N minutes
  ON_CONNECT = 'ON_CONNECT',     // Sync when network becomes available
  ON_FOREGROUND = 'ON_FOREGROUND', // Sync when app comes to foreground
}

export interface SyncStrategyConfig {
  mode: SyncMode;
  intervalMs?: number;           // For AUTO mode
  enabled: boolean;
}

export class SyncStrategy {
  private config: SyncStrategyConfig;

  constructor(config: SyncStrategyConfig) {
    this.config = config;
  }

  /**
   * Check if sync should run
   */
  public shouldSync(context: {
    isOnline: boolean;
    lastSyncTime: number | null;
    isForeground: boolean;
  }): boolean {
    // Must be online
    if (!context.isOnline) {
      return false;
    }

    // Must be enabled
    if (!this.config.enabled) {
      return false;
    }

    switch (this.config.mode) {
      case SyncMode.MANUAL:
        // Manual sync is triggered explicitly
        return false;

      case SyncMode.AUTO:
        return this.shouldSyncAuto(context.lastSyncTime);

      case SyncMode.ON_CONNECT:
        // Sync when connection is restored
        return true;

      case SyncMode.ON_FOREGROUND:
        return context.isForeground;

      default:
        return false;
    }
  }

  /**
   * Check if auto sync should run
   */
  private shouldSyncAuto(lastSyncTime: number | null): boolean {
    if (!lastSyncTime) {
      return true;
    }

    const interval = this.config.intervalMs ?? 5 * 60 * 1000; // Default 5 min
    const elapsed = Date.now() - lastSyncTime;

    return elapsed >= interval;
  }

  /**
   * Update configuration
   */
  public updateConfig(config: Partial<SyncStrategyConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Get current configuration
   */
  public getConfig(): SyncStrategyConfig {
    return { ...this.config };
  }
}
