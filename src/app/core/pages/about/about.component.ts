// import {
//   Component,
//   Inject,
//   PLATFORM_ID,
//   NgZone,
//   ChangeDetectorRef,
// } from '@angular/core';
// import { CommonModule, isPlatformBrowser } from '@angular/common';
// import gsap from 'gsap';
// import ScrollTrigger from 'gsap/ScrollTrigger';
// import ScrollSmoother from 'gsap/ScrollSmoother';
// import { BehaviorSubject } from 'rxjs';
// import { NavbarThemeService } from '../../components/navbar/navbar-theme.service';
// import { SectionsRegistryService } from "../../shared/services/sections-registry.service";
// import ScrollToPlugin from 'gsap/ScrollToPlugin';

// import { AboutSection1Component } from "./about-section1/about-section1.component";
// import { AboutSection2Component } from "./about-section2/about-section2.component";
// import { AboutSection3Component } from "./about-section3/about-section3.component";
// import { AboutSection4Component } from "./about-section4/about-section4.component";
// import { AboutSection5Component } from "./about-section5/about-section5.component";
// import { SeoLinkService } from '../../services/seo-link.service';

// gsap.registerPlugin(ScrollTrigger, ScrollSmoother, ScrollToPlugin);

// @Component({
//   selector: 'app-about',
//   imports: [AboutSection1Component, AboutSection2Component, AboutSection3Component, CommonModule, AboutSection4Component, AboutSection5Component],
//   templateUrl: './about.component.html',
//   styleUrl: './about.component.scss'
// })
// export class AboutComponent {
//   private visibilitySubject = new BehaviorSubject<'visible' | 'invisible'>('visible');
//   visibility$ = this.visibilitySubject.asObservable();
//   visibilityState: 'visible' | 'invisible' = 'visible';

//   menuOpen = false;
//   isBrowser: boolean;
//   isMobile!: boolean;

//   private ctx?: gsap.Context;

//   // Snap properties
//   private snapObserver?: any;
//   private snapPositions: number[] = [];
//   private smoother: any;
//   private smootherST: any;


//   constructor(
//     @Inject(PLATFORM_ID) private platformId: Object,
//     private ngZone: NgZone,
//     private cdr: ChangeDetectorRef,
//     private navTheme: NavbarThemeService,
//     private sectionsRegistry: SectionsRegistryService,
//     private seoLinks: SeoLinkService
//   ) {
//     this.isBrowser = isPlatformBrowser(this.platformId);
//   }

//   ngOnInit() {
//     if (!this.isBrowser) return;
//     this.isMobile = window.matchMedia('(max-width: 767px)').matches;
//   }

//   ngAfterViewInit(): void {
//     if (!this.isBrowser) return;

//     // Separate paths for Mobile vs Desktop
//     if (this.isMobile) {
//       setTimeout(() => this.initMobileSnap(), 750);
//       return;
//     }

//     // Desktop: wait for smoother and set up
//     this.ngZone.runOutsideAngular(() => {
//       this.waitForSmoother((smoother) => {
//         this.smoother = smoother;
//         this.smootherST = smoother.scrollTrigger;
//         this.ctx = gsap.context(() => {
//           this.initDesktop(smoother);
//         });
//       });
//     });
//   }

//   private waitForSmoother(cb: (s: any) => void) {
//     const start = performance.now();
//     const tick = () => {
//       const s = ScrollSmoother.get() as any;
//       if (s) return cb(s);
//       if (performance.now() - start < 3000) requestAnimationFrame(tick);
//     };
//     tick();
//   }

//   private initDesktop(smoother: any) {
//     const scroller = smoother.wrapper();

//     // Navbar colors triggers
//     this.observeSections(scroller);

//     // Resize handler
//     window.addEventListener('resize', this.onResize);

//     // Build snap positions and setup observer after everything is ready
//     setTimeout(() => {
//       ScrollTrigger.refresh();
//       this.buildSnapPositions(smoother);
//       this.initSnapObserver(smoother);
//     }, 600);
//   }
//   // =================== MOBILE SNAP (STABLE ON REAL DEVICES) ===================
//   private scrollEl!: HTMLElement;
//   private mobileObserver?: any;

//   private panelStartsMobile = new Set<number>();
//   private footerTopMobile = Number.POSITIVE_INFINITY;

//   private lastDirMobile: 1 | -1 = 1;
//   private isSnappingMobile = false;
//   private isTouchingMobile = false;

//   private globalSnapLocked = false;
//   private globalSnapLockUntil = 0;

//   private lastVVH = 0;
//   private mobileResizeT: any = null;

//   // مهم: علشان لو Section3 trigger لسه ما اتبناش وقت build
//   private s3WaitTries = 0;

//   // 👇 نفس snapPositions اللي عندك فوق في الكلاس هيتستخدم للموبايل والديسكتوب
//   // private snapPositions: number[] = [];

//   // from Section3 to lock/unlock global snap
//   private onS3Lock = (e: Event) => {
//     const ce = e as CustomEvent<{ locked?: boolean; cooldownMs?: number }>;
//     const locked = !!ce.detail?.locked;
//     const cooldownMs = ce.detail?.cooldownMs ?? 0;

//     this.globalSnapLocked = locked;

//     if (locked) {
//       // ✅ وقف السناب العام فورًا أثناء pin Section3
//       this.mobileObserver?.disable?.();
//       return;
//     }

//     // ✅ بعد الخروج من Section3: cooldown + rebuild positions + رجّع observer
//     const until = performance.now() + cooldownMs;
//     this.globalSnapLockUntil = Math.max(this.globalSnapLockUntil, until);

//     window.setTimeout(() => {
//       ScrollTrigger.refresh(true);
//       this.buildSnapPositionsMobile();
//       this.mobileObserver?.enable?.();
//     }, cooldownMs + 120);
//   };

//   private onTouchStartMobile = () => { this.isTouchingMobile = true; };
//   private onTouchEndMobile = () => { this.isTouchingMobile = false; };

//   private initMobileSnap() {
//     // ✅ مهم جدًا للموبايل الحقيقي (address bar) — ومايبوّظش الديسكتوب
//     ScrollTrigger.config({ ignoreMobileResize: true });

//     this.scrollEl = (document.scrollingElement || document.documentElement) as HTMLElement;

//     this.observeSectionsMobile();

//     window.addEventListener('S3_SNAP_LOCK', this.onS3Lock as any);

//     window.addEventListener('touchstart', this.onTouchStartMobile, { passive: true });
//     window.addEventListener('touchend', this.onTouchEndMobile, { passive: true });

//     // ✅ build points بعد refresh
//     ScrollTrigger.refresh(true);
//     this.buildSnapPositionsMobile();

//     // ✅ observer زي الديسكتوب (onStop)
//     this.initMobileObserver();

//     // resize handlers
//     this.lastVVH = (window.visualViewport?.height || window.innerHeight);
//     window.addEventListener('resize', this.onResizeMobile);
//     window.visualViewport?.addEventListener('resize', this.onResizeMobile);
//   }

//   private initMobileObserver() {
//     // kill old
//     try { this.mobileObserver?.kill?.(); } catch { }

//     this.mobileObserver = ScrollTrigger.observe({
//       target: window,
//       type: 'wheel,touch,scroll',
//       onDown: () => { this.lastDirMobile = 1; },
//       onUp: () => { this.lastDirMobile = -1; },
//       onStop: () => {
//         // ✅ نفس شروطنا القديمة
//         if (this.globalSnapLocked) return;
//         if (performance.now() < this.globalSnapLockUntil) return;
//         if (this.isTouchingMobile) return;
//         this.doSnapMobile();
//       },
//       onStopDelay: 0.22,
//     });

//     // لو Section3 قافل السناب العام بالفعل
//     if (this.globalSnapLocked) this.mobileObserver.disable();
//   }

//   private buildSnapPositionsMobile() {
//     const panels = gsap.utils.toArray<HTMLElement>('.panel');

//     this.snapPositions = [];
//     this.panelStartsMobile.clear();

//     // ✅ احسب البدايات بـ ScrollTrigger.start (أدق مع pinSpacing)
//     for (const panel of panels) {
//       const st = ScrollTrigger.create({
//         trigger: panel,
//         start: 'top top',
//         end: '+=1',
//         refreshPriority: -1,
//         invalidateOnRefresh: true,
//       });

//       const start = Math.round(st.start);
//       this.snapPositions.push(start);
//       this.panelStartsMobile.add(start);

//       st.kill();
//     }

//     // ✅ أهم نقطة: ضيف نهاية Pin بتاع Section3 كـ snap point
//     const st3 = ScrollTrigger.getById('AboutSection3Trigger-mobile') as any;

//     if (!st3) {
//       // Section3 trigger لسه ما اتبناش على بعض الأجهزة -> retry بسيط
//       if (this.s3WaitTries < 8) {
//         this.s3WaitTries++;
//         window.setTimeout(() => {
//           ScrollTrigger.refresh(true);
//           this.buildSnapPositionsMobile();
//         }, 180);
//       }
//     } else {
//       this.s3WaitTries = 0;
//       const s3End = Math.round(st3.end);
//       this.snapPositions.push(s3End);
//     }

//     // footer top
//     const footer = (document.querySelector('footer, app-footer, #footer, .footer') as HTMLElement | null);
//     this.footerTopMobile = footer
//       ? Math.round(footer.getBoundingClientRect().top + this.scrollEl.scrollTop)
//       : Number.POSITIVE_INFINITY;

//     // sort unique
//     this.snapPositions = Array.from(new Set(this.snapPositions)).sort((a, b) => a - b);

//     // console.log('✅ Mobile snap points:', this.snapPositions);
//   }

//   private doSnapMobile() {
//     if (!this.snapPositions.length) return;

//     if (this.globalSnapLocked) return;
//     if (performance.now() < this.globalSnapLockUntil) return;

//     if (this.isSnappingMobile) return;
//     if (gsap.isTweening(this.scrollEl)) return;

//     const current = this.scrollEl.scrollTop;
//     const vh = (window.visualViewport?.height || window.innerHeight);

//     // ✅ footer zone: لو نازل للفوتر سيبه (مايعملش snap)
//     const footerZoneStart = this.footerTopMobile - vh * 0.25;
//     if (current >= footerZoneStart && this.lastDirMobile > 0) return;

//     // ✅ nearest snap (binary search)
//     const arr = this.snapPositions;
//     let lo = 0, hi = arr.length - 1;

//     while (lo < hi) {
//       const mid = (lo + hi) >> 1;
//       if (arr[mid] < current) lo = mid + 1;
//       else hi = mid;
//     }

//     const next = arr[lo];
//     const prev = lo > 0 ? arr[lo - 1] : arr[0];

//     const dPrev = Math.abs(current - prev);
//     const dNext = Math.abs(next - current);
//     let target = dPrev <= dNext ? prev : next;

//     const dist = Math.abs(target - current);
//     if (dist <= 12) return;

//     // ✅ كسر التعليق بين 3 و4:
//     // لو واقف قريب من snapPoint بتاع نهاية Section3 -> اسناب له فورًا
//     // (ده بيطلعك من الـ dead-zone)
//     const st3 = ScrollTrigger.getById('AboutSection3Trigger-mobile') as any;
//     if (st3) {
//       const s3End = Math.round(st3.end);
//       if (Math.abs(current - s3End) <= vh * 0.65) {
//         target = s3End;
//       }
//     }

//     // offsets
//     const NAV_OFFSET = 0;     // لو عندك navbar ثابت حط قيمته (مثلاً 56)
//     const DOWN_OFFSET = 10;   // دخول بسيط جوه السكشن
//     const offset = this.lastDirMobile > 0 ? (DOWN_OFFSET + NAV_OFFSET) : NAV_OFFSET;

//     const targetPos =
//       this.panelStartsMobile.has(target) && target > 0
//         ? target + offset
//         : target;

//     this.isSnappingMobile = true;

//     gsap.to(this.scrollEl, {
//       scrollTo: targetPos,
//       duration: 0.75,
//       ease: 'power3.out',
//       overwrite: true,
//       onComplete: () => { this.isSnappingMobile = false; },
//       onInterrupt: () => { this.isSnappingMobile = false; },
//     });
//   }

//   private onResizeMobile = () => {
//     const h = (window.visualViewport?.height || window.innerHeight);

//     // ✅ تجاهل jitter بسيط (address bar)
//     if (Math.abs(h - this.lastVVH) < 22) return;
//     this.lastVVH = h;

//     if (this.mobileResizeT) clearTimeout(this.mobileResizeT);
//     this.mobileResizeT = setTimeout(() => {
//       ScrollTrigger.refresh(true);
//       this.buildSnapPositionsMobile();
//     }, 220);
//   };

//   // وفي ngOnDestroy ضيفي دول:
//   private destroyMobileSnap() {
//     try { this.mobileObserver?.kill?.(); } catch { }

//     window.removeEventListener('S3_SNAP_LOCK', this.onS3Lock as any);
//     window.removeEventListener('touchstart', this.onTouchStartMobile as any);
//     window.removeEventListener('touchend', this.onTouchEndMobile as any);

//     window.removeEventListener('resize', this.onResizeMobile);
//     window.visualViewport?.removeEventListener('resize', this.onResizeMobile);
//   }
//   // =================== END MOBILE SNAP ===================


//   // --- Desktop Implementation (Smoother) ---

//   private buildSnapPositions(smoother: any) {
//     const scroller = smoother.wrapper();
//     const panels = gsap.utils.toArray<HTMLElement>('.panel');

//     this.snapPositions = [];

//     panels.forEach((panel, index) => {
//       const st = ScrollTrigger.create({
//         trigger: panel,
//         scroller,
//         start: "top top",
//         refreshPriority: -1,
//       });

//       // Add section START position
//       this.snapPositions.push(st.start);

//       // For Section 3 (index 2) which is very long, also add the END
//       // This allows snapping to the end of Section 3 (start of Section 4)
//       if (index === 2) {
//         this.snapPositions.push(st.end);
//       }

//       console.log(`📌 Section ${index}: start=${st.start.toFixed(0)}, end=${st.end.toFixed(0)}`);

//       st.kill();
//     });

//     // Sort and remove duplicates
//     this.snapPositions = Array.from(new Set(this.snapPositions)).sort((a, b) => a - b);
//     console.log('✅ Final snap positions:', this.snapPositions.map(p => p.toFixed(0)));
//   }

//   private initSnapObserver(smoother: any) {
//     if (this.snapObserver) {
//       this.snapObserver.kill();
//     }

//     const scroller = smoother.wrapper();

//     this.snapObserver = ScrollTrigger.observe({
//       target: scroller,
//       onStop: () => {
//         this.doSnap();
//       },
//       onStopDelay: 0.7 // Keep 0.7s delay for Desktop
//     });
//   }

//   private doSnap() {
//     if (!this.smootherST || !this.smoother) return;
//     if (this.snapPositions.length === 0) return;

//     const currentScroll = this.smootherST.scroll();

//     // Check if we are past the last section (viewing footer)
//     // The last snap position is the start of the last section.
//     // If we scrolled significantly past it, assume we are heading to footer.
//     const lastSnapPoint = this.snapPositions[this.snapPositions.length - 1];
//     const footerThreshold = 200; // Buffer to allow "leaving" the last section

//     if (currentScroll > lastSnapPoint + footerThreshold) {
//       console.log('🦶 Viewing footer, skipping global snap');
//       return;
//     }

//     // Find nearest snap position
//     let nearest = this.snapPositions[0];
//     let minDistance = Math.abs(currentScroll - nearest);

//     for (const pos of this.snapPositions) {
//       const distance = Math.abs(currentScroll - pos);
//       if (distance < minDistance) {
//         minDistance = distance;
//         nearest = pos;
//       }
//     }

//     // Section 3 is at index 2, its END is at index 3
//     const section3Start = this.snapPositions[2] || 0;
//     const section3End = this.snapPositions[3] || 0;
//     const viewportHeight = window.innerHeight;

//     // Only skip global snap when DEEP inside Section 3
//     // Allow snap near the start (within 1 viewport) and near the end (within 1 viewport)
//     const deepInsideSection3 =
//       currentScroll > section3Start + viewportHeight &&
//       currentScroll < section3End - viewportHeight;

//     if (deepInsideSection3) {
//       console.log('🚫 Deep inside Section 3, skipping global snap');
//       return;
//     }

//     // Only snap if we're not already at the position
//     if (minDistance > 10) {
//       // Add small offset to trigger animations inside the section
//       // Only add offset when snapping to section START (not end of Section 3)
//       const SNAP_OFFSET = 50; // pixels to scroll into section
//       let targetPosition = nearest;

//       // Check if this is a section START (not section3End)
//       // Section 3 End is index 3, so we don't add offset for that
//       const isSection3End = nearest === section3End;
//       if (!isSection3End && nearest > 0) {
//         targetPosition = nearest + SNAP_OFFSET;
//       }

//       console.log(`✅ Snapping: ${currentScroll.toFixed(0)} → ${targetPosition.toFixed(0)} (distance: ${minDistance.toFixed(0)})`);
//       this.smoother.scrollTo(targetPosition, true);
//     } else {
//       console.log(`📍 Already at snap point: ${currentScroll.toFixed(0)}`);
//     }
//   }

//   // Desktop Navbar Color Observer
//   private observeSections(scroller: HTMLElement) {
//     const sections = gsap.utils.toArray<HTMLElement>('.panel');

//     sections.forEach((section) => {
//       const textColor = section.dataset['textcolor'] || 'var(--primary)';
//       const bgColor = section.dataset['bgcolor'] || 'var(--white)';

//       ScrollTrigger.create({
//         trigger: section,
//         scroller,
//         start: 'top 50%',
//         end: 'bottom 50%',
//         onEnter: () => {
//           this.navTheme.setColor(textColor);
//           this.navTheme.setBg(bgColor);
//         },
//         onEnterBack: () => {
//           this.navTheme.setColor(textColor);
//           this.navTheme.setBg(bgColor);
//         },
//       });
//     });
//   }

//   // Mobile Navbar Color Observer
//   private observeSectionsMobile() {
//     const sections = gsap.utils.toArray<HTMLElement>('.panel');

//     sections.forEach((section) => {
//       const textColor = section.dataset['textcolor'] || 'var(--primary)';
//       const bgColor = section.dataset['bgcolor'] || 'var(--white)';

//       ScrollTrigger.create({
//         trigger: section,
//         start: 'top 10%',
//         end: 'bottom 50%',
//         onEnter: () => {
//           this.navTheme.setColor(textColor);
//           this.navTheme.setBg(bgColor);
//         },
//         onEnterBack: () => {
//           this.navTheme.setColor(textColor);
//           this.navTheme.setBg(bgColor);
//         },
//       });
//     });
//   }

//   private onResize = () => {
//     ScrollTrigger.refresh();
//     if (this.smoother) {
//       setTimeout(() => this.buildSnapPositions(this.smoother), 100);
//     }
//     this.ngZone.run(() => {
//       this.cdr.detectChanges();
//     });
//   };

//   ngOnDestroy(): void {
//     this.sectionsRegistry.clear();
//     this.sectionsRegistry.disable();

//     if (this.isBrowser) {
//       try {
//         window.removeEventListener('resize', this.onResize);
//         window.removeEventListener('resize', this.onResizeMobile);
//       } catch { }

//       try { this.snapObserver?.kill?.(); } catch { }

//       if (this.isMobile) {
//         this.destroyMobileSnap();
//       }

//       if (this.isBrowser && this.isMobile) this.destroyMobileSnap();



//       this.ctx?.revert();
//     }
//   }
// }
//old
// import {
//   Component,
//   Inject,
//   PLATFORM_ID,
//   NgZone,
//   ChangeDetectorRef,
// } from '@angular/core';
// import { CommonModule, isPlatformBrowser } from '@angular/common';
// import gsap from 'gsap';
// import ScrollTrigger from 'gsap/ScrollTrigger';
// import ScrollSmoother from 'gsap/ScrollSmoother';
// import { BehaviorSubject } from 'rxjs';
// import { NavbarThemeService } from '../../components/navbar/navbar-theme.service';
// import { SectionsRegistryService } from "../../shared/services/sections-registry.service";
// import ScrollToPlugin from 'gsap/ScrollToPlugin';

// import { AboutSection1Component } from "./about-section1/about-section1.component";
// import { AboutSection2Component } from "./about-section2/about-section2.component";
// import { AboutSection3Component } from "./about-section3/about-section3.component";
// import { AboutSection4Component } from "./about-section4/about-section4.component";
// import { AboutSection5Component } from "./about-section5/about-section5.component";
// import { SeoLinkService } from '../../services/seo-link.service';

// gsap.registerPlugin(ScrollTrigger, ScrollSmoother, ScrollToPlugin);

// @Component({
//   selector: 'app-about',
//   imports: [
//     AboutSection1Component,
//     AboutSection2Component,
//     AboutSection3Component,
//     CommonModule,
//     AboutSection4Component,
//     AboutSection5Component
//   ],
//   templateUrl: './about.component.html',
//   styleUrl: './about.component.scss'
// })
// export class AboutComponent {
//   private visibilitySubject = new BehaviorSubject<'visible' | 'invisible'>('visible');
//   visibility$ = this.visibilitySubject.asObservable();
//   visibilityState: 'visible' | 'invisible' = 'visible';

//   menuOpen = false;
//   isBrowser: boolean;
//   isMobile!: boolean;

//   private ctx?: gsap.Context;

//   // Snap properties
//   private snapObserver?: any;
//   private snapPositions: number[] = [];
//   private smoother: any;
//   private smootherST: any;

//   // ✅ NEW: Desktop snap debounce (to catch scrollbar drag end too)
//   private desktopSnapDC?: gsap.core.Tween;
//   private lastSnapAtMobile = 0;
//   private readonly SNAP_COOLDOWN = 480; // ms
//   private readonly DEAD_ZONE = 32;       // px
//   private footerPassedOnce = false;


//   constructor(
//     @Inject(PLATFORM_ID) private platformId: Object,
//     private ngZone: NgZone,
//     private cdr: ChangeDetectorRef,
//     private navTheme: NavbarThemeService,
//     private sectionsRegistry: SectionsRegistryService,
//     private seoLinks: SeoLinkService
//   ) {
//     this.isBrowser = isPlatformBrowser(this.platformId);
//   }

//   ngOnInit() {
//     if (!this.isBrowser) return;
//     this.isMobile = window.matchMedia('(max-width: 767px)').matches;
//   }

//   ngAfterViewInit(): void {
//     if (!this.isBrowser) return;

//     // Separate paths for Mobile vs Desktop
//     if (this.isMobile) {
//       this.mobileInitTimer = setTimeout(() => {
//         // ✅ Wrap in context for proper cleanup of triggers
//         this.ctx = gsap.context(() => {
//           this.initMobileSnap();
//         });
//       }, 750);
//       return;
//     }

//     // Desktop: wait for smoother and set up
//     this.ngZone.runOutsideAngular(() => {
//       this.waitForSmoother((smoother) => {
//         this.smoother = smoother;
//         this.smootherST = smoother.scrollTrigger;

//         this.ctx = gsap.context(() => {
//           this.initDesktop(smoother);
//         });
//       });
//     });
//   }



//   private waitForSmoother(cb: (s: any) => void) {
//     const start = performance.now();
//     const tick = () => {
//       const s = ScrollSmoother.get() as any;
//       if (s) return cb(s);
//       if (performance.now() - start < 3000) requestAnimationFrame(tick);
//     };
//     tick();
//   }

//   // ✅ NEW: request snap with SAME desktop feel (0.7s)
//   private requestDesktopSnap = () => {
//     if (!this.smootherST || !this.smoother) return;
//     if (!this.snapPositions.length) return;

//     // keep desktop "feel": same delay as observe onStopDelay = 0.7
//     this.desktopSnapDC?.kill();
//     this.desktopSnapDC = gsap.delayedCall(0.7, () => this.doSnap());
//   };

//   // ✅ NEW: scrollEnd catches scrollbar drag (and other native scroll end)
//   private onDesktopScrollEnd = () => {
//     this.requestDesktopSnap();
//   };

//   private initDesktop(smoother: any) {
//     const scroller = smoother.wrapper();

//     // Navbar colors triggers
//     this.observeSections(scroller);

//     // Resize handler
//     window.addEventListener('resize', this.onResize);

//     // ✅ NEW: catch scrollbar-drag end without changing feel
//     ScrollTrigger.addEventListener('scrollEnd', this.onDesktopScrollEnd);

//     // Build snap positions and setup observer after everything is ready
//     setTimeout(() => {
//       ScrollTrigger.refresh();
//       this.buildSnapPositions(smoother);
//       this.initSnapObserver(smoother);
//     }, 600);
//   }

//   // =================== MOBILE SNAP (STABLE ON REAL DEVICES) ===================
//   private scrollEl!: HTMLElement;
//   private mobileObserver?: any;

//   private panelStartsMobile = new Set<number>();
//   private footerTopMobile = Number.POSITIVE_INFINITY;

//   private lastDirMobile: 1 | -1 = 1;
//   private isSnappingMobile = false;
//   private isTouchingMobile = false;

//   private globalSnapLocked = false;
//   private globalSnapLockUntil = 0;

//   private lastVVH = 0;
//   private mobileResizeT: any = null;
//   private mobileInitTimer: any = null;

//   // مهم: علشان لو Section3 trigger لسه ما اتبناش وقت build
//   private s3WaitTries = 0;

//   // from Section3 to lock/unlock global snap
//   private onS3Lock = (e: Event) => {
//     const ce = e as CustomEvent<{ locked?: boolean; cooldownMs?: number }>;
//     const locked = !!ce.detail?.locked;
//     const cooldownMs = ce.detail?.cooldownMs ?? 0;

//     this.globalSnapLocked = locked;

//     if (locked) {
//       // ✅ وقف السناب العام فورًا أثناء pin Section3
//       this.mobileObserver?.disable?.();
//       return;
//     }

//     // ✅ بعد الخروج من Section3: cooldown + rebuild positions + رجّع observer
//     const until = performance.now() + cooldownMs;
//     this.globalSnapLockUntil = Math.max(this.globalSnapLockUntil, until);

//     window.setTimeout(() => {
//       ScrollTrigger.refresh(true);
//       this.buildSnapPositionsMobile();
//       this.mobileObserver?.enable?.();
//     }, cooldownMs + 120);
//   };

//   private onTouchStartMobile = () => { this.isTouchingMobile = true; };
//   private onTouchEndMobile = () => { this.isTouchingMobile = false; };

//   private initMobileSnap() {
//     // ✅ مهم جدًا للموبايل الحقيقي (address bar) — ومايبوّظش الديسكتوب
//     ScrollTrigger.config({ ignoreMobileResize: true });

//     this.scrollEl = (document.scrollingElement || document.documentElement) as HTMLElement;

//     this.observeSectionsMobile();

//     window.addEventListener('S3_SNAP_LOCK', this.onS3Lock as any);

//     window.addEventListener('touchstart', this.onTouchStartMobile, { passive: true });
//     window.addEventListener('touchend', this.onTouchEndMobile, { passive: true });

//     // ✅ build points بعد refresh
//     ScrollTrigger.refresh(true);
//     this.buildSnapPositionsMobile();

//     // ✅ observer زي الديسكتوب (onStop)
//     this.initMobileObserver();

//     // resize handlers
//     this.lastVVH = (window.visualViewport?.height || window.innerHeight);
//     window.addEventListener('resize', this.onResizeMobile);
//     window.visualViewport?.addEventListener('resize', this.onResizeMobile);
//     this.footerPassedOnce = false;

//   }

//   private initMobileObserver() {
//     // kill old
//     try { this.mobileObserver?.kill?.(); } catch { }

//     this.mobileObserver = ScrollTrigger.observe({
//       target: window,
//       type: 'wheel,touch,scroll',
//       onDown: () => { this.lastDirMobile = 1; },
//       onUp: () => { this.lastDirMobile = -1; },
//       onStop: () => {
//         // ✅ نفس شروطنا القديمة
//         if (this.globalSnapLocked) return;
//         if (performance.now() < this.globalSnapLockUntil) return;
//         if (this.isTouchingMobile) return;
//         this.doSnapMobile();
//       },
//       onStopDelay: 0.22,
//     });

//     // لو Section3 قافل السناب العام بالفعل
//     if (this.globalSnapLocked) this.mobileObserver.disable();
//   }

//   private buildSnapPositionsMobile() {
//     const panels = gsap.utils.toArray<HTMLElement>('.panel');

//     this.snapPositions = [];
//     this.panelStartsMobile.clear();

//     // ✅ احسب البدايات بـ ScrollTrigger.start (أدق مع pinSpacing)
//     for (const panel of panels) {
//       const st = ScrollTrigger.create({
//         trigger: panel,
//         start: 'top top',
//         end: '+=1',
//         refreshPriority: -1,
//         invalidateOnRefresh: true,
//       });

//       const start = Math.round(st.start);
//       this.snapPositions.push(start);
//       this.panelStartsMobile.add(start);

//       st.kill();
//     }

//     // ✅ أهم نقطة: ضيف نهاية Pin بتاع Section3 كـ snap point
//     const st3 = ScrollTrigger.getById('AboutSection3Trigger-mobile') as any;

//     if (!st3) {
//       // Section3 trigger لسه ما اتبناش على بعض الأجهزة -> retry بسيط
//       if (this.s3WaitTries < 8) {
//         this.s3WaitTries++;
//         window.setTimeout(() => {
//           ScrollTrigger.refresh(true);
//           this.buildSnapPositionsMobile();
//         }, 180);
//       }
//     } else {
//       this.s3WaitTries = 0;
//       const s3End = Math.round(st3.end);
//       this.snapPositions.push(s3End);
//     }

//     // footer top
//     const footer = (document.querySelector('footer, app-footer, #footer, .footer') as HTMLElement | null);
//     this.footerTopMobile = footer
//       ? Math.round(footer.getBoundingClientRect().top + this.scrollEl.scrollTop)
//       : Number.POSITIVE_INFINITY;

//     // sort unique
//     this.snapPositions = Array.from(new Set(this.snapPositions)).sort((a, b) => a - b);
//   }

//   // private doSnapMobile() {
//   //   if (!this.snapPositions.length) return;

//   //   if (this.globalSnapLocked) return;
//   //   if (performance.now() < this.globalSnapLockUntil) return;

//   //   if (this.isSnappingMobile) return;
//   //   if (gsap.isTweening(this.scrollEl)) return;

//   //   const current = this.scrollEl.scrollTop;
//   //   const vh = (window.visualViewport?.height || window.innerHeight);

//   //   // ✅ footer zone: if approaching footer, stop snapping
//   //   const footerZoneStart = this.footerTopMobile - vh * 0.25;
//   //   if (current >= footerZoneStart && this.lastDirMobile > 0) return;

//   //   // ✅ LAST SECTION GUARD:
//   //   // If we are deep inside the last section (more than 150px), DO NOT snap back to its start.
//   //   // This allows free scrolling to the footer.
//   //   const lastSnap = this.snapPositions[this.snapPositions.length - 1];
//   //   if (current > lastSnap + 50) {
//   //     return;
//   //   }

//   //   // ✅ nearest snap (binary search)
//   //   const arr = this.snapPositions;
//   //   let lo = 0, hi = arr.length - 1;

//   //   while (lo < hi) {
//   //     const mid = (lo + hi) >> 1;
//   //     if (arr[mid] < current) lo = mid + 1;
//   //     else hi = mid;
//   //   }

//   //   const next = arr[lo];
//   //   const prev = lo > 0 ? arr[lo - 1] : arr[0];

//   //   const dPrev = Math.abs(current - prev);
//   //   const dNext = Math.abs(next - current);
//   //   let target = dPrev <= dNext ? prev : next;

//   //   const dist = Math.abs(target - current);
//   //   if (dist <= 12) return;

//   //   // ✅ كسر التعليق بين 3 و4:
//   //   const st3 = ScrollTrigger.getById('AboutSection3Trigger-mobile') as any;
//   //   if (st3) {
//   //     const s3End = Math.round(st3.end);
//   //     if (Math.abs(current - s3End) <= vh * 0.65) {
//   //       target = s3End;
//   //     }
//   //   }

//   //   // offsets
//   //   const NAV_OFFSET = 0;
//   //   const DOWN_OFFSET = 10;
//   //   const offset = this.lastDirMobile > 0 ? (DOWN_OFFSET + NAV_OFFSET) : NAV_OFFSET;

//   //   const targetPos =
//   //     this.panelStartsMobile.has(target) && target > 0
//   //       ? target + offset
//   //       : target;

//   //   this.isSnappingMobile = true;

//   //   gsap.to(this.scrollEl, {
//   //     scrollTo: targetPos,
//   //     duration: 0.75,
//   //     ease: 'power3.out',
//   //     overwrite: true,
//   //     onComplete: () => { this.isSnappingMobile = false; },
//   //     onInterrupt: () => { this.isSnappingMobile = false; },
//   //   });
//   // }
//   private doSnapMobile() {
//     if (!this.snapPositions.length) return;

//     // ❌ global locks
//     if (this.globalSnapLocked) return;
//     if (performance.now() < this.globalSnapLockUntil) return;

//     // ❌ already snapping or tweening
//     if (this.isSnappingMobile) return;
//     if (gsap.isTweening(this.scrollEl)) return;

//     const now = performance.now();
//     if (now - this.lastSnapAtMobile < this.SNAP_COOLDOWN) return;

//     const current = this.scrollEl.scrollTop;
//     const vh = window.visualViewport?.height || window.innerHeight;

//     /* ================= FOOTER HARD ESCAPE ================= */
//     const footerZoneStart = this.footerTopMobile - vh * 0.35;

//     if (current >= footerZoneStart && this.lastDirMobile > 0) {
//       this.footerPassedOnce = true;
//       return;
//     }

//     // once footer is passed → never snap again
//     if (this.footerPassedOnce) return;

//     /* ================= LAST SECTION FREE SCROLL ================= */
//     const lastSnap = this.snapPositions[this.snapPositions.length - 1];
//     if (current > lastSnap + 60) return;

//     /* ================= FIND NEAREST SNAP ================= */
//     const arr = this.snapPositions;
//     let lo = 0, hi = arr.length - 1;

//     while (lo < hi) {
//       const mid = (lo + hi) >> 1;
//       if (arr[mid] < current) lo = mid + 1;
//       else hi = mid;
//     }

//     const next = arr[lo];
//     const prev = lo > 0 ? arr[lo - 1] : arr[0];

//     let target =
//       Math.abs(current - prev) <= Math.abs(next - current)
//         ? prev
//         : next;

//     const dist = Math.abs(target - current);
//     if (dist <= this.DEAD_ZONE) return;

//     /* ================= SECTION 3 SPECIAL CASE ================= */
//     const st3 = ScrollTrigger.getById('AboutSection3Trigger-mobile') as any;
//     if (st3) {
//       const s3End = Math.round(st3.end);
//       if (Math.abs(current - s3End) <= vh * 0.6) {
//         target = s3End;
//       }
//     }

//     /* ================= OFFSET LOGIC ================= */
//     const DOWN_OFFSET = 12;
//     const offset = this.lastDirMobile > 0 ? DOWN_OFFSET : 0;

//     const targetPos =
//       this.panelStartsMobile.has(target) && target > 0
//         ? target + offset
//         : target;

//     /* ================= SNAP ================= */
//     this.isSnappingMobile = true;
//     this.lastSnapAtMobile = now;

//     gsap.to(this.scrollEl, {
//       scrollTo: targetPos,
//       duration: 0.75,
//       ease: 'power3.out',
//       overwrite: true,
//       onComplete: () => { this.isSnappingMobile = false; },
//       onInterrupt: () => { this.isSnappingMobile = false; },
//     });
//   }

//   private onResizeMobile = () => {
//     const h = (window.visualViewport?.height || window.innerHeight);

//     // ✅ تجاهل jitter بسيط (address bar)
//     if (Math.abs(h - this.lastVVH) < 28) return;

//     this.lastVVH = h;

//     if (this.mobileResizeT) clearTimeout(this.mobileResizeT);
//     this.mobileResizeT = setTimeout(() => {
//       ScrollTrigger.refresh(true);
//       this.buildSnapPositionsMobile();
//     }, 220);
//   };

//   private destroyMobileSnap() {
//     try { this.mobileObserver?.kill?.(); } catch { }

//     window.removeEventListener('S3_SNAP_LOCK', this.onS3Lock as any);
//     window.removeEventListener('touchstart', this.onTouchStartMobile as any);
//     window.removeEventListener('touchend', this.onTouchEndMobile as any);

//     window.removeEventListener('resize', this.onResizeMobile);
//     window.visualViewport?.removeEventListener('resize', this.onResizeMobile);
//   }
//   // =================== END MOBILE SNAP ===================


//   // --- Desktop Implementation (Smoother) ---

//   private buildSnapPositions(smoother: any) {
//     const scroller = smoother.wrapper();
//     const panels = gsap.utils.toArray<HTMLElement>('.panel');

//     this.snapPositions = [];

//     panels.forEach((panel, index) => {
//       const st = ScrollTrigger.create({
//         trigger: panel,
//         scroller,
//         start: "top top",
//         refreshPriority: -1,
//       });

//       // Add section START position
//       this.snapPositions.push(st.start);

//       // For Section 3 (index 2) which is very long, also add the END
//       if (index === 2) {
//         this.snapPositions.push(st.end);
//       }

//       st.kill();
//     });

//     // Sort and remove duplicates
//     this.snapPositions = Array.from(new Set(this.snapPositions)).sort((a, b) => a - b);
//   }

//   private initSnapObserver(smoother: any) {
//     if (this.snapObserver) {
//       this.snapObserver.kill();
//     }

//     const scroller = smoother.wrapper();

//     // ✅ نفس إحساس الديسكتوب (onStopDelay 0.7) — كما هو
//     this.snapObserver = ScrollTrigger.observe({
//       target: scroller,
//       onStop: () => {
//         // بدل doSnap مباشرة: نخليها نفس سلوك scrollEnd (debounced)
//         this.requestDesktopSnap();
//       },
//       onStopDelay: 0.7
//     });
//   }

//   private doSnap() {
//     if (!this.smootherST || !this.smoother) return;
//     if (this.snapPositions.length === 0) return;

//     const currentScroll = this.smootherST.scroll();

//     // Footer threshold logic
//     const lastSnapPoint = this.snapPositions[this.snapPositions.length - 1];
//     const footerThreshold = 200;

//     if (currentScroll > lastSnapPoint + footerThreshold) {
//       return;
//     }

//     // Find nearest snap position
//     let nearest = this.snapPositions[0];
//     let minDistance = Math.abs(currentScroll - nearest);

//     for (const pos of this.snapPositions) {
//       const distance = Math.abs(currentScroll - pos);
//       if (distance < minDistance) {
//         minDistance = distance;
//         nearest = pos;
//       }
//     }

//     // Section 3 positions (start & end)
//     const section3Start = this.snapPositions[2] || 0;
//     const section3End = this.snapPositions[3] || 0;
//     const viewportHeight = window.innerHeight;

//     const deepInsideSection3 =
//       currentScroll > section3Start + viewportHeight &&
//       currentScroll < section3End - viewportHeight;

//     if (deepInsideSection3) return;

//     // Only snap if we're not already at the position
//     if (minDistance > 10) {
//       const SNAP_OFFSET = 120; // ✅ Increased offset to enter section deeper for animations

//       // ✅ NEW: safe offset (still 50px feel, but never overshoots next section)
//       const idx = this.snapPositions.indexOf(nearest);
//       const nextSnap = (idx >= 0 && idx < this.snapPositions.length - 1) ? this.snapPositions[idx + 1] : nearest;
//       const maxAllowedOffset = Math.max(0, nextSnap - nearest - 20); // keep 20px buffer
//       const safeOffset = Math.min(SNAP_OFFSET, maxAllowedOffset);

//       const isSection3End = nearest === section3End;

//       let targetPosition = nearest;

//       // add offset only for section starts (not section3End)
//       if (!isSection3End && nearest > 0 && safeOffset >= 8) {
//         targetPosition = nearest + safeOffset;
//       }

//       this.smoother.scrollTo(targetPosition, true);
//     }
//   }

//   // Desktop Navbar Color Observer
//   private observeSections(scroller: HTMLElement) {
//     const sections = gsap.utils.toArray<HTMLElement>('.panel');

//     sections.forEach((section) => {
//       const textColor = section.dataset['textcolor'] || 'var(--primary)';
//       const bgColor = section.dataset['bgcolor'] || 'var(--white)';

//       ScrollTrigger.create({
//         trigger: section,
//         scroller,
//         start: 'top 50%',
//         end: 'bottom 50%',
//         onEnter: () => {
//           this.navTheme.setColor(textColor);
//           this.navTheme.setBg(bgColor);
//         },
//         onEnterBack: () => {
//           this.navTheme.setColor(textColor);
//           this.navTheme.setBg(bgColor);
//         },
//       });
//     });
//   }

//   // Mobile Navbar Color Observer
//   private observeSectionsMobile() {
//     const sections = gsap.utils.toArray<HTMLElement>('.panel');

//     sections.forEach((section) => {
//       const textColor = section.dataset['textcolor'] || 'var(--primary)';
//       const bgColor = section.dataset['bgcolor'] || 'var(--white)';

//       ScrollTrigger.create({
//         trigger: section,
//         start: 'top 10%',
//         end: 'bottom 50%',
//         onEnter: () => {
//           this.navTheme.setColor(textColor);
//           this.navTheme.setBg(bgColor);
//         },
//         onEnterBack: () => {
//           this.navTheme.setColor(textColor);
//           this.navTheme.setBg(bgColor);
//         },
//       });
//     });
//   }

//   private onResize = () => {
//     ScrollTrigger.refresh();
//     if (this.smoother) {
//       setTimeout(() => this.buildSnapPositions(this.smoother), 100);
//     }
//     this.ngZone.run(() => {
//       this.cdr.detectChanges();
//     });
//   };

//   ngOnDestroy(): void {
//     this.sectionsRegistry.clear();
//     this.sectionsRegistry.disable();

//     if (this.mobileInitTimer) {
//       clearTimeout(this.mobileInitTimer);
//     }

//     if (!this.isBrowser) return;

//     // ✅ remove desktop listeners
//     try { window.removeEventListener('resize', this.onResize); } catch { }
//     try { ScrollTrigger.removeEventListener('scrollEnd', this.onDesktopScrollEnd); } catch { }
//     try { this.snapObserver?.kill?.(); } catch { }
//     this.desktopSnapDC?.kill();

//     // ✅ mobile cleanup
//     this.destroyMobileSnap();

//     // ✅ Revert GSAP context (kills triggers created inside it)
//     this.ctx?.revert();

//     // ✅ Final Safety: Kill ALL ScrollTriggers
//     ScrollTrigger.getAll().forEach(t => t.kill());
//   }
// }
//تاني فرجن شغاله 
// import {
//   Component,
//   Inject,
//   PLATFORM_ID,
//   NgZone,
//   ChangeDetectorRef,
// } from '@angular/core';
// import { CommonModule, isPlatformBrowser } from '@angular/common';
// import gsap from 'gsap';
// import ScrollTrigger from 'gsap/ScrollTrigger';
// import ScrollSmoother from 'gsap/ScrollSmoother';
// import ScrollToPlugin from 'gsap/ScrollToPlugin';
// import { BehaviorSubject } from 'rxjs';

// import { NavbarThemeService } from '../../components/navbar/navbar-theme.service';
// import { SectionsRegistryService } from '../../shared/services/sections-registry.service';

// import { AboutSection1Component } from './about-section1/about-section1.component';
// import { AboutSection2Component } from './about-section2/about-section2.component';
// import { AboutSection3Component } from './about-section3/about-section3.component';
// import { AboutSection4Component } from './about-section4/about-section4.component';
// import { AboutSection5Component } from './about-section5/about-section5.component';

// import { SeoLinkService } from '../../services/seo-link.service';
// import { PreloadService } from '../../services/preload.service';

// @Component({
//   selector: 'app-about',
//   imports: [
//     AboutSection1Component,
//     AboutSection2Component,
//     AboutSection3Component,
//     CommonModule,
//     AboutSection4Component,
//     AboutSection5Component,
//   ],
//   templateUrl: './about.component.html',
//   styleUrl: './about.component.scss',
// })
// export class AboutComponent {
//   private static pluginsRegistered = false;

//   private visibilitySubject = new BehaviorSubject<'visible' | 'invisible'>('visible');
//   visibility$ = this.visibilitySubject.asObservable();
//   visibilityState: 'visible' | 'invisible' = 'visible';

//   menuOpen = false;
//   isBrowser: boolean;
//   isMobile!: boolean;

//   private ctx?: gsap.Context;

//   // Desktop snap
//   private snapObserver?: any;
//   private snapPositions: number[] = [];
//   private smoother: any;
//   private smootherST: any;
//   private desktopSnapDC?: gsap.core.Tween;

//   constructor(
//     @Inject(PLATFORM_ID) private platformId: Object,
//     private ngZone: NgZone,
//     private cdr: ChangeDetectorRef,
//     private navTheme: NavbarThemeService,
//     private sectionsRegistry: SectionsRegistryService,
//     private seoLinks: SeoLinkService,
//     private preloadService: PreloadService
//   ) {
//     this.isBrowser = isPlatformBrowser(this.platformId);
//   }

//   ngOnInit() {
//     if (!this.isBrowser) return;

//     // ✅ SSR-safe plugins register
//     if (!AboutComponent.pluginsRegistered) {
//       gsap.registerPlugin(ScrollTrigger, ScrollSmoother, ScrollToPlugin);
//       AboutComponent.pluginsRegistered = true;
//     }

//     this.isMobile = window.matchMedia('(max-width: 767px)').matches;

//     // (اختياري) preload — طالما isBrowser true
//     this.preloadService.addPreloads([
//       { href: '/About us/assetsafarihigh.mp4', as: 'video' },
//       { href: '/About us/Nested Sequence 02safari.mp4', as: 'video' },
//       { href: '/About us/Vertical about us copy1.jpg', as: 'image', media: '(max-width: 767px)' },
//       { href: '/About us/Vertical about us copy2.jpg', as: 'image', media: '(max-width: 767px)' },
//       { href: '/About us/Vertical about us copy3.jpg', as: 'image', media: '(max-width: 767px)' },
//     ]);
//   }

//   ngAfterViewInit(): void {
//     if (!this.isBrowser) return;

//     if (this.isMobile) {
//       this.mobileInitTimer = setTimeout(() => {
//         this.ctx = gsap.context(() => {
//           this.initMobileSnapStable();
//         });
//       }, 520);
//       return;
//     }

//     // Desktop path
//     this.ngZone.runOutsideAngular(() => {
//       this.waitForSmoother((smoother) => {
//         this.smoother = smoother;
//         this.smootherST = smoother.scrollTrigger;

//         this.ctx = gsap.context(() => {
//           this.initDesktop(smoother);
//         });
//       });
//     });
//   }

//   private waitForSmoother(cb: (s: any) => void) {
//     const start = performance.now();
//     const tick = () => {
//       const s = ScrollSmoother.get() as any;
//       if (s) return cb(s);
//       if (performance.now() - start < 3500) requestAnimationFrame(tick);
//     };
//     tick();
//   }

//   // =========================
//   // ✅ DESKTOP (unchanged)
//   // =========================
//   private requestDesktopSnap = () => {
//     if (!this.smootherST || !this.smoother) return;
//     if (!this.snapPositions.length) return;

//     this.desktopSnapDC?.kill();
//     this.desktopSnapDC = gsap.delayedCall(0.7, () => this.doSnap());
//   };

//   private onDesktopScrollEnd = () => {
//     this.requestDesktopSnap();
//   };

//   private initDesktop(smoother: any) {
//     const scroller = smoother.wrapper();

//     this.observeSections(scroller);

//     window.addEventListener('resize', this.onResize);
//     ScrollTrigger.addEventListener('scrollEnd', this.onDesktopScrollEnd);

//     setTimeout(() => {
//       ScrollTrigger.refresh();
//       this.buildSnapPositions(smoother);
//       this.initSnapObserver(smoother);
//     }, 600);
//   }

//   private buildSnapPositions(smoother: any) {
//     const scroller = smoother.wrapper();
//     const panels = gsap.utils.toArray<HTMLElement>('.panel');

//     this.snapPositions = [];

//     panels.forEach((panel, index) => {
//       const st = ScrollTrigger.create({
//         trigger: panel,
//         scroller,
//         start: 'top top',
//         refreshPriority: -1,
//       });

//       this.snapPositions.push(st.start);

//       // Section3 end
//       if (index === 2) {
//         this.snapPositions.push(st.end);
//       }

//       st.kill();
//     });

//     this.snapPositions = Array.from(new Set(this.snapPositions)).sort((a, b) => a - b);
//   }

//   private initSnapObserver(smoother: any) {
//     if (this.snapObserver) this.snapObserver.kill();

//     const scroller = smoother.wrapper();

//     this.snapObserver = ScrollTrigger.observe({
//       target: scroller,
//       onStop: () => this.requestDesktopSnap(),
//       onStopDelay: 0.7,
//     });
//   }

//   private doSnap() {
//     if (!this.smootherST || !this.smoother) return;
//     if (!this.snapPositions.length) return;

//     const currentScroll = this.smootherST.scroll();
//     const lastSnapPoint = this.snapPositions[this.snapPositions.length - 1];
//     if (currentScroll > lastSnapPoint + 200) return;

//     let nearest = this.snapPositions[0];
//     let minDistance = Math.abs(currentScroll - nearest);

//     for (const pos of this.snapPositions) {
//       const d = Math.abs(currentScroll - pos);
//       if (d < minDistance) {
//         minDistance = d;
//         nearest = pos;
//       }
//     }

//     const section3Start = this.snapPositions[2] || 0;
//     const section3End = this.snapPositions[3] || 0;
//     const vh = window.innerHeight;

//     const deepInsideSection3 =
//       currentScroll > section3Start + vh &&
//       currentScroll < section3End - vh;

//     if (deepInsideSection3) return;

//     if (minDistance > 10) {
//       const SNAP_OFFSET = 120;
//       const idx = this.snapPositions.indexOf(nearest);
//       const nextSnap = (idx >= 0 && idx < this.snapPositions.length - 1) ? this.snapPositions[idx + 1] : nearest;
//       const maxAllowedOffset = Math.max(0, nextSnap - nearest - 20);
//       const safeOffset = Math.min(SNAP_OFFSET, maxAllowedOffset);

//       const isSection3End = nearest === section3End;
//       let target = nearest;

//       if (!isSection3End && nearest > 0 && safeOffset >= 8) {
//         target = nearest + safeOffset;
//       }

//       this.smoother.scrollTo(target, true);
//     }
//   }

//   private observeSections(scroller: HTMLElement) {
//     const sections = gsap.utils.toArray<HTMLElement>('.panel');

//     sections.forEach((section) => {
//       const textColor = section.dataset['textcolor'] || 'var(--primary)';
//       const bgColor = section.dataset['bgcolor'] || 'var(--white)';

//       ScrollTrigger.create({
//         trigger: section,
//         scroller,
//         start: 'top 50%',
//         end: 'bottom 50%',
//         onEnter: () => { this.navTheme.setColor(textColor); this.navTheme.setBg(bgColor); },
//         onEnterBack: () => { this.navTheme.setColor(textColor); this.navTheme.setBg(bgColor); },
//       });
//     });
//   }

//   private onResize = () => {
//     ScrollTrigger.refresh();
//     if (this.smoother) {
//       setTimeout(() => this.buildSnapPositions(this.smoother), 100);
//     }
//     this.ngZone.run(() => this.cdr.detectChanges());
//   };

//   // =========================
//   // ✅ MOBILE (STABLE)
//   // =========================

//   private readonly FOOTER_SELECTOR = 'app-footer, #site-footer, footer, #footer, .footer';

//   private mobileInitTimer: any = null;
//   private mobileResizeT: any = null;
//   private mobileScrollStopT: any = null;

//   private scrollEl!: HTMLElement;

//   private panelStartsMobile: number[] = []; // sorted starts
//   private panelStartsSet = new Set<number>();

//   private lastDirMobile: 1 | -1 = 1;
//   private lastScrollTopMobile = 0;

//   private isSnappingMobile = false;
//   private isTouchingMobile = false;
//   private isProgrammaticMobile = false;

//   private lastSnapAtMobile = 0;
//   private lastSnappedPosMobile = -999999;
//   private lastSnapIndexMobile = 0;

//   private footerMode = false;
//   private footerTop = Number.POSITIVE_INFINITY;
//   private footerEnterY = Number.POSITIVE_INFINITY;
//   private footerExitY = Number.POSITIVE_INFINITY;

//   private lastVVH = 0;

//   // language weight
//   private isEnglishUI = false;
//   private s3AssistRatio = 0.62;      // lighter EN
//   private s3DeepStartFactor = 0.90;  // disable snap deep inside
//   private s3DeepEndFactor = 0.90;

//   // tweakables
//   private readonly SNAP_COOLDOWN_MS = 320;
//   private readonly DEAD_ZONE_PX = 18;

//   private initMobileSnapStable() {
//     ScrollTrigger.config({ ignoreMobileResize: true });

//     this.scrollEl = (document.scrollingElement || document.documentElement) as HTMLElement;

//     // language weight
//     const html = document.documentElement;
//     const lang = (html.getAttribute('lang') || '').toLowerCase();
//     const dir = (html.getAttribute('dir') || '').toLowerCase();
//     this.isEnglishUI = lang.startsWith('en') || dir === 'ltr';
//     this.s3AssistRatio = this.isEnglishUI ? 0.52 : 0.62;
//     this.s3DeepStartFactor = this.isEnglishUI ? 0.85 : 0.90;
//     this.s3DeepEndFactor = this.isEnglishUI ? 0.85 : 0.90;

//     // Navbar theme observers (mobile)
//     this.observeSectionsMobile();

//     // build initial anchors
//     this.rebuildMobileAnchors();

//     // init direction
//     this.lastScrollTopMobile = this.getScrollTop();

//     // listeners (NO Observer)
//     window.addEventListener('scroll', this.onMobileScroll, { passive: true });
//     window.addEventListener('touchstart', this.onTouchStartMobile, { passive: true });
//     window.addEventListener('touchend', this.onTouchEndMobile, { passive: true });

//     this.lastVVH = (window.visualViewport?.height || window.innerHeight);
//     window.addEventListener('resize', this.onResizeMobile, { passive: true });
//     window.visualViewport?.addEventListener('resize', this.onResizeMobile as any, { passive: true } as any);

//     // small delayed rebuild (once) to catch late images/fonts WITHOUT killing footer
//     setTimeout(() => {
//       const vh = (window.visualViewport?.height || window.innerHeight);
//       const y = this.getScrollTop();
//       if (y < vh * 1.4 && !this.isTouchingMobile) {
//         this.rebuildMobileAnchors();
//       }
//     }, 850);
//   }

//   private getScrollTop() {
//     return this.scrollEl?.scrollTop ?? window.pageYOffset ?? 0;
//   }

//   private onTouchStartMobile = () => {
//     this.isTouchingMobile = true;
//     if (this.mobileScrollStopT) clearTimeout(this.mobileScrollStopT);
//   };

//   private onTouchEndMobile = () => {
//     this.isTouchingMobile = false;
//     // wait a bit for momentum
//     this.scheduleMobileSnap(140);
//   };

//   private onMobileScroll = () => {
//     const y = this.getScrollTop();
//     if (y > this.lastScrollTopMobile) this.lastDirMobile = 1;
//     else if (y < this.lastScrollTopMobile) this.lastDirMobile = -1;
//     this.lastScrollTopMobile = y;

//     // always compute footer bands (cheap) so footerMode works
//     this.computeFooterBands();

//     // scroll-end snap
//     this.scheduleMobileSnap(140);
//   };

//   private scheduleMobileSnap(delayMs: number) {
//     if (this.isProgrammaticMobile) return;

//     if (this.mobileScrollStopT) clearTimeout(this.mobileScrollStopT);
//     this.mobileScrollStopT = setTimeout(() => {
//       if (this.isTouchingMobile) return;
//       this.doSnapMobileStable();
//     }, delayMs);
//   }

//   private computeFooterBands() {
//     const vh = (window.visualViewport?.height || window.innerHeight);
//     const footer = document.querySelector(this.FOOTER_SELECTOR) as HTMLElement | null;

//     if (!footer) {
//       this.footerTop = Number.POSITIVE_INFINITY;
//       this.footerEnterY = Number.POSITIVE_INFINITY;
//       this.footerExitY = Number.POSITIVE_INFINITY;
//       return;
//     }

//     const top = Math.round(footer.getBoundingClientRect().top + this.getScrollTop());
//     this.footerTop = top;

//     // enter = قريب من الفوتر وانت نازل
//     this.footerEnterY = top - vh * 0.28;
//     // exit = لازم تطلع لفوق أكتر عشان نرجّع السناب
//     this.footerExitY = top - vh * 0.68;
//   }

//   private rebuildMobileAnchors() {
//     if (!this.isBrowser) return;
//     if (this.footerMode) return;

//     const panels = Array.from(document.querySelectorAll('.panel')) as HTMLElement[];
//     const y = this.getScrollTop();

//     const starts = panels.map(p => Math.round(p.getBoundingClientRect().top + y));
//     const uniq = Array.from(new Set(starts)).sort((a, b) => a - b);

//     this.panelStartsMobile = uniq;
//     this.panelStartsSet = new Set(uniq);

//     // sync index
//     this.lastSnapIndexMobile = this.findNearestIndex(y);
//   }

//   private findNearestIndex(y: number) {
//     const arr = this.panelStartsMobile;
//     if (!arr.length) return 0;

//     // binary search
//     let lo = 0, hi = arr.length - 1;
//     while (lo < hi) {
//       const mid = (lo + hi) >> 1;
//       if (arr[mid] < y) lo = mid + 1;
//       else hi = mid;
//     }
//     const next = arr[lo];
//     const prev = lo > 0 ? arr[lo - 1] : arr[0];
//     return (Math.abs(next - y) < Math.abs(y - prev)) ? lo : Math.max(0, lo - 1);
//   }

//   private doSnapMobileStable() {
//     const arr = this.panelStartsMobile;
//     if (!arr.length) return;

//     if (this.isSnappingMobile) return;
//     if (this.isProgrammaticMobile) return;

//     const now = performance.now();
//     if (now - this.lastSnapAtMobile < this.SNAP_COOLDOWN_MS) return;

//     const y = this.getScrollTop();
//     const vh = (window.visualViewport?.height || window.innerHeight);

//     // ===== Footer Mode (hard stop snap) =====
//     // enter footer mode when going down and reaching band
//     if (!this.footerMode && this.lastDirMobile > 0 && y >= this.footerEnterY) {
//       this.footerMode = true;
//       // keep lastSnapIndex pinned to last section
//       this.lastSnapIndexMobile = Math.max(0, arr.length - 1);
//       return;
//     }

//     // while in footer mode: free scroll, only exit when going UP enough
//     if (this.footerMode) {
//       if (this.lastDirMobile < 0 && y <= this.footerExitY) {
//         this.footerMode = false;
//         this.rebuildMobileAnchors();

//         // ✅ IMPORTANT: when leaving footer, go back ONLY to last section start
//         const lastStart = arr[arr.length - 1];
//         this.snapToMobile(lastStart, now);
//       }
//       return;
//     }

//     // prevent micro corrections
//     if (Math.abs(y - this.lastSnappedPosMobile) <= this.DEAD_ZONE_PX) return;

//     // ===== allow free scroll after you are deep in last section (so you can reach footer smoothly) =====
//     const lastStart = arr[arr.length - 1];
//     if (this.lastDirMobile > 0 && y >= lastStart + vh * 0.42) {
//       this.lastSnapIndexMobile = arr.length - 1;
//       return;
//     }

//     // ===== Section3 handling (snap less inside, assist exit) =====
//     const s3Start = arr[2];
//     const s4Start = arr[3];

//     if (Number.isFinite(s3Start) && Number.isFinite(s4Start) && y > s3Start + 2 && y < s4Start - 2) {
//       // deep inside section3 => no snap
//       const deepStart = s3Start + vh * this.s3DeepStartFactor;
//       const deepEnd = s4Start - vh * this.s3DeepEndFactor;
//       if (y > deepStart && y < deepEnd) return;

//       // assist exit (down)
//       if (this.lastDirMobile > 0) {
//         const len = Math.max(1, s4Start - s3Start);
//         const ratio = (y - s3Start) / len;
//         const nearEnd = s4Start - vh * (this.isEnglishUI ? 0.75 : 0.62);

//         if (ratio >= this.s3AssistRatio || y >= nearEnd) {
//           this.lastSnapIndexMobile = 3;
//           this.snapToMobile(s4Start, now);
//         }
//       } else {
//         // assist back to start if near top
//         if (y <= s3Start + vh * 0.45) {
//           this.lastSnapIndexMobile = 2;
//           this.snapToMobile(s3Start, now);
//         }
//       }
//       return;
//     }

//     // ===== Stable index-based snapping for all sections (fix 4/5 wrong snaps) =====
//     let idx = this.lastSnapIndexMobile;
//     idx = Math.max(0, Math.min(idx, arr.length - 1));

//     // resync if drift far
//     if (Math.abs(y - arr[idx]) > vh * 0.95) {
//       idx = this.findNearestIndex(y);
//       this.lastSnapIndexMobile = idx;
//     }

//     let targetIdx = idx;

//     if (this.lastDirMobile > 0) {
//       const nextIdx = Math.min(idx + 1, arr.length - 1);
//       const gap = Math.max(1, arr[nextIdx] - arr[idx]);
//       const step = Math.min(vh * 0.38, gap * 0.50); // threshold to move forward
//       if (y >= arr[idx] + step) targetIdx = nextIdx;
//     } else {
//       const prevIdx = Math.max(idx - 1, 0);
//       const gap = Math.max(1, arr[idx] - arr[prevIdx]);
//       const step = Math.min(vh * 0.38, gap * 0.50);
//       if (y <= arr[idx] - step) targetIdx = prevIdx;
//     }

//     const target = arr[targetIdx];
//     if (Math.abs(target - y) <= this.DEAD_ZONE_PX) {
//       this.lastSnapIndexMobile = targetIdx;
//       return;
//     }

//     this.lastSnapIndexMobile = targetIdx;
//     this.snapToMobile(target, now);
//   }

//   private snapToMobile(targetY: number, now: number) {
//     if (!Number.isFinite(targetY)) return;

//     this.isSnappingMobile = true;
//     this.isProgrammaticMobile = true;
//     this.lastSnapAtMobile = now;
//     this.lastSnappedPosMobile = targetY;

//     // ✅ use window scrollTo (more robust than animating html/body directly)
//     gsap.to(window, {
//       scrollTo: { y: targetY, autoKill: true },
//       duration: 0.78,
//       ease: 'power3.out',
//       overwrite: true,
//       onComplete: () => {
//         this.isSnappingMobile = false;
//         this.isProgrammaticMobile = false;
//       },
//       onInterrupt: () => {
//         this.isSnappingMobile = false;
//         this.isProgrammaticMobile = false;
//       },
//     });
//   }

//   private onResizeMobile = () => {
//     if (this.isSnappingMobile) return;
//     if (this.footerMode) return;

//     const h = (window.visualViewport?.height || window.innerHeight);

//     // address bar jitter guard
//     if (Math.abs(h - this.lastVVH) < 28) return;
//     this.lastVVH = h;

//     if (this.mobileResizeT) clearTimeout(this.mobileResizeT);
//     this.mobileResizeT = setTimeout(() => {
//       this.computeFooterBands();
//       this.rebuildMobileAnchors();
//     }, 260);
//   };

//   private observeSectionsMobile() {
//     const sections = gsap.utils.toArray<HTMLElement>('.panel');

//     sections.forEach((section) => {
//       const textColor = section.dataset['textcolor'] || 'var(--primary)';
//       const bgColor = section.dataset['bgcolor'] || 'var(--white)';

//       ScrollTrigger.create({
//         trigger: section,
//         start: 'top 10%',
//         end: 'bottom 50%',
//         onEnter: () => { this.navTheme.setColor(textColor); this.navTheme.setBg(bgColor); },
//         onEnterBack: () => { this.navTheme.setColor(textColor); this.navTheme.setBg(bgColor); },
//       });
//     });
//   }

//   private destroyMobileSnapStable() {
//     if (this.mobileScrollStopT) clearTimeout(this.mobileScrollStopT);
//     if (this.mobileResizeT) clearTimeout(this.mobileResizeT);
//     if (this.mobileInitTimer) clearTimeout(this.mobileInitTimer);

//     window.removeEventListener('scroll', this.onMobileScroll as any);
//     window.removeEventListener('touchstart', this.onTouchStartMobile as any);
//     window.removeEventListener('touchend', this.onTouchEndMobile as any);

//     window.removeEventListener('resize', this.onResizeMobile as any);
//     window.visualViewport?.removeEventListener('resize', this.onResizeMobile as any);
//   }

//   // =========================
//   // DESTROY
//   // =========================
//   ngOnDestroy(): void {
//     this.sectionsRegistry.clear();
//     this.sectionsRegistry.disable();

//     if (!this.isBrowser) return;

//     // desktop cleanup
//     try { window.removeEventListener('resize', this.onResize); } catch { }
//     try { ScrollTrigger.removeEventListener('scrollEnd', this.onDesktopScrollEnd); } catch { }
//     try { this.snapObserver?.kill?.(); } catch { }
//     try { this.desktopSnapDC?.kill(); } catch { }

//     // mobile cleanup
//     if (this.isMobile) {
//       this.destroyMobileSnapStable();
//     }

//     // ✅ revert only what was created in this component context
//     this.ctx?.revert();

//     // ❌ مهم: متقتلش كل الـ ScrollTriggers في الموقع (ده كان بيبوّظ الـ layout أحيانًا)
//     // ScrollTrigger.getAll().forEach(t => t.kill());
//   }
// }
import {
  Component,
  Inject,
  PLATFORM_ID,
  NgZone,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import ScrollSmoother from 'gsap/ScrollSmoother';
import ScrollToPlugin from 'gsap/ScrollToPlugin';
import { BehaviorSubject } from 'rxjs';

import { NavbarThemeService } from '../../components/navbar/navbar-theme.service';
import { SectionsRegistryService } from '../../shared/services/sections-registry.service';

import { AboutSection1Component } from './about-section1/about-section1.component';
import { AboutSection2Component } from './about-section2/about-section2.component';
import { AboutSection3Component } from './about-section3/about-section3.component';
import { AboutSection4Component } from './about-section4/about-section4.component';
import { AboutSection5Component } from './about-section5/about-section5.component';

import { SeoLinkService } from '../../services/seo-link.service';
import { PreloadService } from '../../services/preload.service';

@Component({
  selector: 'app-about',
  imports: [
    AboutSection1Component,
    AboutSection2Component,
    AboutSection3Component,
    CommonModule,
    AboutSection4Component,
    AboutSection5Component,
  ],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss',
})
export class AboutComponent {
  private static pluginsRegistered = false;

  private visibilitySubject = new BehaviorSubject<'visible' | 'invisible'>('visible');
  visibility$ = this.visibilitySubject.asObservable();
  visibilityState: 'visible' | 'invisible' = 'visible';

  menuOpen = false;
  isBrowser: boolean;
  isMobile!: boolean;

  private ctx?: gsap.Context;

  // Desktop snap
  private snapObserver?: any;
  private snapPositions: number[] = [];
  private smoother: any;
  private smootherST: any;
  private desktopSnapDC?: gsap.core.Tween;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef,
    private navTheme: NavbarThemeService,
    private sectionsRegistry: SectionsRegistryService,
    private seoLinks: SeoLinkService,
    private preloadService: PreloadService
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit() {
    if (!this.isBrowser) return;

    // ✅ SSR-safe plugins register
    if (!AboutComponent.pluginsRegistered) {
      gsap.registerPlugin(ScrollTrigger, ScrollSmoother, ScrollToPlugin);
      AboutComponent.pluginsRegistered = true;
    }

    this.isMobile = window.matchMedia('(max-width: 767px)').matches;

    // preload (كما هو)
    this.preloadService.addPreloads([
      { href: '/About us/assetsafarihigh.mp4', as: 'video' },
      { href: '/About us/Nested Sequence 02safari.mp4', as: 'video' },
      { href: '/About us/Vertical about us copy1.jpg', as: 'image', media: '(max-width: 767px)' },
      { href: '/About us/Vertical about us copy2.jpg', as: 'image', media: '(max-width: 767px)' },
      { href: '/About us/Vertical about us copy3.jpg', as: 'image', media: '(max-width: 767px)' },
    ]);
  }

  ngAfterViewInit(): void {
    if (!this.isBrowser) return;

    if (this.isMobile) {
      this.mobileInitTimer = setTimeout(() => {
        this.ctx = gsap.context(() => {
          this.initMobileSnapStable();
        });
      }, 520);
      return;
    }

    // Desktop path
    this.ngZone.runOutsideAngular(() => {
      this.waitForSmoother((smoother) => {
        this.smoother = smoother;
        this.smootherST = smoother.scrollTrigger;

        this.ctx = gsap.context(() => {
          this.initDesktop(smoother);
        });
      });
    });
  }

  private waitForSmoother(cb: (s: any) => void) {
    const start = performance.now();
    const tick = () => {
      const s = ScrollSmoother.get() as any;
      if (s) return cb(s);
      if (performance.now() - start < 3500) requestAnimationFrame(tick);
    };
    tick();
  }

  // =========================
  // ✅ DESKTOP (unchanged)
  // =========================
  private requestDesktopSnap = () => {
    if (!this.smootherST || !this.smoother) return;
    if (!this.snapPositions.length) return;

    this.desktopSnapDC?.kill();
    this.desktopSnapDC = gsap.delayedCall(0.7, () => this.doSnap());
  };

  private onDesktopScrollEnd = () => {
    this.requestDesktopSnap();
  };

  private initDesktop(smoother: any) {
    const scroller = smoother.wrapper();

    this.observeSections(scroller);

    window.addEventListener('resize', this.onResize);
    ScrollTrigger.addEventListener('scrollEnd', this.onDesktopScrollEnd);

    setTimeout(() => {
      ScrollTrigger.refresh();
      this.buildSnapPositions(smoother);
      this.initSnapObserver(smoother);
    }, 600);
  }

  private buildSnapPositions(smoother: any) {
    const scroller = smoother.wrapper();
    const panels = gsap.utils.toArray<HTMLElement>('.panel');

    this.snapPositions = [];

    panels.forEach((panel, index) => {
      const st = ScrollTrigger.create({
        trigger: panel,
        scroller,
        start: 'top top',
        refreshPriority: -1,
      });

      this.snapPositions.push(st.start);

      // Section3 end
      if (index === 2) {
        this.snapPositions.push(st.end);
      }

      st.kill();
    });

    this.snapPositions = Array.from(new Set(this.snapPositions)).sort((a, b) => a - b);
  }

  private initSnapObserver(smoother: any) {
    if (this.snapObserver) this.snapObserver.kill();

    const scroller = smoother.wrapper();

    this.snapObserver = ScrollTrigger.observe({
      target: scroller,
      onStop: () => this.requestDesktopSnap(),
      onStopDelay: 0.7,
    });
  }

  private doSnap() {
    if (!this.smootherST || !this.smoother) return;
    if (!this.snapPositions.length) return;

    const currentScroll = this.smootherST.scroll();
    const lastSnapPoint = this.snapPositions[this.snapPositions.length - 1];
    if (currentScroll > lastSnapPoint + 200) return;

    let nearest = this.snapPositions[0];
    let minDistance = Math.abs(currentScroll - nearest);

    for (const pos of this.snapPositions) {
      const d = Math.abs(currentScroll - pos);
      if (d < minDistance) {
        minDistance = d;
        nearest = pos;
      }
    }

    const section3Start = this.snapPositions[2] || 0;
    const section3End = this.snapPositions[3] || 0;
    const vh = window.innerHeight;

    const deepInsideSection3 =
      currentScroll > section3Start + vh &&
      currentScroll < section3End - vh;

    if (deepInsideSection3) return;

    if (minDistance > 10) {
      const SNAP_OFFSET = 120;
      const idx = this.snapPositions.indexOf(nearest);
      const nextSnap = (idx >= 0 && idx < this.snapPositions.length - 1) ? this.snapPositions[idx + 1] : nearest;
      const maxAllowedOffset = Math.max(0, nextSnap - nearest - 20);
      const safeOffset = Math.min(SNAP_OFFSET, maxAllowedOffset);

      const isSection3End = nearest === section3End;
      let target = nearest;

      if (!isSection3End && nearest > 0 && safeOffset >= 8) {
        target = nearest + safeOffset;
      }

      this.smoother.scrollTo(target, true);
    }
  }

  private observeSections(scroller: HTMLElement) {
    const sections = gsap.utils.toArray<HTMLElement>('.panel');

    sections.forEach((section) => {
      const textColor = section.dataset['textcolor'] || 'var(--primary)';
      const bgColor = section.dataset['bgcolor'] || 'var(--white)';

      ScrollTrigger.create({
        trigger: section,
        scroller,
        start: 'top 50%',
        end: 'bottom 50%',
        onEnter: () => { this.navTheme.setColor(textColor); this.navTheme.setBg(bgColor); },
        onEnterBack: () => { this.navTheme.setColor(textColor); this.navTheme.setBg(bgColor); },
      });
    });
  }

  private onResize = () => {
    ScrollTrigger.refresh();
    if (this.smoother) {
      setTimeout(() => this.buildSnapPositions(this.smoother), 100);
    }
    this.ngZone.run(() => this.cdr.detectChanges());
  };

  // =========================
  // ✅ MOBILE (STABLE) + FIX BETWEEN S3 & S4 + S4 NAV OFFSET
  // =========================

  private readonly FOOTER_SELECTOR = 'app-footer, #site-footer, footer, #footer, .footer';

  // ✅ requested: Section4 nav offset
  private readonly SECTION4_NAV_OFFSET_PX = 1;

  private mobileInitTimer: any = null;
  private mobileResizeT: any = null;
  private mobileScrollStopT: any = null;

  private scrollEl!: HTMLElement;

  private panelStartsMobile: number[] = []; // sorted starts
  private panelStartsSet = new Set<number>();

  private lastDirMobile: 1 | -1 = 1;
  private lastScrollTopMobile = 0;

  private isSnappingMobile = false;
  private isTouchingMobile = false;
  private isProgrammaticMobile = false;

  private lastSnapAtMobile = 0;
  private lastSnappedPosMobile = -999999;
  private lastSnapIndexMobile = 0;

  private footerMode = false;
  private footerTop = Number.POSITIVE_INFINITY;
  private footerEnterY = Number.POSITIVE_INFINITY;
  private footerExitY = Number.POSITIVE_INFINITY;

  private lastVVH = 0;

  // ✅ NEW: end of section3 (for snapping up from section4)
  private s3EndMobile: number | null = null;

  // language weight
  private isEnglishUI = false;
  private s3AssistRatio = 0.62;      // lighter EN
  private s3DeepStartFactor = 0.90;  // disable snap deep inside
  private s3DeepEndFactor = 0.90;

  // tweakables
  private readonly SNAP_COOLDOWN_MS = 320;
  private readonly DEAD_ZONE_PX = 18;

  private initMobileSnapStable() {
    ScrollTrigger.config({ ignoreMobileResize: true });

    this.scrollEl = (document.scrollingElement || document.documentElement) as HTMLElement;

    // language weight
    const html = document.documentElement;
    const lang = (html.getAttribute('lang') || '').toLowerCase();
    const dir = (html.getAttribute('dir') || '').toLowerCase();
    this.isEnglishUI = lang.startsWith('en') || dir === 'ltr';
    this.s3AssistRatio = this.isEnglishUI ? 0.52 : 0.62;
    this.s3DeepStartFactor = this.isEnglishUI ? 0.85 : 0.90;
    this.s3DeepEndFactor = this.isEnglishUI ? 0.85 : 0.90;

    // Navbar theme observers (mobile)
    this.observeSectionsMobile();

    // build initial anchors
    this.rebuildMobileAnchors();

    // init direction
    this.lastScrollTopMobile = this.getScrollTop();

    // listeners (NO Observer)
    window.addEventListener('scroll', this.onMobileScroll, { passive: true });
    window.addEventListener('touchstart', this.onTouchStartMobile, { passive: true });
    window.addEventListener('touchend', this.onTouchEndMobile, { passive: true });

    this.lastVVH = (window.visualViewport?.height || window.innerHeight);
    window.addEventListener('resize', this.onResizeMobile, { passive: true });
    window.visualViewport?.addEventListener('resize', this.onResizeMobile as any, { passive: true } as any);

    // small delayed rebuild (once) to catch late images/fonts WITHOUT killing footer
    setTimeout(() => {
      const vh = (window.visualViewport?.height || window.innerHeight);
      const y = this.getScrollTop();
      if (y < vh * 1.4 && !this.isTouchingMobile) {
        this.rebuildMobileAnchors();
      }
    }, 850);
  }

  private getScrollTop() {
    return this.scrollEl?.scrollTop ?? window.pageYOffset ?? 0;
  }

  private onTouchStartMobile = () => {
    this.isTouchingMobile = true;
    if (this.mobileScrollStopT) clearTimeout(this.mobileScrollStopT);
  };

  private onTouchEndMobile = () => {
    this.isTouchingMobile = false;
    // ✅ snap only after release (and after a short settle)
    this.scheduleMobileSnap(180);
  };

  private onMobileScroll = () => {
    const y = this.getScrollTop();

    // ✅ direction stable (avoid bounce flipping)
    const dy = y - this.lastScrollTopMobile;
    if (dy > 2) this.lastDirMobile = 1;
    else if (dy < -2) this.lastDirMobile = -1;

    this.lastScrollTopMobile = y;

    this.computeFooterBands();
    this.scheduleMobileSnap(160);
  };

  private scheduleMobileSnap(delayMs: number) {
    if (this.isProgrammaticMobile) return;

    if (this.mobileScrollStopT) clearTimeout(this.mobileScrollStopT);
    this.mobileScrollStopT = setTimeout(() => {
      if (this.isTouchingMobile) return;
      this.doSnapMobileStable();
    }, delayMs);
  }

  private computeFooterBands() {
    const vh = (window.visualViewport?.height || window.innerHeight);
    const footer = document.querySelector(this.FOOTER_SELECTOR) as HTMLElement | null;

    if (!footer) {
      this.footerTop = Number.POSITIVE_INFINITY;
      this.footerEnterY = Number.POSITIVE_INFINITY;
      this.footerExitY = Number.POSITIVE_INFINITY;
      return;
    }

    const top = Math.round(footer.getBoundingClientRect().top + this.getScrollTop());
    this.footerTop = top;

    this.footerEnterY = top - vh * 0.28;
    this.footerExitY = top - vh * 0.68;
  }

  private rebuildMobileAnchors() {
    if (!this.isBrowser) return;
    if (this.footerMode) return;

    const panels = Array.from(document.querySelectorAll('.panel')) as HTMLElement[];
    const y = this.getScrollTop();

    const starts = panels.map(p => Math.round(p.getBoundingClientRect().top + y));
    const uniq = Array.from(new Set(starts)).sort((a, b) => a - b);

    this.panelStartsMobile = uniq;
    this.panelStartsSet = new Set(uniq);

    // ✅ compute S3 end reliably + fallback (solves S3/S4 gap)
    this.s3EndMobile = null;
    if (this.panelStartsMobile.length >= 4) {
      const s3Start = this.panelStartsMobile[2];
      const s4Start = this.panelStartsMobile[3];

      const st3 =
        (ScrollTrigger.getById('AboutSection3Trigger-mobile') as any) ||
        (ScrollTrigger.getById('AboutSection3Trigger') as any);

      if (st3) {
        let end = Math.round(st3.end);
        // clamp: never exceed s4Start
        end = Math.min(end, s4Start - 2);
        if (Number.isFinite(end) && end > s3Start + 20) {
          this.s3EndMobile = end;
        }
      }

      // fallback if trigger not found yet
      if (!this.s3EndMobile) {
        this.s3EndMobile = s4Start - 2;
      }
    }

    this.lastSnapIndexMobile = this.findNearestIndex(y);
  }

  private findNearestIndex(y: number) {
    const arr = this.panelStartsMobile;
    if (!arr.length) return 0;

    let lo = 0, hi = arr.length - 1;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (arr[mid] < y) lo = mid + 1;
      else hi = mid;
    }
    const next = arr[lo];
    const prev = lo > 0 ? arr[lo - 1] : arr[0];
    return (Math.abs(next - y) < Math.abs(y - prev)) ? lo : Math.max(0, lo - 1);
  }

  private doSnapMobileStable() {
    const arr = this.panelStartsMobile;
    if (!arr.length) return;

    if (this.isSnappingMobile) return;
    if (this.isProgrammaticMobile) return;

    const now = performance.now();
    if (now - this.lastSnapAtMobile < this.SNAP_COOLDOWN_MS) return;

    const y = this.getScrollTop();
    const vh = (window.visualViewport?.height || window.innerHeight);

    // ===== Footer Mode =====
    if (!this.footerMode && this.lastDirMobile > 0 && y >= this.footerEnterY) {
      this.footerMode = true;
      this.lastSnapIndexMobile = Math.max(0, arr.length - 1);
      return;
    }

    if (this.footerMode) {
      if (this.lastDirMobile < 0 && y <= this.footerExitY) {
        this.footerMode = false;
        this.rebuildMobileAnchors();

        const lastStart = arr[arr.length - 1];
        this.snapToMobile(lastStart, now, arr.length - 1);
      }
      return;
    }

    // prevent micro corrections
    if (Math.abs(y - this.lastSnappedPosMobile) <= this.DEAD_ZONE_PX) return;

    // ===== allow free scroll deep in last section =====
    const lastStart = arr[arr.length - 1];
    if (this.lastDirMobile > 0 && y >= lastStart + vh * 0.42) {
      this.lastSnapIndexMobile = arr.length - 1;
      return;
    }

    // ✅✅ FIX: never stay stuck between END S3 and START S4
    if (arr.length >= 4) {
      const s3Start = arr[2];
      const s4Start = arr[3];

      // ensure we have s3 end (try again lazily)
      if (!this.s3EndMobile || this.s3EndMobile >= s4Start) {
        this.s3EndMobile = s4Start - 2;
        const st3 =
          (ScrollTrigger.getById('AboutSection3Trigger-mobile') as any) ||
          (ScrollTrigger.getById('AboutSection3Trigger') as any);
        if (st3) {
          let end = Math.round(st3.end);
          end = Math.min(end, s4Start - 2);
          if (Number.isFinite(end) && end > s3Start + 20) this.s3EndMobile = end;
        }
      }

      const s3End = this.s3EndMobile ?? (s4Start - 2);

      // bridge zone band around the gap (covers “standing in between”)
      const bridgePadTop = Math.max(70, Math.round(vh * 0.14));
      const bridgePadBot = Math.max(50, Math.round(vh * 0.08));

      const inBridgeZone = (y >= (s3End - bridgePadTop)) && (y <= (s4Start + bridgePadBot));

      if (inBridgeZone) {
        if (this.lastDirMobile > 0) {
          // down -> snap to section4 start (with nav offset)
          this.lastSnapIndexMobile = 3;
          this.snapToMobile(s4Start, now, 3);
        } else {
          // up -> snap to section3 end (real end if exists)
          this.lastSnapIndexMobile = 2;
          this.snapToMobile(s3End, now, 2);
        }
        return;
      }
    }

    // ===== Section3 handling (assist exit) =====
    if (arr.length >= 4) {
      const s3Start = arr[2];
      const s4Start = arr[3];

      if (Number.isFinite(s3Start) && Number.isFinite(s4Start) && y > s3Start + 2 && y < s4Start - 2) {
        const deepStart = s3Start + vh * this.s3DeepStartFactor;
        const deepEnd = s4Start - vh * this.s3DeepEndFactor;
        if (y > deepStart && y < deepEnd) return;

        if (this.lastDirMobile > 0) {
          const len = Math.max(1, s4Start - s3Start);
          const ratio = (y - s3Start) / len;
          const nearEnd = s4Start - vh * (this.isEnglishUI ? 0.75 : 0.62);

          if (ratio >= this.s3AssistRatio || y >= nearEnd) {
            this.lastSnapIndexMobile = 3;
            this.snapToMobile(s4Start, now, 3);
          }
        } else {
          if (y <= s3Start + vh * 0.45) {
            this.lastSnapIndexMobile = 2;
            this.snapToMobile(s3Start, now, 2);
          }
        }
        return;
      }
    }

    // ===== Stable index-based snapping =====
    let idx = this.lastSnapIndexMobile;
    idx = Math.max(0, Math.min(idx, arr.length - 1));

    if (Math.abs(y - arr[idx]) > vh * 0.95) {
      idx = this.findNearestIndex(y);
      this.lastSnapIndexMobile = idx;
    }

    let targetIdx = idx;

    if (this.lastDirMobile > 0) {
      const nextIdx = Math.min(idx + 1, arr.length - 1);
      const gap = Math.max(1, arr[nextIdx] - arr[idx]);
      const step = Math.min(vh * 0.38, gap * 0.50);
      if (y >= arr[idx] + step) targetIdx = nextIdx;
    } else {
      const prevIdx = Math.max(idx - 1, 0);
      const gap = Math.max(1, arr[idx] - arr[prevIdx]);
      const step = Math.min(vh * 0.38, gap * 0.50);
      if (y <= arr[idx] - step) targetIdx = prevIdx;
    }

    const target = arr[targetIdx];
    if (Math.abs(target - y) <= this.DEAD_ZONE_PX) {
      this.lastSnapIndexMobile = targetIdx;
      return;
    }

    this.lastSnapIndexMobile = targetIdx;
    this.snapToMobile(target, now, targetIdx);
  }

  private snapToMobile(targetY: number, now: number, targetIndex?: number) {
    if (!Number.isFinite(targetY)) return;

    // ✅ apply nav offset only for Section4 index (3)
    let finalY = targetY;
    if (targetIndex === 3) {
      finalY = Math.max(0, targetY - this.SECTION4_NAV_OFFSET_PX);
    }

    this.isSnappingMobile = true;
    this.isProgrammaticMobile = true;
    this.lastSnapAtMobile = now;
    this.lastSnappedPosMobile = finalY;

    gsap.to(window, {
      scrollTo: { y: finalY, autoKill: true },
      duration: 0.78,
      ease: 'power3.out',
      overwrite: true,
      onComplete: () => {
        this.isSnappingMobile = false;
        this.isProgrammaticMobile = false;
      },
      onInterrupt: () => {
        this.isSnappingMobile = false;
        this.isProgrammaticMobile = false;
      },
    });
  }

  private onResizeMobile = () => {
    if (this.isSnappingMobile) return;
    if (this.footerMode) return;

    const h = (window.visualViewport?.height || window.innerHeight);
    if (Math.abs(h - this.lastVVH) < 28) return;
    this.lastVVH = h;

    if (this.mobileResizeT) clearTimeout(this.mobileResizeT);
    this.mobileResizeT = setTimeout(() => {
      this.computeFooterBands();
      this.rebuildMobileAnchors();
    }, 260);
  };

  private observeSectionsMobile() {
    const sections = gsap.utils.toArray<HTMLElement>('.panel');

    sections.forEach((section) => {
      const textColor = section.dataset['textcolor'] || 'var(--primary)';
      const bgColor = section.dataset['bgcolor'] || 'var(--white)';

      ScrollTrigger.create({
        trigger: section,
        start: 'top 10%',
        end: 'bottom 50%',
        onEnter: () => { this.navTheme.setColor(textColor); this.navTheme.setBg(bgColor); },
        onEnterBack: () => { this.navTheme.setColor(textColor); this.navTheme.setBg(bgColor); },
      });
    });
  }

  private destroyMobileSnapStable() {
    if (this.mobileScrollStopT) clearTimeout(this.mobileScrollStopT);
    if (this.mobileResizeT) clearTimeout(this.mobileResizeT);
    if (this.mobileInitTimer) clearTimeout(this.mobileInitTimer);

    window.removeEventListener('scroll', this.onMobileScroll as any);
    window.removeEventListener('touchstart', this.onTouchStartMobile as any);
    window.removeEventListener('touchend', this.onTouchEndMobile as any);

    window.removeEventListener('resize', this.onResizeMobile as any);
    window.visualViewport?.removeEventListener('resize', this.onResizeMobile as any);
  }

  // =========================
  // DESTROY
  // =========================
  ngOnDestroy(): void {
    this.sectionsRegistry.clear();
    this.sectionsRegistry.disable();

    if (!this.isBrowser) return;

    // desktop cleanup
    try { window.removeEventListener('resize', this.onResize); } catch { }
    try { ScrollTrigger.removeEventListener('scrollEnd', this.onDesktopScrollEnd); } catch { }
    try { this.snapObserver?.kill?.(); } catch { }
    try { this.desktopSnapDC?.kill(); } catch { }

    // mobile cleanup
    if (this.isMobile) {
      this.destroyMobileSnapStable();
    }

    this.ctx?.revert();
    // ScrollTrigger.getAll().forEach(t => t.kill());
  }
}



