// import { isPlatformBrowser } from '@angular/common';
// import { ApplicationRef, Component, Inject, NgZone, PLATFORM_ID } from '@angular/core';
// import { RouterLink } from '@angular/router';
// import gsap from 'gsap';
// import ScrollTrigger from 'gsap/ScrollTrigger';
// import SplitText from 'gsap/SplitText';
// import { LanguageService } from '../../../shared/services/language.service';
// import { TranslatePipe } from '@ngx-translate/core';
// import { OpenFormDialogDirective } from '../../../shared/Directives/open-form-dialog.directive';
// // import { OpenFormDialogDirective } from '../../../shared/Directives/open-form-dialog.directive';
// gsap.registerPlugin(ScrollTrigger, SplitText);

// @Component({
//   selector: 'app-section7',
//   templateUrl: './section7.component.html',
//   styleUrls: ['./section7.component.scss'],
//   imports: [RouterLink, TranslatePipe, OpenFormDialogDirective],
// })
// export class Section7Component {
//   items!: number[];
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
//           if (this.isRtl) {
//             this.items = [1, 2, 3, 4];
//           }
//           else {
//             this.items = [1, 2, 3];
//           }
//           const tl = gsap.timeline({
//             defaults: { ease: 'power3.out' },
//             scrollTrigger: {
//               trigger: '#section7',
//               start: 'top top',
//               end: "150% bottom",
//               pin: true,
//               anticipatePin: 1,
//               pinType: 'transform',
//             },
//           });

//           document.fonts.ready.then(() => {
//             const sectionHead = document.querySelector('#Text7') as HTMLElement;
//             const sectionSub = document.querySelector('#SubText7') as HTMLElement;
//             const sectionbottom = document.querySelector('#bottom-text') as HTMLElement;
//             const card1 = document.querySelector('.card1') as HTMLElement;
//             const card2 = document.querySelector('.card2') as HTMLElement;
//             const card3 = document.querySelector('.card3') as HTMLElement;

//             if (!sectionHead) {
//               console.warn('⚠️ عناصر النص مش لاقيها SplitText');
//               return;
//             }

//             const splitedtext = SplitText.create(sectionHead, { type: 'words' });
//             const splitedSub = SplitText.create(sectionSub, { type: 'words' });
//             const splitedbottom = SplitText.create(sectionbottom, { type: 'words' });
//             gsap.set(['.card1', '.card2', '.card3'], {
//               opacity: 0,
//               visibility: 'hidden',
//             });
//             tl.fromTo(
//               splitedtext.words,
//               { opacity: 0, visibility: 'visible' },
//               {
//                 opacity: 1,
//                 duration: 0.4,
//                 ease: 'sine.out',
//                 stagger: 0.02,
//                 onStart: () => {
//                   gsap.set(sectionHead, { opacity: 1, visibility: 'visible' })
//                 }
//               }
//             );
//             tl.fromTo(
//               splitedSub.words,
//               { opacity: 0, visibility: 'visible' },
//               {
//                 opacity: 1,
//                 duration: 0.4,
//                 ease: 'sine.out',
//                 stagger: 0.02,
//                 onStart: () => { gsap.set(sectionSub, { opacity: 1, visibility: 'visible' }) },
//               },
//               '>-0.3'
//             );

//             ScrollTrigger.matchMedia({
//               "(min-width: 1280px)": () => {
//                 const tlCards = gsap.timeline();
//                 tlCards.fromTo(".card2", {
//                   autoAlpha: 0,
//                 }, {
//                   autoAlpha: 1,
//                   duration: 1.5,
//                   ease: "sine.out",
//                   immediateRender: false,
//                 }, '>')
//                 tlCards.fromTo(".card1", {
//                   autoAlpha: 0,
//                 }, {
//                   right: '9%',
//                   autoAlpha: 1,
//                   duration: 1.5,
//                   ease: "sine.out",
//                   immediateRender: false,
//                 }, '<')
//                 tlCards.fromTo(".card3", {
//                   autoAlpha: 0,
//                 }, {
//                   autoAlpha: 1,
//                   left: '9%',
//                   duration: 1.5,
//                   ease: "sine.out",
//                   immediateRender: false,
//                 }, '<')
//                 tl.add(tlCards, ">");
//               },
//               "(min-width: 768px) and (max-width: 1279px)": () => {
//                 const tlCards = gsap.timeline();
//                 tlCards.fromTo(".card2", {
//                   autoAlpha: 0,
//                 }, {
//                   autoAlpha: 1,
//                   duration: 1.5,
//                   ease: "sine.out",
//                   immediateRender: false,
//                 }, '>')
//                 tlCards.fromTo(".card1", {
//                   autoAlpha: 0,
//                 }, {
//                   right: '-4%',
//                   autoAlpha: 1,
//                   duration: 1.5,
//                   ease: "sine.out",
//                   immediateRender: false,
//                 }, '<')
//                 tlCards.fromTo(".card3", {
//                   autoAlpha: 0,
//                   // left: -14,
//                 }, {
//                   autoAlpha: 1,
//                   left: '-4%',
//                   duration: 1.5,
//                   ease: "sine.out",
//                   immediateRender: false,
//                 }, '<')
//                 tl.add(tlCards, ">");
//               },
//               "(max-width: 767px)": () => {
//                 const tlCards = gsap.timeline();

//                 tlCards.fromTo(".card2", {
//                   autoAlpha: 0,
//                 }, {
//                   autoAlpha: 1,
//                   duration: 1.5,
//                   ease: "sine.in",
//                   immediateRender: false,
//                 }, '>')
//                 tlCards.fromTo(".card1", {
//                   autoAlpha: 0,
//                   xPercent: 150
//                 }, {
//                   xPercent: 0,
//                   autoAlpha: 1,
//                   duration: 1.5,
//                   ease: "sine.in",
//                   immediateRender: false,
//                 }, '<')
//                 tlCards.fromTo(".card3", {
//                   autoAlpha: 0,
//                   xPercent: -150
//                 }, {
//                   xPercent: 0,
//                   autoAlpha: 1,
//                   duration: 1.5,
//                   ease: "sine.in",
//                   immediateRender: false,
//                 }, '<')
//                 tl.add(tlCards, ">");
//               },
//             });

//             tl.fromTo(
//               splitedbottom.words,
//               { opacity: 0, visibility: 'visible' },
//               {
//                 opacity: 1,
//                 duration: 0.8,
//                 ease: 'sine.out',
//                 stagger: 0.15,
//                 onStart: () => { gsap.set(sectionSub, { opacity: 1, visibility: 'visible' }) },
//               },
//               '>-0.1'
//             );

//           });
//         }, 500);
//       });
//     });

//   }
//   get isRtl() {
//     return this.language.currentLang === 'ar';
//   }
// }
import { isPlatformBrowser } from '@angular/common';
import { ApplicationRef, Component, Inject, NgZone, PLATFORM_ID } from '@angular/core';
import { RouterLink } from '@angular/router';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import SplitText from 'gsap/SplitText';
import { LanguageService } from '../../../shared/services/language.service';
import { TranslatePipe } from '@ngx-translate/core';
import { OpenFormDialogDirective } from '../../../shared/Directives/open-form-dialog.directive';
// import { OpenFormDialogDirective } from '../../../shared/Directives/open-form-dialog.directive';
gsap.registerPlugin(ScrollTrigger, SplitText);

@Component({
  selector: 'app-section7',
  templateUrl: './section7.component.html',
  styleUrls: ['./section7.component.scss'],
  imports: [RouterLink, TranslatePipe, OpenFormDialogDirective],
})
export class Section7Component {
  items!: number[];

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

    this.ngZone.runOutsideAngular(() => {
      requestAnimationFrame(() => {
        setTimeout(() => {
          if (this.isRtl) {
            this.items = [1, 2, 3, 4];
          } else {
            this.items = [1, 2, 3];
          }

          const buildTimeline = (isMobile: boolean) => {
            const tl = gsap.timeline({
              defaults: { ease: 'power3.out' },
              scrollTrigger: {
                trigger: '#homeSection7',
                pin: true,
                scrub: false,
                anticipatePin: 1,
                start: isMobile ? 'top 85%' : 'top top',
                end: isMobile ? 'top bottom' : '160% bottom',
                pinSpacing: isMobile ? true : true,
                pinType: 'transform',
                id: 'section7',
                invalidateOnRefresh: true,
                markers: false,
                onLeave: () => { if (isMobile) tl.progress(1); },
                // onLeaveBack: () => { if (isMobile) tl.progress(0); },
              },
            });
            ScrollTrigger.refresh();
            setTimeout(() => window.dispatchEvent(new Event('pin-ready')), 0);


            let mmCards: ReturnType<typeof gsap.matchMedia> | null = null;
            let splitHead: any = null;
            let splitSub: any = null;
            let splitBottom: any = null;

            document.fonts.ready.then(() => {
              const sectionHead = document.querySelector('#Text7') as HTMLElement;
              const sectionSub = document.querySelector('#SubText7') as HTMLElement;
              const sectionbottom = document.querySelector('#bottom-text') as HTMLElement;

              if (!sectionHead) {
                console.warn('⚠️ عناصر النص مش لاقيها SplitText');
                return;
              }

              splitHead = SplitText.create(sectionHead, { type: 'words' });
              splitSub = SplitText.create(sectionSub, { type: 'words' });
              splitBottom = SplitText.create(sectionbottom, { type: 'words' });

              gsap.set(['.card1', '.card2', '.card3', "#Section7Btn"], {
                opacity: 0,
                visibility: 'hidden',
              });
              tl.fromTo(
                splitHead.words,
                { opacity: 0, visibility: 'visible' },
                {
                  opacity: 1,
                  duration: 0.2,
                  ease: 'sine.out',
                  stagger: 0.02,
                  onStart: () => {
                    gsap.set(sectionHead, { opacity: 1, visibility: 'visible' });
                  },
                }
              );

              tl.fromTo(
                splitSub.words,
                { opacity: 0, visibility: 'visible' },
                {
                  opacity: 1,
                  duration: 0.2,
                  ease: 'sine.out',
                  stagger: 0.02,
                  onStart: () => {
                    gsap.set(sectionSub, { opacity: 1, visibility: 'visible' });
                  },
                },
                '>-0.3'
              );

              // ✅ نفس تقسيمتك للكروت (1280 / 721-1279 / 720) زي ما هي
              mmCards = gsap.matchMedia();

              mmCards.add('(min-width: 1280px)', () => {
                const tlCards = gsap.timeline();
                tlCards.fromTo(
                  '.card2',
                  { autoAlpha: 0 },
                  { autoAlpha: 1, duration: 0.5, ease: 'sine.out', immediateRender: false },
                  '>'
                );
                tlCards.fromTo(
                  '.card1',
                  { autoAlpha: 0 },
                  { right: '9%', autoAlpha: 1, duration: 0.5, ease: 'sine.out', immediateRender: false },
                  '<'
                );
                tlCards.fromTo(
                  '.card3',
                  { autoAlpha: 0 },
                  { autoAlpha: 1, left: '9%', duration: 0.5, ease: 'sine.out', immediateRender: false },
                  '<'
                );
                tl.add(tlCards, '>');
              });

              mmCards.add('(min-width: 768px) and (max-width: 1279px)', () => {
                const tlCards = gsap.timeline();
                tlCards.fromTo(
                  '.card2',
                  { autoAlpha: 0 },
                  { autoAlpha: 1, duration: 0.5, ease: 'sine.out', immediateRender: false },
                  '>'
                );
                tlCards.fromTo(
                  '.card1',
                  { autoAlpha: 0 },
                  { right: '-4%', autoAlpha: 1, duration: 0.5, ease: 'sine.out', immediateRender: false },
                  '<'
                );
                tlCards.fromTo(
                  '.card3',
                  { autoAlpha: 0 },
                  { autoAlpha: 1, left: '-4%', duration: 0.5, ease: 'sine.out', immediateRender: false },
                  '<'
                );
                tl.add(tlCards, '>');
              });

              mmCards.add('(max-width: 767px)', () => {
                const tlCards = gsap.timeline();
                tlCards.fromTo(
                  '.card2',
                  { autoAlpha: 0 },
                  { autoAlpha: 1, duration: 0.5, ease: 'sine.in', immediateRender: false },
                  '>'
                );
                tlCards.fromTo(
                  '.card1',
                  { autoAlpha: 0 },
                  { autoAlpha: 1, duration: 0.5, ease: 'sine.in', immediateRender: false },
                  '<'
                );
                tlCards.fromTo(
                  '.card3',
                  { autoAlpha: 0 },
                  { autoAlpha: 1, duration: 0.5, ease: 'sine.in', immediateRender: false },
                  '<'
                );
                tl.add(tlCards, '>');
              });

              tl.fromTo(
                splitBottom.words,
                { opacity: 0, visibility: 'visible' },
                {
                  opacity: 1,
                  duration: 0.2,
                  ease: 'sine.out',
                  stagger: 0.15,
                  onStart: () => {
                    gsap.set(sectionSub, { opacity: 1, visibility: 'visible' });
                  },
                },
                '>-0.1'
              );
              tl.fromTo("#Section7Btn", { opacity: 0, visibility: 'hidden' }, { opacity: 1, visibility: 'visible', duration: 0.2, ease: 'sine.out' }, '>-0.1');

              // ✅ مهم عشان الحسابات تتظبط بعد pin/end
              // ScrollTrigger.refresh();
            });

            return () => {
              mmCards?.revert();
              splitHead?.revert?.();
              splitSub?.revert?.();
              splitBottom?.revert?.();

              tl.scrollTrigger?.kill();
              tl.kill();
            };
          };

          // ✅ هنا بس بنحدد موبايل/ديسكتوب
          ScrollTrigger.matchMedia({
            '(min-width: 768px)': () => buildTimeline(false), // desktop
            '(max-width: 767px)': () => buildTimeline(true),  // mobile (pin خفيف)
          });

        }, 500);
      });
    });
  }

  get isRtl() {
    return this.language.currentLang === 'ar';
  }
}
