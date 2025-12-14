import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, NgZone, PLATFORM_ID } from '@angular/core';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import SplitText from "gsap/SplitText";
gsap.registerPlugin(ScrollTrigger, SplitText);
import { TranslatePipe } from '@ngx-translate/core';
@Component({
  selector: 'app-product-section5',
  imports: [TranslatePipe],
  templateUrl: './product-section5.component.html',
  styleUrl: './product-section5.component.scss'
})
export class ProductSection5Component {
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private ngZone: NgZone,
  ) { }
  productSection5Title1Split: any;
  productSection5Title2Split: any;
  productSection5SubtitleSplit: any;
  productSection5DetailsSplit: any;
  productSection5ListSplit: any;
  productSection5FooterSplit: any;
  ngAfterViewInit() {
    if (typeof window === 'undefined') return;
    if (!isPlatformBrowser(this.platformId)) return;
    requestAnimationFrame(() => {
      this.ngZone.runOutsideAngular(() => {
        setTimeout(() => {
          this.runGsapAnimation();
        }, 500);
      });
    });
  }
  private runGsapAnimation() {

    document.fonts.ready.then(() => {
      const productSection5Title1 = document.querySelector('#productSection5-title1') as HTMLElement;
      const productSection5Title2 = document.querySelector('#productSection5-title2') as HTMLElement;
      const productSection5Subtitle = document.querySelector('#productSection5-subtitle') as HTMLElement;
      const productSection5Details = document.querySelector('#productSection5-details') as HTMLElement;
      const productSection5List = document.querySelector('#productSection5-list') as HTMLElement;
      const productSection5Footer = document.querySelector('#productSection5-footer') as HTMLElement;
      const productSection5imgtop = document.querySelector('#productSection5-img-top') as HTMLElement;
      const productSection5imgbottom = document.querySelector('#productSection5-img-bottom') as HTMLElement;
      if (!productSection5Title1 || !productSection5Title2 || !productSection5Subtitle || !productSection5Details || !productSection5List || !productSection5Footer || !productSection5imgtop || !productSection5imgbottom) {
        console.warn('⚠️ عناصر الـ productSection5 مش لاقيها SplitText');
        return;
      }

      this.productSection5Title1Split = new SplitText(productSection5Title1, { type: "words" });
      this.productSection5Title2Split = new SplitText(productSection5Title2, { type: "words" });
      this.productSection5SubtitleSplit = new SplitText(productSection5Subtitle, { type: "words" });
      this.productSection5DetailsSplit = new SplitText(productSection5Details, { type: "words" });
      this.productSection5ListSplit = new SplitText(productSection5List, { type: "lines" });
      this.productSection5FooterSplit = new SplitText(productSection5Footer, { type: "words" });
      ScrollTrigger.create({
        trigger: '#productSection5',
        start: 'top top',
        end: "150% bottom",
        pin: true,
        pinType: 'transform',
        id: 'pinsection',
        anticipatePin: 1,
      });
      const tl = gsap.timeline({
        defaults: { ease: 'power3.out' },
        scrollTrigger: {
          trigger: '#productSection5',
          start: 'top top',
          end: "bottom bottom",
        },
      });

      tl.fromTo(this.productSection5Title1Split.words,
        { opacity: 0, visibility: "visible" },
        {
          opacity: 1,
          duration: 0.4,
          ease: "sine.out",
          stagger: 0.02,
          onStart: () => { gsap.set(productSection5Title1, { opacity: 1, visibility: "visible" }) },
        }
      );
      tl.fromTo(this.productSection5Title2Split.words,
        { opacity: 0, visibility: "visible" },
        {
          opacity: 1,
          duration: 0.4,
          ease: "sine.out",
          stagger: 0.02,
          onStart: () => { gsap.set(productSection5Title2, { opacity: 1, visibility: "visible" }) },
        }
      );
      tl.fromTo(this.productSection5SubtitleSplit.words,
        { opacity: 0, visibility: "visible" },
        {
          opacity: 1,
          duration: 0.4,
          ease: "sine.out",
          stagger: 0.02,
          onStart: () => { gsap.set(productSection5Subtitle, { opacity: 1, visibility: "visible" }) },
        }
      );
      tl.fromTo(productSection5imgbottom, {
        opacity: 0,
        visibility: "hidden",
      }, {
        opacity: 1,
        visibility: "visible",
        duration: 0.8,
        ease: "sine.out",
      });
      tl.fromTo(this.productSection5DetailsSplit.words,
        { opacity: 0, visibility: "visible" },
        {
          opacity: 1,
          duration: 0.4,
          ease: "sine.out",
          stagger: 0.02,
          onStart: () => { gsap.set(productSection5Details, { opacity: 1, visibility: "visible" }) },
        }
      );
      tl.fromTo(this.productSection5ListSplit.lines,
        { opacity: 0, visibility: "visible" },
        {
          opacity: 1,
          duration: 0.4,
          ease: "sine.out",
          stagger: 0.05,
          onStart: () => { gsap.set(productSection5List, { opacity: 1, visibility: "visible" }) },
        }
      );
      tl.fromTo(this.productSection5FooterSplit.words,
        { opacity: 0, visibility: "visible" },
        {
          opacity: 1,
          duration: 0.4,
          ease: "sine.out",
          stagger: 0.02,
          onStart: () => { gsap.set(productSection5Footer, { opacity: 1, visibility: "visible" }) },
        }
      );

    });
  }
}
