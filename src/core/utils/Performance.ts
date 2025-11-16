/**
 * Performance Monitor
 * Track and measure app performance
 *
 * Features:
 * - Measure execution time
 * - Track component render times
 * - Monitor database query performance
 */

import { logger } from './Logger';

export interface PerformanceMetric {
  name: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  metadata?: any;
}

export class Performance {
  private static instance: Performance;
  private metrics: Map<string, PerformanceMetric> = new Map();
  private completedMetrics: PerformanceMetric[] = [];
  private maxMetrics: number = 100;

  private constructor() {}

  /**
   * Get singleton instance
   */
  public static getInstance(): Performance {
    if (!Performance.instance) {
      Performance.instance = new Performance();
    }
    return Performance.instance;
  }

  /**
   * Start measuring
   */
  public start(name: string, metadata?: any): void {
    const metric: PerformanceMetric = {
      name,
      startTime: Date.now(),
      metadata,
    };

    this.metrics.set(name, metric);
  }

  /**
   * End measuring
   */
  public end(name: string): number | null {
    const metric = this.metrics.get(name);

    if (!metric) {
      logger.warn(`[Performance] Metric not found: ${name}`);
      return null;
    }

    metric.endTime = Date.now();
    metric.duration = metric.endTime - metric.startTime;

    // Log if slow
    if (metric.duration > 1000) {
      logger.warn(`[Performance] Slow operation: ${name} (${metric.duration}ms)`);
    } else {
      logger.debug(`[Performance] ${name}: ${metric.duration}ms`);
    }

    // Move to completed
    this.completedMetrics.push(metric);
    this.metrics.delete(name);

    // Trim if exceeded max
    if (this.completedMetrics.length > this.maxMetrics) {
      this.completedMetrics = this.completedMetrics.slice(-this.maxMetrics);
    }

    return metric.duration;
  }

  /**
   * Measure async function
   */
  public async measure<T>(
    name: string,
    fn: () => Promise<T>,
    metadata?: any
  ): Promise<T> {
    this.start(name, metadata);
    try {
      const result = await fn();
      this.end(name);
      return result;
    } catch (error) {
      this.end(name);
      throw error;
    }
  }

  /**
   * Measure sync function
   */
  public measureSync<T>(
    name: string,
    fn: () => T,
    metadata?: any
  ): T {
    this.start(name, metadata);
    try {
      const result = fn();
      this.end(name);
      return result;
    } catch (error) {
      this.end(name);
      throw error;
    }
  }

  /**
   * Get all completed metrics
   */
  public getMetrics(): PerformanceMetric[] {
    return [...this.completedMetrics];
  }

  /**
   * Get average duration for a metric name
   */
  public getAverage(name: string): number {
    const relevant = this.completedMetrics.filter((m) => m.name === name);

    if (relevant.length === 0) {
      return 0;
    }

    const total = relevant.reduce((sum, m) => sum + (m.duration ?? 0), 0);
    return total / relevant.length;
  }

  /**
   * Clear all metrics
   */
  public clear(): void {
    this.metrics.clear();
    this.completedMetrics = [];
  }
}

// Export singleton instance
export const performance = Performance.getInstance();
