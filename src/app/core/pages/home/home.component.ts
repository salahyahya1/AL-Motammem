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

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports: [Section2Component, Section1Component, CommonModule],
})
export class HomeComponent implements AfterViewInit {
  // Use static: false so ViewChilds are resolved on the client in ngAfterViewInit.
  @ViewChild('containerWrapper', { static: false }) containerWrapper!: ElementRef<HTMLDivElement>;
  @ViewChild('navbar', { static: false }) navbar!: ElementRef<HTMLElement>;
  @ViewChild('blueSection', { static: false }) blueSection!: ElementRef<HTMLElement>;
  private animationsInitialized = false;
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private appRef: ApplicationRef,
      private ngZone: NgZone
  ) { }
  ngAfterViewInit(): void {
    if (typeof window === 'undefined') return;

    if (!isPlatformBrowser(this.platformId)) {
      console.log('SSR mode detected — skipping animations.');
      return;
    }
    // setTimeout(() => {
    //   disablePassiveListeners();
    //   this.TranzitionBetweenSections();
    //   gsap.set(this.navbar.nativeElement, { y: '-100%', opacity: 0 });

    //   // ثم نعمل أنيميشن دخوله بعد تحميل الصفحة
    //   gsap.to(this.navbar.nativeElement, {
    //     y: 0,
    //     opacity: 1,
    //     duration: 0.2,
    //   });
    // }, 100);
    // ScrollTrigger.refresh();
    this.ngZone.onStable.subscribe(() => {
      // ⏱ تأخير بسيط بعد hydration
      setTimeout(() => {
        // make init idempotent in case onStable fires multiple times
        if (this.animationsInitialized) return;
        this.animationsInitialized = true;
        this.initAnimationsSafely();
      }, 0);
    });
  }

  TranzitionBetweenSections() {
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

          const navbarEl = this.navbar?.nativeElement;
          if (navbarEl) {
            gsap.to(navbarEl, {
              color: textColor,
              duration: 0.5,
              ease: 'power2.inOut',
            });
          }
          gsap.to('#brand-text', {
            color: textColor === 'var(--primary)' ? 'var(--dark-gray)' : 'var(--light)',
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

          const navbarEl2 = this.navbar?.nativeElement;
          if (navbarEl2) {
            gsap.to(navbarEl2, {
              color: prevTextColor,
              duration: 0.5,
              ease: 'power2.inOut',
            });
          }
          gsap.to('#brand-text', {
            color: prevTextColor === 'var(--primary)' ? 'var(--dark-gray)' : 'var(--light)',
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
      // تأكيد أن العناصر اتعرّفت
      if (!this.navbar || !this.containerWrapper || !this.blueSection) {
        console.warn('Navbar or sections not found yet.');
        return;
      }

      disablePassiveListeners();
      this.TranzitionBetweenSections();

      const navbarEl3 = this.navbar?.nativeElement;
      if (navbarEl3) {
        gsap.set(navbarEl3, { y: '-100%', opacity: 0 });
        gsap.to(navbarEl3, {
          y: 0,
          opacity: 1,
          duration: 0.2,
        });
      }

      ScrollTrigger.refresh();
    } catch (error) {
      console.error('❌ Error in HomeComponent animation:', error);
    }
  };
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
