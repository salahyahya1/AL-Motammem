import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, Inject, NgZone, PLATFORM_ID, ViewChild } from '@angular/core';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import InertiaPlugin from "gsap/InertiaPlugin";

import SplitText from "gsap/SplitText";


gsap.registerPlugin(ScrollTrigger, SplitText, InertiaPlugin);
@Component({
  selector: 'app-product-section6',
  imports: [],
  templateUrl: './product-section6.component.html',
  styleUrl: './product-section6.component.scss'
})
export class ProductSection6Component {
  isBrowser = false;
  productSection6TitleSplit!: SplitText;
  productSection6SubtitleSplit!: SplitText;
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef
  ) {
  }

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    this.initMainSwiper();
  }

  private initMainSwiper(): void {
    this.ngZone.runOutsideAngular(() => {
      requestAnimationFrame(() => {
        setTimeout(() => {

          ScrollTrigger.create({
            trigger: '#productSection6',
            start: 'top top',
            end: "150% bottom",
            pin: true,
            pinType: 'transform',
            id: 'pinsection',
            anticipatePin: 1,
          });
          const productSection6Title = document.getElementById('productSection6Title');
          const productSection6Subtitle = document.getElementById('productSection6SubTitle');

          if (!productSection6Title || !productSection6Subtitle) {
            console.warn('⚠️ عناصر الـ hero مش لاقيها SplitText');
            return;
          }
          this.productSection6TitleSplit = new SplitText(productSection6Title, { type: 'words' });
          this.productSection6SubtitleSplit = new SplitText(productSection6Subtitle, { type: 'words' });

          const tl = gsap.timeline({
            defaults: { ease: "power3.out" }, scrollTrigger: {
              trigger: "#productSection6",
              start: 'top top',
              end: "bottom bottom",
            }
          });



          tl.fromTo(this.productSection6TitleSplit.words,
            { opacity: 0, visibility: "visible" },
            {
              opacity: 1,
              duration: 0.4,
              ease: "sine.out",
              stagger: 0.02,
              onStart: () => { gsap.set(productSection6Title, { opacity: 1, visibility: "visible" }) },
            }
          );
          tl.fromTo(this.productSection6SubtitleSplit.words,
            { opacity: 0, visibility: "visible" },
            {
              opacity: 1,
              duration: 0.4,
              ease: "sine.out",
              stagger: 0.02,
              onStart: () => { gsap.set(productSection6Subtitle, { opacity: 1, visibility: "visible" }) },
            }
          );
          tl.fromTo("#productSection6-icons", { opacity: 0, visibility: "hidden" }, { opacity: 1, visibility: "visible", duration: 0.8 });

        }, 200);
      });
    });

  }
}
