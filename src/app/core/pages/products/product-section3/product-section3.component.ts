import { isPlatformBrowser } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, Inject, NgZone, PLATFORM_ID, ViewChild } from '@angular/core';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import InertiaPlugin from "gsap/InertiaPlugin";

import SplitText from "gsap/SplitText";
import { LanguageService } from '../../../shared/services/language.service';
import { TranslatePipe } from '@ngx-translate/core';

gsap.registerPlugin(ScrollTrigger, SplitText, InertiaPlugin);
@Component({
  selector: 'app-product-section3',
  imports: [TranslatePipe],
  templateUrl: './product-section3.component.html',
  styleUrl: './product-section3.component.scss'
})
export class ProductSection3Component {
  isBrowser = false;
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private ngZone: NgZone,
    private language: LanguageService,
  ) { }
  timeline!: gsap.core.Timeline
  productsection3Title1Split: any;
  productsection3Title2Split: any;
  productsection3SubtitleSplit1: any;
  productsection3SubtitleSplit2: any;
  productsection3SubtitleSplit3: any;
  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    this.initMainSwiper();
  }

  private initMainSwiper(): void {
    this.ngZone.runOutsideAngular(() => {
      requestAnimationFrame(() => {
        setTimeout(() => {
          let mm = gsap.matchMedia();
          const section = document.querySelector('#productsection3') as HTMLElement;
          const img = document.getElementById('productsection3-img') as HTMLVideoElement;
          const productsection3Title1 = document.querySelector('h1#productsection3-title1') as HTMLElement;
          const productsection3Title2 = document.querySelector('h2#productsection3-title2') as HTMLElement;
          const productsection3Subtitle1 = document.querySelector('#productsection3-title2-p1') as HTMLElement;
          const productsection3Subtitle2 = document.querySelector('#productsection3-title2-p2') as HTMLElement;
          const productsection3Subtitle3 = document.querySelector('#productsection3-title2-p3') as HTMLElement;

          if (!productsection3Title1 || !productsection3Title2 || !productsection3Subtitle1 || !productsection3Subtitle2 || !productsection3Subtitle3) {
            console.warn('⚠️ عناصر الـ hero مش لاقيها SplitText');
            return;
          }

          mm.add({
            desktop: '(min-width: 768px)',
            mobile: '(max-width: 767px)',
          }, (context) => {
            let { desktop, mobile } = context.conditions as any;

            const tl = gsap.timeline({
              defaults: { ease: "power3.out" }, scrollTrigger: {
                trigger: "#productsection3",
                start: 'top top',
                end: mobile ? 'top 95%' : "bottom bottom", // Match previous logic or keep consistent
              }
            });

            // Lighter animation for mobile (reduced distance)
            const yOffset = mobile ? 30 : 50;

            tl.fromTo(productsection3Title1, { opacity: 0, y: yOffset, visibility: "hidden" }, { opacity: 1, y: 0, visibility: "visible", duration: 0.8 }, 0);
            tl.fromTo(productsection3Title2, { opacity: 0, y: yOffset, visibility: "hidden" }, { opacity: 1, y: 0, visibility: "visible", duration: 0.8 }, 0);
            tl.fromTo(productsection3Subtitle1, { opacity: 0, y: yOffset, visibility: "hidden" }, { opacity: 1, y: 0, visibility: "visible", duration: 0.8 }, 0.2);
            tl.fromTo(productsection3Subtitle2, { opacity: 0, y: yOffset, visibility: "hidden" }, { opacity: 1, y: 0, visibility: "visible", duration: 0.8 }, 0.4);
            tl.fromTo(productsection3Subtitle3, { opacity: 0, y: yOffset, visibility: "hidden" }, { opacity: 1, y: 0, visibility: "visible", duration: 0.8 }, 0.6);

            ScrollTrigger.create({
              trigger: section,
              start: 'top top',
              end: mobile ? 'top 95%' : "150% bottom",
              pin: true,
              pinType: 'transform',
              anticipatePin: 1,
              id: 'pinsection',
              animation: tl,
              onEnter: () => {
                gsap.to(section, { backgroundColor: "transparent", duration: 0.2, ease: "sine.out" });
                gsap.to(img, { opacity: "1", duration: 0.2, ease: "sine.out" });
              },
              onLeave: () => { if (mobile) tl.progress(1); },
              // onEnterBack: () => { if (mobile) tl.progress(0); },
            });

            this.timeline = tl;

            return () => {
              if (this.timeline) this.timeline.kill();
            };
          });

        }, 200);
      });
    });

  }
}
