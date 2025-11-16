/**
 * Database Schema
 * SQLite table definitions for offline-first architecture
 */

export const SCHEMA = {
  // Users table
  users: `
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      phone TEXT UNIQUE NOT NULL,
      name TEXT,
      email TEXT,
      avatar_url TEXT,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL,
      synced_at INTEGER,
      is_synced INTEGER DEFAULT 0
    );
    CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);
    CREATE INDEX IF NOT EXISTS idx_users_synced ON users(is_synced, synced_at);
  `,

  // Products table
  products: `
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      price REAL NOT NULL,
      category_id TEXT,
      image_url TEXT,
      is_available INTEGER DEFAULT 1,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL,
      synced_at INTEGER,
      is_synced INTEGER DEFAULT 0
    );
    CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
    CREATE INDEX IF NOT EXISTS idx_products_available ON products(is_available);
  `,

  // Product options table
  product_options: `
    CREATE TABLE IF NOT EXISTS product_options (
      id TEXT PRIMARY KEY,
      product_id TEXT NOT NULL,
      name TEXT NOT NULL,
      type TEXT NOT NULL,
      required INTEGER DEFAULT 0,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
    );
    CREATE INDEX IF NOT EXISTS idx_product_options_product ON product_options(product_id);
  `,

  // Product option values table
  product_option_values: `
    CREATE TABLE IF NOT EXISTS product_option_values (
      id TEXT PRIMARY KEY,
      option_id TEXT NOT NULL,
      value TEXT NOT NULL,
      price_modifier REAL DEFAULT 0,
      created_at INTEGER NOT NULL,
      FOREIGN KEY (option_id) REFERENCES product_options(id) ON DELETE CASCADE
    );
    CREATE INDEX IF NOT EXISTS idx_option_values_option ON product_option_values(option_id);
  `,

  // Categories table
  categories: `
    CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      icon TEXT,
      order_index INTEGER DEFAULT 0,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL,
      synced_at INTEGER,
      is_synced INTEGER DEFAULT 0
    );
    CREATE INDEX IF NOT EXISTS idx_categories_order ON categories(order_index);
  `,

  // Orders table
  orders: `
    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      store_id TEXT NOT NULL,
      status TEXT NOT NULL,
      order_type TEXT NOT NULL,
      total REAL NOT NULL,
      delivery_address TEXT,
      delivery_fee REAL DEFAULT 0,
      discount REAL DEFAULT 0,
      notes TEXT,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL,
      synced_at INTEGER,
      is_synced INTEGER DEFAULT 0,
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (store_id) REFERENCES stores(id)
    );
    CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
    CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
    CREATE INDEX IF NOT EXISTS idx_orders_created ON orders(created_at DESC);
  `,

  // Order items table
  order_items: `
    CREATE TABLE IF NOT EXISTS order_items (
      id TEXT PRIMARY KEY,
      order_id TEXT NOT NULL,
      product_id TEXT NOT NULL,
      quantity INTEGER NOT NULL,
      price REAL NOT NULL,
      options_json TEXT,
      notes TEXT,
      created_at INTEGER NOT NULL,
      FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
      FOREIGN KEY (product_id) REFERENCES products(id)
    );
    CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);
  `,

  // Payments table
  payments: `
    CREATE TABLE IF NOT EXISTS payments (
      id TEXT PRIMARY KEY,
      order_id TEXT NOT NULL,
      method TEXT NOT NULL,
      amount REAL NOT NULL,
      status TEXT NOT NULL,
      transaction_id TEXT,
      vnpay_data_json TEXT,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL,
      synced_at INTEGER,
      is_synced INTEGER DEFAULT 0,
      FOREIGN KEY (order_id) REFERENCES orders(id)
    );
    CREATE INDEX IF NOT EXISTS idx_payments_order ON payments(order_id);
    CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
  `,

  // Loyalty accounts table
  loyalty_accounts: `
    CREATE TABLE IF NOT EXISTS loyalty_accounts (
      id TEXT PRIMARY KEY,
      user_id TEXT UNIQUE NOT NULL,
      points REAL DEFAULT 0,
      tier TEXT DEFAULT 'BRONZE',
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL,
      synced_at INTEGER,
      is_synced INTEGER DEFAULT 0,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );
    CREATE INDEX IF NOT EXISTS idx_loyalty_user ON loyalty_accounts(user_id);
  `,

  // Loyalty transactions table
  loyalty_transactions: `
    CREATE TABLE IF NOT EXISTS loyalty_transactions (
      id TEXT PRIMARY KEY,
      account_id TEXT NOT NULL,
      type TEXT NOT NULL,
      points REAL NOT NULL,
      order_id TEXT,
      description TEXT,
      created_at INTEGER NOT NULL,
      synced_at INTEGER,
      is_synced INTEGER DEFAULT 0,
      FOREIGN KEY (account_id) REFERENCES loyalty_accounts(id),
      FOREIGN KEY (order_id) REFERENCES orders(id)
    );
    CREATE INDEX IF NOT EXISTS idx_loyalty_trans_account ON loyalty_transactions(account_id);
    CREATE INDEX IF NOT EXISTS idx_loyalty_trans_created ON loyalty_transactions(created_at DESC);
  `,

  // Vouchers table
  vouchers: `
    CREATE TABLE IF NOT EXISTS vouchers (
      id TEXT PRIMARY KEY,
      code TEXT UNIQUE NOT NULL,
      type TEXT NOT NULL,
      value REAL NOT NULL,
      min_order REAL DEFAULT 0,
      max_discount REAL,
      expiry_date INTEGER,
      usage_limit INTEGER,
      used_count INTEGER DEFAULT 0,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL,
      synced_at INTEGER,
      is_synced INTEGER DEFAULT 0
    );
    CREATE INDEX IF NOT EXISTS idx_vouchers_code ON vouchers(code);
    CREATE INDEX IF NOT EXISTS idx_vouchers_expiry ON vouchers(expiry_date);
  `,

  // User vouchers table
  user_vouchers: `
    CREATE TABLE IF NOT EXISTS user_vouchers (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      voucher_id TEXT NOT NULL,
      is_used INTEGER DEFAULT 0,
      used_at INTEGER,
      order_id TEXT,
      created_at INTEGER NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (voucher_id) REFERENCES vouchers(id),
      FOREIGN KEY (order_id) REFERENCES orders(id)
    );
    CREATE INDEX IF NOT EXISTS idx_user_vouchers_user ON user_vouchers(user_id);
    CREATE INDEX IF NOT EXISTS idx_user_vouchers_used ON user_vouchers(is_used);
  `,

  // Stores table
  stores: `
    CREATE TABLE IF NOT EXISTS stores (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      address TEXT NOT NULL,
      latitude REAL,
      longitude REAL,
      phone TEXT,
      hours_json TEXT,
      is_active INTEGER DEFAULT 1,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL,
      synced_at INTEGER,
      is_synced INTEGER DEFAULT 0
    );
    CREATE INDEX IF NOT EXISTS idx_stores_active ON stores(is_active);
    CREATE INDEX IF NOT EXISTS idx_stores_location ON stores(latitude, longitude);
  `,

  // Sync queue table
  sync_queue: `
    CREATE TABLE IF NOT EXISTS sync_queue (
      id TEXT PRIMARY KEY,
      entity_type TEXT NOT NULL,
      entity_id TEXT NOT NULL,
      operation TEXT NOT NULL,
      priority INTEGER NOT NULL,
      payload_json TEXT NOT NULL,
      retry_count INTEGER DEFAULT 0,
      error_message TEXT,
      created_at INTEGER NOT NULL,
      synced_at INTEGER
    );
    CREATE INDEX IF NOT EXISTS idx_sync_queue_priority ON sync_queue(priority, created_at);
    CREATE INDEX IF NOT EXISTS idx_sync_queue_entity ON sync_queue(entity_type, entity_id);
    CREATE INDEX IF NOT EXISTS idx_sync_queue_synced ON sync_queue(synced_at);
  `,

  // Sync status table
  sync_status: `
    CREATE TABLE IF NOT EXISTS sync_status (
      entity_type TEXT PRIMARY KEY,
      last_sync_at INTEGER NOT NULL,
      sync_token TEXT,
      is_syncing INTEGER DEFAULT 0
    );
  `,
} as const;

export type TableName = keyof typeof SCHEMA;
