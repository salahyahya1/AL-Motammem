// import { isPlatformBrowser } from '@angular/common';
// import { AfterViewInit, ApplicationRef, Component, ElementRef, Inject, NgZone, PLATFORM_ID, ViewChild } from '@angular/core';
// import { RouterLink } from '@angular/router';
// import gsap from 'gsap';
// import ScrollTrigger from 'gsap/ScrollTrigger';
// import SplitText from 'gsap/SplitText';
// import { TranslatePipe } from '@ngx-translate/core';
// import { OpenFormDialogDirective } from '../../../shared/Directives/open-form-dialog.directive';
// import { VedioPlayerServiceForIosService } from '../../../shared/services/vedio-player-service-for-ios.service';
// gsap.registerPlugin(ScrollTrigger, SplitText);

// @Component({
//   selector: 'app-section2',
//   imports: [RouterLink, TranslatePipe, OpenFormDialogDirective],
//   templateUrl: './section2.component.html',
//   styleUrls: ['./section2.component.scss'],
// })
// export class Section2Component implements AfterViewInit {
//   constructor(
//     @Inject(PLATFORM_ID) private readonly platformId: Object,
//     private readonly vedioPlayer:VedioPlayerServiceForIosService,
//     private readonly appRef: ApplicationRef,
//     private readonly ngZone: NgZone
//   ) { }
//   @ViewChild('section4Video') section4Video!: ElementRef<HTMLVideoElement>;
//   ngAfterViewInit() {

//     if (!isPlatformBrowser(this.platformId)) return;
//     let playedOnce = false;
//     this.ngZone.runOutsideAngular(() => {
//       requestAnimationFrame(() => {
//         setTimeout(() => {
//           document.fonts.ready.then(() => {
//             const section = document.querySelector('#stats-section') as HTMLElement;
//             const triggerEl = (document.querySelector('#section2') as HTMLElement) || section;
//             const video = document.getElementById('section4Video') as HTMLVideoElement;
//             const cta = section.querySelector('button') as HTMLElement | null;
//             const subtitle = section.querySelector('p') as HTMLElement | null;
//             if (!section) return;
//             gsap.set(cta, { opacity: 0 });
//             gsap.set(subtitle, { opacity: 0 });
//             const rows = Array.from(section.querySelectorAll('.stat-card')) as HTMLElement[];
//             if (!rows.length) {
//               console.warn('⚠️ لم يتم العثور على أي stat-card');
//               return;
//             }

//             rows.forEach(row => {
//               const c = row.querySelector('.counter') as HTMLElement | null;
//               if (c) c.textContent = '0';
//             });

//             const animateCounter = (el: HTMLElement, to: number, duration = 1.4, decimals = 0) => {
//               const obj = { val: 0 };
//               gsap.to(obj, {
//                 val: to,
//                 duration,
//                 ease: 'power3.out',
//                 onUpdate: () => {
//                   el.textContent = obj.val.toFixed(decimals);
//                 },
//               });
//             };

//             rows.forEach(row => {
//               const labelEl = row.querySelector('.label') as HTMLElement | null;
//               if (labelEl) {
//                 const sLabel = SplitText.create(labelEl, { type: 'words', aria: 'hidden' });
//                 gsap.set(sLabel.words, { opacity: 0 });
//                 (labelEl as any)._splitWords = sLabel.words;
//               }
//             });

//             rows.forEach(row => {
//               const numEl = row.querySelector('.num') as HTMLElement | null;
//               if (numEl) {
//                 gsap.set(numEl, { opacity: 0 });
//               }
//             });
//             ScrollTrigger.create({
//               trigger: triggerEl || section,
//               start: 'top top',
//               end: '+=400',
//               scrub: true,
//               pinType: 'transform',
//               pin: true,
//               anticipatePin: 1,
//               id: 'pinsection',
//               onEnter: () => {
//                 if (!playedOnce) {
//                   playedOnce = true;
//                   video.currentTime = 0;
//                   this.vedioPlayer.requestPlay(video);
//                 }
//               },
//             });
//             video.addEventListener('ended', () => {
//               const tl = gsap.timeline({
//                 defaults: { ease: 'power3.out' },
//                 scrollTrigger: {
//                   trigger: triggerEl || section,
//                   start: '-50% top',
//                   end: '+=400',
//                 },
//               });
//               const order = [0, 1, 2, 3];
//               order.forEach((index, i) => {
//                 const row = rows[index];
//                 const labelEl = row.querySelector('.label') as HTMLElement | null;
//                 const numEl = row.querySelector('.num') as HTMLElement | null;
//                 const counterEl = row.querySelector('.counter') as HTMLElement | null;
//                 const labelWords = (labelEl && (labelEl as any)._splitWords) || null;
//                 const rowTL = gsap.timeline();
//                 if (labelWords) {
//                   rowTL.to(labelWords, {
//                     opacity: 1,
//                     duration: 0.6,
//                     ease: 'sine.out',
//                     stagger: { each: 0.4, from: 'start' },
//                   });
//                 }
//                 if (numEl && counterEl) {
//                   rowTL.to(
//                     numEl,
//                     {
//                       opacity: 1,
//                       duration: 0.8,
//                       ease: 'power2.out',
//                       onStart: () => {
//                         const target = Number(counterEl.getAttribute('data-target') ?? 0);
//                         const decimals = target % 1 !== 0 ? 1 : 0;
//                         animateCounter(counterEl, target, 1.5, decimals);
//                       },
//                     },
//                     0
//                   );
//                 }
//                 tl.add(rowTL, i === 0 ? '>' : '-=0.8');
//               });
//               if (cta) {
//                 gsap.set(cta, { opacity: 0, y: 20 });
//                 tl.to(cta, { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' }, '-=0.15');
//               }
//               if (subtitle) {
//                 gsap.set(subtitle, { opacity: 0, y: 10 });
//                 tl.to(subtitle, { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' }, '<');
//               }
//             });
//           });
//         }, 500);
//       });
//     });
//   }

// }
import { isPlatformBrowser } from '@angular/common';
import { AfterViewInit, ApplicationRef, Component, ElementRef, Inject, NgZone, PLATFORM_ID, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import SplitText from 'gsap/SplitText';
import { TranslatePipe } from '@ngx-translate/core';
import { OpenFormDialogDirective } from '../../../shared/Directives/open-form-dialog.directive';
import { VedioPlayerServiceForIosService } from '../../../shared/services/vedio-player-service-for-ios.service';
import { ResponsiveVideoDirective } from '../../../shared/Directives/change-vedio-mob-Deck.directive';
gsap.registerPlugin(ScrollTrigger, SplitText);

@Component({
  selector: 'app-section2',
  imports: [RouterLink, TranslatePipe, OpenFormDialogDirective, ResponsiveVideoDirective],
  templateUrl: './section2.component.html',
  styleUrls: ['./section2.component.scss'],
})
export class Section2Component implements AfterViewInit {
  mobile!: boolean;
  constructor(
    @Inject(PLATFORM_ID) private readonly platformId: Object,
    private readonly vedioPlayer: VedioPlayerServiceForIosService,
    private readonly appRef: ApplicationRef,
    private readonly ngZone: NgZone
  ) {
    if (typeof window === 'undefined') return;
    this.mobile = window.innerWidth < 768;
  }

  @ViewChild('section4Video') section4Video!: ElementRef<HTMLVideoElement>;

  ngAfterViewInit() {
    if (!isPlatformBrowser(this.platformId)) return;

    let playedOnce = false;

    this.ngZone.runOutsideAngular(() => {
      requestAnimationFrame(() => {
        setTimeout(() => {
          document.fonts.ready.then(() => {
            const section = document.querySelector('#stats-section') as HTMLElement;
            const triggerEl = (document.querySelector('#homeSection2') as HTMLElement) || section;
            const video = document.getElementById('section4Video') as HTMLVideoElement;
            const cta = section?.querySelector('button') as HTMLElement | null;
            const subtitle = section?.querySelector('p') as HTMLElement | null;

            if (!section || !video) return;

            gsap.set(cta, { opacity: 0 });
            gsap.set(subtitle, { opacity: 0 });

            const rows = Array.from(section.querySelectorAll('.stat-card')) as HTMLElement[];
            if (!rows.length) {
              console.warn('⚠️ لم يتم العثور على أي stat-card');
              return;
            }

            rows.forEach(row => {
              const c = row.querySelector('.counter') as HTMLElement | null;
              if (c) c.textContent = '0';
            });

            const animateCounter = (el: HTMLElement, to: number, duration = 0.4, decimals = 0) => {
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

            rows.forEach(row => {
              const labelEl = row.querySelector('.label') as HTMLElement | null;
              if (labelEl) {
                const sLabel = SplitText.create(labelEl, { type: 'words', aria: 'hidden' });
                gsap.set(sLabel.words, { opacity: 0 });
                (labelEl as any)._splitWords = sLabel.words;
              }
            });

            rows.forEach(row => {
              const numEl = row.querySelector('.num') as HTMLElement | null;
              if (numEl) {
                gsap.set(numEl, { opacity: 0 });
              }
            });

            // ✅ play helper (desktop + mobile)
            const play = () => {
              if (playedOnce) return;
              playedOnce = true;

              // مهم للموبايل/iOS
              video.muted = true;
              (video as any).playsInline = true;
              video.setAttribute('playsinline', '');
              video.setAttribute('muted', '');

              video.currentTime = 0;
              this.vedioPlayer.requestPlay(video);
            };

            // ✅ MATCH MEDIA: pin على الشاشات الكبيرة فقط (>=721)
            const mm = gsap.matchMedia();

            mm.add(
              {
                desktop: '(min-width: 768px)',
                mobile: '(max-width: 767px)',
              },
              (ctx) => {
                const { desktop, mobile } = (ctx.conditions || {}) as any;

                let pinST: ScrollTrigger | null = null;
                let playST: ScrollTrigger | null = null;

                // if (mobile) {
                //   // ✅ بدون pin: شغل الفيديو أول ما يدخل السكشن في الـ viewport
                //   playST = ScrollTrigger.create({
                //     trigger: triggerEl || section,
                //     start: '-100% 20%',
                //     end: '+=220',
                //     pin: true,
                //     onEnter: play,
                //     // markers: true,
                //     // onEnterBack: play,
                //   });
                // }

                // if (desktop) {
                //   // ✅ مع pin على الشاشات الكبيرة
                //   pinST = ScrollTrigger.create({
                //     trigger: triggerEl || section,
                //     start: 'top top',
                //     end: '+=400',
                //     // scrub: true,
                //     pinType: 'transform',
                //     pin: true,
                //     anticipatePin: 1,
                //     id: 'pinsection',
                //     onEnter: play,
                //   });
                // }

                // ✅ مهم بعد إنشاء triggers
                const st = ScrollTrigger.create({
                  trigger: triggerEl || section,
                  start: mobile ? 'top 85%' : 'top top',
                  end: mobile ? 'top 95%' : '+=400',
                  pin: true,
                  // markers: true,
                  pinType: 'transform',
                  anticipatePin: 1,
                  pinSpacing: mobile ? false : true, // مهم للفيديو
                  once: mobile ? true : false,
                  onEnter: play,
                });
                ScrollTrigger.refresh();
                setTimeout(() => window.dispatchEvent(new Event('pin-ready')), 0);



                return () => {
                  st.kill();
                };
              }
            );

            video.addEventListener('ended', () => {
              const isMobile = window.matchMedia('(max-width: 767px)').matches;
              const tl = gsap.timeline({
                defaults: { ease: 'power3.out' },
                scrollTrigger: {
                  trigger: triggerEl || section,
                  start: isMobile ? 'top 80%' : '-50% top',
                  end: isMobile ? 'bottom 25%' : '+=400',
                  // ✅ لو اليوزر ساب السكشن بسرعة على الموبايل: خلّص الأنيميشين فورًا
                  onLeave: () => { if (isMobile) tl.progress(1); },
                  // onLeaveBack: () => { if (isMobile) tl.progress(0); },
                },
              });

              const order = [0, 1, 2, 3];
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
                    duration: 0.2,
                    ease: 'sine.out',
                    stagger: { each: 0.2, from: 'start' },
                  });
                }

                if (numEl && counterEl) {
                  rowTL.to(
                    numEl,
                    {
                      opacity: 1,
                      duration: 0.4,
                      ease: 'power2.out',
                      onStart: () => {
                        const target = Number(counterEl.getAttribute('data-target') ?? 0);
                        const decimals = target % 1 !== 0 ? 1 : 0;
                        animateCounter(counterEl, target, 0.5, decimals);
                      },
                    },
                    0
                  );
                }

                tl.add(rowTL, i === 0 ? '>' : '-=0.2');
              });

              if (cta) {
                gsap.set(cta, { opacity: 0, y: 20 });
                tl.to(cta, { opacity: 1, y: 0, duration: 0.2, ease: 'power2.out' }, '-=0.15');
              }

              if (subtitle) {
                gsap.set(subtitle, { opacity: 0, y: 10 });
                tl.to(subtitle, { opacity: 1, y: 0, duration: 0.2, ease: 'power2.out' }, '<');
              }
            });

          });
        }, 500);
      });
    });
  }
}
