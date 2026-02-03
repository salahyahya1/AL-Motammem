import {
  Component,
  Inject,
  PLATFORM_ID,
  AfterViewInit,
  NgZone,
  ChangeDetectorRef,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import ScrollSmoother from 'gsap/ScrollSmoother';
import ScrollToPlugin from 'gsap/ScrollToPlugin';

import { Section1Component } from './section1/section1.component';
import { Section2Component } from './section2/section2.component';
import { Section3Component } from './section3/section3.component';
import { Section4Component } from './section4/section4.component';
import { Section5Component } from './section5/section5.component';
import { Section6Component } from './section6/section6.component';
import { Section7Component } from './section7/section7.component';
import { Section8Component } from './section8/section8.component';

import { BehaviorSubject } from 'rxjs';
import { NavbarThemeService } from '../../components/navbar/navbar-theme.service';
import { SectionItem, SectionsRegistryService } from '../../shared/services/sections-registry.service';
import { OpenFormDialogDirective } from '../../shared/Directives/open-form-dialog.directive';
import { Router } from '@angular/router';
import { SeoLinkService } from '../../services/seo-link.service';

gsap.registerPlugin(ScrollTrigger, ScrollSmoother, ScrollToPlugin);

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    Section1Component,
    Section2Component,
    Section3Component,
    Section4Component,
    Section5Component,
    Section6Component,
    Section7Component,
    Section8Component,
    OpenFormDialogDirective,
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements AfterViewInit, OnDestroy, OnInit {
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

  // ✅ Section 5 Boundaries (Desktop)
  private section5Start = 0;
  private section5VideoPoint = 0;

  // ✅ Map for Mobile Long Sections: ID -> Next Section Start Check
  // Store Start points for key sections to build logic dynamically
  private sectionMap: Map<string, number> = new Map();

  // ✅ Auto-refresh handling for @defer and pin-ready
  private resizeObserver?: ResizeObserver;
  private refreshTimeout: any;

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

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef,
    private navTheme: NavbarThemeService,
    public sectionsRegistry: SectionsRegistryService,
    private router: Router,
    private seoLinks: SeoLinkService
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit() {
    const siteName = 'Al-Motammem';
    const pageTitle = "Al-Motammem ERP | نظام المتمم لإدارة المؤسسات";
    const desc = "نظام ERP متكامل لتطوير الشركات منذ 40 عامًا - المتمم.";
    const image = 'https://almotammem.com/images/Icon.webp';

    const url =
      (typeof window !== 'undefined' && window.location?.href)
        ? window.location.href
        : `https://almotammem.com/`;
    this.seoLinks.setSocialMeta({ title: pageTitle, desc, image, url, type: 'website' });
    this.seoLinks.setCanonical(url);

    if (!this.isBrowser) return;
    this.isMobile = window.matchMedia('(max-width: 768px)').matches;
  }

  ngAfterViewInit(): void {
    if (!this.isBrowser) return;

    this.setupMobileStaticHeroLanguage();

    // ✅ Listen for pinning completion from child sections
    window.addEventListener('pin-ready', this.onPinReady);

    // ✅ Observe height changes
    this.initResizeObserver();

    // ✅ Mobile path
    if (this.isMobile) {
      setTimeout(() => this.initMobileSnap(), 750);
      return;
    }

    // ✅ Desktop path
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

  // =================== DYNAMIC REFRESH LOGIC ===================

  private onPinReady = () => {
    this.debouncedRefresh();
  };

  private initResizeObserver() {
    const homeEl = document.getElementById('home');
    if (homeEl) {
      this.resizeObserver = new ResizeObserver(() => {
        this.debouncedRefresh();
      });
      this.resizeObserver.observe(homeEl);
    }
  }

  private debouncedRefresh() {
    if (this.refreshTimeout) clearTimeout(this.refreshTimeout);
    this.refreshTimeout = setTimeout(() => {
      ScrollTrigger.refresh();
      if (this.isMobile) {
        this.buildSnapPositionsMobile();
      } else if (this.smoother) {
        this.buildSnapPositions(this.smoother);
      }
    }, 300);
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

  private initDesktop(smoother: any) {
    const scroller = smoother.wrapper();

    // 1) Registry
    const sections: SectionItem[] = [
      { id: 'section1-home', labelKey: 'HOME.INDECATORS.ABOUT', wholeSectionId: 'section1-home' },
      { id: 'section2-home', labelKey: 'HOME.INDECATORS.FACTS', wholeSectionId: 'section2-home' },
      { id: 'section3-home', labelKey: 'HOME.INDECATORS.WHY', wholeSectionId: 'section3-home' },
      { id: 'section4-home', labelKey: 'HOME.INDECATORS.APPS', wholeSectionId: 'section4-home' },
      { id: 'section5-home', labelKey: 'HOME.INDECATORS.TESTIMONIALS', wholeSectionId: 'section5-home' },
      { id: 'section6-home', labelKey: 'HOME.INDECATORS.INTEGRATIONS', wholeSectionId: 'section6-home' },
      { id: 'section7-home', labelKey: 'HOME.INDECATORS.PLANS', wholeSectionId: 'section7-home' },
      { id: 'section8-home', labelKey: 'HOME.INDECATORS.CONTACT', wholeSectionId: 'section8-home' },
    ];
    this.sectionsRegistry.set(sections);
    this.sectionsRegistry.enable();

    // 2) Navbar colors triggers
    this.observeSections(scroller);

    // 3) Resize handler
    window.addEventListener('resize', this.onResize);

    // 4) Build snap positions
    setTimeout(() => {
      ScrollTrigger.refresh();
      this.buildSnapPositions(smoother);
      this.initSnapObserver(smoother);
    }, 600);
  }

  private buildSnapPositions(smoother: any) {
    const scroller = smoother.wrapper();
    const panels = gsap.utils.toArray<HTMLElement>('#home .panel');
    const vh = window.innerHeight;

    this.snapPositions = [];
    this.section5Start = 0;
    this.section5VideoPoint = 0;

    panels.forEach((panel, index) => {
      const st = ScrollTrigger.create({
        trigger: panel,
        scroller,
        start: "top top",
        refreshPriority: -1,
      });

      // Add section START
      this.snapPositions.push(st.start);

      // Section 4 (index 3) is PINNED -> Add END position
      if (index === 3) {
        this.snapPositions.push(st.end);
      }

      // Section 5 (index 4) - Testimonials
      if (index === 4) {
        this.section5Start = st.start;
        // Point where bottom of section 5 matches bottom of viewport
        // ✅ Added +80 padding so video isn't stuck to bottom
        this.section5VideoPoint = (st.end - vh) + 80;

        // Ensure valid
        if (this.section5VideoPoint > this.section5Start + 100) {
          this.snapPositions.push(this.section5VideoPoint);
        }
      }

      st.kill();
    });

    // Sort and remove duplicates
    this.snapPositions = Array.from(new Set(this.snapPositions)).sort((a, b) => a - b);
  }

  private initSnapObserver(smoother: any) {
    this.snapObserver?.kill?.();
    const scroller = smoother.wrapper();

    // ✅ Observe with 0.7 delay on STOP (Slows down snap to wait for user)
    this.snapObserver = ScrollTrigger.observe({
      target: scroller,
      onStop: () => {
        this.doSnap();
      },
      onStopDelay: 0.7
    });
  }

  private doSnap() {
    if (!this.smootherST || !this.smoother) return;
    if (this.snapPositions.length === 0) return;

    const currentScroll = this.smootherST.scroll();

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

    // =======================================================
    // ✅ Section 5 (Testimonials) Logic - RELAXED SNAP
    // =======================================================
    // Check if within visual range of Sec 5
    const withinSec5 = (currentScroll > this.section5Start - 100 && currentScroll < this.section5VideoPoint + 200);

    if (withinSec5) {
      const isTargetingStart = Math.abs(nearest - this.section5Start) < 2;
      const isTargetingVideo = Math.abs(nearest - this.section5VideoPoint) < 2;

      // ✅ DRASTICALLY REDUCED THRESHOLDS FOR FREE SCROLLING
      // If targeting video, only snap if VERY close (within 250px)
      if (isTargetingVideo) {
        if (minDistance > 250) return; // Free scroll if > 250px away
      }
      // If targeting Start, only snap if VERY close (within 200px)
      else if (isTargetingStart) {
        if (minDistance > 200) return;
      }
      // If targeting neither (middle of free zone), just return
      else {
        return;
      }
    }

    // Footer Guard
    const lastSnapPoint = this.snapPositions[this.snapPositions.length - 1];
    const footerThreshold = 200;
    if (currentScroll > lastSnapPoint + footerThreshold) {
      return;
    }

    // Snap Execution
    if (minDistance > 5) {
      const SNAP_OFFSET = 50;
      let targetPosition = nearest;

      const safeOffset = 50;

      // 1. If Section 5 Video Point -> NO OFFSET
      if (Math.abs(nearest - this.section5VideoPoint) < 1) {
        targetPosition = nearest;
      }
      // 2. Normal Start points
      else if (nearest > 0) {
        const idx = this.snapPositions.indexOf(nearest);
        const next = this.snapPositions[idx + 1];
        if (!next || (next - nearest > safeOffset + 10)) {
          targetPosition = nearest + safeOffset;
        }
      }

      this.smoother.scrollTo(targetPosition, true);
    }
  }

  // =================== MOBILE IMPLEMENTATION ===================

  private onTouchStartMobile = () => { this.isTouchingMobile = true; };
  private onTouchEndMobile = () => { this.isTouchingMobile = false; };

  private initMobileSnap() {
    ScrollTrigger.config({ ignoreMobileResize: true });

    // ✅ Initialize scrollEl early
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
    // ✅ Fix: Ensure scrollEl is defined
    if (!this.scrollEl) this.scrollEl = (document.scrollingElement || document.documentElement) as HTMLElement;

    const panels = gsap.utils.toArray<HTMLElement>('#home .panel');
    const vh = (window.visualViewport?.height || window.innerHeight);

    // Reset snap positions
    this.snapPositions = [];
    // ✅ Add 0 explicitly for Top Page Hero Start
    this.snapPositions.push(0);

    this.panelStartsMobile.clear();
    this.sectionMap.clear();

    for (const panel of panels) {
      if (getComputedStyle(panel).display === 'none') continue;

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
      this.sectionMap.set(panel.id, start);

      st.kill();
    }

    const footer = (document.querySelector('footer, app-footer, #footer, .footer') as HTMLElement | null);
    this.footerTopMobile = footer
      ? Math.round(footer.getBoundingClientRect().top + this.scrollEl.scrollTop)
      : Number.POSITIVE_INFINITY;

    // Filter duplicates and sort
    this.snapPositions = Array.from(new Set(this.snapPositions)).sort((a, b) => a - b);
  }

  private doSnapMobile() {
    if (!this.snapPositions.length) return;
    if (this.isSnappingMobile) return;
    if (gsap.isTweening(this.scrollEl)) return;

    const current = this.scrollEl.scrollTop;
    const vh = (window.visualViewport?.height || window.innerHeight);

    // Disable snap at very end
    const lastStart = this.snapPositions[this.snapPositions.length - 1];
    if (current >= lastStart - 2) return;

    // ===========================================
    // ✅ LONG SECTIONS LOGIC (Sec3, Sec4, Sec5, Sec7)
    // Overlap Logic: Like Products Sec 1
    // ===========================================

    // Config: [Current Section ID, Next Section ID, Padding for End]
    const longSections = [
      { id: 'section3-home', nextId: 'section4-home', padding: 0 },
      { id: 'section4-home', nextId: 'section5-home', padding: 0 },
      { id: 'section5-home', nextId: 'section6-home', padding: 80 }, // VIDEO PADDING
      { id: 'section7-home', nextId: 'section8-home', padding: 0 }
    ];

    for (const config of longSections) {
      const start = this.sectionMap.get(config.id);
      const nextStart = this.sectionMap.get(config.nextId);

      if (start !== undefined && nextStart !== undefined) {
        // Check if inside boundaries
        if (current >= start - 5 && current < nextStart - 5) {

          // 1. OVERLAP CHECK (Bottom Transition)
          const overlap = (current + vh) - nextStart;

          // Deep inside? -> Check Top Distance too
          if (overlap < 10) {
            // We are not near the bottom.
            // Check if near Top?
            if (Math.abs(current - start) < 75) {
              // Close to top -> Let standard (Nearest) snap handle it (or force it)
              this.performSnap(start, current);
              return;
            }

            // Else -> FREE SCROLL
            return;
          }

          // Transition Zone (Entering Next Section)
          const ratio = overlap / vh;
          let target = -1;

          if (ratio < 0.45) {
            // Snap Back to show End of Current Section
            // Apply Padding if needed (e.g. for Video)
            target = (nextStart - vh) + config.padding;
          } else {
            // Snap Forward to Start of Next Section
            target = nextStart;
          }

          this.performSnap(target, current);
          return;
        }
      }
    }

    // ===========================================
    // STANDARD NEAREST SNAP (Fallback)
    // ===========================================

    let lo = 0, hi = this.snapPositions.length - 1;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (this.snapPositions[mid] < current) lo = mid + 1;
      else hi = mid;
    }
    const next = this.snapPositions[lo];
    const prev = lo > 0 ? this.snapPositions[lo - 1] : this.snapPositions[0];

    const dPrev = Math.abs(current - prev);
    const dNext = Math.abs(next - current);

    let target = dPrev <= dNext ? prev : next;

    this.performSnap(target, current);
  }

  private performSnap(target: number, current: number) {
    const dist = Math.abs(target - current);
    if (dist <= 12) return;

    // Double check last section guard
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
    this.debouncedRefresh();
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
    const sections = gsap.utils.toArray<HTMLElement>('#home .panel');
    sections.forEach((section, index) => {
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
        onLeaveBack: () => {
          if (index === 0) {
            this.navTheme.setBg('var(--white)');
            this.navTheme.setColor('var(--primary)');
          }
        },
      });
    });
  }

  private observeSectionsMobile() {
    const sections = gsap.utils.toArray<HTMLElement>('#home .panel');
    sections.forEach((section, index) => {
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
        onLeaveBack: () => {
          if (index === 0) {
            this.navTheme.setBg('var(--white)');
            this.navTheme.setColor('var(--primary)');
          }
        },
      });
    });
  }

  private onResize = () => {
    this.debouncedRefresh();
    this.ngZone.run(() => {
      this.cdr.detectChanges();
    });
  };

  // ===================== MOBILE HERO I18N =====================

  private setupMobileStaticHeroLanguage() {
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    if (!isMobile) return;
    const saved = (localStorage.getItem('lang') || '').toLowerCase();
    if (saved !== 'en') return;

    const run = () => this.applyEnglishToMobileHero();
    const ric = (window as any).requestIdleCallback;
    if (typeof ric === 'function') ric(() => run(), { timeout: 3000 });
    else setTimeout(run, 1800);
  }

  private applyEnglishToMobileHero() {
    const hero = document.getElementById('hero-mobile');
    if (!hero) return;

    const title = hero.querySelector('[data-i18n="title"]');
    const subtitle = hero.querySelector('[data-i18n="subtitle"]');
    const details = hero.querySelector('[data-i18n="details"]');
    const btn1 = hero.querySelector('[data-i18n="btn1"]');
    const btn2 = hero.querySelector('[data-i18n="btn2"]');

    if (title) title.textContent = 'Manage all your operations in one integrated system';
    if (subtitle)
      subtitle.textContent =
        'Al Motammem ERP for enterprise resource management, backed by 40 years of experience in local and Gulf markets.';
    if (details)
      details.textContent =
        'Financial management - inventory - HR and payroll - reporting - fixed assets management - cash and banks - letters of guarantee - letters of credit - tax integrations, plus many more features tailored to your business.';
    if (btn1) btn1.textContent = 'Book a free consultation';
    if (btn2) btn2.textContent = 'Start chat now';

    hero.setAttribute('dir', 'ltr');
    hero.classList.add('is-en');
  }

  ngOnDestroy(): void {
    this.sectionsRegistry.clear();
    this.sectionsRegistry.disable();

    if (!this.isBrowser) return;

    try { window.removeEventListener('resize', this.onResize); } catch { }
    try { window.removeEventListener('pin-ready', this.onPinReady); } catch { }
    try { this.snapObserver?.kill?.(); } catch { }

    if (this.refreshTimeout) clearTimeout(this.refreshTimeout);
    this.resizeObserver?.disconnect();

    if (this.isMobile) {
      this.destroyMobileSnap();
    }

    this.ctx?.revert();
  }
}
