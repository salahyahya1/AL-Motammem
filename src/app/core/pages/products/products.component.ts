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

// import { ProductSection1Component } from "./product-section1/product-section1.component";
// import { ProductSection2Component } from "./product-section2/product-section2.component";
// import { ProductSection3Component } from "./product-section3/product-section3.component";
// import { ProductSection4Component } from "./product-section4/product-section4.component";
// import { ProductSection5Component } from "./product-section5/product-section5.component";
// import { ProductSection6Component } from "./product-section6/product-section6.component";
// import { ProductSection8Component } from "./product-section8/product-section8.component";
// import { ProductSection7Component } from "./product-section7/product-section7.component";

// gsap.registerPlugin(ScrollTrigger, ScrollSmoother, ScrollToPlugin);

// @Component({
//   selector: 'app-products',
//   imports: [ProductSection1Component, ProductSection2Component, ProductSection3Component, ProductSection4Component, ProductSection5Component, ProductSection6Component, ProductSection8Component, ProductSection7Component, CommonModule],
//   templateUrl: './products.component.html',
//   styleUrl: './products.component.scss'
// })
// export class ProductsComponent {
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
//     this.isMobile = window.matchMedia('(max-width: 991px)').matches; // Updated breakpoint to match ProductSection4 logic
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

//       // Section 4 (index 4) is PINNED on Desktop, so add its END
//       if (index === 4) {
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

//     // Deep Inside Section 4 Guard (Desktop Pinned)
//     // Section 4 Start is typically index 4. Its End is index 5.
//     const section4Start = this.snapPositions[4] || 0;
//     const section4End = this.snapPositions[5] || 0;
//     const viewportHeight = window.innerHeight;

//     const deepInsideSection4 =
//       currentScroll > section4Start + viewportHeight &&
//       currentScroll < section4End - viewportHeight;

//     if (deepInsideSection4) {
//       console.log('🚫 Deep inside Section 4, skipping global snap');
//       return;
//     }

//     // Snap Execution
//     if (minDistance > 10) {
//       const SNAP_OFFSET = 50;
//       let targetPosition = nearest;

//       // Don't add offset if snapping to Section 4 END
//       const isSection4End = nearest === section4End;
//       if (!isSection4End && nearest > 0) {
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

//     // Section 4 is NOT PINNED on mobile, so we don't need its end explicitly added as a snap point.
//     // Standard section starts are enough.

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
//     // const footerZoneStart = this.footerTopMobile - vh * 0.25;
//     // if (current >= footerZoneStart && this.lastDirMobile > 0) return;
//     // const footerZoneStart = this.footerTopMobile - vh * 0.35; // زوّدها شوية عشان يمنع الرجوع بدري
//     // console.log(footerZoneStart);
//     // if (current >= footerZoneStart) return; // ✅ no snap near footer مهما كان الاتجاه
//     const arr = this.snapPositions;
//     // ✅ Disable snapping once we enter the LAST section (free scroll to footer)
//     const lastStart = arr[arr.length - 1];
//     if (current >= lastStart - 2) return;

//     // ✅ BRANCH 1: Section 1 Logic (Reading Mode & Transition to Sec 2)
//     // Only applies if we have at least 2 sections and we are above the start of Sec 2
//     if (arr.length > 1 && current < arr[1] - 5) {
//       const s2Top = arr[1];
//       const overlap = (current + vh) - s2Top;

//       // Case A: Deep inside Section 1 (Section 2 not yet visible or just barely)
//       // Allow FREE SCROLL. Do not snap.
//       if (overlap < 10) {
//         return;
//       }

//       // Case B: Transition Zone (Section 2 is entering)
//       const ratio = overlap / vh;
//       let target = -1;

//       if (ratio < 0.45) {
//         // Snap Back: "End of Section 1 touches end of screen"
//         target = Math.max(0, s2Top - vh);
//       } else {
//         // Snap Forward: To Start of Section 2
//         target = s2Top;
//       }

//       this.performSnap(target, current);
//       return;
//     }

//     // ✅ BRANCH 2: Standard Logic for Section 2 and beyond
//     // Standard Nearest Neighbor Search
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
//     const arr = this.snapPositions;
//     const lastStart = arr[arr.length - 1];
//     if (current >= lastStart - 2) return;
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

//     if (this.isBrowser) {
//       try {
//         window.removeEventListener('resize', this.onResize);
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
import { SectionsRegistryService } from "../../shared/services/sections-registry.service";

import { ProductSection1Component } from "./product-section1/product-section1.component";
import { ProductSection2Component } from "./product-section2/product-section2.component";
import { ProductSection3Component } from "./product-section3/product-section3.component";
import { ProductSection4Component } from "./product-section4/product-section4.component";
import { ProductSection5Component } from "./product-section5/product-section5.component";
import { ProductSection6Component } from "./product-section6/product-section6.component";
import { ProductSection8Component } from "./product-section8/product-section8.component";
import { ProductSection7Component } from "./product-section7/product-section7.component";
import { PreloadService } from '../../services/preload.service';

gsap.registerPlugin(ScrollTrigger, ScrollSmoother, ScrollToPlugin);

@Component({
  selector: 'app-products',
  imports: [
    ProductSection1Component,
    ProductSection2Component,
    ProductSection3Component,
    ProductSection4Component,
    ProductSection5Component,
    ProductSection6Component,
    ProductSection8Component,
    ProductSection7Component,
    CommonModule
  ],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent {
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

  // ✅ NEW: Desktop snap debounce (captures scrollbar drag end via scrollEnd)
  private desktopSnapDC?: ReturnType<typeof gsap.delayedCall>;

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

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef,
    private navTheme: NavbarThemeService,
    private sectionsRegistry: SectionsRegistryService,
    private preloadService: PreloadService
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit() {
    if (!this.isBrowser) return;
    this.isMobile = window.matchMedia('(max-width: 991px)').matches; // same as your logic
    this.preloadService.addPreloads([
      { href: '/product/Nested Sequence 02.webm', as: 'vedio' },
    ]);
  }

  ngAfterViewInit(): void {
    if (!this.isBrowser) return;

    // Mobile specific path
    if (this.isMobile) {
      this.mobileInitTimer = setTimeout(() => this.initMobileSnap(), 750);
      return;
    }

    // Desktop: wait for smoother
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

  // =================== DESKTOP IMPLEMENTATION ===================

  private waitForSmoother(cb: (s: any) => void) {
    const start = performance.now();
    const tick = () => {
      const s = ScrollSmoother.get() as any;
      if (s) return cb(s);
      if (performance.now() - start < 3000) requestAnimationFrame(tick);
    };
    tick();
  }

  // ✅ NEW: same desktop feel (0.7s) but triggered also by scrollbar drag end
  private requestDesktopSnap = () => {
    if (!this.smootherST || !this.smoother) return;
    if (!this.snapPositions.length) return;

    this.desktopSnapDC?.kill();
    this.desktopSnapDC = gsap.delayedCall(0.7, () => this.doSnap());
  };

  // ✅ NEW: catches native scroll end (including dragging scrollbar)
  private onDesktopScrollEnd = () => {
    this.requestDesktopSnap();
  };

  private initDesktop(smoother: any) {
    const scroller = smoother.wrapper();

    // Navbar colors triggers
    this.observeSections(scroller);

    // Resize handler
    window.addEventListener('resize', this.onResize);

    // ✅ NEW: enable scrollEnd listener ONLY on desktop
    // (safe: removed on destroy)
    ScrollTrigger.addEventListener('scrollEnd', this.onDesktopScrollEnd);

    // Build snap positions
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
        start: "top top",
        refreshPriority: -1,
      });

      // Add section START position
      this.snapPositions.push(st.start);

      // Section 4 (index 4) is PINNED on Desktop, so add its END
      if (index === 4) {
        this.snapPositions.push(st.end);
      }

      st.kill();
    });

    // Sort and remove duplicates
    this.snapPositions = Array.from(new Set(this.snapPositions)).sort((a, b) => a - b);
  }

  private initSnapObserver(smoother: any) {
    this.snapObserver?.kill?.();

    const scroller = smoother.wrapper();

    this.snapObserver = ScrollTrigger.observe({
      target: scroller,
      onStop: () => {
        // ✅ بدل doSnap مباشرة: نخليها نفس سلوك scrollEnd (debounced + same 0.7 feel)
        this.requestDesktopSnap();
      },
      onStopDelay: 0.7
    });
  }

  private doSnap() {
    if (!this.smootherST || !this.smoother) return;
    if (this.snapPositions.length === 0) return;

    const currentScroll = this.smootherST.scroll();

    // Footer Guard
    const lastSnapPoint = this.snapPositions[this.snapPositions.length - 1];
    const footerThreshold = 200;

    if (currentScroll > lastSnapPoint + footerThreshold) {
      return;
    }

    // Find nearest snap position
    let nearest = this.snapPositions[0];
    let minDistance = Math.abs(currentScroll - nearest);

    for (const pos of this.snapPositions) {
      const distance = Math.abs(currentScroll - pos);
      if (distance < minDistance) {
        minDistance = distance;
        nearest = pos;
      }
    }

    // Deep Inside Section 4 Guard (Desktop Pinned)
    // Section 4 Start is typically index 4. Its End is index 5.
    const section4Start = this.snapPositions[4] || 0;
    const section4End = this.snapPositions[5] || 0;
    const viewportHeight = window.innerHeight;

    const deepInsideSection4 =
      currentScroll > section4Start + viewportHeight &&
      currentScroll < section4End - viewportHeight;

    if (deepInsideSection4) return;

    // Snap Execution
    if (minDistance > 10) {
      const SNAP_OFFSET = 50;
      let targetPosition = nearest;

      // Don't add offset if snapping to Section 4 END
      const isSection4End = nearest === section4End;

      // ✅ safe offset: ما يعدّيش بداية السكشن اللي بعده لو المسافة قصيرة
      const idx = this.snapPositions.indexOf(nearest);
      const nextSnap = (idx >= 0 && idx < this.snapPositions.length - 1) ? this.snapPositions[idx + 1] : nearest;
      const maxAllowedOffset = Math.max(0, nextSnap - nearest - 20); // buffer 20px
      const safeOffset = Math.min(SNAP_OFFSET, maxAllowedOffset);

      if (!isSection4End && nearest > 0 && safeOffset >= 8) {
        targetPosition = nearest + safeOffset;
      }

      this.smoother.scrollTo(targetPosition, true);
    }
  }

  // =================== MOBILE IMPLEMENTATION ===================

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

    const footer = (document.querySelector('footer, app-footer, #footer, .footer') as HTMLElement | null);
    this.footerTopMobile = footer
      ? Math.round(footer.getBoundingClientRect().top + this.scrollEl.scrollTop)
      : Number.POSITIVE_INFINITY;

    this.snapPositions = Array.from(new Set(this.snapPositions)).sort((a, b) => a - b);
  }

  private doSnapMobile() {
    if (!this.snapPositions.length) return;
    if (this.isSnappingMobile) return;
    if (gsap.isTweening(this.scrollEl)) return;

    const current = this.scrollEl.scrollTop;
    const vh = (window.visualViewport?.height || window.innerHeight);

    const arr = this.snapPositions;

    // ✅ Disable snapping once we enter the LAST section (free scroll to footer)
    const lastStart = arr[arr.length - 1];
    if (current >= lastStart - 2) return;

    // ✅ BRANCH 1: Section 1 Logic (Reading Mode & Transition to Sec 2)
    if (arr.length > 1 && current < arr[1] - 5) {
      const s2Top = arr[1];
      const overlap = (current + vh) - s2Top;

      // Deep inside Section 1 => free scroll
      if (overlap < 10) return;

      const ratio = overlap / vh;
      let target = -1;

      if (ratio < 0.45) {
        target = Math.max(0, s2Top - vh);
      } else {
        target = s2Top;
      }

      this.performSnap(target, current);
      return;
    }

    // ✅ BRANCH 2: Standard Logic for Section 2 and beyond
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

    this.isSnappingMobile = true;

    gsap.to(this.scrollEl, {
      scrollTo: target,
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

    // ✅ desktop cleanup
    try { window.removeEventListener('resize', this.onResize); } catch { }
    try { ScrollTrigger.removeEventListener('scrollEnd', this.onDesktopScrollEnd); } catch { }
    try { this.snapObserver?.kill?.(); } catch { }
    this.desktopSnapDC?.kill();

    // ✅ mobile cleanup once
    if (this.isMobile) {
      this.destroyMobileSnap();
    }

    this.ctx?.revert();
  }
}
