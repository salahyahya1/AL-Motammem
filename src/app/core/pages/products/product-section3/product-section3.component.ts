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
  productsection3TitleSplit: any;
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
          // gsap.set("#productsection3", { willChange: "transform, opacity" });
          const section = document.querySelector('#productsection3') as HTMLElement;
          const img = document.getElementById('productsection3-img') as HTMLVideoElement;
          const productsection3Title = document.querySelector('h1#productsection3-title') as HTMLElement;
          const productsection3Subtitle1 = document.querySelector('#productsection3-title2-p1') as HTMLElement;
          const productsection3Subtitle2 = document.querySelector('#productsection3-title2-p2') as HTMLElement;
          const productsection3Subtitle3 = document.querySelector('#productsection3-title2-p3') as HTMLElement;

          if (!productsection3Title || !productsection3Subtitle1 || !productsection3Subtitle2 || !productsection3Subtitle3) {
            console.warn('⚠️ عناصر الـ hero مش لاقيها SplitText');
            return;
          }
          const tl = gsap.timeline({
            defaults: { ease: "power3.out" }, scrollTrigger: {
              trigger: "#productsection3",
              start: 'top top',
              end: "bottom bottom",
            }
          });

          // this.productsection3TitleSplit = new SplitText(productsection3Title, { type: "words" });
          // this.productsection3SubtitleSplit1 = new SplitText(productsection3Subtitle1, { type: "words" });
          // this.productsection3SubtitleSplit2 = new SplitText(productsection3Subtitle2, { type: "words" });
          // this.productsection3SubtitleSplit3 = new SplitText(productsection3Subtitle3, { type: "words" });
          tl.fromTo(productsection3Title, { opacity: 0, y: 50, visibility: "hidden" }, { opacity: 1, y: 0, visibility: "visible", duration: 0.8 }, 0);
          tl.fromTo(productsection3Subtitle1, { opacity: 0, y: 50, visibility: "hidden" }, { opacity: 1, y: 0, visibility: "visible", duration: 0.8 }, 0.2);
          tl.fromTo(productsection3Subtitle2, { opacity: 0, y: 50, visibility: "hidden" }, { opacity: 1, y: 0, visibility: "visible", duration: 0.8 }, 0.4);
          tl.fromTo(productsection3Subtitle3, { opacity: 0, y: 50, visibility: "hidden" }, { opacity: 1, y: 0, visibility: "visible", duration: 0.8 }, 0.6);
          ScrollTrigger.create({
            trigger: section,
            start: 'top top',
            end: "150% bottom",
            pin: true,
            anticipatePin: 1,
            id: 'pinsection',
            animation: tl,
            onEnter: () => {
              gsap.to(section, { backgroundColor: "transparent", duration: 0.5, ease: "sine.out" });
              gsap.to(img, { opacity: "1", duration: 0.5, ease: "sine.out" });
            },
          })

          this.timeline = tl

        }, 200);
      });
    });

  }
}
