import { Component, Inject, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PageSeoService } from './core/seo/page-seo.service';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter, map, mergeMap } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { LanguageService } from './core/shared/services/language.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private seo = inject(PageSeoService);

  private readonly siteOrigin = 'https://almotammem.com';

  constructor(
    @Inject(PLATFORM_ID) private pid: Object,
    private language: LanguageService
  ) { }

  ngOnInit() {
    this.router.events
      .pipe(
        filter((e) => e instanceof NavigationEnd),
        map(() => this.route),
        map((r) => {
          while (r.firstChild) r = r.firstChild;
          return r;
        }),
        mergeMap((r) => r.data),
        map((data) => data?.['seo'] ?? {})
      )
      .subscribe((seoData: any) => {
        // ✅ canonical auto (حتى لو مش متحدد)
        const path = this.router.url.split('?')[0].split('#')[0];

        const canonical = seoData.canonical ?? `${this.siteOrigin}${path}`;

        // ✅ title fallback لو route مش محدده
        // (لو عندك TitleStrategy هتشتغل طبيعي برضو)
        const title = seoData.title ?? 'المتمم';

        this.seo.apply({
          title,
          description: seoData.description,
          image: seoData.image,
          canonical,
          type: seoData.type ?? 'website',
          jsonld: seoData.jsonld,
          robots: seoData.robots ?? 'index, follow'
        });
      });

    this.language.init();
  }
}
