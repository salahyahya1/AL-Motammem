
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
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

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
  private ctx3?: gsap.Context;
  private onResizeRefresh = () => ScrollTrigger.refresh();
  private onResizeCD = () => {
    this.ngZone.run(() => this.cdr.detectChanges());
  };
  //ظبط التاجات لل seo
  //   ngOnInit() {
  //   const siteName = 'Al-Motammem';
  //   const pageTitle = "Al-Motammem ERP | نظام المتمم لإدارة المؤسسات";
  //   const desc = "نظام ERP متكامل لتطوير الشركات منذ 40 عامًا - المتمم.";
  //   const image = 'https://www.almotammem.com/images/Icon.webp';

  //   const url =
  //     (typeof window !== 'undefined' && window.location?.href)
  //       ? window.location.href
  //       : `https://almotammem.com/`;
  //   this.seoLinks.setSocialMeta({ title: pageTitle, desc, image, url, type: 'website' });
  //   this.seoLinks.setCanonical(url);
  // }
  ngAfterViewInit(): void {
    if (!this.isBrowser) return;

    this.ngZone.runOutsideAngular(() => {
      setTimeout(() => {
        this.ctx3 = gsap.context(() => {
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

  private updateNavbarColors(textColor: string) {
    this.navTheme.setColor(textColor);
  }
  ngOnDestroy(): void {
    this.sectionsRegistry.clear();
    this.sectionsRegistry.disable();
    this.ctx3?.revert();

    if (this.isBrowser) {
      window.removeEventListener('resize', this.onResizeCD);
      window.removeEventListener('resize', this.onResizeRefresh);
    }
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
// import { BehaviorSubject } from 'rxjs';
// import { NavbarThemeService } from '../../components/navbar/navbar-theme.service';
// import { SectionsRegistryService } from "../../shared/services/sections-registry.service";
// import ScrollToPlugin from 'gsap/ScrollToPlugin';

// import { AboutSection1Component } from "./about-section1/about-section1.component";
// import { AboutSection2Component } from "./about-section2/about-section2.component";
// import { AboutSection3Component } from "./about-section3/about-section3.component";
// import { AboutSection4Component } from "./about-section4/about-section4.component";
// import { AboutSection5Component } from "./about-section5/about-section5.component";
// import { SeoLinkService } from '../../services/seo-link.service';
// gsap.registerPlugin(ScrollTrigger, ScrollSmoother, ScrollToPlugin);

// @Component({
//   selector: 'app-about',
//   imports: [AboutSection1Component, AboutSection2Component, AboutSection3Component, CommonModule, AboutSection4Component, AboutSection5Component],
//   templateUrl: './about.component.html',
//   styleUrl: './about.component.scss'
// })
// export class AboutComponent {

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
//     private sectionsRegistry: SectionsRegistryService,
//     private seoLinks: SeoLinkService
//   ) {
//     this.isBrowser = isPlatformBrowser(this.platformId);
//   }
//   private ctx3?: gsap.Context;
//   private onResizeRefresh = () => ScrollTrigger.refresh();
//   private onResizeCD = () => {
//     this.ngZone.run(() => this.cdr.detectChanges());
//   };

//   // Snap scroll properties
//   private smoother: any;
//   private sectionsPositions: number[] = [];
//   private snap: ((value: number, direction?: number) => number) | null = null;
//   private snapTriggers: ScrollTrigger[] = [];
//   private observer: any;
//   //ظبط التاجات لل seo
//   //   ngOnInit() {
//   //   const siteName = 'Al-Motammem';
//   //   const pageTitle = "Al-Motammem ERP | نظام المتمم لإدارة المؤسسات";
//   //   const desc = "نظام ERP متكامل لتطوير الشركات منذ 40 عامًا - المتمم.";
//   //   const image = 'https://www.almotammem.com/images/Icon.webp';

//   //   const url =
//   //     (typeof window !== 'undefined' && window.location?.href)
//   //       ? window.location.href
//   //       : `https://almotammem.com/`;
//   //   this.seoLinks.setSocialMeta({ title: pageTitle, desc, image, url, type: 'website' });
//   //   this.seoLinks.setCanonical(url);
//   // }
//   ngAfterViewInit(): void {
//     if (!this.isBrowser) return;

//     this.ngZone.runOutsideAngular(() => {
//       setTimeout(() => {
//         this.ctx3 = gsap.context(() => {
//           this.observeSections();
//           this.setupSnap();
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

//   private updateNavbarColors(textColor: string) {
//     this.navTheme.setColor(textColor);
//   }

//   private setupSnap(): void {
//     // Get the ScrollSmoother instance from window
//     this.smoother = (window as any).ScrollSmoother?.get?.();

//     // If no smoother exists (mobile), don't setup snap
//     if (!this.smoother) return;

//     const smootherST = this.smoother.scrollTrigger;
//     const sections = gsap.utils.toArray<HTMLElement>('.panel');

//     // Reset arrays
//     this.sectionsPositions = [];
//     this.snapTriggers = [];

//     // Create ScrollTrigger for overall snap area
//     const mainTrigger = ScrollTrigger.create({
//       start: "top top",
//       end: "max",
//     });
//     this.snapTriggers.push(mainTrigger);

//     // Create observer that snaps when scrolling stops
//     this.observer = ScrollTrigger.observe({
//       onStop: () => {
//         if (this.snap && smootherST) {
//           this.smoother.scrollTo(this.snap(smootherST.scroll()), true);
//         }
//       },
//       onStopDelay: 0.5
//     });

//     // Collect section positions
//     const positionsSet: number[] = [];
//     sections.forEach((section) => {
//       const tween = ScrollTrigger.create({
//         trigger: section,
//         start: "top top",
//         refreshPriority: -1
//       });
//       positionsSet.push(tween.start, tween.end);
//       this.snapTriggers.push(tween);
//     });

//     // Remove duplicates and sort
//     this.sectionsPositions = [...new Set(positionsSet)];

//     // Create snap function
//     this.snap = this.getDirectionalSnapFunc(this.sectionsPositions);
//   }

//   private getDirectionalSnapFunc(snapIncrementOrArray: number[] | number): (value: number, direction?: number) => number {
//     const snapFn = gsap.utils.snap(snapIncrementOrArray);
//     const a = Array.isArray(snapIncrementOrArray)
//       ? snapIncrementOrArray.slice(0).sort((x, y) => x - y)
//       : null;

//     return a
//       ? (value: number, direction?: number): number => {
//         let i: number;
//         if (!direction) {
//           return snapFn(value);
//         }
//         if (direction > 0) {
//           value -= 1e-4; // to avoid rounding errors
//           for (i = 0; i < a.length; i++) {
//             if (a[i] >= value) {
//               return a[i];
//             }
//           }
//           return a[i - 1];
//         } else {
//           i = a.length;
//           value += 1e-4;
//           while (i--) {
//             if (a[i] <= value) {
//               return a[i];
//             }
//           }
//         }
//         return a[0];
//       }
//       : (value: number, direction?: number): number => {
//         const snapped = snapFn(value);
//         const increment = snapIncrementOrArray as number;
//         return !direction ||
//           Math.abs(snapped - value) < 0.001 ||
//           (snapped - value < 0) === (direction < 0)
//           ? snapped
//           : snapFn(direction < 0 ? value - increment : value + increment);
//       };
//   }

//   private cleanupSnap(): void {
//     // Kill the observer
//     if (this.observer) {
//       this.observer.kill();
//       this.observer = null;
//     }

//     // Kill all snap triggers
//     this.snapTriggers.forEach(trigger => trigger.kill());
//     this.snapTriggers = [];

//     // Reset snap function
//     this.snap = null;
//     this.sectionsPositions = [];
//   }

//   ngOnDestroy(): void {
//     this.sectionsRegistry.clear();
//     this.sectionsRegistry.disable();
//     this.ctx3?.revert();
//     this.cleanupSnap();

//     if (this.isBrowser) {
//       window.removeEventListener('resize', this.onResizeCD);
//       window.removeEventListener('resize', this.onResizeRefresh);
//     }
//   }
// }
