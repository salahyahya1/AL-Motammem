// import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
// import { isPlatformBrowser } from '@angular/common';
// import { Router } from '@angular/router';
// import { BehaviorSubject } from 'rxjs';
// import { ProgrammaticScrollService } from './programmatic-scroll.service';
// import { FaqAccordionRegistryService } from './faq-accordion-registry.service';

// const STORAGE_KEY = 'scroll_to_section';
// const RETRY_DELAYS_MS = [0, 50, 120, 250, 450, 800, 1200];
// const MAX_WAIT_MS = 3000;

// export interface PendingNavigationTarget {
//   route: string;
//   fragment?: string;
//   source?: string;
// }

// @Injectable({ providedIn: 'root' })
// export class SearchNavigationCoordinatorService {
//   private pending: PendingNavigationTarget | null = null;

//   /** Emitted whenever pending is set (requestNavigation or setPendingFromFragment). Layout subscribes for same-page flush. */
//   readonly pending$ = new BehaviorSubject<PendingNavigationTarget | null>(null);

//   constructor(
//     @Inject(PLATFORM_ID) private platformId: Object,
//     private router: Router,
//     private programmaticScroll: ProgrammaticScrollService,
//     private faqRegistry: FaqAccordionRegistryService
//   ) {}

//   get isBrowser(): boolean {
//     return isPlatformBrowser(this.platformId);
//   }

//   /**
//    * Called by Navbar/SearchResults when user clicks a search result.
//    * Stores pending target, emits to pending$, and navigates. Layout is the only place that calls flushPendingScroll.
//    */
//   requestNavigation(target: PendingNavigationTarget): void {
//     if (!this.isBrowser) return;
//     this.pending = { ...target };
//     this.pending$.next(this.pending);
//     if (target.fragment) {
//       try {
//         localStorage.setItem(STORAGE_KEY, target.fragment);
//       } catch {}
//     }
//     this.router.navigateByUrl(target.route);
//   }

//   /**
//    * Set pending from fragment only (e.g. when HostListener app-scroll-to-section fires on same page).
//    */
//   setPendingFromFragment(fragment: string): void {
//     if (!this.isBrowser) return;
//     const route = this.router.url.split('?')[0].split('#')[0];
//     this.pending = { route, fragment, source: 'event' };
//     this.pending$.next(this.pending);
//     try {
//       localStorage.setItem(STORAGE_KEY, fragment);
//     } catch {}
//   }

//   /**
//    * Returns pending fragment if any (from memory or localStorage). Does not clear.
//    */
//   getPendingFragment(): string | null {
//     if (!this.isBrowser) return null;
//     if (this.pending?.fragment) return this.pending.fragment;
//     try {
//       return localStorage.getItem(STORAGE_KEY);
//     } catch {
//       return null;
//     }
//   }

//   /**
//    * Called ONLY by Layout after Scroll/NavigationEnd, initial load, or pending$ same-page.
//    * Resolves element by fragment with retry/backoff (max ~3s), wraps scroll in ProgrammaticScrollService,
//    * uses smoother on desktop and window on mobile. Opens FAQ accordion when fragment starts with "faq-".
//    */
//   flushPendingScroll(smoother: any | null, navOffsetPx: number): void {
//     if (!this.isBrowser) return;

//     const fragment = this.getPendingFragment();
//     if (!fragment) return;

//     const tryFindEl = () => document.getElementById(fragment) as HTMLElement | null;
//     const isHero =
//       fragment === 'homeSection1' ||
//       fragment === 'section1-home' ||
//       fragment === 'AboutSection1' ||
//       fragment === 'solutionsSection1' ||
//       fragment === 'productSection1';

//     const token = this.programmaticScroll.start('search-navigation');
//     const done = () => {
//       this.clearPending();
//       try {
//         if (typeof (window as any).ScrollTrigger?.refresh === 'function') {
//           (window as any).ScrollTrigger.refresh(true);
//         }
//         smoother?.refresh?.();
//       } catch {}
//       this.programmaticScroll.end(token);
//     };

//     const startedAt = performance.now();
//     let attemptIndex = 0;

//     const attempt = () => {
//       const el = tryFindEl();
//       if (el) {
//         this.performScroll(el, fragment, isHero, navOffsetPx, smoother, token, done);
//         return;
//       }
//       const elapsed = performance.now() - startedAt;
//       if (elapsed >= MAX_WAIT_MS) {
//         this.clearPending();
//         this.programmaticScroll.end(token);
//         return;
//       }
//       const delay = RETRY_DELAYS_MS[Math.min(attemptIndex, RETRY_DELAYS_MS.length - 1)];
//       attemptIndex++;
//       setTimeout(attempt, delay);
//     };

//     requestAnimationFrame(() => attempt());
//   }

//   private clearPending(): void {
//     this.pending = null;
//     this.pending$.next(null);
//     if (this.isBrowser) {
//       try {
//         localStorage.removeItem(STORAGE_KEY);
//       } catch {}
//     }
//   }

//   private performScroll(
//     el: HTMLElement,
//     fragment: string,
//     isHero: boolean,
//     navOffsetPx: number,
//     smoother: any | null,
//     token: number,
//     done: () => void
//   ): void {
//     if (fragment.startsWith('faq-')) {
//       this.faqRegistry.open(fragment);
//     }

//     if (smoother) {
//       const offset = isHero ? 'top top' : `top -${navOffsetPx}px`;
//       let tween: any;
//       try {
//         tween = smoother.scrollTo(el, true, offset);
//       } catch {
//         try {
//           smoother.scrollTo(el, true, offset);
//         } catch {}
//       }
//       if (tween && typeof tween.eventCallback === 'function') {
//         tween.eventCallback('onComplete', done);
//         tween.eventCallback('onInterrupt', done);
//         (tween as any).eventCallback('onKill', done);
//       } else {
//         this.programmaticScroll.endWhenSettle(
//           token,
//           () => (typeof smoother.scrollTop === 'function' ? smoother.scrollTop() : 0),
//           2000,
//           4,
//           2,
//           done
//         );
//       }
//     } else {
//       const bodyTop = document.body.getBoundingClientRect().top;
//       const elTop = el.getBoundingClientRect().top;
//       const targetY = Math.max(0, Math.round(elTop - bodyTop - (isHero ? 0 : navOffsetPx)));
//       window.scrollTo({ top: targetY, behavior: 'smooth' });
//       this.programmaticScroll.endWhenSettle(
//         token,
//         () => window.scrollY ?? window.pageYOffset ?? 0,
//         2000,
//         4,
//         2,
//         done
//       );
//     }
//   }
// }
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { ProgrammaticScrollService } from './programmatic-scroll.service';
import { FaqAccordionRegistryService } from './faq-accordion-registry.service';

const STORAGE_KEY = 'scroll_to_section';
const RETRY_DELAYS_MS = [0, 50, 120, 250, 450, 800, 1200];
const MAX_WAIT_MS = 3000;

export interface PendingNavigationTarget {
  route: string;
  fragment?: string;
  source?: string;
}

@Injectable({ providedIn: 'root' })
export class SearchNavigationCoordinatorService {
  private pending: PendingNavigationTarget | null = null;

  /** Emitted whenever pending is set (requestNavigation or setPendingFromFragment). Layout subscribes for same-page flush. */
  readonly pending$ = new BehaviorSubject<PendingNavigationTarget | null>(null);

  // ✅ Prevent concurrent flush + cancel stale attempts
  private flushing = false;
  private activeToken: number | null = null;
  private activeKey: string | null = null;
  private cancelActiveAttempt: (() => void) | null = null;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router,
    private programmaticScroll: ProgrammaticScrollService,
    private faqRegistry: FaqAccordionRegistryService
  ) {}

  get isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  private normalizeRoute(url: string): string {
    if (!url) return '/';
    const clean = url.split('?')[0].split('#')[0].trim();
    return clean.startsWith('/') ? clean : `/${clean}`;
  }

  private getCurrentRoutePath(): string {
    return this.normalizeRoute(this.router.url);
  }

  /**
   * Called by Navbar/SearchResults when user clicks a search result.
   * Stores pending target, emits to pending$, and navigates. Layout is the only place that calls flushPendingScroll.
   *
   * ✅ Same-page: DO NOT navigate (prevents timing bugs), but DO NOT break flush.
   * Layout pending$ subscription will flush.
   */
  requestNavigation(target: PendingNavigationTarget): void {
    if (!this.isBrowser) return;

    const normalizedTargetRoute = this.normalizeRoute(target.route);
    const currentRoute = this.getCurrentRoutePath();

    this.pending = { ...target, route: normalizedTargetRoute };
    this.pending$.next(this.pending);

    if (target.fragment) {
      try {
        localStorage.setItem(STORAGE_KEY, target.fragment);
      } catch {}
    }

    // ✅ Same-page: don't navigate; Layout will flush based on pending$
    if (normalizedTargetRoute === currentRoute) return;

    this.router.navigateByUrl(normalizedTargetRoute);
  }

  /**
   * Set pending from fragment only (e.g. when HostListener app-scroll-to-section fires on same page).
   */
  setPendingFromFragment(fragment: string): void {
    if (!this.isBrowser) return;

    const route = this.getCurrentRoutePath();
    this.pending = { route, fragment, source: 'event' };
    this.pending$.next(this.pending);

    try {
      localStorage.setItem(STORAGE_KEY, fragment);
    } catch {}
  }

  /**
   * Returns pending fragment if any (from memory or localStorage). Does not clear.
   */
  getPendingFragment(): string | null {
    if (!this.isBrowser) return null;
    if (this.pending?.fragment) return this.pending.fragment;
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch {
      return null;
    }
  }

  /**
   * Called ONLY by Layout after Scroll/NavigationEnd, initial load, or pending$ same-page.
   * Resolves element by fragment with retry/backoff (max ~3s), wraps scroll in ProgrammaticScrollService,
   * uses smoother on desktop and window on mobile. Opens FAQ accordion when fragment starts with "faq-".
   */
  flushPendingScroll(smoother: any | null, navOffsetPx: number): void {
    if (!this.isBrowser) return;

    const fragment = this.getPendingFragment();
    if (!fragment) return;

    const route = this.getCurrentRoutePath();
    const key = `${route}#${fragment}`;

    // ✅ If a flush is already running:
    // - if it's the same target: ignore duplicate calls
    // - if it's a different target: cancel the previous one and continue
    if (this.flushing) {
      if (this.activeKey === key) return;
      this.cancelFlush();
    }

    this.flushing = true;
    this.activeKey = key;

    // Create cancel flag for this run
    let cancelled = false;
    this.cancelActiveAttempt = () => {
      cancelled = true;
    };

    const token = this.programmaticScroll.start('search-navigation');
    this.activeToken = token;

    const safeDoneOnce = (() => {
      let doneCalled = false;
      return () => {
        if (doneCalled) return;
        doneCalled = true;

        // clear pending only on finish
        this.clearPending();

        try {
          if (typeof (window as any).ScrollTrigger?.refresh === 'function') {
            (window as any).ScrollTrigger.refresh(true);
          }
          smoother?.refresh?.();
        } catch {}

        this.programmaticScroll.end(token);
        this.flushing = false;
        this.activeToken = null;
        this.activeKey = null;
        this.cancelActiveAttempt = null;
      };
    })();

    const safeFailOnce = (() => {
      let failCalled = false;
      return () => {
        if (failCalled) return;
        failCalled = true;

        // clear pending on failure too (so we don't re-trigger forever)
        this.clearPending();

        this.programmaticScroll.end(token);
        this.flushing = false;
        this.activeToken = null;
        this.activeKey = null;
        this.cancelActiveAttempt = null;
      };
    })();

    const tryFindEl = () => document.getElementById(fragment) as HTMLElement | null;

    const isHero =
      fragment === 'homeSection1' ||
      fragment === 'section1-home' ||
      fragment === 'AboutSection1' ||
      fragment === 'solutionsSection1' ||
      fragment === 'productSection1';

    const startedAt = performance.now();
    let attemptIndex = 0;

    const attempt = () => {
      if (cancelled) return;

      const el = tryFindEl();
      if (el) {
        this.performScroll(el, fragment, isHero, navOffsetPx, smoother, token, safeDoneOnce);
        return;
      }

      const elapsed = performance.now() - startedAt;
      if (elapsed >= MAX_WAIT_MS) {
        safeFailOnce();
        return;
      }

      const delay = RETRY_DELAYS_MS[Math.min(attemptIndex, RETRY_DELAYS_MS.length - 1)];
      attemptIndex++;
      setTimeout(attempt, delay);
    };

    requestAnimationFrame(attempt);
  }

  private cancelFlush(): void {
    try {
      this.cancelActiveAttempt?.();
    } catch {}

    // end token if exists (prevents "snap never returns")
    if (this.activeToken != null) {
      this.programmaticScroll.end(this.activeToken);
    }

    this.flushing = false;
    this.activeToken = null;
    this.activeKey = null;
    this.cancelActiveAttempt = null;
  }

  private clearPending(): void {
    this.pending = null;
    this.pending$.next(null);
    if (this.isBrowser) {
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {}
    }
  }

  private performScroll(
    el: HTMLElement,
    fragment: string,
    isHero: boolean,
    navOffsetPx: number,
    smoother: any | null,
    token: number,
    done: () => void
  ): void {
    // ✅ Open FAQ BEFORE scrolling so content is visible at landing
    if (fragment.startsWith('faq-')) {
      this.faqRegistry.open(fragment);
    }

    if (smoother) {
      const getTop = () => (typeof smoother.scrollTop === 'function' ? smoother.scrollTop() : 0);

      // ✅ Compute numeric Y using smoother.offset when available
      let targetY: number | null = null;
      try {
        if (typeof smoother.offset === 'function') {
          const rawY = smoother.offset(el, 'top top');
          targetY = Math.max(0, Math.round(rawY - (isHero ? 0 : navOffsetPx)));
        }
      } catch {}

      // Fallback: scrollTo element then settle
      if (targetY == null) {
        try {
          smoother.scrollTo(el, true);
          this.programmaticScroll.endWhenSettle(token, getTop, 2000, 4, 2, done);
          return;
        } catch {}
      }

      let tween: any;
      try {
        tween = smoother.scrollTo(targetY, true);
      } catch {
        try {
          smoother.scrollTo(targetY, true);
        } catch {}
      }

      if (tween && typeof tween.eventCallback === 'function') {
        tween.eventCallback('onComplete', done);
        tween.eventCallback('onInterrupt', done);
        (tween as any).eventCallback('onKill', done);
      } else {
        this.programmaticScroll.endWhenSettle(token, getTop, 2000, 4, 2, done);
      }

      return;
    } else {
      const bodyTop = document.body.getBoundingClientRect().top;
      const elTop = el.getBoundingClientRect().top;
      const targetY = Math.max(0, Math.round(elTop - bodyTop - (isHero ? 0 : navOffsetPx)));

      window.scrollTo({ top: targetY, behavior: 'smooth' });

      this.programmaticScroll.endWhenSettle(
        token,
        () => window.scrollY ?? window.pageYOffset ?? 0,
        2000,
        4,
        2,
        done
      );
    }
  }
}

