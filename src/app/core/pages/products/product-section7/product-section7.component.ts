import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ApplicationRef, ChangeDetectorRef, Component, ElementRef, Inject, NgZone, PLATFORM_ID, QueryList, ViewChild, ViewChildren, ViewEncapsulation } from '@angular/core';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { Draggable } from "gsap/all";
import InertiaPlugin from "gsap/InertiaPlugin";

import SplitText from "gsap/SplitText";


import { TranslatePipe } from '@ngx-translate/core';
import { LanguageService } from '../../../shared/services/language.service';
import { RemiveRoleAriaService } from '../../../shared/services/removeRoleAria';

gsap.registerPlugin(ScrollTrigger, SplitText, Draggable, InertiaPlugin);

@Component({
  selector: 'app-product-section7',
  imports: [CommonModule, TranslatePipe],
  templateUrl: './product-section7.component.html',
  styleUrl: './product-section7.component.scss'
})
export class ProductSection7Component {
  constructor(
    @Inject(PLATFORM_ID) private pid: Object,
    private ngZone: NgZone,
    private language: LanguageService,
    private RemiveRoleAriaService: RemiveRoleAriaService,
  ) { }

  // ngAfterViewInit() {
  //   if (!isPlatformBrowser(this.pid)) return;
  //   if (typeof window === 'undefined') return;

  //   this.ngZone.runOutsideAngular(() => {
  //     requestAnimationFrame(() => {
  //       setTimeout(() => {

  //         const mm = gsap.matchMedia();

  //         const setupCapsuleAnimation = (
  //           capsuleSelector: string,
  //           titleSelector: string
  //         ) => {
  //           const titleEl = document.querySelector(titleSelector) as HTMLElement | null;
  //           if (!titleEl) return;

  //           // SplitText للكلام
  //           const split = SplitText.create(titleEl, { type: "words" });
  //           this.RemiveRoleAriaService.cleanA11y(titleEl, split);

  //           // نختار الـ rect جوّه الكبسولة الحالية بس
  //           const path = document.querySelector(
  //             `${capsuleSelector} .capsule-path7`
  //           ) as any; // SVGRectElement | SVGGeometryElement
  //           if (!path) return;

  //           const length = path.getTotalLength();

  //           // ScrollTrigger للـ pin (مرة واحدة لكل ميديا)
  //           ScrollTrigger.create({
  //             trigger: '#productsSection7',
  //             start: 'top top',
  //             end: "150% bottom",
  //             pin: true,
  //             pinType: 'transform',
  //             // markers: true,
  //             id: `pinsection-${capsuleSelector}`,
  //             anticipatePin: 1,
  //           });

  //           const tl = gsap.timeline({
  //             defaults: { ease: "power3.out" },
  //             scrollTrigger: {
  //               trigger: "#productsSection7",
  //               start: 'top top',
  //               end: "150% bottom",
  //               // markers: true,
  //             }
  //           });

  //           // وضعية البداية للكبسولة
  //           gsap.set(capsuleSelector, { y: 78 });
  //           gsap.set(titleSelector, { perspective: 800 });

  //           // رسم حدود الكبسولة
  //           tl.fromTo(
  //             path,
  //             {
  //               strokeDasharray: length,
  //               strokeDashoffset: length,
  //               opacity: 0,
  //               visibility: "hidden"
  //             },
  //             {
  //               strokeDashoffset: 0,
  //               opacity: 1,
  //               visibility: "visible",
  //               duration: 1,
  //               ease: "power2.inOut"
  //             }
  //           );

  //           // ظهور الكلمات واحدة واحدة
  //           tl.fromTo(
  //             split.words,
  //             {
  //               opacity: 0,
  //               rotateY: gsap.utils.random(-80, 80),
  //               filter: "blur(6px)"
  //             },
  //             {
  //               opacity: 1,
  //               rotateY: 0,
  //               y: 0,
  //               filter: "blur(0px)",
  //               duration: 0.4,
  //               stagger: {
  //                 each: 0.15,
  //                 from: "start"
  //               }
  //             }
  //           );

  //           // تصغير خفيف للكبسولة + تغيير خلفية السكشن
  //           tl.to(
  //             capsuleSelector,
  //             {
  //               scale: 1,
  //               duration: 0.6,
  //               ease: "power2.inOut",
  //               onStart: () => {
  //                 gsap.to('#productsSection7', {
  //                   backgroundColor: '#ffffff',
  //                   duration: 0.8,
  //                   ease: "power2.inOut"
  //                 });
  //               }
  //             },
  //             ">+0.3"
  //           );

  //           // تحريك الكبسولة لتحت سنة
  //           tl.to(
  //             capsuleSelector,
  //             {
  //               y: 12,
  //               duration: 0.7,
  //               ease: "power2.inOut",
  //             },
  //             ">-0.4"
  //           );
  //         };

  //         // 📱 أقل من 1280px → الكبسولة الأصلية
  //         mm.add("(max-width: 1279px)", () => {
  //           setupCapsuleAnimation("#capsule7", "#productsSection7-TITLE");
  //         });

  //         // 💻 من 1280px فأعلى → الكبسولة الكبيرة
  //         mm.add("(min-width: 1280px)", () => {
  //           setupCapsuleAnimation("#capsule7-xl", "#productsSection7-TITLE-xl");
  //         });

  //       }, 200);
  //     });
  //   });
  // }
  ngAfterViewInit() {
    if (!isPlatformBrowser(this.pid)) return;
    if (typeof window === 'undefined') return;

    this.ngZone.runOutsideAngular(() => {
      requestAnimationFrame(() => {
        setTimeout(() => {

          const mm = gsap.matchMedia();

          mm.add({
            desktop: '(min-width: 768px)',
            mobile: '(max-width: 767px)',
          }, (context) => {
            let { desktop, mobile } = context.conditions as any;

            const capsuleSelector = ".capsule-products7-wrap";
            const titleSelector = "#productsSection7-TITLE";
            const endScale = 0.9;

            const titleEl = document.querySelector(titleSelector) as HTMLElement | null;
            if (!titleEl) return;

            const split = SplitText.create(titleEl, { type: "words" });
            this.RemiveRoleAriaService.cleanA11y(titleEl, split);

            const path = document.querySelector(
              `${capsuleSelector} .capsule-path7`
            ) as any;
            if (!path) return;

            const length = path.getTotalLength();

            // ScrollTrigger.create({
            //   trigger: '#productsSection7',
            //   start: 'top top',
            //   end: mobile ? 'bottom bottom' : "150% bottom",
            //   pin: mobile ? false : true,
            //   pinType: 'transform',
            //   id: `pinsection-products7`,
            //   anticipatePin: 1,
            //   onLeave: () => { if (mobile) tl.progress(1); },
            //   // onEnterBack: () => { if (mobile) tl.progress(0); },
            // });
            const targets = [capsuleSelector, "#productsSection7Bottom"];
            const tl = gsap.timeline({
              defaults: { ease: "power3.out" },
              scrollTrigger: {
                trigger: "#productsSection7",
                start: 'top top',
                end: mobile ? 'bottom bottom' : "150% bottom",
                pin: mobile ? false : true,
                pinType: 'transform',
                id: `pinsection-products7`,
                anticipatePin: 1,
                onLeave: () => { if (mobile) tl.progress(1); },
              }
            });
            gsap.set(capsuleSelector, { y: 78, scale: 0.9 });
            gsap.set(titleSelector, { perspective: 800, visibility: "visible", opacity: 1 });

            tl.fromTo(
              path,
              {
                strokeDasharray: length,
                strokeDashoffset: length,
                opacity: 0,
                visibility: "hidden"
              },
              {
                strokeDashoffset: 0,
                opacity: 1,
                visibility: "visible",
                duration: 1,
                ease: "power2.inOut"
              }
            );

            if (mobile) {
              // Mobile Lite Animation
              tl.fromTo(
                split.words,
                {
                  opacity: 0,
                  y: 20,
                  filter: "blur(2px)"
                },
                {
                  opacity: 1,
                  y: 0,
                  filter: "blur(0px)",
                  duration: 0.6,
                  stagger: 0.1
                }
              );
            } else {
              // Desktop Original Animation
              tl.fromTo(
                split.words,
                {
                  opacity: 0,
                  rotateY: gsap.utils.random(-80, 80),
                  filter: "blur(6px)"
                },
                {
                  opacity: 1,
                  rotateY: 0,
                  y: 0,
                  filter: "blur(0px)",
                  duration: 0.4,
                  stagger: {
                    each: 0.15,
                    from: "start"
                  }
                }
              );
            }

            tl.to(
              capsuleSelector,
              {
                scale: endScale,
                duration: 0.6,
                ease: "power2.inOut",
                onStart: () => {
                  gsap.to('#productsSection7', {
                    backgroundColor: '#ffffff',
                    duration: 0.8,
                    ease: "power2.inOut"
                  });
                }
              },
              ">+0.3"
            );

            tl.to(
              capsuleSelector,
              {
                y: mobile ? -40 : -60,
                duration: 0.7,
                ease: "power2.inOut",
              },
              ">-0.4"
            );

            tl.fromTo("#productsSection7Bottom",
              { opacity: 0, y: mobile ? 50 : 100 },
              {
                opacity: 1,
                y: mobile ? 0 : 0,
                ease: "sine.out",
                stagger: 0.1,
              }, "<+0.5"
            );

            return () => {
              if (split) split.revert();
            };

          });

        }, 200);
      });
    });
  }

}
