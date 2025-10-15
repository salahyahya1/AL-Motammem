// import { isPlatformBrowser } from '@angular/common';
// import { ApplicationRef, Component, Inject, NgZone, PLATFORM_ID, ViewEncapsulation } from '@angular/core';
// import gsap from 'gsap';
// import ScrollTrigger from 'gsap/ScrollTrigger';
// import { SplitText } from "gsap/SplitText";
// gsap.registerPlugin(ScrollTrigger, SplitText);
// @Component({
//   selector: 'app-section2',
//   imports: [],
//   templateUrl: './section2.component.html',
//   styleUrls: ['./section2.component.scss'],

// })
// export class Section2Component {
//   constructor(
//     @Inject(PLATFORM_ID) private platformId: Object,
//     private appRef: ApplicationRef,
//     private ngZone: NgZone

//   ) { }
//   ngAfterViewInit() {
//     if (!isPlatformBrowser(this.platformId)) return;

//     this.ngZone.runOutsideAngular(() => {
//       requestAnimationFrame(() => {
//         document.fonts.ready.then(() => {
//           const section = document.querySelector('#stats-section') as HTMLElement;
//           const triggerEl = (document.querySelector('#section2') as HTMLElement) || section;
//           if (!section) return;

//           const rows = Array.from(section.querySelectorAll('.stat-row')) as HTMLElement[];
//           if (!rows.length) return;

//           rows.forEach(row => {
//             const c = row.querySelector('.counter') as HTMLElement | null;
//             if (c) c.textContent = '0';
//           });
//           const animateCounter = (el: HTMLElement, to: number, duration = 1.4, decimals = 0) => {
//             const obj = { val: 0 };
//             gsap.to(obj, {
//               val: to,
//               duration,
//               ease: 'power3.out',
//               onUpdate: () => {
//                 el.textContent = obj.val.toFixed(decimals);
//               },
//             });
//           };
//           rows.forEach(row => {
//             const labelEl = row.querySelector('.label') as HTMLElement | null;
//             if (labelEl) {
//               const sLabel = SplitText.create(labelEl, { type: 'words', aria: 'hidden' });
//               gsap.set(sLabel.words, { opacity: 0 });
//               (labelEl as any)._splitWords = sLabel.words;
//             }
//           });
//           rows.forEach(row => {
//             const numEl = row.querySelector('.num') as HTMLElement | null;
//             if (numEl) {
//               gsap.set(numEl, { opacity: 0 });
//             }
//           });
//           const tl = gsap.timeline({
//             defaults: { ease: 'power3.out' },
//             scrollTrigger: {
//               trigger: triggerEl || section,
//               start: 'top 20%',
//               end: 'bottom 100%',
//               toggleActions: 'play none none none',
//               once: true,
//               markers: true,
//             },
//           });
//           const head = document.querySelector('#Text1') as HTMLElement | null;
//           if (head) {
//             const splitHead = SplitText.create(head, { type: 'words' });
//             gsap.set(splitHead.words, { opacity: 0, y: 10 });
//             tl.fromTo(
//               splitHead.words,
//               { opacity: 0, y: 10 },
//               { opacity: 1, y: 0, duration: 0.7, stagger: 0.15 },
//               0
//             );
//           }
//           rows.forEach((row, i) => {
//             const labelEl = row.querySelector('.label') as HTMLElement | null;
//             const numEl = row.querySelector('.num') as HTMLElement | null;
//             const counterEl = row.querySelector('.counter') as HTMLElement | null;
//             const labelWords = (labelEl && (labelEl as any)._splitWords) || null;

//             const rowPos = i === 0 ? '>' : `>+0.35`;
//             const rowTL = gsap.timeline();
//             if (labelWords) {
//               rowTL.to(
//                 labelWords,
//                 {
//                   opacity: 1,
//                   duration: 1.3,
//                   ease: 'sine.out',
//                   stagger: { each: 0.08, from: 'start' },
//                 },
//                 0
//               );
//             }
//             if (numEl && counterEl) {
//               rowTL.to(
//                 numEl,
//                 {
//                   opacity: 1,
//                   duration: 1.3,
//                   ease: 'power2.out',
//                   onStart: () => {
//                     const target = Number(counterEl.getAttribute('data-target') ?? 0);
//                     const decimals = target % 1 !== 0 ? 1 : 0;
//                     animateCounter(counterEl, target, 1.4, decimals);
//                   },
//                 },
//                 0
//               );
//             }

//             tl.add(rowTL, rowPos);
//           });
//           const cta = section.querySelector('.cta-btn') as HTMLElement | null;
//           if (cta) {
//             gsap.set(cta, { opacity: 0 });
//             tl.to(cta, { opacity: 1, duration: 0.8, ease: 'power2.out' }, '>-0.2');
//           }
//         });
//       });
//     });
//   }
// }

// import { isPlatformBrowser } from '@angular/common';
// import { ApplicationRef, Component, Inject, NgZone, PLATFORM_ID } from '@angular/core';
// import gsap from 'gsap';
// import ScrollTrigger from 'gsap/ScrollTrigger';
// import { SplitText } from 'gsap/SplitText';
// gsap.registerPlugin(ScrollTrigger, SplitText);

// @Component({
//   selector: 'app-section2',
//   imports: [],
//   templateUrl: './section2.component.html',
//   styleUrls: ['./section2.component.scss'],
// })
// export class Section2Component {
//   constructor(
//     @Inject(PLATFORM_ID) private platformId: Object,
//     private appRef: ApplicationRef,
//     private ngZone: NgZone
//   ) { }

//   ngAfterViewInit() {
//     if (!isPlatformBrowser(this.platformId)) return;

//     this.ngZone.runOutsideAngular(() => {
//       requestAnimationFrame(() => {
//         document.fonts.ready.then(() => {
//           const section = document.querySelector('#stats-section') as HTMLElement;
//           const triggerEl = (document.querySelector('#section2') as HTMLElement) || section;
//           if (!section) return;

//           const rows = Array.from(section.querySelectorAll('.stat-row')) as HTMLElement[];
//           if (!rows.length) return;

//           // تصفير العدادات
//           rows.forEach(row => {
//             const c = row.querySelector('.counter') as HTMLElement | null;
//             if (c) c.textContent = '0';
//           });

//           const animateCounter = (el: HTMLElement, to: number, duration = 1.4, decimals = 0) => {
//             const obj = { val: 0 };
//             gsap.to(obj, {
//               val: to,
//               duration,
//               ease: 'power3.out',
//               onUpdate: () => {
//                 el.textContent = obj.val.toFixed(decimals);
//               },
//             });
//           };

//           // تجهيز النصوص (SplitText)
//           rows.forEach(row => {
//             const labelEl = row.querySelector('.label') as HTMLElement | null;
//             if (labelEl) {
//               const sLabel = SplitText.create(labelEl, { type: 'words', aria: 'hidden' });
//               gsap.set(sLabel.words, { opacity: 0 });
//               (labelEl as any)._splitWords = sLabel.words;
//             }
//           });

//           // تجهيز الأرقام
//           rows.forEach(row => {
//             const numEl = row.querySelector('.num') as HTMLElement | null;
//             if (numEl) {
//               gsap.set(numEl, { opacity: 0 });
//             }
//           });

//           // 🎬 التايملاين الأساسي
//           const tl = gsap.timeline({
//             defaults: { ease: 'power3.out' },
//             scrollTrigger: {
//               trigger: triggerEl || section,
//               start: 'top 60%',
//               end: 'bottom 100%',
//               toggleActions: 'play none none none',
//               once: true,
//               markers: true,
//             },
//           });

//           // العنوان (لو موجود)
//           const head = document.querySelector('#Text1') as HTMLElement | null;
//           if (head) {
//             const splitHead = SplitText.create(head, { type: 'words' });
//             gsap.set(splitHead.words, { opacity: 0, y: 10 });
//             tl.fromTo(
//               splitHead.words,
//               { opacity: 0, y: 10 },
//               { opacity: 1, y: 0, duration: 0.7, stagger: 0.15 },
//               0
//             );
//           }

//           // ✅ الترتيب المطلوب (بالتسلسل)
//           const order = [1, 0, 2, 3]; // [عميل نشط, سنة خبرة, أسابيع, توافر النظام]

//           order.forEach((index, i) => {
//             const row = rows[index];
//             const labelEl = row.querySelector('.label') as HTMLElement | null;
//             const numEl = row.querySelector('.num') as HTMLElement | null;
//             const counterEl = row.querySelector('.counter') as HTMLElement | null;
//             const labelWords = (labelEl && (labelEl as any)._splitWords) || null;

//             const rowTL = gsap.timeline();
//             if (labelWords) {
//               rowTL.to(labelWords, {
//                 opacity: 1,
//                 duration: 1.3,
//                 ease: 'sine.out',
//                 stagger: { each: 0.08, from: 'start' },
//               });
//             }
//             if (numEl && counterEl) {
//               rowTL.to(
//                 numEl,
//                 {
//                   opacity: 1,
//                   duration: 1.3,
//                   ease: 'power2.out',
//                   onStart: () => {
//                     const target = Number(counterEl.getAttribute('data-target') ?? 0);
//                     const decimals = target % 1 !== 0 ? 1 : 0;
//                     animateCounter(counterEl, target, 1.4, decimals);
//                   },
//                 },
//                 0
//               );
//             }

//             // كل عنصر يبدأ بعد ما اللي قبله يخلص
//             tl.add(rowTL, i === 0 ? '>' : '+=1');
//           });

//           // ✅ الزرار والجملة
//           const cta = section.querySelector('.cta-btn') as HTMLElement | null;
//           const subtitle = section.querySelector('.cta-sub') as HTMLElement | null;
//           if (cta) {
//             gsap.set(cta, { opacity: 0, y: 20 });
//             tl.to(cta, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }, '+=0.5');
//           }
//           if (subtitle) {
//             gsap.set(subtitle, { opacity: 0, y: 10 });
//             tl.to(subtitle, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }, '+=0.2');
//           }
//         });
//       });
//     });
//   }
// }
import { isPlatformBrowser } from '@angular/common';
import { ApplicationRef, Component, Inject, NgZone, PLATFORM_ID } from '@angular/core';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
gsap.registerPlugin(ScrollTrigger, SplitText);

@Component({
  selector: 'app-section2',
  imports: [],
  templateUrl: './section2.component.html',
  styleUrls: ['./section2.component.scss'],
})
export class Section2Component {
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private appRef: ApplicationRef,
    private ngZone: NgZone
  ) { }

  ngAfterViewInit() {
    if (!isPlatformBrowser(this.platformId)) return;

    this.ngZone.runOutsideAngular(() => {
      requestAnimationFrame(() => {
        document.fonts.ready.then(() => {
          const section = document.querySelector('#stats-section') as HTMLElement;
          const triggerEl = (document.querySelector('#section2') as HTMLElement) || section;
          if (!section) return;

          // ✅ هنا التعديل المهم
          const rows = Array.from(section.querySelectorAll('.stat-card')) as HTMLElement[];
          if (!rows.length) {
            console.warn('⚠️ لم يتم العثور على أي stat-card');
            return;
          }

          // تصفير العدادات
          rows.forEach(row => {
            const c = row.querySelector('.counter') as HTMLElement | null;
            if (c) c.textContent = '0';
          });

          const animateCounter = (el: HTMLElement, to: number, duration = 1.4, decimals = 0) => {
            const obj = { val: 0 };
            gsap.to(obj, {
              val: to,
              duration,
              ease: 'power3.out',
              onUpdate: () => {
                el.textContent = obj.val.toFixed(decimals);
              },
            });
          };

          // تجهيز النصوص (SplitText)
          rows.forEach(row => {
            const labelEl = row.querySelector('.label') as HTMLElement | null;
            if (labelEl) {
              const sLabel = SplitText.create(labelEl, { type: 'words', aria: 'hidden' });
              gsap.set(sLabel.words, { opacity: 0 });
              (labelEl as any)._splitWords = sLabel.words;
            }
          });

          // تجهيز الأرقام
          rows.forEach(row => {
            const numEl = row.querySelector('.num') as HTMLElement | null;
            if (numEl) {
              gsap.set(numEl, { opacity: 0 });
            }
          });

          const tl = gsap.timeline({
            defaults: { ease: 'power3.out' },
            scrollTrigger: {
              trigger: triggerEl || section,
              start: 'top top',
              end: '+=400',
              // scrub: true,
              pin: true,
              anticipatePin: 1,

              pinType: 'fixed',
              scroller: "#smooth-wrapper",
              markers: true,
            },
          });

          // ✅ الترتيب المطلوب (بالتسلسل)
          const order = [1, 0, 3, 2]; // [عميل نشط, سنة خبرة, توافر النظام, أسابيع]

          order.forEach((index, i) => {
            const row = rows[index];
            const labelEl = row.querySelector('.label') as HTMLElement | null;
            const numEl = row.querySelector('.num') as HTMLElement | null;
            const counterEl = row.querySelector('.counter') as HTMLElement | null;
            const labelWords = (labelEl && (labelEl as any)._splitWords) || null;

            const rowTL = gsap.timeline();
            if (labelWords) {
              rowTL.to(labelWords, {
                opacity: 1,
                duration: 1.3,
                ease: 'sine.out',
                stagger: { each: 0.08, from: 'start' },
              });
            }
            if (numEl && counterEl) {
              rowTL.to(
                numEl,
                {
                  opacity: 1,
                  duration: 1.3,
                  ease: 'power2.out',
                  onStart: () => {
                    const target = Number(counterEl.getAttribute('data-target') ?? 0);
                    const decimals = target % 1 !== 0 ? 1 : 0;
                    animateCounter(counterEl, target, 1.4, decimals);
                  },
                },
                0
              );
            }

            // كل عنصر يبدأ بعد ما اللي قبله يخلص
            tl.add(rowTL, i === 0 ? '>' : '+=1');
          });

          // ✅ الزرار والجملة
          const cta = section.querySelector('button') as HTMLElement | null;
          const subtitle = section.querySelector('p') as HTMLElement | null;
          if (cta) {
            gsap.set(cta, { opacity: 0, y: 20 });
            tl.to(cta, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }, '+=0.5');
          }
          if (subtitle) {
            gsap.set(subtitle, { opacity: 0, y: 10 });
            tl.to(subtitle, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }, '+=0.2');
          }
        });
      });
    });
  }
}
