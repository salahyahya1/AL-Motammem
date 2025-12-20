// import { isPlatformBrowser } from '@angular/common';
// import {
//   AfterViewInit,
//   Component,
//   ElementRef,
//   Inject,
//   NgZone,
//   OnDestroy,
//   PLATFORM_ID,
//   ViewChild,
// } from '@angular/core';

// import { AnimatedSequenceComponent } from '../../../shared/animated-sequence/animated-sequence.component';
// import { RouterLink } from '@angular/router';
// import { LangChangeEvent, TranslatePipe, TranslateService } from '@ngx-translate/core';
// import { Subject, takeUntil } from 'rxjs';
// import { AnimationLoaderService } from '../../../shared/services/animation-loader.service';
// import { RemiveRoleAriaService } from '../../../shared/services/removeRoleAria';
// import { OpenFormDialogDirective } from '../../../shared/Directives/open-form-dialog.directive';



// @Component({
//   selector: 'app-section1',
//   templateUrl: './section1.component.html',
//   styleUrl: './section1.component.scss',
//   standalone: true,
//   imports: [AnimatedSequenceComponent, RouterLink, TranslatePipe, OpenFormDialogDirective],
// })
// export class Section1Component implements OnDestroy,AfterViewInit {
//   @ViewChild(AnimatedSequenceComponent) seq!: AnimatedSequenceComponent;
//   @ViewChild('heroVideo') heroVideo?: ElementRef<HTMLVideoElement>;

//   spriteReady = false;
//   private readonly destroy$ = new Subject<void>();
//   isSequenceReady: boolean = false;
//   timeline!: gsap.core.Timeline;
//   private mm?: any;
//   heroTitleSplit: any;
//   heroSubtitleSplit: any;
//   heroDetailsSplit: any;

//   constructor(
//     @Inject(PLATFORM_ID) private readonly platformId: Object,
//     private readonly ngZone: NgZone,
//     private readonly translate: TranslateService,
//     private readonly animationLoader: AnimationLoaderService,
//     private readonly RemiveRoleAriaService: RemiveRoleAriaService,
//   ) {
//     this.translate.onLangChange
//       .pipe(takeUntil(this.destroy$))
//       .subscribe((e: LangChangeEvent) => {
//         this.revertSplits();
//         setTimeout(() => {
//           this.runGsapAnimation();
//         }, 0);
//       });
//   }

//   ngAfterViewInit() {
//     if ( globalThis.window === undefined) return;
//     if (!isPlatformBrowser(this.platformId)) return;

//     this.ngZone.runOutsideAngular(() => {
//           this.runAfterPaint(() => this.waitForLCPThenInit());
//     this.runAfterPaint(() => this.runGsapAnimation(), 150);
//       });
//   }


//   private runGsapAnimation() {
//     if (!isPlatformBrowser(this.platformId)) return;

//     (document as any).fonts.ready.then(async () => {
//       const loaded = await this.animationLoader.loadGsapWithSplitText();
//       if (!loaded) return;

//       const { gsap, SplitText } = loaded;
//       // gsap.set('#hero', { willChange: 'transform, opacity' });
//       this.revertSplits();

//       const heroTitle = document.querySelector('h1#hero-title') as HTMLElement;
//       const heroSubtitle = document.querySelector('#hero-subtitle') as HTMLElement;
//       const heroDetails = document.querySelector('#hero-details') as HTMLElement;
//       const button1 = document.querySelector('#button1') as HTMLElement;
//       const button2 = document.querySelector('#button2') as HTMLElement;

//       if (!heroTitle || !heroSubtitle || !heroDetails || !button1 || !button2) {
//         console.warn('⚠️ عناصر الـ hero مش لاقيها SplitText');
//         return;
//       }
//       gsap.set([heroTitle, heroSubtitle, heroDetails, button1, button2], {
//         opacity: 0,
//         visibility: 'visible',
//       });

//       this.heroTitleSplit = new SplitText(heroTitle, { type: 'words' });
//       this.heroSubtitleSplit = new SplitText(heroSubtitle, { type: 'words' });
//       this.heroDetailsSplit = new SplitText(heroDetails, { type: 'words' });
//       this.RemiveRoleAriaService.cleanA11y(heroSubtitle, this.heroSubtitleSplit);
//       this.RemiveRoleAriaService.cleanA11y(heroDetails, this.heroDetailsSplit);
//       const tl = gsap.timeline();

//       tl.fromTo(
//         this.heroTitleSplit.words,
//         { opacity: 0, visibility: 'visible' },
//         {
//           opacity: 1,
//           duration: 0.4,
//           ease: 'sine.out',
//           stagger: 0.02,
//           onStart: () => { gsap.set(heroTitle, { opacity: 1, visibility: 'visible' }) },
//         }
//       );

//       tl.fromTo(
//         this.heroSubtitleSplit.words,
//         { opacity: 0, visibility: 'visible' },
//         {
//           opacity: 1,
//           duration: 0.4,
//           ease: 'sine.out',
//           stagger: 0.02,
//           onStart: () => { gsap.set(heroSubtitle, { opacity: 1, visibility: 'visible' }) },
//         }
//       );

//       tl.fromTo(
//         this.heroDetailsSplit.words,
//         { opacity: 0, visibility: 'visible' },
//         {
//           opacity: 1,
//           duration: 0.4,
//           ease: 'sine.out',
//           stagger: 0.02,
//           onStart: () => { gsap.set(heroDetails, { opacity: 1, visibility: 'visible' }) },
//         }
//       );

//       tl.fromTo(
//         button1,
//         { opacity: 0, visibility: 'visible' },
//         {
//           opacity: 1,
//           duration: 0.5,
//           ease: 'sine.inOut',
//           onStart: () => { gsap.set(button1, { opacity: 1, visibility: 'visible' }) },
//         }
//       );

//       tl.fromTo(
//         button2,
//         { opacity: 0, visibility: 'visible' },
//         {
//           opacity: 1,
//           duration: 0.5,
//           ease: 'sine.inOut',
//           onStart: () => { gsap.set(button2, { opacity: 1, visibility: 'visible' }) },
//         }
//       );

//       this.timeline = tl;

//       try {
//         const ScrollTriggerModule = await import('gsap/ScrollTrigger');
//         const ScrollTrigger = ScrollTriggerModule?.default ?? ScrollTriggerModule;
//         gsap.registerPlugin(ScrollTrigger);

//         this.mm?.revert?.();
//         this.mm = gsap.matchMedia();

//         let pinInstance: any;
//         this.mm.add("(min-width: 700px)", () => {
//           pinInstance = ScrollTrigger.create({
//             trigger: '#hero',
//             start: 'top top',
//             end: '150% bottom',
//             pin: true,
//             pinType: 'transform',
//             id: 'hero-pin',
//             anticipatePin: 1,
//           });
//           return () => { pinInstance?.kill?.(); pinInstance = null; };
//         });

//         this.mm.add("(max-width: 699px)", () => {
//           pinInstance = ScrollTrigger.create({
//             trigger: '#hero',
//             start: 'top top',
//             end: '+=1',
//             pin: false,
//             id: 'hero-pin-small',
//           });
//           return () => { pinInstance?.kill?.(); pinInstance = null; };
//         });
//       } catch (e) {
//         console.warn('ScrollTrigger failed to load', e);
//       }

//     });

//     if (this.heroVideo && 'IntersectionObserver' in globalThis.window) {
//       const io = new IntersectionObserver((entries) => {
//         if (entries[0].isIntersecting) {
//           const v = this.heroVideo!.nativeElement;
//           v.src = '/videos/gradient.webm';
//           v.play().catch(() => { });
//           io.disconnect();
//         }
//       }, { threshold: 0.2 });

//       io.observe(this.heroVideo.nativeElement);
//     }
//   }

//   private revertSplits() {
//     this.heroTitleSplit?.revert();
//     this.heroSubtitleSplit?.revert();
//     this.heroDetailsSplit?.revert();
//     this.heroTitleSplit = null;
//     this.heroSubtitleSplit = null;
//     this.heroDetailsSplit = null;
//   }


//   // private waitForLCPThenInit() {
//   //   if (globalThis.window === undefined) return;
//   //   if ('PerformanceObserver' in globalThis.window) {
//   //     const po = new PerformanceObserver((entryList) => {
//   //       const entries = entryList.getEntries();
//   //       const lcpEntry = entries.at(-1);
//   //       if (lcpEntry) {
//   //         this.initAnimatedSequenceAfterIdle();
//   //         po.disconnect();
//   //       }
//   //     });
//   //     try {
//   //       po.observe({ type: 'largest-contentful-paint', buffered: true });
//   //       setTimeout(() => {
//   //         try { po.disconnect(); } catch (e) { }
//   //       }, 5000);
//   //     } catch (e) {
//   //       // fallback
//   //       this.initAnimatedSequenceAfterIdle();
//   //     }
//   //   } else {
//   //     // no PerformanceObserver -> fallback
//   //     // setTimeout(() => this.initAnimatedSequenceAfterIdle(), 2000);
//   //   }
//   // }


//   private waitForLCPThenInit() {
//   if (!isPlatformBrowser(this.platformId)) return;

//   let started = false;
//   const start = () => {
//     if (started) return;
//     started = true;
//     this.initAnimatedSequenceAfterIdle();
//   };

//   // fallback مضمون حتى لو LCP مش شغال على Safari
//   const fallback = setTimeout(start, 1200);

//   if (!('PerformanceObserver' in window)) {
//     start();
//     return;
//   }

//   try {
//     const po = new PerformanceObserver((entryList) => {
//       const entries = entryList.getEntries();
//       if (entries?.length) {
//         clearTimeout(fallback);
//         start();
//         po.disconnect();
//       }
//     });

//     po.observe({ type: 'largest-contentful-paint', buffered: true });

//     // fallback بعد 5 ثواني لو الـ LCP ماجاش
//     setTimeout(() => {
//       try { po.disconnect(); } catch {}
//       start();
//     }, 5000);
//   } catch {
//     start();
//   }
// }


//   private initAnimatedSequenceAfterIdle() {
//   this.ngZone.runOutsideAngular(() => {
//     const run = () => {
//       setTimeout(() => {
//         try {
//           this.ngZone.run(() => {
//             this.spriteReady = true;
//           });

//           this.seq?.playForwardAnimation?.();
//         } catch (e) {}
//       }, 80);
//     };

//     // بدل idleCallback
//     this.runAfterPaint(run, 0);
//   });
// }

//   private runAfterPaint(cb: () => void, delayMs = 0) {
//   if (typeof window === 'undefined') return;

//   // after next paint
//   requestAnimationFrame(() => {
//     // after paint queue
//     setTimeout(cb, delayMs);
//   });
// }

//   ngOnDestroy(): void {
//     this.destroy$.next();
//     this.destroy$.complete();
//     this.mm?.revert?.();
//     this.timeline?.kill?.();
//     this.revertSplits();
//   }
// }
import { isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
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
import { OpenFormDialogDirective } from '../../../shared/Directives/open-form-dialog.directive';

@Component({
  selector: 'app-section1',
  templateUrl: './section1.component.html',
  styleUrl: './section1.component.scss',
  standalone: true,
  imports: [AnimatedSequenceComponent, RouterLink, TranslatePipe, OpenFormDialogDirective],
})
export class Section1Component implements OnDestroy, AfterViewInit {
  @ViewChild(AnimatedSequenceComponent) seq!: AnimatedSequenceComponent;
  @ViewChild('heroVideo') heroVideo?: ElementRef<HTMLVideoElement>;

  spriteReady = false;
  isMobile = false;

  private readonly destroy$ = new Subject<void>();
private spritePreloadImg: HTMLImageElement | null = null;

  private spritePreloaded = false;

  timeline!: gsap.core.Timeline;
  private mm?: any;

  heroTitleSplit: any;
  heroSubtitleSplit: any;
  heroDetailsSplit: any;

  private readonly SPRITE_URL = '/images/homepage/SS_final_4cols_q92.webp';

  constructor(
    @Inject(PLATFORM_ID) private readonly platformId: Object,
    private readonly ngZone: NgZone,
    private readonly translate: TranslateService,
    private readonly animationLoader: AnimationLoaderService,
    private readonly RemiveRoleAriaService: RemiveRoleAriaService,
  ) {
    this.translate.onLangChange
      .pipe(takeUntil(this.destroy$))
      .subscribe((_e: LangChangeEvent) => {
        // اللغة تغيّرت → بس أعيدي GSAP (sprite مش لازم يتعاد)
        this.revertSplits();
        setTimeout(() => this.runGsapAnimation(), 0);
      });
  }

  ngAfterViewInit() {
    if (!isPlatformBrowser(this.platformId)) return;

    this.isMobile = window.matchMedia('(max-width: 699px)').matches;

    this.ngZone.runOutsideAngular(() => {
      // ✅ Mobile: خلي النص يظهر فورًا (بدون SplitText)
      if (this.isMobile) {
        this.forceHeroVisible();
        return;
      }

      // ✅ Desktop:
      // 1) شغلي GSAP (بعد خطّوط)
      this.runAfterPaint(() => this.runGsapAnimation(), 50);

      // 2) ابدأ preload+decode للـ sprite بدري
      this.runAfterPaint(() => this.preloadAndShowSpriteDesktop(), 0);

      // 3) الفيديو زي ما هو
      this.initHeroVideoLazy();
    });
  }

private preloadAndShowSpriteDesktop() {
  if (this.isMobile) return;
  if (this.spritePreloaded) return;



  const img: HTMLImageElement = new Image();

  // (اختياري) للمتصفحات اللي بتدعمها
  try { (img as any).fetchPriority = 'high'; } catch {}

  img.src = this.SPRITE_URL;

  const done = () => {
    this.ngZone.run(() => {
      this.spriteReady = true;
    });

    setTimeout(() => {
      try { this.seq?.playForwardAnimation?.(); } catch {}
    }, 50);
  };

  // ✅ decode لو متاح
  if (typeof img.decode === 'function') {
    img.decode().then(done).catch(() => done());
    return;
  }
this.spritePreloadImg = img;
  // ✅ fallback للمتصفحات اللي مفيهاش decode
  img.onload = () => done();
  img.onerror = () => {
    // سيبي placeholder (spriteReady تفضل false)
  };
}


  private runGsapAnimation() {
    if (!isPlatformBrowser(this.platformId)) return;
    if (this.isMobile) return; // ✅ موبايل: بدون SplitText

    (document as any).fonts?.ready?.then(async () => {
      const loaded = await this.animationLoader.loadGsapWithSplitText();
      if (!loaded) return;

      const { gsap, SplitText } = loaded;

      this.revertSplits();
      this.timeline?.kill?.();
      this.mm?.revert?.();

      const heroTitle = document.querySelector('h1#hero-title') as HTMLElement;
      const heroSubtitle = document.querySelector('#hero-subtitle') as HTMLElement;
      const heroDetails = document.querySelector('#hero-details') as HTMLElement;
      const button1 = document.querySelector('#button1') as HTMLElement;
      const button2 = document.querySelector('#button2') as HTMLElement;

      if (!heroTitle || !heroSubtitle || !heroDetails || !button1 || !button2) return;

      // ✅ نخليهم hidden بس على Desktop فقط (عشان SplitText ليه لازمة)
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

      tl.fromTo(this.heroTitleSplit.words, { opacity: 0 }, {
        opacity: 1,
        duration: 0.4,
        ease: 'sine.out',
        stagger: 0.02,
        onStart: () => gsap.set(heroTitle, { opacity: 1 })
      });

      tl.fromTo(this.heroSubtitleSplit.words, { opacity: 0 }, {
        opacity: 1,
        duration: 0.35,
        ease: 'sine.out',
        stagger: 0.015,
        onStart: () => gsap.set(heroSubtitle, { opacity: 1 })
      });

      tl.fromTo(this.heroDetailsSplit.words, { opacity: 0 }, {
        opacity: 1,
        duration: 0.35,
        ease: 'sine.out',
        stagger: 0.015,
        onStart: () => gsap.set(heroDetails, { opacity: 1 })
      });

      tl.fromTo(button1, { opacity: 0 }, { opacity: 1, duration: 0.35, ease: 'sine.inOut' });
      tl.fromTo(button2, { opacity: 0 }, { opacity: 1, duration: 0.35, ease: 'sine.inOut' });

      this.timeline = tl;

      // ScrollTrigger (Desktop فقط)
      try {
        const ScrollTriggerModule = await import('gsap/ScrollTrigger');
        const ScrollTrigger = ScrollTriggerModule?.default ?? ScrollTriggerModule;
        gsap.registerPlugin(ScrollTrigger);

        this.mm = gsap.matchMedia();

        let pinInstance: any;
        this.mm.add('(min-width: 700px)', () => {
          pinInstance = ScrollTrigger.create({
            trigger: '#hero',
            start: 'top top',
            end: '150% bottom',
            pin: true,
            pinType: 'transform',
            id: 'hero-pin',
            anticipatePin: 1,
          });
          return () => { pinInstance?.kill?.(); pinInstance = null; };
        });
      } catch (e) {
        console.warn('ScrollTrigger failed to load', e);
      }
    });
  }

  /** ✅ Mobile: خلي النص يظهر فورًا */
  private forceHeroVisible() {
    const ids = ['#hero-title', '#hero-subtitle', '#hero-details', '#button1', '#button2'];
    ids.forEach(sel => {
      const el = document.querySelector(sel) as HTMLElement | null;
      if (!el) return;
      el.style.opacity = '1';
      el.style.visibility = 'visible';
    });
  }

  private initHeroVideoLazy() {
    if (!this.heroVideo || !('IntersectionObserver' in window)) return;

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

  private revertSplits() {
    this.heroTitleSplit?.revert();
    this.heroSubtitleSplit?.revert();
    this.heroDetailsSplit?.revert();
    this.heroTitleSplit = null;
    this.heroSubtitleSplit = null;
    this.heroDetailsSplit = null;
  }

  private runAfterPaint(cb: () => void, delayMs = 0) {
    requestAnimationFrame(() => setTimeout(cb, delayMs));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.mm?.revert?.();
    this.timeline?.kill?.();
    this.revertSplits();

    // cleanup sprite preloader
if (this.spritePreloadImg) {
  this.spritePreloadImg.onload = null;
  this.spritePreloadImg.onerror = null;
  this.spritePreloadImg.src = '';
  this.spritePreloadImg = null;
}

  }
}
