// import { CommonModule, isPlatformBrowser } from '@angular/common';
// import { ApplicationRef } from '@angular/core';
// import {
//   Component,
//   Inject,
//   PLATFORM_ID,
//   AfterViewInit,
//   ViewChild,
//   ElementRef,
// } from '@angular/core';
// import Scrollbar from 'smooth-scrollbar';
// import gsap from 'gsap';
// import ScrollTrigger from 'gsap/ScrollTrigger';
// import { Section2Component } from './section2/section2.component';
// import { Section1Component } from './section1/section1.component';
// import { log } from 'node:console';

// gsap.registerPlugin(ScrollTrigger);

// @Component({
//   selector: 'app-home',
//   templateUrl: './home.component.html',
//   styleUrls: ['./home.component.scss'],
//   imports: [Section2Component, Section1Component, CommonModule],
// })
// export class HomeComponent implements AfterViewInit {
//   @ViewChild('scrollContainer', { static: true })
//   scrollContainer!: ElementRef<HTMLDivElement>;
//   currentHeaderTextColor!: string;
//   currentBackgroundColor: string = '#ffffff';

//   constructor(
//     @Inject(PLATFORM_ID) private platformId: Object,
//     private appRef: ApplicationRef
//   ) { }

//   ngAfterViewInit(): void {
//     if (!isPlatformBrowser(this.platformId)) return;

//     this.appRef.isStable.subscribe((isStable) => {
//       if (isStable) {
//         this.setupGsapScroll();
//       }
//     });
//   }

//   setupGsapScroll(): void {
//     const scrollBar = Scrollbar.init(this.scrollContainer.nativeElement, {
//       damping: 0.06,
//       alwaysShowTracks: false,
//       delegateTo: document,
//     });

//     ScrollTrigger.defaults({ scroller: this.scrollContainer.nativeElement });

//     ScrollTrigger.scrollerProxy(this.scrollContainer.nativeElement, {
//       scrollTop(value?: number): number {
//         if (value !== undefined) {
//           scrollBar.scrollTop = value;
//         }
//         return scrollBar.scrollTop;
//       },
//     });

//     scrollBar.addListener(ScrollTrigger.update);

//     const sections = this.scrollContainer.nativeElement.querySelectorAll(
//       '[data-bgcolor]'
//     ) as NodeListOf<HTMLElement>;

//     // Set initial background + header color
//     const firstSection = sections[0];
//     gsap.set(this.scrollContainer.nativeElement, {
//       backgroundColor: firstSection.dataset['bgcolor'] || '#fff',
//     });
//     this.currentHeaderTextColor = firstSection.dataset['textcolor'] || '#000';
//     this.currentBackgroundColor = firstSection.dataset['bgcolor'] || '#fff';

//     sections.forEach((section, i) => {
//       const prev = i === 0 ? null : sections[i - 1];

//       ScrollTrigger.create({
//         trigger: section,
//         start: 'top 30%',
//         onEnter: () => {
//           const bg = section.dataset['bgcolor'] || '#fff';
//           const text = section.dataset['textcolor'] || '#000';
//           console.log('Entering section with bg:', bg, 'and text:', text);
//           gsap.to(this.scrollContainer.nativeElement, {
//             backgroundColor: bg,
//             duration: 0.6,
//             ease: 'power1.out',
//           });

//           gsap.to(this, {
//             currentHeaderTextColor: text,
//             duration: 0.6,
//             ease: 'power1.out',
//           });

//           gsap.fromTo(
//             section,
//             { opacity: 0 },
//             { opacity: 1, duration: 0.8, ease: 'power1.out' }
//           );
//         },
//         onLeaveBack: () => {
//           if (prev) {
//             const bg = prev.dataset['bgcolor'] || '#fff';
//             const text = prev.dataset['textcolor'] || '#000';
//             console.log('Entering section with bg on leave back:', bg, 'and text:', text);
//             gsap.to(this.scrollContainer.nativeElement, {
//               backgroundColor: bg,
//               duration: 0.6,
//               ease: 'power1.out',
//             });

//             gsap.to(this, {
//               currentHeaderTextColor: text,
//               duration: 0.6,
//               ease: 'power1.out',
//             });
//           }
//         },
//       });
//     });

//     ScrollTrigger.refresh();
//   }
// }

// import { CommonModule, isPlatformBrowser } from '@angular/common';
// import { ApplicationRef } from '@angular/core';
// import {
//   Component,
//   Inject,
//   PLATFORM_ID,
//   AfterViewInit,
//   ViewChild,
//   ElementRef,
// } from '@angular/core';
// import Scrollbar from 'smooth-scrollbar';
// import gsap from 'gsap';
// import ScrollTrigger from 'gsap/ScrollTrigger';
// import { Section2Component } from './section2/section2.component';
// import { Section1Component } from './section1/section1.component';
// import { log } from 'node:console';

// gsap.registerPlugin(ScrollTrigger);

// @Component({
//   selector: 'app-home',
//   templateUrl: './home.component.html',
//   styleUrls: ['./home.component.scss'],
//   imports: [Section2Component, Section1Component, CommonModule],
// })
// export class HomeComponent implements AfterViewInit {

//   constructor(
//     @Inject(PLATFORM_ID) private platformId: Object,
//     private appRef: ApplicationRef
//   ) { }
//   @ViewChild('containerWrapper', { static: true }) containerWrapper!: ElementRef;
//   @ViewChild('navbar', { static: true }) navbar!: ElementRef;
//   currentHeaderTextColor: string = 'var(--primary)';
//   ngAfterViewInit(): void {
//     if (!isPlatformBrowser(this.platformId)) return;


//     const container = this.containerWrapper.nativeElement;
//     const panels = container.querySelectorAll(".panel");
//     ScrollTrigger.scrollerProxy(container, {
//       scrollTop(value) {
//         if (value !== undefined) {
//           container.scrollTop = value;
//         }
//         return container.scrollTop;
//       },
//       getBoundingClientRect() {
//         return {
//           top: 0,
//           left: 0,
//           width: container.clientWidth,
//           height: container.clientHeight,
//         };
//       },
//       pinType: container.style.transform ? "transform" : "fixed",
//     });
//     panels.forEach((panel: HTMLElement, i: number) => {
//       const nextPanel = panels[i + 1];
//       if (nextPanel) {

//         if (!nextPanel.dataset.bgcolor || !nextPanel.dataset.textcolor) return;
//         // ScrollTrigger.create({
//         //   trigger: nextPanel,
//         //   start: "top center",
//         //   end: "bottom center",
//         //   scrub: true,
//         //   scroller: container,
//         //   onEnter: () => {
//         //     gsap.to(container, {
//         //       backgroundColor: nextPanel.dataset.bgcolor,
//         //       duration: 0.5,
//         //     });
//         //     gsap.to(this.navbar.nativeElement, {
//         //       color: nextPanel.dataset.textcolor,
//         //       duration: 0.3,
//         //     });

//         //   },
//         //   onLeaveBack: () => {
//         //     const prevPanel = panels[i];
//         //     gsap.to(container, {
//         //       backgroundColor: prevPanel.dataset.bgcolor,
//         //       color: prevPanel.dataset.textcolor,
//         //       duration: 0.5,
//         //     });
//         //     gsap.to(this.navbar.nativeElement, {
//         //       color: prevPanel.dataset.textcolor,
//         //       duration: 0.3,
//         //     });
//         //   },
//         // });
//         panels.forEach((panel: HTMLElement, i: number) => {
//           const nextPanel = panels[i + 1];
//           if (!nextPanel) return;

//           const bgColor = nextPanel.dataset.bgcolor!;
//           const textColor = nextPanel.dataset.textcolor!;
//           const prevBgColor = panel.dataset['bgcolor']!;
//           const prevTextColor = panel.dataset['textcolor']!;

//           // 1. Timeline with scrub for smooth transition
//           const tl = gsap.timeline({
//             scrollTrigger: {
//               trigger: nextPanel,
//               start: "top center",
//               end: "bottom center",
//               scrub: true,
//               scroller: container,
//               markers: true,
//             }
//           });

//           tl.to(container, {
//             backgroundColor: bgColor,
//             duration: 0.5,
//           });

//           tl.to(this.navbar.nativeElement, {
//             color: textColor,
//             duration: 0.5,
//           }, 0);

//           // 2. Fix final color on enter (exact)
//           // ScrollTrigger.create({
//           //   trigger: nextPanel,
//           //   start: "top center",
//           //   end: "bottom center",
//           //   scroller: container,
//           //   onEnter: () => {
//           //     gsap.to(container, {
//           //       backgroundColor: bgColor,
//           //       duration: 0.2
//           //     });
//           //     gsap.to(this.navbar.nativeElement, {
//           //       color: textColor,
//           //       duration: 0.2
//           //     });
//           //   },
//           //   onLeaveBack: () => {
//           //     gsap.to(container, {
//           //       backgroundColor: prevBgColor,
//           //       duration: 0.2
//           //     });
//           //     gsap.to(this.navbar.nativeElement, {
//           //       color: prevTextColor,
//           //       duration: 0.2
//           //     });
//           //   }
//           // });
//         });


//         ScrollTrigger.defaults({ scroller: container });
//         ScrollTrigger.refresh();

//       }
//     });
//   }

// }
import {
  Component,
  Inject,
  PLATFORM_ID,
  AfterViewInit,
  ViewChild,
  ElementRef,
  ApplicationRef,
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
  @ViewChild('containerWrapper', { static: true }) containerWrapper!: ElementRef<HTMLDivElement>;
  @ViewChild('navbar', { static: true }) navbar!: ElementRef<HTMLElement>;
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private appRef: ApplicationRef
  ) { }
  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.TranzitionBetweenSections();
    ScrollTrigger.refresh();
  }

  TranzitionBetweenSections() {
    const container = this.containerWrapper.nativeElement;

    // ✅ Init Smooth Scrollbar
    const scrollbar = Scrollbar.init(container, {
      damping: 0.08,
    });
    const blueSectionEl = container.querySelector('.blue-section .content-wrapper');

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

      ScrollTrigger.create({
        trigger: next,
        start: 'top center',
        end: 'bottom center',
        scrub: true,
        scroller: container,
        onEnter: () => {
          gsap.to(container, {
            backgroundColor: bgColor,
            duration: 0.4,
          });
          gsap.to(this.navbar.nativeElement, {
            color: textColor,
            duration: 0.4,
          });
        },
        onLeaveBack: () => {
          gsap.to(container, {
            backgroundColor: prevBgColor,
            duration: 0.4,
          });
          gsap.to(this.navbar.nativeElement, {
            color: prevTextColor,
            duration: 0.4,
          });
        }
      });

    });

  }
}
