import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, ElementRef, Inject, NgZone, PLATFORM_ID, ViewChild } from '@angular/core';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import InertiaPlugin from "gsap/InertiaPlugin";
import SplitText from "gsap/SplitText";

import { TranslatePipe } from '@ngx-translate/core';
import { LanguageService } from '../../../shared/services/language.service';
import { OpenFormDialogDirective } from '../../../shared/Directives/open-form-dialog.directive';

gsap.registerPlugin(ScrollTrigger, SplitText, InertiaPlugin);
@Component({
  selector: 'app-solutions-section6',
  imports: [TranslatePipe, OpenFormDialogDirective],
  templateUrl: './solutions-section6.component.html',
  styleUrl: './solutions-section6.component.scss'
})
export class SolutionsSection6Component {
  consultationTitleSplit: any;
  consultationSubtitleSplit: any;
  consultationDetailsSplit: any;
  consultationfootersSplit: any;
  constructor(
    @Inject(PLATFORM_ID) private pid: Object,
    private ngZone: NgZone,
    private language: LanguageService
  ) { }

  async ngAfterViewInit() {
    if (!isPlatformBrowser(this.pid)) return;
    if (typeof window === 'undefined') return;

    this.ngZone.runOutsideAngular(() => {
      requestAnimationFrame(() => {
        setTimeout(() => {
          document.fonts.ready.then(() => {
            ScrollTrigger.create({
              trigger: "#consultation",
              start: 'top top',
              end: '+=150%',
              pinType: 'transform',
              pin: true,
              // markers: true,
              invalidateOnRefresh: true,
              id: 'pinsection',
              anticipatePin: 1,
            });
            const consultationTitle = document.querySelector('h1#consultation-title') as HTMLElement;
            const consultationSubtitle = document.querySelector('#consultation-subtitle') as HTMLElement;
            const consultationDetails = document.querySelector('#consultation-details') as HTMLElement;
            const consultationfooter = document.querySelector('#consultation-footer') as HTMLElement;
            const button1 = document.querySelector('#button1') as HTMLElement;


            if (!consultationTitle || !consultationSubtitle || !consultationDetails || !button1) {
              console.warn('⚠️ عناصر الـ consultation مش لاقيها SplitText');
              return;
            }

            // 3️⃣ SplitText على النص الحالي (بعد الترجمة)
            this.consultationTitleSplit = new SplitText(consultationTitle, { type: 'words' });
            this.consultationSubtitleSplit = new SplitText(consultationSubtitle, { type: 'words' });
            this.consultationDetailsSplit = new SplitText(consultationDetails, { type: 'words' });
            this.consultationfootersSplit = new SplitText(consultationfooter, { type: 'words' });

            const tl = gsap.timeline({
              defaults: { ease: "power3.out" }, scrollTrigger: {
                trigger: "#consultation",
                start: 'top top',
                end: "150% bottom",
                // markers: true,
              }
            });

            tl.fromTo(
              this.consultationTitleSplit.words,
              { opacity: 0, visibility: 'visible' },
              {
                opacity: 1,
                duration: 0.4,
                ease: 'sine.out',
                stagger: 0.02,
                onStart: () => { gsap.set(consultationTitle, { opacity: 1, visibility: 'visible' }) },
              }
            );

            tl.fromTo(
              this.consultationSubtitleSplit.words,
              { opacity: 0, visibility: 'visible' },
              {
                opacity: 1,
                duration: 0.4,
                ease: 'sine.out',
                stagger: 0.02,
                onStart: () => { gsap.set(consultationSubtitle, { opacity: 1, visibility: 'visible' }) },
              }
            );

            tl.fromTo(
              this.consultationDetailsSplit.words,
              { opacity: 0, visibility: 'visible' },
              {
                opacity: 1,
                duration: 0.4,
                ease: 'sine.out',
                stagger: 0.02,
                onStart: () => { gsap.set(consultationDetails, { opacity: 1, visibility: 'visible' }) },
              }
            );
            tl.fromTo(
              button1,
              { opacity: 0, visibility: 'visible' },
              {
                opacity: 1,
                duration: 0.5,
                ease: 'sine.inOut',
                onStart: () => { gsap.set(button1, { opacity: 1, visibility: 'visible' }) },
              });
            tl.fromTo(
              this.consultationfootersSplit.words,
              { opacity: 0, visibility: 'visible' },
              {
                opacity: 1,
                duration: 0.4,
                ease: 'sine.out',
                stagger: 0.02,
                onStart: () => { gsap.set(consultationfooter, { opacity: 1, visibility: 'visible' }) },
              }
            );


          });
        }, 0);
      });
    });
  }

}





//   async ngAfterViewInit() {
//     if (!isPlatformBrowser(this.pid)) return;
//     if (typeof window === 'undefined') return;

//     this.ngZone.runOutsideAngular(() => {
//       requestAnimationFrame(() => {
//         setTimeout(() => {
//           if (this.swiperInstance) {
//             this.swiperInstance.destroy(true, true);
//             this.swiperInstance = null;
//           }
//           this.swiperInstance = new Swiper(this.swiperEl.nativeElement, {
//             direction: 'vertical',
//             slidesPerView: 1,
//             slidesPerGroup: 1,
//             loop: true,
//             navigation: {
//               prevEl: "#arrowUP",
//               nextEl: "#arrowDown"
//             },
//             autoplay: {
//               delay: 2500,
//               disableOnInteraction: false,
//               pauseOnMouseEnter: true
//             },
//           });
//         }, 200);
//       });
//     });
//   }
// }
