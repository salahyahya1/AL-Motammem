// import { isPlatformBrowser } from '@angular/common';
// import { ApplicationRef, Component, Inject, NgZone, PLATFORM_ID } from '@angular/core';
// import gsap from 'gsap';
// import ScrollTrigger from 'gsap/ScrollTrigger';
// import SplitText from "gsap/SplitText";

// import { LanguageService } from '../../../shared/services/language.service';
// import { TranslatePipe } from '@ngx-translate/core';
// gsap.registerPlugin(ScrollTrigger, SplitText);

// @Component({
//   selector: 'app-section6',
//   templateUrl: './section6.component.html',
//   styleUrls: ['./section6.component.scss'],
//   imports: [TranslatePipe],
// })
// export class Section6Component {
//   constructor(
//     @Inject(PLATFORM_ID) private platformId: Object,
//     private appRef: ApplicationRef,
//     private ngZone: NgZone,
//     private language: LanguageService
//   ) { }

//   ngAfterViewInit() {
//     if (typeof window === 'undefined') return;
//     if (!isPlatformBrowser(this.platformId)) return;

//     this.ngZone.runOutsideAngular(() => {
//       requestAnimationFrame(() => {
//         setTimeout(() => {
//           this.runGsapAnimation()
//         }, 500);
//       });
//     });

//   }

//   private runGsapAnimation() {
//     document.fonts.ready.then(() => {
//       const title = document.querySelector('#integration-title') as HTMLElement;
//       const subtitle = document.querySelector('#integration-subtitle') as HTMLElement;
//       const desc = document.querySelector('#integration-desc') as HTMLElement;
//       const logos = document.querySelector('#integration-logos') as HTMLElement;

//       if (!title || !subtitle || !desc || !logos) return;

//       const titleSplit = SplitText.create(title, { type: 'words' });
//       const subtitleSplit = SplitText.create(subtitle, { type: 'words' });
//       const descSplit = SplitText.create(desc, { type: 'words' });


//       const tl = gsap.timeline({
//         defaults: { ease: "power3.out" }, scrollTrigger: {
//           trigger: "#section6",
//           start: 'top top',
//           end: "150% bottom",
//           pin: true,
//           anticipatePin: 1,
//           pinType: 'transform',
//         }
//       });

//       tl.fromTo(
//         titleSplit.words,
//         { opacity: 0, visibility: 'visible' },
//         {
//           opacity: 1,
//           y: 0,
//           duration: 0.4,
//           ease: 'sine.out',
//           stagger: 0.02,
//           onStart: () => { gsap.set(title, { opacity: 1, visibility: 'visible' }) },
//         }
//       );

//       tl.fromTo(
//         subtitleSplit.words,
//         { opacity: 0, visibility: 'visible' },
//         {
//           opacity: 1,
//           y: 0,
//           duration: 0.4,
//           ease: 'sine.out',
//           stagger: 0.02,
//           onStart: () => { gsap.set(subtitle, { opacity: 1, visibility: 'visible' }) },
//         }
//       );
//       tl.fromTo(
//         logos,
//         { opacity: 0 },
//         { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, '>'
//       );

//       tl.fromTo(
//         descSplit.words,
//         { opacity: 0, visibility: 'visible' },
//         {
//           opacity: 1,
//           y: 0,
//           duration: 0.4,
//           ease: 'sine.out',
//           stagger: 0.02,
//           onStart: () => { gsap.set(desc, { opacity: 1, visibility: 'visible' }) },
//         }
//       );
//     });
//   }
// }
import { isPlatformBrowser } from '@angular/common';
import { ApplicationRef, Component, Inject, NgZone, PLATFORM_ID } from '@angular/core';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import SplitText from "gsap/SplitText";

import { LanguageService } from '../../../shared/services/language.service';
import { TranslatePipe } from '@ngx-translate/core';
gsap.registerPlugin(ScrollTrigger, SplitText);

@Component({
  selector: 'app-section6',
  templateUrl: './section6.component.html',
  styleUrls: ['./section6.component.scss'],
  imports: [TranslatePipe],
})
export class Section6Component {
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private appRef: ApplicationRef,
    private ngZone: NgZone,
    private language: LanguageService
  ) { }

  ngAfterViewInit() {
    if (typeof window === 'undefined') return;
    if (!isPlatformBrowser(this.platformId)) return;

    this.ngZone.runOutsideAngular(() => {
      requestAnimationFrame(() => {
        setTimeout(() => {
          this.runGsapAnimation()
        }, 500);
      });
    });

  }

  private runGsapAnimation() {
    document.fonts.ready.then(() => {
      const title = document.querySelector('#integration-title') as HTMLElement;
      const subtitle = document.querySelector('#integration-subtitle') as HTMLElement;
      const desc = document.querySelector('#integration-desc') as HTMLElement;
      const logos = document.querySelector('#integration-logos') as HTMLElement;

      if (!title || !subtitle || !desc || !logos) return;

      const titleSplit = SplitText.create(title, { type: 'words' });
      const subtitleSplit = SplitText.create(subtitle, { type: 'words' });
      const descSplit = SplitText.create(desc, { type: 'words' });

      // ✅ MATCH MEDIA: pin فوق 700px فقط
      const mm = gsap.matchMedia();

      mm.add(
        {
          desktop: '(min-width: 768px)',
          mobile: '(max-width: 767px)',
        },
        (ctx) => {
          const { desktop, mobile } = (ctx.conditions || {}) as any;

          const tl = gsap.timeline({
            defaults: { ease: "power3.out" },
            scrollTrigger: {
              trigger: "#homeSection6",
              start: mobile ? 'top 85%' : 'top top',
              end: desktop ? "150% bottom" : 'bottom 95%',
              pin: desktop ? true : false,
              anticipatePin: 1,
              // markers: true,
              scrub: mobile ? true : false,
              pinType: 'transform',
              pinSpacing: mobile ? false : true,
              invalidateOnRefresh: true,
              onLeave: () => { if (mobile) tl.progress(1); },
              onLeaveBack: () => { if (mobile) tl.progress(0); },
            }
          });
          ScrollTrigger.refresh();
          setTimeout(() => window.dispatchEvent(new Event('pin-ready')), 0);


          tl.fromTo(
            titleSplit.words,
            { opacity: 0, visibility: 'visible' },
            {
              opacity: 1,
              y: 0,
              duration: 0.2,
              ease: 'sine.out',
              stagger: 0.02,
              onStart: () => { gsap.set(title, { opacity: 1, visibility: 'visible' }) },
            }
          );

          tl.fromTo(
            subtitleSplit.words,
            { opacity: 0, visibility: 'visible' },
            {
              opacity: 1,
              y: 0,
              duration: 0.2,
              ease: 'sine.out',
              stagger: 0.02,
              onStart: () => { gsap.set(subtitle, { opacity: 1, visibility: 'visible' }) },
            }
          );

          tl.fromTo(
            logos,
            { opacity: 0 },
            { opacity: 1, y: 0, duration: 0.2, ease: 'power2.out' }, '>'
          );

          tl.fromTo(
            descSplit.words,
            { opacity: 0, visibility: 'visible' },
            {
              opacity: 1,
              y: 0,
              duration: 0.2,
              ease: 'sine.out',
              stagger: 0.02,
              onStart: () => { gsap.set(desc, { opacity: 1, visibility: 'visible' }) },
            }
          );

          // ✅ cleanup لما المقاس يتغير (عشان مايتعملش duplicate triggers/timelines)
          return () => {
            tl.scrollTrigger?.kill();
            tl.kill();
            titleSplit?.revert?.();
            subtitleSplit?.revert?.();
            descSplit?.revert?.();
          };
        }
      );
    });
  }
}
