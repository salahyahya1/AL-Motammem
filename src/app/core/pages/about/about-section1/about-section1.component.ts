// import { isPlatformBrowser } from '@angular/common';
// import {
//   Component,
//   ElementRef,
//   Inject,
//   NgZone,
//   OnDestroy,
//   PLATFORM_ID,
//   ViewChild
// } from '@angular/core';
// import ScrollTrigger from 'gsap/ScrollTrigger';
// import gsap from 'gsap';
// import SplitText from 'gsap/SplitText';
// import { TranslatePipe } from '@ngx-translate/core';
// import { LanguageService } from '../../../shared/services/language.service';

// gsap.registerPlugin(SplitText, ScrollTrigger);

// @Component({
//   selector: 'app-about-section1',
//   imports: [TranslatePipe],
//   templateUrl: './about-section1.component.html',
//   styleUrl: './about-section1.component.scss'
// })
// export class AboutSection1Component implements OnDestroy {
//   private readonly isBrowser: boolean;

//   constructor(
//     @Inject(PLATFORM_ID) platformId: Object,
//     private ngZone: NgZone,
//     private language: LanguageService,
//   ) {
//     this.isBrowser = isPlatformBrowser(platformId);
//   }

//   @ViewChild('aboutVedio', { static: false })
//   aboutVedio?: ElementRef<HTMLVideoElement>;

//   timeline!: gsap.core.Timeline;
//   Section1_title_split: any;

//   private onCanPlay = () => this.safePlayVideo();

//   ngAfterViewInit() {
//     if (!this.isBrowser) return;

//     requestAnimationFrame(() => {
//       this.ngZone.runOutsideAngular(() => {
//         setTimeout(() => {
//           this.setupVideoAutoplayFix();  // ✅ مهم للرفرش + الموبايل
//           this.runGsapAnimation();
//         }, 100);
//       });
//     });
//   }

//   private setupVideoAutoplayFix() {
//     const v = this.aboutVedio?.nativeElement;
//     if (!v) return;

//     // ✅ شروط autoplay على iOS/Chrome
//     v.muted = true;
//     v.playsInline = true;
//     v.setAttribute('playsinline', '');
//     v.setAttribute('webkit-playsinline', '');

//     v.addEventListener('canplay', this.onCanPlay, { once: true });

//     // يساعد بعد refresh/SSR hydration
//     v.load();
//     this.safePlayVideo();
//   }

//   private safePlayVideo() {
//     const v = this.aboutVedio?.nativeElement;
//     if (!v) return;

//     const p = v.play();
//     if (p) {
//       p.catch((err) => {
//         console.warn('Autoplay blocked/failed:', err);
//       });
//     }
//   }

//   private runGsapAnimation() {
//     if (!this.isBrowser) return;

//     document.fonts.ready.then(() => {
//       const videoEl = document.querySelector('#About-Section1-vedio') as HTMLElement;
//       const titleEl = document.querySelector('#About-Section1-title') as HTMLElement;

//       if (!titleEl || !videoEl) {
//         console.warn('⚠️ عناصر الـ hero مش لاقيها');
//         return;
//       }

//       requestAnimationFrame(() => {
//         gsap.set(titleEl, { opacity: 1, visibility: 'visible' });
//         gsap.set(videoEl, { opacity: 1, visibility: 'visible' });

//         const tl = gsap.timeline();

//         tl.from(titleEl, {
//           duration: 1,
//           yPercent: 100,
//           opacity: 0,
//           ease: 'expo.out',
//           stagger: 0.08,
//         });

//         tl.from(videoEl, {
//           opacity: 0,
//           y: -100,
//           duration: 0.2,
//           ease: 'sine.out',
//         }, '<');

//         this.timeline = tl;
//         this.Section1_title_split = titleEl;
//       });
//     });
//   }

//   ngOnDestroy(): void {
//     // ✅ SSR guard
//     if (!this.isBrowser) return;

//     this.timeline?.kill();
//     this.Section1_title_split = null;

//     const v: any = this.aboutVedio?.nativeElement;
//     if (v && typeof v.pause === 'function') {
//       v.pause();
//       v.removeEventListener?.('canplay', this.onCanPlay);
//     }
//   }
// }
import { isPlatformBrowser } from '@angular/common';
import {
  Component,
  ElementRef,
  Inject,
  NgZone,
  OnDestroy,
  PLATFORM_ID,
  ViewChild
} from '@angular/core';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import SplitText from 'gsap/SplitText';
import { TranslatePipe } from '@ngx-translate/core';
import { LanguageService } from '../../../shared/services/language.service';

gsap.registerPlugin(SplitText, ScrollTrigger);

@Component({
  selector: 'app-about-section1',
  imports: [TranslatePipe],
  templateUrl: './about-section1.component.html',
  styleUrl: './about-section1.component.scss'
})
export class AboutSection1Component implements OnDestroy {
  private readonly isBrowser: boolean;

  constructor(
    @Inject(PLATFORM_ID) platformId: Object,
    private ngZone: NgZone,
    private language: LanguageService,
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  @ViewChild('aboutVedio', { static: false })
  aboutVedio?: ElementRef<HTMLVideoElement>;

  timeline?: gsap.core.Timeline;
  private onCanPlay = () => this.safePlayVideo();

  ngAfterViewInit() {
    if (!this.isBrowser) return;

    this.ngZone.runOutsideAngular(() => {
      requestAnimationFrame(() => {
        // ✅ شغل الفيديو/اظهره فورًا (بدون انتظار fonts)
        this.setupVideoAutoplayFix();

        // ✅ أنيميشن العنوان (ممكن يستنى fonts لو محتاج)
        this.runGsapAnimation();
      });
    });
  }

  private setupVideoAutoplayFix() {
    const v = this.aboutVedio?.nativeElement;
    if (!v) return;

    // شروط autoplay على iOS/Chrome
    v.muted = true;
    v.playsInline = true;
    v.setAttribute('playsinline', '');
    v.setAttribute('webkit-playsinline', '');

    // ✅ حاول تشغله فورًا
    this.safePlayVideo();

    // ✅ لو احتاج buffering
    v.addEventListener('canplay', this.onCanPlay, { once: true });
  }

  private safePlayVideo() {
    const v = this.aboutVedio?.nativeElement;
    if (!v) return;

    const p = v.play();
    if (p) p.catch(() => { });
  }

  private runGsapAnimation() {
    if (!this.isBrowser) return;

    const videoWrap = document.querySelector('#About-Section1-vedio') as HTMLElement | null;
    const titleEl = document.querySelector('#About-Section1-title') as HTMLElement | null;

    // ✅ الفيديو يظهر فورًا (حتى لو الفونتات بتتأخر)
    if (videoWrap) gsap.set(videoWrap, { opacity: 1, visibility: 'visible' });

    document.fonts.ready.then(() => {
      if (!titleEl) return;

      requestAnimationFrame(() => {
        gsap.set(titleEl, { opacity: 1, visibility: 'visible' });

        const tl = gsap.timeline();

        tl.from(titleEl, {
          duration: 0.6,
          yPercent: 100,
          opacity: 0,
          ease: 'expo.out',
        });

        if (videoWrap) {
          tl.from(videoWrap, { opacity: 0, y: -60, duration: 0.3, ease: 'sine.out' }, '<');
        }

        this.timeline = tl;
      });
    });
  }

  ngOnDestroy(): void {
    if (!this.isBrowser) return;

    this.timeline?.kill();

    const v = this.aboutVedio?.nativeElement;
    if (v) {
      v.pause();
      v.removeEventListener('canplay', this.onCanPlay);
    }

    ScrollTrigger.getAll().forEach(t => t.kill());
  }
}
