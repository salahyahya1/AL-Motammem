import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, Inject, NgZone, PLATFORM_ID, ViewChild } from '@angular/core';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import InertiaPlugin from "gsap/InertiaPlugin";

import SplitText from "gsap/SplitText";
import { OverlayModule } from "@angular/cdk/overlay";
import { TranslatePipe } from '@ngx-translate/core';

gsap.registerPlugin(ScrollTrigger, SplitText, InertiaPlugin);
@Component({
  selector: 'app-product-section6',
  imports: [OverlayModule, TranslatePipe],
  templateUrl: './product-section6.component.html',
  styleUrl: './product-section6.component.scss'
})
export class ProductSection6Component {
  isBrowser = false;
  productSection6Title1Split!: SplitText;
  productSection6Title2Split!: SplitText;
  productSection6FooterSplit!: SplitText;
  productSection6SubtitleSplit!: SplitText;
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef
  ) {
  }

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const video = document.querySelector('#videoElement2') as HTMLVideoElement | null;
    if (video) {
      gsap.set(video, { autoAlpha: 0 }); // autoAlpha = opacity + visibility
      gsap.to(video, { autoAlpha: 1, duration: 0.2, ease: 'power2.out' });
    } else {
      console.log("notloaded");

    }
    this.initMainSwiper();
  }

  private initMainSwiper(): void {
    this.ngZone.runOutsideAngular(() => {
      requestAnimationFrame(() => {
        setTimeout(() => {
          let mm = gsap.matchMedia();

          const productSection6Title1 = document.getElementById('productSection6Title1');
          const productSection6Title2 = document.getElementById('productSection6Title2');
          const productSection6Footer = document.getElementById('productSection6Footer');
          const productSection6Subtitle = document.getElementById('productSection6SubTitle');

          if (!productSection6Title1 || !productSection6Title2 || !productSection6Footer || !productSection6Subtitle) {
            console.warn('⚠️ عناصر الـ hero مش لاقيها SplitText');
            return;
          }

          mm.add({
            desktop: '(min-width: 768px)',
            mobile: '(max-width: 767px)',
          }, (context) => {
            let { desktop, mobile } = context.conditions as any;

            this.productSection6Title1Split = new SplitText(productSection6Title1, { type: 'words' });
            this.productSection6Title2Split = new SplitText(productSection6Title2, { type: 'words' });
            this.productSection6FooterSplit = new SplitText(productSection6Footer, { type: 'words' });
            this.productSection6SubtitleSplit = new SplitText(productSection6Subtitle, { type: 'words' });

            ScrollTrigger.create({
              trigger: '#productSection6',
              start: 'top top',
              end: mobile ? 'top 95%' : "150% bottom",
              pin: true,
              pinType: 'transform',
              id: 'pinsection',
              anticipatePin: 1,
              onLeave: () => { if (mobile) tl.progress(1); },
              // onEnterBack: () => { if (mobile) tl.progress(0); },
            });

            const tl = gsap.timeline({
              defaults: { ease: "power3.out" }, scrollTrigger: {
                trigger: "#productSection6",
                start: 'top top',
                end: "bottom bottom",
              }
            });

            tl.fromTo(this.productSection6Title1Split.words,
              { opacity: 0, visibility: "visible" },
              {
                opacity: 1,
                duration: 0.2,
                ease: "sine.out",
                stagger: 0.02,
                onStart: () => { gsap.set(productSection6Title1, { opacity: 1, visibility: "visible" }) },
              }
            );
            tl.fromTo(this.productSection6Title2Split.words,
              { opacity: 0, visibility: "visible" },
              {
                opacity: 1,
                duration: 0.2,
                ease: "sine.out",
                stagger: 0.02,
                onStart: () => { gsap.set(productSection6Title2, { opacity: 1, visibility: "visible" }) },
              }
            );
            tl.fromTo(this.productSection6SubtitleSplit.words,
              { opacity: 0, visibility: "visible" },
              {
                opacity: 1,
                duration: 0.2,
                ease: "sine.out",
                stagger: 0.02,
                onStart: () => { gsap.set(productSection6Subtitle, { opacity: 1, visibility: "visible" }) },
              }
            );
            tl.fromTo("#productSection6-icons", { opacity: 0, visibility: "hidden" }, { opacity: 1, visibility: "visible", duration: 0.2 });
            tl.fromTo(this.productSection6FooterSplit.words,
              { opacity: 0, visibility: "visible" },
              {
                opacity: 1,
                duration: 0.2,
                ease: "sine.out",
                stagger: 0.02,
                onStart: () => { gsap.set(productSection6Footer, { opacity: 1, visibility: "visible" }) },
              }
            );

            return () => {
              if (this.productSection6Title1Split) this.productSection6Title1Split.revert();
              if (this.productSection6Title2Split) this.productSection6Title2Split.revert();
              if (this.productSection6FooterSplit) this.productSection6FooterSplit.revert();
              if (this.productSection6SubtitleSplit) this.productSection6SubtitleSplit.revert();
            };
          });

        }, 200);
      });
    });
  }
}
