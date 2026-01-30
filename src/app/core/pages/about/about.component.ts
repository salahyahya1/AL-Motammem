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
import { BehaviorSubject } from 'rxjs';
import { NavbarThemeService } from '../../components/navbar/navbar-theme.service';
import { SectionsRegistryService } from "../../shared/services/sections-registry.service";
import ScrollToPlugin from 'gsap/ScrollToPlugin';

import { AboutSection1Component } from "./about-section1/about-section1.component";
import { AboutSection2Component } from "./about-section2/about-section2.component";
import { AboutSection3Component } from "./about-section3/about-section3.component";
import { AboutSection4Component } from "./about-section4/about-section4.component";
import { AboutSection5Component } from "./about-section5/about-section5.component";
import { SeoLinkService } from '../../services/seo-link.service';

gsap.registerPlugin(ScrollTrigger, ScrollSmoother, ScrollToPlugin);

@Component({
  selector: 'app-about',
  imports: [AboutSection1Component, AboutSection2Component, AboutSection3Component, CommonModule, AboutSection4Component, AboutSection5Component],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss'
})
export class AboutComponent {
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


  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef,
    private navTheme: NavbarThemeService,
    private sectionsRegistry: SectionsRegistryService,
    private seoLinks: SeoLinkService
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit() {
    if (!this.isBrowser) return;
    this.isMobile = window.matchMedia('(max-width: 767px)').matches;
  }

  ngAfterViewInit(): void {
    if (!this.isBrowser) return;

    // Separate paths for Mobile vs Desktop
    if (this.isMobile) {
      setTimeout(() => this.initMobileSnap(), 750);
      return;
    }

    // Desktop: wait for smoother and set up
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
      if (performance.now() - start < 3000) requestAnimationFrame(tick);
    };
    tick();
  }

  private initDesktop(smoother: any) {
    const scroller = smoother.wrapper();

    // Navbar colors triggers
    this.observeSections(scroller);

    // Resize handler
    window.addEventListener('resize', this.onResize);

    // Build snap positions and setup observer after everything is ready
    setTimeout(() => {
      ScrollTrigger.refresh();
      this.buildSnapPositions(smoother);
      this.initSnapObserver(smoother);
    }, 600);
  }

  // =================== MOBILE SNAP (FIXED) ===================
  private scrollEl!: HTMLElement;

  private panelStartsMobile = new Set<number>();

  private mobileRAF = 0;
  private stableFrames = 0;
  private lastStopY = 0;

  private lastScrollMobile = 0;
  private lastDirMobile: 1 | -1 = 1;

  private isSnappingMobile = false;
  private isTouchingMobile = false;

  private globalSnapLocked = false;
  private globalSnapLockUntil = 0;

  private footerTopMobile = Number.POSITIVE_INFINITY;

  private lastVVH = 0;
  private mobileResizeT: any = null;

  // from Section3 (pin/snap internal) to lock/unlock global snap
  private onS3Lock = (e: Event) => {
    const ce = e as CustomEvent<{ locked?: boolean; cooldownMs?: number }>;
    const locked = !!ce.detail?.locked;
    const cooldownMs = ce.detail?.cooldownMs ?? 0;

    this.globalSnapLocked = locked;

    if (!locked) {
      const until = performance.now() + cooldownMs;
      this.globalSnapLockUntil = Math.max(this.globalSnapLockUntil, until);

      // ✅ after Section3 exits pin, rebuild positions (pinSpacing changes layout)
      window.setTimeout(() => {
        ScrollTrigger.refresh(true);
        this.buildSnapPositionsMobile();
      }, cooldownMs + 80);
    }
  };

  private onTouchStartMobile = () => {
    this.isTouchingMobile = true;
    this.cancelStopCheck();
  };

  private onTouchEndMobile = () => {
    this.isTouchingMobile = false;
    this.queueStopCheck();
  };

  private initMobileSnap() {
    this.scrollEl = (document.scrollingElement || document.documentElement) as HTMLElement;

    this.observeSectionsMobile();

    window.addEventListener('S3_SNAP_LOCK', this.onS3Lock as any);

    window.addEventListener('touchstart', this.onTouchStartMobile, { passive: true });
    window.addEventListener('touchend', this.onTouchEndMobile, { passive: true });

    ScrollTrigger.refresh(true);
    this.buildSnapPositionsMobile();

    this.lastScrollMobile = this.scrollEl.scrollTop;

    window.addEventListener('scroll', this.onScrollMobile, { passive: true });
    window.addEventListener('resize', this.onResizeMobile);

    // ✅ visualViewport resize فقط (ممنوع scroll) عشان الطلوع لفوق ما يبوظش الحساب
    this.lastVVH = (window.visualViewport?.height || window.innerHeight);
    window.visualViewport?.addEventListener('resize', this.onResizeMobile);
  }

  private buildSnapPositionsMobile() {
    const panels = gsap.utils.toArray<HTMLElement>('.panel');

    this.snapPositions = [];
    this.panelStartsMobile.clear();

    // ✅ use ScrollTrigger to compute true starts (respects pinSpacing/layout)
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

    this.snapPositions = Array.from(new Set(this.snapPositions)).sort((a, b) => a - b);

    // ✅ Footer top (لو موجود)
    const footer =
      (document.querySelector('footer, app-footer, #footer, .footer') as HTMLElement | null);
    this.footerTopMobile = footer ? Math.round(footer.getBoundingClientRect().top + this.scrollEl.scrollTop) : Number.POSITIVE_INFINITY;

    // console.log('✅ Mobile snap starts:', this.snapPositions, 'footerTop:', this.footerTopMobile);
  }

  private onScrollMobile = () => {
    // ✅ ignore scroll events while snapping (prevents wrong direction/targets)
    if (this.isSnappingMobile || gsap.isTweening(this.scrollEl)) return;

    const y = this.scrollEl.scrollTop;

    // track direction (bigger threshold to ignore address-bar jitter)
    const d = y - this.lastScrollMobile;
    if (Math.abs(d) > 6) this.lastDirMobile = d > 0 ? 1 : -1;
    this.lastScrollMobile = y;

    // global snap OFF while Section3 active or cooldown
    if (this.globalSnapLocked) return;
    if (performance.now() < this.globalSnapLockUntil) return;

    // don't snap while user is touching
    if (this.isTouchingMobile) return;

    this.queueStopCheck();
  };

  private queueStopCheck() {
    if (this.mobileRAF) return;

    this.lastStopY = this.scrollEl.scrollTop;
    this.stableFrames = 0;

    const tick = () => {
      this.mobileRAF = requestAnimationFrame(tick);

      if (this.globalSnapLocked || performance.now() < this.globalSnapLockUntil) {
        this.stableFrames = 0;
        this.lastStopY = this.scrollEl.scrollTop;
        return;
      }

      if (this.isTouchingMobile || this.isSnappingMobile || gsap.isTweening(this.scrollEl)) {
        this.stableFrames = 0;
        this.lastStopY = this.scrollEl.scrollTop;
        return;
      }

      const nowY = this.scrollEl.scrollTop;
      const moved = Math.abs(nowY - this.lastStopY);

      if (moved <= 1) this.stableFrames++;
      else {
        this.stableFrames = 0;
        this.lastStopY = nowY;
      }

      // ✅ 9 stable frames = stop (أفضل للموبايل الحقيقي)
      if (this.stableFrames >= 9) {
        this.cancelStopCheck();
        this.doSnapMobile();
      }
    };

    this.mobileRAF = requestAnimationFrame(tick);
  }

  private cancelStopCheck() {
    if (this.mobileRAF) cancelAnimationFrame(this.mobileRAF);
    this.mobileRAF = 0;
  }

  private doSnapMobile() {
    if (!this.snapPositions.length) return;

    if (this.globalSnapLocked) return;
    if (performance.now() < this.globalSnapLockUntil) return;

    if (this.isSnappingMobile) return;
    if (gsap.isTweening(this.scrollEl)) return;

    const current = this.scrollEl.scrollTop;
    const vh = (window.visualViewport?.height || window.innerHeight);

    // ✅ footer zone: لو نازلة للفوتر سيبيها (ممنوع snap)
    const footerZoneStart = this.footerTopMobile - vh * 0.25;
    if (current >= footerZoneStart && this.lastDirMobile > 0) return;

    // ✅ deep after last section (زيادة أمان)
    const lastStart = this.snapPositions[this.snapPositions.length - 1];
    if (current > lastStart + vh * 0.9 && this.lastDirMobile > 0) return;

    const arr = this.snapPositions;

    // binary search first >= current
    let lo = 0, hi = arr.length - 1;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (arr[mid] < current) lo = mid + 1;
      else hi = mid;
    }

    const next = arr[lo];
    const prev = lo > 0 ? arr[lo - 1] : arr[0];

    // ✅ nearest الحقيقي
    const dPrev = Math.abs(current - prev);
    const dNext = Math.abs(next - current);
    let target = dPrev <= dNext ? prev : next;

    const dist = Math.abs(target - current);

    // ✅ امنع القفزات البعيدة (سبب "بيروح حتت غريبة")
    const MAX_JUMP = vh * 0.7;
    if (dist > MAX_JUMP) return;

    if (dist <= 12) return;

    // ✅ offset في النزول فقط (الطلوع لفوق خليه 0 عشان ما يبوظش)
    const NAV_OFFSET = 0; // لو عندك navbar ثابت اديه قيمته (مثلاً 60)
    const DOWN_OFFSET = 10 + NAV_OFFSET;
    const offset = this.lastDirMobile > 0 ? DOWN_OFFSET : NAV_OFFSET;

    const targetPos =
      this.panelStartsMobile.has(target) && target > 0
        ? target + offset
        : target;

    this.isSnappingMobile = true;

    gsap.to(this.scrollEl, {
      scrollTo: targetPos,
      duration: 0.75,
      ease: 'power3.out',
      overwrite: true,
      onComplete: () => { this.isSnappingMobile = false; },
      onInterrupt: () => { this.isSnappingMobile = false; },
    });
  }

  private onResizeMobile = () => {
    const h = (window.visualViewport?.height || window.innerHeight);

    // ✅ تجاهل jitter بسيط (address bar)
    if (Math.abs(h - this.lastVVH) < 18) return;
    this.lastVVH = h;

    if (this.mobileResizeT) clearTimeout(this.mobileResizeT);
    this.mobileResizeT = setTimeout(() => {
      ScrollTrigger.refresh(true);
      this.buildSnapPositionsMobile();
    }, 180);
  };
  // =================== END MOBILE SNAP ===================


  // ✅ مهم: نضيف cleanup في ngOnDestroy
  // في ngOnDestroy بتاع AboutComponent زوّدي دول:
  private destroyMobileSnap() {
    try {
      window.removeEventListener('S3_SNAP_LOCK', this.onS3Lock as any);
      window.removeEventListener('touchstart', this.onTouchStartMobile);
      window.removeEventListener('touchend', this.onTouchEndMobile);
      window.removeEventListener('scroll', this.onScrollMobile);
      window.removeEventListener('resize', this.onResizeMobile);

      window.visualViewport?.removeEventListener('resize', this.onResizeMobile);
      window.visualViewport?.removeEventListener('scroll', this.onResizeMobile);
    } catch { }

    this.cancelStopCheck();
    try { gsap.killTweensOf(this.scrollEl); } catch { }
    this.isSnappingMobile = false;
  }

  // --- Desktop Implementation (Smoother) ---

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

      // For Section 3 (index 2) which is very long, also add the END
      // This allows snapping to the end of Section 3 (start of Section 4)
      if (index === 2) {
        this.snapPositions.push(st.end);
      }

      console.log(`📌 Section ${index}: start=${st.start.toFixed(0)}, end=${st.end.toFixed(0)}`);

      st.kill();
    });

    // Sort and remove duplicates
    this.snapPositions = Array.from(new Set(this.snapPositions)).sort((a, b) => a - b);
    console.log('✅ Final snap positions:', this.snapPositions.map(p => p.toFixed(0)));
  }

  private initSnapObserver(smoother: any) {
    if (this.snapObserver) {
      this.snapObserver.kill();
    }

    const scroller = smoother.wrapper();

    this.snapObserver = ScrollTrigger.observe({
      target: scroller,
      onStop: () => {
        this.doSnap();
      },
      onStopDelay: 0.7 // Keep 0.7s delay for Desktop
    });
  }

  private doSnap() {
    if (!this.smootherST || !this.smoother) return;
    if (this.snapPositions.length === 0) return;

    const currentScroll = this.smootherST.scroll();

    // Check if we are past the last section (viewing footer)
    // The last snap position is the start of the last section.
    // If we scrolled significantly past it, assume we are heading to footer.
    const lastSnapPoint = this.snapPositions[this.snapPositions.length - 1];
    const footerThreshold = 200; // Buffer to allow "leaving" the last section

    if (currentScroll > lastSnapPoint + footerThreshold) {
      console.log('🦶 Viewing footer, skipping global snap');
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

    // Section 3 is at index 2, its END is at index 3
    const section3Start = this.snapPositions[2] || 0;
    const section3End = this.snapPositions[3] || 0;
    const viewportHeight = window.innerHeight;

    // Only skip global snap when DEEP inside Section 3
    // Allow snap near the start (within 1 viewport) and near the end (within 1 viewport)
    const deepInsideSection3 =
      currentScroll > section3Start + viewportHeight &&
      currentScroll < section3End - viewportHeight;

    if (deepInsideSection3) {
      console.log('🚫 Deep inside Section 3, skipping global snap');
      return;
    }

    // Only snap if we're not already at the position
    if (minDistance > 10) {
      // Add small offset to trigger animations inside the section
      // Only add offset when snapping to section START (not end of Section 3)
      const SNAP_OFFSET = 50; // pixels to scroll into section
      let targetPosition = nearest;

      // Check if this is a section START (not section3End)
      // Section 3 End is index 3, so we don't add offset for that
      const isSection3End = nearest === section3End;
      if (!isSection3End && nearest > 0) {
        targetPosition = nearest + SNAP_OFFSET;
      }

      console.log(`✅ Snapping: ${currentScroll.toFixed(0)} → ${targetPosition.toFixed(0)} (distance: ${minDistance.toFixed(0)})`);
      this.smoother.scrollTo(targetPosition, true);
    } else {
      console.log(`📍 Already at snap point: ${currentScroll.toFixed(0)}`);
    }
  }

  // Desktop Navbar Color Observer
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

  // Mobile Navbar Color Observer
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

    if (this.isBrowser) {
      try {
        window.removeEventListener('resize', this.onResize);
        window.removeEventListener('scroll', this.onScrollMobile);
        window.removeEventListener('resize', this.onResizeMobile);
      } catch { }

      try { this.snapObserver?.kill?.(); } catch { }
      try {
        window.removeEventListener('scroll', this.onScrollMobile);
        window.removeEventListener('resize', this.onResizeMobile);
        window.visualViewport?.removeEventListener('resize', this.onResizeMobile);

        window.removeEventListener('touchstart', this.onTouchStartMobile as any);
        window.removeEventListener('touchend', this.onTouchEndMobile as any);

        window.removeEventListener('S3_SNAP_LOCK', this.onS3Lock as any);
      } catch { }
      if (this.isMobile) {
        this.destroyMobileSnap();
      }

      this.cancelStopCheck();


      this.ctx?.revert();
    }
  }
}
