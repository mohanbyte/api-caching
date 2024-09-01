import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CacheService {
  private cache = new Map<string, any>();

  constructor() {}

  setCache(key: string, data: any) {
    this.cache.set(key, { data, timestamp: new Date().getTime() });
  }

  getCache(key: string): any {
    const cacheEntry = this.cache.get(key);
    if (cacheEntry) {
      console.log(key, 'cache');
      const { data, timestamp } = cacheEntry;
      const currentTime = new Date().getTime();
      if (currentTime - timestamp < 90000) {
        return data;
      } else {
        this.cache.delete(key); // Invalidate expired cache
      }
    }
    return null;
  }
  deleteCache(key: string) {
    this.cache.delete(key);
  }
}
