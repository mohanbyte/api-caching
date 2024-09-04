import { HttpRequest } from '@angular/common/http';
//https:iosense.io
type CachePattern = {
  urlPattern: RegExp;
};
// Object of cache patterns
const CACHE_PATTERNS: { [method: string]: CachePattern[] } = {
  GET: [
    { urlPattern: /^https?:\/\/[^\/]+\/todos$/ },
    { urlPattern: /^\/api\/account\/devices$/ },
    { urlPattern: /^\/api\/account\/load-entities$/ },
    { urlPattern: /^\/api\/account\/load-entities-gen$/ },
    // Add more GET patterns here
  ],
  PUT: [
    //{ urlPattern: /^\/api\/account\/devices$/ },
    // { urlPattern: /^\/api\/account\/devices\/\d+\/\d+$/ },
    // Add more PUT patterns here
  ],
  // Add more HTTP methods and their patterns as needed
};
export const DELETE_PATTERNS = {
  '/api/account/load-entities-gen': true,
  '/api/account/devices': true,
  '/api/account/load-entities': true,
};
// Array of URLs that should never be cached
const NEVER_CACHE_PATTERNS: RegExp[] = [
  /^\/api\/account\/devices\/generateOTP$/,
  // Add more patterns as needed
];
export function canCacheRequest(req: HttpRequest<any>): boolean {
  const urlWithoutHost = req.url.split(window.origin)[1];

  // Check if the request should never be cached
  if (NEVER_CACHE_PATTERNS.some((pattern) => pattern.test(urlWithoutHost))) {
    return false;
  }

  // Check if the request matches any of our cache patterns
  const methodPatterns = CACHE_PATTERNS[req.method];
  if (methodPatterns) {
    const matchedPattern = methodPatterns.find((pattern) =>
      pattern.urlPattern.test(urlWithoutHost)
    );
    if (matchedPattern) {
      console.log(`${matchedPattern.urlPattern.source} matched URL`);
      return true;
    }
  }
  return true;
}
