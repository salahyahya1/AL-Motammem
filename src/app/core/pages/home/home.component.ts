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
//////////////////////////////////////////////////
// import {
//   Component,
//   Inject,
//   PLATFORM_ID,
//   AfterViewInit,
//   ViewChild,
//   ElementRef,
//   NgZone,
//   ApplicationRef,
// } from '@angular/core';
// import { CommonModule, isPlatformBrowser } from '@angular/common';
// import gsap from 'gsap';
// import Observer from 'gsap/Observer';
// import { Section1Component } from './section1/section1.component';
// import { Section2Component } from './section2/section2.component';
// import { Section4Component } from './section4/section4.component';
// import { Section5Component } from './section5/section5.component';

// gsap.registerPlugin(Observer);

// @Component({
//   selector: 'app-home',
//   standalone: true,
//   imports: [CommonModule, Section1Component, Section2Component, Section4Component, Section5Component],
//   templateUrl: './home.component.html',
//   styleUrls: ['./home.component.scss'],
// })
// export class HomeComponent implements AfterViewInit {
//   @ViewChild('containerWrapper', { static: false }) containerWrapper!: ElementRef<HTMLDivElement>;
//   @ViewChild('navbar', { static: false }) navbar!: ElementRef<HTMLElement>;
//   @ViewChild('navbarMenu', { static: false }) navbarMenu!: ElementRef<HTMLElement>;
//   @ViewChild('navSmallScreen', { static: false }) navSmallScreen!: ElementRef<HTMLElement>;

//   menuOpen = false;
//   isBrowser: boolean;
//   currentIndex = 0;
//   totalSections = 0;
//   animating = false;
//   lastScrollTime = 0;

//   constructor(@Inject(PLATFORM_ID) private platformId: Object, private ngZone: NgZone) {
//     this.isBrowser = isPlatformBrowser(this.platformId);
//   }

//   ngAfterViewInit(): void {
//     if (!this.isBrowser) return;
//     this.ngZone.runOutsideAngular(() => {
//       this.initSmoothTransitions();
//       this.animateNavbar();
//     });
//   }

//   // ✅ أنيميشن دخول النـاف بار
//   private animateNavbar() {
//     const navbarEl = this.navbar.nativeElement;
//     gsap.set(navbarEl, { y: -100, opacity: 0 });
//     gsap.to(navbarEl, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', delay: 0.3 });
//   }

//   // ✅ فتح وغلق القائمة الصغيرة
//   toggleMenu() {
//     this.menuOpen = !this.menuOpen;
//     const el = this.navbarMenu.nativeElement;
//     const tl = gsap.timeline({ defaults: { duration: 0.8, ease: 'power2.inOut' } });

//     if (this.menuOpen) {
//       gsap.fromTo(el, { y: -120, opacity: 0 }, { y: 165, opacity: 1 });
//     } else {
//       gsap.to(el, { y: -120, opacity: 0 });
//     }
//   }

//   // ✅ التحكم في التنقل بين السكاشن + تغيير الألوان
//   private initSmoothTransitions() {
//     const container = this.containerWrapper.nativeElement;
//     const sections = gsap.utils.toArray<HTMLElement>('.panel');
//     this.totalSections = sections.length;

//     gsap.set(container, { height: `${this.totalSections * 100}vh` });
//     gsap.set(sections, {
//       position: 'absolute',
//       top: 0,
//       left: 0,
//       width: '100%',
//       height: '100%',
//     });
//     gsap.set(sections, { yPercent: (i) => i * 100 });

//     const goToSection = (index: number, direction: number) => {
//       if (this.animating) return;
//       this.animating = true;
//       this.currentIndex = gsap.utils.wrap(0, this.totalSections, index);

//       const active = sections[this.currentIndex];
//       const others = sections.filter((_, i) => i !== this.currentIndex);

//       // ⚡ الانتقال بين السكاشن بانسيابية
//       const tl = gsap.timeline({
//         defaults: { duration: 1.1, ease: 'power3.inOut' },
//         onComplete: () => { this.animating = false },
//       });

//       tl.to(sections, { yPercent: (i) => (i - this.currentIndex) * 100 }, 0)
//         .to(active, { scale: 1, opacity: 1 }, 0)
//         .to(others, { scale: 0.95, opacity: 0.7 }, 0);

//       // ✅ تغيير الألوان بناءً على الـ data attributes
//       const nextBg = active.dataset['bgcolor']!;
//       const nextText = active.dataset['textcolor']!;

//       gsap.to(container, { backgroundColor: nextBg, duration: 1.1, ease: 'power2.inOut' });

//       const navbarEl = this.navbar.nativeElement;
//       const brandText = document.getElementById('brand-text');

//       if (navbarEl) {
//         gsap.to(navbarEl, { color: nextText, duration: 0.8, ease: 'power2.inOut' });
//       }
//       if (brandText) {
//         gsap.to(brandText, {
//           color: nextText === 'var(--primary)' ? 'var(--dark-gray)' : 'var(--white)',
//           duration: 0.8,
//           ease: 'power2.inOut',
//         });
//       }
//     };

//     // ✅ استخدام GSAP Observer للتحكم بالسكرول
//     Observer.create({
//       type: 'wheel,touch,pointer',
//       wheelSpeed: 1,
//       tolerance: 20,
//       preventDefault: true,
//       onChangeY: (self) => {
//         const now = Date.now();
//         if (this.animating) return;
//         if (now - this.lastScrollTime < 1200) return;

//         if (Math.abs(self.deltaY) > 40) {
//           if (self.deltaY > 0) goToSection(this.currentIndex + 1, 1);
//           else goToSection(this.currentIndex - 1, -1);
//           this.lastScrollTime = now;
//         }
//       },
//     });

//     // ✅ دعم الأسهم ↑ ↓
//     window.addEventListener('keydown', (event) => {
//       if (this.animating) return;
//       if (event.key === 'ArrowDown') goToSection(this.currentIndex + 1, 1);
//       if (event.key === 'ArrowUp') goToSection(this.currentIndex - 1, -1);
//     });
//   }
// }
//////////////////////////////////////////////////

// import {
//   Component,
//   Inject,
//   PLATFORM_ID,
//   AfterViewInit,
//   ViewChild,
//   ElementRef,
//   NgZone,
// } from '@angular/core';
// import { CommonModule, isPlatformBrowser } from '@angular/common';
// import gsap from 'gsap';
// import ScrollTrigger from 'gsap/ScrollTrigger';
// import ScrollSmoother from 'gsap/ScrollSmoother';
// import { Section1Component } from './section1/section1.component';
// import { Section2Component } from './section2/section2.component';
// import { Section4Component } from './section4/section4.component';
// import { Section5Component } from './section5/section5.component';
// import { Section3Component } from "./section3/section3.component";

// gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

// @Component({
//   selector: 'app-home',
//   standalone: true,
//   imports: [CommonModule, Section1Component, Section2Component, Section4Component, Section5Component, Section3Component],
//   templateUrl: './home.component.html',
//   styleUrls: ['./home.component.scss'],
// })
// export class HomeComponent implements AfterViewInit {
//   @ViewChild('containerWrapper', { static: false }) containerWrapper!: ElementRef<HTMLDivElement>;
//   @ViewChild('navbar', { static: false }) navbar!: ElementRef<HTMLElement>;
//   @ViewChild('navbarMenu', { static: false }) navbarMenu!: ElementRef<HTMLElement>;
//   @ViewChild('navSmallScreen', { static: false }) navSmallScreen!: ElementRef<HTMLElement>;

//   menuOpen = false;
//   isBrowser: boolean;

//   constructor(@Inject(PLATFORM_ID) private platformId: Object, private ngZone: NgZone) {
//     this.isBrowser = isPlatformBrowser(this.platformId);
//   }

//   ngAfterViewInit(): void {
//     if (!this.isBrowser) return;
//     this.ngZone.runOutsideAngular(() => {
//       this.initSmoothScroll();
//       this.animateNavbar();
//     });
//   }

//   // ✅ أنيميشن دخول الناف بار
//   private animateNavbar() {
//     const navbarEl = this.navbar.nativeElement;
//     gsap.set(navbarEl, { y: -100, opacity: 0 });
//     gsap.to(navbarEl, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', delay: 0.3 });
//   }

//   // ✅ فتح وغلق القائمة الصغيرة
//   toggleMenu() {
//     this.menuOpen = !this.menuOpen;
//     const el = this.navbarMenu.nativeElement;
//     const tl = gsap.timeline({ defaults: { duration: 0.8, ease: 'power2.inOut' } });

//     if (this.menuOpen) {
//       gsap.fromTo(el, { y: -120, opacity: 0 }, { y: 165, opacity: 1 });
//     } else {
//       gsap.to(el, { y: -120, opacity: 0 });
//     }
//   }

//   // ✅ ScrollSmoother + تغيير الألوان بين السكاشن
//   private initSmoothScroll() {
//     const container = this.containerWrapper.nativeElement;

//     // إنشاء ScrollSmoother
//     const smoother = ScrollSmoother.create({
//       wrapper: '#smooth-wrapper',
//       content: '#smooth-content',
//       smooth: 1.4,
//       effects: true,
//       normalizeScroll: true,
//     });

//     const sections = gsap.utils.toArray<HTMLElement>('.panel');
//     const navbarEl = this.navbar.nativeElement;

//     sections.forEach((section) => {
//       const bgColor = section.dataset['bgcolor'];
//       const textColor = section.dataset['textcolor'];

//       // تغيير الألوان عند دخول كل سكشن
//       ScrollTrigger.create({
//         trigger: section,
//         start: 'top center',
//         end: 'bottom center',
//         onEnter: () => this.updateNavbarColors(navbarEl, bgColor!, textColor!),
//         onEnterBack: () => this.updateNavbarColors(navbarEl, bgColor!, textColor!),
//       });
//     });
//   }

//   // ✅ تغيير لون النصوص في الناف بار والـ Brand
//   private updateNavbarColors(navbar: HTMLElement, bgColor: string, textColor: string) {
//     gsap.to(navbar, {
//       color: textColor,
//       duration: 0.6,
//       ease: 'power2.inOut',
//     });
//     const brandText = document.getElementById('brand-text');
//     if (brandText) {
//       gsap.to(brandText, {
//         color: textColor === 'var(--primary)' ? 'var(--dark-gray)' : 'var(--white)',
//         duration: 0.6,
//         ease: 'power2.inOut',
//       });
//     }
//   }
// }
import {
  Component,
  Inject,
  PLATFORM_ID,
  AfterViewInit,
  ViewChild,
  ElementRef,
  NgZone,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import ScrollSmoother from 'gsap/ScrollSmoother';
import { Section1Component } from './section1/section1.component';
import { Section2Component } from './section2/section2.component';
import { Section4Component } from './section4/section4.component';
import { Section5Component } from './section5/section5.component';
import { Section6Component } from "./section6/section6.component";
import { Section7Component } from "./section7/section7.component";
import { Section8Component } from "./section8/section8.component";
import { Section9Component } from './section9/section9.component';
import { Section10Component } from "./section10/section10.component";
import { BehaviorSubject } from 'rxjs';
import { Section3Component } from "./section3/section3.component";

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, Section1Component, Section2Component, Section4Component, Section5Component, Section6Component, Section7Component, Section8Component, Section10Component, Section3Component],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements AfterViewInit {
  @ViewChild('navbar', { static: false }) navbar!: ElementRef<HTMLElement>;
  @ViewChild('navbarMenu', { static: false }) navbarMenu!: ElementRef<HTMLElement>;
  private visibilitySubject = new BehaviorSubject<'visible' | 'invisible'>('visible');
  visibility$ = this.visibilitySubject.asObservable();
  visibilityState: 'visible' | 'invisible' = 'visible';
  private smoother!: any;

  sections = [
    { id: 'section1', label: 'section1', wholeSectionId: "section1" },
    { id: 'section2', label: 'section2', wholeSectionId: "section2" },
    { id: 'section3', label: 'section3', wholeSectionId: "section3" },
    { id: 'section4', label: 'section4', wholeSectionId: "section4" },
    { id: 'section5', label: 'section5', wholeSectionId: "section5" },
    { id: 'section10', label: 'section10', wholeSectionId: "section10" },
    { id: 'section6', label: 'section6', wholeSectionId: "section6" },
    { id: 'section7', label: 'section7', wholeSectionId: "section7" },
    { id: 'section8', label: 'section8', wholeSectionId: "section8" },
  ];
  menuOpen = false;
  isBrowser: boolean;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngAfterViewInit(): void {
    if (!this.isBrowser) return;

    this.ngZone.runOutsideAngular(() => {
      setTimeout(() => {
        this.initSmoothScroll(); // ✅ تفعيل السموذ سكرول فقط
        this.animateNavbar(); // ✅ أنيميشن النافبار الأصلي
        this.observeSections(); // ✅ تغيير الألوان للنافبار والبراند
        this.initSectionIndicators()
        this.sideMenu();
        this.handleResponsiveSideMenu();
        window.addEventListener('resize', () => {
          this.ngZone.run(() => {
            this.handleResponsiveSideMenu();
            this.cdr.detectChanges(); // <-- إعادة فحص بعد كل resize
          });
        });
      }, 150);
    });
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
    const el = this.navbarMenu.nativeElement;
    gsap.to(el, {
      y: this.menuOpen ? 165 : -120,
      opacity: this.menuOpen ? 1 : 0,
      duration: 0.8,
      ease: 'power2.inOut',
    });
  }
  // toggleMenu() {
  //   this.menuOpen = !this.menuOpen;
  //   const nav = document.querySelector('nav');
  //   if (this.menuOpen) {
  //     nav?.classList.remove('closed');
  //   } else {
  //     nav?.classList.add('closed');
  //   }
  // }

  private animateNavbar() {
    const navbarEl = this.navbar.nativeElement;
    // gsap.set(navbarEl, { y: -100, opacity: 0 });
    gsap.fromTo(navbarEl, { y: -100, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: 'power2.inOut' });
  }

  private initSmoothScroll() {
    // ✅ ScrollSmoother شغال بدون أي تأثيرات إضافية
    if ((window as any).ScrollSmoother?.get?.()) {
      this.smoother = (window as any).ScrollSmoother.get();
      return; // ✅ لو السموذر شغال فعلاً، ما تعيديش إنشاءه
    }
    this.smoother = ScrollSmoother.create({
      wrapper: '#smooth-wrapper',
      content: '#smooth-content',
      smooth: 1.2,
      normalizeScroll: true,
      effects: false,
      ignoreMobileResize: true,
      smoothTouch: 0.1,
    });

    requestAnimationFrame(() => ScrollTrigger.refresh());
    ScrollTrigger.config({ ignoreMobileResize: true });
  }

  private observeSections() {
    const sections = gsap.utils.toArray<HTMLElement>('.panel');
    const navbarEl = this.navbar.nativeElement;

    sections.forEach((section) => {
      const bgColor = section.dataset['bgcolor'] || 'var(--white)';
      const textColor = section.dataset['textcolor'] || 'var(--primary)';

      ScrollTrigger.create({
        trigger: section,
        start: 'top 50%',
        end: 'bottom 50%',
        onEnter: () => this.updateNavbarColors(navbarEl, textColor),
        onEnterBack: () => this.updateNavbarColors(navbarEl, textColor),
      });
    });
  }

  private updateNavbarColors(navbarEl: HTMLElement, textColor: string) {
    gsap.to(navbarEl, { color: textColor, duration: 0.4 });
    const brand = document.getElementById('brand-text');
    if (brand) {
      gsap.to(brand, {
        color: textColor === 'var(--primary)' ? 'var(--dark-gray)' : 'var(--white)',
        duration: 0.4,
      });
    }
  }
  sideMenu() {


    this.visibility$.subscribe(value => {
      this.visibilityState = value;
    });


  }
  scrollToSection(sectionId: string) {
    const target = document.getElementById(sectionId);
    if (!target) return;

    // ✅ استخدمي نفس instance محفوظة بدل ما تعملي ScrollSmoother.get() كل مرة
    if (this.smoother) {
      this.smoother.scrollTo(target, true, "top");
    } else {
      gsap.to(window, {
        duration: 1,
        scrollTo: { y: target, offsetY: 0 },
        ease: 'power2.out'
      });
    }
    this.sections.forEach((section) => {
      const sectionEl = document.getElementById(section.wholeSectionId);
      const dotWrapper = document.getElementById('dot-' + section.wholeSectionId);
      console.log(sectionEl);
      console.log(dotWrapper);
      if (sectionEl && dotWrapper) {
        const dot = dotWrapper.querySelector('.dot') as HTMLElement;
        const label = dotWrapper.querySelector('.dot-label') as HTMLElement;


        // if (section.wholeSectionId == "section4") {
        //   ScrollTrigger.create({
        //     trigger: this.sections[0].wholeSectionId,
        //     start: 'top center',
        //     end: '+=7050',
        //     // end: 'bottom center',
        //     // markers: true,
        //     onEnter: () => {
        //       dot?.classList.add('scale-[2.5]');
        //       label?.classList.add('opacity-100');
        //     },
        //     onEnterBack: () => {
        //       dot?.classList.add('scale-[2.5]');
        //       label?.classList.add('opacity-100');
        //     },
        //     onLeave: () => {
        //       dot?.classList.remove('scale-[2.5]');
        //       label?.classList.remove('opacity-100');
        //     },
        //     onLeaveBack: () => {
        //       dot?.classList.remove('scale-[2.5]');
        //       label?.classList.remove('opacity-100');
        //     }
        //   });
        // } else if (section.wholeSectionId == "section5") {
        //   ScrollTrigger.create({
        //     trigger: sectionEl,
        //     start: 'top top',
        //     end: '+=5000 400%',
        //     onEnter: () => {
        //       dot?.classList.add('scale-[2.5]');
        //       label?.classList.add('opacity-100');
        //     },
        //     onEnterBack: () => {
        //       dot?.classList.add('scale-[2.5]');
        //       label?.classList.add('opacity-100');
        //     },
        //     onLeave: () => {
        //       dot?.classList.remove('scale-[2.5]');
        //       label?.classList.remove('opacity-100');
        //     },
        //     onLeaveBack: () => {
        //       dot?.classList.remove('scale-[2.5]');
        //       label?.classList.remove('opacity-100');
        //     }
        //   });
        // } else if (section.wholeSectionId == "section6") {
        //   ScrollTrigger.create({
        //     trigger: sectionEl,
        //     start: 'top top',
        //     end: '+=8400 bottom',
        //     onEnter: () => {
        //       dot?.classList.add('scale-[2.5]');
        //       label?.classList.add('opacity-100');
        //     },
        //     onEnterBack: () => {
        //       dot?.classList.add('scale-[2.5]');
        //       label?.classList.add('opacity-100');
        //     },
        //     onLeave: () => {
        //       dot?.classList.remove('scale-[2.5]');
        //       label?.classList.remove('opacity-100');
        //     },
        //     onLeaveBack: () => {
        //       dot?.classList.remove('scale-[2.5]');
        //       label?.classList.remove('opacity-100');
        //     }
        //   });

        // } else if (section.wholeSectionId == "Product1Container") {
        //   ScrollTrigger.create({
        //     trigger: sectionEl,
        //     start: 'top top',
        //     end: '+=6200 bottom',
        //     // markers: true,
        //     onEnter: () => {
        //       dot?.classList.add('scale-[2.5]');
        //       label?.classList.add('opacity-100');
        //       label?.classList.replace('text-white', 'text-black');
        //     },
        //     onEnterBack: () => {
        //       dot?.classList.add('scale-[2.5]');
        //       label?.classList.add('opacity-100');
        //       label?.classList.replace('text-white', 'text-black');
        //     },
        //     onLeave: () => {
        //       dot?.classList.remove('scale-[2.5]');
        //       label?.classList.remove('opacity-100');
        //       label?.classList.replace('text-black', 'text-white');
        //     },
        //     onLeaveBack: () => {
        //       dot?.classList.remove('scale-[2.5]');
        //       label?.classList.remove('opacity-100');
        //       label?.classList.replace('text-black', 'text-white');
        //     }
        //   });
        // } else if (section.wholeSectionId == "section8") {
        //   ScrollTrigger.create({
        //     trigger: sectionEl,
        //     start: 'top top',
        //     end: '+=2500',
        //     onEnter: () => {
        //       dot?.classList.add('scale-[2.5]');
        //       label?.classList.add('opacity-100');
        //     },
        //     onEnterBack: () => {
        //       dot?.classList.add('scale-[2.5]');
        //       label?.classList.add('opacity-100');
        //     },
        //     onLeave: () => {
        //       dot?.classList.remove('scale-[2.5]');
        //       label?.classList.remove('opacity-100');
        //     },
        //     onLeaveBack: () => {
        //       dot?.classList.remove('scale-[2.5]');
        //       label?.classList.remove('opacity-100');
        //     }
        //   });

        // }
      }
    });
  }
  setVisibility(state: 'visible' | 'invisible') {
    this.visibilitySubject.next(state);
  }

  getCurrentVisibility(): 'visible' | 'invisible' {
    return this.visibilitySubject.getValue();
  }
  private initSectionIndicators() {
    const sections = document.querySelectorAll<HTMLElement>('.panel');

    sections.forEach((section) => {
      const sectionId = section.id;
      const dotWrapper = document.getElementById('dot-' + sectionId);
      if (!dotWrapper) return;

      const dot = dotWrapper.querySelector('.dot') as HTMLElement;
      const label = dotWrapper.querySelector('.dot-label') as HTMLElement;

      ScrollTrigger.create({
        trigger: section,
        start: 'top center',
        end: 'bottom center',
        onEnter: () => this.activateDot(dot, label),
        onEnterBack: () => this.activateDot(dot, label),
        onLeave: () => this.deactivateDot(dot, label),
        onLeaveBack: () => this.deactivateDot(dot, label),
      });
    });
  }

  private activateDot(dot: HTMLElement, label: HTMLElement) {
    // احذفي أي active تانية
    document.querySelectorAll('.dot').forEach(d => d.classList.remove('active'));
    document.querySelectorAll('.dot-label').forEach(l => l.classList.remove('active'));

    // فعّلي الحالية
    dot.classList.add('active');
    label.classList.add('active');
  }

  private deactivateDot(dot: HTMLElement, label: HTMLElement) {
    dot.classList.remove('active');
    label.classList.remove('active');
  }
  private handleResponsiveSideMenu() {
    if (window.innerWidth < 700) {
      this.setVisibility('invisible');
    } else {
      this.setVisibility('visible');
    }
  }

}
