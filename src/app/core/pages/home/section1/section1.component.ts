import { isPlatformBrowser } from '@angular/common';
import { ApplicationRef, Component, Inject, NgZone, PLATFORM_ID, ViewEncapsulation } from '@angular/core';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { SplitText } from "gsap/SplitText";
gsap.registerPlugin(ScrollTrigger, SplitText);
@Component({
  selector: 'app-section1',
  templateUrl: './section1.component.html',
  styleUrl: './section1.component.scss',
  imports: [],
})
export class Section1Component {
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private appRef: ApplicationRef,
    private ngZone: NgZone

  ) { }
  ngAfterViewInit() {
    if (typeof window === 'undefined') return;

    if (!isPlatformBrowser(this.platformId)) return;
    requestAnimationFrame(() => {
      // document.fonts.ready.then(() => {
      //   const heroTitle = document.querySelector('h1#hero-title') as HTMLElement;
      //   const heroSubtitle = document.querySelector('#hero-subtitle') as HTMLElement;
      //   const heroDetails = document.querySelector('#hero-details') as HTMLElement;
      //   const button1 = document.querySelector('#button1') as HTMLElement;
      //   const button2 = document.querySelector('#button2') as HTMLElement;
      //   const heroTitleSplit = SplitText.create(heroTitle, {
      //     type: "words",
      //   });
      //   const heroSubtitleSplit = SplitText.create(heroSubtitle, {
      //     type: "words",
      //   });
      //   const heroDetailsSplit = SplitText.create(heroDetails, {
      //     type: "words",
      //   });
      //   const buttons = [button1, button2];
      //   gsap.fromTo(heroTitleSplit.words, {
      //     opacity: 0,
      //     visibility: "visible"
      //   }, {
      //     opacity: 1,
      //     duration: 0.8,
      //     ease: "sine.out",
      //     stagger: 0.2,
      //     onStart: () => { gsap.set(heroTitle, { opacity: 1, visibility: "visible" }) },
      //     onComplete: () => {
      //       gsap.fromTo(heroSubtitleSplit.words, {
      //         opacity: 0,
      //         visibility: "visible"
      //       }, {
      //         opacity: 1,
      //         duration: 0.8,
      //         ease: "sine.out",
      //         stagger: 0.2,
      //         onStart: () => { gsap.set(heroSubtitle, { opacity: 1, visibility: "visible" }) },
      //         onComplete: () => {
      //           gsap.fromTo(heroDetailsSplit.words, {
      //             opacity: 0,
      //             visibility: "visible"
      //           }, {
      //             opacity: 1,
      //             duration: 0.8,
      //             ease: "sine.out",
      //             stagger: 0.1,
      //             onStart: () => { gsap.set(heroDetails, { opacity: 1, visibility: "visible" }) },
      //             onComplete: () => {
      //               gsap.fromTo(button1, {
      //                 opacity: 0,
      //                 visibility: "visible"
      //               }, {
      //                 opacity: 1,
      //                 duration: 0.7,
      //                 stagger: 0.1,
      //                 onStart: () => { gsap.set(button1, { opacity: 1, visibility: "visible" }) },
      //               })
      //               gsap.fromTo(button2, {
      //                 opacity: 0,
      //                 visibility: "visible"
      //               }, {
      //                 opacity: 1,
      //                 duration: 0.8,
      //                 onStart: () => { gsap.set(button2, { opacity: 1, visibility: "visible" }) },
      //               })
      //             }
      //           });
      //         }
      //       });
      //     }
      //   });



      // });
      this.ngZone.onStable.subscribe(() => {
        requestAnimationFrame(() => {
          setTimeout(() => {
            this.runGsapAnimation();
          }, 0);
        });
      });
    });

  }
  private runGsapAnimation() {
    document.fonts.ready.then(() => {
      const heroTitle = document.querySelector('h1#hero-title') as HTMLElement;
      const heroSubtitle = document.querySelector('#hero-subtitle') as HTMLElement;
      const heroDetails = document.querySelector('#hero-details') as HTMLElement;
      const button1 = document.querySelector('#button1') as HTMLElement;
      const button2 = document.querySelector('#button2') as HTMLElement;
      if (!heroTitle || !heroSubtitle || !heroDetails || !button1 || !button2) {
        console.warn('⚠️ عناصر الـ hero مش لاقيها SplitText');
        return;
      }

      const heroTitleSplit = SplitText.create(heroTitle, { type: "words" });
      const heroSubtitleSplit = SplitText.create(heroSubtitle, { type: "words" });
      const heroDetailsSplit = SplitText.create(heroDetails, { type: "words" });


      const tl = gsap.timeline();

      tl.fromTo(heroTitleSplit.words,
        { opacity: 0, visibility: "visible" },
        {
          opacity: 1,
          duration: 0.8,
          ease: "sine.out",
          stagger: 0.2,
          onStart: () => { gsap.set(heroTitle, { opacity: 1, visibility: "visible" }) },
        }
      );

      tl.fromTo(heroSubtitleSplit.words,
        { opacity: 0, visibility: "visible" },
        {
          opacity: 1,
          duration: 0.8,
          ease: "sine.out",
          stagger: 0.2,
          onStart: () => { gsap.set(heroSubtitle, { opacity: 1, visibility: "visible" }) },
        }
      );

      tl.fromTo(heroDetailsSplit.words,
        { opacity: 0, visibility: "visible" },
        {
          opacity: 1,
          duration: 0.8,
          ease: "sine.out",
          stagger: 0.1,
          onStart: () => { gsap.set(heroDetails, { opacity: 1, visibility: "visible" }) },
        }
      );


      tl.fromTo(button1,
        { opacity: 0, visibility: "visible" },
        {
          opacity: 1,
          duration: 1.2,
          ease: "sine.inOut",
          onStart: () => { gsap.set(button1, { opacity: 1, visibility: "visible" }) },
        }
      );

      tl.fromTo(button2,
        { opacity: 0, visibility: "visible" },
        {
          opacity: 1,
          duration: 1.2,
          ease: "sine.inOut",
          onStart: () => { gsap.set(button2, { opacity: 1, visibility: "visible" }) },
        }
      );
    });
  }
}
