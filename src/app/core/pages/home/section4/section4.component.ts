// import { isPlatformBrowser } from '@angular/common';
// import { ApplicationRef, Component, Inject, NgZone, PLATFORM_ID } from '@angular/core';
// import gsap from 'gsap';
// import ScrollTrigger from 'gsap/ScrollTrigger';
// import { LanguageService } from '../../../shared/services/language.service';
// import { TranslatePipe } from '@ngx-translate/core';
// import { OpenFormDialogDirective } from '../../../shared/Directives/open-form-dialog.directive';

// gsap.registerPlugin(ScrollTrigger);

// @Component({
//   selector: 'app-section4',
//   imports: [OpenFormDialogDirective, TranslatePipe],
//   templateUrl: './section4.component.html',
//   styleUrl: './section4.component.scss'
// })
// export class Section4Component {
//   constructor(
//     @Inject(PLATFORM_ID) private platformId: Object,
//     private appRef: ApplicationRef,
//     private ngZone: NgZone,
//     private language: LanguageService

//   ) { }
//   ngAfterViewInit() {
//     if (typeof window === 'undefined') return;

//     if (!isPlatformBrowser(this.platformId)) return;
//     requestAnimationFrame(() => {
//       setTimeout(() => {
//         const tl = gsap.timeline({
//           defaults: { ease: "power3.out" },
//           scrollTrigger: {
//             trigger: "#section4",
//             start: 'top top',
//             end: "140% bottom",
//             pin: true,
//             anticipatePin:1,
//             pinType: 'transform',
//             // markers: true
//           }
//         });

//         tl.to("#Text1", {
//           opacity: 1,
//           y: 0,
//           duration: 0.8,
//         });

//         tl.to(".card", {
//           opacity: 1,
//           visibility: "visible",
//           x: 0,
//           duration: 0.8,
//           stagger: 0.20,
//         }, "-1.5");
//         tl.to("#Text2", {
//           opacity: 1,
//           y: 0,
//           duration: 0.8,
//         });
//       }, 500);
//     });


//   }
//   get isRtl() {
//     return this.language.currentLang === 'ar';
//   }
// }
import { isPlatformBrowser } from '@angular/common';
import { ApplicationRef, Component, Inject, NgZone, PLATFORM_ID } from '@angular/core';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { LanguageService } from '../../../shared/services/language.service';
import { TranslatePipe } from '@ngx-translate/core';
import { OpenFormDialogDirective } from '../../../shared/Directives/open-form-dialog.directive';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-section4',
  imports: [OpenFormDialogDirective, TranslatePipe],
  templateUrl: './section4.component.html',
  styleUrl: './section4.component.scss'
})
export class Section4Component {
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private appRef: ApplicationRef,
    private ngZone: NgZone,
    private language: LanguageService
  ) { }

  ngAfterViewInit() {
    if (typeof window === 'undefined') return;
    if (!isPlatformBrowser(this.platformId)) return;

    requestAnimationFrame(() => {
      setTimeout(() => {

        const mm = gsap.matchMedia();

        mm.add(
          {
            desktop: '(min-width: 721px)',
            mobile: '(max-width: 720px)',
          },
          (ctx) => {
            const { desktop, mobile } = (ctx.conditions || {}) as any;

            const tl = gsap.timeline({
              defaults: { ease: "power3.out" },
              scrollTrigger: {
                trigger: "#section4",
                start: 'top top',

                // ✅ الديسكتوب زي ما هو
                // ✅ الموبايل: pin بسيط جدًا (مسافة قصيرة)
                end: desktop ? "140% bottom" : "top 5%",

                // ✅ خلي pin شغال في الحالتين
                pin: true,

                // ✅ على الموبايل نخليه أخف
                scrub: false,
                anticipatePin: mobile ? 0 : 1,
                pinType: 'transform',

                // ✅ اختياري: يقلل الإحساس بالـ pin (جرّبه لو مناسب لتصميمك)
                pinSpacing: mobile ? false : true,

                // markers: true
              }
            });

            tl.to("#Text1", {
              opacity: 1,
              y: 0,
              duration: 0.8,
            });

            tl.to(".card", {
              opacity: 1,
              visibility: "visible",
              x: 0,
              duration: 0.8,
              stagger: 0.20,
            }, "-1.5");

            tl.to("#Text2", {
              opacity: 1,
              y: 0,
              duration: 0.8,
            });

            // ✅ مهم بعد الحسابات (خصوصًا للموبايل)
            ScrollTrigger.refresh();

            return () => {
              tl.scrollTrigger?.kill();
              tl.kill();
            };
          }
        );

      }, 500);
    });
  }

  get isRtl() {
    return this.language.currentLang === 'ar';
  }
}
