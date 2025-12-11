import { isPlatformBrowser } from '@angular/common';
import {
  Component,
  ElementRef,
  Inject,
  NgZone,
  OnDestroy,
  PLATFORM_ID,
  ViewChild,
} from '@angular/core';

import { AnimatedSequenceComponent } from '../../../shared/animated-sequence/animated-sequence.component';
import { RouterLink } from '@angular/router';
import { LangChangeEvent, TranslatePipe, TranslateService } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';
import { AnimationLoaderService } from '../../../shared/services/animation-loader.service';
import { RemiveRoleAriaService } from '../../../shared/services/removeRoleAria';



@Component({
  selector: 'app-section1',
  templateUrl: './section1.component.html',
  styleUrl: './section1.component.scss',
  standalone: true,
  imports: [AnimatedSequenceComponent, RouterLink,TranslatePipe],
})
export class Section1Component implements OnDestroy {
  @ViewChild(AnimatedSequenceComponent) seq!: AnimatedSequenceComponent;
@ViewChild('heroVideo') heroVideo?: ElementRef<HTMLVideoElement>;

  spriteReady = false; 
  private destroy$ = new Subject<void>();
isSequenceReady: boolean = false;
  timeline!: gsap.core.Timeline;
  heroTitleSplit: any;
  heroSubtitleSplit: any;
  heroDetailsSplit: any;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private ngZone: NgZone,
    private translate: TranslateService,
        private animationLoader: AnimationLoaderService,
        private RemiveRoleAriaService: RemiveRoleAriaService,
  ) {
    this.translate.onLangChange
      .pipe(takeUntil(this.destroy$))
      .subscribe((e: LangChangeEvent) => {
        this.revertSplits();
        setTimeout(() => {
          this.runGsapAnimation();
        }, 0);
      });
  }

  ngAfterViewInit() {
    if (typeof window === 'undefined') return;
    if (!isPlatformBrowser(this.platformId)) return;
  // requestIdleCallback(() => this.isSequenceReady = true);
//   requestIdleCallback(() => {
//   this.ngZone.run(() => {
//     this.isSequenceReady = true;
//   });
// });
 this.ngZone.runOutsideAngular(() => {
    requestIdleCallback(() => {
      this.waitForLCPThenInit();   // يشغّل الـ sprite في الخلفية لما نسمح
      // this.runGsapAnimation();     // SplitText + timeline
    });
     requestIdleCallback(() => {
      setTimeout(() => {
        this.runGsapAnimation();
      }, 150); // جرّب بين 100–200ms
    });
  });

  
    // this.ngZone.runOutsideAngular(() => {
    //   setTimeout(() => {
    //  this.waitForLCPThenInit();
    //     this.runGsapAnimation();
    //   }, 500);
    // });
  }

  // private setHeroTexts() {
  //   const heroTitle = document.querySelector('#hero-title') as HTMLElement | null;
  //   const heroSubtitle = document.querySelector('#hero-subtitle') as HTMLElement | null;
  //   const heroDetails = document.querySelector('#hero-details') as HTMLElement | null;
  //   const button1 = document.querySelector('#button1') as HTMLElement | null;
  //   const button2 = document.querySelector('#button2') as HTMLElement | null;

  //   if (heroTitle) {
  //     heroTitle.textContent = this.translate.instant('HOME.HERO.TITLE');
  //   }
  //   if (heroSubtitle) {
  //     heroSubtitle.textContent = this.translate.instant('HOME.HERO.SUB-TITLE');
  //   }
  //   if (heroDetails) {
  //     heroDetails.textContent = this.translate.instant('HOME.HERO.DETAILS');
  //   }
  //   if (button1) {
  //     button1.textContent = this.translate.instant('HOME.HERO.BTN1');
  //   }
  //   if (button2) {
  //     button2.textContent = this.translate.instant('HOME.HERO.BTN2');
  //   }
  // }

  private runGsapAnimation() {
    if (!isPlatformBrowser(this.platformId)) return;

    // this.seq?.playForwardAnimation?.();

    (document as any).fonts.ready.then(async () => {
            const loaded = await this.animationLoader.loadGsapWithSplitText();
      if (!loaded) return;

      const { gsap, SplitText } = loaded;
      gsap.set('#hero', { willChange: 'transform, opacity' });
      this.revertSplits();

      const heroTitle = document.querySelector('h1#hero-title') as HTMLElement;
      const heroSubtitle = document.querySelector('#hero-subtitle') as HTMLElement;
      const heroDetails = document.querySelector('#hero-details') as HTMLElement;
      const button1 = document.querySelector('#button1') as HTMLElement;
      const button2 = document.querySelector('#button2') as HTMLElement;

      if (!heroTitle || !heroSubtitle || !heroDetails || !button1 || !button2) {
        console.warn('⚠️ عناصر الـ hero مش لاقيها SplitText');
        return;
      }
          gsap.set([heroTitle, heroSubtitle, heroDetails, button1, button2], {
      opacity: 0,
      visibility: 'visible',
    });

      this.heroTitleSplit = new SplitText(heroTitle, { type: 'words' });
      this.heroSubtitleSplit = new SplitText(heroSubtitle, { type: 'words' });
      this.heroDetailsSplit = new SplitText(heroDetails, { type: 'words' });
this.RemiveRoleAriaService.cleanA11y(heroSubtitle, this.heroSubtitleSplit);
this.RemiveRoleAriaService.cleanA11y(heroDetails, this.heroDetailsSplit);
      const tl = gsap.timeline();

      tl.fromTo(
        this.heroTitleSplit.words,
        { opacity: 0, visibility: 'visible' },
        {
          opacity: 1,
          duration: 0.4,
          ease: 'sine.out',
          stagger: 0.02,
          onStart: () => { gsap.set(heroTitle, { opacity: 1, visibility: 'visible' }) },
        }
      );

      tl.fromTo(
        this.heroSubtitleSplit.words,
        { opacity: 0, visibility: 'visible' },
        {
          opacity: 1,
          duration: 0.4,
          ease: 'sine.out',
          stagger: 0.02,
          onStart: () => { gsap.set(heroSubtitle, { opacity: 1, visibility: 'visible' }) },
        }
      );

      tl.fromTo(
        this.heroDetailsSplit.words,
        { opacity: 0, visibility: 'visible' },
        {
          opacity: 1,
          duration: 0.4,
          ease: 'sine.out',
          stagger: 0.02,
          onStart: () => { gsap.set(heroDetails, { opacity: 1, visibility: 'visible' }) },
        }
      );

      tl.fromTo(
        button1,
        { opacity: 0, visibility: 'visible' },
        {
          opacity: 1,
          duration: 0.5,
          ease: 'sine.inOut',
          onStart: () => { gsap.set(button1, { opacity: 1, visibility: 'visible' }) },
        }
      );

      tl.fromTo(
        button2,
        { opacity: 0, visibility: 'visible' },
        {
          opacity: 1,
          duration: 0.5,
          ease: 'sine.inOut',
          onStart: () => { gsap.set(button2, { opacity: 1, visibility: 'visible' }) },
        }
      );

      this.timeline = tl;
    });

    if (this.heroVideo && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        const v = this.heroVideo!.nativeElement;
        v.src = '/videos/gradient.webm';
        v.play().catch(() => {});
        io.disconnect();
      }
    }, { threshold: 0.2 });

    io.observe(this.heroVideo.nativeElement);
  }
  }

  private revertSplits() {
    this.heroTitleSplit?.revert();
    this.heroSubtitleSplit?.revert();
    this.heroDetailsSplit?.revert();
    this.heroTitleSplit = null;
    this.heroSubtitleSplit = null;
    this.heroDetailsSplit = null;
  }

  
private waitForLCPThenInit() {
  if (typeof window === 'undefined') return;

  // إذا PerformanceObserver متاح، استمع للـ LCP
  const win: any = window;
  if ('PerformanceObserver' in window) {
    const po = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const lcpEntry = entries[entries.length - 1];
      if (lcpEntry) {
        // بعد ما الLCP اتسجل، خلي الـ sequence يتشغل في الخلفية
        this.initAnimatedSequenceAfterIdle();
        po.disconnect();
      }
    });
    try {
      po.observe({ type: 'largest-contentful-paint', buffered: true });
      // safety timeout: لو ما حصلش LCP خلال 5s خلّيه يبدأ
      setTimeout(() => {
        try { po.disconnect(); } catch (e) {}
        // this.initAnimatedSequenceAfterIdle();
      }, 5000);
    } catch (e) {
      // fallback
      this.initAnimatedSequenceAfterIdle();
    }
  } else {
    // no PerformanceObserver -> fallback
    // setTimeout(() => this.initAnimatedSequenceAfterIdle(), 2000);
  }
}

// private initAnimatedSequenceAfterIdle() {
//   // نخرج من Angular zone علشان ما يسببش change detection ثقيلاً
//   this.ngZone.runOutsideAngular(() => {
//     // requestIdleCallback أفضل لو متوفر
//     const run = () => {
//       // show sequence and start it
//       const seqEl = document.getElementById('hero-seq');
//       if (seqEl) seqEl.classList.remove('hidden');
//       try { this.seq?.playForwardAnimation?.(); } catch (e) {}
//     };

//     if ('requestIdleCallback' in window) {
//       (window as any).requestIdleCallback(run, { timeout: 2000 });
//     } else {
//       setTimeout(run, 700);
//     }
//   });
// }
// private initAnimatedSequenceAfterIdle() {
//   this.ngZone.runOutsideAngular(() => {
//     const run = () => {
//       // ✅ خلي أول frame ثابت شوية قبل الحركة
//       const seqEl = document.getElementById('hero-seq');
//       if (seqEl) {
//         seqEl.classList.remove('hidden');

//         // warm up: ثبت أول frame عشان الـ GPU يجهّز
//         // لو عندك method في AnimatedSequence للتهيئة استعملها هنا

//         setTimeout(() => {
//           try {
//             this.seq?.playForwardAnimation?.();
//           } catch (e) {}
//         }, 80); // تأخير بسيط قبل التحريك
//       }
//     };

//     if ('requestIdleCallback' in window) {
//       (window as any).requestIdleCallback(run, { timeout: 2000 });
//     } else {
//       setTimeout(run, 700);
//     }
//   });
// }

private initAnimatedSequenceAfterIdle() {
  this.ngZone.runOutsideAngular(() => {
    const run = () => {
      setTimeout(() => {
        try {
          // ✅ فعّل الـ sprite وابدأ الأنيميشن
          this.ngZone.run(() => {
            this.spriteReady = true;   // → يخلي <app-animated-sequence> يظهر و <img> تختفي بنعومة
          });

          this.seq?.playForwardAnimation?.();
        } catch (e) {}
      }, 80); // ممكن تخليها 0 لو مش عايز أي pause
    };

    if ('requestIdleCallback' in window) {
      (window as any).requestIdleCallback(run, { timeout: 2000 });
    } else {
      setTimeout(run, 700);
    }
  });


  
}





  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.timeline?.kill?.();
    this.revertSplits();
  }
}
