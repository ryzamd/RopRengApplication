export enum AppLifecycleEvent {
    FOREGROUND = 'FOREGROUND',
    BACKGROUND = 'BACKGROUND',
    INACTIVE = 'INACTIVE',
}

export enum ServicePriority {
    CRITICAL = 0,
    HIGH = 10,
    MEDIUM = 20,
    LOW = 30,
    DEFERRED = 40,
}

export interface IServiceMetadata {
    readonly name: string;
    readonly priority: ServicePriority;
    readonly runOnForeground: boolean;
}

export interface IBackgroundService {
    readonly metadata: IServiceMetadata;
    startup(): Promise<void>;
    onForeground?(): Promise<void>;
    onBackground?(): Promise<void>;
    cleanup?(): Promise<void>;
}
