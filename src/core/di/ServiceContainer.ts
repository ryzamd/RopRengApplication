/**
 * Service Container
 * Simple Dependency Injection container
 *
 * Features:
 * - Singleton pattern
 * - Lazy initialization
 * - Type-safe service resolution
 */

import { ServiceType } from './types';

export class ServiceContainer {
  private static instance: ServiceContainer;
  private services: Map<symbol, any> = new Map();
  private factories: Map<symbol, () => any> = new Map();

  private constructor() {}

  /**
   * Get singleton instance
   */
  public static getInstance(): ServiceContainer {
    if (!ServiceContainer.instance) {
      ServiceContainer.instance = new ServiceContainer();
    }
    return ServiceContainer.instance;
  }

  /**
   * Register a service instance
   */
  public register<T>(identifier: ServiceType, instance: T): void {
    this.services.set(identifier, instance);
  }

  /**
   * Register a service factory (lazy initialization)
   */
  public registerFactory<T>(
    identifier: ServiceType,
    factory: () => T
  ): void {
    this.factories.set(identifier, factory);
  }

  /**
   * Resolve a service
   */
  public resolve<T>(identifier: ServiceType): T {
    // Check if instance already exists
    if (this.services.has(identifier)) {
      return this.services.get(identifier) as T;
    }

    // Check if factory exists
    if (this.factories.has(identifier)) {
      const factory = this.factories.get(identifier)!;
      const instance = factory();
      this.services.set(identifier, instance);
      return instance as T;
    }

    throw new Error(
      `Service not registered: ${identifier.toString()}`
    );
  }

  /**
   * Check if service is registered
   */
  public has(identifier: ServiceType): boolean {
    return (
      this.services.has(identifier) || this.factories.has(identifier)
    );
  }

  /**
   * Clear all services (for testing)
   */
  public clear(): void {
    this.services.clear();
    this.factories.clear();
  }

  /**
   * Remove a specific service
   */
  public remove(identifier: ServiceType): void {
    this.services.delete(identifier);
    this.factories.delete(identifier);
  }
}

// Export singleton instance
export const container = ServiceContainer.getInstance();
