import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class AnimationLoaderService {
  private platformId = inject(PLATFORM_ID);

  private gsapPromise: Promise<any> | null = null;
  private splitTextCtor: any | null = null;

  isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  /**
   * تحميل gsap + SplitText كسول، مع كاش داخلي
   */
  async loadGsapWithSplitText(): Promise<{ gsap: any; SplitText: any } | null> {
    if (!this.isBrowser()) {
      return null;
    }

    if (!this.gsapPromise) {
      this.gsapPromise = import('gsap').then((m) => m.gsap);
    }

    const gsap = await this.gsapPromise;

    if (!this.splitTextCtor) {
      const splitModule = await import('gsap/SplitText');
      this.splitTextCtor = splitModule.SplitText;
      gsap.registerPlugin(this.splitTextCtor);
    }

    return { gsap, SplitText: this.splitTextCtor };
  }
}
