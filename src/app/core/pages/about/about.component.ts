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

    // Mobile: just observe sections for navbar colors
    if (this.isMobile) {
      setTimeout(() => this.observeSectionsMobile(), 750);
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
      onStopDelay: 0.4
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
      } catch { }

      try { this.snapObserver?.kill?.(); } catch { }

      this.ctx?.revert();
    }
  }
}
