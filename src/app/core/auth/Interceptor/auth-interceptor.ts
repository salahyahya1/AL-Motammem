// import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
// import { isPlatformBrowser } from '@angular/common';
// import {
//     HttpEvent,
//     HttpHandler,
//     HttpInterceptor,
//     HttpRequest
// } from '@angular/common/http';
// import { Observable } from 'rxjs';
// import { environment } from '../../../../../FrontendEnv';

// @Injectable()
// export class BaseUrlInterceptor implements HttpInterceptor {
//     constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

//     intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
//         // 1) Skip absolute URLs (but still attach token if in browser)
//         if (/^https?:\/\//i.test(req.url)) {
//             return next.handle(this.attachTokenIfExists(req));
//         }

//         // 2) Only handle api routes
//         if (!req.url.startsWith('api/') && !req.url.startsWith('/api/')) {
//             return next.handle(this.attachTokenIfExists(req));
//         }

//         const base = environment.apiBaseUrl.replace(/\/+$/, '');
//         const path = req.url.replace(/^\/+/, '');
//         const updatedReq = req.clone({
//             url: `${base}/${path}`,
//             setHeaders: { Accept: 'application/json' },
//         });

//         return next.handle(this.attachTokenIfExists(updatedReq));
//     }

//     private attachTokenIfExists(req: HttpRequest<any>): HttpRequest<any> {
//         // SSR guard
//         if (!isPlatformBrowser(this.platformId)) return req;

//         const token = localStorage.getItem('token');
//         if (!token) return req;

//         if (req.headers.has('Authorization')) return req;

//         return req.clone({
//             setHeaders: { Authorization: `Bearer ${token}` },
//         });
//     }
// }
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../FrontendEnv';

@Injectable()
export class BaseUrlInterceptor implements HttpInterceptor {
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // 1) Skip absolute URLs (but still attach token if in browser)
    if (/^https?:\/\//i.test(req.url)) {
      return next.handle(this.attachTokenIfExists(req));
    }

    // 2) Only handle api routes
    const isApi = req.url.startsWith('api/') || req.url.startsWith('/api/');
    if (!isApi) {
      return next.handle(this.attachTokenIfExists(req));
    }

    // normalize path => always starts with "/"
    const path = req.url.startsWith('/') ? req.url : `/${req.url}`;

    // 3) Browser: keep relative (same domain) + add Accept
    if (isPlatformBrowser(this.platformId)) {
      const browserReq = req.clone({
        url: path,
        setHeaders: { Accept: 'application/json' },
      });
      return next.handle(this.attachTokenIfExists(browserReq));
    }

    // 4) SSR: must be absolute
    const base =
      (environment.apiBaseUrl?.trim() ? environment.apiBaseUrl : 'https://almotammem.com')
        .replace(/\/+$/, '');

    const ssrReq = req.clone({
      url: `${base}${path}`,
      setHeaders: { Accept: 'application/json' },
    });

    return next.handle(this.attachTokenIfExists(ssrReq));
  }

  private attachTokenIfExists(req: HttpRequest<any>): HttpRequest<any> {
    // SSR guard (token من localStorage browser فقط)
    if (!isPlatformBrowser(this.platformId)) return req;

    const token = localStorage.getItem('token');
    if (!token) return req;

    if (req.headers.has('Authorization')) return req;

    return req.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    });
  }
}
