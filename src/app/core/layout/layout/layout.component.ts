// import { ChangeDetectorRef, Component, Inject, NgZone, PLATFORM_ID, OnDestroy, HostListener } from '@angular/core';
// import { ActivatedRoute, NavigationEnd, Router, RouterOutlet, Scroll } from "@angular/router";
// import { AsyncPipe, isPlatformBrowser } from '@angular/common';
// import { filter, auditTime, Subject, takeUntil } from 'rxjs';

// import { NavbarComponent } from "../../components/navbar/navbar.component";
// import { FooterComponent } from "../../components/footer/footer.component";
// import { SectionIndicatorComponent } from "../../components/section-indicator/section-indicator.component";
// import { FormDialogComponent } from "../../shared/form-dialog/form-dialog.component";

// import gsap from 'gsap';
// import ScrollTrigger from 'gsap/ScrollTrigger';
// import ScrollSmoother from 'gsap/ScrollSmoother';

// import { NavbarThemeService } from '../../components/navbar/navbar-theme.service';
// import { SectionsRegistryService } from '../../shared/services/sections-registry.service';

// gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

// @Component({
//   selector: 'app-layout',
//   imports: [
//     RouterOutlet,
//     NavbarComponent,
//     FooterComponent,
//     SectionIndicatorComponent,
//     AsyncPipe,
//     FormDialogComponent
//   ],
//   templateUrl: './layout.component.html',
//   styleUrl: './layout.component.scss'
// })
// export class LayoutComponent implements OnDestroy {
//   isBrowser: boolean;

//   private smoother: any = null;

//   // ✅ لمنع تكرار subscriptions لو حصل HMR أو re-init
//   private destroy$ = new Subject<void>();

//   // ✅ لمراقبة التحويل بين Desktop/Mobile بدون ريفرش
//   private mq: MediaQueryList | null = null;
//   private mqHandler: ((e: MediaQueryListEvent) => void) | null = null;

//   sections$: any;

//   @HostListener('window:app-scroll-to-section', ['$event'])
//   onManualScroll(event: any) {
//     if (!this.isBrowser) return;
//     const fragment = event.detail;
//     if (fragment) {
//       // Clear localStorage just in case it was set by NavbarComponent
//       localStorage.removeItem('scroll_to_section');
//       this.scrollToFragment(fragment, true);
//     }
//   }

//   constructor(
//     @Inject(PLATFORM_ID) private platformId: Object,
//     private ngZone: NgZone,
//     private cdr: ChangeDetectorRef,
//     private navTheme: NavbarThemeService,
//     private sectionsRegistry: SectionsRegistryService,
//     private router: Router,
//     private route: ActivatedRoute
//   ) {
//     this.isBrowser = isPlatformBrowser(this.platformId);
//   }

//   ngAfterViewInit(): void {
//     // ✅ حافظنا على auditTime(0) فقط (كان بيتكتب وبعدها بيتلغى)
//     this.sections$ = this.sectionsRegistry.sections$.pipe(auditTime(0));
//     if (!this.isBrowser) return;

//     this.ngZone.runOutsideAngular(() => {
//       setTimeout(() => {
//         this.initSmoothScroll();
//         this.setupFragmentScrolling();
//         this.setupResponsiveSmootherToggle(); // ✅ الجديد
//       }, 0);
//     });
//   }

//   private setupResponsiveSmootherToggle() {
//     this.mq = window.matchMedia('(max-width: 768px)');

//     this.mqHandler = (e: MediaQueryListEvent) => {
//       // دخل موبايل
//       if (e.matches) {
//         // ✅ Kill أي smoother شغال
//         try {
//           this.smoother?.kill?.();
//         } catch { }
//         this.smoother = null;

//         // ✅ Kill global smoother لو موجود (احتياطي)
//         try {
//           const global = (window as any).ScrollSmoother?.get?.();
//           global?.kill?.();
//         } catch { }

//         // ✅ رجّع ScrollTrigger للـ window scroller
//         ScrollTrigger.defaults({ scroller: window as any });
//         requestAnimationFrame(() => ScrollTrigger.refresh(true));
//         return;
//       }

//       // خرج من موبايل (رجع Desktop)
//       this.initSmoothScroll();
//       setTimeout(() => {
//         ScrollTrigger.refresh(true);
//         this.smoother?.refresh?.();
//       }, 60);
//     };

//     // add listener (حديث + قديم)
//     if ('addEventListener' in this.mq) {
//       this.mq.addEventListener('change', this.mqHandler);
//     } else {
//       (this.mq as any).addListener(this.mqHandler);
//     }
//   }

//   private setupFragmentScrolling() {
//     // Listen for Scroll events (covers loads + fragment + normal nav + back/forward)
//     this.router.events.pipe(
//       filter((e): e is Scroll => e instanceof Scroll),
//       takeUntil(this.destroy$)
//     ).subscribe(e => {
//       // ✅ Check localStorage on EVERY scroll event to handle same-page search navigation
//       const storedFragment = localStorage.getItem('scroll_to_section');
//       if (storedFragment) {
//         localStorage.removeItem('scroll_to_section');
//         this.scrollToFragment(storedFragment, true);
//         return;
//       }

//       if (e.anchor) {
//         this.scrollToFragment(e.anchor);
//       } else if (e.position) {
//         // ✅ Restore position (Back/Forward)
//         if (this.smoother) {
//           this.smoother.scrollTo(e.position[1], false);
//           setTimeout(() => {
//             ScrollTrigger.refresh(true);
//             this.smoother.refresh();
//           }, 50);
//         } else {
//           window.scrollTo(0, e.position[1]);
//         }
//       } else {
//         // ✅ Normal navigation -> Scroll to Top
//         if (this.smoother) {
//           this.smoother.scrollTo(0, false);
//           setTimeout(() => {
//             ScrollTrigger.refresh(true);
//             this.smoother.refresh();
//           }, 50);
//         } else {
//           window.scrollTo(0, 0);
//         }
//       }
//     });

//     // (اختياري ومفيد) تنظيف ذاكرة السكرول بعد كل NavigationEnd
//     this.router.events.pipe(
//       filter((e): e is NavigationEnd => e instanceof NavigationEnd),
//       takeUntil(this.destroy$)
//     ).subscribe(() => {
//       // بعض نسخ GSAP فيها clearScrollMemory
//       (ScrollTrigger as any).clearScrollMemory?.();
//     });

//     // Handle initial fragment/pending on load
//     const initialFragment = this.router.parseUrl(this.router.url).fragment;
//     const storedFragment = localStorage.getItem('scroll_to_section');

//     if (storedFragment) {
//       localStorage.removeItem('scroll_to_section');
//       this.scrollToFragment(storedFragment, true);
//     } else if (initialFragment) {
//       this.scrollToFragment(initialFragment);
//     }
//   }

//   private scrollToFragment(fragment: string, fromStorage = false) {
//     this.ngZone.runOutsideAngular(() => {
//       const getStableElement = () => document.getElementById(fragment);

//       let element = getStableElement();

//       // ✅ Mobile/Native scroll (no smoother)
//       if (!this.smoother) {
//         const performMobileScroll = (el: HTMLElement) => {
//           // Calculate offset for fixed navbar (usually 70-80px)
//           const offset = 80;
//           const bodyRect = document.body.getBoundingClientRect().top;
//           const elementRect = el.getBoundingClientRect().top;
//           const elementPosition = elementRect - bodyRect;
//           const offsetPosition = elementPosition - offset;

//           window.scrollTo({
//             top: offsetPosition,
//             behavior: 'smooth'
//           });
//         };

//         if (element) {
//           // Increase delay to ensure layout is stable after search closes
//           setTimeout(() => {
//             performMobileScroll(element!);
//           }, 350);
//         } else {
//           // If element not ready, wait longer
//           setTimeout(() => {
//             const el = document.getElementById(fragment);
//             if (el) performMobileScroll(el);
//           }, 1000);
//         }
//         return;
//       }

//       // ✅ Desktop (smoother)
//       if (!element) return;

//       let isMoving = true;
//       let lastTop = -1;
//       let stabilityCount = 0;
//       let checkCount = 0;
//       const maxChecks = 12;

//       const performScroll = (forceRefresh = false) => {
//         if (forceRefresh) {
//           ScrollTrigger.refresh(true);
//           this.smoother.refresh();
//         }

//         const currentElement = getStableElement();
//         if (currentElement) {
//           const isHero = currentElement.id === 'homeSection1' || currentElement.id === 'section1-home';
//           const skipOffset = isHero ? "top top" : "top -80px";

//           this.smoother.scrollTo(currentElement, true, skipOffset);
//           const rect = currentElement.getBoundingClientRect();
//           return rect.top + (window.pageYOffset || document.documentElement.scrollTop);
//         }
//         return -1;
//       };

//       const monitor = () => {
//         if (!isMoving) return;

//         checkCount++;
//         const currentRect = getStableElement()?.getBoundingClientRect();
//         const currentTop = currentRect
//           ? (currentRect.top + (window.pageYOffset || document.documentElement.scrollTop))
//           : -1;

//         if (Math.abs(currentTop - lastTop) > 10) {
//           lastTop = performScroll(checkCount % 3 === 0);
//           stabilityCount = 0;
//         } else {
//           stabilityCount++;
//         }

//         if (stabilityCount >= 3 && Math.abs(currentRect?.top || 999) < 20) {
//           isMoving = false;
//           return;
//         }

//         if (checkCount < maxChecks) {
//           setTimeout(monitor, 350);
//         } else {
//           isMoving = false;
//         }
//       };

//       lastTop = performScroll(true);
//       setTimeout(monitor, 400);
//     });
//   }

//   private initSmoothScroll() {
//     const isMobile = window.matchMedia('(max-width: 768px)').matches;

//     // ✅ Mobile: no smoother
//     if (isMobile) {
//       // لو كان شغال قبل كده، اقفله
//       try {
//         this.smoother?.kill?.();
//       } catch { }
//       this.smoother = null;

//       ScrollTrigger.defaults({ scroller: window as any });
//       requestAnimationFrame(() => ScrollTrigger.refresh(true));
//       return;
//     }

//     // ✅ Desktop: reuse existing smoother if exists
//     if ((window as any).ScrollSmoother?.get?.()) {
//       this.smoother = (window as any).ScrollSmoother.get();
//       ScrollTrigger.defaults({ scroller: this.smoother.wrapper() });
//       requestAnimationFrame(() => ScrollTrigger.refresh(true));
//       return;
//     }

//     this.smoother = ScrollSmoother.create({
//       wrapper: '#smooth-wrapper',
//       content: '#smooth-content',
//       smooth: 1.2,
//       normalizeScroll: true,
//       effects: false,
//       ignoreMobileResize: true,
//     });

//     ScrollTrigger.defaults({ scroller: this.smoother.wrapper() });
//     requestAnimationFrame(() => ScrollTrigger.refresh(true));
//     ScrollTrigger.config({ ignoreMobileResize: true });
//   }

//   ngOnDestroy(): void {
//     this.destroy$.next();
//     this.destroy$.complete();

//     try {
//       this.smoother?.kill?.();
//     } catch { }
//     this.smoother = null;

//     // remove media query listener
//     if (this.mq && this.mqHandler) {
//       if ('removeEventListener' in this.mq) {
//         this.mq.removeEventListener('change', this.mqHandler);
//       } else {
//         (this.mq as any).removeListener(this.mqHandler);
//       }
//     }
//   }
// }
import {
  ChangeDetectorRef,
  Component,
  Inject,
  NgZone,
  PLATFORM_ID,
  OnDestroy,
  HostListener,
} from '@angular/core';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterOutlet,
  Scroll,
} from '@angular/router';
import { AsyncPipe, isPlatformBrowser } from '@angular/common';
import { filter, auditTime, Subject, takeUntil } from 'rxjs';

import { NavbarComponent } from '../../components/navbar/navbar.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { SectionIndicatorComponent } from '../../components/section-indicator/section-indicator.component';
import { FormDialogComponent } from '../../shared/form-dialog/form-dialog.component';

import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import ScrollSmoother from 'gsap/ScrollSmoother';

import { NavbarThemeService } from '../../components/navbar/navbar-theme.service';
import { SectionsRegistryService } from '../../shared/services/sections-registry.service';
import { SearchNavigationCoordinatorService } from '../../services/search-navigation-coordinator.service';
import { ProgrammaticScrollService } from '../../services/programmatic-scroll.service';

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

@Component({
  selector: 'app-layout',
  imports: [
    RouterOutlet,
    NavbarComponent,
    FooterComponent,
    SectionIndicatorComponent,
    AsyncPipe,
    FormDialogComponent,
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
})
export class LayoutComponent implements OnDestroy {
  isBrowser: boolean;

  private smoother: any = null;

  // ✅ لمنع تكرار subscriptions لو حصل HMR أو re-init
  private destroy$ = new Subject<void>();

  // ✅ لمراقبة التحويل بين Desktop/Mobile بدون ريفرش
  private mq: MediaQueryList | null = null;
  private mqHandler: ((e: MediaQueryListEvent) => void) | null = null;

  sections$: any;

  private readonly NAV_OFFSET_PX = 80;

  @HostListener('window:app-scroll-to-section', ['$event'])
  onManualScroll(event: any) {
    if (!this.isBrowser) return;
    const fragment = event?.detail;
    if (fragment) {
      this.searchNav.setPendingFromFragment(fragment);
      this.searchNav.flushPendingScroll(this.smoother, this.NAV_OFFSET_PX);
    }
  }

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef,
    private navTheme: NavbarThemeService,
    private sectionsRegistry: SectionsRegistryService,
    private router: Router,
    private route: ActivatedRoute,
    private searchNav: SearchNavigationCoordinatorService,
    private programmaticScroll: ProgrammaticScrollService
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngAfterViewInit(): void {
    this.sections$ = this.sectionsRegistry.sections$.pipe(auditTime(0));
    if (!this.isBrowser) return;

    this.ngZone.runOutsideAngular(() => {
      setTimeout(() => {
        this.initSmoothScroll();
        this.setupFragmentScrolling();
        this.setupResponsiveSmootherToggle();
      }, 0);
    });
  }

  private setupResponsiveSmootherToggle() {
    this.mq = window.matchMedia('(max-width: 768px)');

    this.mqHandler = (e: MediaQueryListEvent) => {
      // دخل موبايل
      if (e.matches) {
        try {
          this.smoother?.kill?.();
        } catch {}
        this.smoother = null;

        try {
          const global = (window as any).ScrollSmoother?.get?.();
          global?.kill?.();
        } catch {}

        ScrollTrigger.defaults({ scroller: window as any });
        requestAnimationFrame(() => ScrollTrigger.refresh(true));
        return;
      }

      // خرج من موبايل (رجع Desktop)
      this.initSmoothScroll();
      setTimeout(() => {
        ScrollTrigger.refresh(true);
        this.smoother?.refresh?.();
      }, 60);
    };

    if ('addEventListener' in this.mq) {
      this.mq.addEventListener('change', this.mqHandler);
    } else {
      (this.mq as any).addListener(this.mqHandler);
    }
  }

  private setupFragmentScrolling() {
    if (!this.isBrowser) return;
  
    const normalize = (u: string) => {
      const clean = (u || '').split('?')[0].split('#')[0].trim();
      return clean.startsWith('/') ? clean : `/${clean}`;
    };
  
    // ✅ 1) Same-page search: pending$ emits -> flush بعد microtask + RAF
    this.searchNav.pending$
      .pipe(takeUntil(this.destroy$))
      .subscribe((target) => {
        if (!target?.fragment) return;
  
        const currentRoute = normalize(this.router.url);
        const targetRoute = normalize(target.route);
  
        // نفس الصفحة فقط
        if (targetRoute !== currentRoute) return;
  
        this.ngZone.runOutsideAngular(() => {
          queueMicrotask(() => {
            requestAnimationFrame(() => {
              this.searchNav.flushPendingScroll(this.smoother, this.NAV_OFFSET_PX);
            });
          });
        });
      });
  
    // ✅ 2) Router Scroll events: (Navigation load + anchor + back/forward + normal)
    this.router.events
      .pipe(
        filter((e): e is Scroll => e instanceof Scroll),
        takeUntil(this.destroy$)
      )
      .subscribe((e) => {
        // لو في pending fragment (من search أو من storage) => flush
        if (this.searchNav.getPendingFragment()) {
          this.ngZone.runOutsideAngular(() => {
            this.searchNav.flushPendingScroll(this.smoother, this.NAV_OFFSET_PX);
          });
          return;
        }
  
        // Anchor من الراوتر
        if (e.anchor) {
          this.searchNav.setPendingFromFragment(e.anchor);
          this.ngZone.runOutsideAngular(() => {
            this.searchNav.flushPendingScroll(this.smoother, this.NAV_OFFSET_PX);
          });
          return;
        }
  
        // Back/Forward restore
        if (e.position) {
          this.performSimpleScrollY(e.position[1]);
          return;
        }
  
        // Normal navigation -> top
        this.performSimpleScrollY(0);
      });
  
    // ✅ 3) NavigationEnd: clearScrollMemory + flush pending (بعد ما الـ DOM يبقى جاهز أكتر)
    this.router.events
      .pipe(
        filter((e): e is NavigationEnd => e instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        (ScrollTrigger as any).clearScrollMemory?.();
  
        if (this.searchNav.getPendingFragment()) {
          this.ngZone.runOutsideAngular(() => {
            queueMicrotask(() => {
              requestAnimationFrame(() => {
                this.searchNav.flushPendingScroll(this.smoother, this.NAV_OFFSET_PX);
              });
            });
          });
        }
      });
  
    // ✅ 4) Initial load: لو في pending أو url fragment -> flush مرة واحدة
    const initialStored = this.searchNav.getPendingFragment();
    const initialFragment = this.router.parseUrl(this.router.url).fragment;
  
    if (initialStored) {
      this.ngZone.runOutsideAngular(() => {
        queueMicrotask(() => {
          requestAnimationFrame(() => {
            this.searchNav.flushPendingScroll(this.smoother, this.NAV_OFFSET_PX);
          });
        });
      });
    } else if (initialFragment) {
      this.searchNav.setPendingFromFragment(initialFragment);
      this.ngZone.runOutsideAngular(() => {
        queueMicrotask(() => {
          requestAnimationFrame(() => {
            this.searchNav.flushPendingScroll(this.smoother, this.NAV_OFFSET_PX);
          });
        });
      });
    }
  }
  

  private performSimpleScrollY(y: number) {
    if (!this.isBrowser) return;

    const token = this.programmaticScroll.start('scroll-to-position');
    if (this.smoother) {
      this.smoother.scrollTo(y, false);
    } else {
      window.scrollTo(0, y);
    }
    const getScrollPos = () =>
      this.smoother && typeof this.smoother.scrollTop === 'function'
        ? this.smoother.scrollTop()
        : window.scrollY ?? window.pageYOffset ?? 0;
    this.programmaticScroll.endWhenSettle(token, getScrollPos, 2000, 4, 2, () => {
      try {
        ScrollTrigger.refresh(true);
        this.smoother?.refresh?.();
      } catch {}
    });
  }

  private initSmoothScroll() {
    const isMobile = window.matchMedia('(max-width: 768px)').matches;

    if (isMobile) {
      try {
        this.smoother?.kill?.();
      } catch {}
      this.smoother = null;

      ScrollTrigger.defaults({ scroller: window as any });
      requestAnimationFrame(() => ScrollTrigger.refresh(true));
      return;
    }

    if ((window as any).ScrollSmoother?.get?.()) {
      this.smoother = (window as any).ScrollSmoother.get();
      ScrollTrigger.defaults({ scroller: this.smoother.wrapper() });
      requestAnimationFrame(() => ScrollTrigger.refresh(true));
      return;
    }

    this.smoother = ScrollSmoother.create({
      wrapper: '#smooth-wrapper',
      content: '#smooth-content',
      smooth: 1.2,
      normalizeScroll: true,
      effects: false,
      ignoreMobileResize: true,
    });

    ScrollTrigger.defaults({ scroller: this.smoother.wrapper() });
    requestAnimationFrame(() => ScrollTrigger.refresh(true));
    ScrollTrigger.config({ ignoreMobileResize: true });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();

    try {
      this.smoother?.kill?.();
    } catch {}
    this.smoother = null;

    if (this.mq && this.mqHandler) {
      if ('removeEventListener' in this.mq) {
        this.mq.removeEventListener('change', this.mqHandler);
      } else {
        (this.mq as any).removeListener(this.mqHandler);
      }
    }
  }
}
