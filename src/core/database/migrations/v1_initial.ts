/**
 * Migration v1: Initial Schema
 * Creates all initial tables
 */

import { Migration } from './index';

export const v1_initial: Migration = {
  version: 1,
  name: 'v1_initial',

  up: async (db) => {
    // Tables are created by DatabaseInitializer
    // This migration is just a placeholder for version 1
    console.log('[Migration v1] Initial schema created');
  },

  down: async (db) => {
    // Drop all tables
    await db.dropAllTables();
    console.log('[Migration v1] All tables dropped');
  },
};
