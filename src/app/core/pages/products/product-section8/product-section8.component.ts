import { isPlatformBrowser } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, Inject, NgZone, PLATFORM_ID, ViewChild } from '@angular/core';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import InertiaPlugin from "gsap/InertiaPlugin";

import SplitText from "gsap/SplitText";
import { LanguageService } from '../../../shared/services/language.service';
import { TranslatePipe } from '@ngx-translate/core';
@Component({
  selector: 'app-product-section8',
  imports: [TranslatePipe],
  templateUrl: './product-section8.component.html',
  styleUrl: './product-section8.component.scss'
})
export class ProductSection8Component {
  isBrowser = false;
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private ngZone: NgZone,
    private language: LanguageService,
  ) { }
  timeline!: gsap.core.Timeline
  productSection8TitleSplit: any;
  productSection8ListSplit: any;
  productSection8FooterSplit: any;

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    this.initMainSwiper();
  }

  private initMainSwiper(): void {
    this.ngZone.runOutsideAngular(() => {
      requestAnimationFrame(() => {
        document.fonts.ready.then(() => {
          let mm = gsap.matchMedia();

          const section = document.querySelector('#productSection8') as HTMLElement;
          const img = document.getElementById('productSection8-img') as HTMLVideoElement;
          const productSection8Title = document.querySelector('#productSection8-title') as HTMLElement;
          const productSection8List = document.querySelector('#productSection8-list') as HTMLElement;
          const productSection8Footer = document.querySelector('#productSection8-footer') as HTMLElement;

          if (!productSection8Title || !productSection8List || !productSection8Footer) {
            console.warn('⚠️ عناصر الـ productSection8 مش لاقيها SplitText');
            return;
          }

          mm.add({
            desktop: '(min-width: 768px)',
            mobile: '(max-width: 767px)',
          }, (context) => {
            let { desktop, mobile } = context.conditions as any;

            this.productSection8TitleSplit = new SplitText(productSection8Title, { type: "words" });
            this.productSection8ListSplit = new SplitText(productSection8List, { type: "lines" });
            this.productSection8FooterSplit = new SplitText(productSection8Footer, { type: "words" });

            ScrollTrigger.create({
              trigger: '#productSection8',
              start: 'top top',
              end: mobile ? 'top 95%' : "140% bottom",
              pin: true,
              pinType: 'transform',
              id: 'pinsection',
              anticipatePin: 1,
              onLeave: () => { if (mobile) tl.progress(1); },
              // onEnterBack: () => { if (mobile) tl.progress(0); },
            });

            const tl = gsap.timeline({
              defaults: { ease: 'power3.out' },
              scrollTrigger: {
                trigger: '#productSection8',
                start: 'top top',
                end: mobile ? 'top 95%' : "bottom bottom",
              },
            });

            tl.fromTo(this.productSection8TitleSplit.words,
              { opacity: 0, visibility: 'visible' },
              {
                opacity: 1,
                duration: 0.4,
                ease: 'sine.out',
                stagger: 0.02,
                onStart: () => { gsap.set(productSection8Title, { opacity: 1, visibility: "visible" }) },
              }
            );

            // For list, reduce stagger on mobile
            tl.fromTo(this.productSection8ListSplit.lines,
              { opacity: 0, visibility: "visible" },
              {
                opacity: 1,
                duration: 0.4,
                ease: "sine.out",
                stagger: mobile ? 0.02 : 0.05,
                onStart: () => { gsap.set("#productSection8-list li", { opacity: 1, visibility: "visible" }) },
              }
            );
            tl.fromTo(this.productSection8FooterSplit.words,
              { opacity: 0, visibility: "visible" },
              {
                opacity: 1,
                duration: 0.4,
                ease: "sine.out",
                stagger: 0.02,
                onStart: () => { gsap.set(productSection8Footer, { opacity: 1, visibility: "visible" }) },
              }
            );

            tl.to(section, { backgroundColor: "transparent", duration: 0.3, ease: "sine.out" });
            tl.to(img, { opacity: "1", duration: 0.3, ease: "sine.out" });

            this.timeline = tl;

            return () => {
              if (this.productSection8TitleSplit) this.productSection8TitleSplit.revert();
              if (this.productSection8ListSplit) this.productSection8ListSplit.revert();
              if (this.productSection8FooterSplit) this.productSection8FooterSplit.revert();
            }
          });
        });
      });
    });
  }
}
