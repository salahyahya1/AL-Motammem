import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SeoService } from './core/seo/seo.service';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { Title } from '@angular/platform-browser';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID, Inject } from '@angular/core';
import { LanguageService } from './core/shared/services/language.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private seo = inject(SeoService);
  private title = inject(Title);
  constructor(@Inject(PLATFORM_ID) private pid: Object, private language: LanguageService) { }

  ngOnInit() {
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd),
      map(() => {
        let r = this.route;
        while (r.firstChild) r = r.firstChild;
        return r.snapshot.data?.['seo'] ?? {};
      })
    ).subscribe((seo) => {
      this.seo.set({
        title: isPlatformBrowser(this.pid) ? this.title.getTitle() : seo.title,
        description: seo.description,
        image: seo.image,
        canonical: seo.canonical,
        jsonld: seo.jsonld
      });
    });
    this.language.init();
  }
}
