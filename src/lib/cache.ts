// Simple localStorage cache for app data
export interface CacheItem<T> {
  data: T;
  timestamp: number;
  expiry: number;
}

export class AppCache {
  private static getKey(key: string): string {
    return `bridgepay_${key}`;
  }

  static set<T>(key: string, data: T, expiryMinutes: number = 5): void {
    try {
      const cacheKey = this.getKey(key);
      const item: CacheItem<T> = {
        data,
        timestamp: Date.now(),
        expiry: Date.now() + (expiryMinutes * 60 * 1000),
      };
      localStorage.setItem(cacheKey, JSON.stringify(item));
    } catch (error) {
      console.warn('Failed to set cache:', error);
    }
  }

  static get<T>(key: string): T | null {
    try {
      const cacheKey = this.getKey(key);
      const cached = localStorage.getItem(cacheKey);
      
      if (!cached) return null;
      
      const item: CacheItem<T> = JSON.parse(cached);
      
      // Check if expired
      if (Date.now() > item.expiry) {
        this.remove(key);
        return null;
      }
      
      return item.data;
    } catch (error) {
      console.warn('Failed to get cache:', error);
      return null;
    }
  }

  static remove(key: string): void {
    try {
      const cacheKey = this.getKey(key);
      localStorage.removeItem(cacheKey);
    } catch (error) {
      console.warn('Failed to remove cache:', error);
    }
  }

  static clear(): void {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith('bridgepay_')) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.warn('Failed to clear cache:', error);
    }
  }

  static isExpired(key: string): boolean {
    try {
      const cacheKey = this.getKey(key);
      const cached = localStorage.getItem(cacheKey);
      
      if (!cached) return true;
      
      const item: CacheItem<any> = JSON.parse(cached);
      return Date.now() > item.expiry;
    } catch (error) {
      return true;
    }
  }
}