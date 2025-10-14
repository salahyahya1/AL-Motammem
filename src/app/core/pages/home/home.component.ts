import {
  Component,
  Inject,
  PLATFORM_ID,
  AfterViewInit,
  ViewChild,
  ElementRef,
  ApplicationRef,
  NgZone,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import Scrollbar from 'smooth-scrollbar';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { Section2Component } from './section2/section2.component';
import { Section1Component } from './section1/section1.component';
import { Section4Component } from "./section4/section4.component";
import { Section5Component } from "./section5/section5.component";
import { Section3Component } from "./section3/section3.component";

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports: [Section2Component, Section1Component, CommonModule, Section4Component, Section5Component, Section3Component],
})
export class HomeComponent implements AfterViewInit {
  // Use static: false so ViewChilds are resolved on the client in ngAfterViewInit.
  @ViewChild('containerWrapper', { static: false }) containerWrapper!: ElementRef<HTMLDivElement>;
  @ViewChild('navbar', { static: false }) navbar!: ElementRef<HTMLElement>;
  @ViewChild('blueSection', { static: false }) blueSection!: ElementRef<HTMLElement>;
  @ViewChild('navbarMenu', { static: false }) navbarMenu!: ElementRef<HTMLElement>;
  @ViewChild('navSmallScreen', { static: false }) navSmallScreen!: ElementRef<HTMLElement>;
  menuOpen = false;
  isSmallScreen = false;
  isBrowser: boolean;
  private resizeHandler = this.checkScreenSize.bind(this);
  private animationsInitialized = false;
  private scrollTimelineInitialized = false;
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private appRef: ApplicationRef,
    private ngZone: NgZone
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    if (this.isBrowser) {
      window.addEventListener('resize', this.resizeHandler);
      this.checkScreenSize();
    }
  }
  checkScreenSize() {
    if (!this.isBrowser) return;
    this.isSmallScreen = window.innerWidth < 700;

  }
  toggleMenu() {
    if (!this.isBrowser) return;
    this.menuOpen = !this.menuOpen;
    const tl = gsap.timeline({ defaults: { duration: 0.9, ease: 'power2.inOut' } });
    if (this.menuOpen) {
      tl.to('.h-7.w-7 path', { rotate: 30, transformOrigin: 'center center' });
    } else {
      tl.to('.h-7.w-7 path', { rotate: 0, transformOrigin: 'center center' });
    }
    const el = this.navbarMenu.nativeElement;
    if (this.menuOpen) {

      console.log("opened")
      gsap.killTweensOf(el);
      gsap.fromTo(
        el,
        { opacity: 1, y: -120 },
        {
          opacity: 1,
          y: 165,
          duration: 0.9,
          ease: 'power2.out',
        }
      );
    } else {
      console.log("closed")
      gsap.killTweensOf(el);
      gsap.to(el, {
        opacity: 1,
        y: -120,
        duration: 0.9,
        ease: 'power2.in',
      });
    }
    setTimeout(() => ScrollTrigger.refresh(), 500);

  }


  ngAfterViewInit(): void {
    if (typeof window === 'undefined') return;

    if (!isPlatformBrowser(this.platformId)) {
      console.log('SSR mode detected — skipping animations.');
      return;
    }
    this.ngZone.onStable.subscribe(() => {
      setTimeout(() => {
        if (this.animationsInitialized) return;
        this.animationsInitialized = true;
        this.initAnimationsSafely();
      }, 0);
    });
  }

  TranzitionBetweenSections() {
    if (ScrollTrigger.getAll().length > 0) return;
    const container = this.containerWrapper?.nativeElement;
    if (!container) {
      console.warn('TranzitionBetweenSections: container element not found. Skipping.');
      return;
    }
    const scrollbar = Scrollbar.init(container, {
      damping: 0.02,
      alwaysShowTracks: true,
      continuousScrolling: true,
    });
    (scrollbar as any).options.delegateTo = null;
    const blueSectionEl = this.blueSection?.nativeElement;
    if (!blueSectionEl) {
      console.warn('TranzitionBetweenSections: blueSection element not found. Skipping animations for this section.');
      return;
    }

    gsap.to(blueSectionEl, {
      y: 0,
      opacity: 1,
      duration: 1,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: blueSectionEl,
        start: 'top 90%',
        end: 'top 40%',
        scrub: true,
        scroller: container,
      }
    });
    ScrollTrigger.scrollerProxy(container, {
      scrollTop(value) {
        if (value !== undefined) scrollbar.scrollTop = value;
        return scrollbar.scrollTop;
      },
      getBoundingClientRect() {
        return {
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight,
        };
      },
      pinType: container.style.transform ? "transform" : "fixed",
    });

    scrollbar.addListener(ScrollTrigger.update);
    ScrollTrigger.defaults({ scroller: container });

    const panels = container.querySelectorAll('.panel');

    panels.forEach((el, i) => {
      const panel = el as HTMLElement;
      const next = panels[i + 1] as HTMLElement;
      if (!next) return;

      const bgColor = next.dataset['bgcolor']!;
      const textColor = next.dataset['textcolor']!;
      const prevBgColor = panel.dataset['bgcolor']!;
      const prevTextColor = panel.dataset['textcolor']!;
      const navbarEl = this.navbar?.nativeElement;
      const navSmallScreenEl = this.navSmallScreen?.nativeElement;
      console.log({ textColor, prevTextColor });
      ScrollTrigger.create({
        trigger: next,
        start: 'top center',
        end: 'bottom center',
        scrub: true,
        scroller: container,
        onEnter: () => {
          // gsap.to(container, {
          //   backgroundColor: bgColor,
          //   duration: 0.4,
          // });
          gsap.to(container, {
            backgroundColor: bgColor,
            duration: 0.8,
            ease: 'power2.inOut',
          });
          if (navbarEl) {
            gsap.to(navbarEl, {
              color: textColor,
              duration: 0.5,
              // backgroundColor: bgColor,
              ease: 'power2.inOut',

              // onComplete: () => {
              //   ScrollTrigger.matchMedia({
              //     "(max-width: 700px)": function () {
              //       gsap.to(navSmallScreenEl, {
              //         backgroundColor: bgColor,
              //         duration: 0.5,
              //         ease: 'power2.inOut',
              //       })
              //     },
              //   })

              // }

              // onComplete: () => {
              //   gsap.to(navSmallScreenEl, {
              //     backgroundColor: bgColor,
              //     duration: 0.5,
              //     ease: 'power2.inOut',
              //   })
              // }
            });
          }
          gsap.to('#brand-text', {
            color: textColor === 'var(--primary)' ? 'var(--dark-gray)' : 'var(--white)',
            duration: 0.5,
            ease: 'power2.inOut',
          });

        },
        onLeaveBack: () => {
          // gsap.to(container, {
          //   backgroundColor: prevBgColor,
          //   duration: 0.4,
          // });
          gsap.to(container, {
            backgroundColor: prevBgColor,
            duration: 0.8,
            ease: 'power2.inOut',
          });

          if (navbarEl) {
            gsap.to(navbarEl, {
              color: prevTextColor,
              // backgroundColor: prevBgColor,
              duration: 0.5,
              ease: 'power2.inOut',
              // onComplete: () => {
              //   gsap.to(navSmallScreenEl, {
              //     backgroundColor: prevBgColor,
              //     duration: 0.5,
              //     ease: 'power2.inOut',
              //   })
              // }
            });
          }
          gsap.to('#brand-text', {
            color: prevTextColor === 'var(--primary)' ? 'var(--dark-gray)' : 'var(--white)',
            duration: 0.5,
            ease: 'power2.inOut',
          });
        }
      });

    });
    scrollbar.addListener(ScrollTrigger.update);
    gsap.ticker.add(() => ScrollTrigger.update());

  }
  private initAnimationsSafely() {
    try {
      // نحاول ننتظر العناصر فعلاً تبقى موجودة في الـ DOM
      const waitForElements = () => {
        if (!this.navbar?.nativeElement || !this.containerWrapper?.nativeElement || !this.blueSection?.nativeElement) {
          // لو لسه مش موجودين، نجرب تاني بعد 50ms
          setTimeout(waitForElements, 50);
          return;
        }

        // ✅ العناصر موجودة خلاص
        disablePassiveListeners();
        if (!this.scrollTimelineInitialized) {
          this.TranzitionBetweenSections();
          this.scrollTimelineInitialized = true;
        }

        const navbarEl = this.navbar.nativeElement;
        gsap.set(navbarEl, { y: '-100%', opacity: 0 });
        gsap.to(navbarEl, {
          y: 0,
          opacity: 1,
          duration: 0.5,
          ease: 'power3.out',
          delay: 0.2
        });

        ScrollTrigger.refresh();
      };

      // ابدأ أول محاولة
      waitForElements();

    } catch (error) {
      console.error('❌ Error in HomeComponent animation:', error);
    }
  }

}
let passiveListenersDisabled = false;
export function disablePassiveListeners() {
  if (passiveListenersDisabled) return;
  passiveListenersDisabled = true;

  const originalAddEventListener = EventTarget.prototype.addEventListener;
  EventTarget.prototype.addEventListener = function (type, listener, options) {
    if (type === 'wheel' || type === 'touchstart' || type === 'touchmove') {
      if (typeof options === 'object') options.passive = false;
      else if (options === true) options = { passive: false };
    }
    return originalAddEventListener.call(this, type, listener, options);
  };
}
