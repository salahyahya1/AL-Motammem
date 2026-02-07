// import {
//   Component,
//   Inject,
//   PLATFORM_ID,
//   NgZone,
//   ChangeDetectorRef,
// } from '@angular/core';
// import { isPlatformBrowser } from '@angular/common';
// import gsap from 'gsap';
// import ScrollTrigger from 'gsap/ScrollTrigger';
// import { BehaviorSubject } from 'rxjs';
// import { NavbarThemeService } from '../../components/navbar/navbar-theme.service';
// import { SectionsRegistryService } from "../../shared/services/sections-registry.service";
// import ScrollToPlugin from 'gsap/ScrollToPlugin';


// import { SolutionsSection1Component } from "./solutions-section1/solutions-section1.component";
// import { SolutionsSection2Component } from "./solutions-section2/solutions-section2.component";
// import { SolutionsSection3Component } from './solutions-section3/solutions-section3.component';
// import { SolutionsSection5Component } from "./solutions-section5/solutions-section5.component";
// import { SolutionsSection4Component } from "./solutions-section4/solutions-section4.component";
// import { SolutionsSection6Component } from "./solutions-section6/solutions-section6.component";

// gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

// @Component({
//   selector: 'app-solutions',
//   imports: [SolutionsSection1Component, SolutionsSection2Component, SolutionsSection3Component, SolutionsSection5Component, SolutionsSection4Component, SolutionsSection6Component],
//   templateUrl: './solutions.component.html',
//   styleUrl: './solutions.component.scss'
// })
// export class SolutionsComponent {

//   private visibilitySubject = new BehaviorSubject<'visible' | 'invisible'>('visible');
//   visibility$ = this.visibilitySubject.asObservable();
//   visibilityState: 'visible' | 'invisible' = 'visible';



//   menuOpen = false;
//   isBrowser: boolean;

//   constructor(
//     @Inject(PLATFORM_ID) private platformId: Object,
//     private ngZone: NgZone,
//     private cdr: ChangeDetectorRef,
//     private navTheme: NavbarThemeService,
//     private sectionsRegistry: SectionsRegistryService
//   ) {
//     this.isBrowser = isPlatformBrowser(this.platformId);
//   }
//   private ctx2?: gsap.Context;
//   private onResizeRefresh = () => ScrollTrigger.refresh();
//   private onResizeCD = () => {
//     this.ngZone.run(() => this.cdr.detectChanges());
//   };
//   ngAfterViewInit(): void {
//     if (!this.isBrowser) return;

//     this.ngZone.runOutsideAngular(() => {
//       setTimeout(() => {
//         this.ctx2 = gsap.context(() => {
//           this.observeSections();

//           window.addEventListener('resize', this.onResizeCD);
//           window.addEventListener('resize', this.onResizeRefresh);

//           ScrollTrigger.refresh();
//         });
//       }, 150);

//     });
//   }
//   private observeSections() {
//     const sections = gsap.utils.toArray<HTMLElement>('.panel');

//     sections.forEach((section) => {
//       const bgColor = section.dataset['bgcolor'] || 'var(--white)';
//       const textColor = section.dataset['textcolor'] || 'var(--primary)';

//       ScrollTrigger.create({
//         trigger: section,
//         start: 'top 50%',
//         end: 'bottom 50%',
//         // onEnter: () => this.updateNavbarColors(textColor),
//         // onEnterBack: () => this.updateNavbarColors(textColor),
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
//   ngOnDestroy(): void {
//     this.sectionsRegistry.clear();
//     this.sectionsRegistry.disable();

//     if (this.isBrowser) {
//       window.removeEventListener('resize', this.onResizeCD);
//       window.removeEventListener('resize', this.onResizeRefresh);
//     }

//     this.ctx2?.revert();
//   }
// }

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
// import { SectionsRegistryService } from "../../shared/services/sections-registry.service";

// import { SolutionsSection1Component } from "./solutions-section1/solutions-section1.component";
// import { SolutionsSection2Component } from "./solutions-section2/solutions-section2.component";
// import { SolutionsSection3Component } from './solutions-section3/solutions-section3.component';
// import { SolutionsSection5Component } from "./solutions-section5/solutions-section5.component";
// import { SolutionsSection4Component } from "./solutions-section4/solutions-section4.component";
// import { SolutionsSection6Component } from "./solutions-section6/solutions-section6.component";

// gsap.registerPlugin(ScrollTrigger, ScrollSmoother, ScrollToPlugin);

// @Component({
//   selector: 'app-solutions',
//   imports: [SolutionsSection1Component, SolutionsSection2Component, SolutionsSection3Component, SolutionsSection5Component, SolutionsSection4Component, SolutionsSection6Component, CommonModule],
//   templateUrl: './solutions.component.html',
//   styleUrl: './solutions.component.scss'
// })
// export class SolutionsComponent {
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

//   // =================== MOBILE SNAP PROPERTIES ===================
//   private scrollEl!: HTMLElement;
//   private mobileObserver?: any;
//   private panelStartsMobile = new Set<number>();
//   private footerTopMobile = Number.POSITIVE_INFINITY;
//   private lastDirMobile: 1 | -1 = 1;
//   private isSnappingMobile = false;
//   private isTouchingMobile = false;
//   private lastVVH = 0;
//   private mobileResizeT: any = null;

//   constructor(
//     @Inject(PLATFORM_ID) private platformId: Object,
//     private ngZone: NgZone,
//     private cdr: ChangeDetectorRef,
//     private navTheme: NavbarThemeService,
//     private sectionsRegistry: SectionsRegistryService
//   ) {
//     this.isBrowser = isPlatformBrowser(this.platformId);
//   }

//   ngOnInit() {
//     if (!this.isBrowser) return;
//     this.isMobile = window.matchMedia('(max-width: 991px)').matches;
//   }

//   ngAfterViewInit(): void {
//     if (!this.isBrowser) return;

//     // Mobile specific path
//     if (this.isMobile) {
//       setTimeout(() => this.initMobileSnap(), 750);
//       return;
//     }

//     // Desktop: wait for smoother
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

//   // =================== DESKTOP IMPLEMENTATION ===================

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

//     // Build snap positions
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
//         start: "top top",
//         refreshPriority: -1,
//       });

//       // Add section START position
//       this.snapPositions.push(st.start);
//       // NOTE: Can add custom END points here if any section is PINNED on desktop
//       console.log(`📌 Section ${index}: start=${st.start.toFixed(0)}`);
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
//       onStopDelay: 0.7
//     });
//   }

//   private doSnap() {
//     if (!this.smootherST || !this.smoother) return;
//     if (this.snapPositions.length === 0) return;

//     const currentScroll = this.smootherST.scroll();

//     // Footer Guard
//     const lastSnapPoint = this.snapPositions[this.snapPositions.length - 1];
//     const footerThreshold = 200;

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

//     // Snap Execution
//     if (minDistance > 10) {
//       const SNAP_OFFSET = 1;
//       let targetPosition = nearest;

//       if (nearest > 0) {
//         targetPosition = nearest + SNAP_OFFSET;
//       }

//       console.log(`✅ Snapping: ${currentScroll.toFixed(0)} → ${targetPosition.toFixed(0)}`);
//       this.smoother.scrollTo(targetPosition, true);
//     } else {
//       console.log(`📍 Already at snap point: ${currentScroll.toFixed(0)}`);
//     }
//   }

//   // =================== MOBILE IMPLEMENTATION ===================

//   private onTouchStartMobile = () => { this.isTouchingMobile = true; };
//   private onTouchEndMobile = () => { this.isTouchingMobile = false; };

//   private initMobileSnap() {
//     ScrollTrigger.config({ ignoreMobileResize: true });

//     this.scrollEl = (document.scrollingElement || document.documentElement) as HTMLElement;

//     this.observeSectionsMobile();

//     window.addEventListener('touchstart', this.onTouchStartMobile, { passive: true });
//     window.addEventListener('touchend', this.onTouchEndMobile, { passive: true });

//     ScrollTrigger.refresh(true);
//     this.buildSnapPositionsMobile();
//     this.initMobileObserver();

//     this.lastVVH = (window.visualViewport?.height || window.innerHeight);
//     window.addEventListener('resize', this.onResizeMobile);
//     window.visualViewport?.addEventListener('resize', this.onResizeMobile);
//   }

//   private initMobileObserver() {
//     try { this.mobileObserver?.kill?.(); } catch { }

//     this.mobileObserver = ScrollTrigger.observe({
//       target: window,
//       type: 'wheel,touch,scroll',
//       onDown: () => { this.lastDirMobile = 1; },
//       onUp: () => { this.lastDirMobile = -1; },
//       onStop: () => {
//         if (this.isTouchingMobile) return;
//         this.doSnapMobile();
//       },
//       onStopDelay: 0.22,
//     });
//   }

//   private buildSnapPositionsMobile() {
//     const panels = gsap.utils.toArray<HTMLElement>('.panel');
//     this.snapPositions = [];
//     this.panelStartsMobile.clear();

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

//     const footer = (document.querySelector('footer, app-footer, #footer, .footer') as HTMLElement | null);
//     this.footerTopMobile = footer
//       ? Math.round(footer.getBoundingClientRect().top + this.scrollEl.scrollTop)
//       : Number.POSITIVE_INFINITY;

//     this.snapPositions = Array.from(new Set(this.snapPositions)).sort((a, b) => a - b);
//     console.log('✅ Mobile Snap positions:', this.snapPositions);
//   }

//   private doSnapMobile() {
//     if (!this.snapPositions.length) return;
//     if (this.isSnappingMobile) return;
//     if (gsap.isTweening(this.scrollEl)) return;

//     const current = this.scrollEl.scrollTop;
//     const vh = (window.visualViewport?.height || window.innerHeight);

//     // ✅ footer zone: لو نازل للفوتر سيبه (مايعملش snap)
//     // Same as AboutComponent logic
//     const footerZoneStart = this.footerTopMobile - vh * 0.25;
//     if (current >= footerZoneStart && this.lastDirMobile > 0) return;

//     const arr = this.snapPositions;

//     // ✅ Disable snapping once we enter the LAST section
//     const lastStart = arr[arr.length - 1];
//     if (current >= lastStart - 2) return;

//     // ✅ SPECIAL LOGIC: Section 2 (Branch 1 variant)
//     // Section 1: Index 0 (Normal Snap)
//     // Section 2: Index 1 (Free Scroll + Transition to Sec 3)
//     // Only applies if we are IN Section 2 (between arr[1] and arr[2])
//     if (arr.length > 2 && current >= arr[1] - 2 && current < arr[2] - 5) {
//       const s3Top = arr[2]; // Start of Section 3
//       const overlap = (current + vh) - s3Top;

//       // Case A: Deep inside Section 2
//       // Allow FREE SCROLL. Do not snap.
//       if (overlap < 10) {
//         return;
//       }

//       // Case B: Transition Zone (Section 3 is entering)
//       const ratio = overlap / vh;
//       let target = -1;

//       if (ratio < 0.45) {
//         // Snap Back: "End of Section 2 touches end of screen"
//         target = Math.max(0, s3Top - vh);
//       } else {
//         // Snap Forward: To Start of Section 3
//         target = s3Top;
//       }

//       this.performSnap(target, current);
//       return;
//     }

//     // ✅ BRANCH 2: Standard Logic for Others (Section 1 and Section 3+)
//     let lo = 0, hi = arr.length - 1;
//     while (lo < hi) {
//       const mid = (lo + hi) >> 1;
//       if (arr[mid] < current) lo = mid + 1;
//       else hi = mid;
//     }

//     const next = arr[lo];
//     const prev = lo > 0 ? arr[lo - 1] : arr[0];

//     // Standard Nearest Target
//     const dPrev = Math.abs(current - prev);
//     const dNext = Math.abs(next - current);
//     const target = dPrev <= dNext ? prev : next;

//     this.performSnap(target, current);
//   }

//   private performSnap(target: number, current: number) {
//     const dist = Math.abs(target - current);
//     if (dist <= 12) return;

//     this.isSnappingMobile = true;
//     gsap.to(this.scrollEl, {
//       scrollTo: target,
//       duration: 0.75,
//       ease: 'power3.out',
//       overwrite: true,
//       onComplete: () => { this.isSnappingMobile = false; },
//       onInterrupt: () => { this.isSnappingMobile = false; },
//     });
//   }

//   private onResizeMobile = () => {
//     const h = (window.visualViewport?.height || window.innerHeight);
//     if (Math.abs(h - this.lastVVH) < 22) return;
//     this.lastVVH = h;

//     if (this.mobileResizeT) clearTimeout(this.mobileResizeT);
//     this.mobileResizeT = setTimeout(() => {
//       ScrollTrigger.refresh(true);
//       this.buildSnapPositionsMobile();
//     }, 220);
//   };

//   private destroyMobileSnap() {
//     try { this.mobileObserver?.kill?.(); } catch { }
//     window.removeEventListener('touchstart', this.onTouchStartMobile as any);
//     window.removeEventListener('touchend', this.onTouchEndMobile as any);
//     window.removeEventListener('resize', this.onResizeMobile);
//     window.visualViewport?.removeEventListener('resize', this.onResizeMobile);
//   }

//   // =================== NAVBAR OBSERVERS ===================
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
//         // window.removeEventListener('resize', this.onResizeMobile); // handled in destroyMobileSnap
//       } catch { }

//       try { this.snapObserver?.kill?.(); } catch { }

//       if (this.isMobile) {
//         this.destroyMobileSnap();
//       }

//       this.ctx?.revert();
//     }
//   }
// }
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

// import { SolutionsSection1Component } from './solutions-section1/solutions-section1.component';
// import { SolutionsSection2Component } from './solutions-section2/solutions-section2.component';
// import { SolutionsSection3Component } from './solutions-section3/solutions-section3.component';
// import { SolutionsSection5Component } from './solutions-section5/solutions-section5.component';
// import { SolutionsSection4Component } from './solutions-section4/solutions-section4.component';
// import { SolutionsSection6Component } from './solutions-section6/solutions-section6.component';

// gsap.registerPlugin(ScrollTrigger, ScrollSmoother, ScrollToPlugin);

// @Component({
//   selector: 'app-solutions',
//   imports: [
//     SolutionsSection1Component,
//     SolutionsSection2Component,
//     SolutionsSection3Component,
//     SolutionsSection5Component,
//     SolutionsSection4Component,
//     SolutionsSection6Component,
//     CommonModule,
//   ],
//   templateUrl: './solutions.component.html',
//   styleUrl: './solutions.component.scss',
// })
// export class SolutionsComponent {
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

//   // ✅ Desktop: debounce snap (captures scrollbar drag end too)
//   private desktopSnapDC?: ReturnType<typeof gsap.delayedCall>;
//   private lastDirDesktop: 1 | -1 = 1;
//   private lastScrollDesktop = 0;

//   // ✅ store desktop panel starts to map section index
//   private panelStartsDesktop: number[] = [];

//   // ✅ Section3 markers
//   private s3StartDesktop = 0;
//   private s4StartDesktop = 0;

//   // ✅ IMPORTANT: real "end view" of section3 (no white gap)
//   private s3EndViewDesktop = 0;

//   // native scroller reference
//   private desktopScrollerEl?: HTMLElement;

//   // ✅ kick صغير لباقي السكاشن عشان الانيميشن يشتغل
//   private readonly OTHER_SECTIONS_OFFSET = 2; // غيّريها لـ 1 لو عايزاه أهدى

//   // =================== MOBILE SNAP PROPERTIES ===================
//   private scrollEl!: HTMLElement;
//   private mobileObserver?: any;
//   private panelStartsMobile = new Set<number>();
//   private footerTopMobile = Number.POSITIVE_INFINITY;
//   private lastDirMobile: 1 | -1 = 1;
//   private isSnappingMobile = false;
//   private isTouchingMobile = false;
//   private lastVVH = 0;
//   private mobileResizeT: any = null;

//   // ✅ Mobile end view of section3
//   private s3EndViewMobile = 0;

//   constructor(
//     @Inject(PLATFORM_ID) private platformId: Object,
//     private ngZone: NgZone,
//     private cdr: ChangeDetectorRef,
//     private navTheme: NavbarThemeService,
//     private sectionsRegistry: SectionsRegistryService
//   ) {
//     this.isBrowser = isPlatformBrowser(this.platformId);
//   }

//   ngOnInit() {
//     if (!this.isBrowser) return;
//     this.isMobile = window.matchMedia('(max-width: 991px)').matches;
//   }

//   ngAfterViewInit(): void {
//     if (!this.isBrowser) return;

//     if (this.isMobile) {
//       setTimeout(() => this.initMobileSnap(), 750);
//       return;
//     }

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

//   // =================== DESKTOP ===================

//   private waitForSmoother(cb: (s: any) => void) {
//     const start = performance.now();
//     const tick = () => {
//       const s = ScrollSmoother.get() as any;
//       if (s) return cb(s);
//       if (performance.now() - start < 3000) requestAnimationFrame(tick);
//     };
//     tick();
//   }

//   private requestDesktopSnap = () => {
//     if (!this.smootherST || !this.smoother) return;
//     if (!this.snapPositions.length) return;

//     this.desktopSnapDC?.kill();
//     this.desktopSnapDC = gsap.delayedCall(0.7, () => this.doSnap());
//   };

//   // ✅ Native scroll handler (captures scrollbar drag end)
//   private onDesktopScrollNative = () => {
//     if (!this.smootherST) return;
//     const now = this.smootherST.scroll();
//     this.lastDirDesktop = now >= this.lastScrollDesktop ? 1 : -1;
//     this.lastScrollDesktop = now;
//     this.requestDesktopSnap();
//   };

//   private initDesktop(smoother: any) {
//     const scroller = smoother.wrapper();
//     this.desktopScrollerEl = scroller;

//     this.observeSections(scroller);

//     window.addEventListener('resize', this.onResize);

//     // ✅ track direction + catch drag scrollbar
//     this.lastScrollDesktop = this.smootherST?.scroll?.() ?? 0;
//     window.addEventListener('scroll', this.onDesktopScrollNative, { passive: true });
//     scroller.addEventListener('scroll', this.onDesktopScrollNative, { passive: true });

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
//     this.panelStartsDesktop = [];
//     this.s3StartDesktop = 0;
//     this.s4StartDesktop = 0;
//     this.s3EndViewDesktop = 0;

//     panels.forEach((panel, index) => {
//       const st = ScrollTrigger.create({
//         trigger: panel,
//         scroller,
//         start: 'top top',
//         refreshPriority: -1,
//         invalidateOnRefresh: true,
//       });

//       const start = st.start;

//       this.panelStartsDesktop.push(start);
//       this.snapPositions.push(start);

//       if (index === 2) this.s3StartDesktop = start;
//       if (index === 3) this.s4StartDesktop = start;

//       st.kill();
//     });

//     // ✅ compute "end view" of Section3 from its OWN bottom (prevents white gap)
//     const s3El = panels[2];
//     if (s3El) {
//       const st3 = ScrollTrigger.create({
//         trigger: s3El,
//         scroller,
//         start: 'top top',
//         end: 'bottom bottom',
//         refreshPriority: -1,
//         invalidateOnRefresh: true,
//       });
//       this.s3EndViewDesktop = Math.round(st3.end);
//       st3.kill();
//     }

//     this.snapPositions = Array.from(new Set(this.snapPositions)).sort((a, b) => a - b);
//   }

//   private initSnapObserver(smoother: any) {
//     this.snapObserver?.kill?.();

//     const scroller = smoother.wrapper();

//     this.snapObserver = ScrollTrigger.observe({
//       target: scroller,
//       type: 'wheel,scroll,touch',
//       onDown: () => { this.lastDirDesktop = 1; },
//       onUp: () => { this.lastDirDesktop = -1; },
//       onStop: () => this.requestDesktopSnap(),
//       onStopDelay: 0.7,
//     });
//   }

//   // ✅ Offset rule: Section2=0, Section3=10, others=OTHER_SECTIONS_OFFSET
//   private getDesktopOffsetForTarget(targetStart: number) {
//     const idx = this.panelStartsDesktop.indexOf(targetStart);
//     if (idx === 1) return 0; // Section2
//     if (idx === 2) return 10; // Section3
//     // if (idx >= 0) return this.OTHER_SECTIONS_OFFSET; // باقي السكاشن
//     if (idx === this.panelStartsDesktop.length - 1) return 50;
//     return 2;
//   }

//   private doSnap() {
//     if (!this.smootherST || !this.smoother) return;
//     if (!this.snapPositions.length) return;

//     const current = this.smootherST.scroll();
//     const vh = window.innerHeight;

//     // Footer guard
//     const lastSnap = this.snapPositions[this.snapPositions.length - 1];
//     if (current > lastSnap + 200) return;

//     // ============ ✅ SECTION 3 (FIX: no snap into white gap) ============
//     if (this.s3StartDesktop && this.s4StartDesktop && this.s3EndViewDesktop) {
//       const s3Top = this.s3StartDesktop;
//       const s4Top = this.s4StartDesktop;
//       const endView = this.s3EndViewDesktop;

//       const winTop = endView - vh * 0.8;
//       const winBottom = s4Top + vh * 0.25;
//       const inBoundaryWindow = current >= winTop && current <= winBottom;

//       // ✅ coming UP from below => always snap to endView
//       if (inBoundaryWindow && this.lastDirDesktop < 0) {
//         if (Math.abs(current - endView) > 10) this.smoother.scrollTo(endView, true);
//         return;
//       }

//       // ✅ reading mode inside section3: free scroll until close to endView
//       const inSection3 = current >= s3Top && current < s4Top;
//       if (inSection3) {
//         if (current < endView - 10) return; // free read (no snap)

//         const overlap = (current + vh) - s4Top;
//         if (overlap < 10) {
//           if (Math.abs(current - endView) > 10) this.smoother.scrollTo(endView, true);
//           return;
//         }

//         const ratio = overlap / vh;

//         // ✅ دخول سكشن 4 مع kick بسيط عشان الانيميشن يبدأ
//         const enterS4 = Math.round(s4Top + this.getDesktopOffsetForTarget(s4Top));
//         const target = ratio < 0.45 ? endView : enterS4;

//         if (Math.abs(current - target) > 10) this.smoother.scrollTo(target, true);
//         return;
//       }

//       // ✅ if we stopped in the gap area between endView and s4Top while scrolling DOWN
//       if (this.lastDirDesktop > 0 && current > endView - 5 && current < s4Top - 5) {
//         if (Math.abs(current - endView) > 10) this.smoother.scrollTo(endView, true);
//         return;
//       }
//     }
//     // ============ END SECTION 3 ============

//     // ---------- GLOBAL NEAREST SNAP (DESKTOP) ----------
//     let nearest = this.snapPositions[0];
//     let minDist = Math.abs(current - nearest);

//     for (const p of this.snapPositions) {
//       const d = Math.abs(current - p);
//       if (d < minDist) {
//         minDist = d;
//         nearest = p;
//       }
//     }

//     if (minDist <= 10) return;

//     const wantedOffset = this.getDesktopOffsetForTarget(nearest);

//     // safe offset: don't cross next section
//     const idx = this.snapPositions.indexOf(nearest);
//     const nextSnap = (idx >= 0 && idx < this.snapPositions.length - 1) ? this.snapPositions[idx + 1] : nearest;
//     const maxAllowedOffset = Math.max(0, nextSnap - nearest - 20);
//     const safeOffset = Math.min(wantedOffset, maxAllowedOffset);

//     let target = nearest;
//     if (nearest > 0 && safeOffset > 0) target = Math.round(nearest + safeOffset);

//     this.smoother.scrollTo(target, true);
//   }

//   // =================== MOBILE ===================

//   private onTouchStartMobile = () => { this.isTouchingMobile = true; };
//   private onTouchEndMobile = () => { this.isTouchingMobile = false; };

//   private initMobileSnap() {
//     ScrollTrigger.config({ ignoreMobileResize: true });

//     this.scrollEl = (document.scrollingElement || document.documentElement) as HTMLElement;

//     this.observeSectionsMobile();

//     window.addEventListener('touchstart', this.onTouchStartMobile, { passive: true });
//     window.addEventListener('touchend', this.onTouchEndMobile, { passive: true });

//     ScrollTrigger.refresh(true);
//     this.buildSnapPositionsMobile();
//     this.initMobileObserver();

//     this.lastVVH = (window.visualViewport?.height || window.innerHeight);
//     window.addEventListener('resize', this.onResizeMobile);
//     window.visualViewport?.addEventListener('resize', this.onResizeMobile);
//   }

//   private initMobileObserver() {
//     try { this.mobileObserver?.kill?.(); } catch { }

//     this.mobileObserver = ScrollTrigger.observe({
//       target: window,
//       type: 'wheel,touch,scroll',
//       onDown: () => { this.lastDirMobile = 1; },
//       onUp: () => { this.lastDirMobile = -1; },
//       onStop: () => {
//         if (this.isTouchingMobile) return;
//         this.doSnapMobile();
//       },
//       onStopDelay: 0.22,
//     });
//   }

//   private buildSnapPositionsMobile() {
//     const panels = gsap.utils.toArray<HTMLElement>('.panel');
//     this.snapPositions = [];
//     this.panelStartsMobile.clear();
//     this.s3EndViewMobile = 0;

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

//     // ✅ compute endView for Section3 on mobile from its own bottom
//     const s3El = panels[2];
//     if (s3El) {
//       const st3 = ScrollTrigger.create({
//         trigger: s3El,
//         start: 'top top',
//         end: 'bottom bottom',
//         refreshPriority: -1,
//         invalidateOnRefresh: true,
//       });
//       this.s3EndViewMobile = Math.round(st3.end);
//       st3.kill();
//     }

//     const footer = (document.querySelector('footer, app-footer, #footer, .footer') as HTMLElement | null);
//     this.footerTopMobile = footer
//       ? Math.round(footer.getBoundingClientRect().top + this.scrollEl.scrollTop)
//       : Number.POSITIVE_INFINITY;

//     this.snapPositions = Array.from(new Set(this.snapPositions)).sort((a, b) => a - b);
//   }

//   // ✅ Mobile offsets: Section2=0, Section3=10, others=OTHER_SECTIONS_OFFSET
//   private getMobileOffsetForTarget(targetStart: number) {
//     if (!this.panelStartsMobile.has(targetStart)) return 0;

//     const arr = this.snapPositions;
//     if (arr.length > 1 && targetStart === arr[1]) return 0;   // Section2
//     if (arr.length > 2 && targetStart === arr[2]) return 10;  // Section3
//     const lastStart = arr[arr.length - 1];
//     if (targetStart === lastStart) return 5;
//     return this.OTHER_SECTIONS_OFFSET; // باقي السكاشن
//   }
//   // ✅ Mobile: قد ايه “قريب من نهاية سكشن 3” عشان up-snap يشتغل
//   private readonly S3_UP_SNAP_ZONE_VH = 0.22; // 22% من ارتفاع الشاشة (قلّليها لو عايزاه أضيق)

//   private doSnapMobile() {
//     if (!this.snapPositions.length) return;
//     if (this.isSnappingMobile) return;
//     if (gsap.isTweening(this.scrollEl)) return;

//     const current = this.scrollEl.scrollTop;
//     const vh = (window.visualViewport?.height || window.innerHeight);

//     // footer zone
//     const footerZoneStart = this.footerTopMobile - vh * 0.25;
//     if (current >= footerZoneStart && this.lastDirMobile > 0) return;

//     const arr = this.snapPositions;

//     // Disable snapping once we enter LAST section
//     const lastStart = arr[arr.length - 1];
//     if (current >= lastStart - 2) return;

//     // ✅ Section3 fix on mobile (no snap into white gap)
//     if (arr.length > 3 && this.s3EndViewMobile) {
//       const s3Top = arr[2];
//       const s4Top = arr[3];
//       const endView = this.s3EndViewMobile;

//       const winTop = endView - vh * 0.8;
//       const winBottom = s4Top + vh * 0.25;
//       const inBoundaryWindow = current >= winTop && current <= winBottom;

//       if (inBoundaryWindow && this.lastDirMobile < 0) {
//         this.performSnap(endView, current);
//         return;
//       }

//       const inSection3 = current >= s3Top - 2 && current < s4Top - 5;
//       if (inSection3) {
//         if (current < endView - 10) return; // free read

//         const overlap = (current + vh) - s4Top;
//         if (overlap < 10) {
//           // this.performSnap(endView, current);
//           const upZoneStart = Math.max(s3Top, Math.round(endView - vh * this.S3_UP_SNAP_ZONE_VH));

//           if (this.lastDirMobile < 0) {
//             // لو مش قريب من النهاية -> سيبه يقرأ عادي (no snap)
//             if (current >= upZoneStart) {
//               this.performSnap(endView, current);
//             }
//             return;
//           }

//           // (نفس منطقك القديم للـ down) - قريب من النهاية؟ snap endView، غير كده snap بداية السكشن
//           const nearEnd = current >= endView - vh * 0.15;
//           if (nearEnd) {
//             this.performSnap(endView, current);
//             return;
//           }

//           // default: ثبّته على بداية سكشن 3 (مع offset=10 من performSnap)
//           this.performSnap(s3Top, current);
//           return;
//         }

//         const ratio = overlap / vh;

//         // ✅ دخول سكشن 4 مع kick بسيط عشان الانيميشن يبدأ
//         const enterS4 = Math.round(s4Top + this.getMobileOffsetForTarget(s4Top));
//         const target = ratio < 0.45 ? endView : enterS4;

//         this.performSnap(target, current);
//         return;
//       }

//       if (this.lastDirMobile > 0 && current > endView - 5 && current < s4Top - 5) {
//         this.performSnap(endView, current);
//         return;
//       }
//     }

//     // ✅ existing special logic for Section2 (as-is)
//     if (arr.length > 2 && current >= arr[1] - 2 && current < arr[2] - 5) {
//       const s3Top = arr[2];
//       const overlap = (current + vh) - s3Top;
//       if (overlap < 10) return;

//       const ratio = overlap / vh;
//       const target = ratio < 0.45 ? Math.max(0, s3Top - vh) : s3Top;
//       this.performSnap(target, current);
//       return;
//     }

//     // Standard nearest snap
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
//     const target = dPrev <= dNext ? prev : next;

//     this.performSnap(target, current);
//   }

//   private performSnap(target: number, current: number) {
//     const dist = Math.abs(target - current);
//     if (dist <= 12) return;

//     const arr = this.snapPositions;
//     const lastStart = arr[arr.length - 1];
//     if (current >= lastStart - 2) return;

//     // ✅ apply offset only if target is a section START
//     const offset = this.getMobileOffsetForTarget(target);
//     const finalTarget = Math.round(target + offset);

//     this.isSnappingMobile = true;

//     gsap.to(this.scrollEl, {
//       scrollTo: finalTarget,
//       duration: 0.75,
//       ease: 'power3.out',
//       overwrite: true,
//       onComplete: () => { this.isSnappingMobile = false; },
//       onInterrupt: () => { this.isSnappingMobile = false; },
//     });
//   }

//   private onResizeMobile = () => {
//     const h = (window.visualViewport?.height || window.innerHeight);
//     if (Math.abs(h - this.lastVVH) < 22) return;
//     this.lastVVH = h;

//     if (this.mobileResizeT) clearTimeout(this.mobileResizeT);
//     this.mobileResizeT = setTimeout(() => {
//       ScrollTrigger.refresh(true);
//       this.buildSnapPositionsMobile();
//     }, 220);
//   };

//   private destroyMobileSnap() {
//     try { this.mobileObserver?.kill?.(); } catch { }
//     window.removeEventListener('touchstart', this.onTouchStartMobile as any);
//     window.removeEventListener('touchend', this.onTouchEndMobile as any);
//     window.removeEventListener('resize', this.onResizeMobile);
//     window.visualViewport?.removeEventListener('resize', this.onResizeMobile);
//   }

//   // =================== NAVBAR OBSERVERS ===================

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

//     if (!this.isBrowser) return;

//     // desktop cleanup
//     try { window.removeEventListener('resize', this.onResize); } catch { }
//     try { window.removeEventListener('scroll', this.onDesktopScrollNative as any); } catch { }
//     try { this.desktopScrollerEl?.removeEventListener('scroll', this.onDesktopScrollNative as any); } catch { }
//     try { this.snapObserver?.kill?.(); } catch { }
//     this.desktopSnapDC?.kill();

//     // mobile cleanup
//     if (this.isMobile) {
//       this.destroyMobileSnap();
//     }

//     this.ctx?.revert();
//   }
// }
//old code
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

// import { SolutionsSection1Component } from './solutions-section1/solutions-section1.component';
// import { SolutionsSection2Component } from './solutions-section2/solutions-section2.component';
// import { SolutionsSection3Component } from './solutions-section3/solutions-section3.component';
// import { SolutionsSection5Component } from './solutions-section5/solutions-section5.component';
// import { SolutionsSection4Component } from './solutions-section4/solutions-section4.component';
// import { SolutionsSection6Component } from './solutions-section6/solutions-section6.component';

// gsap.registerPlugin(ScrollTrigger, ScrollSmoother, ScrollToPlugin);

// @Component({
//   selector: 'app-solutions',
//   imports: [
//     SolutionsSection1Component,
//     SolutionsSection2Component,
//     SolutionsSection3Component,
//     SolutionsSection5Component,
//     SolutionsSection4Component,
//     SolutionsSection6Component,
//     CommonModule,
//   ],
//   templateUrl: './solutions.component.html',
//   styleUrl: './solutions.component.scss',
// })
// export class SolutionsComponent {
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

//   // ✅ Desktop: debounce snap (captures scrollbar drag end too)
//   private desktopSnapDC?: gsap.core.Tween;
//   private lastDirDesktop: 1 | -1 = 1;
//   private lastScrollDesktop = 0;

//   // ✅ store desktop panel starts to map section index
//   private panelStartsDesktop: number[] = [];

//   // ✅ Section3 markers
//   private s3StartDesktop = 0;
//   private s4StartDesktop = 0;

//   // ✅ IMPORTANT: real "end view" of section3 (no white gap)
//   private s3EndViewDesktop = 0;

//   // native scroller reference
//   private desktopScrollerEl?: HTMLElement;

//   // =================== MOBILE SNAP PROPERTIES ===================
//   private scrollEl!: HTMLElement;
//   private mobileObserver?: any;
//   private panelStartsMobile = new Set<number>();
//   private footerTopMobile = Number.POSITIVE_INFINITY;
//   private lastDirMobile: 1 | -1 = 1;
//   private isSnappingMobile = false;
//   private isTouchingMobile = false;
//   private lastVVH = 0;
//   private mobileResizeT: any = null;
//   private mobileInitTimer: any = null;

//   // ✅ Mobile end view of section3
//   private s3EndViewMobile = 0;

//   // =================== TUNING CONSTANTS ===================
//   // ✅ مهم: ده اللي بيمنع "الفراغ الأبيض" + يخليك جوه السكشن شوية
//   private readonly S3_END_INSIDE_PX = 8;

//   // ✅ لازم Section4 يبقى داخل الشاشة قد ايه عشان نبدأ snap (Reading Mode)
//   private readonly S3_TRANSITION_OVERLAP_PX = 14;

//   // ✅ (الموبايل) نافذة السناب وانت طالع من تحت — صغّرتها عشان ما يسنّبش بدري
//   // قلّلهم أكتر لو لسه بيعمل snap بدري (مثلاً 0.12 / 0.06)
//   private readonly S3_UP_WINDOW_VH = 0.22;
//   private readonly S3_UP_WINDOW_BOTTOM_VH = 0.10;

//   // ✅ لما نقرر ندخل Section4 من Section3 — نخش جوه شوية عشان الانيميشن يشتغل
//   private readonly ENTER_NEXT_SECTION_OFFSET = 12;

//   constructor(
//     @Inject(PLATFORM_ID) private platformId: Object,
//     private ngZone: NgZone,
//     private cdr: ChangeDetectorRef,
//     private navTheme: NavbarThemeService,
//     private sectionsRegistry: SectionsRegistryService
//   ) {
//     this.isBrowser = isPlatformBrowser(this.platformId);
//   }

//   ngOnInit() {
//     if (!this.isBrowser) return;
//     this.isMobile = window.matchMedia('(max-width: 991px)').matches;
//   }

//   ngAfterViewInit(): void {
//     if (!this.isBrowser) return;

//     if (this.isMobile) {
//       this.mobileInitTimer = setTimeout(() => {
//         this.ctx = gsap.context(() => {
//           this.initMobileSnap();
//         });
//       }, 750);
//       return;
//     }

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

//   // =================== DESKTOP ===================

//   private waitForSmoother(cb: (s: any) => void) {
//     const start = performance.now();
//     const tick = () => {
//       const s = ScrollSmoother.get() as any;
//       if (s) return cb(s);
//       if (performance.now() - start < 3000) requestAnimationFrame(tick);
//     };
//     tick();
//   }

//   private requestDesktopSnap = () => {
//     if (!this.smootherST || !this.smoother) return;
//     if (!this.snapPositions.length) return;

//     this.desktopSnapDC?.kill();
//     this.desktopSnapDC = gsap.delayedCall(0.7, () => this.doSnap());
//   };

//   // ✅ Native scroll handler (captures scrollbar drag end)
//   private onDesktopScrollNative = () => {
//     if (!this.smootherST) return;
//     const now = this.smootherST.scroll();
//     this.lastDirDesktop = now >= this.lastScrollDesktop ? 1 : -1;
//     this.lastScrollDesktop = now;
//     this.requestDesktopSnap();
//   };

//   private initDesktop(smoother: any) {
//     const scroller = smoother.wrapper();
//     this.desktopScrollerEl = scroller;

//     this.observeSections(scroller);

//     window.addEventListener('resize', this.onResize);

//     // ✅ track direction + catch drag scrollbar
//     this.lastScrollDesktop = this.smootherST?.scroll?.() ?? 0;
//     window.addEventListener('scroll', this.onDesktopScrollNative, { passive: true });
//     scroller.addEventListener('scroll', this.onDesktopScrollNative, { passive: true });

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
//     this.panelStartsDesktop = [];
//     this.s3StartDesktop = 0;
//     this.s4StartDesktop = 0;
//     this.s3EndViewDesktop = 0;

//     panels.forEach((panel, index) => {
//       const st = ScrollTrigger.create({
//         trigger: panel,
//         scroller,
//         start: 'top top',
//         refreshPriority: -1,
//         invalidateOnRefresh: true,
//       });

//       const start = st.start;

//       this.panelStartsDesktop.push(start);
//       this.snapPositions.push(start);

//       if (index === 2) this.s3StartDesktop = start;
//       if (index === 3) this.s4StartDesktop = start;

//       st.kill();
//     });

//     // ✅ compute "end view" of Section3 from its OWN bottom (prevents white gap)
//     const s3El = panels[2];
//     if (s3El) {
//       const st3 = ScrollTrigger.create({
//         trigger: s3El,
//         scroller,
//         start: 'top top',
//         end: 'bottom bottom',
//         refreshPriority: -1,
//         invalidateOnRefresh: true,
//       });
//       this.s3EndViewDesktop = Math.round(st3.end);
//       st3.kill();
//     }

//     this.snapPositions = Array.from(new Set(this.snapPositions)).sort((a, b) => a - b);
//   }

//   private initSnapObserver(smoother: any) {
//     this.snapObserver?.kill?.();

//     const scroller = smoother.wrapper();

//     this.snapObserver = ScrollTrigger.observe({
//       target: scroller,
//       type: 'wheel,scroll,touch',
//       onDown: () => { this.lastDirDesktop = 1; },
//       onUp: () => { this.lastDirDesktop = -1; },
//       onStop: () => this.requestDesktopSnap(),
//       onStopDelay: 0.7,
//     });
//   }

//   // ✅ Offset rule: Section2=0, Section3=10, others=0
//   private getDesktopOffsetForTarget(targetStart: number) {
//     const idx = this.panelStartsDesktop.indexOf(targetStart);
//     if (idx === 1) return 0;   // Section2
//     if (idx === 2) return 10;  // Section3
//     return 0;                  // باقي السكاشن
//   }

//   private doSnap() {
//     if (!this.smootherST || !this.smoother) return;
//     if (!this.snapPositions.length) return;

//     const current = this.smootherST.scroll();
//     const vh = window.innerHeight;

//     // Footer guard
//     const lastSnap = this.snapPositions[this.snapPositions.length - 1];
//     if (current > lastSnap + 200) return;

//     // ============ SECTION 3 (DESKTOP) ============
//     if (this.s3StartDesktop && this.s4StartDesktop && this.s3EndViewDesktop) {
//       const s3Top = this.s3StartDesktop;
//       const s4Top = this.s4StartDesktop;
//       const endView = Math.max(s3Top, Math.round(this.s3EndViewDesktop - this.S3_END_INSIDE_PX));

//       // ✅ نافذة صغيرة للـ up-snap قرب نهاية السكشن
//       const upWinTop = endView - vh * 0.22;
//       const upWinBottom = s4Top + vh * 0.10;

//       if (this.lastDirDesktop < 0 && current >= upWinTop && current <= upWinBottom) {
//         if (Math.abs(current - endView) > 10) this.smoother.scrollTo(endView, true);
//         return;
//       }

//       const inSection3 = current >= s3Top && current < s4Top;
//       if (inSection3) {
//         // ✅ Reading mode: مفيش snap إلا لما السكشن اللي بعده يبدأ يظهر فعلاً
//         const overlap = (current + vh) - s4Top;
//         if (overlap < this.S3_TRANSITION_OVERLAP_PX) return;

//         const ratio = overlap / vh;
//         const enterS4 = Math.round(s4Top + this.ENTER_NEXT_SECTION_OFFSET);
//         const target = ratio < 0.45 ? endView : enterS4;

//         if (Math.abs(current - target) > 10) this.smoother.scrollTo(target, true);
//         return;
//       }

//       // ✅ لو وقف في gap بين endView و s4Top وهو نازل -> رجعه endView
//       if (this.lastDirDesktop > 0 && current > endView - 5 && current < s4Top - 5) {
//         if (Math.abs(current - endView) > 10) this.smoother.scrollTo(endView, true);
//         return;
//       }
//     }
//     // ============ END SECTION 3 ============

//     // ---------- GLOBAL NEAREST SNAP (DESKTOP) ----------
//     let nearest = this.snapPositions[0];
//     let minDist = Math.abs(current - nearest);

//     for (const p of this.snapPositions) {
//       const d = Math.abs(current - p);
//       if (d < minDist) {
//         minDist = d;
//         nearest = p;
//       }
//     }

//     if (minDist <= 10) return;

//     const wantedOffset = this.getDesktopOffsetForTarget(nearest);

//     // safe offset: don't cross next section
//     const idx = this.snapPositions.indexOf(nearest);
//     const nextSnap = (idx >= 0 && idx < this.snapPositions.length - 1) ? this.snapPositions[idx + 1] : nearest;
//     const maxAllowedOffset = Math.max(0, nextSnap - nearest - 20);
//     const safeOffset = Math.min(wantedOffset, maxAllowedOffset);

//     let target = nearest;
//     if (nearest > 0 && safeOffset > 0) target = Math.round(nearest + safeOffset);

//     this.smoother.scrollTo(target, true);
//   }

//   // =================== MOBILE ===================

//   private onTouchStartMobile = () => { this.isTouchingMobile = true; };
//   private onTouchEndMobile = () => { this.isTouchingMobile = false; };

//   private initMobileSnap() {
//     ScrollTrigger.config({ ignoreMobileResize: true });

//     this.scrollEl = (document.scrollingElement || document.documentElement) as HTMLElement;

//     this.observeSectionsMobile();

//     window.addEventListener('touchstart', this.onTouchStartMobile, { passive: true });
//     window.addEventListener('touchend', this.onTouchEndMobile, { passive: true });

//     ScrollTrigger.refresh(true);
//     this.buildSnapPositionsMobile();
//     this.initMobileObserver();

//     this.lastVVH = (window.visualViewport?.height || window.innerHeight);
//     window.addEventListener('resize', this.onResizeMobile);
//     window.visualViewport?.addEventListener('resize', this.onResizeMobile);
//   }

//   private initMobileObserver() {
//     try { this.mobileObserver?.kill?.(); } catch { }

//     this.mobileObserver = ScrollTrigger.observe({
//       target: window,
//       type: 'wheel,touch,scroll',
//       onDown: () => { this.lastDirMobile = 1; },
//       onUp: () => { this.lastDirMobile = -1; },
//       onStop: () => {
//         if (this.isTouchingMobile) return;
//         this.doSnapMobile();
//       },
//       onStopDelay: 0.22,
//     });
//   }

//   private buildSnapPositionsMobile() {
//     const panels = gsap.utils.toArray<HTMLElement>('.panel');
//     this.snapPositions = [];
//     this.panelStartsMobile.clear();
//     this.s3EndViewMobile = 0;

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

//     // ✅ compute endView for Section3 on mobile from its own bottom
//     const s3El = panels[2];
//     if (s3El) {
//       const st3 = ScrollTrigger.create({
//         trigger: s3El,
//         start: 'top top',
//         end: 'bottom bottom',
//         refreshPriority: -1,
//         invalidateOnRefresh: true,
//       });
//       this.s3EndViewMobile = Math.round(st3.end);
//       st3.kill();
//     }

//     const footer = (document.querySelector('footer, app-footer, #footer, .footer') as HTMLElement | null);
//     this.footerTopMobile = footer
//       ? Math.round(footer.getBoundingClientRect().top + this.scrollEl.scrollTop)
//       : Number.POSITIVE_INFINITY;

//     this.snapPositions = Array.from(new Set(this.snapPositions)).sort((a, b) => a - b);
//   }

//   // ✅ Mobile offsets: Section2=0, Section3=10, others=0
//   private getMobileOffsetForTarget(targetStart: number) {
//     if (!this.panelStartsMobile.has(targetStart)) return 0;

//     const arr = this.snapPositions;
//     if (arr.length > 1 && targetStart === arr[1]) return 0;   // Section2
//     if (arr.length > 2 && targetStart === arr[2]) return 10;  // Section3
//     return 0;                                                 // باقي السكاشن
//   }

//   private doSnapMobile() {
//     if (!this.snapPositions.length) return;
//     if (this.isSnappingMobile) return;
//     if (gsap.isTweening(this.scrollEl)) return;

//     const current = this.scrollEl.scrollTop;
//     const vh = (window.visualViewport?.height || window.innerHeight);

//     // footer zone
//     const footerZoneStart = this.footerTopMobile - vh * 0.25;
//     if (current >= footerZoneStart && this.lastDirMobile > 0) return;

//     const arr = this.snapPositions;

//     // Disable snapping once we enter LAST section
//     const lastStart = arr[arr.length - 1];
//     if (current >= lastStart - 2) return;

//     // ✅ Section3 (MOBILE) — fix: shrink snap range when coming from below + no snap while reading
//     if (arr.length > 3 && this.s3EndViewMobile) {
//       const s3Top = arr[2];
//       const s4Top = arr[3];
//       const endView = Math.max(s3Top, Math.round(this.s3EndViewMobile - this.S3_END_INSIDE_PX));

//       // ✅ (1) Coming UP from below: snap to endView فقط لو قريب جدًا من نهاية السكشن
//       const upWinTop = endView - vh * this.S3_UP_WINDOW_VH;
//       const upWinBottom = s4Top + vh * this.S3_UP_WINDOW_BOTTOM_VH;

//       if (this.lastDirMobile < 0 && current >= upWinTop && current <= upWinBottom) {
//         this.performSnap(endView, current);
//         return;
//       }

//       // ✅ (2) Reading mode inside Section3: مفيش snap إلا لما Section4 يبدأ يظهر (overlap)
//       const inSection3 = current >= s3Top - 2 && current < s4Top - 5;
//       if (inSection3) {
//         const overlap = (current + vh) - s4Top;

//         // ✅ طالما اللي بعده مش ظاهر، اقرأ براحتك
//         if (overlap < this.S3_TRANSITION_OVERLAP_PX) return;

//         const ratio = overlap / vh;
//         const enterS4 = Math.round(s4Top + this.ENTER_NEXT_SECTION_OFFSET);
//         const target = ratio < 0.45 ? endView : enterS4;

//         this.performSnap(target, current);
//         return;
//       }

//       // ✅ (3) لو وقف في gap بين نهاية Section3 وبداية Section4 وهو نازل
//       if (this.lastDirMobile > 0 && current > endView - 5 && current < s4Top - 5) {
//         this.performSnap(endView, current);
//         return;
//       }
//     }

//     // ✅ existing special logic for Section2 (as-is)
//     if (arr.length > 2 && current >= arr[1] - 2 && current < arr[2] - 5) {
//       const s3Top = arr[2];
//       const overlap = (current + vh) - s3Top;
//       if (overlap < 10) return;

//       const ratio = overlap / vh;
//       const target = ratio < 0.45 ? Math.max(0, s3Top - vh) : s3Top;
//       this.performSnap(target, current);
//       return;
//     }

//     // Standard nearest snap
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
//     const target = dPrev <= dNext ? prev : next;

//     this.performSnap(target, current);
//   }

//   private performSnap(target: number, current: number) {
//     const dist = Math.abs(target - current);
//     if (dist <= 12) return;

//     const arr = this.snapPositions;
//     const lastStart = arr[arr.length - 1];
//     if (current >= lastStart - 2) return;

//     // ✅ apply offset only if target is a section START (Section2=0, Section3=10, others=0)
//     const offset = this.getMobileOffsetForTarget(target);
//     const finalTarget = Math.round(target + offset);

//     this.isSnappingMobile = true;

//     gsap.to(this.scrollEl, {
//       scrollTo: finalTarget,
//       duration: 0.75,
//       ease: 'power3.out',
//       overwrite: true,
//       onComplete: () => { this.isSnappingMobile = false; },
//       onInterrupt: () => { this.isSnappingMobile = false; },
//     });
//   }

//   private onResizeMobile = () => {
//     const h = (window.visualViewport?.height || window.innerHeight);
//     if (Math.abs(h - this.lastVVH) < 22) return;
//     this.lastVVH = h;

//     if (this.mobileResizeT) clearTimeout(this.mobileResizeT);
//     this.mobileResizeT = setTimeout(() => {
//       ScrollTrigger.refresh(true);
//       this.buildSnapPositionsMobile();
//     }, 220);
//   };

//   private destroyMobileSnap() {
//     try { this.mobileObserver?.kill?.(); } catch { }
//     window.removeEventListener('touchstart', this.onTouchStartMobile as any);
//     window.removeEventListener('touchend', this.onTouchEndMobile as any);
//     window.removeEventListener('resize', this.onResizeMobile);
//     window.visualViewport?.removeEventListener('resize', this.onResizeMobile);
//   }

//   // =================== NAVBAR OBSERVERS ===================

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

//     // desktop cleanup
//     try { window.removeEventListener('resize', this.onResize); } catch { }
//     try { window.removeEventListener('scroll', this.onDesktopScrollNative as any); } catch { }
//     try { this.desktopScrollerEl?.removeEventListener('scroll', this.onDesktopScrollNative as any); } catch { }
//     try { this.snapObserver?.kill?.(); } catch { }
//     this.desktopSnapDC?.kill();

//     // mobile cleanup
//     this.destroyMobileSnap();

//     this.ctx?.revert();

//     // ✅ Final Safety
//     ScrollTrigger.getAll().forEach(t => t.kill());
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

import { SolutionsSection1Component } from './solutions-section1/solutions-section1.component';
import { SolutionsSection2Component } from './solutions-section2/solutions-section2.component';
import { SolutionsSection3Component } from './solutions-section3/solutions-section3.component';
import { SolutionsSection5Component } from './solutions-section5/solutions-section5.component';
import { SolutionsSection4Component } from './solutions-section4/solutions-section4.component';
import { SolutionsSection6Component } from './solutions-section6/solutions-section6.component';

gsap.registerPlugin(ScrollTrigger, ScrollSmoother, ScrollToPlugin);

@Component({
  selector: 'app-solutions',
  imports: [
    SolutionsSection1Component,
    SolutionsSection2Component,
    SolutionsSection3Component,
    SolutionsSection5Component,
    SolutionsSection4Component,
    SolutionsSection6Component,
    CommonModule,
  ],
  templateUrl: './solutions.component.html',
  styleUrl: './solutions.component.scss',
})
export class SolutionsComponent {
  private visibilitySubject = new BehaviorSubject<'visible' | 'invisible'>('visible');
  visibility$ = this.visibilitySubject.asObservable();
  visibilityState: 'visible' | 'invisible' = 'visible';

  menuOpen = false;
  isBrowser: boolean;
  isMobile!: boolean;

  private ctx?: gsap.Context;

  // Snap properties
  private snapObserver?: any;
  private snapPositions: number[] = [];
  private smoother: any;
  private smootherST: any;

  // ✅ Desktop: debounce snap (captures scrollbar drag end too)
  private desktopSnapDC?: gsap.core.Tween;
  private lastDirDesktop: 1 | -1 = 1;
  private lastScrollDesktop = 0;

  // ✅ store desktop panel starts to map section index
  private panelStartsDesktop: number[] = [];

  // ✅ Section3 markers
  private s3StartDesktop = 0;
  private s4StartDesktop = 0;

  // ✅ IMPORTANT: real "end view" of section3 (no white gap)
  private s3EndViewDesktop = 0;

  // native scroller reference
  private desktopScrollerEl?: HTMLElement;

  // =================== MOBILE SNAP PROPERTIES ===================
  private scrollEl!: HTMLElement;
  private mobileObserver?: any;
  private panelStartsMobile = new Set<number>();
  private footerTopMobile = Number.POSITIVE_INFINITY;
  private lastDirMobile: 1 | -1 = 1;
  private isSnappingMobile = false;
  private isTouchingMobile = false;
  private lastVVH = 0;
  private mobileResizeT: any = null;
  private mobileInitTimer: any = null;

  // ✅ Mobile end view of section3
  private s3EndViewMobile = 0;

  // =================== TUNING CONSTANTS ===================
  // ✅ مهم: ده اللي بيمنع "الفراغ الأبيض" + يخليك جوه السكشن شوية
  private readonly S3_END_INSIDE_PX = 8;

  // ✅ لازم Section4 يبقى داخل الشاشة قد ايه عشان نبدأ snap (Reading Mode)
  private readonly S3_TRANSITION_OVERLAP_PX = 14;

  // ✅ (الموبايل) نافذة السناب وانت طالع من تحت — صغّرتها عشان ما يسنّبش بدري
  // قلّلهم أكتر لو لسه بيعمل snap بدري (مثلاً 0.12 / 0.06)
  private readonly S3_UP_WINDOW_VH = 0.22;
  private readonly S3_UP_WINDOW_BOTTOM_VH = 0.10;

  // ✅ لما نقرر ندخل Section4 من Section3 — نخش جوه شوية عشان الانيميشن يشتغل
  private readonly ENTER_NEXT_SECTION_OFFSET = 12;

  // ✅ FIX: prevent 2nd auto-snap after programmatic snap completes (mobile only)
  private mobileSnapLockUntil = 0;
  private readonly MOBILE_SNAP_LOCK_MS = 900; // لازم أكبر من مدة السناب (0.75s)

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef,
    private navTheme: NavbarThemeService,
    private sectionsRegistry: SectionsRegistryService
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit() {
    if (!this.isBrowser) return;
    this.isMobile = window.matchMedia('(max-width: 991px)').matches;
  }

  ngAfterViewInit(): void {
    if (!this.isBrowser) return;

    if (this.isMobile) {
      this.mobileInitTimer = setTimeout(() => {
        this.ctx = gsap.context(() => {
          this.initMobileSnap();
        });
      }, 750);
      return;
    }

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

  // =================== DESKTOP ===================

  private waitForSmoother(cb: (s: any) => void) {
    const start = performance.now();
    const tick = () => {
      const s = ScrollSmoother.get() as any;
      if (s) return cb(s);
      if (performance.now() - start < 3000) requestAnimationFrame(tick);
    };
    tick();
  }

  private requestDesktopSnap = () => {
    if (!this.smootherST || !this.smoother) return;
    if (!this.snapPositions.length) return;

    this.desktopSnapDC?.kill();
    this.desktopSnapDC = gsap.delayedCall(0.7, () => this.doSnap());
  };

  // ✅ Native scroll handler (captures scrollbar drag end)
  private onDesktopScrollNative = () => {
    if (!this.smootherST) return;
    const now = this.smootherST.scroll();
    this.lastDirDesktop = now >= this.lastScrollDesktop ? 1 : -1;
    this.lastScrollDesktop = now;
    this.requestDesktopSnap();
  };

  private initDesktop(smoother: any) {
    const scroller = smoother.wrapper();
    this.desktopScrollerEl = scroller;

    this.observeSections(scroller);

    window.addEventListener('resize', this.onResize);

    // ✅ track direction + catch drag scrollbar
    this.lastScrollDesktop = this.smootherST?.scroll?.() ?? 0;
    window.addEventListener('scroll', this.onDesktopScrollNative, { passive: true });
    scroller.addEventListener('scroll', this.onDesktopScrollNative, { passive: true });

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
    this.panelStartsDesktop = [];
    this.s3StartDesktop = 0;
    this.s4StartDesktop = 0;
    this.s3EndViewDesktop = 0;

    panels.forEach((panel, index) => {
      const st = ScrollTrigger.create({
        trigger: panel,
        scroller,
        start: 'top top',
        refreshPriority: -1,
        invalidateOnRefresh: true,
      });

      const start = st.start;

      this.panelStartsDesktop.push(start);
      this.snapPositions.push(start);

      if (index === 2) this.s3StartDesktop = start;
      if (index === 3) this.s4StartDesktop = start;

      st.kill();
    });

    // ✅ compute "end view" of Section3 from its OWN bottom (prevents white gap)
    const s3El = panels[2];
    if (s3El) {
      const st3 = ScrollTrigger.create({
        trigger: s3El,
        scroller,
        start: 'top top',
        end: 'bottom bottom',
        refreshPriority: -1,
        invalidateOnRefresh: true,
      });
      this.s3EndViewDesktop = Math.round(st3.end);
      st3.kill();
    }

    this.snapPositions = Array.from(new Set(this.snapPositions)).sort((a, b) => a - b);
  }

  private initSnapObserver(smoother: any) {
    this.snapObserver?.kill?.();

    const scroller = smoother.wrapper();

    this.snapObserver = ScrollTrigger.observe({
      target: scroller,
      type: 'wheel,scroll,touch',
      onDown: () => { this.lastDirDesktop = 1; },
      onUp: () => { this.lastDirDesktop = -1; },
      onStop: () => this.requestDesktopSnap(),
      onStopDelay: 0.7,
    });
  }

  // ✅ Offset rule: Section2=0, Section3=10, others=0
  private getDesktopOffsetForTarget(targetStart: number) {
    const idx = this.panelStartsDesktop.indexOf(targetStart);
    if (idx === 1) return 0;   // Section2
    if (idx === 2) return 10;  // Section3
    return 0;                  // باقي السكاشن
  }

  private doSnap() {
    if (!this.smootherST || !this.smoother) return;
    if (!this.snapPositions.length) return;

    const current = this.smootherST.scroll();
    const vh = window.innerHeight;

    // Footer guard
    const lastSnap = this.snapPositions[this.snapPositions.length - 1];
    if (current > lastSnap + 200) return;

    // ============ SECTION 3 (DESKTOP) ============
    if (this.s3StartDesktop && this.s4StartDesktop && this.s3EndViewDesktop) {
      const s3Top = this.s3StartDesktop;
      const s4Top = this.s4StartDesktop;
      const endView = Math.max(s3Top, Math.round(this.s3EndViewDesktop - this.S3_END_INSIDE_PX));

      // ✅ نافذة صغيرة للـ up-snap قرب نهاية السكشن
      const upWinTop = endView - vh * 0.22;
      const upWinBottom = s4Top + vh * 0.10;

      if (this.lastDirDesktop < 0 && current >= upWinTop && current <= upWinBottom) {
        if (Math.abs(current - endView) > 10) this.smoother.scrollTo(endView, true);
        return;
      }

      const inSection3 = current >= s3Top && current < s4Top;
      if (inSection3) {
        // ✅ Reading mode: مفيش snap إلا لما السكشن اللي بعده يبدأ يظهر فعلاً
        const overlap = (current + vh) - s4Top;
        if (overlap < this.S3_TRANSITION_OVERLAP_PX) return;

        const ratio = overlap / vh;
        const enterS4 = Math.round(s4Top + this.ENTER_NEXT_SECTION_OFFSET);
        const target = ratio < 0.45 ? endView : enterS4;

        if (Math.abs(current - target) > 10) this.smoother.scrollTo(target, true);
        return;
      }

      // ✅ لو وقف في gap بين endView و s4Top وهو نازل -> رجعه endView
      if (this.lastDirDesktop > 0 && current > endView - 5 && current < s4Top - 5) {
        if (Math.abs(current - endView) > 10) this.smoother.scrollTo(endView, true);
        return;
      }
    }
    // ============ END SECTION 3 ============

    // ---------- GLOBAL NEAREST SNAP (DESKTOP) ----------
    let nearest = this.snapPositions[0];
    let minDist = Math.abs(current - nearest);

    for (const p of this.snapPositions) {
      const d = Math.abs(current - p);
      if (d < minDist) {
        minDist = d;
        nearest = p;
      }
    }

    if (minDist <= 10) return;

    const wantedOffset = this.getDesktopOffsetForTarget(nearest);

    // safe offset: don't cross next section
    const idx = this.snapPositions.indexOf(nearest);
    const nextSnap = (idx >= 0 && idx < this.snapPositions.length - 1) ? this.snapPositions[idx + 1] : nearest;
    const maxAllowedOffset = Math.max(0, nextSnap - nearest - 20);
    const safeOffset = Math.min(wantedOffset, maxAllowedOffset);

    let target = nearest;
    if (nearest > 0 && safeOffset > 0) target = Math.round(nearest + safeOffset);

    this.smoother.scrollTo(target, true);
  }

  // =================== MOBILE ===================

  private onTouchStartMobile = () => { this.isTouchingMobile = true; };
  private onTouchEndMobile = () => { this.isTouchingMobile = false; };

  private initMobileSnap() {
    ScrollTrigger.config({ ignoreMobileResize: true });

    this.scrollEl = (document.scrollingElement || document.documentElement) as HTMLElement;

    this.observeSectionsMobile();

    window.addEventListener('touchstart', this.onTouchStartMobile, { passive: true });
    window.addEventListener('touchend', this.onTouchEndMobile, { passive: true });

    ScrollTrigger.refresh(true);
    this.buildSnapPositionsMobile();
    this.initMobileObserver();

    this.lastVVH = (window.visualViewport?.height || window.innerHeight);
    window.addEventListener('resize', this.onResizeMobile);
    window.visualViewport?.addEventListener('resize', this.onResizeMobile);
  }

  private initMobileObserver() {
    try { this.mobileObserver?.kill?.(); } catch { }

    this.mobileObserver = ScrollTrigger.observe({
      target: window,
      type: 'wheel,touch,scroll',
      onDown: () => { this.lastDirMobile = 1; },
      onUp: () => { this.lastDirMobile = -1; },
      onStop: () => {
        if (this.isTouchingMobile) return;
        this.doSnapMobile();
      },
      onStopDelay: 0.22,
    });
  }

  private buildSnapPositionsMobile() {
    const panels = gsap.utils.toArray<HTMLElement>('.panel');
    this.snapPositions = [];
    this.panelStartsMobile.clear();
    this.s3EndViewMobile = 0;

    for (const panel of panels) {
      const st = ScrollTrigger.create({
        trigger: panel,
        start: 'top top',
        end: '+=1',
        refreshPriority: -1,
        invalidateOnRefresh: true,
      });

      const start = Math.round(st.start);
      this.snapPositions.push(start);
      this.panelStartsMobile.add(start);

      st.kill();
    }

    // ✅ compute endView for Section3 on mobile from its own bottom
    const s3El = panels[2];
    if (s3El) {
      const st3 = ScrollTrigger.create({
        trigger: s3El,
        start: 'top top',
        end: 'bottom bottom',
        refreshPriority: -1,
        invalidateOnRefresh: true,
      });
      this.s3EndViewMobile = Math.round(st3.end);
      st3.kill();
    }

    const footer = (document.querySelector('footer, app-footer, #footer, .footer') as HTMLElement | null);
    this.footerTopMobile = footer
      ? Math.round(footer.getBoundingClientRect().top + this.scrollEl.scrollTop)
      : Number.POSITIVE_INFINITY;

    this.snapPositions = Array.from(new Set(this.snapPositions)).sort((a, b) => a - b);
  }

  // ✅ Mobile offsets: Section2=0, Section3=10, others=0
  private getMobileOffsetForTarget(targetStart: number) {
    if (!this.panelStartsMobile.has(targetStart)) return 0;

    const arr = this.snapPositions;
    if (arr.length > 1 && targetStart === arr[1]) return 0;   // Section2
    if (arr.length > 2 && targetStart === arr[2]) return 10;  // Section3
    return 0;                                                 // باقي السكاشن
  }

  private doSnapMobile() {
    if (!this.snapPositions.length) return;
    if (this.isSnappingMobile) return;
    if (gsap.isTweening(this.scrollEl)) return;

    // ✅ FIX: block the "2nd onStop" that happens after programmatic snap completes
    const tNow = performance.now();
    if (tNow < this.mobileSnapLockUntil) return;

    const current = this.scrollEl.scrollTop;
    const vh = (window.visualViewport?.height || window.innerHeight);

    // footer zone
    const footerZoneStart = this.footerTopMobile - vh * 0.25;
    if (current >= footerZoneStart && this.lastDirMobile > 0) return;

    const arr = this.snapPositions;

    // Disable snapping once we enter LAST section
    const lastStart = arr[arr.length - 1];
    if (current >= lastStart - 2) return;

    // ✅ Section3 (MOBILE) — fix: shrink snap range when coming from below + no snap while reading
    if (arr.length > 3 && this.s3EndViewMobile) {
      const s3Top = arr[2];
      const s4Top = arr[3];
      const endView = Math.max(s3Top, Math.round(this.s3EndViewMobile - this.S3_END_INSIDE_PX));

      // ✅ (1) Coming UP from below: snap to endView فقط لو قريب جدًا من نهاية السكشن
      const upWinTop = endView - vh * this.S3_UP_WINDOW_VH;
      const upWinBottom = s4Top + vh * this.S3_UP_WINDOW_BOTTOM_VH;

      if (this.lastDirMobile < 0 && current >= upWinTop && current <= upWinBottom) {
        this.performSnap(endView, current);
        return;
      }

      // ✅ (2) Reading mode inside Section3: مفيش snap إلا لما Section4 يبدأ يظهر (overlap)
      const inSection3 = current >= s3Top - 2 && current < s4Top - 5;
      if (inSection3) {
        const overlap = (current + vh) - s4Top;

        // ✅ طالما اللي بعده مش ظاهر، اقرأ براحتك
        if (overlap < this.S3_TRANSITION_OVERLAP_PX) return;

        const ratio = overlap / vh;
        const enterS4 = Math.round(s4Top + this.ENTER_NEXT_SECTION_OFFSET);
        const target = ratio < 0.45 ? endView : enterS4;

        this.performSnap(target, current);
        return;
      }

      // ✅ (3) لو وقف في gap بين نهاية Section3 وبداية Section4 وهو نازل
      if (this.lastDirMobile > 0 && current > endView - 5 && current < s4Top - 5) {
        this.performSnap(endView, current);
        return;
      }
    }

    // ✅ existing special logic for Section2 (as-is)
    if (arr.length > 2 && current >= arr[1] - 2 && current < arr[2] - 5) {
      const s3Top = arr[2];
      const overlap = (current + vh) - s3Top;
      if (overlap < 10) return;

      const ratio = overlap / vh;
      const target = ratio < 0.45 ? Math.max(0, s3Top - vh) : s3Top;
      this.performSnap(target, current);
      return;
    }

    // Standard nearest snap
    let lo = 0, hi = arr.length - 1;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (arr[mid] < current) lo = mid + 1;
      else hi = mid;
    }

    const next = arr[lo];
    const prev = lo > 0 ? arr[lo - 1] : arr[0];

    const dPrev = Math.abs(current - prev);
    const dNext = Math.abs(next - current);
    const target = dPrev <= dNext ? prev : next;

    this.performSnap(target, current);
  }

  private performSnap(target: number, current: number) {
    const dist = Math.abs(target - current);
    if (dist <= 12) return;

    const arr = this.snapPositions;
    const lastStart = arr[arr.length - 1];
    if (current >= lastStart - 2) return;

    // ✅ apply offset only if target is a section START (Section2=0, Section3=10, others=0)
    const offset = this.getMobileOffsetForTarget(target);
    const finalTarget = Math.round(target + offset);

    this.isSnappingMobile = true;

    // ✅ FIX: lock snapping until after the programmatic tween ends
    this.mobileSnapLockUntil = performance.now() + this.MOBILE_SNAP_LOCK_MS;

    gsap.to(this.scrollEl, {
      scrollTo: finalTarget,
      duration: 0.75,
      ease: 'power3.out',
      overwrite: true,
      onComplete: () => { this.isSnappingMobile = false; },
      onInterrupt: () => { this.isSnappingMobile = false; },
    });
  }

  private onResizeMobile = () => {
    const h = (window.visualViewport?.height || window.innerHeight);
    if (Math.abs(h - this.lastVVH) < 22) return;
    this.lastVVH = h;

    if (this.mobileResizeT) clearTimeout(this.mobileResizeT);
    this.mobileResizeT = setTimeout(() => {
      ScrollTrigger.refresh(true);
      this.buildSnapPositionsMobile();
    }, 220);
  };

  private destroyMobileSnap() {
    try { this.mobileObserver?.kill?.(); } catch { }
    window.removeEventListener('touchstart', this.onTouchStartMobile as any);
    window.removeEventListener('touchend', this.onTouchEndMobile as any);
    window.removeEventListener('resize', this.onResizeMobile);
    window.visualViewport?.removeEventListener('resize', this.onResizeMobile);
  }

  // =================== NAVBAR OBSERVERS ===================

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
        onEnter: () => {
          this.navTheme.setColor(textColor);
          this.navTheme.setBg(bgColor);
        },
        onEnterBack: () => {
          this.navTheme.setColor(textColor);
          this.navTheme.setBg(bgColor);
        },
      });
    });
  }

  private observeSectionsMobile() {
    const sections = gsap.utils.toArray<HTMLElement>('.panel');

    sections.forEach((section) => {
      const textColor = section.dataset['textcolor'] || 'var(--primary)';
      const bgColor = section.dataset['bgcolor'] || 'var(--white)';

      ScrollTrigger.create({
        trigger: section,
        start: 'top 10%',
        end: 'bottom 50%',
        onEnter: () => {
          this.navTheme.setColor(textColor);
          this.navTheme.setBg(bgColor);
        },
        onEnterBack: () => {
          this.navTheme.setColor(textColor);
          this.navTheme.setBg(bgColor);
        },
      });
    });
  }

  private onResize = () => {
    ScrollTrigger.refresh();
    if (this.smoother) {
      setTimeout(() => this.buildSnapPositions(this.smoother), 100);
    }
    this.ngZone.run(() => {
      this.cdr.detectChanges();
    });
  };

  ngOnDestroy(): void {
    this.sectionsRegistry.clear();
    this.sectionsRegistry.disable();

    if (this.mobileInitTimer) {
      clearTimeout(this.mobileInitTimer);
    }

    if (!this.isBrowser) return;

    // desktop cleanup
    try { window.removeEventListener('resize', this.onResize); } catch { }
    try { window.removeEventListener('scroll', this.onDesktopScrollNative as any); } catch { }
    try { this.desktopScrollerEl?.removeEventListener('scroll', this.onDesktopScrollNative as any); } catch { }
    try { this.snapObserver?.kill?.(); } catch { }
    this.desktopSnapDC?.kill();

    // mobile cleanup
    this.destroyMobileSnap();

    this.ctx?.revert();

    // ✅ Final Safety
    ScrollTrigger.getAll().forEach(t => t.kill());
  }
}
