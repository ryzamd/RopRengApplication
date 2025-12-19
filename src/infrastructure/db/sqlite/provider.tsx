import * as SQLite from 'expo-sqlite';
import { SQLiteProvider, useSQLiteContext } from 'expo-sqlite';
import React from 'react';
import { migrateDeliveryAddresses } from './migrations/002_add_delivery_addresses';

export async function migrateDbIfNeeded(db: SQLite.SQLiteDatabase) {
  await db.execAsync('PRAGMA journal_mode = WAL');
  await db.execAsync('PRAGMA foreign_keys = ON');
  
  // Cart items table
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS cart_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL,
      store_id TEXT NOT NULL,
      product_id TEXT NOT NULL,
      quantity INTEGER NOT NULL DEFAULT 1,
      created_at INTEGER NOT NULL,
      UNIQUE(user_id, store_id, product_id)
    );
  `);

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS todos (
      id INTEGER PRIMARY KEY NOT NULL,
      title TEXT NOT NULL,
      done INTEGER NOT NULL DEFAULT 0
    );
  `);
  
  // Index for fast queries
  await db.execAsync(`
    CREATE INDEX IF NOT EXISTS idx_cart_user_store ON cart_items(user_id, store_id);
  `);

  await migrateDeliveryAddresses(db);
}

export function DatabaseProvider({ children }: React.PropsWithChildren) {
  return (
    <SQLiteProvider databaseName="ropreng.db" onInit={migrateDbIfNeeded}>
      {children}
    </SQLiteProvider>
  );
}

export function useDb() {
  return useSQLiteContext();
}