import NetInfo, { NetInfoState, NetInfoSubscription } from '@react-native-community/netinfo';

type NetworkListener = (isConnected: boolean) => void;

class NetworkService {
    private static instance: NetworkService;
    private listeners = new Set<NetworkListener>();
    private isConnected: boolean = true;
    private unsubscribe: NetInfoSubscription | null = null;

    private constructor() {
        this.initialize();
    }

    static getInstance(): NetworkService {
        if (!NetworkService.instance) {
            NetworkService.instance = new NetworkService();
        }
        return NetworkService.instance;
    }

    private initialize() {
        this.unsubscribe = NetInfo.addEventListener((state: NetInfoState) => {
            const connected = state.isConnected ?? false;
            // On Android, isConnected can be true but internetReachable false
            // However, we want to block primarily on total disconnection
            const reachable = state.isInternetReachable ?? true;

            const newStatus = connected && reachable;

            if (this.isConnected !== newStatus) {
                this.isConnected = newStatus;
                this.notifyListeners();
            }
        });
    }

    public async checkConnection(): Promise<boolean> {
        const state = await NetInfo.fetch();
        const connected = state.isConnected ?? false;
        const reachable = state.isInternetReachable ?? true;

        const status = connected && reachable;

        if (this.isConnected !== status) {
            this.isConnected = status;
            this.notifyListeners();
        }

        return status;
    }

    public subscribe(listener: NetworkListener): () => void {
        this.listeners.add(listener);
        // Trigger immediately with current state
        listener(this.isConnected);

        return () => {
            this.listeners.delete(listener);
        };
    }

    private notifyListeners() {
        this.listeners.forEach(listener => listener(this.isConnected));
    }

    public destroy() {
        if (this.unsubscribe) {
            this.unsubscribe();
            this.unsubscribe = null;
        }
        this.listeners.clear();
    }
}

export const networkService = NetworkService.getInstance();
