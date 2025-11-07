import React from 'react';
import * as SQLite from 'expo-sqlite';
import { SQLiteProvider, useSQLiteContext } from 'expo-sqlite';

export async function migrateDbIfNeeded(db: SQLite.SQLiteDatabase) {
  await db.execAsync('PRAGMA journal_mode = WAL');
  await db.execAsync('PRAGMA foreign_keys = ON');
  // Future migrations here
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