export interface TokenStorageService {
    saveTokens(accessToken: string, refreshToken: string, userId: string): Promise<void>;
    getTokens(): Promise<{ accessToken: string | null; refreshToken: string | null; userId: string | null }>;
    clearTokens(): Promise<void>;
}