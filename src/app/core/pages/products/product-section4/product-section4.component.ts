import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, Inject, NgZone, PLATFORM_ID, ViewChild } from '@angular/core';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import InertiaPlugin from "gsap/InertiaPlugin";

import SplitText from "gsap/SplitText";
import { TranslatePipe } from '@ngx-translate/core';

gsap.registerPlugin(ScrollTrigger, SplitText, InertiaPlugin);
@Component({
  selector: 'app-product-section4',
  imports: [TranslatePipe],
  templateUrl: './product-section4.component.html',
  styleUrl: './product-section4.component.scss'
})
export class ProductSection4Component {
  isBrowser = false;
  productSection4TitleSplit!: SplitText;
  productSection4SubtitleSplit!: SplitText;
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef
  ) {
  }

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    requestAnimationFrame(() => {
      this.ngZone.runOutsideAngular(() => {
        setTimeout(() => {
          this.initMainSwiper();
        }, 200);
      });
    });
  }

  private initMainSwiper(): void {
    document.fonts.ready.then(() => {
      const SECTION4_END = "150% bottom";
      ScrollTrigger.create({
        trigger: '#productSection4',
        start: 'top top',
        end: SECTION4_END,
        pin: true,
        pinType: 'transform',
        id: 'pinsection',
        anticipatePin: 1,
        // invalidateOnRefresh: true,
      });
      const productSection4Title = document.getElementById('productSection4Title');
      const productSection4Subtitle = document.getElementById('productSection4SubTitle');

      if (!productSection4Title || !productSection4Subtitle) {
        console.warn('⚠️ عناصر الـ hero مش لاقيها SplitText');
        return;
      }
      this.productSection4TitleSplit = new SplitText(productSection4Title, { type: 'words' });
      this.productSection4SubtitleSplit = new SplitText(productSection4Subtitle, { type: 'words' });

      const tl = gsap.timeline({
        defaults: { ease: "power3.out" }, scrollTrigger: {
          trigger: "#productSection4",
          start: 'top top',
          end: SECTION4_END,
        }
      });



      tl.fromTo(this.productSection4TitleSplit.words,
        { opacity: 0, visibility: "visible" },
        {
          opacity: 1,
          duration: 0.4,
          ease: "sine.out",
          stagger: 0.02,
          onStart: () => { gsap.set(productSection4Title, { opacity: 1, visibility: "visible" }) },
        }
      );
      tl.fromTo(this.productSection4SubtitleSplit.words,
        { opacity: 0, visibility: "visible" },
        {
          opacity: 1,
          duration: 0.4,
          ease: "sine.out",
          stagger: 0.02,
          onStart: () => { gsap.set(productSection4Subtitle, { opacity: 1, visibility: "visible" }) },
        }
      );
      tl.fromTo("#productSection4-icons", { opacity: 0, visibility: "hidden" }, { opacity: 1, visibility: "visible", duration: 0.8 });
    });


  }
}
