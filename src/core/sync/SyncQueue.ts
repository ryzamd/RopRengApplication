/**
 * Sync Queue
 * Manages pending sync operations in SQLite
 *
 * Features:
 * - Queue management for offline operations
 * - Priority-based processing
 * - Retry logic with exponential backoff
 */

import { database } from '../database/Database';
import { EntityType, SyncOperation, SyncPriority } from '../../config/constants';

export interface SyncQueueItem {
  id: string;
  entity_type: EntityType;
  entity_id: string;
  operation: SyncOperation;
  priority: SyncPriority;
  payload_json: string;
  retry_count: number;
  error_message: string | null;
  created_at: number;
  synced_at: number | null;
}

export class SyncQueue {
  /**
   * Add item to sync queue
   */
  public async enqueue(
    entityType: EntityType,
    entityId: string,
    operation: SyncOperation,
    priority: SyncPriority,
    payload: any
  ): Promise<string> {
    const id = this.generateId();
    const now = Date.now();

    await database.runAsync(
      `INSERT INTO sync_queue (
        id, entity_type, entity_id, operation, priority,
        payload_json, retry_count, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, 0, ?)`,
      [
        id,
        entityType,
        entityId,
        operation,
        priority,
        JSON.stringify(payload),
        now,
      ]
    );

    console.log(`[SyncQueue] Enqueued: ${entityType} ${operation} (priority: ${priority})`);
    return id;
  }

  /**
   * Get pending items (not synced yet)
   */
  public async getPending(limit: number = 50): Promise<SyncQueueItem[]> {
    return await database.getAllAsync<SyncQueueItem>(
      `SELECT * FROM sync_queue
       WHERE synced_at IS NULL
       ORDER BY priority ASC, created_at ASC
       LIMIT ?`,
      [limit]
    );
  }

  /**
   * Get items by priority
   */
  public async getByPriority(
    priority: SyncPriority,
    limit: number = 50
  ): Promise<SyncQueueItem[]> {
    return await database.getAllAsync<SyncQueueItem>(
      `SELECT * FROM sync_queue
       WHERE synced_at IS NULL AND priority = ?
       ORDER BY created_at ASC
       LIMIT ?`,
      [priority, limit]
    );
  }

  /**
   * Mark item as synced
   */
  public async markSynced(id: string): Promise<void> {
    await database.runAsync(
      'UPDATE sync_queue SET synced_at = ? WHERE id = ?',
      [Date.now(), id]
    );
    console.log(`[SyncQueue] Marked as synced: ${id}`);
  }

  /**
   * Mark item as failed (increment retry count)
   */
  public async markFailed(id: string, errorMessage: string): Promise<void> {
    await database.runAsync(
      `UPDATE sync_queue
       SET retry_count = retry_count + 1, error_message = ?
       WHERE id = ?`,
      [errorMessage, id]
    );
    console.log(`[SyncQueue] Marked as failed: ${id}`);
  }

  /**
   * Remove synced items older than N days
   */
  public async cleanupOldItems(daysOld: number = 7): Promise<void> {
    const cutoffTime = Date.now() - daysOld * 24 * 60 * 60 * 1000;

    const result = await database.runAsync(
      'DELETE FROM sync_queue WHERE synced_at IS NOT NULL AND synced_at < ?',
      [cutoffTime]
    );

    console.log(`[SyncQueue] Cleaned up ${result.changes} old items`);
  }

  /**
   * Get queue statistics
   */
  public async getStats(): Promise<{
    pending: number;
    synced: number;
    failed: number;
  }> {
    const pending = await database.getFirstAsync<{ count: number }>(
      'SELECT COUNT(*) as count FROM sync_queue WHERE synced_at IS NULL'
    );

    const synced = await database.getFirstAsync<{ count: number }>(
      'SELECT COUNT(*) as count FROM sync_queue WHERE synced_at IS NOT NULL'
    );

    const failed = await database.getFirstAsync<{ count: number }>(
      'SELECT COUNT(*) as count FROM sync_queue WHERE retry_count > 0 AND synced_at IS NULL'
    );

    return {
      pending: pending?.count ?? 0,
      synced: synced?.count ?? 0,
      failed: failed?.count ?? 0,
    };
  }

  /**
   * Clear all pending items (for testing)
   */
  public async clearAll(): Promise<void> {
    await database.runAsync('DELETE FROM sync_queue');
    console.log('[SyncQueue] All items cleared');
  }

  /**
   * Generate unique ID
   */
  private generateId(): string {
    return `sync_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

// Export singleton instance
export const syncQueue = new SyncQueue();
