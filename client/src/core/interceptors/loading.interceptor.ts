import { HttpEvent, HttpInterceptorFn, HttpParams } from "@angular/common/http";
import { inject } from "@angular/core";
import { BusyService } from "@services/busy.service";
import { delay, finalize, of, tap } from "rxjs";

const cache = new Map<string, HttpEvent<unknown>>();

export const loadingInterceptor: HttpInterceptorFn = (request, next) => {
  const busyService = inject(BusyService);

  const generateCacheKey = (url: string, params: HttpParams): string => {
    const paramString = params
      .keys()
      .map(key => `${key}=${params.get(key)}`)
      .join("&");

    return paramString ? `${url}?${paramString}` : url;
  };

  const invalidateCache = (urlPattern: string) => {
    for (const key of cache.keys()) {
      if (key.includes(urlPattern)) {
        cache.delete(key);
        console.log(`Cache invalidated for: ${key}`);
      }
    }
  };

  const cacheKey = generateCacheKey(request.url, request.params);

  if (request.method.includes("POST") && request.url.includes("/likes")) {
    invalidateCache("/likes");
  }

  if (request.method === "GET") {
    const cachedRequest = cache.get(cacheKey);

    if (cachedRequest) {
      return of(cachedRequest);
    }
  }

  busyService.busy();

  return next(request).pipe(
    delay(500),
    tap(response => {
      cache.set(cacheKey, response);
    }),
    finalize(() => {
      busyService.idle();
    }),
  );
};
