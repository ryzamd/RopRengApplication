import * as SQLite from 'expo-sqlite';

export async function migrateDeliveryAddresses(db: SQLite.SQLiteDatabase): Promise<void> {
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS delivery_addresses (
      id TEXT PRIMARY KEY NOT NULL,
      latitude REAL NOT NULL,
      longitude REAL NOT NULL,
      formatted_address TEXT NOT NULL,
      is_default INTEGER NOT NULL DEFAULT 0,
      label TEXT,
      created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now'))
    );
  `);

  await db.execAsync(`
    CREATE INDEX IF NOT EXISTS idx_delivery_addresses_default
    ON delivery_addresses(is_default);
  `);
}