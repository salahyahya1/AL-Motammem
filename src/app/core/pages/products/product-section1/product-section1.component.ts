// import { isPlatformBrowser } from '@angular/common';
// import { ApplicationRef, Component, Inject, NgZone, PLATFORM_ID } from '@angular/core';
// import { RouterLink } from '@angular/router';
// import gsap from 'gsap';
// import ScrollTrigger from 'gsap/ScrollTrigger';
// import SplitText from 'gsap/SplitText';
// import { LanguageService } from '../../../shared/services/language.service';
// import { TranslateDirective, TranslatePipe } from '@ngx-translate/core';

// gsap.registerPlugin(ScrollTrigger, SplitText);

// @Component({
//   selector: 'app-product-section1',
//   imports: [TranslatePipe, RouterLink],
//   templateUrl: './product-section1.component.html',
//   styleUrl: './product-section1.component.scss'
// })
// export class ProductSection1Component {
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
//               "(min-width: 1024px)": () => {
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
//               "(min-width: 721px) and (max-width: 1023px)": () => {
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
//                   right: '0%',
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
//                   left: '0%',
//                   duration: 1.5,
//                   ease: "sine.out",
//                   immediateRender: false,
//                 }, '<')
//                 tl.add(tlCards, ">");
//               },
//               "(max-width: 720px)": () => {
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
import { ApplicationRef, Component, Inject, NgZone, PLATFORM_ID, AfterViewInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import SplitText from 'gsap/SplitText';
import { LanguageService } from '../../../shared/services/language.service';
import { TranslatePipe } from '@ngx-translate/core';

gsap.registerPlugin(ScrollTrigger, SplitText);

@Component({
  selector: 'app-product-section1',
  standalone: true,
  imports: [TranslatePipe, RouterLink],
  templateUrl: './product-section1.component.html',
  styleUrl: './product-section1.component.scss',
})
export class ProductSection1Component implements AfterViewInit {
  // ندي قيمة ابتدائية عشان الـ @for ما يهنّجش
  items: number[] = [1, 2, 3, 4, 5];

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private appRef: ApplicationRef,
    private ngZone: NgZone,
    private language: LanguageService
  ) { }

  get isRtl() {
    return this.language.currentLang === 'ar';
  }

  ngAfterViewInit() {
    if (typeof window === 'undefined') return;
    if (!isPlatformBrowser(this.platformId)) return;

    this.ngZone.runOutsideAngular(() => {
      requestAnimationFrame(() => {
        setTimeout(() => {
          // لو عربي خلي الليست 1..4 عشان الشرط بتاع أول عنصرين
          this.items = this.isRtl ? [1, 2, 3, 4, 5] : [1, 2, 3];

          const tl = gsap.timeline({
            defaults: { ease: 'power3.out' },
            scrollTrigger: {
              trigger: '#section7',
              start: 'top top',
              end: '150% bottom',
              pin: true,
            },
          });

          document.fonts.ready.then(() => {
            const sectionHead = document.querySelector('#productTitle1') as HTMLElement;
            const sectionSub = document.querySelector('#productSubTitle1') as HTMLElement;
            const sectionbottom = document.querySelector('#productbottom-text') as HTMLElement;

            if (!sectionHead || !sectionSub || !sectionbottom) return;

            const splitedtext = SplitText.create(sectionHead, { type: 'words' });
            const splitedSub = SplitText.create(sectionSub, { type: 'words' });
            const splitedbottom = SplitText.create(sectionbottom, { type: 'words' });

            gsap.set(['.card1', '.card2', '.card3'], {
              opacity: 0,
              visibility: 'hidden',
            });

            tl.fromTo(
              splitedtext.words,
              { opacity: 0, visibility: 'visible' },
              {
                opacity: 1,
                duration: 0.4,
                stagger: 0.02,
                onStart: () => { gsap.set(sectionHead, { opacity: 1, visibility: 'visible' }) },
              }
            );

            tl.fromTo(
              splitedSub.words,
              { opacity: 0, visibility: 'visible' },
              {
                opacity: 1,
                duration: 0.4,
                stagger: 0.02,
                onStart: () => { gsap.set(sectionSub, { opacity: 1, visibility: 'visible' }) },
              },
              '>-0.3'
            );

            // أنيميشن الكروت حسب الريزوليوشن
            ScrollTrigger.matchMedia({
              '(min-width: 1024px)': () => {
                const tlCards = gsap.timeline();
                tlCards
                  .fromTo(
                    '.card2',
                    { autoAlpha: 0 },
                    { autoAlpha: 1, duration: 1.5, ease: 'sine.out', immediateRender: false }
                  )
                  .fromTo(
                    '.card1',
                    { autoAlpha: 0 },
                    { right: '0%', autoAlpha: 1, duration: 1.5, ease: 'sine.out', immediateRender: false },
                    '<'
                  )
                  .fromTo(
                    '.card3',
                    { autoAlpha: 0 },
                    { left: '0%', autoAlpha: 1, duration: 1.5, ease: 'sine.out', immediateRender: false },
                    '<'
                  );
                tl.add(tlCards, '>');
              },

              '(min-width: 721px) and (max-width: 1023px)': () => {
                const tlCards = gsap.timeline();
                tlCards
                  .fromTo(
                    '.card2',
                    { autoAlpha: 0 },
                    { autoAlpha: 1, duration: 1.5, ease: 'sine.out', immediateRender: false }
                  )
                  .fromTo(
                    '.card1',
                    { autoAlpha: 0 },
                    { right: '0%', autoAlpha: 1, duration: 1.5, ease: 'sine.out', immediateRender: false },
                    '<'
                  )
                  .fromTo(
                    '.card3',
                    { autoAlpha: 0 },
                    { left: '0%', autoAlpha: 1, duration: 1.5, ease: 'sine.out', immediateRender: false },
                    '<'
                  );
                tl.add(tlCards, '>');
              },

              '(max-width: 720px)': () => {
                const tlCards = gsap.timeline();
                tlCards
                  .fromTo(
                    '.card2',
                    { autoAlpha: 0 },
                    { autoAlpha: 1, duration: 1.5, ease: 'sine.in', immediateRender: false }
                  )
                  .fromTo(
                    '.card1',
                    { autoAlpha: 0, xPercent: 150 },
                    { xPercent: 0, autoAlpha: 1, duration: 1.5, ease: 'sine.in', immediateRender: false },
                    '<'
                  )
                  .fromTo(
                    '.card3',
                    { autoAlpha: 0, xPercent: -150 },
                    { xPercent: 0, autoAlpha: 1, duration: 1.5, ease: 'sine.in', immediateRender: false },
                    '<'
                  );
                tl.add(tlCards, '>');
              },
            });

            tl.fromTo(
              splitedbottom.words,
              { opacity: 0, visibility: 'visible' },
              {
                opacity: 1,
                duration: 0.8,
                stagger: 0.15,
                onStart: () => { gsap.set(sectionbottom, { opacity: 1, visibility: 'visible' }) },
              },
              '>-0.1'
            );
          });
        }, 500);
      });
    });
  }
}
