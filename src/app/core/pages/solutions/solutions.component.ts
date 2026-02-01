import {
  Component,
  Inject,
  PLATFORM_ID,
  NgZone,
  ChangeDetectorRef,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { BehaviorSubject } from 'rxjs';
import { NavbarThemeService } from '../../components/navbar/navbar-theme.service';
import { SectionsRegistryService } from "../../shared/services/sections-registry.service";
import ScrollToPlugin from 'gsap/ScrollToPlugin';


import { SolutionsSection1Component } from "./solutions-section1/solutions-section1.component";
import { SolutionsSection2Component } from "./solutions-section2/solutions-section2.component";
import { SolutionsSection3Component } from './solutions-section3/solutions-section3.component';
import { SolutionsSection5Component } from "./solutions-section5/solutions-section5.component";
import { SolutionsSection4Component } from "./solutions-section4/solutions-section4.component";
import { SolutionsSection6Component } from "./solutions-section6/solutions-section6.component";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

@Component({
  selector: 'app-solutions',
  imports: [SolutionsSection1Component, SolutionsSection2Component, SolutionsSection3Component, SolutionsSection5Component, SolutionsSection4Component, SolutionsSection6Component],
  templateUrl: './solutions.component.html',
  styleUrl: './solutions.component.scss'
})
export class SolutionsComponent {

  private visibilitySubject = new BehaviorSubject<'visible' | 'invisible'>('visible');
  visibility$ = this.visibilitySubject.asObservable();
  visibilityState: 'visible' | 'invisible' = 'visible';



  menuOpen = false;
  isBrowser: boolean;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef,
    private navTheme: NavbarThemeService,
    private sectionsRegistry: SectionsRegistryService
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }
  private ctx2?: gsap.Context;
  private onResizeRefresh = () => ScrollTrigger.refresh();
  private onResizeCD = () => {
    this.ngZone.run(() => this.cdr.detectChanges());
  };
  ngAfterViewInit(): void {
    if (!this.isBrowser) return;

    this.ngZone.runOutsideAngular(() => {
      setTimeout(() => {
        this.ctx2 = gsap.context(() => {
          this.observeSections();

          window.addEventListener('resize', this.onResizeCD);
          window.addEventListener('resize', this.onResizeRefresh);

          ScrollTrigger.refresh();
        });
      }, 150);

    });
  }
  private observeSections() {
    const sections = gsap.utils.toArray<HTMLElement>('.panel');

    sections.forEach((section) => {
      const bgColor = section.dataset['bgcolor'] || 'var(--white)';
      const textColor = section.dataset['textcolor'] || 'var(--primary)';

      ScrollTrigger.create({
        trigger: section,
        start: 'top 50%',
        end: 'bottom 50%',
        // onEnter: () => this.updateNavbarColors(textColor),
        // onEnterBack: () => this.updateNavbarColors(textColor),
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
  ngOnDestroy(): void {
    this.sectionsRegistry.clear();
    this.sectionsRegistry.disable();

    if (this.isBrowser) {
      window.removeEventListener('resize', this.onResizeCD);
      window.removeEventListener('resize', this.onResizeRefresh);
    }

    this.ctx2?.revert();
  }
}

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
//       const SNAP_OFFSET = 50;
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
