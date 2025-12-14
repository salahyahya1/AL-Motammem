import { ApplicationRef, Component, Inject, NgZone, PLATFORM_ID } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { LanguageService } from '../../shared/services/language.service';
import { isPlatformBrowser } from '@angular/common';
// import { LanguageService } from '../../shared/services/language.service';

@Component({
  selector: 'app-privacy-plicy',
  imports: [TranslatePipe],
  templateUrl: './privacy-plicy.component.html',
  styleUrl: './privacy-plicy.component.scss'
})
export class PrivacyPlicyComponent {
    private isBrowser: boolean;
    Lang!: 'ar' | 'en';
 constructor(
    @Inject(PLATFORM_ID) platformId: Object,
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    if (!this.isBrowser) return;
    const saved = localStorage?.getItem('lang') as 'ar' | 'en' | null;
    if (saved === 'ar' || saved === 'en') {
      this.Lang = saved;
    }
  }
}
