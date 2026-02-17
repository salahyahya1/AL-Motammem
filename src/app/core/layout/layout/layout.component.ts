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

//     if (!fragment) return;

//     // ✅ امسح الـ key فقط لو العنصر موجود فعلاً في الصفحة الحالية
//     const existsNow = !!document.getElementById(fragment);
//     if (existsNow) {
//       localStorage.removeItem('scroll_to_section');
//     }

//     this.scrollToFragment(fragment, true);
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
//         const existsNow = !!document.getElementById(storedFragment);

//         // ✅ لو موجود امسح فورًا
//         if (existsNow) {
//           localStorage.removeItem('scroll_to_section');
//         }

//         this.scrollToFragment(storedFragment, true);

//         // ✅ لو ماكانش موجود، ادي فرصة بسيطة وبعدها امسح (عشان مايبقاش zombie)
//         if (!existsNow) {
//           setTimeout(() => {
//             // امسح بعد ما حاولنا ندي وقت للـ DOM
//             localStorage.removeItem('scroll_to_section');
//           }, 2000);
//         }

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

//       // ✅ Flag to tell section snap logic (About page, etc.) that
//       // a programmatic "go to search result" scroll is in progress,
//       // so it shouldn't fight with us.
//       const markProgrammaticScrollStart = () => {
//         try {
//           (window as any).__appNavigatingToFragment = true;
//         } catch {
//           // ignore
//         }
//       };

//       const markProgrammaticScrollEnd = () => {
//         try {
//           (window as any).__appNavigatingToFragment = false;
//         } catch {
//           // ignore
//         }
//       };

//       let element = getStableElement();

//       // ✅ Mobile/Native scroll (no smoother)
//       if (!this.smoother) {
//         const performMobileScroll = (el: HTMLElement) => {
//           // Calculate offset for fixed navbar (usually 70-80px)
//           const offset = 10;
//           const bodyRect = document.body.getBoundingClientRect().top;
//           const elementRect = el.getBoundingClientRect().top;
//           const elementPosition = elementRect - bodyRect;
//           const offsetPosition = elementPosition - offset;

//           markProgrammaticScrollStart();

//           window.scrollTo({
//             top: offsetPosition,
//             behavior: 'smooth'
//           });

//           // Give the browser + any section animations time to settle
//           // before re‑enabling snap logic.
//           setTimeout(markProgrammaticScrollEnd, 1400);
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
//             if (el) {
//               performMobileScroll(el);
//             } else {
//               // Nothing to scroll to – clear the flag just in case
//               markProgrammaticScrollEnd();
//             }
//           }, 1000);
//         }
//         return;
//       }

//       // ✅ Desktop (smoother)
//       if (!element) {
//         // لا يوجد عنصر بالـ id المطلوب – تأكد من عدم ترك الفلاج مفعّل
//         markProgrammaticScrollEnd();
//         return;
//       }

//       markProgrammaticScrollStart();

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
//           const skipOffset = isHero ? "top top" : "top 1%";

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
//           // ✅ Scroll استقر عند العنصر المستهدف – رجّع السناب يشتغل تاني
//           markProgrammaticScrollEnd();
//           return;
//         }

//         if (checkCount < maxChecks) {
//           setTimeout(monitor, 350);
//         } else {
//           isMoving = false;
//           // ✅ حتى لو منجحناش نوصل بالظبط، لازم نرجّع الفلاج
//           markProgrammaticScrollEnd();
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
  AfterViewInit
} from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet, Scroll } from "@angular/router";
import { AsyncPipe, isPlatformBrowser } from '@angular/common';
import { filter, auditTime, Subject, takeUntil } from 'rxjs';

import { NavbarComponent } from "../../components/navbar/navbar.component";
import { FooterComponent } from "../../components/footer/footer.component";
import { SectionIndicatorComponent } from "../../components/section-indicator/section-indicator.component";
import { FormDialogComponent } from "../../shared/form-dialog/form-dialog.component";

import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import ScrollSmoother from 'gsap/ScrollSmoother';

import { NavbarThemeService } from '../../components/navbar/navbar-theme.service';
import { SectionsRegistryService } from '../../shared/services/sections-registry.service';

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

@Component({
  selector: 'app-layout',
  imports: [
    RouterOutlet,
    NavbarComponent,
    FooterComponent,
    SectionIndicatorComponent,
    AsyncPipe,
    FormDialogComponent
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent implements AfterViewInit, OnDestroy {
  isBrowser: boolean;
  private smoother: any = null;

  private destroy$ = new Subject<void>();

  private mq: MediaQueryList | null = null;
  private mqHandler: ((e: MediaQueryListEvent) => void) | null = null;

  sections$: any;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef,
    private navTheme: NavbarThemeService,
    private sectionsRegistry: SectionsRegistryService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  // ✅ helper: split "AboutSection3::VISION" -> { baseId:"AboutSection3", scene:"VISION" }
  private parseFragment(fragment: string): { baseId: string; scene?: string } {
    const raw = (fragment || '').trim();
    if (!raw) return { baseId: '' };

    const parts = raw.split('::');
    const baseId = (parts[0] || '').trim();
    const scene = (parts[1] || '').trim();
    return { baseId, scene: scene ? scene.toUpperCase() : undefined };
  }

  private dispatchAboutS3(scene?: string) {
    if (!scene) return;
    window.dispatchEvent(new CustomEvent('ABOUT_S3_GOTO', { detail: { scene } }));
  }

  @HostListener('window:app-scroll-to-section', ['$event'])
  onManualScroll(event: any) {
    if (!this.isBrowser) return;

    const fragment = event?.detail;
    if (!fragment) return;

    // ✅ IMPORTANT: امسح فورًا (حتى لو element مش موجود بسبب ::)
    try { localStorage.removeItem('scroll_to_section'); } catch { }

    this.scrollToFragment(fragment, true);
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
    try {
      gsap.set('#smooth-content', { clearProps: 'transform' });
      gsap.set('#smooth-wrapper', { clearProps: 'height' });
    } catch { }

    this.mqHandler = (e: MediaQueryListEvent) => {
      if (e.matches) {
        try { this.smoother?.kill?.(); } catch { }
        this.smoother = null;

        try {
          const global = (window as any).ScrollSmoother?.get?.();
          global?.kill?.();
        } catch { }

        ScrollTrigger.defaults({ scroller: window as any });
        requestAnimationFrame(() => ScrollTrigger.refresh(true));
        return;
      }

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
    this.router.events.pipe(
      filter((e): e is Scroll => e instanceof Scroll),
      takeUntil(this.destroy$)
    ).subscribe(e => {
      // ✅ ALWAYS consume stored fragment once (no existsNow check)
      const storedFragment = (() => {
        try { return localStorage.getItem('scroll_to_section'); } catch { return null; }
      })();

      if (storedFragment) {
        try { localStorage.removeItem('scroll_to_section'); } catch { }
        this.scrollToFragment(storedFragment, true);
        return;
      }

      if (e.anchor) {
        this.scrollToFragment(e.anchor);
      } else if (e.position) {
        if (this.smoother) {
          this.smoother.scrollTo(e.position[1], false);
          setTimeout(() => {
            ScrollTrigger.refresh(true);
            this.smoother.refresh();
          }, 50);
        } else {
          window.scrollTo(0, e.position[1]);
        }
      } else {
        if (this.smoother) {
          this.smoother.scrollTo(0, false);
          setTimeout(() => {
            ScrollTrigger.refresh(true);
            this.smoother.refresh();
          }, 50);
        } else {
          window.scrollTo(0, 0);
        }
      }
    });

    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      (ScrollTrigger as any).clearScrollMemory?.();
    });

    const initialFragment = this.router.parseUrl(this.router.url).fragment;
    const storedFragment = (() => {
      try { return localStorage.getItem('scroll_to_section'); } catch { return null; }
    })();

    if (storedFragment) {
      try { localStorage.removeItem('scroll_to_section'); } catch { }
      this.scrollToFragment(storedFragment, true);
    } else if (initialFragment) {
      this.scrollToFragment(initialFragment);
    }
  }
  private readonly SEARCH_NUDGE_PX = 1; // عدّليها 60/80/100 حسب احساسك

  private scrollToFragment(fragment: string, fromStorage = false) {
    this.ngZone.runOutsideAngular(() => {
      const { baseId, scene } = this.parseFragment(fragment);
      if (!baseId) return;

      const getStableElement = () => document.getElementById(baseId);

      const markProgrammaticScrollStart = () => {
        try { (window as any).__appNavigatingToFragment = true; } catch { }
      };

      const markProgrammaticScrollEnd = () => {
        try { (window as any).__appNavigatingToFragment = false; } catch { }
      };

      // ✅ MOBILE / Native scroll
      if (!this.smoother) {
        // const performMobileScroll = (el: HTMLElement) => {
        //   const offset = 0;
        //   const bodyRectTop = document.body.getBoundingClientRect().top;
        //   const elementRectTop = el.getBoundingClientRect().top;
        //   const elementPosition = elementRectTop - bodyRectTop;
        //   const offsetPosition = elementPosition - offset + this.SEARCH_NUDGE_PX;

        //   markProgrammaticScrollStart();

        //   window.scrollTo({ top: offsetPosition, behavior: 'smooth' });

        //   // بعد ما نوصل تقريبًا، ابعت scene لو موجود
        //   if (scene) setTimeout(() => this.dispatchAboutS3(scene), 650);

        //   setTimeout(markProgrammaticScrollEnd, 1400);
        // };
        const performMobileScroll = (el: HTMLElement) => {
          markProgrammaticScrollStart();

          const doScroll = () => {
            const targetTop =
              el.getBoundingClientRect().top +
              (window.pageYOffset || document.documentElement.scrollTop) +
              this.SEARCH_NUDGE_PX;

            window.scrollTo({ top: targetTop, behavior: 'smooth' });
          };

          doScroll();

          // ✅ تصحيح بعد ما الصفحة “تستقر” (مهم جدًا مع GSAP/صور)
          setTimeout(doScroll, 450);

          if (scene) setTimeout(() => this.dispatchAboutS3(scene), 650);
          setTimeout(markProgrammaticScrollEnd, 1400);
        };

        const elNow = getStableElement();
        if (elNow) {
          setTimeout(() => performMobileScroll(elNow), 250);
        } else {
          setTimeout(() => {
            const el = getStableElement();
            if (el) performMobileScroll(el);
            else markProgrammaticScrollEnd();
          }, 900);
        }
        return;
      }

      // ✅ DESKTOP / smoother
      const element = getStableElement();
      if (!element) {
        markProgrammaticScrollEnd();
        return;
      }

      markProgrammaticScrollStart();

      // ✅ refresh مرة واحدة بس لتقليل الفلاش
      try {
        ScrollTrigger.refresh(true);
        this.smoother.refresh();
      } catch { }

      const isHero = element.id === 'homeSection1' || element.id === 'section1-home';
      const skipOffset = isHero ? 'top top' : 'top -10%';

      const offsetY = this.SEARCH_NUDGE_PX;

      try {
        this.smoother.scrollTo(element, true, `top+=${offsetY} top`);
      } catch {
        try {
          const y = (element as any).offsetTop ?? element.getBoundingClientRect().top + (window.scrollY || 0);
          this.smoother.scrollTo(y + offsetY, true);
        } catch { }
      }

      let checks = 0;
      const maxChecks = 10;

      const monitor = () => {
        checks++;
        const el = getStableElement();
        if (!el) { markProgrammaticScrollEnd(); return; }

        const rect = el.getBoundingClientRect();

        // ✅ الوصول الحقيقي بعد النَدْه
        if (Math.abs(rect.top + offsetY) < 20) {
          if (scene) setTimeout(() => this.dispatchAboutS3(scene), 120);
          markProgrammaticScrollEnd();
          return;
        }

        // ✅ كرر بنفس الـ offset مش skipOffset
        try {
          this.smoother.scrollTo(el, true, `top+=${offsetY} top`);
        } catch { }

        if (checks < maxChecks) setTimeout(monitor, 220);
        else {
          if (scene) setTimeout(() => this.dispatchAboutS3(scene), 120);
          markProgrammaticScrollEnd();
        }
      };

      setTimeout(monitor, 260);

    });
  }

  private initSmoothScroll() {
    const isMobile = window.matchMedia('(max-width: 768px)').matches;

    if (isMobile) {
      try { this.smoother?.kill?.(); } catch { }
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

    try { this.smoother?.kill?.(); } catch { }
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
