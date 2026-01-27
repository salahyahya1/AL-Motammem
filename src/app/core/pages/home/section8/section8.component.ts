
// import { isPlatformBrowser } from '@angular/common';
// import { ApplicationRef, Component, Inject, NgZone, PLATFORM_ID } from '@angular/core';
// import { RouterLink } from '@angular/router';
// import gsap from 'gsap';
// import ScrollTrigger from 'gsap/ScrollTrigger';
// import SplitText from "gsap/SplitText";
// gsap.registerPlugin(ScrollTrigger, SplitText);
// import { LanguageService } from '../../../shared/services/language.service';
// import { TranslatePipe } from '@ngx-translate/core';
// import { OpenFormDialogDirective } from '../../../shared/Directives/open-form-dialog.directive';

// @Component({
//   selector: 'app-section8',
//   imports: [RouterLink, TranslatePipe, OpenFormDialogDirective],
//   templateUrl: './section8.component.html',
//   styleUrl: './section8.component.scss'
// })
// export class Section8Component {
//   constructor(
//     @Inject(PLATFORM_ID) private platformId: Object,
//     private ngZone: NgZone,
//     private language: LanguageService
//   ) { }

//   section8TitleSplit: any;
//   section8DetailsSplit: any;

//   ngAfterViewInit() {
//     if (typeof window === 'undefined') return;
//     if (!isPlatformBrowser(this.platformId)) return;

//     requestAnimationFrame(() => {
//       this.ngZone.runOutsideAngular(() => {
//         setTimeout(() => {
//           this.runGsapAnimation();
//         }, 500);
//       });
//     });
//   }

//   private runGsapAnimation() {
//     document.fonts.ready.then(() => {
//       const section8Title = document.querySelector('#section8-title') as HTMLElement;
//       const section8Details = document.querySelector('#section8-details') as HTMLElement;
//       const section8button1 = document.querySelector('#section8-button1') as HTMLElement;
//       const section8button2 = document.querySelector('#section8-button2') as HTMLElement;
//       const screens = document.querySelector('.stack-wrap') as HTMLElement;

//       if (!section8Title || !section8Details || !section8button1 || !section8button2 || !screens) {
//         console.warn('⚠️ عناصر الـ section8 مش لاقيها SplitText');
//         return;
//       }

//       this.section8TitleSplit = new SplitText(section8Title, { type: "words" });
//       this.section8DetailsSplit = new SplitText(section8Details, { type: "words" });

//       // ✅ تحت 720: مفيش pin
//       ScrollTrigger.matchMedia({
//         "(min-width: 768px)": () => this.createTimeline(true, section8Title, section8Details, section8button1, section8button2, screens),
//         "(max-width: 767px)": () => this.createTimeline(false, section8Title, section8Details, section8button1, section8button2, screens),
//       });
//     });
//   }

//   private createTimeline(
//     pinEnabled: boolean,
//     section8Title: HTMLElement,
//     section8Details: HTMLElement,
//     section8button1: HTMLElement,
//     section8button2: HTMLElement,
//     screens: HTMLElement
//   ) {
//     const tl = gsap.timeline({
//       defaults: { ease: 'power3.out' },
//       scrollTrigger: {
//         trigger: '#section8',
//         start: 'top top',
//         end: "150% bottom",
//         pin: pinEnabled,          // ✅ الشرط هنا فقط
//         anticipatePin: 1,
//         pinSpacing: true,
//         // pinType: 'transform',
//       },
//     });

//     tl.fromTo(this.section8TitleSplit.words,
//       { opacity: 0, visibility: "visible" },
//       {
//         opacity: 1,
//         duration: 0.4,
//         ease: "sine.out",
//         stagger: 0.02,
//         onStart: () => { gsap.set(section8Title, { opacity: 1, visibility: "visible" }) },
//       }
//     );

//     tl.fromTo(this.section8DetailsSplit.words,
//       { opacity: 0, visibility: "visible" },
//       {
//         opacity: 1,
//         duration: 0.4,
//         ease: "sine.out",
//         stagger: 0.02,
//         onStart: () => { gsap.set(section8Details, { opacity: 1, visibility: "visible" }) },
//       }
//     );

//     tl.fromTo(screens,
//       { opacity: 0, visibility: "visible" },
//       {
//         opacity: 1,
//         duration: 0.6,
//         ease: "sine.inOut",
//         onStart: () => { gsap.set(screens, { opacity: 1, visibility: "visible" }) },
//       }
//     );

//     tl.fromTo(section8button1,
//       { opacity: 0, visibility: "visible" },
//       {
//         opacity: 1,
//         duration: 0.6,
//         ease: "sine.inOut",
//         onStart: () => { gsap.set(section8button1, { opacity: 1, visibility: "visible" }) },
//       }
//     );

//     tl.fromTo(section8button2,
//       { opacity: 0, visibility: "visible" },
//       {
//         opacity: 1,
//         duration: 0.6,
//         ease: "sine.inOut",
//         onStart: () => { gsap.set(section8button2, { opacity: 1, visibility: "visible" }) },
//       }
//     );

//     // ✅ cleanup تلقائيًا عند تغيير الميديا
//     return () => {
//       tl.scrollTrigger?.kill();
//       tl.kill();
//       this.section8TitleSplit?.revert?.();
//       this.section8DetailsSplit?.revert?.();
//     };
//   }
// }
import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, NgZone, PLATFORM_ID } from '@angular/core';
import { RouterLink } from '@angular/router';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import SplitText from "gsap/SplitText";
gsap.registerPlugin(ScrollTrigger, SplitText);
import { LanguageService } from '../../../shared/services/language.service';
import { TranslatePipe } from '@ngx-translate/core';
import { OpenFormDialogDirective } from '../../../shared/Directives/open-form-dialog.directive';

@Component({
  selector: 'app-section8',
  imports: [RouterLink, TranslatePipe, OpenFormDialogDirective],
  templateUrl: './section8.component.html',
  styleUrl: './section8.component.scss'
})
export class Section8Component {
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private ngZone: NgZone,
    private language: LanguageService
  ) { }

  private section8TitleSplit: any;
  private section8DetailsSplit: any;
  private mm?: gsap.MatchMedia;

  ngAfterViewInit() {
    if (typeof window === 'undefined') return;
    if (!isPlatformBrowser(this.platformId)) return;

    requestAnimationFrame(() => {
      this.ngZone.runOutsideAngular(() => {
        setTimeout(() => {
          this.runGsapAnimation();
        }, 500);
      });
    });
  }

  private runGsapAnimation() {
    document.fonts.ready.then(() => {
      const section8Title = document.querySelector('#section8-title') as HTMLElement;
      const section8Details = document.querySelector('#section8-details') as HTMLElement;
      const section8button1 = document.querySelector('#section8-button1') as HTMLElement;
      const section8button2 = document.querySelector('#section8-button2') as HTMLElement;
      const screens = document.querySelector('.stack-wrap') as HTMLElement;

      if (!section8Title || !section8Details || !section8button1 || !section8button2 || !screens) {
        console.warn('⚠️ عناصر الـ section8 مش لاقيها');
        return;
      }

      // ✅ SplitText مرة واحدة
      this.section8TitleSplit = new SplitText(section8Title, { type: "words" });
      this.section8DetailsSplit = new SplitText(section8Details, { type: "words" });

      // ✅ MatchMedia (أفضل من ScrollTrigger.matchMedia)
      this.mm = gsap.matchMedia();
      this.mm.add(
        {
          desktop: "(min-width: 768px)",
          mobile: "(max-width: 767px)",
        },
        (ctx) => {
          const { desktop, mobile } = (ctx.conditions || {}) as any;

          return this.createTimeline(
            !!desktop,
            !!mobile,
            section8Title,
            section8Details,
            section8button1,
            section8button2,
            screens
          );
        }
      );
    });
  }

  private createTimeline(
    isDesktop: boolean,
    isMobile: boolean,
    section8Title: HTMLElement,
    section8Details: HTMLElement,
    section8button1: HTMLElement,
    section8button2: HTMLElement,
    screens: HTMLElement
  ) {
    gsap.set([section8Title, section8Details, section8button1, section8button2, screens], { autoAlpha: 0 });

    const tl = gsap.timeline({
      defaults: { ease: 'power3.out' },
      scrollTrigger: {
        trigger: '#homeSection8',

        start: isMobile ? 'top 85%' : 'top top',

        end: isMobile ? 'top 95%' : "150% bottom",
        markers: false,
        pin: true,
        pinType: 'transform',
        anticipatePin: 1,
        id: 'section8',
        pinSpacing: isMobile ? true : true,

        invalidateOnRefresh: true,

        onLeave: () => {
          if (isMobile) tl.progress(1);
        },
        // onLeaveBack: () => {
        //   if (isMobile) tl.progress(0);
        // },

        // markers: true,
      },
    });
    ScrollTrigger.refresh();
    setTimeout(() => window.dispatchEvent(new Event('pin-ready')), 0);


    tl.fromTo(
      this.section8TitleSplit.words,
      { autoAlpha: 0 },
      {
        autoAlpha: 1,
        duration: 0.2,
        ease: "sine.out",
        stagger: 0.02,
        onStart: () => { gsap.set(section8Title, { autoAlpha: 1 }) },
      }
    );

    tl.fromTo(
      this.section8DetailsSplit.words,
      { autoAlpha: 0 },
      {
        autoAlpha: 1,
        duration: 0.2,
        ease: "sine.out",
        stagger: 0.02,
        onStart: () => { gsap.set(section8Details, { autoAlpha: 1 }) },
      },
      '>-0.15'
    );

    tl.fromTo(
      screens,
      { autoAlpha: 0 },
      { autoAlpha: 1, duration: 0.2, ease: "sine.inOut" },
      '>-0.1'
    );

    tl.fromTo(
      section8button1,
      { autoAlpha: 0 },
      { autoAlpha: 1, duration: 0.2, ease: "sine.inOut" },
      '>-0.1'
    );

    tl.fromTo(
      section8button2,
      { autoAlpha: 0 },
      { autoAlpha: 1, duration: 0.2, ease: "sine.inOut" },
      '<'
    );

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }
  get isRtl() {
    return this.language.currentLang === 'ar';
  }
  ngOnDestroy() {
    // ✅ clean triggers
    this.mm?.revert();

    // ✅ clean split
    this.section8TitleSplit?.revert?.();
    this.section8DetailsSplit?.revert?.();
  }
}
