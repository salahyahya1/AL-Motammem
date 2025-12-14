import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-terms-plicy',
  imports: [TranslatePipe],
  templateUrl: './terms-plicy.component.html',
  styleUrl: './terms-plicy.component.scss'
})
export class TermsPlicyComponent {
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
