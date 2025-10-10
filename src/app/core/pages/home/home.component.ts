
// import { CommonModule, isPlatformBrowser } from '@angular/common';
// import { ApplicationRef } from '@angular/core';

// import { Component, Inject, PLATFORM_ID, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
// import Scrollbar from 'smooth-scrollbar';
// import gsap from 'gsap';
// import ScrollTrigger from 'gsap/ScrollTrigger';
// import { Section2Component } from "./section2/section2.component";
// import { Section1Component } from "./section1/section1.component";

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
//   currentHeaderTextColor: string = 'var(--primary)';
//   constructor(
//     @Inject(PLATFORM_ID) private platformId: Object,
//     private appRef: ApplicationRef
//   ) { }

//   ngAfterViewInit(): void {
//     if (!isPlatformBrowser(this.platformId)) return;

//     // Hydration-safe
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
//       // getBoundingClientRect() {
//       //   return {
//       //     top: 0,
//       //     left: 0,
//       //     width: window.innerWidth,
//       //     height: window.innerHeight,
//       //   };
//       // },
//     });

//     scrollBar.addListener(ScrollTrigger.update);


//     const sections = this.scrollContainer.nativeElement.querySelectorAll('[data-bgcolor]') as NodeListOf<HTMLElement>;
//     const firstSection = sections[0];
//     gsap.set(this.scrollContainer.nativeElement, {
//       backgroundColor: firstSection.dataset['bgcolor'] || '#fff',
//     });
//     this.currentHeaderTextColor = firstSection.dataset['textcolor'] || '#000';
//     // sections.forEach((section, i) => {
//     //   const prev = i === 0 ? null : sections[i - 1];

//     //   ScrollTrigger.create({
//     //     trigger: section,
//     //     start: 'top 30%',
//     //     // markers: true,
//     //     onEnter: () => {
//     //       const bg = section.dataset['bgcolor'] || '#fff';
//     //       const text = section.dataset['textcolor'] || '#000';
//     //       gsap.to(this.scrollContainer.nativeElement, {
//     //         backgroundColor: bg,
//     //         // color: section.dataset['textcolor'],
//     //         overwrite: 'auto',
//     //         duration: 0.5,

//     //       });

//     //       gsap.to(this, {
//     //         currentHeaderTextColor: text,
//     //         duration: 0.5,
//     //       });
//     //     },
//     //     onLeaveBack: () => {
//     //       if (prev) {
//     //         const bg = prev?.dataset['bgcolor'] || '#fff';
//     //         const text = prev?.dataset['textcolor'] || '#000';

//     //         gsap.to(this.scrollContainer.nativeElement, {
//     //           backgroundColor: bg,
//     //           // overwrite: 'auto',
//     //           duration: 0.5,
//     //         });
//     //         gsap.to(this, {
//     //           currentHeaderTextColor: text,
//     //           duration: 0.5,
//     //         });
//     //       }
//     //     },
//     //   });
//     // });
//     sections.forEach((section, i) => {
//       const prev = i === 0 ? null : sections[i - 1];

//       ScrollTrigger.create({
//         trigger: section,
//         start: 'top 30%',
//         onEnter: () => {
//           const bg = section.dataset['bgcolor'] || '#fff';
//           const text = section.dataset['textcolor'] || '#000';

//           // Smooth background
//           gsap.to(this.scrollContainer.nativeElement, {
//             backgroundColor: bg,
//             duration: 0.6,
//             ease: "power1.out",
//           });

//           // Change text color (header)
//           gsap.to(this, {
//             currentHeaderTextColor: text,
//             duration: 0.6,
//             ease: "power1.out",
//           });
//         },
//         onLeaveBack: () => {
//           if (prev) {
//             const bg = prev.dataset['bgcolor'] || '#fff';
//             const text = prev.dataset['textcolor'] || '#000';

//             gsap.to(this.scrollContainer.nativeElement, {
//               backgroundColor: bg,
//               duration: 0.6,
//               ease: "power1.out",
//             });

//             gsap.to(this, {
//               currentHeaderTextColor: text,
//               duration: 0.6,
//               ease: "power1.out",
//             });
//           }
//         },
//       });
//       ScrollTrigger.refresh();
//     });

//   }
// }

import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ApplicationRef } from '@angular/core';
import {
  Component,
  Inject,
  PLATFORM_ID,
  AfterViewInit,
  ViewChild,
  ElementRef,
} from '@angular/core';
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
  @ViewChild('scrollContainer', { static: true })
  scrollContainer!: ElementRef<HTMLDivElement>;
  currentHeaderTextColor: string = 'var(--primary)';
  currentBackgroundColor: string = '#ffffff';

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private appRef: ApplicationRef
  ) { }

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    this.appRef.isStable.subscribe((isStable) => {
      if (isStable) {
        this.setupGsapScroll();
      }
    });
  }

  setupGsapScroll(): void {
    const scrollBar = Scrollbar.init(this.scrollContainer.nativeElement, {
      damping: 0.06,
      alwaysShowTracks: false,
      delegateTo: document,
    });

    ScrollTrigger.defaults({ scroller: this.scrollContainer.nativeElement });

    ScrollTrigger.scrollerProxy(this.scrollContainer.nativeElement, {
      scrollTop(value?: number): number {
        if (value !== undefined) {
          scrollBar.scrollTop = value;
        }
        return scrollBar.scrollTop;
      },
    });

    scrollBar.addListener(ScrollTrigger.update);

    const sections = this.scrollContainer.nativeElement.querySelectorAll(
      '[data-bgcolor]'
    ) as NodeListOf<HTMLElement>;

    // Set initial background + header color
    const firstSection = sections[0];
    gsap.set(this.scrollContainer.nativeElement, {
      backgroundColor: firstSection.dataset['bgcolor'] || '#fff',
    });
    this.currentHeaderTextColor = firstSection.dataset['textcolor'] || '#000';
    this.currentBackgroundColor = firstSection.dataset['bgcolor'] || '#fff';

    sections.forEach((section, i) => {
      const prev = i === 0 ? null : sections[i - 1];

      ScrollTrigger.create({
        trigger: section,
        start: 'top 30%',
        onEnter: () => {
          const bg = section.dataset['bgcolor'] || '#fff';
          const text = section.dataset['textcolor'] || '#000';

          gsap.to(this.scrollContainer.nativeElement, {
            backgroundColor: bg,
            duration: 0.6,
            ease: 'power1.out',
          });

          gsap.to(this, {
            currentHeaderTextColor: text,
            currentBackgroundColor: bg,
            duration: 0.6,
            ease: 'power1.out',
          });

          gsap.fromTo(
            section,
            { opacity: 0 },
            { opacity: 1, duration: 0.8, ease: 'power1.out' }
          );
        },
        onLeaveBack: () => {
          if (prev) {
            const bg = prev.dataset['bgcolor'] || '#fff';
            const text = prev.dataset['textcolor'] || '#000';

            gsap.to(this.scrollContainer.nativeElement, {
              backgroundColor: bg,
              duration: 0.6,
              ease: 'power1.out',
            });

            gsap.to(this, {
              currentHeaderTextColor: text,
              currentBackgroundColor: bg,
              duration: 0.6,
              ease: 'power1.out',
            });
          }
        },
      });
    });

    ScrollTrigger.refresh();
  }
}
