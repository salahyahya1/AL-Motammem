import { APP_INITIALIZER, ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withInMemoryScrolling, withRouterConfig } from '@angular/router';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, provideHttpClient, withFetch, withInterceptorsFromDi } from '@angular/common/http';

import { routes } from './app.routes';
import {
  provideTranslateService,
  TranslateService,
} from '@ngx-translate/core';
import {
  provideTranslateHttpLoader,
} from '@ngx-translate/http-loader';
import { firstValueFrom } from 'rxjs';
import { BaseUrlInterceptor } from './core/auth/Interceptor/auth-interceptor';
export function provideHydrationIfDesktop() {
  if (typeof window === 'undefined') return [];
  return window.matchMedia('(min-width: 700px)').matches
    ? [provideClientHydration(withEventReplay())]
    : [];
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(
      routes,
      // withPreloading(PreloadAllModules),
      withInMemoryScrolling({
        scrollPositionRestoration: 'enabled',
        anchorScrolling: 'disabled',
      }),
      withRouterConfig({ onSameUrlNavigation: 'reload' })
    ),
    // provideClientHydration(withEventReplay()),
    // provideClientHydration(),
    provideHttpClient(withFetch()),
    provideTranslateService({
      loader: provideTranslateHttpLoader({
        prefix: '/i18n/',   // لأنك حاططها جوّه public/i18n
        suffix: '.json',
      }),
      // fallbackLang: 'ar',    // بدل defaultLanguage/useDefaultLang
    }),
    {
      provide: APP_INITIALIZER,
      useFactory: initI18n,
      deps: [TranslateService],
      multi: true,
    },
    provideHttpClient(withInterceptorsFromDi()),
    { provide: HTTP_INTERCEPTORS, useClass: BaseUrlInterceptor, multi: true },
  ]
};
export function initI18n(translate: TranslateService) {
  return () => {
    const lang = 'ar';
    translate.setDefaultLang(lang);

    const isMobile = typeof window !== 'undefined' && window.matchMedia("(max-width: 699px)").matches;

    if (isMobile) {
      // ✅ موبايل: خليه يضمن أول paint بالنص النهائي
      return firstValueFrom(translate.use(lang));
    }

    // ✅ ديسكتوب: non-blocking
    translate.use(lang).subscribe({ error: e => console.warn('i18n load failed', e) });
    return;
  };
}
