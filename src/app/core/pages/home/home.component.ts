// import {
//   Component,
//   Inject,
//   PLATFORM_ID,
//   AfterViewInit,
//   ViewChild,
//   ElementRef,
//   ApplicationRef,
//   NgZone,
// } from '@angular/core';
// import { CommonModule, isPlatformBrowser } from '@angular/common';
// import Scrollbar from 'smooth-scrollbar';
// import gsap from 'gsap';
// import ScrollTrigger from 'gsap/ScrollTrigger';
// import { Section2Component } from './section2/section2.component';
// import { Section1Component } from './section1/section1.component';
// import { Section4Component } from "./section4/section4.component";
// import { Section5Component } from "./section5/section5.component";
// import { Section3Component } from "./section3/section3.component";

// gsap.registerPlugin(ScrollTrigger);

// @Component({
//   selector: 'app-home',
//   templateUrl: './home.component.html',
//   styleUrls: ['./home.component.scss'],
//   imports: [Section2Component, Section1Component, CommonModule, Section4Component, Section5Component, Section3Component],
// })
// export class HomeComponent implements AfterViewInit {
//   // Use static: false so ViewChilds are resolved on the client in ngAfterViewInit.
//   @ViewChild('containerWrapper', { static: false }) containerWrapper!: ElementRef<HTMLDivElement>;
//   @ViewChild('navbar', { static: false }) navbar!: ElementRef<HTMLElement>;
//   @ViewChild('blueSection', { static: false }) blueSection!: ElementRef<HTMLElement>;
//   @ViewChild('navbarMenu', { static: false }) navbarMenu!: ElementRef<HTMLElement>;
//   @ViewChild('navSmallScreen', { static: false }) navSmallScreen!: ElementRef<HTMLElement>;
//   menuOpen = false;
//   isSmallScreen = false;
//   isBrowser: boolean;
//   private resizeHandler = this.checkScreenSize.bind(this);
//   private animationsInitialized = false;
//   private scrollTimelineInitialized = false;
//   constructor(
//     @Inject(PLATFORM_ID) private platformId: Object,
//     private appRef: ApplicationRef,
//     private ngZone: NgZone
//   ) {
//     this.isBrowser = isPlatformBrowser(platformId);
//     if (this.isBrowser) {
//       window.addEventListener('resize', this.resizeHandler);
//       this.checkScreenSize();
//     }
//   }
//   checkScreenSize() {
//     if (!this.isBrowser) return;
//     this.isSmallScreen = window.innerWidth < 700;

//   }
//   toggleMenu() {
//     if (!this.isBrowser) return;
//     this.menuOpen = !this.menuOpen;
//     const tl = gsap.timeline({ defaults: { duration: 0.9, ease: 'power2.inOut' } });
//     if (this.menuOpen) {
//       tl.to('.h-7.w-7 path', { rotate: 30, transformOrigin: 'center center' });
//     } else {
//       tl.to('.h-7.w-7 path', { rotate: 0, transformOrigin: 'center center' });
//     }
//     const el = this.navbarMenu.nativeElement;
//     if (this.menuOpen) {

//       console.log("opened")
//       gsap.killTweensOf(el);
//       gsap.fromTo(
//         el,
//         { opacity: 1, y: -120 },
//         {
//           opacity: 1,
//           y: 165,
//           duration: 0.9,
//           ease: 'power2.out',
//         }
//       );
//     } else {
//       console.log("closed")
//       gsap.killTweensOf(el);
//       gsap.to(el, {
//         opacity: 1,
//         y: -120,
//         duration: 0.9,
//         ease: 'power2.in',
//       });
//     }
//     setTimeout(() => ScrollTrigger.refresh(), 500);

//   }


//   ngAfterViewInit(): void {
//     if (typeof window === 'undefined') return;

//     if (!isPlatformBrowser(this.platformId)) {
//       console.log('SSR mode detected — skipping animations.');
//       return;
//     }
//     this.ngZone.onStable.subscribe(() => {
//       setTimeout(() => {
//         if (this.animationsInitialized) return;
//         this.animationsInitialized = true;
//         this.initAnimationsSafely();
//       }, 0);
//     });
//   }

//   TranzitionBetweenSections() {
//     if (ScrollTrigger.getAll().length > 0) return;
//     const container = this.containerWrapper?.nativeElement;
//     if (!container) {
//       console.warn('TranzitionBetweenSections: container element not found. Skipping.');
//       return;
//     }
//     const scrollbar = Scrollbar.init(container, {
//       damping: 0.02,
//       alwaysShowTracks: true,
//       continuousScrolling: true,
//     });
//     (scrollbar as any).options.delegateTo = null;
//     const blueSectionEl = this.blueSection?.nativeElement;
//     if (!blueSectionEl) {
//       console.warn('TranzitionBetweenSections: blueSection element not found. Skipping animations for this section.');
//       return;
//     }

//     gsap.to(blueSectionEl, {
//       y: 0,
//       opacity: 1,
//       duration: 1,
//       ease: 'power2.out',
//       scrollTrigger: {
//         trigger: blueSectionEl,
//         start: 'top 90%',
//         end: 'top 40%',
//         scrub: true,
//         scroller: container,
//       }
//     });
//     ScrollTrigger.scrollerProxy(container, {
//       scrollTop(value) {
//         if (value !== undefined) scrollbar.scrollTop = value;
//         return scrollbar.scrollTop;
//       },
//       getBoundingClientRect() {
//         return {
//           top: 0,
//           left: 0,
//           width: window.innerWidth,
//           height: window.innerHeight,
//         };
//       },
//       pinType: container.style.transform ? "transform" : "fixed",
//     });

//     scrollbar.addListener(ScrollTrigger.update);
//     ScrollTrigger.defaults({ scroller: container });

//     const panels = container.querySelectorAll('.panel');

//     panels.forEach((el, i) => {
//       const panel = el as HTMLElement;
//       const next = panels[i + 1] as HTMLElement;
//       if (!next) return;

//       const bgColor = next.dataset['bgcolor']!;
//       const textColor = next.dataset['textcolor']!;
//       const prevBgColor = panel.dataset['bgcolor']!;
//       const prevTextColor = panel.dataset['textcolor']!;
//       const navbarEl = this.navbar?.nativeElement;
//       const navSmallScreenEl = this.navSmallScreen?.nativeElement;
//       console.log({ textColor, prevTextColor });
//       ScrollTrigger.create({
//         trigger: next,
//         start: 'top center',
//         end: 'bottom center',
//         scrub: true,
//         scroller: container,
//         onEnter: () => {
//           // gsap.to(container, {
//           //   backgroundColor: bgColor,
//           //   duration: 0.4,
//           // });
//           gsap.to(container, {
//             backgroundColor: bgColor,
//             duration: 0.8,
//             ease: 'power2.inOut',
//           });
//           if (navbarEl) {
//             gsap.to(navbarEl, {
//               color: textColor,
//               duration: 0.5,
//               // backgroundColor: bgColor,
//               ease: 'power2.inOut',

//               // onComplete: () => {
//               //   ScrollTrigger.matchMedia({
//               //     "(max-width: 700px)": function () {
//               //       gsap.to(navSmallScreenEl, {
//               //         backgroundColor: bgColor,
//               //         duration: 0.5,
//               //         ease: 'power2.inOut',
//               //       })
//               //     },
//               //   })

//               // }

//               // onComplete: () => {
//               //   gsap.to(navSmallScreenEl, {
//               //     backgroundColor: bgColor,
//               //     duration: 0.5,
//               //     ease: 'power2.inOut',
//               //   })
//               // }
//             });
//           }
//           gsap.to('#brand-text', {
//             color: textColor === 'var(--primary)' ? 'var(--dark-gray)' : 'var(--white)',
//             duration: 0.5,
//             ease: 'power2.inOut',
//           });

//         },
//         onLeaveBack: () => {
//           // gsap.to(container, {
//           //   backgroundColor: prevBgColor,
//           //   duration: 0.4,
//           // });
//           gsap.to(container, {
//             backgroundColor: prevBgColor,
//             duration: 0.8,
//             ease: 'power2.inOut',
//           });

//           if (navbarEl) {
//             gsap.to(navbarEl, {
//               color: prevTextColor,
//               // backgroundColor: prevBgColor,
//               duration: 0.5,
//               ease: 'power2.inOut',
//               // onComplete: () => {
//               //   gsap.to(navSmallScreenEl, {
//               //     backgroundColor: prevBgColor,
//               //     duration: 0.5,
//               //     ease: 'power2.inOut',
//               //   })
//               // }
//             });
//           }
//           gsap.to('#brand-text', {
//             color: prevTextColor === 'var(--primary)' ? 'var(--dark-gray)' : 'var(--white)',
//             duration: 0.5,
//             ease: 'power2.inOut',
//           });
//         }
//       });

//     });
//     scrollbar.addListener(ScrollTrigger.update);
//     gsap.ticker.add(() => ScrollTrigger.update());

//   }
//   private initAnimationsSafely() {
//     try {
//       // نحاول ننتظر العناصر فعلاً تبقى موجودة في الـ DOM
//       const waitForElements = () => {
//         if (!this.navbar?.nativeElement || !this.containerWrapper?.nativeElement || !this.blueSection?.nativeElement) {
//           // لو لسه مش موجودين، نجرب تاني بعد 50ms
//           setTimeout(waitForElements, 50);
//           return;
//         }

//         // ✅ العناصر موجودة خلاص
//         disablePassiveListeners();
//         if (!this.scrollTimelineInitialized) {
//           this.TranzitionBetweenSections();
//           this.scrollTimelineInitialized = true;
//         }

//         const navbarEl = this.navbar.nativeElement;
//         gsap.set(navbarEl, { y: '-100%', opacity: 0 });
//         gsap.to(navbarEl, {
//           y: 0,
//           opacity: 1,
//           duration: 0.5,
//           ease: 'power3.out',
//           delay: 0.2
//         });

//         ScrollTrigger.refresh();
//       };

//       // ابدأ أول محاولة
//       waitForElements();

//     } catch (error) {
//       console.error('❌ Error in HomeComponent animation:', error);
//     }
//   }

// }
// let passiveListenersDisabled = false;
// export function disablePassiveListeners() {
//   if (passiveListenersDisabled) return;
//   passiveListenersDisabled = true;

//   const originalAddEventListener = EventTarget.prototype.addEventListener;
//   EventTarget.prototype.addEventListener = function (type, listener, options) {
//     if (type === 'wheel' || type === 'touchstart' || type === 'touchmove') {
//       if (typeof options === 'object') options.passive = false;
//       else if (options === true) options = { passive: false };
//     }
//     return originalAddEventListener.call(this, type, listener, options);
//   };
// }
import {
  Component,
  Inject,
  PLATFORM_ID,
  AfterViewInit,
  ViewChild,
  ElementRef,
  NgZone,
  ApplicationRef,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import gsap from 'gsap';
import Observer from 'gsap/Observer';
import { Section1Component } from './section1/section1.component';
import { Section2Component } from './section2/section2.component';
import { Section4Component } from './section4/section4.component';
import { Section5Component } from './section5/section5.component';

gsap.registerPlugin(Observer);

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, Section1Component, Section2Component, Section4Component, Section5Component],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements AfterViewInit {
  @ViewChild('containerWrapper', { static: false }) containerWrapper!: ElementRef<HTMLDivElement>;
  @ViewChild('navbar', { static: false }) navbar!: ElementRef<HTMLElement>;
  @ViewChild('navbarMenu', { static: false }) navbarMenu!: ElementRef<HTMLElement>;
  @ViewChild('navSmallScreen', { static: false }) navSmallScreen!: ElementRef<HTMLElement>;

  menuOpen = false;
  isBrowser: boolean;
  currentIndex = 0;
  totalSections = 0;
  animating = false;
  lastScrollTime = 0;

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private ngZone: NgZone) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngAfterViewInit(): void {
    if (!this.isBrowser) return;
    this.ngZone.runOutsideAngular(() => {
      this.initSmoothTransitions();
      this.animateNavbar();
    });
  }

  // ✅ أنيميشن دخول النـاف بار
  private animateNavbar() {
    const navbarEl = this.navbar.nativeElement;
    gsap.set(navbarEl, { y: -100, opacity: 0 });
    gsap.to(navbarEl, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', delay: 0.3 });
  }

  // ✅ فتح وغلق القائمة الصغيرة
  toggleMenu() {
    this.menuOpen = !this.menuOpen;
    const el = this.navbarMenu.nativeElement;
    const tl = gsap.timeline({ defaults: { duration: 0.8, ease: 'power2.inOut' } });

    if (this.menuOpen) {
      gsap.fromTo(el, { y: -120, opacity: 0 }, { y: 165, opacity: 1 });
    } else {
      gsap.to(el, { y: -120, opacity: 0 });
    }
  }

  // ✅ التحكم في التنقل بين السكاشن + تغيير الألوان
  private initSmoothTransitions() {
    const container = this.containerWrapper.nativeElement;
    const sections = gsap.utils.toArray<HTMLElement>('.panel');
    this.totalSections = sections.length;

    gsap.set(container, { height: `${this.totalSections * 100}vh` });
    gsap.set(sections, {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
    });
    gsap.set(sections, { yPercent: (i) => i * 100 });

    const goToSection = (index: number, direction: number) => {
      if (this.animating) return;
      this.animating = true;
      this.currentIndex = gsap.utils.wrap(0, this.totalSections, index);

      const active = sections[this.currentIndex];
      const others = sections.filter((_, i) => i !== this.currentIndex);

      // ⚡ الانتقال بين السكاشن بانسيابية
      const tl = gsap.timeline({
        defaults: { duration: 1.1, ease: 'power3.inOut' },
        onComplete: () => { this.animating = false },
      });

      tl.to(sections, { yPercent: (i) => (i - this.currentIndex) * 100 }, 0)
        .to(active, { scale: 1, opacity: 1 }, 0)
        .to(others, { scale: 0.95, opacity: 0.7 }, 0);

      // ✅ تغيير الألوان بناءً على الـ data attributes
      const nextBg = active.dataset['bgcolor']!;
      const nextText = active.dataset['textcolor']!;

      gsap.to(container, { backgroundColor: nextBg, duration: 1.1, ease: 'power2.inOut' });

      const navbarEl = this.navbar.nativeElement;
      const brandText = document.getElementById('brand-text');

      if (navbarEl) {
        gsap.to(navbarEl, { color: nextText, duration: 0.8, ease: 'power2.inOut' });
      }
      if (brandText) {
        gsap.to(brandText, {
          color: nextText === 'var(--primary)' ? 'var(--dark-gray)' : 'var(--white)',
          duration: 0.8,
          ease: 'power2.inOut',
        });
      }
    };

    // ✅ استخدام GSAP Observer للتحكم بالسكرول
    Observer.create({
      type: 'wheel,touch,pointer',
      wheelSpeed: 1,
      tolerance: 20,
      preventDefault: true,
      onChangeY: (self) => {
        const now = Date.now();
        if (this.animating) return;
        if (now - this.lastScrollTime < 1200) return;

        if (Math.abs(self.deltaY) > 40) {
          if (self.deltaY > 0) goToSection(this.currentIndex + 1, 1);
          else goToSection(this.currentIndex - 1, -1);
          this.lastScrollTime = now;
        }
      },
    });

    // ✅ دعم الأسهم ↑ ↓
    window.addEventListener('keydown', (event) => {
      if (this.animating) return;
      if (event.key === 'ArrowDown') goToSection(this.currentIndex + 1, 1);
      if (event.key === 'ArrowUp') goToSection(this.currentIndex - 1, -1);
    });
  }
}
