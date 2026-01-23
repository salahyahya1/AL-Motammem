import { ChangeDetectorRef, Component, Inject, NgZone, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet, Scroll } from "@angular/router";
import { filter, delay, auditTime } from 'rxjs';

import { NavbarComponent } from "../../components/navbar/navbar.component";
import { FooterComponent } from "../../components/footer/footer.component";
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import ScrollSmoother from 'gsap/ScrollSmoother';
import { NavbarThemeService } from '../../components/navbar/navbar-theme.service';
import { AsyncPipe, isPlatformBrowser } from '@angular/common';
import { SectionIndicatorComponent } from "../../components/section-indicator/section-indicator.component";
import { SectionsRegistryService } from '../../shared/services/sections-registry.service';
import { FormDialogComponent } from "../../shared/form-dialog/form-dialog.component";
gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, NavbarComponent, FooterComponent, SectionIndicatorComponent, AsyncPipe, FormDialogComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent {
  isBrowser: boolean;
  private smoother!: any;
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

  ngAfterViewInit(): void {
    this.sections$ = this.sectionsRegistry.sections$.pipe(auditTime(0));
    this.sections$ = this.sectionsRegistry.sections$;
    if (!this.isBrowser) return;

    this.ngZone.runOutsideAngular(() => {
      setTimeout(() => {
        this.initSmoothScroll();
        this.setupFragmentScrolling();
      }, 0);
    });
  }

  private setupFragmentScrolling() {
    // Listen for Scroll events (this covers both page loads and fragment changes)
    this.router.events.pipe(
      filter((e): e is Scroll => e instanceof Scroll)
    ).subscribe(e => {
      // Check localStorage first
      const storedFragment = localStorage.getItem('scroll_to_section');
      if (storedFragment) {
        this.scrollToFragment(storedFragment, true);
      } else if (e.anchor) {
        this.scrollToFragment(e.anchor);
      }
    });

    // Handle initial fragment/storage on load
    const storedFragment = localStorage.getItem('scroll_to_section');
    const initialFragment = this.router.parseUrl(this.router.url).fragment;

    if (storedFragment) {
      this.scrollToFragment(storedFragment, true);
    } else if (initialFragment) {
      this.scrollToFragment(initialFragment);
    }
  }

  private scrollToFragment(fragment: string, fromStorage = false) {
    this.ngZone.runOutsideAngular(() => {
      const getStableElement = () => document.getElementById(fragment);

      let element = getStableElement();
      // If we don't have smoother (Mobile), use native scroll
      if (!this.smoother) {
        if (element) {
          // Basic native scroll with some delay to ensure rendering
          setTimeout(() => {
            element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            if (fromStorage) localStorage.removeItem('scroll_to_section');
          }, 300);
        } else {
          // If element not found yet, try once more
          setTimeout(() => {
            const el = document.getElementById(fragment);
            if (el) {
              el.scrollIntoView({ behavior: 'smooth', block: 'start' });
              if (fromStorage) localStorage.removeItem('scroll_to_section');
            }
          }, 1000);
        }
        return;
      }

      // Existing Smoother Logic
      if (!element) return;

      let isMoving = true;
      let lastTop = -1;
      let stabilityCount = 0;
      let checkCount = 0;
      const maxChecks = 12; // ~4 seconds total monitoring

      const performScroll = (forceRefresh = false) => {
        if (forceRefresh) {
          ScrollTrigger.refresh();
          this.smoother.refresh();
        }

        const currentElement = getStableElement();
        if (currentElement) {
          // If it's the very first section of home, don't offset. Otherwise, overshoot 80px.
          const isHero = currentElement.id === 'homeSection1' || currentElement.id === 'section1-home';
          const position = isHero ? "top top" : "top 80px";
          // Note: "top 80px" puts the top of the element 80px FROM the top of the viewport.
          // To OVER-scroll (skip start), we want "top -80px" which puts the top 80px ABOVE the viewport edge.
          const skipOffset = isHero ? "top top" : "top -80px";

          this.smoother.scrollTo(currentElement, true, skipOffset);
          const rect = currentElement.getBoundingClientRect();
          return rect.top + (window.pageYOffset || document.documentElement.scrollTop);
        }
        return -1;
      };

      const monitor = () => {
        if (!isMoving) return;

        checkCount++;
        const currentRect = getStableElement()?.getBoundingClientRect();
        const currentTop = currentRect ? (currentRect.top + (window.pageYOffset || document.documentElement.scrollTop)) : -1;

        // If the position changed significantly (> 10px), re-trigger scroll
        if (Math.abs(currentTop - lastTop) > 10) {
          lastTop = performScroll(checkCount % 3 === 0); // Refresh every 3rd check (~1s) instead of every check
          stabilityCount = 0;
        } else {
          stabilityCount++;
        }

        // Stability check: if the element hasn't moved for 3 checks (~1s) and we are close enough to viewport top
        if (stabilityCount >= 3 && Math.abs(currentRect?.top || 999) < 20) {
          isMoving = false;
          if (fromStorage) localStorage.removeItem('scroll_to_section');
          return;
        }

        if (checkCount < maxChecks) {
          setTimeout(monitor, 350);
        } else {
          isMoving = false;
          if (fromStorage) localStorage.removeItem('scroll_to_section');
        }
      };

      // Initial scroll
      lastTop = performScroll(true);
      setTimeout(monitor, 400);
    });
  }

  private initSmoothScroll() {
    // Check for mobile state
    const isMobile = window.matchMedia('(max-width: 768px)').matches;

    // If mobile, DO NOT initialize ScrollSmoother
    // This reverts to native scrolling, which solves the "heaviness" issue on Blogs page
    if (isMobile) {
      return;
    }

    if ((window as any).ScrollSmoother?.get?.()) {
      this.smoother = (window as any).ScrollSmoother.get();
      return;
    }

    this.smoother = ScrollSmoother.create({
      wrapper: '#smooth-wrapper',
      content: '#smooth-content',
      smooth: 1.2,
      normalizeScroll: true, // This was likely causing the heaviness on mobile
      effects: false,
      ignoreMobileResize: true,
      // smoothTouch: 0.1, // Removed or irrelevant since we filter isMobile
    });

    ScrollTrigger.defaults({ scroller: this.smoother.wrapper() });
    requestAnimationFrame(() => ScrollTrigger.refresh());
    ScrollTrigger.config({ ignoreMobileResize: true });
  }
}
