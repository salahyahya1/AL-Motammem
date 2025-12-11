import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  constructor(
    private translate: TranslateService,
    @Inject(PLATFORM_ID) private pid: Object
  ) {
    this.translate.addLangs(['en', 'ar']);
    this.translate.setFallbackLang('ar');
  }

  /** تتنده مرة واحدة في AppComponent عشان تظبط اللغة عند أول لود */
  init() {
    let lang: 'en' | 'ar' = 'ar';

    if (isPlatformBrowser(this.pid)) {
      const saved = localStorage.getItem('lang') as 'en' | 'ar' | null;
      if (saved === 'en' || saved === 'ar') {
        lang = saved;
      } else {
        localStorage.setItem('lang', lang);
      }

      const html = document.documentElement;
      html.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
      html.setAttribute('lang', lang);             // 👈 أهم سطر عشان Lighthouse
    }

    this.translate.use(lang);
  }

  /** دي هي الفنكشن الشيرد اللي أي حد يقدر يستعملها */
  switchLang(lang: 'en' | 'ar') {
    this.translate.use(lang);

    if (isPlatformBrowser(this.pid)) {
      localStorage.setItem('lang', lang);

      const html = document.documentElement;
      html.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
      html.setAttribute('lang', lang);             // 👈 برضه هنا

      window.location.reload();
    }
  }

  get currentLang(): 'en' | 'ar' {
    return (this.translate.currentLang as 'en' | 'ar') || 'ar';
  }
}
