/**
 * Database Migrations Index
 * Central registry of all database migrations
 */

import { Database } from '../Database';
import { v1_initial } from './v1_initial';

export interface Migration {
  version: number;
  name: string;
  up: (db: Database) => Promise<void>;
  down?: (db: Database) => Promise<void>;
}

/**
 * All migrations in order
 * Add new migrations to this array
 */
export const migrations: Migration[] = [
  v1_initial,
  // Future migrations will be added here
  // v2_add_loyalty,
  // v3_add_notifications,
];
