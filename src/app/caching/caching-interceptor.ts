import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpResponse,
} from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CacheService } from './cache.service';
import { canCacheRequest } from './cache.utils';
@Injectable()
export class CachingInterceptor implements HttpInterceptor {
  constructor(private cacheService: CacheService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<any> {
    if (req.method == 'DELETE' || req.method == 'POST') {
      if (req.url.includes('/api/account/devices'))
        this.cacheService.deleteCache(
          this.generateDeleteURL('/api/account/devices')
        );
      else if (req.url.includes('/api/account/load-entities-gen')) {
        this.cacheService.deleteCache(
          this.generateDeleteURL('/api/account/load-entities-gen')
        ); //Generated Hash will always be same.
      }
      return next.handle(req);
    }
    const cacheKey = this.createCacheKey(req.urlWithParams, req.body);
    const cachedResponse = this.cacheService.getCache(cacheKey);
    console.log(cacheKey);
    if (cachedResponse) {
      return of(cachedResponse);
    }

    return next.handle(req).pipe(
      tap((event) => {
        if (event instanceof HttpResponse) {
          if (canCacheRequest(req)) this.cacheService.setCache(cacheKey, event);
        }
      })
    );
  }
  private createCacheKey(url: string, body: any): string {
    const bodyHash = this.simpleHash(JSON.stringify(body)).toString(); // with hash we can do it with only small key

    return `${url}_${bodyHash}`;
  }

  /** */
  private simpleHash(str: string): string {
    let hash = 0;
    if (str.length === 0) return hash.toString();
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return hash.toString();
  }
  private generateDeleteURL(key: any) {
    const url = `https://jsonplaceholder.typicode.com/todos/${key}`;
    const genKey = this.createCacheKey(url, null);
    return genKey;
  }
}
