/**
 * Network Monitor
 * Monitors network connectivity status
 *
 * Features:
 * - Real-time network status
 * - Connection type detection
 * - Event-based notifications
 */

import NetInfo, { NetInfoState } from '@react-native-community/netinfo';

export type NetworkStatus = 'online' | 'offline' | 'unknown';
export type ConnectionType = 'wifi' | 'cellular' | 'none' | 'unknown';

export interface NetworkState {
  status: NetworkStatus;
  type: ConnectionType;
  isInternetReachable: boolean | null;
}

type NetworkChangeCallback = (state: NetworkState) => void;

export class NetworkMonitor {
  private static instance: NetworkMonitor;
  private currentState: NetworkState = {
    status: 'unknown',
    type: 'unknown',
    isInternetReachable: null,
  };
  private listeners: Set<NetworkChangeCallback> = new Set();
  private unsubscribe: (() => void) | null = null;

  private constructor() {
    this.initialize();
  }

  /**
   * Get singleton instance
   */
  public static getInstance(): NetworkMonitor {
    if (!NetworkMonitor.instance) {
      NetworkMonitor.instance = new NetworkMonitor();
    }
    return NetworkMonitor.instance;
  }

  /**
   * Initialize network monitoring
   */
  private initialize(): void {
    this.unsubscribe = NetInfo.addEventListener((state: NetInfoState) => {
      this.handleNetworkChange(state);
    });

    // Get initial state
    NetInfo.fetch().then((state) => {
      this.handleNetworkChange(state);
    });
  }

  /**
   * Handle network state changes
   */
  private handleNetworkChange(state: NetInfoState): void {
    const newState: NetworkState = {
      status: state.isConnected ? 'online' : 'offline',
      type: this.mapConnectionType(state.type),
      isInternetReachable: state.isInternetReachable,
    };

    // Only notify if state changed
    if (
      newState.status !== this.currentState.status ||
      newState.type !== this.currentState.type
    ) {
      this.currentState = newState;
      this.notifyListeners(newState);
      console.log('[NetworkMonitor] State changed:', newState);
    }
  }

  /**
   * Map NetInfo connection type to our type
   */
  private mapConnectionType(type: string): ConnectionType {
    switch (type) {
      case 'wifi':
        return 'wifi';
      case 'cellular':
        return 'cellular';
      case 'none':
        return 'none';
      default:
        return 'unknown';
    }
  }

  /**
   * Notify all listeners
   */
  private notifyListeners(state: NetworkState): void {
    this.listeners.forEach((callback) => callback(state));
  }

  /**
   * Get current network state
   */
  public getState(): NetworkState {
    return { ...this.currentState };
  }

  /**
   * Check if online
   */
  public isOnline(): boolean {
    return this.currentState.status === 'online';
  }

  /**
   * Check if offline
   */
  public isOffline(): boolean {
    return this.currentState.status === 'offline';
  }

  /**
   * Subscribe to network changes
   */
  public subscribe(callback: NetworkChangeCallback): () => void {
    this.listeners.add(callback);

    // Return unsubscribe function
    return () => {
      this.listeners.delete(callback);
    };
  }

  /**
   * Cleanup
   */
  public destroy(): void {
    if (this.unsubscribe) {
      this.unsubscribe();
      this.unsubscribe = null;
    }
    this.listeners.clear();
  }
}

// Export singleton instance
export const networkMonitor = NetworkMonitor.getInstance();
