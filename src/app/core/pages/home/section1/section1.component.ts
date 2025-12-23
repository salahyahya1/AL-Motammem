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
////////////////////////////////////
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
// export class Section1Component implements OnDestroy, AfterViewInit {
//   @ViewChild(AnimatedSequenceComponent) seq!: AnimatedSequenceComponent;
//   @ViewChild('heroVideo') heroVideo?: ElementRef<HTMLVideoElement>;
// @ViewChild('heroMobileVideo') heroMobileVideo?: ElementRef<HTMLVideoElement>;

//   spriteReady = false;
//   isMobile = false;

//   private readonly destroy$ = new Subject<void>();
// private spritePreloadImg: HTMLImageElement | null = null;
// showDesktopSprite = false;

//   private readonly spritePreloaded = false;

//   timeline!: gsap.core.Timeline;
//   private mm?: any;

//   heroTitleSplit: any;
//   heroSubtitleSplit: any;
//   heroDetailsSplit: any;

//   private readonly SPRITE_URL = '/images/homepage/SS_final_4cols_q92.webp';



//   constructor(
//     @Inject(PLATFORM_ID) private readonly platformId: Object,
//     private readonly ngZone: NgZone,
//     private readonly translate: TranslateService,
//     private readonly animationLoader: AnimationLoaderService,
//     private readonly RemiveRoleAriaService: RemiveRoleAriaService,
//   ) {
//     this.translate.onLangChange
//       .pipe(takeUntil(this.destroy$))
//       .subscribe((_e: LangChangeEvent) => {
//         // اللغة تغيّرت → بس أعيدي GSAP (sprite مش لازم يتعاد)
//         this.revertSplits();
//         setTimeout(() => this.runGsapAnimation(), 0);
//       });
//   }
//   ngOnInit(): void {
//     if (!isPlatformBrowser(this.platformId)) return;
//     this.isMobile = window.matchMedia('(max-width: 699px)').matches;
//   }
//   ngAfterViewInit() {
//     if (!isPlatformBrowser(this.platformId)) return;

//     this.ngZone.runOutsideAngular(() => {
//       // ✅ Mobile: خلي النص يظهر فورًا (بدون SplitText)
//         setTimeout(() => {
//     const v = this.heroMobileVideo?.nativeElement;
//     if (!v) return;

//     // اجبار request
//     v.preload = 'metadata';
//     v.load();

//     const ready = () => {
//       this.ngZone.run(() => (this.mobileVideoReady = true));
//     };

//     v.addEventListener('loadeddata', ready, { once: true });
//     v.addEventListener('canplay', ready, { once: true });
//     v.addEventListener('error', () => console.warn('video error', v.error), { once: true });

//     v.play().catch(() => {
//       // autoplay ممكن يتمنع، بس request هيحصل بسبب load()+preload
//     });
//   }, 0);
// if (this.isMobile) {
//   this.forceHeroVisible();
//   setTimeout(() => this.initHeroMobileVideoLazy(), 0);
//   return;
// }

// queueMicrotask(() => {
//   this.ngZone.run(() => this.showDesktopSprite = true);
// });

//       // ✅ Desktop:
//       // 1) شغلي GSAP (بعد خطّوط)
//       this.runAfterPaint(() => this.runGsapAnimation(), 50);

//       // 2) ابدأ preload+decode للـ sprite بدري
//       this.runAfterPaint(() => this.preloadAndShowSpriteDesktop(), 0);

//       // 3) الفيديو زي ما هو
//       this.initHeroVideoLazy();
//     });
//   }

// private preloadAndShowSpriteDesktop() {
//   if (this.isMobile) return;
//   if (this.spritePreloaded) return;



//   const img: HTMLImageElement = new Image();

//   // (اختياري) للمتصفحات اللي بتدعمها
//   try { (img as any).fetchPriority = 'high'; } catch {}

//   img.src = this.SPRITE_URL;

//   const done = () => {
//     this.ngZone.run(() => {
//       this.spriteReady = true;
//     });

//     setTimeout(() => {
//       try { this.seq?.playForwardAnimation?.(); } catch {}
//     }, 50);
//   };

//   // ✅ decode لو متاح
//   if (typeof img.decode === 'function') {
//     img.decode().then(done).catch(() => done());
//     return;
//   }
// this.spritePreloadImg = img;
//   // ✅ fallback للمتصفحات اللي مفيهاش decode
//   img.onload = () => done();
//   img.onerror = () => {
//     // سيبي placeholder (spriteReady تفضل false)
//   };
// }


//   private runGsapAnimation() {
//     if (!isPlatformBrowser(this.platformId)) return;
//     if (this.isMobile) return; // ✅ موبايل: بدون SplitText

//     (document as any).fonts?.ready?.then(async () => {
//       const loaded = await this.animationLoader.loadGsapWithSplitText();
//       if (!loaded) return;

//       const { gsap, SplitText } = loaded;

//       this.revertSplits();
//       this.timeline?.kill?.();
//       this.mm?.revert?.();

//       const heroTitle = document.querySelector('h1#hero-title') as HTMLElement;
//       const heroSubtitle = document.querySelector('#hero-subtitle') as HTMLElement;
//       const heroDetails = document.querySelector('#hero-details') as HTMLElement;
//       const button1 = document.querySelector('#button1') as HTMLElement;
//       const button2 = document.querySelector('#button2') as HTMLElement;

//       if (!heroTitle || !heroSubtitle || !heroDetails || !button1 || !button2) return;

//       // ✅ نخليهم hidden بس على Desktop فقط (عشان SplitText ليه لازمة)
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

//       tl.fromTo(this.heroTitleSplit.words, { opacity: 0 }, {
//         opacity: 1,
//         duration: 0.4,
//         ease: 'sine.out',
//         stagger: 0.02,
//         onStart: () => gsap.set(heroTitle, { opacity: 1 })
//       });

//       tl.fromTo(this.heroSubtitleSplit.words, { opacity: 0 }, {
//         opacity: 1,
//         duration: 0.35,
//         ease: 'sine.out',
//         stagger: 0.015,
//         onStart: () => gsap.set(heroSubtitle, { opacity: 1 })
//       });

//       tl.fromTo(this.heroDetailsSplit.words, { opacity: 0 }, {
//         opacity: 1,
//         duration: 0.35,
//         ease: 'sine.out',
//         stagger: 0.015,
//         onStart: () => gsap.set(heroDetails, { opacity: 1 })
//       });

//       tl.fromTo(button1, { opacity: 0 }, { opacity: 1, duration: 0.35, ease: 'sine.inOut' });
//       tl.fromTo(button2, { opacity: 0 }, { opacity: 1, duration: 0.35, ease: 'sine.inOut' });

//       this.timeline = tl;

//       // ScrollTrigger (Desktop فقط)
//       try {
//         const ScrollTriggerModule = await import('gsap/ScrollTrigger');
//         const ScrollTrigger = ScrollTriggerModule?.default ?? ScrollTriggerModule;
//         gsap.registerPlugin(ScrollTrigger);

//         this.mm = gsap.matchMedia();

//         let pinInstance: any;
//         this.mm.add('(min-width: 700px)', () => {
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
//       } catch (e) {
//         console.warn('ScrollTrigger failed to load', e);
//       }
//     });
//   }

//   /** ✅ Mobile: خلي النص يظهر فورًا */
//   private forceHeroVisible() {
//     const ids = ['#hero-title', '#hero-subtitle', '#hero-details', '#button1', '#button2'];
//     ids.forEach(sel => {
//       const el = document.querySelector(sel) as HTMLElement | null;
//       if (!el) return;
//       el.style.opacity = '1';
//       el.style.visibility = 'visible';
//     });
//   }

//   private initHeroVideoLazy() {
//     if (!this.heroVideo || !('IntersectionObserver' in window)) return;

//     const io = new IntersectionObserver((entries) => {
//       if (entries[0].isIntersecting) {
//         const v = this.heroVideo!.nativeElement;
//         v.src = '/videos/gradient.webm';
//         v.play().catch(() => {});
//         io.disconnect();
//       }
//     }, { threshold: 0.2 });

//     io.observe(this.heroVideo.nativeElement);
//   }

//   private revertSplits() {
//     this.heroTitleSplit?.revert();
//     this.heroSubtitleSplit?.revert();
//     this.heroDetailsSplit?.revert();
//     this.heroTitleSplit = null;
//     this.heroSubtitleSplit = null;
//     this.heroDetailsSplit = null;
//   }

//   private runAfterPaint(cb: () => void, delayMs = 0) {
//     requestAnimationFrame(() => setTimeout(cb, delayMs));
//   }
//   mobileVideoReady = false;
// private readonly MOBILE_VIDEO_URL = '/images/homepage/laptopios.mp4'; 

// private initHeroMobileVideoLazy() {
//   const v = this.heroMobileVideo?.nativeElement;
//   if (!v) return;

//   // لو مخفي بسبب CSS مش هنكمل (وده اللي كان بيحصل عندك)
//   if (getComputedStyle(v).display === 'none') return;

//   if (v.dataset['started'] === '1') return;
//   v.dataset['started'] = '1';

//   v.muted = true;
//   v.playsInline = true;
//   (v as any).webkitPlaysInline = true;
//   v.autoplay = true;

//   // خليه يطلب حتى لو autoplay اتمنع
//   v.preload = 'metadata';

//   v.src = this.MOBILE_VIDEO_URL;
//   v.load();

//   const markReady = () => {
//     v.style.opacity = '1';
//     this.ngZone.run(() => (this.mobileVideoReady = true));
//   };

//   v.addEventListener('canplay', markReady, { once: true });
//   v.addEventListener('loadeddata', markReady, { once: true });
//   v.addEventListener('error', () => console.warn('mobile video error', v.error), { once: true });

//   v.play().catch(() => {
//     // autoplay اتمنع -> عادي، على الأقل هتشوفي request بسبب preload=metadata + load()
//   });
// }


//   ngOnDestroy(): void {
//     this.destroy$.next();
//     this.destroy$.complete();
//     this.mm?.revert?.();
//     this.timeline?.kill?.();
//     this.revertSplits();

//     // cleanup sprite preloader
// if (this.spritePreloadImg) {
//   this.spritePreloadImg.onload = null;
//   this.spritePreloadImg.onerror = null;
//   this.spritePreloadImg.src = '';
//   this.spritePreloadImg = null;
// }
// const mv = this.heroMobileVideo?.nativeElement;
// if (mv) {
//   try {
//     mv.pause();
//     mv.removeAttribute('src');
//     mv.load();
//   } catch {}
// }

//   }
// }
////98 desktop
// import { isPlatformBrowser } from '@angular/common';
// import {
//   AfterViewInit, Component, ElementRef, Inject, NgZone, OnDestroy, PLATFORM_ID, ViewChild
// } from '@angular/core';
// import { Subject, takeUntil } from 'rxjs';
// import { TranslateService, LangChangeEvent, TranslatePipe } from '@ngx-translate/core';
// import { AnimatedSequenceComponent } from '../../../shared/animated-sequence/animated-sequence.component';
// import { RouterLink } from '@angular/router';
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
// export class Section1Component implements OnDestroy, AfterViewInit {
//   @ViewChild(AnimatedSequenceComponent) seq!: AnimatedSequenceComponent;
//   @ViewChild('heroVideo') heroVideo?: ElementRef<HTMLVideoElement>;
//   @ViewChild('heroMobileVideo') heroMobileVideo?: ElementRef<HTMLVideoElement>;

//   spriteReady = false;
//   mobileVideoReady = false;

//   isMobile = false;
//   showDesktopSprite = false;

//   private readonly destroy$ = new Subject<void>();
//   private spritePreloaded = false;
//   private spritePreloadImg: HTMLImageElement | null = null;

//   timeline!: gsap.core.Timeline;
//   private mm?: any;

//   heroTitleSplit: any;
//   heroSubtitleSplit: any;
//   heroDetailsSplit: any;

//   readonly SPRITE_URL = '/images/homepage/SS_final_4cols_q92.webp';
//   readonly MOBILE_VIDEO_URL = '/images/homepage/laptopios.mp4';

//   constructor(
//     @Inject(PLATFORM_ID) private readonly platformId: Object,
//     private readonly ngZone: NgZone,
//     private readonly translate: TranslateService,
//     private readonly animationLoader: AnimationLoaderService,
//     private readonly RemiveRoleAriaService: RemiveRoleAriaService,
//   ) {
//     this.translate.onLangChange
//       .pipe(takeUntil(this.destroy$))
//       .subscribe((_e: LangChangeEvent) => {
//         this.revertSplits();
//         setTimeout(() => this.runGsapAnimation(), 0);
//       });
//   }

//   ngOnInit(): void {
//     if (!isPlatformBrowser(this.platformId)) return;

//     const mq = window.matchMedia('(max-width: 699px)');
//     const apply = () => {
//       this.isMobile = mq.matches;
//     };
//     apply();

//     // ✅ يخليها تتحدث حتى مع DevTools resize
//     mq.addEventListener?.('change', apply);
//     // fallback قديم
//     (mq as any).addListener?.(apply);

//     this.destroy$.pipe(takeUntil(this.destroy$)).subscribe({
//       complete: () => {
//         mq.removeEventListener?.('change', apply);
//         (mq as any).removeListener?.(apply);
//       }
//     });
//   }

//   ngAfterViewInit() {
//     if (!isPlatformBrowser(this.platformId)) return;

//     this.ngZone.runOutsideAngular(() => {
//       // ✅ Mobile: video فقط
//       if (this.isMobile) {
//         this.forceHeroVisible();
//         this.runAfterPaint(() => this.initHeroMobileVideo(), 0);
//         return;
//       }

//       // ✅ Desktop: sprite فقط + GSAP + desktop background video
//       queueMicrotask(() => this.ngZone.run(() => (this.showDesktopSprite = true)));

//       this.runAfterPaint(() => this.runGsapAnimation(), 50);
//       this.runAfterPaint(() => this.preloadAndShowSpriteDesktop(), 0);
//       this.initHeroVideoLazy();
//     });
//   }

//   private initHeroMobileVideo() {
//     const v = this.heroMobileVideo?.nativeElement;
//     if (!v) return;

//     // في حالة اتعمل resize وانتِ في نفس الصفحة:
//     this.mobileVideoReady = false;

//     v.muted = true;
//     v.playsInline = true;
//     (v as any).webkitPlaysInline = true;
//     v.autoplay = true;
//     v.loop = true;

//     // ✅ request مضمون
//     v.preload = 'metadata';
//     v.src = this.MOBILE_VIDEO_URL;
//     v.load();

//     const markReady = () => this.ngZone.run(() => (this.mobileVideoReady = true));

//     v.addEventListener('canplay', markReady, { once: true });
//     v.addEventListener('loadeddata', markReady, { once: true });
//     v.addEventListener('error', () => console.warn('mobile video error', v.error), { once: true });

//     v.play().catch(() => {
//       // autoplay ممكن يتمنع، بس request هيحصل
//     });
//   }

//   private preloadAndShowSpriteDesktop() {
//     if (this.isMobile || this.spritePreloaded) return;
//     this.spritePreloaded = true;

//     const img = new Image();
//     this.spritePreloadImg = img;

//     try { (img as any).fetchPriority = 'high'; } catch {}
//     img.src = this.SPRITE_URL;

//     const done = () => {
//       this.ngZone.run(() => (this.spriteReady = true));
//       setTimeout(() => {
//         try { this.seq?.playForwardAnimation?.(); } catch {}
//       }, 50);
//     };

//     if (typeof img.decode === 'function') {
//       img.decode().then(done).catch(done);
//     } else {
//       img.onload = done;
//       img.onerror = () => {};
//     }
//   }

//   private runGsapAnimation() {
//     if (!isPlatformBrowser(this.platformId)) return;
//     if (this.isMobile) return;

//     (document as any).fonts?.ready?.then(async () => {
//       const loaded = await this.animationLoader.loadGsapWithSplitText();
//       if (!loaded) return;

//       const { gsap, SplitText } = loaded;

//       this.revertSplits();
//       this.timeline?.kill?.();
//       this.mm?.revert?.();

//       const heroTitle = document.querySelector('h1#hero-title') as HTMLElement;
//       const heroSubtitle = document.querySelector('#hero-subtitle') as HTMLElement;
//       const heroDetails = document.querySelector('#hero-details') as HTMLElement;
//       const button1 = document.querySelector('#button1') as HTMLElement;
//       const button2 = document.querySelector('#button2') as HTMLElement;
//       if (!heroTitle || !heroSubtitle || !heroDetails || !button1 || !button2) return;

//       gsap.set([heroTitle, heroSubtitle, heroDetails, button1, button2], { opacity: 0, visibility: 'visible' });

//       this.heroTitleSplit = new SplitText(heroTitle, { type: 'words' });
//       this.heroSubtitleSplit = new SplitText(heroSubtitle, { type: 'words' });
//       this.heroDetailsSplit = new SplitText(heroDetails, { type: 'words' });

//       this.RemiveRoleAriaService.cleanA11y(heroSubtitle, this.heroSubtitleSplit);
//       this.RemiveRoleAriaService.cleanA11y(heroDetails, this.heroDetailsSplit);

//       const tl = gsap.timeline();
//       tl.fromTo(this.heroTitleSplit.words, { opacity: 0 }, { opacity: 1, duration: 0.4, ease: 'sine.out', stagger: 0.02, onStart: () => gsap.set(heroTitle, { opacity: 1 }) });
//       tl.fromTo(this.heroSubtitleSplit.words, { opacity: 0 }, { opacity: 1, duration: 0.35, ease: 'sine.out', stagger: 0.015, onStart: () => gsap.set(heroSubtitle, { opacity: 1 }) });
//       tl.fromTo(this.heroDetailsSplit.words, { opacity: 0 }, { opacity: 1, duration: 0.35, ease: 'sine.out', stagger: 0.015, onStart: () => gsap.set(heroDetails, { opacity: 1 }) });
//       tl.fromTo(button1, { opacity: 0 }, { opacity: 1, duration: 0.35, ease: 'sine.inOut' });
//       tl.fromTo(button2, { opacity: 0 }, { opacity: 1, duration: 0.35, ease: 'sine.inOut' });

//       this.timeline = tl;

//       try {
//         const ScrollTriggerModule = await import('gsap/ScrollTrigger');
//         const ScrollTrigger = (ScrollTriggerModule as any)?.default ?? ScrollTriggerModule;
//         gsap.registerPlugin(ScrollTrigger);

//         this.mm = gsap.matchMedia();
//         this.mm.add('(min-width: 700px)', () => {
//           const pin = ScrollTrigger.create({
//             trigger: '#hero',
//             start: 'top top',
//             end: '150% bottom',
//             pin: true,
//             pinType: 'transform',
//             id: 'hero-pin',
//             anticipatePin: 1,
//           });
//           return () => pin?.kill?.();
//         });
//       } catch (e) {
//         console.warn('ScrollTrigger failed to load', e);
//       }
//     });
//   }

//   private forceHeroVisible() {
//     ['#hero-title', '#hero-subtitle', '#hero-details', '#button1', '#button2'].forEach(sel => {
//       const el = document.querySelector(sel) as HTMLElement | null;
//       if (!el) return;
//       el.style.opacity = '1';
//       el.style.visibility = 'visible';
//     });
//   }

//   private initHeroVideoLazy() {
//     if (!this.heroVideo || !('IntersectionObserver' in window)) return;

//     const io = new IntersectionObserver((entries) => {
//       if (entries[0].isIntersecting) {
//         const v = this.heroVideo!.nativeElement;
//         v.src = '/videos/gradient.webm';
//         v.play().catch(() => {});
//         io.disconnect();
//       }
//     }, { threshold: 0.2 });

//     io.observe(this.heroVideo.nativeElement);
//   }

//   private revertSplits() {
//     this.heroTitleSplit?.revert();
//     this.heroSubtitleSplit?.revert();
//     this.heroDetailsSplit?.revert();
//     this.heroTitleSplit = null;
//     this.heroSubtitleSplit = null;
//     this.heroDetailsSplit = null;
//   }

//   private runAfterPaint(cb: () => void, delayMs = 0) {
//     requestAnimationFrame(() => setTimeout(cb, delayMs));
//   }

//   ngOnDestroy(): void {
//     this.destroy$.next();
//     this.destroy$.complete();

//     this.mm?.revert?.();
//     this.timeline?.kill?.();
//     this.revertSplits();

//     if (this.spritePreloadImg) {
//       this.spritePreloadImg.onload = null;
//       this.spritePreloadImg.onerror = null;
//       this.spritePreloadImg.src = '';
//       this.spritePreloadImg = null;
//     }

//     const mv = this.heroMobileVideo?.nativeElement;
//     if (mv) {
//       try {
//         mv.pause();
//         mv.removeAttribute('src');
//         mv.load();
//       } catch {}
//     }
//   }
// }
//////////////////////////
// import { isPlatformBrowser } from '@angular/common';
// import {
//   AfterViewInit,
//   Component,
//   ElementRef,
//   Inject,
//   NgZone,
//   OnDestroy,
//   PLATFORM_ID,
//   ViewChild
// } from '@angular/core';
// import { Subject, takeUntil } from 'rxjs';
// import { TranslateService, LangChangeEvent, TranslatePipe } from '@ngx-translate/core';
// import { AnimatedSequenceComponent } from '../../../shared/animated-sequence/animated-sequence.component';
// import { RouterLink } from '@angular/router';
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
// export class Section1Component implements OnDestroy, AfterViewInit {
//   @ViewChild(AnimatedSequenceComponent) seq!: AnimatedSequenceComponent;
//   @ViewChild('heroVideo') heroVideo?: ElementRef<HTMLVideoElement>;
//   @ViewChild('heroMobileVideo') heroMobileVideo?: ElementRef<HTMLVideoElement>;

//   spriteReady = false;
//   mobileVideoReady = false;

//   isMobile = false;
//   showDesktopSprite = false;

//   private readonly destroy$ = new Subject<void>();
//   private spritePreloaded = false;
//   private spritePreloadImg: HTMLImageElement | null = null;

//   private mobileIo?: IntersectionObserver;
//   private mobileVideoTimer?: any;

//   timeline!: gsap.core.Timeline;
//   private mm?: any;

//   heroTitleSplit: any;
//   heroSubtitleSplit: any;
//   heroDetailsSplit: any;

//   readonly SPRITE_URL = '/images/homepage/SS_final_4cols_q92.webp';
//   readonly MOBILE_VIDEO_URL = '/images/homepage/laptopios.mp4';

//   constructor(
//     @Inject(PLATFORM_ID) private readonly platformId: Object,
//     private readonly ngZone: NgZone,
//     private readonly translate: TranslateService,
//     private readonly animationLoader: AnimationLoaderService,
//     private readonly RemiveRoleAriaService: RemiveRoleAriaService,
//   ) {
//     this.translate.onLangChange
//       .pipe(takeUntil(this.destroy$))
//       .subscribe((_e: LangChangeEvent) => {
//         // SplitText/GSAP desktop فقط
//         this.revertSplits();
//         setTimeout(() => this.runGsapAnimation(), 0);
//       });
//   }

//   ngOnInit(): void {
//     if (!isPlatformBrowser(this.platformId)) return;

//     const mq = window.matchMedia('(max-width: 699px)');
//     const apply = () => (this.isMobile = mq.matches);
//     apply();

//     mq.addEventListener?.('change', apply);
//     (mq as any).addListener?.(apply);

//     this.destroy$.subscribe({
//       complete: () => {
//         mq.removeEventListener?.('change', apply);
//         (mq as any).removeListener?.(apply);
//       },
//     });
//   }

//   ngAfterViewInit() {
//     if (!isPlatformBrowser(this.platformId)) return;

//     this.ngZone.runOutsideAngular(() => {
//       // ✅ Mobile: بدون SplitText — Opacity بسيط + فيديو Lazy بعد LCP
//       if (this.isMobile) {
//         this.runAfterPaint(() => this.runMobileOpacityOnly(), 0);
//         // this.deferMobileVideoLoad(); // ✅ أهم حاجة لرفع الـ LCP
//         return;
//       }

//       // ✅ Desktop: زي ما هو (Sprite + SplitText + ScrollTrigger + bg video)
//       queueMicrotask(() => this.ngZone.run(() => (this.showDesktopSprite = true)));

//       this.runAfterPaint(() => this.runGsapAnimation(), 50);
//       this.runAfterPaint(() => this.preloadAndShowSpriteDesktop(), 0);
//       this.initHeroVideoLazy();
//     });
//   }

//   // =========================
//   // ✅ Mobile: Opacity فقط (بدون SplitText)
//   // =========================
//   private runMobileOpacityOnly() {
//     const els = [
//       document.querySelector('h1#hero-title') as HTMLElement | null,
//       document.querySelector('#hero-subtitle') as HTMLElement | null,
//       document.querySelector('#hero-details') as HTMLElement | null,
//       document.querySelector('#button1') as HTMLElement | null,
//       document.querySelector('#button2') as HTMLElement | null,
//     ].filter(Boolean) as HTMLElement[];

//     if (!els.length) return;

//     // مهم: متخليش ده يمنع الـ paint — مجرد transition خفيف
//     els.forEach((el) => {
//       el.style.visibility = 'visible';
//       el.style.opacity = '1';
//       el.style.transition = 'opacity 180ms ease';
//     });
//   }

//   // =========================
//   // ✅ Mobile: خليه يحمل الفيديو بعد ما الصفحة تهدأ + وهو في viewport
//   // =========================
//   // private deferMobileVideoLoad() {
//   //   const v = this.heroMobileVideo?.nativeElement;
//   //   if (!v) return;

//   //   // الفيديو في الـ HTML preload="none" وبدون src
//   //   // هنحط src بعد ما يبقى العنصر ظاهر + بعد idle
//   //   if (!('IntersectionObserver' in window)) {
//   //     this.scheduleMobileVideoStart();
//   //     return;
//   //   }

//   //   this.mobileIo?.disconnect();
//   //   this.mobileIo = new IntersectionObserver((entries) => {
//   //     if (!entries[0]?.isIntersecting) return;
//   //     this.mobileIo?.disconnect();
//   //     this.scheduleMobileVideoStart();
//   //   }, { threshold: 0.25 });

//   //   this.mobileIo.observe(v);
//   // }

//   private scheduleMobileVideoStart() {
//     // ✅ Delay صغير يحسّن LCP جدًا
//     // (بدون ما يبوظ UI لأن الصورة الـ poster هي اللي هتظهر)
//     this.mobileVideoTimer = setTimeout(() => {
//       // this.initHeroMobileVideo();
//     }, 2000);
//   }

//   // private initHeroMobileVideo() {
//   //   const v = this.heroMobileVideo?.nativeElement;
//   //   if (!v) return;

//   //   // لو اتشغل قبل كده
//   //   if ((v as any)._started) return;
//   //   (v as any)._started = true;

//   //   this.mobileVideoReady = false;

//   //   v.muted = true;
//   //   v.playsInline = true;
//   //   (v as any).webkitPlaysInline = true;
//   //   v.autoplay = true;
//   //   // v.loop = true;

//   //   // ✅ دلوقتي بس نحط src
//   //   v.preload = 'metadata';
//   //   v.src = this.MOBILE_VIDEO_URL;
//   //   v.load();

//   //   const markReady = () => this.ngZone.run(() => (this.mobileVideoReady = true));

//   //   v.addEventListener('canplay', markReady, { once: true });
//   //   v.addEventListener('loadeddata', markReady, { once: true });
//   //   v.addEventListener('error', () => console.warn('mobile video error', v.error), { once: true });

//   //   v.play().catch(() => {
//   //     // autoplay ممكن يتمنع، عادي
//   //   });
//   // }

//   // =========================
//   // ✅ Desktop Sprite
//   // =========================
//   private preloadAndShowSpriteDesktop() {
//     if (this.isMobile || this.spritePreloaded) return;
//     this.spritePreloaded = true;

//     const img = new Image();
//     this.spritePreloadImg = img;

//     try { (img as any).fetchPriority = 'high'; } catch {}
//     img.src = this.SPRITE_URL;

//     const done = () => {
//       this.ngZone.run(() => (this.spriteReady = true));
//       setTimeout(() => {
//         try { this.seq?.playForwardAnimation?.(); } catch {}
//       }, 50);
//     };

//     if (typeof (img as any).decode === 'function') {
//       (img as any).decode().then(done).catch(done);
//     } else {
//       img.onload = done;
//       img.onerror = () => {};
//     }
//   }

//   // =========================
//   // ✅ Desktop GSAP + SplitText
//   // =========================
//   private runGsapAnimation() {
//     if (!isPlatformBrowser(this.platformId)) return;
//     if (this.isMobile) return;

//     (document as any).fonts?.ready?.then(async () => {
//       const loaded = await this.animationLoader.loadGsapWithSplitText();
//       if (!loaded) return;

//       const { gsap, SplitText } = loaded;

//       this.revertSplits();
//       this.timeline?.kill?.();
//       this.mm?.revert?.();

//       const heroTitle = document.querySelector('h1#hero-title') as HTMLElement;
//       const heroSubtitle = document.querySelector('#hero-subtitle') as HTMLElement;
//       const heroDetails = document.querySelector('#hero-details') as HTMLElement;
//       const button1 = document.querySelector('#button1') as HTMLElement;
//       const button2 = document.querySelector('#button2') as HTMLElement;
//       if (!heroTitle || !heroSubtitle || !heroDetails || !button1 || !button2) return;

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
//       tl.fromTo(this.heroTitleSplit.words, { opacity: 0 }, { opacity: 1, duration: 0.4, ease: 'sine.out', stagger: 0.02, onStart: () => gsap.set(heroTitle, { opacity: 1 }) });
//       tl.fromTo(this.heroSubtitleSplit.words, { opacity: 0 }, { opacity: 1, duration: 0.35, ease: 'sine.out', stagger: 0.015, onStart: () => gsap.set(heroSubtitle, { opacity: 1 }) });
//       tl.fromTo(this.heroDetailsSplit.words, { opacity: 0 }, { opacity: 1, duration: 0.35, ease: 'sine.out', stagger: 0.015, onStart: () => gsap.set(heroDetails, { opacity: 1 }) });
//       tl.fromTo(button1, { opacity: 0 }, { opacity: 1, duration: 0.35, ease: 'sine.inOut' });
//       tl.fromTo(button2, { opacity: 0 }, { opacity: 1, duration: 0.35, ease: 'sine.inOut' });

//       this.timeline = tl;

//       try {
//         const ScrollTriggerModule = await import('gsap/ScrollTrigger');
//         const ScrollTrigger = (ScrollTriggerModule as any)?.default ?? ScrollTriggerModule;
//         gsap.registerPlugin(ScrollTrigger);

//         this.mm = gsap.matchMedia();
//         this.mm.add('(min-width: 700px)', () => {
//           const pin = ScrollTrigger.create({
//             trigger: '#hero',
//             start: 'top top',
//             end: '150% bottom',
//             pin: true,
//             pinType: 'transform',
//             id: 'hero-pin',
//             anticipatePin: 1,
//           });
//           return () => pin?.kill?.();
//         });
//       } catch (e) {
//         console.warn('ScrollTrigger failed to load', e);
//       }
//     });
//   }

//   private initHeroVideoLazy() {
//     if (!this.heroVideo || !('IntersectionObserver' in window)) return;

//     const io = new IntersectionObserver((entries) => {
//       if (entries[0].isIntersecting) {
//         const v = this.heroVideo!.nativeElement;
//         v.src = '/videos/gradient.webm';
//         v.play().catch(() => {});
//         io.disconnect();
//       }
//     }, { threshold: 0.2 });

//     io.observe(this.heroVideo.nativeElement);
//   }

//   private revertSplits() {
//     this.heroTitleSplit?.revert();
//     this.heroSubtitleSplit?.revert();
//     this.heroDetailsSplit?.revert();
//     this.heroTitleSplit = null;
//     this.heroSubtitleSplit = null;
//     this.heroDetailsSplit = null;
//   }

//   private runAfterPaint(cb: () => void, delayMs = 0) {
//     requestAnimationFrame(() => setTimeout(cb, delayMs));
//   }

//   ngOnDestroy(): void {
//     this.destroy$.next();
//     this.destroy$.complete();

//     clearTimeout(this.mobileVideoTimer);
//     this.mobileIo?.disconnect();

//     this.mm?.revert?.();
//     this.timeline?.kill?.();
//     this.revertSplits();

//     if (this.spritePreloadImg) {
//       this.spritePreloadImg.onload = null;
//       this.spritePreloadImg.onerror = null;
//       this.spritePreloadImg.src = '';
//       this.spritePreloadImg = null;
//     }

//     const mv = this.heroMobileVideo?.nativeElement;
//     if (mv) {
//       try {
//         mv.pause();
//         mv.removeAttribute('src');
//         mv.load();
//       } catch {}
//     }
//   }
// }
/////////////////
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
// import { Subject, takeUntil } from 'rxjs';
// import { TranslateService, LangChangeEvent, TranslatePipe } from '@ngx-translate/core';
// import { AnimatedSequenceComponent } from '../../../shared/animated-sequence/animated-sequence.component';
// import { RouterLink } from '@angular/router';
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
// export class Section1Component implements OnDestroy, AfterViewInit {
//   @ViewChild(AnimatedSequenceComponent) seq!: AnimatedSequenceComponent;
//   @ViewChild('heroVideo') heroVideo?: ElementRef<HTMLVideoElement>;

//   // ✅ موبايل: صورة ثابتة بتظهر بـ opacity transition
//   @ViewChild('heroMobileImg') heroMobileImg?: ElementRef<HTMLImageElement>;
//   mobileImgReady = false;

//   spriteReady = false;
//   isMobile = false;
//   showDesktopSprite = false;

//   private readonly destroy$ = new Subject<void>();

//   private spritePreloaded = false;
//   private spritePreloadImg: HTMLImageElement | null = null;

//   timeline!: gsap.core.Timeline;
//   private mm?: any;

//   heroTitleSplit: any;
//   heroSubtitleSplit: any;
//   heroDetailsSplit: any;

//   readonly SPRITE_URL = '/images/homepage/SS_final_4cols_q92.webp';

//   constructor(
//     @Inject(PLATFORM_ID) private readonly platformId: Object,
//     private readonly ngZone: NgZone,
//     private readonly translate: TranslateService,
//     private readonly animationLoader: AnimationLoaderService,
//     private readonly RemiveRoleAriaService: RemiveRoleAriaService
//   ) {
//     this.translate.onLangChange
//       .pipe(takeUntil(this.destroy$))
//       .subscribe((_e: LangChangeEvent) => {
//         // ✅ Mobile: مفيش GSAP
//         if (this.isMobile) return;

//         // ✅ Desktop: إعادة Split/GSAP بعد LCP
//         this.revertSplits();
//         setTimeout(() => this.kickDesktopAfterLCP(), 0);
//       });
//   }

//   ngOnInit(): void {
//     if (!isPlatformBrowser(this.platformId)) return;

//     const mq = window.matchMedia('(max-width: 699px)');
//     const apply = () => (this.isMobile = mq.matches);
//     apply();

//     mq.addEventListener?.('change', apply);
//     (mq as any).addListener?.(apply);

//     this.destroy$.subscribe({
//       complete: () => {
//         mq.removeEventListener?.('change', apply);
//         (mq as any).removeListener?.(apply);
//       },
//     });
//   }

//   ngAfterViewInit(): void {
//     if (!isPlatformBrowser(this.platformId)) return;

//     this.ngZone.runOutsideAngular(() => {
//       // ✅ Mobile: صورة ثابتة فقط + fade-in بسيط
//       if (this.isMobile) {
//         this.initMobileImageFadeIn();
//         return;
//       }

//       // ✅ Desktop: كل التقيل بعد LCP
//       this.kickDesktopAfterLCP();
//     });
//   }

//   // =========================================================
//   // ✅ Mobile: static image with opacity fade-in (lightweight)
//   // =========================================================
//   private initMobileImageFadeIn() {
//     const img = this.heroMobileImg?.nativeElement;
//     if (!img) return;

//     const markReady = () => this.ngZone.run(() => (this.mobileImgReady = true));

//     // لو الكاش جايبها already
//     if ((img as any).complete) {
//       markReady();
//       return;
//     }

//     img.addEventListener('load', markReady, { once: true });
//     img.addEventListener('error', () => markReady(), { once: true }); // fail-safe
//   }

//   // =========================================================
//   // ✅ Desktop orchestrator: كل شيء بعد LCP
//   // =========================================================
//   private desktopStarted = false;

//   private kickDesktopAfterLCP() {
//     if (!isPlatformBrowser(this.platformId)) return;
//     if (this.isMobile) return;

//     if (this.desktopStarted) {
//       this.waitForLCP(() => this.runAfterPaint(() => this.runGsapAnimation(), 0));
//       return;
//     }

//     this.desktopStarted = true;

//     this.waitForLCP(() => {
//       // 1) رندر الـ sprite component بعد LCP
//       queueMicrotask(() => this.ngZone.run(() => (this.showDesktopSprite = true)));

//       // 2) بعد أول paint بعد LCP: شغل GSAP + preload sprite + bg video
//       this.runAfterPaint(() => this.runGsapAnimation(), 0);
//       this.runAfterPaint(() => this.preloadAndShowSpriteDesktop(), 0);
//       this.runAfterPaint(() => this.initHeroVideoLazy(), 0);
//     });
//   }

//   private waitForLCP(cb: () => void) {
//     let done = false;
//     const run = () => {
//       if (done) return;
//       done = true;
//       cb();
//     };

//     const fallback = setTimeout(run, 1600);

//     if (!('PerformanceObserver' in window)) {
//       clearTimeout(fallback);
//       run();
//       return;
//     }

//     try {
//       const po = new PerformanceObserver((list) => {
//         const entries = list.getEntries();
//         if (entries && entries.length) {
//           clearTimeout(fallback);
//           run();
//           po.disconnect();
//         }
//       });

//       po.observe({ type: 'largest-contentful-paint', buffered: true });

//       setTimeout(() => {
//         try { po.disconnect(); } catch {}
//         run();
//       }, 3500);
//     } catch {
//       clearTimeout(fallback);
//       run();
//     }
//   }

//   // =========================================================
//   // ✅ Desktop: preload sprite
//   // =========================================================
//   private preloadAndShowSpriteDesktop() {
//     if (this.isMobile || this.spritePreloaded) return;
//     this.spritePreloaded = true;

//     const img = new Image();
//     this.spritePreloadImg = img;

//     try { (img as any).fetchPriority = 'high'; } catch {}

//     img.src = this.SPRITE_URL;

//     const done = () => {
//       this.ngZone.run(() => (this.spriteReady = true));
//       setTimeout(() => {
//         try { this.seq?.playForwardAnimation?.(); } catch {}
//       }, 50);
//     };

//     if (typeof (img as any).decode === 'function') {
//       (img as any).decode().then(done).catch(done);
//     } else {
//       img.onload = done;
//       img.onerror = () => {};
//     }
//   }

//   // =========================================================
//   // ✅ Desktop: GSAP + SplitText
//   // =========================================================
//   private runGsapAnimation() {
//     if (!isPlatformBrowser(this.platformId)) return;
//     if (this.isMobile) return;

//     (document as any).fonts?.ready?.then(async () => {
//       const loaded = await this.animationLoader.loadGsapWithSplitText();
//       if (!loaded) return;

//       const { gsap, SplitText } = loaded;

//       this.revertSplits();
//       this.timeline?.kill?.();
//       this.mm?.revert?.();

//       const heroTitle = document.querySelector('h1#hero-title') as HTMLElement;
//       const heroSubtitle = document.querySelector('#hero-subtitle') as HTMLElement;
//       const heroDetails = document.querySelector('#hero-details') as HTMLElement;
//       const button1 = document.querySelector('#button1') as HTMLElement;
//       const button2 = document.querySelector('#button2') as HTMLElement;
//       if (!heroTitle || !heroSubtitle || !heroDetails || !button1 || !button2) return;

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

//       tl.fromTo(this.heroTitleSplit.words, { opacity: 0 }, {
//         opacity: 1,
//         duration: 0.4,
//         ease: 'sine.out',
//         stagger: 0.02,
//         onStart: () => gsap.set(heroTitle, { opacity: 1 }),
//       });

//       tl.fromTo(this.heroSubtitleSplit.words, { opacity: 0 }, {
//         opacity: 1,
//         duration: 0.35,
//         ease: 'sine.out',
//         stagger: 0.015,
//         onStart: () => gsap.set(heroSubtitle, { opacity: 1 }),
//       });

//       tl.fromTo(this.heroDetailsSplit.words, { opacity: 0 }, {
//         opacity: 1,
//         duration: 0.35,
//         ease: 'sine.out',
//         stagger: 0.015,
//         onStart: () => gsap.set(heroDetails, { opacity: 1 }),
//       });

//       // ✅ رجع أنيميشن الزرارين
//       tl.fromTo(button1, { opacity: 0 }, { opacity: 1, duration: 0.35, ease: 'sine.inOut' });
//       tl.fromTo(button2, { opacity: 0 }, { opacity: 1, duration: 0.35, ease: 'sine.inOut' });

//       this.timeline = tl;

//       try {
//         const ScrollTriggerModule = await import('gsap/ScrollTrigger');
//         const ScrollTrigger = (ScrollTriggerModule as any)?.default ?? ScrollTriggerModule;
//         gsap.registerPlugin(ScrollTrigger);

//         this.mm = gsap.matchMedia();
//         this.mm.add('(min-width: 700px)', () => {
//           const pin = ScrollTrigger.create({
//             trigger: '#hero',
//             start: 'top top',
//             end: '150% bottom',
//             pin: true,
//             pinType: 'transform',
//             id: 'hero-pin',
//             anticipatePin: 1,
//           });
//           return () => pin?.kill?.();
//         });
//       } catch (e) {
//         console.warn('ScrollTrigger failed to load', e);
//       }
//     });
//   }

//   // =========================================================
//   // ✅ Desktop background video lazy
//   // =========================================================
//   private initHeroVideoLazy() {
//     if (!this.heroVideo || !('IntersectionObserver' in window)) return;

//     const io = new IntersectionObserver((entries) => {
//       if (entries[0].isIntersecting) {
//         const v = this.heroVideo!.nativeElement;
//         v.src = '/videos/gradient.webm';
//         v.play().catch(() => {});
//         io.disconnect();
//       }
//     }, { threshold: 0.2 });

//     io.observe(this.heroVideo.nativeElement);
//   }

//   private revertSplits() {
//     this.heroTitleSplit?.revert();
//     this.heroSubtitleSplit?.revert();
//     this.heroDetailsSplit?.revert();
//     this.heroTitleSplit = null;
//     this.heroSubtitleSplit = null;
//     this.heroDetailsSplit = null;
//   }

//   private runAfterPaint(cb: () => void, delayMs = 0) {
//     requestAnimationFrame(() => setTimeout(cb, delayMs));
//   }

//   ngOnDestroy(): void {
//     this.destroy$.next();
//     this.destroy$.complete();

//     this.mm?.revert?.();
//     this.timeline?.kill?.();
//     this.revertSplits();

//     if (this.spritePreloadImg) {
//       this.spritePreloadImg.onload = null;
//       this.spritePreloadImg.onerror = null;
//       this.spritePreloadImg.src = '';
//       this.spritePreloadImg = null;
//     }
//   }
// }
/////////////////
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
// import { Subject, takeUntil } from 'rxjs';
// import { TranslateService, LangChangeEvent, TranslatePipe } from '@ngx-translate/core';
// import { AnimatedSequenceComponent } from '../../../shared/animated-sequence/animated-sequence.component';
// import { RouterLink } from '@angular/router';
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
// export class Section1Component implements OnDestroy, AfterViewInit {
//   @ViewChild(AnimatedSequenceComponent) seq!: AnimatedSequenceComponent;
//   @ViewChild('heroVideo') heroVideo?: ElementRef<HTMLVideoElement>;

//   spriteReady = false;
//   isMobile = false;
//   showDesktopSprite = false;

//   private readonly destroy$ = new Subject<void>();

//   private spritePreloaded = false;
//   private spritePreloadImg: HTMLImageElement | null = null;

//   timeline!: gsap.core.Timeline;
//   private mm?: any;

//   heroTitleSplit: any;
//   heroSubtitleSplit: any;
//   heroDetailsSplit: any;

//   readonly SPRITE_URL = '/images/homepage/SS_final_4cols_q92.webp';

//   constructor(
//     @Inject(PLATFORM_ID) private readonly platformId: Object,
//     private readonly ngZone: NgZone,
//     private readonly translate: TranslateService,
//     private readonly animationLoader: AnimationLoaderService,
//     private readonly RemiveRoleAriaService: RemiveRoleAriaService
//   ) {
//     this.translate.onLangChange
//       .pipe(takeUntil(this.destroy$))
//       .subscribe((_e: LangChangeEvent) => {
//         // ✅ Mobile: nothing
//         if (this.isMobile) return;

//         // ✅ Desktop only
//         this.revertSplits();
//         setTimeout(() => this.kickDesktopAfterLCP(), 0);
//       });
//   }

//   ngOnInit(): void {
//     if (!isPlatformBrowser(this.platformId)) return;

//     const mq = window.matchMedia('(max-width: 699px)');
//     const apply = () => (this.isMobile = mq.matches);
//     apply();

//     mq.addEventListener?.('change', apply);
//     (mq as any).addListener?.(apply);

//     this.destroy$.subscribe({
//       complete: () => {
//         mq.removeEventListener?.('change', apply);
//         (mq as any).removeListener?.(apply);
//       },
//     });
//   }

//   ngAfterViewInit(): void {
//     if (!isPlatformBrowser(this.platformId)) return;

//     this.ngZone.runOutsideAngular(() => {
//       // ✅ Mobile: completely static
//       if (this.isMobile) return;

//       // ✅ Desktop: after LCP
//       this.kickDesktopAfterLCP();
//     });
//   }

//   // =========================================================
//   // ✅ Desktop orchestrator
//   // =========================================================
//   private desktopStarted = false;

//   private kickDesktopAfterLCP() {
//     if (!isPlatformBrowser(this.platformId)) return;
//     if (this.isMobile) return;

//     if (this.desktopStarted) {
//       this.waitForLCP(() => this.runAfterPaint(() => this.runGsapAnimation(), 0));
//       return;
//     }

//     this.desktopStarted = true;

//     this.waitForLCP(() => {
//       queueMicrotask(() => this.ngZone.run(() => (this.showDesktopSprite = true)));

//       this.runAfterPaint(() => this.runGsapAnimation(), 0);
//       this.runAfterPaint(() => this.preloadAndShowSpriteDesktop(), 0);
//       this.runAfterPaint(() => this.initHeroVideoLazy(), 0);
//     });
//   }

//   private waitForLCP(cb: () => void) {
//     let done = false;
//     const run = () => {
//       if (done) return;
//       done = true;
//       cb();
//     };

//     const fallback = setTimeout(run, 1600);

//     if (!('PerformanceObserver' in window)) {
//       clearTimeout(fallback);
//       run();
//       return;
//     }

//     try {
//       const po = new PerformanceObserver((list) => {
//         const entries = list.getEntries();
//         if (entries && entries.length) {
//           clearTimeout(fallback);
//           run();
//           po.disconnect();
//         }
//       });

//       po.observe({ type: 'largest-contentful-paint', buffered: true });

//       setTimeout(() => {
//         try { po.disconnect(); } catch {}
//         run();
//       }, 3500);
//     } catch {
//       clearTimeout(fallback);
//       run();
//     }
//   }

//   // =========================================================
//   // ✅ Desktop sprite preload
//   // =========================================================
//   private preloadAndShowSpriteDesktop() {
//     if (this.isMobile || this.spritePreloaded) return;
//     this.spritePreloaded = true;

//     const img = new Image();
//     this.spritePreloadImg = img;

//     try { (img as any).fetchPriority = 'high'; } catch {}

//     img.src = this.SPRITE_URL;

//     const done = () => {
//       this.ngZone.run(() => (this.spriteReady = true));
//       setTimeout(() => {
//         try { this.seq?.playForwardAnimation?.(); } catch {}
//       }, 50);
//     };

//     if (typeof (img as any).decode === 'function') {
//       (img as any).decode().then(done).catch(done);
//     } else {
//       img.onload = done;
//       img.onerror = () => {};
//     }
//   }

//   // =========================================================
//   // ✅ Desktop GSAP
//   // =========================================================
//   private runGsapAnimation() {
//     if (!isPlatformBrowser(this.platformId)) return;
//     if (this.isMobile) return;

//     (document as any).fonts?.ready?.then(async () => {
//       const loaded = await this.animationLoader.loadGsapWithSplitText();
//       if (!loaded) return;

//       const { gsap, SplitText } = loaded;

//       this.revertSplits();
//       this.timeline?.kill?.();
//       this.mm?.revert?.();

//       const heroTitle = document.querySelector('h1#hero-title') as HTMLElement;
//       const heroSubtitle = document.querySelector('#hero-subtitle') as HTMLElement;
//       const heroDetails = document.querySelector('#hero-details') as HTMLElement;
//       const button1 = document.querySelector('#button1') as HTMLElement;
//       const button2 = document.querySelector('#button2') as HTMLElement;
//       if (!heroTitle || !heroSubtitle || !heroDetails || !button1 || !button2) return;

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

//       tl.fromTo(this.heroTitleSplit.words, { opacity: 0 }, {
//         opacity: 1,
//         duration: 0.4,
//         ease: 'sine.out',
//         stagger: 0.02,
//         onStart: () => gsap.set(heroTitle, { opacity: 1 }),
//       });

//       tl.fromTo(this.heroSubtitleSplit.words, { opacity: 0 }, {
//         opacity: 1,
//         duration: 0.35,
//         ease: 'sine.out',
//         stagger: 0.015,
//         onStart: () => gsap.set(heroSubtitle, { opacity: 1 }),
//       });

//       tl.fromTo(this.heroDetailsSplit.words, { opacity: 0 }, {
//         opacity: 1,
//         duration: 0.35,
//         ease: 'sine.out',
//         stagger: 0.015,
//         onStart: () => gsap.set(heroDetails, { opacity: 1 }),
//       });

//       tl.fromTo(button1, { opacity: 0 }, { opacity: 1, duration: 0.35, ease: 'sine.inOut' });
//       tl.fromTo(button2, { opacity: 0 }, { opacity: 1, duration: 0.35, ease: 'sine.inOut' });

//       this.timeline = tl;

//       try {
//         const ScrollTriggerModule = await import('gsap/ScrollTrigger');
//         const ScrollTrigger = (ScrollTriggerModule as any)?.default ?? ScrollTriggerModule;
//         gsap.registerPlugin(ScrollTrigger);

//         this.mm = gsap.matchMedia();
//         this.mm.add('(min-width: 700px)', () => {
//           const pin = ScrollTrigger.create({
//             trigger: '#hero',
//             start: 'top top',
//             end: '150% bottom',
//             pin: true,
//             pinType: 'transform',
//             id: 'hero-pin',
//             anticipatePin: 1,
//           });
//           return () => pin?.kill?.();
//         });
//       } catch (e) {
//         console.warn('ScrollTrigger failed to load', e);
//       }
//     });
//   }

//   // =========================================================
//   // ✅ Desktop BG video lazy
//   // =========================================================
//   private initHeroVideoLazy() {
//     if (!this.heroVideo || !('IntersectionObserver' in window)) return;

//     const io = new IntersectionObserver((entries) => {
//       if (entries[0].isIntersecting) {
//         const v = this.heroVideo!.nativeElement;
//         v.src = '/videos/gradient.webm';
//         v.play().catch(() => {});
//         io.disconnect();
//       }
//     }, { threshold: 0.2 });

//     io.observe(this.heroVideo.nativeElement);
//   }

//   private revertSplits() {
//     this.heroTitleSplit?.revert();
//     this.heroSubtitleSplit?.revert();
//     this.heroDetailsSplit?.revert();
//     this.heroTitleSplit = null;
//     this.heroSubtitleSplit = null;
//     this.heroDetailsSplit = null;
//   }

//   private runAfterPaint(cb: () => void, delayMs = 0) {
//     requestAnimationFrame(() => setTimeout(cb, delayMs));
//   }

//   ngOnDestroy(): void {
//     this.destroy$.next();
//     this.destroy$.complete();

//     this.mm?.revert?.();
//     this.timeline?.kill?.();
//     this.revertSplits();

//     if (this.spritePreloadImg) {
//       this.spritePreloadImg.onload = null;
//       this.spritePreloadImg.onerror = null;
//       this.spritePreloadImg.src = '';
//       this.spritePreloadImg = null;
//     }
//   }
// }
import { isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  Component,
  Inject,
  OnDestroy,
  PLATFORM_ID,
  ViewChild,
  ViewContainerRef,
  NgZone,
} from '@angular/core';
import { Subject } from 'rxjs';
import { TranslatePipe } from '@ngx-translate/core';
import { RouterLink } from '@angular/router';
import { OpenFormDialogDirective } from '../../../shared/Directives/open-form-dialog.directive';

@Component({
  selector: 'app-section1',
  templateUrl: './section1.component.html',
  styleUrl: './section1.component.scss',
  standalone: true,
  imports: [RouterLink, TranslatePipe, OpenFormDialogDirective],
})
export class Section1Component implements AfterViewInit, OnDestroy {
  isMobile = false;

  @ViewChild('desktopHost', { read: ViewContainerRef }) desktopHost?: ViewContainerRef;

  private readonly destroy$ = new Subject<void>();
  private mq?: MediaQueryList;

  constructor(
    @Inject(PLATFORM_ID) private readonly platformId: Object,
    private readonly ngZone: NgZone,
  ) {}

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    this.mq = window.matchMedia('(max-width: 699px)');
    const apply = () => (this.isMobile = !!this.mq?.matches);
    apply();

    this.mq.addEventListener?.('change', apply);
    (this.mq as any).addListener?.(apply);

    this.destroy$.subscribe({
      complete: () => {
        this.mq?.removeEventListener?.('change', apply);
        (this.mq as any)?.removeListener?.(apply);
      },
    });
  }

  // ngAfterViewInit(): void {
  //   if (!isPlatformBrowser(this.platformId)) return;
  //   if (this.isMobile) return;

  //   // ✅ Lazy-load حقيقي: chunk منفصل (ده اللي يخفض TBT في الموبايل)
  //   this.ngZone.runOutsideAngular(() => {
  //     requestAnimationFrame(() => {
  //       // خليه بعد أول paint
  //       setTimeout(() => this.loadDesktopHero(), 0);
  //     });
  //   });
  // }
  ngAfterViewInit() {
  if (!isPlatformBrowser(this.platformId)) return;

  // تأكيد 100% من الـ viewport نفسه
  const isDesktopNow = window.matchMedia('(min-width: 700px)').matches;
  if (!isDesktopNow) return;

  this.ngZone.runOutsideAngular(() => {
    requestAnimationFrame(() => setTimeout(() => this.loadDesktopHero(), 0));
  });
}


  private async loadDesktopHero() {
    if (!this.desktopHost) return;

    // ✅ dynamic import => code split
    const m = await import('./section1-desktop-hero.component');
    const DesktopComp = m.Section1DesktopHeroComponent;

    // مهم: clear
    this.desktopHost.clear();
    this.desktopHost.createComponent(DesktopComp);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}





