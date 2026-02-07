import { Component, Inject, inject, Input, PLATFORM_ID } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateDirective, TranslatePipe } from '@ngx-translate/core';
import { LanguageService } from '../../shared/services/language.service';
import { Subject } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-footer',
  imports: [RouterLink, TranslatePipe],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  @Input() phone = '201016889890';

  // الرسالة الجاهزة
  @Input() message = 'مرحبًا، أريد الاستفسار عن خدماتكم.';

  get link(): string {
    return `https://wa.me/${this.phone}?text=${encodeURIComponent(this.message)}`;
  }
  open() {
    window.open(this.link, '_blank', 'noopener,noreferrer');
  }

  @Input() menuOpen = false;

  private isBrowser: boolean;
  private destroy$ = new Subject<void>();
  currentLang: 'ar' | 'en' = 'ar';

  constructor(
    @Inject(PLATFORM_ID) platformId: Object,
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    if (!this.isBrowser) return;
    const saved = localStorage?.getItem('lang') as 'ar' | 'en' | null;
    if (saved === 'ar' || saved === 'en') {
      this.currentLang = saved;
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private language = inject(LanguageService);

  setLang(lang: 'en' | 'ar') {
    this.currentLang = lang;
    this.language.switchLang(lang);
  }

}
