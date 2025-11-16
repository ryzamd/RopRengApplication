/**
 * Conflict Resolver
 * Handles data conflicts during sync
 *
 * Strategies:
 * - SERVER_WINS: Server data always wins
 * - CLIENT_WINS: Client data always wins
 * - LAST_WRITE_WINS: Most recent timestamp wins
 * - MERGE: Intelligent merge (field-level)
 */

export enum ConflictStrategy {
  SERVER_WINS = 'SERVER_WINS',
  CLIENT_WINS = 'CLIENT_WINS',
  LAST_WRITE_WINS = 'LAST_WRITE_WINS',
  MERGE = 'MERGE',
}

export interface ConflictData {
  clientData: any;
  serverData: any;
  clientTimestamp: number;
  serverTimestamp: number;
}

export class ConflictResolver {
  /**
   * Resolve conflict using specified strategy
   */
  public static resolve(
    conflict: ConflictData,
    strategy: ConflictStrategy = ConflictStrategy.LAST_WRITE_WINS
  ): any {
    switch (strategy) {
      case ConflictStrategy.SERVER_WINS:
        return this.serverWins(conflict);

      case ConflictStrategy.CLIENT_WINS:
        return this.clientWins(conflict);

      case ConflictStrategy.LAST_WRITE_WINS:
        return this.lastWriteWins(conflict);

      case ConflictStrategy.MERGE:
        return this.merge(conflict);

      default:
        console.warn(`[ConflictResolver] Unknown strategy: ${strategy}, using LAST_WRITE_WINS`);
        return this.lastWriteWins(conflict);
    }
  }

  /**
   * Server data wins
   */
  private static serverWins(conflict: ConflictData): any {
    console.log('[ConflictResolver] Resolved with SERVER_WINS');
    return conflict.serverData;
  }

  /**
   * Client data wins
   */
  private static clientWins(conflict: ConflictData): any {
    console.log('[ConflictResolver] Resolved with CLIENT_WINS');
    return conflict.clientData;
  }

  /**
   * Most recent timestamp wins
   */
  private static lastWriteWins(conflict: ConflictData): any {
    const winner =
      conflict.serverTimestamp > conflict.clientTimestamp
        ? conflict.serverData
        : conflict.clientData;

    console.log(
      `[ConflictResolver] Resolved with LAST_WRITE_WINS: ${
        conflict.serverTimestamp > conflict.clientTimestamp ? 'SERVER' : 'CLIENT'
      }`
    );

    return winner;
  }

  /**
   * Intelligent field-level merge
   * For each field, use the most recent value
   */
  private static merge(conflict: ConflictData): any {
    const merged = { ...conflict.clientData };

    // For each field in server data
    for (const key in conflict.serverData) {
      // If server field is newer, use it
      if (
        conflict.serverTimestamp > conflict.clientTimestamp ||
        !merged.hasOwnProperty(key)
      ) {
        merged[key] = conflict.serverData[key];
      }
    }

    console.log('[ConflictResolver] Resolved with MERGE');
    return merged;
  }

  /**
   * Check if conflict exists
   */
  public static hasConflict(
    clientData: any,
    serverData: any
  ): boolean {
    // Simple deep equality check
    return JSON.stringify(clientData) !== JSON.stringify(serverData);
  }
}
