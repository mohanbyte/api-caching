import { Injectable, inject } from '@angular/core';
import {
  HttpInterceptorFn,
  HttpRequest,
  HttpEvent,
  HttpResponse,
  HttpHandlerFn,
} from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CacheService } from './cache.service';
import { canCacheRequest } from './cache.utils';

@Injectable({ providedIn: 'root' })
class CachingInterceptorDeps {
  constructor(public cacheService: CacheService) {}
}

export const cachingInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const deps = inject(CachingInterceptorDeps);
  console.log('interceptor');

  if (updateCache(req, deps.cacheService)) return next(req);

  const cacheKey = createCacheKey(req.urlWithParams, req.body);
  const cachedResponse = deps.cacheService.getCache(cacheKey);
  console.log(cacheKey);

  if (cachedResponse) {
    return of(cachedResponse);
  }

  return next(req).pipe(
    tap((event) => {
      if (event instanceof HttpResponse) {
        if (canCacheRequest(req)) deps.cacheService.setCache(cacheKey, event);
      }
    })
  );
};

function updateCache(
  req: HttpRequest<unknown>,
  cacheService: CacheService
): boolean {
  if (req.method === 'DELETE' || req.method === 'POST') {
    if (req.url.includes('/api/account/devices'))
      cacheService.deleteCache(generateDeleteURL('/api/account/devices'));
    return true;
  }
  return false;
}

function createCacheKey(url: string, body: any): string {
  const bodyHash = simpleHash(JSON.stringify(body)).toString();
  return `${url}_${bodyHash}`;
}

function simpleHash(str: string): string {
  let hash = 0;
  if (str.length === 0) return hash.toString();
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash.toString();
}

function generateDeleteURL(key: any): string {
  const url = `https://jsonplaceholder.typicode.com/todos/${key}`;
  return createCacheKey(url, null);
}
