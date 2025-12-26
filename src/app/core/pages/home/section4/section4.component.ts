
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

//         const mm = gsap.matchMedia();

//         mm.add(
//           {
//             desktop: '(min-width: 768px)',
//             mobile: '(max-width: 767px)',
//           },
//           (ctx) => {
//             const { desktop, mobile } = (ctx.conditions || {}) as any;

//             const tl = gsap.timeline({
//               defaults: { ease: "power3.out" },
//               scrollTrigger: {
//                 trigger: "#section4",
//                 start: 'top top',

//                 // ✅ الديسكتوب زي ما هو
//                 // ✅ الموبايل: pin بسيط جدًا (مسافة قصيرة)
//                 end: desktop ? "140% bottom" : "top 5%",

//                 // ✅ خلي pin شغال في الحالتين
//                 pin: true,

//                 // ✅ على الموبايل نخليه أخف
//                 // scrub: false,
//                 anticipatePin: mobile ? 0 : 1,
//                 pinType: 'transform',

//                 // ✅ اختياري: يقلل الإحساس بالـ pin (جرّبه لو مناسب لتصميمك)
//                 pinSpacing: mobile ? false : true,

//                 // markers: true
//               }
//             });

//             tl.to("#Text1", {
//               opacity: 1,
//               y: 0,
//               duration: 0.8,
//             });

//             tl.to(".card", {
//               opacity: 1,
//               visibility: "visible",
//               x: 0,
//               duration: 0.8,
//               stagger: 0.20,
//             }, "-1.5");

//             tl.to("#Text2", {
//               opacity: 1,
//               y: 0,
//               duration: 0.8,
//             });

//             // ✅ مهم بعد الحسابات (خصوصًا للموبايل)
//             // ScrollTrigger.refresh();

//             return () => {
//               tl.scrollTrigger?.kill();
//               tl.kill();
//             };
//           }
//         );

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
  mobile!: boolean;
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private appRef: ApplicationRef,
    private ngZone: NgZone,
    private language: LanguageService
  ) {
    if (typeof window === 'undefined') return;
    this.mobile = window.innerWidth < 768;
  }

  ngAfterViewInit() {
    if (typeof window === 'undefined') return;
    if (!isPlatformBrowser(this.platformId)) return;

    requestAnimationFrame(() => {
      setTimeout(() => {

        this.mobile = window.innerWidth < 768;

        const mm = gsap.matchMedia();

        mm.add(
          {
            desktop: '(min-width: 768px)',
            mobile: '(max-width: 767px)',
          },
          (ctx) => {
            const { desktop, mobile } = (ctx.conditions || {}) as any;

            // =========================
            // ✅ DESKTOP (زي ما هو)
            // =========================
            if (desktop) {
              const tl = gsap.timeline({
                defaults: { ease: "power3.out" },
                scrollTrigger: {
                  trigger: "#section4",
                  start: "top top",
                  end: "140% bottom",
                  pin: true,
                  pinType: "transform",
                  anticipatePin: 1,
                  pinSpacing: true,
                  invalidateOnRefresh: true,
                  // markers: true,
                },
              });

              // 👇 أنيميشن الديسكتوب (سيبه زي ما عندك)
              tl.to("#Text1", { opacity: 1, y: 0, duration: 0.8 });
              tl.to(".card", {
                opacity: 1,
                visibility: "visible",
                x: 0,
                duration: 0.8,
                stagger: 0.2,
              }, "-=1.5");
              tl.to("#Text2", { opacity: 1, y: 0, duration: 0.8 });

              return () => {
                tl.scrollTrigger?.kill();
                tl.kill();
              };
            }

            // =========================
            // ✅ MOBILE (لوحده)
            // =========================
            if (mobile) {
              // 1) Timeline يتبني بس يبقى paused
              const tl = gsap.timeline({
                defaults: { ease: "power3.out" },
                paused: true,
              });

              // 👇 نفس أنيميشن السكشن
              tl.to("#Text1", { opacity: 1, y: 0, duration: 0.8 });
              tl.to(".card", {
                opacity: 1,
                visibility: "visible",
                x: 0,
                duration: 0.8,
                stagger: 0.2,
              }, "-=1.5");
              tl.to("#Text2", { opacity: 1, y: 0, duration: 0.8 });

              // 2) Trigger بدري (بدون pin) عشان لو اليوزر سكرول سريع
              const earlyST = ScrollTrigger.create({
                trigger: "#section4",
                start: "top 95%",     // بدري جدًا (قبل ما يدخل)
                once: true,
                onEnter: () => tl.play(),
                id: 'earlyST',
                // markers: true,
              });

              // 3) Pin صغير + طبيعي (يبدأ من top top فقط عشان مفيش حركة/قفزة)
              const pinST = ScrollTrigger.create({
                trigger: "#section4",
                start: "top top",
                end: "+=220",          // pin صغير جدًا
                pin: true,
                pinType: "transform",  // لو iOS عمل نتشة خلّيه "fixed"
                anticipatePin: 1,
                id: 'pinST',
                pinSpacing: true,
                invalidateOnRefresh: true,
                // markers: true,
                onLeave: () => tl.progress(1),
                onLeaveBack: () => tl.progress(0),
              });

              ScrollTrigger.refresh();

              return () => {
                earlyST.kill();
                pinST.kill();
                tl.kill();
              };
            }

            return () => { };
          }
        );


      }, 500);
    });
  }

  get isRtl() {
    return this.language.currentLang === 'ar';
  }
}
